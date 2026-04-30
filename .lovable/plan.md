# Forgot password: limite tentativi, cooldown resend, test

## 1. Aggiornamento `src/components/common/ForgotPasswordModal.tsx`

### Nuovi stati nello Step 2
- `attemptsLeft` (default 5) — tentativi rimanenti per il codice
- `locked` — true quando i tentativi finiscono
- `resendCooldown` (secondi) — countdown per "Resend code"
- `cooldownIntervalRef` — `useRef` per gestire l'`setInterval` e pulirlo

### Costanti esportate (utili anche ai test)
- `MAX_CODE_ATTEMPTS = 5`
- `RESEND_COOLDOWN_SECONDS = 30`

### Logica
- All'invio iniziale dell'email (`handleSendEmail`) e ad ogni "Resend": genera nuovo codice, resetta `attemptsLeft = MAX_CODE_ATTEMPTS`, svuota l'input e fa partire `startCooldown()` (interval 1s che decrementa fino a 0 e si auto-pulisce).
- `handleVerifyCode`: se codice errato, decrementa `attemptsLeft`. Se arriva a 0 imposta `locked = true` e mostra toast "Too many attempts". Altrimenti toast "Invalid code. N attempts remaining".
- `handleResendCode`: bloccato se `resendCooldown > 0` o `locked`. Resetta tentativi, genera nuovo codice, riavvia cooldown.
- `handleStartOver`: torna allo Step 1, sblocca, azzera tentativi e cooldown.
- Cleanup: `useEffect` di unmount + reset all'apertura del modal cancellano l'interval.

### UI Step 2
- Sotto l'input codice, riga con due elementi:
  - sinistra: `"{attemptsLeft} of 5 attempts remaining"` (testid `attempts-left`)
  - destra: bottone "Resend code" che diventa `"Resend code in Ns"` quando in cooldown (disabled, testid `resend-button`)
- Quando `locked = true`: l'input e il bottone "Verify" vengono nascosti, sostituiti da un alert rosso "Too many attempts" e dal bottone "Start over" (variant destructive) al posto di "Verify".
- Bottone "Back" resta sempre visibile.

## 2. Nuovo file di test `src/components/common/ForgotPasswordModal.test.tsx`

Mock di `@/hooks/use-toast` con `vi.mock` per intercettare i toast:
```ts
vi.mock('@/hooks/use-toast', () => ({ toast: vi.fn() }));
```

Setup comune: helper `renderModal()` che monta `<ForgotPasswordModal open onOpenChange={vi.fn()} defaultEmail="" />`.
Uso `vi.useFakeTimers()` per controllare i `setTimeout` (delay simulato di `handleSendEmail` 500ms, `handleResendCode` 300ms, `handleResetPassword` 400ms) e l'`setInterval` del cooldown. Per gli aggiornamenti async uso `act(async () => { vi.advanceTimersByTime(...) })`.

### Test cases
1. **Invalid email** — inserisco `"not-an-email"`, click "Send reset code". Verifico che `toast` sia chiamato con `{ title: 'Invalid email', variant: 'destructive' }` e che siamo ancora allo Step 1 (titolo "Reset your password" presente).

2. **Codice errato decrementa tentativi e mostra toast** — invio email valida, avanzo timer di 500ms, leggo il codice mock dal DOM (elemento con classe `font-mono` o regex `/^\d{6}$/`). Inserisco un codice errato (es. `"000000"` o codice corretto +1 mod), click Verify. Verifico:
   - toast chiamato con titolo `'Invalid code'`
   - testo `"4 of 5 attempts remaining"` visibile

3. **Lockout dopo 5 tentativi** — ripeto 5 volte l'inserimento di un codice errato. Verifico:
   - ultimo toast con titolo `'Too many attempts'`
   - alert "Too many attempts" visibile
   - bottone "Start over" presente, "Verify" assente

4. **Resend code rispetta il cooldown** — dopo l'invio iniziale, verifico che il bottone resend sia disabled e mostri `"Resend code in 30s"`. Avanzo i timer di 30s, verifico che diventi `"Resend code"` ed enabled. Click resend, verifico che `attemptsLeft` torni a 5 e il cooldown riparta.

5. **Password debole blocca lo Step 3** — eseguo il flusso fino allo Step 3 con codice corretto. Inserisco password `"weak"`. Verifico che il bottone "Update password" sia disabled e che gli item della checklist mostrino X.

6. **Password forte completa il flusso** — Step 3 con `"Strong1!aB"`. Verifico bottone enabled, click "Update password", advance timer 400ms, verifico stato finale: titolo "Password updated" e toast `{ title: 'Password updated' }`.

### Tecniche
- Per leggere il codice mock generato: `screen.getByText(/^\d{6}$/)`.
- Per inserire un codice errato deterministicamente: prendo il codice corretto, rimpiazzo la prima cifra con `(parseInt(d) + 1) % 10` per garantire che sia diverso.
- Uso `fireEvent.change` su input, `fireEvent.click` su bottoni (no `userEvent` non installato).
- Prima di ogni test: `vi.clearAllMocks()` e `vi.useFakeTimers()`. Dopo: `vi.useRealTimers()`.

## 3. File modificati
- `src/components/common/ForgotPasswordModal.tsx` — nuovo comportamento Step 2
- `src/components/common/ForgotPasswordModal.test.tsx` — nuovo file di test (6 test)

Nessuna modifica a setup di test, dipendenze o altri file: vitest + @testing-library/react sono già configurati.
