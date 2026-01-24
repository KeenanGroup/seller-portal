# Seller Portal Enhancement Roadmap
*Created: 2025-12-23 | Last Updated: 2025-12-23*

Future enhancements for the seller portal at sellers.thekeenangroup.com

---

## Market Intelligence

- [ ] **Comparable Sales Widget** - Recent sold/pending within 0.5 mile, price/sqft comparison
- [ ] **Days on Market Benchmark** - How this listing compares to neighborhood average DOM
- [ ] **Inventory Tracker** - Active listings in price range, absorption rate, months of supply
- [ ] **Price History Timeline** - Visual timeline showing price changes with market context

## Competitive Positioning

- [ ] **Active Competition Grid** - Similar listings nearby with price/sqft, beds/baths, DOM
- [ ] **Price Position Indicator** - Where listing sits in the competitive set (overpriced/underpriced visual)
- [ ] **Feature Comparison Matrix** - How property stacks up on key features vs competition

## Buyer Behavior Analytics

- [ ] **Traffic Trends Chart** - Week-over-week line graph of views, not just point-in-time
- [ ] **Device Breakdown** - Mobile vs desktop vs tablet (buyer seriousness indicator)
- [ ] **Peak Activity Times** - Heatmap showing when buyers are viewing (day/hour)
- [ ] **Repeat Visitor Count** - High-intent signal when same IP returns multiple times

## Showing Intelligence

- [ ] **Feedback Word Cloud** - Aggregated themes from all showing feedback
- [ ] **Interest Level Trend** - Average buyer interest score over time
- [ ] **Showing-to-Feedback Ratio** - How many agents actually respond
- [ ] **Brokerage Breakdown** - Which brokerages are bringing buyers

## Communication Hub

- [ ] **Agent Notes Section** - Private notes from Keenan Group visible to seller
- [ ] **FAQ from Showings** - Common questions agents/buyers are asking
- [ ] **Action Items Tracker** - Checklist of recommended improvements with status

## Visual Upgrades

- [ ] **Activity Timeline** - Vertical timeline showing all events (showings, price changes, offers)
- [ ] **Photo Gallery Analytics** - Which listing photos get most engagement (if data available)
- [ ] **Neighborhood Map** - Actual map showing sold comps, active competition (Mapbox)

## Forecasting

- [ ] **Price Scenario Calculator** - "At $X price, expect Y% more showings based on market data"
- [ ] **Optimal Timing Insights** - Best days/times for open houses based on historical data
- [ ] **Days to Contract Estimate** - Predictive model based on current activity levels

## Integration Opportunities

- [ ] **Zillow/Redfin Saves** - If accessible via scraping or API
- [ ] **Social Media Metrics** - If listing promoted on Instagram/Facebook
- [ ] **Email Campaign Stats** - If blast sent to buyer database

---

## Priority Matrix

### Quick Wins (Existing Data)
1. Traffic trends chart
2. Activity timeline
3. Days on market benchmark
4. Agent notes section

### High Impact (New Data Required)
1. Comparable sales widget
2. Active competition grid
3. Mapbox neighborhood map

---

## Technical Notes

- Current stack: Next.js 15.1.9, Sanity CMS, Tailwind CSS
- Deployed: sellers.thekeenangroup.com (Vercel)
- Password protection: Street number (e.g., 9112)
