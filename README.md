# Facebook Growth Autopilot (MVP)

Approval-first tool for Facebook Page content research, drafting, and official Meta Graph API publishing.

## What works
- RSS-based fresh-topic research
- Freshness scoring + duplicate removal
- Draft generation placeholder
- Approval queue
- Facebook Page credential validation
- Facebook Page text-post publishing through Graph API
- Responsive dashboard
- Rate limiting and basic HTTP hardening

## Local setup
1. Install Node.js 20+.
2. Copy `.env.example` to `.env`.
3. Run `npm install`.
4. Run `npm run dev`.
5. Open `http://localhost:3000`.

## Connect a Facebook Page
Configure a Meta developer app for the Facebook Page you manage and obtain a Page access token with the permissions needed to read the Page identity and publish Page posts.

Set these values only in your local or hosting environment:

```env
META_GRAPH_VERSION=v26.0
FACEBOOK_PAGE_ID=your_page_id
FACEBOOK_PAGE_ACCESS_TOKEN=your_page_access_token
```

Never paste a real Page token, App Secret, or other credential into source files or commit it to GitHub.

After deployment, open the dashboard and press **Test Facebook**. The backend validates the credentials against Graph API and returns only the Page id/name to the browser; it never returns the token.

## Safety choices
- Approval mode is on by default.
- This MVP does not automate a personal Facebook Profile.
- It does not simulate likes, follows, comments, browser activity, or engagement manipulation.
- Tokens are read from environment variables only.

## Next modules
- Real AI provider adapter
- Supabase persistence/auth
- Image generation / licensed-image provider
- Scheduling
- Page Insights + learning loop
- Source verification / fact-check workflow
- Multi-page support
