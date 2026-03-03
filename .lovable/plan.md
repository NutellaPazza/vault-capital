

# Fix UI Issues: Alignment, Mobile Landing, and Live Vault Consistency

## Issues Identified (from screenshots)

1. **Stats cards alignment** (image 1) -- P&L card text not vertically aligned with other cards
2. **Hero subtitle wrapping** (image 2) -- "SPV held positions." breaks onto a second line awkwardly on mobile
3. **"How It Works" CTA** (image 2) -- ghost button looks weak/broken on mobile, needs outline
4. **Excessive whitespace on mobile** (image 3) -- too much padding between sections on landing page mobile view
5. **Footer text wrapping** (image 4) -- footer links wrap badly on mobile, poor font sizing
6. **Live Vaults showing "Ended"** (image 5) -- pools with `pool_status: 'live'` but expired `end_datetime` appear in Live Vaults section with "Ended" label -- logical contradiction

## Plan

### 1. Fix Stats Card Alignment (DashboardPage.tsx)
Ensure all 4 stat cards have consistent vertical alignment. The icon + text layout needs `items-center` and equal minimum heights so the P&L card (with its extra percentage line) doesn't push other content out of alignment.

### 2. Fix Hero Subtitle on Mobile (HeroSection.tsx)
Change the subtitle from a multi-line paragraph to a single-line approach on mobile. Use `whitespace-nowrap` or restructure the text to fit in one line on small screens. Alternatively, reduce font size on mobile so it fits.

### 3. Fix "How It Works" CTA (HeroSection.tsx)
Change the ghost button to `variant="outline"` so it has a visible border on mobile. Ghost buttons are nearly invisible on light backgrounds.

### 4. Reduce Landing Page Whitespace on Mobile (LandingPage.tsx + HeroSection.tsx)
Reduce `py-16` to `py-10` or `py-8` on mobile for landing page sections. Use responsive padding: `py-8 md:py-16`.

### 5. Fix Footer Mobile Layout (LandingPage.tsx)
Make footer links wrap gracefully on mobile: use `flex-wrap` and `justify-center`, reduce gaps, and ensure consistent font sizing. Stack copyright on its own line on mobile.

### 6. Fix Live Vault Consistency (appStore.ts)
Filter `getLivePools()` to also check `new Date(pool.end_datetime) > new Date()`. Pools whose time has expired should not appear in the "Live Vaults" section regardless of their `pool_status` field. This prevents the "LIVE" + "Ended" contradiction.

## Files to Modify
- `src/pages/DashboardPage.tsx` -- stats card alignment
- `src/components/landing/HeroSection.tsx` -- subtitle + CTA + spacing
- `src/pages/LandingPage.tsx` -- section padding + footer
- `src/store/appStore.ts` -- `getLivePools` filter logic

