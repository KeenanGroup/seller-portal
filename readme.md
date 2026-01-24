# Keenan Group Seller Portal

Standalone seller portal for weekly property updates at `sellers.thekeenangroup.com`.

## URLs

- Production: https://sellers.thekeenangroup.com
- Property portals: https://sellers.thekeenangroup.com/[property-slug]

## Tech Stack

- **Framework**: Next.js 15
- **Styling**: Tailwind CSS
- **CMS**: Sanity (shared with main platform)
- **Analytics**: Supabase (view tracking)
- **Hosting**: Vercel

## Development

```bash
npm install
npm run dev
```

Runs on http://localhost:3334

## Environment Variables

Copy `.env.example` to `.env.local` and fill in:

- `SANITY_PROJECT_ID` - Sanity project ID
- `SANITY_DATASET` - Sanity dataset (production)
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anon key

## Deployment

Push to main branch auto-deploys to Vercel.

## Adding Portals

1. Create seller portal in Sanity Studio
2. Set the slug (e.g., `9112-balcones-club-dr`)
3. Portal is immediately accessible at the URL
