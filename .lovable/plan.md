

# Add 9 New Startup Deals with Full Data

Expand the mock data from 3 to 12 startups, with matching pools, positions, marketplace listings, and notifications. This gives a realistic feel to every page in the app.

## New Startups (9 total)

Designed for maximum variety across stage, status, country, sector, and accelerator:

| # | Name | Industry | Sector | Country | Stage | Deal Status | Pool Status |
|---|------|----------|--------|---------|-------|-------------|-------------|
| 4 | Paylo | Fintech | B2B | France | seed | live | live (85% funded) |
| 5 | MediScan | HealthTech | B2B2C | Spain | series-a | live | live (40% funded) |
| 6 | FarmStack | AgriTech | B2B | Ireland | pre-seed | upcoming | upcoming |
| 7 | CloudShield | Cybersecurity | B2B | Estonia | seed | closed | active |
| 8 | EduVerse | EdTech | B2C | Portugal | pre-seed | upcoming | upcoming |
| 9 | LogiRoute | Logistics | B2B2C | Poland | seed | closed | active |
| 10 | BioNova | BioTech | B2B | Switzerland | series-a | closed | active |
| 11 | StyleLoop | Fashion Tech | B2C | Sweden | seed | filled | settling |
| 12 | UrbanNest | PropTech | B2B2C | Austria | pre-seed | failed | failed |

Each startup includes: full founders (2-3), highlights (5), risks (4), exit objectives (3-5), company updates where relevant, accelerator for some (mix of YC, Techstars, 500 Global, none), realistic valuations, and varied min tickets (100-500).

## Additional Mock Data

- **9 new pools** (pool-4 to pool-12) matching each deal, with varied funding levels and timelines
- **4 new positions** for the demo user in completed pools (CloudShield, LogiRoute, BioNova) to enrich the portfolio page
- **3 new marketplace listings** from different sellers to populate the Resale Board with more variety
- **4 new notifications** for the new live/upcoming pools
- **3 new transactions** for the new investments

## Store Migration

Bump persist version from `2` to `3` with the same reset migration to ensure fresh data loads automatically.

## Technical Details

**File modified**: `src/data/mockData.ts` (bulk of changes -- adding 9 deals, 9 pools, 4 positions, 3 listings, 4 notifications, 3 transactions)

**File modified**: `src/store/appStore.ts` (version bump `2` -> `3`)

No type changes needed -- all new data uses existing interfaces.

