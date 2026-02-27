

# Phase 3.5: Resale Board "Investor-Grade" Upgrade

Based on the detailed feedback analysis, here's what needs to be built. Items are prioritized by impact.

## 1. Market Summary Strip

Add a compact 3-card summary row under the page title showing:
- **Active listings**: count of active listings
- **Total notional listed**: sum of all ask prices
- **Avg days listed**: average days since creation

Below it, a small disclaimer: "Listings may not sell. Liquidity is not guaranteed."

**File**: `MarketplacePage.tsx` (after the header, before Tabs)

## 2. Buy Tab: Filters + Sorting

Add a filter drawer (Sheet) with filters for:
- Company (text search, already exists -- keep)
- Stage (multi-select: Pre-seed, Seed, Series A)
- Country (multi-select from available countries)
- Sector (multi-select)
- % for sale range (preset buttons)
- Price range (preset buttons)
- Days listed range (preset buttons)

Add sort dropdown next to the search bar:
- Newest
- Lowest price
- Highest % for sale
- Most viewed
- Oldest listings

**File**: `MarketplacePage.tsx`

## 3. Rename "Equity" to "Exposure (est.)" Everywhere

This is legally important since positions are SPV-based, not direct equity.

Changes across the page:
- Buy listing cards: "Equity" -> "Exposure (est.)"
- Buy modal breakdown: "Equity" -> "Exposure (est.)"
- Offer form: same rename
- Sell dialog preview: "equity" -> "exposure (est.)"
- Add tooltip on the label: "Estimated economic exposure via SPV."

**Files**: `MarketplacePage.tsx`

## 4. Enhanced Buy Modal

Current modal is close but needs:
- Rename Equity line (covered in point 3)
- Add "What you receive" line: "You receive: X% of the seller's position (economic rights via SPV)."
- Breakdown labels: "Ask price" / "Buyer fee (1%)" / "Total paid"
- Add explanation under Make Offer button: "Make Offer lets you propose a lower price. Seller may ignore it."

**File**: `MarketplacePage.tsx`

## 5. Listing Detail View (Expanded Modal)

When clicking a card, instead of jumping straight to buy, show a detail view first with:
- Company name + stage + sector
- Short description (2 lines max)
- Vault terms snapshot: valuation, equity offered, date vault closed
- Seller asking price, % for sale, exposure (est.)
- Fee info: "1% paid by buyer"
- Disclaimer
- Two CTAs: "Buy listing" and "Make Offer"

This replaces the current behavior where clicking a card opens the buy modal directly. The modal becomes a two-step flow: Detail -> Buy/Offer.

**File**: `MarketplacePage.tsx`

## 6. Sell Tab: "How to Sell" Checklist

In the empty state (no active listings), add a mini checklist below the empty icon:

**How to sell (3 steps):**
1. Pick a position from your portfolio
2. Choose what % to sell
3. Set your asking price

**File**: `MarketplacePage.tsx`

## 7. Sell Tab: Structured Listing Table

When listings exist, display them in a table-like layout with columns:
- Company
- % listed
- Ask price
- Views
- Days listed
- Status (Active / Sold / Cancelled)
- Actions (Edit / Cancel)

This replaces the current simple card list with a more structured, data-dense view.

**File**: `MarketplacePage.tsx`

## 8. Sell Dialog: Confirmation Checkbox + Pricing Guidance

Add to the sell dialog:
- Pricing guidance line: "Pricing is set by you. Listings may not sell."
- Fee clarity: "Buyer pays a 1% fee on top of the asking price."
- "You are selling" summary box with: % of position, exposure transferred (est.), ask price
- Confirmation checkbox: "I understand listings may not sell and prices are not guaranteed."
- Disable "Create listing" button until checkbox is checked

**File**: `MarketplacePage.tsx`

## 9. Recent Activity Mini Panel (Optional but Valuable)

Add a small section (visible on desktop, collapsed on mobile) showing 3-4 recent events:
- "New listing: [Company]"
- "Listing sold: [Company]"  
- "Most viewed: [Company]"

Uses existing mock data to generate activity items.

**File**: `MarketplacePage.tsx`

## 10. Naming Consistency Audit

Search across the entire codebase for "marketplace", "secondary", "market" references and ensure they all say "Resale Board" where user-facing. Button labels standardized to:
- "Create listing"
- "Buy listing"  
- "View listing"

**Files**: Multiple files (nav, routes remain as `/marketplace` for URL stability, but display text changes)

---

## Technical Notes

- No new dependencies needed. Uses existing Sheet, Select, Switch, Checkbox, Tooltip, Table components.
- All data comes from existing store/mock data -- no type changes required.
- The Tooltip for "Exposure (est.)" uses the existing `@radix-ui/react-tooltip` already installed.
- Filter state managed with `useState` following existing patterns.
- The listing detail view is implemented as a new dialog state (not a separate route) to keep navigation simple.
- Confirmation checkbox uses existing `@radix-ui/react-checkbox`.

## Estimated Scope

| Area | Complexity |
|------|-----------|
| Market summary strip | Small |
| Filters + sorting | Medium |
| Equity -> Exposure rename | Small |
| Enhanced buy modal | Small |
| Listing detail view | Medium |
| How to sell checklist | Small |
| Structured listing table | Medium |
| Sell dialog enhancements | Small |
| Recent activity panel | Small |
| Naming audit | Small |

Total: One large edit to `MarketplacePage.tsx` plus a quick naming audit across navigation components.

