# Comprehensive Platform Enhancement

This plan covers all the improvements discussed: Landing Page overhaul, Dashboard dynamics, Pool Detail enhancements, and Marketplace explainer.  
Allora, facciamo così: partiamo da quelle che sono le priorità alte. Tu mi dici che la landing page è troppo generica, sono d'accordo, però come possiamo migliorarla? Ok. Perché attualmente noi non abbiamo ancora effettivamente investito in startup, questa è un'idea, è un'idea di una startup che vorremmo andare ad un incubatore, quindi non abbiamo startup reali in cui abbiamo investito, ok? Quindi come possiamo farlo senza queste cose? Per la parte trust and compliance, tu mi dici che non c'è una sezione "chi siamo". Bene, aggiungiamola. Aggiungi una sezione nella landing page su chi siamo, dove mettiamo, eh, il, il nostro team, info sulla nostraaa struttura legale, su come gestiamo, eh, le, mmh, i pool, come gestiamo gli investimenti, le exit, le percentuali, eh, i rischi, eeeh, quali sono i benefici che ti dà investire con noi e tutte queste cose. Una sezione FAQ, ok? Che vada a rispondere a domande serie. Aaa, sempre-- questa la aggiungiamo sempre nella landing page. Aggiungiamo questo disclaimer su rischi, eeeh, e, eh, anche nella parte di onboarding o se sono nella landing page, facciamo capire che comunque è un investimento, è rischioso, però noi lo rendiamo bello, praticamente. Eh, poi per quanto riguarda quelli, i miglioramenti importanti, tu mi hai detto come migliorarlo e sono d'accordo, eh, quindi i documenti scaricabili, metriche chiave, la sezione del team, eeeh, il-- la progress bar del funding e tutte queste cose che devono portare sicurezza all'utente che sta andando ad investire, in modo tale che abbia quante più informazioni possibili su quello che effettivamente sta facendo, il-- così che sia spinto a farlo, quindi vai a fare queste migliorie. Ehm, anche per la parte di dashboard troppo statica, vai a fare queste migliorie, eh, mi piacciono i consigli che hai dato, valli ad applicare. Per quanto riguarda la pla-- la parte di marte- marketplace, dal punto di vista della user experience, eeeh, è giusto. È giusto, ma secondo me non serve tanto una sezione educativa, ma più che altro, eh, una sezione, eh, magari con un-- da accedere con un button, dove si spiega come funziona la sezione, eh, del marketplace, come funziona il pricing, le commissioni che prendiamo noi, ehm, cosa succede quando uno vende, cosa succede quando uno compra, in modo tale che abbiano, mmh, perfetta consapevolezza di quello che stanno andando a fare. Per quanto riguarda invece le idee che hai dato, ehm, mi piace molto quella dei company updates. E sì, eh, che, eh, ci sta che le startup in cui hai investito ti mandino dei report, quindi sarebbe una cosa da aggiungere, eh, e anche nella landing page, una cosa su cui spingere, sul fatto che comunque c'è trasparenza e tutte queste cose qua. Ci sta anche la simula-- il simulatore di rendimento, e questo sarebbe da mettere all'interno della landing page, dove a un certo punto tu dici: perché avresti dovuto investire con noi? E perché non è tardi neanche oggi. E poi gli fai vedere che, ehm, avessi investito cinquecento euro in una qualunque startup delle nostre, ad oggi avresti questo. Quindi, che ne so, una average delle nostre-- delle performance delle nostre startup si fa vedere, ok? Eeehm, ci sta il fatto di sp-- della struttura sul profilo utente e anche sulle notifiche, sarebbe da fare. La sezione learn, mmmh, per il momento lasciamola stare, mi va bene mettere, eh, quelle che sono, oh, le risorse sulle startup in cui stai investendo, però non è che ti devo fare la scuola sulla startup, ok?

---

## 1. Landing Page Overhaul (`src/pages/LandingPage.tsx`)

The landing page gets a major expansion with new sections. Since there are no real startups yet, stats will be reframed as aspirational/platform capabilities rather than fake numbers.

### Changes:

- **Return Simulator**: Interactive section with a slider. "If you had invested EUR 500 in a startup that grew 5x, today you'd have..." using average exit multiples. Uses `useState` + `Slider` component already available
- **About Us / Chi Siamo**: New section with team placeholders (founders of VaultCapital), legal structure explanation (SPV/nominee model), how pools work, how exits work
- **Fee Transparency**: Clear breakdown of 2% entry, 2% carry, 1% marketplace e non solo 
- **FAQ Section**: Using the existing `Accordion` component. Questions like:
  - What is VaultCapital?
  - How does pooled investment work?
  - What are the risks?
  - How does the SPV structure work?
  - Can I sell my position?
  - What fees do you charge?
  - How are exits handled?
  - What is the minimum investment?
