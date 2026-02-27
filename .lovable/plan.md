

# Exit Objectives & Distribution Overhaul

## Analisi del feedback

Il feedback è corretto e importante. Il sistema attuale implica che VaultCapital vende automaticamente quando c'è un exit event. In realtà, ogni vault ha obiettivi di exit specifici (target return, finestre temporali, trigger basati su metriche) e VaultCapital decide se vendere, vendere parzialmente o tenere in base a quelli. Questo va riflesso sia nella pagina /how-it-works sia nelle pagine dei singoli vault.

## Cosa cambia

### 1. `/how-it-works`: Step 5 "Exit & Distribution" diventa "Exit objectives & distribution"

**Testo attuale (problematico):**
"When the startup has an exit event... VaultCapital manages the entire process."

**Nuovo testo (3 paragrafi brevi):**
- Ogni vault include obiettivi di exit, definiti da VaultCapital in base alla startup, allo stage e al mercato. Questi obiettivi spiegano cosa puntiamo a raggiungere (esempi: target return multiple, milestone di crescita del fatturato, soglia di valutazione).
- Gli exit event (acquisizione, IPO, o opportunità di vendita secondaria) possono creare liquidità, ma non vendiamo automaticamente. Agiamo in base agli obiettivi del vault e alla miglior esecuzione disponibile al momento.
- Quando una vendita avviene, i proventi vengono distribuiti pro rata agli investitori al netto delle fee (il carry si applica solo sul profitto).

**Disclaimer sotto:** "Objectives are targets, not guarantees."

### 2. `/how-it-works`: Riscrittura completa "Exit Process Step by Step"

I 5 step attuali vengono sostituiti con una versione basata sugli obiettivi:

| Step | Titolo | Testo |
|------|--------|-------|
| 1 | A liquidity opportunity appears | An acquisition, IPO, or a secondary sale opportunity may create liquidity. |
| 2 | We check the vault's exit objectives | We compare the opportunity to the vault's objectives and current market conditions. We may sell, sell partially, or hold. |
| 3 | Execution and settlement | If we proceed, the SPV completes the transaction and receives proceeds. |
| 4 | Carry fee (profit only) | If proceeds exceed invested capital, a 2% carry is applied on profit only. If there's no profit, no carry is charged. |
| 5 | Distribution to investors | Net proceeds are distributed pro rata to investors' wallets. A transaction summary is shown in the vault and wallet history. |

**Riga finale:** "If no liquidity event occurs, the position remains illiquid until an opportunity is available."

### 3. Pagina vault detail (`PoolDetailPage.tsx`): Nuova sezione "Exit Objectives"

Aggiungere una nuova Card nella tab "Terms" (dopo la sezione Dividend & Governance) con:

**Titolo:** "Exit Objectives"

**Contenuto:** Una lista di obiettivi mock (stile bullet con icone), diversi per ogni deal:

Per TechFlow SaaS (deal 1):
- Target return: 3.0x
- Preferred window: 24 to 60 months
- Trigger: revenue growth of 4x or more
- Trigger: qualified secondary sale at or above current valuation
- Trigger: acquisition offer above €30M

Per GreenLogix (deal 2):
- Target return: 4.0x
- Preferred window: 36 to 72 months
- Trigger: fleet expansion to 500+ vehicles
- Trigger: Series B at 3x or higher valuation

Per FinLedger (deal 3):
- Target return: 5.0x
- Preferred window: 36 to 60 months
- Trigger: regulated status obtained in 2+ EU markets
- Trigger: acquisition offer from established financial institution

**Micro nota sotto:** "VaultCapital may deviate if market conditions change."

### 4. Aggiornare la sezione "Exit" nel box Dividend & Governance (PoolDetailPage)

Il testo attuale dice: "Exit timing and execution are decided by VaultCapital."

Va cambiato in: "Exit timing and execution follow the vault's exit objectives. VaultCapital may deviate if market conditions change. Proceeds are distributed pro rata based on your ownership percentage of the SPV."

### 5. FAQ nella pagina vault detail

Aggiornare la FAQ "Can I sell my position before an exit?" per usare "resale board" invece di "secondary marketplace".

### 6. Terminologia: "secondary marketplace" diventa "resale board"

Nella pagina /how-it-works ci sono ancora riferimenti a "secondary marketplace" (step 4 "Ownership & Monitoring" dice "list it on the secondary marketplace for liquidity"). Va cambiato in "resale board" e rimosso "for liquidity".

Anche nella fee structure, "Marketplace Fee" va descritto come "Applied on resale board transactions" invece di "Applied on secondary market transactions".

### 7. Dati mock: aggiungere `exit_objectives` ai deal

Aggiungere un campo `exit_objectives` all'interfaccia `StartupDeal` in `types/index.ts` e popolare i mock data per i 3 deal.

**Nuovo tipo:**
```text
interface ExitObjective {
  label: string
  value: string
}
```

Aggiunto come `exit_objectives: ExitObjective[]` in `StartupDeal`.

---

## File da modificare

| File | Modifiche |
|------|-----------|
| `src/pages/HowItWorksPage.tsx` | Step 5 riscritto, Exit Process riscritto, terminologia "resale board", rimozione "maximizing returns" / "always prioritizing" |
| `src/pages/PoolDetailPage.tsx` | Nuova card "Exit Objectives" nella tab Terms, aggiornamento box Governance, FAQ aggiornata con "resale board" |
| `src/types/index.ts` | Aggiunta interfaccia `ExitObjective` e campo `exit_objectives` a `StartupDeal` |
| `src/data/mockData.ts` | Aggiunta dati mock `exit_objectives` per ogni deal |

Nessuna nuova dipendenza. Solo copy, tipi e dati mock.
