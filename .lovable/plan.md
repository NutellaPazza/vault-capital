

# Platform Refinement: Full Feedback Implementation

This is a large overhaul touching every section of the app. Breaking it into 4 phases, each deployable independently.

---

## Phase 1: Terminology + Quick Fixes (Foundation)

### 1A. Global "Pool" to "Vault" rename
Every user-facing label changes. Internal code (variable names, types) stays as-is to avoid breaking changes.

**Files affected:**
- `BottomNav.tsx`: "Market" label stays (already short)
- `DashboardPage.tsx`: "Live Pool" → "Live Vault", "Upcoming Pools" → "Upcoming Vaults", "Browse Marketplace" → "Browse Resale Board"
- `ExplorePage.tsx`: "Explore Pools" → "Explore Vaults", "Filter Pools" → "Filter Vaults"
- `PoolCard.tsx`: "View Pool" → "View Vault"
- `PoolDetailPage.tsx`: all "pool" text → "vault" in UI copy, "Pool not yet live" → "Vault not yet live", "Pool closed" → "Vault closed"
- `PortfolioPage.tsx`: "Explore Pools" → "Explore Vaults", listing dialog text
- `MarketplacePage.tsx`: "Marketplace" → "Resale Board" (headline + subheadline), "marketplace fee" → "resale fee" in copy
- `WalletPage.tsx`: transaction labels ("Pool Refund" → "Vault Refund", "Market Purchase" → "Resale Purchase")
- `StatusBadge.tsx`: no changes needed (status values stay as code)
- `HowItWorksPage.tsx`: any remaining "pool" references
- Navigation labels in `BottomNav.tsx`: keep "Market" (short enough for mobile)

### 1B. Dashboard: Fix live vault status bug
In `DashboardPage.tsx` (line 148-152): Check if `end_datetime` has passed. If yes, show "View Vault" button + "Ended" badge instead of "Invest Now".

### 1C. Demo mode badge
In `TopBar.tsx`: Add a small `Badge` next to the logo that says "Demo" in muted style. Only show when authenticated (inside the app).

### 1D. Invest module UX for closed vaults
In `PoolDetailPage.tsx` (lines 585-595): When vault is closed/active, show:
- "Vault closed" heading
- "View your position" button (link to /portfolio) if user has a position
- "Browse resale board" button (link to /marketplace)

---

## Phase 2: Portfolio Upgrade (Investor-Grade)

### 2A. Portfolio header with charts
Replace 3 KPI cards with a split layout:
- **Left side:** Total invested, Est. value (with "Est." label), Unrealized P&L
- **Right side:** Chart selector with 3 tabs using recharts (already installed):
  - Value over time (line chart, mock data)
  - Unrealized P&L by position (bar chart)
  - Allocation (donut chart with company/sector toggle)
- Charts get "Illustrative" tooltip on hover

### 2B. Positions table upgrade
Replace current card list with a proper `Table` component:

| Company | Status | Invested | Ownership % | Est. Value | Unrealized P&L | Listed? | Last Update | Actions |
|---------|--------|----------|-------------|------------|----------------|---------|-------------|---------|

Actions column: "View" + "List for sale" buttons.

### 2C. Realized vs Unrealized section
Below the table, add a summary card with:
- Realized P&L (mock: €0 since no exits yet)
- Unrealized P&L (calculated)
- Total fees paid (sum of fee transactions)

### 2D. Manage Listings button
Keep it but make it `variant="outline"` with a badge count. Less dominant.

---

## Phase 3: Explore + Resale Board

### 3A. Explore: Enhanced filtering
Add to the existing filter Sheet:
- Ticket min range: slider or preset buttons (€100 to €500, €500 to €1000, €1000+)
- Target size range: less than €250k, €250k to €1M, more than €1M
- Accelerator toggle (YC/other)

### 3B. Explore: Sorting
Add a `Select` dropdown next to the Filter button:
- Most funded
- Ending soon
- Newest
- Lowest min ticket

