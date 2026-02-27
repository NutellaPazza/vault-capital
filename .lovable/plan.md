

# Phase 3: Explore + Resale Board Enhancement

## 3A. Explore Page: Enhanced Filtering

Add three new filter sections to the existing filter Sheet in `ExplorePage.tsx`:

- **Min Ticket Range**: Preset buttons (not a slider -- cleaner UX): "Up to 250", "250-500", "500-1000", "1000+"
- **Target Size Range**: Preset buttons: "Less than 250k", "250k-1M", "More than 1M"
- **Accelerator**: Toggle switch to show only vaults backed by an accelerator (YC, Techstars, etc.)

Each adds to the active filter count badge.

## 3B. Explore Page: Sorting Dropdown

Add a `Select` dropdown next to the Filter button with 4 options:

- Most funded (by raised_eur descending)
- Ending soon (by end_datetime ascending, live only first)
- Newest (by start_datetime descending)
- Lowest min ticket (by min_ticket_eur ascending)

Default: no sort applied (shows all as-is).

## 3C. Vault Cards: Minor Cleanup

Quick pass on `PoolCard.tsx` default variant to ensure consistent field order:
- Status badge, stage badge (already there)
- Description (already there)
- Highlights capped at 2 (already done)
- Tags row (sector, country, accelerator -- already there)
- Raised/target + progress bar
- Time left / investors count
- Footer: equity, min ticket, valuation

This is mostly already in good shape. Minor spacing/order adjustments only if needed.

## 3D. Resale Board Overhaul

Enhance `MarketplacePage.tsx`:

**Buy tab cards** -- add two new data points:
- "Days listed" (calculated from `created_at`)
- "Views" (mock number derived from listing ID hash -- already implemented as `getViewCount`)
- Display these in a subtle row below the existing card content

**Buy modal** -- enhance the purchase confirmation dialog:
- Show fee breakdown: Price + Buyer fee (1%) = Total
- Add disclaimer text: "Resale is not guaranteed. This listing may take time to sell."

**Sell dialog** -- add context to help sellers:
- Show invested amount and ownership % for the selected position
- Show estimated proceeds after 1% buyer fee (informational)
- Show max sellable percentage (100% minus any already listed %)

---

## Technical Details

### Files modified

| File | Changes |
|------|---------|
| `src/pages/ExplorePage.tsx` | Add ticket range, target size, accelerator filters + sorting Select |
| `src/pages/MarketplacePage.tsx` | Add days listed/views to buy cards, fee breakdown in buy modal, enhanced sell dialog |
| `src/components/common/PoolCard.tsx` | Minor spacing cleanup if needed (likely no changes) |

### No new dependencies needed
- `Select` component already imported in MarketplacePage
- `Switch` component available from shadcn for accelerator toggle
- All mock data fields (`min_ticket_eur`, `accelerator`, `created_at`) already exist in types

### Approach
- Sorting and new filters use existing data fields -- no type or mock data changes
- Filter state managed with existing `useState` pattern in ExplorePage
- Days listed calculated as `differenceInDays(now, listing.created_at)` using date-fns (already installed)

