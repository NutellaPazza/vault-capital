
-- Atomic investment function: handles wallet debit, position creation/upsert, pool update, and transactions
CREATE OR REPLACE FUNCTION public.place_investment(_pool_id text, _amount numeric)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _user_id uuid := auth.uid();
  _pool record;
  _deal record;
  _fee numeric;
  _total numeric;
  _balance numeric;
  _ownership numeric;
  _existing_position record;
  _position_id uuid;
BEGIN
  IF _user_id IS NULL THEN
    RAISE EXCEPTION 'not_authenticated';
  END IF;
  IF _amount IS NULL OR _amount <= 0 THEN
    RAISE EXCEPTION 'invalid_amount';
  END IF;

  SELECT * INTO _pool FROM pools WHERE id = _pool_id FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'pool_not_found'; END IF;
  IF _pool.pool_status <> 'live' THEN RAISE EXCEPTION 'pool_not_live'; END IF;
  IF _pool.end_datetime <= now() THEN RAISE EXCEPTION 'pool_ended'; END IF;

  SELECT * INTO _deal FROM deals WHERE id = _pool.deal_id;

  _fee := _amount * (_pool.fee_entry_percent / 100);
  _total := _amount + _fee;

  SELECT wallet_balance_eur INTO _balance FROM profiles WHERE user_id = _user_id FOR UPDATE;
  IF _balance < _total THEN RAISE EXCEPTION 'insufficient_balance'; END IF;

  _ownership := (_amount / _pool.target_eur) * COALESCE(_deal.offer_equity_percent, 10);

  -- Debit wallet
  UPDATE profiles SET wallet_balance_eur = wallet_balance_eur - _total WHERE user_id = _user_id;

  -- Upsert position
  SELECT * INTO _existing_position FROM positions WHERE user_id = _user_id AND pool_id = _pool_id LIMIT 1;
  IF FOUND THEN
    UPDATE positions
      SET invested_eur = invested_eur + _amount,
          ownership_percent_of_spv = ownership_percent_of_spv + _ownership,
          current_estimated_value_eur = current_estimated_value_eur + _amount
      WHERE id = _existing_position.id
      RETURNING id INTO _position_id;
  ELSE
    INSERT INTO positions(user_id, pool_id, invested_eur, ownership_percent_of_spv, current_estimated_value_eur, lockup, is_listed_on_market)
      VALUES (_user_id, _pool_id, _amount, _ownership, _amount, false, false)
      RETURNING id INTO _position_id;
  END IF;

  -- Update pool
  UPDATE pools
    SET raised_eur = raised_eur + _amount,
        investors_count = investors_count + CASE WHEN _existing_position.id IS NULL THEN 1 ELSE 0 END
    WHERE id = _pool_id;

  -- Transactions
  INSERT INTO transactions(user_id, type, amount_eur, meta)
    VALUES (_user_id, 'invest', -_amount, jsonb_build_object('pool_id', _pool_id, 'notes', 'Investment in ' || COALESCE(_deal.startup_name, 'Vault')));
  INSERT INTO transactions(user_id, type, amount_eur, meta)
    VALUES (_user_id, 'fee', -_fee, jsonb_build_object('pool_id', _pool_id, 'notes', _pool.fee_entry_percent || '% entry fee'));

  RETURN jsonb_build_object('position_id', _position_id, 'amount', _amount, 'fee', _fee);
END;
$$;

REVOKE ALL ON FUNCTION public.place_investment(text, numeric) FROM public;
GRANT EXECUTE ON FUNCTION public.place_investment(text, numeric) TO authenticated;