### 3C. Vault cards: Standardize fields
Update `PoolCard.tsx` default variant to always show:
- Status badge (already there)
- Target + raised (already there)
- Time left (only if live, already there)
- Min ticket (already there)
- Equity offered (already there)
- Valuation (already there)
- Max 2 traction bullets (already there, capped at 2)

Minor cleanup: ensure consistent order and spacing.

### 3D. Resale board overhaul
In `MarketplacePage.tsx`:
- Rename header: "Resale Board" + subheadline "List or buy positions. Listings may not sell."
- Rename tabs: "Buy Listings" / "Your Listings"
- Buy cards: add "Days listed", "Views" (mock), "Implied valuation" (optional)
- Buying modal: add fee breakdown (Price + Buyer fee 1% + Total) and disclaimer "This listing may not sell quickly. Resale is not guaranteed."
- Selling dialog: show invested amount, ownership %, max sellable %, estimated proceeds after fee

---

## Phase 4: Vault Detail + Dashboard Polish

### 4A. Vault detail: Documents tab
Add placeholders for:
- Financial model (optional)
- Legal docs (SPV terms)
Keep existing Pitch Deck and Data Room links.

### 4B. Vault detail: Team tab
Add "Notable backers" section as text tags below founders (if any). Add short bio field to founder cards if available.

### 4C. Vault detail: Updates tab as timeline
Restyle updates with:
- Date on the left
- Title + 1 to 2 lines on the right
- Tag badge: Metrics / Product / Fundraising / Hiring
- Add `tag` field to `CompanyUpdate` type in `types/index.ts`

### 4D. Vault detail: Risks section tightened
Cap at 4 to 6 bullets. Each risk as: **title** + one short line (split existing risk strings or add a `title` field to mock data).

### 4E. Dashboard: "Next Actions" widget
Add a card with 2 to 3 clickable action items:
- "Complete KYC" (mock, links to /profile)
- "Deposit funds" (links to /wallet)
- "Review your listed position" (links to /marketplace?tab=sell, only if user has listings)

### 4F. Dashboard: Company updates improvement
Each update card adds a "View vault" button linking to the relevant vault detail page.

### 4G. Dashboard: "At a glance" charts
Add a chart section under KPI cards with tabs:
- Portfolio value over time (line, mock)
- Unrealized P&L by position (bars)
- Allocation (donut)

### 4H. Wallet: Export button
Add a "Export" button (demo only) that shows a toast "Export functionality available in production."

### 4I. Copy style enforcement
Audit all in-app copy for:
- Remove "exclusive", "guaranteed", "liquidity when you need it", "maximizing returns"
- 1 sentence per description line
- Numbers over adjectives
- "Est." label on all estimated values

---

## Files to modify per phase

**Phase 1 (8 files):**
`DashboardPage.tsx`, `ExplorePage.tsx`, `PoolCard.tsx`, `PoolDetailPage.tsx`, `PortfolioPage.tsx`, `MarketplacePage.tsx`, `WalletPage.tsx`, `TopBar.tsx`

**Phase 2 (2 files):**
`PortfolioPage.tsx`, `types/index.ts` (if adding mock chart data)

**Phase 3 (3 files):**
`ExplorePage.tsx`, `PoolCard.tsx`, `MarketplacePage.tsx`

**Phase 4 (7 files):**
`PoolDetailPage.tsx`, `DashboardPage.tsx`, `WalletPage.tsx`, `types/index.ts`, `mockData.ts`, `TopBar.tsx` (if not done in Phase 1)

No new dependencies. Recharts is already installed for charts.

---

## Recommendation

Start with **Phase 1** (terminology + quick fixes). It touches many files but each change is small and mechanical. This alone will make the entire app feel more polished and consistent.

Then move to **Phase 2** (Portfolio) as it is the most impactful upgrade for demo credibility.