- **Transparency Section**: Highlight company updates, investor reporting, full visibility on portfolio performance
- **Risk Disclaimer**: Professional disclaimer about startup investment risks, not financial advice, potential total loss of capital
- **Footer**: Update copyright to 2025, keep Privacy/Terms links

### New imports needed:

- `Slider` from `@/components/ui/slider`
- `Accordion, AccordionItem, AccordionTrigger, AccordionContent` from `@/components/ui/accordion`
- Additional Lucide icons: `Calculator, HelpCircle, Eye, FileCheck, Briefcase`

---

## 2. Dashboard Improvements (`src/pages/DashboardPage.tsx`)

Make the dashboard feel like a real command center.

### Changes:

- **Live Pool with Countdown**: Featured pool card gets a prominent countdown timer and progress bar showing funding %
- **Portfolio Performance Chart**: Simple bar or summary showing each position's P&L with color coding (green/red)
- **Company Updates Feed**: Pull `company_updates` from deals the user has invested in and show the latest ones as a timeline
- **Recent Marketplace Activity**: Show user's active listings and any pending offers received
- **Quick Stats Enhancement**: Add "Portfolio Performance" stat showing total % gain/loss

---

## 3. Pool Detail Page Improvements (`src/pages/PoolDetailPage.tsx`)

The Team tab already exists. Enhance the overall page.

### Changes:

- **Key Metrics Card**: Add a new card in Overview showing structured metrics (ARR, growth rate, team size, etc.) extracted from deal highlights in a grid format
- **Documents Tab Enhancement**: Make pitch deck and data room links more prominent with download-style buttons and file type indicators
- **Company Updates Tab**: Already exists but enhance with timeline styling and icons per update type
- **Risk Disclaimer Banner**: Add a small alert banner at top of invest sidebar reminding this is high-risk

---

## 4. Marketplace "How It Works" Explainer

### Changes in `src/pages/MarketplacePage.tsx`:

- Add an info button/banner at top of marketplace that opens a Dialog or collapsible section explaining:
  - How buying works (click listing, confirm purchase or make offer)
  - How selling works (list position, set price, manage offers)
  - Fee structure (1% marketplace fee on buyer)
  - What happens after a sale (position transfers, wallet credited)
  - Offer system explanation

---

## Files to Modify


| File                            | Changes                                                                       |
| ------------------------------- | ----------------------------------------------------------------------------- |
| `src/pages/LandingPage.tsx`     | Major rewrite: About Us, FAQ, Return Simulator, Transparency, Risk Disclaimer |
| `src/pages/DashboardPage.tsx`   | Add portfolio performance summary, company updates feed, marketplace activity |
| `src/pages/PoolDetailPage.tsx`  | Add key metrics card, enhance documents tab, risk banner                      |
| `src/pages/MarketplacePage.tsx` | Add "How it works" explainer dialog/section                                   |


No new files needed. No new dependencies needed -- Slider, Accordion, Alert components are already installed and available.

---

## Technical Details

### Return Simulator (Landing Page)

```text
State: investmentAmount (slider 100-10000), exitMultiple (slider 2x-10x)
Output: investmentAmount * exitMultiple displayed dynamically
Shows: "If you invested EUR {amount} and the startup exits at {multiple}x,
        your return would be EUR {result} (before fees)"
Fee note: "After 2% entry + 2% carry on profit, net return: EUR {net}"
```

### FAQ Data Structure

```text
Array of { question: string, answer: string }
Rendered with Accordion component
8-10 serious questions covering:
- Platform mechanics
- Legal structure
- Risks
- Fees
- Liquidity (marketplace)
- Exit process
```

### Dashboard Company Updates

```text
Pull from: deals where user has positions -> deal.company_updates
Sort by date descending
Show latest 5
Each update: startup name, headline, summary, date
```

### Marketplace Explainer

```text
Triggered by info button next to page title
Opens Dialog with sections:
- Buying: browse, purchase at ask price or make an offer
- Selling: list from portfolio, set price/%, manage offers
- Fees: 1% on buyer
- Settlement: instant wallet transfer
```

---

## Implementation Order

1. Landing Page (biggest change, most impactful for pitch/incubator)
2. Dashboard improvements
3. Pool Detail enhancements
4. Marketplace explainer