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
