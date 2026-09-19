# Facebook Growth Autopilot (MVP)

Approval-first tool for Facebook Page content research, drafting, and official Meta Graph API publishing.

## What works in this starter
- RSS-based fresh-topic research
- Simple freshness scoring + duplicate removal
- Draft generation placeholder
- Approve queue
- Facebook Page text-post publishing through Graph API
- Lightweight responsive dashboard
- Rate limiting and basic HTTP hardening

## Setup
1. Install Node.js 20+.
2. Copy `.env.example` to `.env`.
3. Run `npm install`.
4. Run `npm run dev`.
5. Open `http://localhost:3000`.

## Facebook setup
Fill these environment variables after creating/configuring a Meta app and obtaining a Page access token with the permissions required for your use case:

- `FACEBOOK_PAGE_ID`
- `FACEBOOK_PAGE_ACCESS_TOKEN`
- `META_GRAPH_VERSION`

Do not commit tokens to GitHub.

## Important design choice
This MVP is approval-first. It does not automate a personal Facebook Profile and does not simulate browser activity, likes, follows, comments, or other engagement manipulation.

## Next modules
- Real AI provider adapter
- Supabase persistence/auth
- Image generation / licensed-image provider
- Scheduling
- Page Insights + learning loop
- Source verification / fact-check workflow
- Multi-page support
