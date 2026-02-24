
# Landing Page Overhaul v2

Integro i tuoi commenti nel piano. Ecco le modifiche rispetto alla versione precedente:

**Tue note applicate:**
- La subheadline unisce il concetto community con i dettagli concreti (curated deals, vaults, SPV)
- Il risk disclaimer resta completo e chiaro, non viene accorciato ma viene riscritto meglio (senza dash)
- Nessun dash nei testi
- "Pool" diventa "Vault" ovunque nella landing

---

## Fase 1: Hero Section (`src/components/landing/HeroSection.tsx`)

Riscrittura completa con layout a due colonne (desktop) e visual delle vault card.

**Copy:**
- Headline: "Invest in Private Startups **from €100**"
- Wow line: "Venture investing for the rest of us."
- Subheadline: "Curated deals, 72 hour vaults, SPV backed ownership. Join a community of retail investors building tomorrow's success stories."
- 3 micro bullet con icone: "72h vault window" | "From €100" | "Full refund if vault doesn't fill"
- CTA primario: "Explore Vaults" -> /explore
- CTA secondario ghost: "How It Works" -> /how-it-works

**Visual (lato destro desktop, sotto su mobile):**
- Stack di 3 card vault mock flottanti con ombra, bordi arrotondati, accento arancione solo su numeri/badge
- Ogni card mostra: nome startup fittizio, badge stage (Seed/Series A), progress bar verso target, tempo rimanente (es. "48h left"), min ticket €100
- Etichetta "Illustrative example" sopra le card
- Animazione CSS float leggera (2px su/giù)

**Social proof strip** (sotto i CTA):
- Striscia sottile con 3 item: "Built for EU retail investors" | "Transparent fees" | "SPV structure"
- Icone piccole + testo muted

**Sfondo:** gradiente leggero con tinta arancione in alto a destra, opacità molto bassa

---

## Fase 2: "Why VaultCapital?" Cards (`src/pages/LandingPage.tsx`)

Riscrittura contenuti delle 4 card:

| Attuale | Nuovo Titolo | Nuovo Testo |
|---------|-------------|-------------|
| Curated Deals | Pre negotiated deals | We negotiate terms first. You decide if you want in. |
| SPV Protected | SPV structure | One SPV on the cap table. Investors get economic exposure, not voting rights. |
| Secondary Market | Resale board | List your position for sale. Liquidity is not guaranteed. |
| Full Transparency | Transparent fees | Fees are shown before you invest and after an exit. No hidden charges. |

**Visual per card:**
- Icona mini grafica nell'header (term sheet, nodo cap table, listing tag, ricevuta)
- Griglia più stretta, area contenuto leggermente più grande
- Animazione hover lift (translateY di 2px)

**Anche:** rimuovere dash dalla descrizione delle sezioni di navigazione (About, How It Works, FAQ)

---

## Fase 3: Mini "How It Works" (`src/components/landing/HowItWorks.tsx`)

Semplificazione da 4 step a 3, con timeline connessa:

- Step 1: "We source and negotiate a deal" (icona Handshake)
- Step 2: "A 72 hour vault opens" + sotto testo "Invest while the vault is live. If it doesn't fill, you're refunded." + badge "refund" (icona Clock)
- Step 3: "SPV holds the investment" + sotto testo "The SPV owns the stake. VaultCapital manages admin and provides updates." (icona Briefcase)

Linea sottile verticale (mobile) / orizzontale (desktop) che connette gli step.

Link button: "Read the full process" -> /how-it-works

Inserito nella landing tra "Why VaultCapital?" e Return Simulator.

---

## Fase 4: Return Simulator (`src/components/landing/ReturnSimulator.tsx`)

- Disclaimer sotto il titolo: "This is a simulation. Returns are not guaranteed."
- Modello fee corretto: entry fee ON TOP (l'importo investito resta intero)
  - Investment: €500
  - Entry fee (2%): €10
  - Total paid: €510
  - Gross return: €500 × multiple
  - Carry fee: 2% solo sul profitto
  - Net return mostrato chiaramente
- Aggiungere riga "Total paid" nel riepilogo
- Rimuovere dash dal testo descrittivo

---

## Fase 5: Startup CTA (`src/components/landing/StartupCta.tsx`)

- Titolo: "Raising a round?"
- Testo: "Apply to be considered for a VaultCapital vault. If selected, we may propose terms and open a public vault."
- Bullet aggiornati: "Submit deck + metrics" | "Team review" | "If selected, we open a 72h vault"
- Button: "Apply" -> /apply

---

## Fase 6: Risk Disclaimer (`src/components/landing/RiskDisclaimer.tsx`)

Manteniamo la completezza ma riscriviamo senza dash e con linguaggio più diretto:

- Titolo: "Risk Warning"
- Paragrafo 1: "Investing in startups involves **significant risk**, including the potential **total loss of your invested capital**. Startup investments are illiquid, speculative, and not suitable for all investors."
- Paragrafo 2: "VaultCapital does not provide financial advice. Past performance is not indicative of future results. You should carefully consider your financial situation and risk tolerance before investing."
- Paragrafo 3: "Resale listings on the resale board may not find a buyer. Liquidity is not guaranteed."
- Link: "Read full risk disclosure" -> /terms

---

## Fase 7: Final CTA e Footer (`src/pages/LandingPage.tsx`)

- Titolo: "Ready to start?"
- Testo: "Browse live vaults and invest starting from €100."
- Button: "Explore Vaults" -> /explore
- Footer: aggiungere riga "Fees shown upfront. No hidden charges."

---

## Fase 8: Visual Polish (`src/index.css`)

Aggiungere CSS per:

```text
1. @keyframes float: translateY 0 -> -2px -> 0 (3s ease-in-out infinite)
2. Dot grid background: radial-gradient molto sottile, solo su schermi grandi
3. Hover lift: transition transform, hover translateY(-2px)
4. Progress bar animate: width da 0 a valore finale su load
```

---

## File da modificare

| File | Modifiche |
|------|-----------|
| `src/components/landing/HeroSection.tsx` | Riscrittura completa: copy, vault card stack, social proof, gradiente |
| `src/pages/LandingPage.tsx` | Card "Why VaultCapital", final CTA, footer trust line, inserire HowItWorks |
| `src/components/landing/HowItWorks.tsx` | Da 4 a 3 step con timeline connessa |
| `src/components/landing/ReturnSimulator.tsx` | Disclaimer, fee model on top |
| `src/components/landing/StartupCta.tsx` | Copy aggiornato |
| `src/components/landing/RiskDisclaimer.tsx` | Riscritto senza dash, completo ma più diretto |
| `src/index.css` | Keyframes float, dot grid, hover lift |

Nessuna nuova dipendenza. Tutto CSS puro.

## Nota importante

Il rename "Pool" -> "Vault" viene applicato solo nella landing page. Il resto dell'app (dashboard, explore, portfolio) può essere rinominato come task separato.
