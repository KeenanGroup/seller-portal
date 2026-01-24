# Agent Commentary & Next Steps Implementation Guide
*Created: 2025-12-19 | Last Updated: 2025-12-19*

## Overview

This guide shows how to add personalized agent commentary and next steps to each seller portal landing page.

---

## Current Sanity Schema

The `sellerUpdate` schema already supports:
- `agentCommentary` (Portable Text / Rich Text)
- `nextSteps` (Array of strings)

These fields are ready to use - just need to populate content in Sanity Studio.

---

## How to Add Content in Sanity Studio

### 1. Navigate to Sanity Studio
- Go to: https://keenan-group.sanity.studio/
- Login with your credentials

### 2. Find Seller Update
- Click "Seller Update" in the left sidebar
- Find the listing you want to edit (e.g., "9112 Balcones Club Dr - Week of 2025-12-16")

### 3. Add Agent Commentary
Scroll to "Our Analysis & Recommendations" section and click the rich text editor.

**Template Structure:**
```
[Opening: Weekly Performance Summary]

[Middle: Market Context & Insights]

[Close: Recommendation or Reassurance]
```

### 4. Add Next Steps
Scroll to "Action Items & Next Steps" and click "+ Add item"

Each step should be:
- Actionable (starts with a verb)
- Specific (not vague)
- Time-bound if applicable

---

## Agent Commentary Templates by Scenario

### Template 1: High Activity, Good Engagement
```
This week showed strong buyer interest across multiple channels. We had [X] showings
from [Y] different brokerages, indicating broad market exposure beyond just Compass agents.

The [traffic/agent views/favorites] metrics are particularly encouraging - this level
of engagement typically precedes serious offers within 2-3 weeks based on our historical
data in [neighborhood].

Continue with current strategy. The property is performing well against neighborhood
comps at this price point.
```

**Next Steps:**
- Follow up with all showing agents for detailed feedback
- Monitor pending sales in [neighborhood] for pricing signals
- Maintain property presentation and availability for short-notice showings

---

### Template 2: Strong Online Traffic, Few Showings
```
Your listing is generating excellent online exposure with [X] total views this week,
but we're seeing slower conversion to in-person showings. This gap between digital
interest and physical tours is common in the [$price range] market during [season].

The high time-on-page ([X]s average) suggests genuine buyer interest, not casual browsing.
Buyers at this level often take 3-4 weeks of research before requesting showings.

We're confident the current momentum will translate to showings in the next 7-14 days.
The [specific feature] continues to be a strong differentiator based on listing performance.
```

**Next Steps:**
- Continue current marketing push across all platforms
- Prepare showing availability for likely uptick in next 2 weeks
- Review upcoming open house strategy for [date]

---

### Template 3: Market Adjustment Recommendation
```
After [X] days on market and [Y] showings, we're seeing a pattern that suggests a price
adjustment would accelerate buyer interest. Comparable sales in [neighborhood] have closed
at [$X]-[$Y] over the past 30 days.

The property feedback has been consistently positive on [features], but [X] agents have
mentioned price sensitivity relative to recent comps. A strategic reduction to [$new price]
would likely position us competitively for the upcoming [holiday/season] market.

This is not a reflection on the property's quality - it's a data-driven market positioning
strategy based on current buyer behavior in [neighborhood].
```

**Next Steps:**
- Review detailed comp analysis and discuss pricing strategy
- Consider [amount] reduction to [$new price] to capture year-end buyers
- Schedule follow-up call to review options and timeline

---

### Template 4: Steady Progress, Stay the Course
```
Your property continues to perform consistently with [X] showings this week, maintaining
pace with neighborhood averages. The mix of Compass and external brokerages indicates
healthy cross-market exposure.

OneHome metrics show [X] agent views and [Y] client portal shares - this agent network
activity is a leading indicator that we should see continued showing requests. Properties
in this category typically sell within [timeframe] of listing.

No changes needed to current strategy. Market conditions remain favorable and your property
is positioned well.
```

**Next Steps:**
- Continue monitoring showing activity and feedback
- Maintain property condition and showing availability
- Review market updates weekly as new comps emerge

---

### Template 5: New Listing, Building Momentum
```
Your first full week on market generated [X] showings and [Y] online views - strong initial
performance for a [price range] listing in [neighborhood]. The Compass Concierge system
pre-qualified [Z] buyers, ensuring only serious, vetted prospects tour your home.

We're seeing particularly strong interest from [buyer demographic/area] based on traffic
analytics. The [specific feature] is resonating well in agent feedback.

First 2-3 weeks typically set the tone. Current metrics suggest we're on track for an offer
within [timeframe] based on historical patterns for comparable properties.
```

