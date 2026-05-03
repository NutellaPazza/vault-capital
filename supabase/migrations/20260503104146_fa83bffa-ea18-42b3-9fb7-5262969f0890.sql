
-- Lock down SECURITY DEFINER functions
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.update_updated_at_column() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.has_role(UUID, public.app_role) FROM PUBLIC, anon;
-- has_role must remain callable by authenticated (used inside RLS policies of authenticated users)
GRANT EXECUTE ON FUNCTION public.has_role(UUID, public.app_role) TO authenticated;

-- Replace overly permissive INSERT policy on startup_applications
DROP POLICY IF EXISTS "apps_insert_public" ON public.startup_applications;
CREATE POLICY "apps_insert_public_validated" ON public.startup_applications
  FOR INSERT TO anon, authenticated
  WITH CHECK (
    length(trim(startup_name)) > 1
    AND length(trim(contact_email)) > 4
    AND contact_email LIKE '%@%.%'
    AND length(trim(country)) > 1
    AND length(trim(industry)) > 1
    AND length(trim(deck_url)) > 4
    AND length(trim(pitch_summary)) > 10
    AND status = 'submitted'
  );
