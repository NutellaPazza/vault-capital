
# Marketplace Enhancement & UI Fixes

This plan addresses all the issues you've identified: fixing the sell dialog, centering the notification badge, and expanding the marketplace into a full Buy/Sell experience with offers.

---

## Summary of Changes

1. **Fix Sell Dialog** - Position dropdown not showing user's positions
2. **Fix Notification Badge** - Center the number inside the badge
3. **Redesign Marketplace** - Split into Buy and Sell tabs with full seller management
4. **Add Offer System** - Allow buyers to make offers, sellers to receive/manage offers
5. **Link from Portfolio** - Quick access to marketplace listings from Portfolio page

---

## 1. Fix Sell Dialog - Positions Not Showing

**Problem**: The filter is looking for pools with `pool_status === 'active'` but the demo user (`user-1`) only has a position in pool-3 (GreenCommerce) which IS active. However, the issue is that when logging in with a different email, a NEW user is created with NO positions.

**Solution**: 
- The demo user `alex@demo.com` has the position
- Need to ensure the filter includes the position correctly
- Also should show a message when no positions are available to list

**File**: `src/pages/MarketplacePage.tsx`
- Add a fallback message when no listable positions exist
- Verify the filter logic is correct for the current user

---

## 2. Fix Notification Badge Centering

**Problem**: The number inside the notification badge is off-center

**Current code** (TopBar.tsx line 72-77):
```
<Badge 
  variant="destructive" 
  className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 text-xs"
>
  {unreadCount}
</Badge>
```

**Solution**: Add flex centering classes to ensure the number is centered

**File**: `src/components/layout/TopBar.tsx`
- Change className to include `flex items-center justify-center`

---

## 3. Redesign Marketplace with Buy/Sell Tabs

**Current**: Single page showing all listings with a "Sell Position" button

**New Structure**:
```
Marketplace
├── Tab: Buy
│   ├── Search/Filter
│   ├── Listing Cards (from other sellers)
│   └── Click -> Buy Dialog OR Make Offer Dialog
│
└── Tab: Sell
    ├── "Create Listing" button
    ├── Your Active Listings
    │   ├── Views count (simulated)
    │   ├── Edit price/equity button
    │   ├── Cancel listing button
    │   └── Offers received section
    ├── Pending Offers (on your listings)
    └── Sold History
```

**New Types** (add to `src/types/index.ts`):
```
MarketplaceOffer:
- id: string
- listing_id: string
- buyer_user_id: string
- offer_price_eur: number
- offer_message?: string
- status: 'pending' | 'accepted' | 'rejected' | 'expired'
- created_at: string
```

**New Store Actions** (add to `src/store/appStore.ts`):
- `createOffer(listingId, offerPrice, message?)` - buyer makes offer
- `acceptOffer(offerId)` - seller accepts offer
- `rejectOffer(offerId)` - seller rejects offer
- `updateListing(listingId, updates)` - edit price/percent
- `getMyListings()` - listings where seller_user_id === currentUser.id
- `getOffersForMyListings()` - offers on seller's listings
- `getMyOffers()` - offers the user has made

**File**: `src/pages/MarketplacePage.tsx` - Complete redesign with tabs

---

## 4. Add Offer System

**Buy Tab Changes**:
When clicking on a listing, show dialog with TWO buttons:
1. **Confirm Purchase** - Buy at asking price (existing)
2. **Make Offer** - Opens offer input:
   - Input: Your offer price
   - Optional: Message to seller
   - Submit button

**Sell Tab - Offers Section**:
- List of pending offers on your listings
- Each offer shows: buyer name, offer amount, listing details
- Actions: Accept / Reject buttons
- When accepted: executes trade at offer price

---

## 5. Portfolio Link to Marketplace

**Add to Portfolio Page**:
- Under positions section, add link: "Manage Listings" -> goes to Marketplace Sell tab
- If position is listed, show "Listed on Marketplace" badge with link

**File**: `src/pages/PortfolioPage.tsx`

---

## Files to Modify

1. **src/types/index.ts** - Add `MarketplaceOffer` type
2. **src/store/appStore.ts** - Add offer actions and helpers
3. **src/data/mockData.ts** - Add sample offers for demo
4. **src/components/layout/TopBar.tsx** - Fix badge centering
5. **src/pages/MarketplacePage.tsx** - Complete redesign with tabs, offers, seller management
6. **src/pages/PortfolioPage.tsx** - Add marketplace links

---

## Technical Implementation Details

### MarketplaceOffer Type
```typescript
export interface MarketplaceOffer {
  id: string;
  listing_id: string;
  buyer_user_id: string;
  offer_price_eur: number;
  offer_message?: string;
  status: 'pending' | 'accepted' | 'rejected' | 'expired';
  created_at: string;
}
```

### New Store State & Actions
```typescript
// State
offers: MarketplaceOffer[];

// Actions
createOffer: (listingId: string, offerPrice: number, message?: string) => void;
acceptOffer: (offerId: string) => boolean;
rejectOffer: (offerId: string) => void;
updateListing: (listingId: string, updates: { ask_price_eur?: number; percent_of_position_for_sale?: number }) => void;

// Helpers
getMyListings: () => ListingWithDetails[];
getOffersForListing: (listingId: string) => MarketplaceOffer[];
getMyPendingOffers: () => MarketplaceOffer[];
```

### Marketplace Page Structure
```text
<Tabs defaultValue="buy">
  <TabsList>
    <TabsTrigger value="buy">Buy</TabsTrigger>
    <TabsTrigger value="sell">Sell</TabsTrigger>
  </TabsList>

  <TabsContent value="buy">
    - Search bar
    - Grid of listing cards (exclude own listings)
    - Click opens: BuyOrOfferDialog
  </TabsContent>

  <TabsContent value="sell">
    - Header with "Create Listing" button
    - Section: Your Active Listings
      - Cards with: startup name, equity %, price, views
      - Actions: Edit, Cancel, View Offers
    - Section: Pending Offers
      - List of offers with Accept/Reject
    - Section: Sold History
      - Past sold listings
  </TabsContent>
</Tabs>
```

### Buy/Offer Dialog
When clicking a listing in Buy tab:
```text
Dialog:
- Header: startup name, equity for sale
- Price info: ask price, equity %, fee, total
- Your balance
- Two buttons:
  1. [Confirm Purchase] - existing flow
  2. [Make Offer] - expands form:
     - Input: Offer Amount (EUR)
     - Textarea: Message (optional)
     - [Submit Offer] button
```

---

## Implementation Order

1. Fix TopBar badge centering (quick fix)
2. Add MarketplaceOffer type and store actions
3. Redesign MarketplacePage with tabs
4. Add offer creation flow (Buy tab)
5. Add offer management (Sell tab)
6. Add listing edit/cancel functionality
7. Update PortfolioPage with marketplace links
8. Test the complete flow
