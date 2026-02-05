
# UI Improvements & Feature Enhancements

This plan covers multiple improvements across the application based on your feedback.

---

## Summary of Changes

1. **Explore Page** - Consolidate filters into a single button with expanded filter panel (country, industry type/sector)
2. **Portfolio Page** - Add latest valuation date and news section for each position
3. **Marketplace Page** - Add "Sell" button with position selection flow and show equity % in listings
4. **Pool Detail Page** - Add founder info with LinkedIn links, accelerator info, and enhanced Terms section with dividend policy
5. **Landing Page** - Create Terms & Conditions page with detailed legal/fee information

---

## 1. Explore Page - Unified Filter Panel

**Current**: Two separate dropdown buttons for Stage and Status filters

**Changes**:
- Replace individual filter dropdowns with a single "Filters" button
- When clicked, opens a Sheet (side panel) or expandable section showing all filters:
  - **Status**: Live, Upcoming, Active, Filled
  - **Stage**: Pre-seed, Seed, Series A
  - **Country**: Italy, Germany, Netherlands, France, Spain, UK (common European countries)
  - **Sector/Type**: B2B, B2C, Fintech, AI/ML, E-commerce, SaaS, HealthTech, CleanTech
- Show active filter count on the button
- "Clear All" and "Apply" buttons in the panel
- Search bar remains separate

**Files to modify**: `src/pages/ExplorePage.tsx`

---

## 2. Portfolio Page - Valuation News

**Current**: Shows invested amount, ownership %, and estimated value

**Changes**:
- Add under each position card a "Latest Update" section showing:
  - Last valuation date (e.g., "Valuation updated: Jan 15, 2025")
  - Latest news headline (e.g., "GreenCommerce raises Series A at €15M valuation")
- Add mock valuation history data to types and mock data

**New data fields**:
```
Position will reference pool/deal which will have:
- last_valuation_date: string
- last_valuation_note: string
- company_updates: { date, headline, summary }[]
```

**Files to modify**: 
- `src/types/index.ts` - Add valuation/update fields to StartupDeal
- `src/data/mockData.ts` - Add mock update data
- `src/pages/PortfolioPage.tsx` - Display the updates section

---

## 3. Marketplace Page - Sell Flow & Equity Display

**Current**: 
- Shows listings but no "Sell" button to create a new one
- Missing equity percentage in listing cards

**Changes**:

**A. Add "Sell Your Position" button** (top right of page):
- Opens a dialog/sheet with:
  1. Position selector dropdown (from your portfolio positions that are not already listed)
  2. On selection, shows:
     - Current position value
     - Estimated value
     - Your ownership %
     - Unrealized gain/loss
  3. Input fields:
     - % of position to sell (1-100)
     - Asking price in EUR
  4. Preview of what equity % the buyer will receive
  5. Fee notice (1% marketplace fee)
  6. "Create Listing" button

**B. Show equity % in listing cards**:
- Calculate: `seller_ownership_percent * (percent_for_sale / 100)`
- Display as "0.67% equity" under the position info

**Files to modify**: 
- `src/pages/MarketplacePage.tsx` - Add Sell button, dialog, and equity display

---

## 4. Pool Detail Page - Founders & Enhanced Terms

**Current**: 
- Overview tab shows description, highlights, risks
- Terms tab shows target, equity, valuation, fees

**Changes**:

**A. Add Founders section to Overview tab**:
- Display founder names, roles, and LinkedIn links (clickable)
- Show accelerator/incubator badges (e.g., "Y Combinator W24", "Techstars")

**B. Enhance Terms tab**:
Add clear sections for:
- Target Raise
- Equity Offered  
- Pre-money Valuation
- Minimum Ticket
- Fee Structure (Entry 2%, Carry 2%)
- **Dividend Policy** (new): "Dividends corresponding to your equity stake are managed by VaultCapital as SPV manager. You acquire economic rights to equity only; dividends are reinvested or distributed at VaultCapital's discretion."
- **Governance Note**: "Investors do not hold voting rights. All governance decisions are made by VaultCapital as nominee."

**New data fields**:
```
StartupDeal:
- founders: { name, role, linkedin_url }[]
- accelerator?: string (e.g., "Y Combinator", "Techstars")
```

**Files to modify**:
- `src/types/index.ts` - Add founders and accelerator fields
- `src/data/mockData.ts` - Add mock founder data
- `src/pages/PoolDetailPage.tsx` - Display founders and enhanced terms

---

## 5. Terms & Conditions Page

**Current**: Footer has "Terms" link that goes nowhere (#)

**Changes**:
- Create new `/terms` route and `TermsPage.tsx`
- Comprehensive legal-style page covering:
  1. **Platform Overview** - What VaultCapital is and how it works
  2. **Fee Structure**
     - Entry fee: 2% on investment
     - Carry fee: 2% on profits at exit
     - Marketplace fee: 1% on secondary trades
  3. **Dividend Policy**
     - How dividends are handled by the SPV
     - VaultCapital's discretion on distribution
  4. **Exit Procedures**
     - How exits are decided
     - Distribution timeline and process
     - Pro-rata allocation
  5. **SPV/Nominee Structure**
     - What investors own (economic rights, not voting rights)
     - VaultCapital's role as manager
  6. **Risks and Disclaimers**
     - High-risk investment warning
     - No guarantee of returns
     - Illiquidity risk
  7. **Marketplace Rules**
     - Secondary trading terms
     - Fees and settlement

**Files to create**:
- `src/pages/TermsPage.tsx`

**Files to modify**:
- `src/App.tsx` - Add route
- `src/pages/LandingPage.tsx` - Update footer link

---

## Files Summary

**Create**:
- `src/pages/TermsPage.tsx` - Terms and conditions page

**Modify**:
- `src/types/index.ts` - Add founders, accelerator, company updates fields
- `src/data/mockData.ts` - Add mock data for new fields
- `src/pages/ExplorePage.tsx` - Unified filter panel
- `src/pages/PortfolioPage.tsx` - Valuation updates section
- `src/pages/MarketplacePage.tsx` - Sell button and equity display
- `src/pages/PoolDetailPage.tsx` - Founders section and enhanced terms
- `src/pages/LandingPage.tsx` - Link to terms page
- `src/App.tsx` - Add /terms route

---

## Implementation Order

1. Update types and mock data first (foundation for other changes)
2. Explore page filter consolidation
3. Portfolio page valuation updates
4. Marketplace sell flow and equity display
5. Pool detail founders and terms enhancements
6. Terms & Conditions page and routing
