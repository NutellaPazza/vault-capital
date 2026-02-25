

# Refinamento Copy e Coerenza Legale

Il feedback è molto preciso e individua problemi reali di coerenza. Ecco le modifiche necessarie:

## Problema principale: Incoerenza fee

Attualmente c'è una **contraddizione critica**: la pagina /how-it-works dice che la entry fee è "deducted from your invested amount" (€1,000 → €980 nel pool), ma il Return Simulator la calcola "on top" (€500 + €10 = €510). Bisogna allineare tutto al modello "deducted from" come descritto nel /how-it-works.

---

## Modifiche per file

### 1. `src/components/landing/HeroSection.tsx`

**A) Subheadline** (riga 27-29): rimuovere "Join a community..." e rendere più secca:
- Da: "Curated deals, 72 hour vaults, SPV backed ownership. Join a community of retail investors building tomorrow's success stories."
- A: "Curated deals. 72 hour vaults. SPV held positions."

**E) Trust strip** (riga 70): cambiare "Built for EU retail investors" in "Designed for EU investors"

**Label vault card** (riga 85): cambiare "Illustrative example" in "Example vaults" con testo più piccolo e chiaro

### 2. `src/components/landing/ReturnSimulator.tsx`

**B) Allineamento fee** (righe 11-17): ricalcolare con fee deducted from investment:
- `amountInVault = investment * 0.98` (la fee viene sottratta)
- `entryFee = investment * 0.02`
- Rimuovere "Total paid" e "charged on top"
- Il gross return si calcola su `amountInVault`, non su `investment`
- Esempio: Investment €500, Entry fee €10, Amount in vault €490, Gross return = €490 × multiple

**G) Disclaimer** (riga 29-30): cambiare in "Illustration only. Returns are not guaranteed."

### 3. `src/pages/HowItWorksPage.tsx`

**C) Rimuovere "maximizing returns"** (riga 116): sostituire la frase sulle major decisions:
- Da: "Major decisions... always with the goal of maximizing returns for all investors."
- A: "Major decisions (e.g., whether to accept an acquisition offer, participate in follow on rounds, or exit) are handled by VaultCapital's investment committee under a documented policy. Investors receive updates before and after major actions when possible."

**D) Conflict of interest** (riga 120): aggiungere sotto la frase esistente:
- Aggiungere: "Any potential conflicts are disclosed deal by deal."

### 4. `src/components/landing/RiskDisclaimer.tsx`

**F) Resale wording** (riga 21): rendere più diretto:
- Da: "Resale listings on the resale board may not find a buyer. Liquidity is not guaranteed."
- A: "Resale listings on the resale board may not find a buyer. Liquidity is not guaranteed. Listings may not sell."

### 5. `src/index.css`

**H) Dot grid opacity** (riga 146): ridurre da 0.04 a 0.03 (~20% in meno)

---

## Riepilogo impatto

| Cosa | Stato attuale | Dopo |
|------|--------------|------|
| Fee model | Contraddittorio (on top vs deducted) | Coerente: deducted from investment |
| Hero subheadline | Contiene "community" fluff | Secca e specifica |
| Trust strip | "Built for EU retail investors" | "Designed for EU investors" |
| "maximizing returns" | Promessa implicita | Language neutro e policy based |
| Conflict of interest | Manca disclosure | Aggiunta riga disclosure |
| Resale wording | Generico | Aggiunto "Listings may not sell." |
| Vault card label | "Illustrative example" | "Example vaults" |
| Dot grid | Opacity 0.04 | Opacity 0.03 |
| Simulator disclaimer | "This is a simulation..." | "Illustration only. Returns are not guaranteed." |

Nessuna nuova dipendenza. Nessun cambio di UI/layout, solo copy e logica fee.