**Next Steps:**
- Collect and analyze all showing feedback from this initial wave
- Adjust showing availability to accommodate increased interest
- Prepare for likely offer activity in next 10-14 days

---

## Property-Specific Commentary Examples

### 9112 Balcones Club Dr ($950K, Northwest Hills)

**Agent Commentary:**
```
Exceptional showing activity this week with 23 tours - well above neighborhood averages.
The mix of independent brokerages (Bodor, Pacesetter, Trinity Texas) alongside Compass
agents indicates strong cross-market appeal.

Compass metrics showing 2,036 views (+22%) and nearly 50 views per visitor suggests
buyers are doing deep research on your property - reviewing multiple photos, studying
the floorplan, comparing value. This level of engagement is a strong precursor to offers.

The 582 agent views in OneHome and 203 client portal shares mean your listing is actively
circulating in the agent community. Properties with this profile typically receive offers
within 2-3 weeks of this activity level.
```

**Next Steps:**
- Follow up with all 23 showing agents - prioritize recent weekend tours
- Review feedback patterns for any recurring concerns or praise
- Maintain weekend showing availability - expect continued strong traffic
- Monitor pending sales in Northwest Hills 78750 for competitive pricing intel

---

### 1709 Crested Butte Dr ($1.895M, Westlake Hills)

**Agent Commentary:**
```
Luxury market timing is working in our favor. December traditionally sees serious buyers
with year-end urgency, and your 6 showings this week from qualified agents reflects that.

The property's single-story layout on half-acre in Westlake Hills is a rare find - only
2 comparable active listings currently, both priced higher. This scarcity gives us
excellent positioning as we head into the new year buying season.

Eanes ISD continues to drive demand. The school district's reputation brings out-of-state
buyers who appreciate the value compared to California markets they're leaving.
```

**Next Steps:**
- Coordinate showing feedback from Westlake-specialist agents
- Highlight single-story layout advantage in agent outreach
- Prepare for potential multiple-offer scenario based on inventory constraints
- Review out-of-state buyer financing timelines

---

### 303 Ridgewood Rd (Contact for Pricing)

**Agent Commentary:**
```
[Custom commentary based on your specific situation with this property - appears to be
a unique pricing strategy. Add context about target buyer, property positioning, etc.]
```

**Next Steps:**
- [Custom next steps based on property strategy]

---

## Implementation Checklist

For each active listing:

- [ ] Write custom Agent Commentary (200-300 words)
- [ ] Add 3-5 Next Steps (specific, actionable)
- [ ] Include property-specific details (neighborhood, price range, features)
- [ ] Reference actual data from latest update (showings, views, etc.)
- [ ] Set appropriate tone (encouraging, strategic, data-driven)
- [ ] Proofread for accuracy and professionalism
- [ ] Publish update in Sanity

---

## Writing Guidelines

**DO:**
- Use specific numbers from the report
- Reference neighborhood by name
- Mention brokerage diversity
- Compare to market averages when available
- Give realistic timelines based on data
- Address both strengths and opportunities

**DON'T:**
- Use generic platitudes ("your beautiful home")
- Make promises ("will sell next week")
- Ignore weak metrics - address them strategically
- Over-explain obvious data (they can see the numbers)
- Use jargon without context

**Tone:**
- Confident expert
- Data-driven
- Warm but professional
- Honest and strategic
- Forward-looking

---

## Next Steps Best Practices

**Good Next Steps:**
```
✅ Follow up with showing agents by Friday for detailed buyer feedback
✅ Schedule photographer for updated exterior shots (holiday lights)
✅ Review comp analysis for 3 pending sales closing before year-end
✅ Confirm availability for potential New Year's weekend showing surge
```

**Bad Next Steps:**
```
❌ Wait and see what happens
❌ Continue marketing (too vague)
❌ Hope for the best
❌ Follow up with agents (no timeline, not specific enough)
```

---

## Frequency

- Update Agent Commentary: **Weekly** with each new report
- Update Next Steps: **Weekly** - roll forward incomplete, add new
- Customize for Market Changes: **As needed** (price changes, new comps, holidays)

---

*For questions about implementation, contact the tech team or refer to Sanity schema documentation.*
