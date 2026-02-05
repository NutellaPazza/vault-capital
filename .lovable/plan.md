

# VaultCapital - Investment Platform MVP

A clickable demo showcasing a retail startup investment platform with pooled investments and secondary marketplace.

---

## 🎨 Design System

**Style**: Minimal, clean fintech aesthetic
**Colors**: Light gray backgrounds, white cards, light orange accents for CTAs and highlights
**Typography**: Clean, modern sans-serif
**Language**: English throughout

---

## 📱 Navigation Structure

**Top Bar (all pages)**:
- VaultCapital logo (left)
- Notification bell icon
- Settings icon
- Wallet balance display

**Bottom Navigation Bar**:
- Home (current pool)
- Explore (all pools)
- Portfolio (your positions)
- Marketplace (buy/sell shares)
- Profile (account & settings)

---

## 📄 Pages & Features

### 1. Landing Page (Public)
- Hero section: "Invest in private startups from €100"
- How it works: 4-step visual flow (Deal Sourcing → Pool Live 72h → SPV Ownership → Exit Distribution)
- Featured live pool preview
- CTA: "Get Started" / "Explore Pools"
- Footer with disclaimer: "Demo. Not financial advice."

### 2. Authentication (Mock)
- Login / Sign up forms
- Simple email + password flow
- Saves user to localStorage
- Risk profile selection (Conservative/Balanced/Aggressive)

### 3. Home Dashboard
- **Hero Card**: Current live pool with countdown timer, progress bar, key stats
- Quick stats cards: Wallet balance, Active investments, Total invested, Unrealized value
- "Upcoming Pools" section (horizontal scroll)
- Recent notifications/updates feed

### 4. Explore Pools
- Filterable list: Stage (Pre-seed/Seed/Series A), Industry, Status (Live/Upcoming/Closed)
- Pool cards showing: Startup name, industry, target amount, raised %, time remaining, status badge
- Quick invest button on each card

### 5. Pool Detail Page
**Layout**: Main content left, sticky invest widget right

**Tabs**:
- Overview: Startup description, highlights, risks
- Terms: Target, equity %, valuation, fee breakdown (2% entry, 2% carry)
- Updates: Timeline of pool news (mock)
- Documents: Pitch deck, data room (placeholder links)
- FAQ: Common questions

**Invest Widget**:
- Input amount (min €100)
- Real-time breakdown: Investment + 2% fee = Total
- Wallet balance check
- "Invest Now" button
- SPV/nominee disclaimer note

### 6. Portfolio
**Overview Tab**:
- Total portfolio value
- Performance chart (mock)
- Positions list with: Startup name, invested amount, ownership %, estimated value, status badge, "List on Marketplace" action

**Position Detail**:
- Investment summary
- Value chart over time (mock)
- Related pool info
- Recent company updates
- Action: List on Marketplace

### 7. Marketplace
**Browse Listings**:
- Filters: Startup, stage, price range
- Listing cards: Startup, % of position for sale, asking price, implied valuation, seller rating (mock)
- "Buy" button

**Sell Flow**:
- Select position to sell
- Set % to sell (partial allowed)
- Set asking price
- Fee preview (1% marketplace fee)
- Confirm listing

**Buy Flow**:
- Listing detail modal
- Price breakdown with 1% fee
- Wallet balance check
- Confirm purchase
- Position transfer simulation

### 8. Wallet
- Current balance (large display)
- Quick actions: Deposit / Withdraw buttons
- Transaction history table: Date, Type, Amount, Description
- Filter by transaction type

**Deposit/Withdraw Modals**:
- Amount input
- Simulated processing
- Balance update
- Toast confirmation

### 9. Settings & Profile
- Profile info (name, email, risk profile)
- Notification preferences
- Pool interest filters (industry, stage preferences)
- KYC status display (mock: Verified/Pending/Not Started)
- Logout

### 10. Admin Panel (Demo Only)
- Toggle admin mode (visible only when enabled)
- Pool management: Force status (Filled/Failed/Active)
- Exit simulation: Select pool, input exit multiple (e.g., 3x), calculate and distribute proceeds
- Create new pool form
- View all users and their positions

---

## 🔄 Core Flows

### Invest in Pool
1. User views live pool → Enters amount
2. System calculates: Amount + 2% fee = Total deducted
3. Wallet debited → Position created → Pool raised amount updated
4. Success toast + redirect to portfolio

### Pool Completion
- **Filled**: Target reached → Status becomes "Active" → Positions locked
- **Failed**: Time expires + under target → Auto-refund to wallets

### Marketplace Trade
1. Seller lists position (full or partial) with asking price
2. Buyer purchases → 1% fee added to buyer's cost
3. Seller receives proceeds → Buyer gets position
4. Both see transactions in wallet history

### Exit Distribution (Admin)
1. Admin triggers exit on active pool
2. Input exit multiple or total proceeds
3. Calculate: Profit → 2% carry fee → Net distribution
4. Pro-rata distribution to all position holders
5. Summary shown with breakdown

---

## 📊 Demo Data

**3 Startup Deals & Pools**:
1. **TechFlow SaaS** (Italy) - LIVE: €620K/€1M raised, 38h remaining, Seed stage
2. **NeuralAI** (Europe) - UPCOMING: €500K target, starts in 2 days, Pre-seed AI
3. **GreenCommerce** - CLOSED/ACTIVE: €750K fully raised, marketplace enabled

**Demo User**:
- Wallet: €25,000
- Position in GreenCommerce: €10,000 invested
- One marketplace listing from another mock user

---

## ✨ UI Components

- Progress bars (pool funding)
- Countdown timers (pool end time)
- Status badges (LIVE, UPCOMING, FILLED, FAILED, ACTIVE, EXITED)
- Modal dialogs (invest, deposit, buy)
- Toast notifications (success/error)
- Data tables (transactions, positions)
- Charts (portfolio value - mock)
- Form validation with error messages
- EUR formatting (European style: €1.000,00)

