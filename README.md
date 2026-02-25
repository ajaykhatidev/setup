# Meta Lead Webhook (Minimal)

This service only does 2 things:

1. Verify Meta webhook on `GET /webhook`
2. Receive leadgen events on `POST /webhook`, fetch lead details from Graph API, and upsert into Supabase `leads` table.

## Required env

- `VERIFY_TOKEN`
- `SYSTEM_USER_TOKEN` (preferred) or `PAGE_ACCESS_TOKEN`
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `GRAPH_API_VERSION` (optional, default `v25.0`)

## Run

```bash
npm start
```

## Table schema

Run [migration.sql](/Users/lj/Desktop/setup/crm-leads/migration.sql) in Supabase SQL editor.

## Keep alive for Render

Render free services can sleep after inactivity. This repo includes a keep-alive workflow:
[.github/workflows/keepalive.yml](/Users/lj/Desktop/setup/crm-leads/.github/workflows/keepalive.yml)

Setup:

1. Push this repo to GitHub.
2. In GitHub repo settings, add secret `RENDER_HEALTH_URL`.
3. Set its value to your Render health URL, for example:
   `https://setup-lbgn.onrender.com/health`
4. Workflow runs every 10 minutes and pings the URL.

If you need true always-on uptime, use a paid Render instance.
