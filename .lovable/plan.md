## Obiettivo

Rimuovere la fee marketplace configurabile dall'admin e ripristinare il **1% hardcoded** per tutte le transazioni del Resale Board, coerente con la memoria di progetto ("1% buyer fee on Resale Board").

## Modifiche

### 1. `src/store/appStore.ts`
- Rimuovere lo state `marketplaceFeePercent` e l'azione `setMarketplaceFeePercent` dallo store (definizione, interfaccia, valore iniziale, persistenza/migrazione se presente).
- In `createListing`, ripristinare il valore hardcoded: `fee_marketplace_percent: 1` (invece di leggerlo dallo store).
- Verificare che nessun altro punto del codice faccia riferimento a `marketplaceFeePercent` / `setMarketplaceFeePercent` (usare ricerca testuale prima di rimuovere).

### 2. `src/pages/AdminPage.tsx`
- Rimuovere completamente la card "Marketplace Fee" dal tab "Pool Management".
- Rimuovere l'import `Percent` da `lucide-react` (se non più usato).
- Rimuovere lo state locale `feeInput`, l'handler `handleSaveFee` e i riferimenti a `marketplaceFeePercent` / `setMarketplaceFeePercent` nella destrutturazione di `useAppStore`.
- Rimuovere il `setFeeInput('1')` dentro `handleReset`.

### 3. Verifica
- Controllare che `MarketplacePage.tsx` e altri consumer continuino a leggere la fee dal campo `fee_marketplace_percent` della listing (che resta 1% per tutte le nuove listing).
- Le listing esistenti create durante la sessione precedente (con eventuale fee custom) restano con il loro valore storico — accettabile perché i dati di demo possono essere resettati con "Reset Demo".

## Note tecniche

- Nessun cambiamento al type `MarketplaceListing` né al campo `fee_marketplace_percent` (resta sulla listing per coerenza dello storico).
- Nessun test da aggiornare: i test esistenti riguardano `ForgotPasswordModal` e non toccano la fee.
- Nessuna modifica alla UI buyer/seller del marketplace: continua a mostrare il breakdown leggendo `fee_marketplace_percent` dalla listing.
