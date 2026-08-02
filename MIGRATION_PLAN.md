Neon Migration Plan — Biravan Shop

Goal
Move from Supabase free-tier (pauses) to Neon-managed Postgres and front the DB with a server-side API so users never see DB pauses. Zero-downtime approach preferred.

Phases (high level)
1) Assessment
 - Inventory: schema, sizes, queries (products, orders, admin). Identify hot paths: product reads, order writes, admin CRUD.
 - Note env usage in repo (VITE_SUPABASE_*, VITE_CLOUDINARY_*).

2) Provision Neon
 - Create Neon project, copy DATABASE_URL into CI/host secrets.
 - Enable serverless pooling if available (Neon pooling or PgBouncer).

3) Export schema & initial data (quick path)
 - From Supabase (pg host/credentials available in Supabase project settings):
   pg_dump --host=HOST --port=5432 --username=postgres --format=custom --no-owner --schema-only -f schema.dump
   pg_dump --host=HOST --port=5432 --username=postgres --format=custom --no-owner --data-only -f data.dump
 - Restore to Neon:
   pg_restore --host=<host> --dbname="$NEON_DATABASE_URL" --no-owner -v schema.dump
   pg_restore --host=<host> --dbname="$NEON_DATABASE_URL" --no-owner -v data.dump
 - Validate sequences: run SELECT setval(pg_get_serial_sequence(...)) as needed.

4) Incremental sync (zero-downtime option)
 - Option A (recommended zero-downtime): enable logical replication/CDC from Supabase -> stream to Neon until cutover.
   - Use wal2json + a small consumer or Debezium to capture changes and apply them to Neon.
 - Option B (fast cutover): schedule short write freeze, run final data dump, restore to Neon, switch API envs.

5) Build server-side API layer
 - Replace direct client-side Supabase usage with server endpoints.
 - Suggested endpoints:
   GET /api/products            — cached at edge (CDN) — public
   GET /api/products/:id        — public
   POST /api/orders             — validate → store → enqueue notifications
   /admin/* endpoints           — protected, requires JWT/auth
 - Deployment targets: Vercel, Netlify, Fly, or any node host.
 - Use server-only DATABASE_URL; never expose DB credentials to client.

6) Caching & resilience
 - Cache product list at edge (Cache-Control or ISR). Revalidate on product updates.
 - Use a durable queue (Upstash Redis, queue table, or serverless queue) for writes that fail temporarily.
 - POST /orders returns Accepted (202) if enqueued and not yet persisted; track with an ID.

7) CI/CD and migrations
 - Add migrations (node-pg-migrate, knex, or Flyway), and run migrations in CI before deployment.
 - GitHub Actions: install, npm ci, run build, run smoke tests, run migrations, deploy.

8) Monitoring & alerts
 - Health endpoint /api/health
 - DB metrics, connection pool metrics, and error logging (Sentry or Logflare).
 - Uptime checks (Pingdom, UptimeRobot).

9) Rollback plan
 - Keep Supabase project untouched until Neon is validated.
 - To rollback: repoint API envs to Supabase and restore Neon snapshot for further debugging.

Security
 - Remove Supabase anon key from client after migration. If client needs authenticated DB access, issue short-lived tokens from API.
 - Protect admin endpoints with JWT/session auth.
 - Use Neon-managed backups and daily snapshots.

Validation
 - Row counts and checksums between DBs (SELECT COUNT(*) and sample rows).
 - Full e2e test (product listing → checkout → order saved)
 - Playwright smoke test configured in CI.

Estimated effort
 - Small project: 1–3 days (dump/restore + API + caching)
 - Full zero-downtime with CDC: 3–7 days

Next immediate tasks (pick one)
 - A: Build serverless API skeleton (code snippets + .env.example) — quick to start.
 - B: Run schema export from Supabase and create Neon project.
 - C: Add CI secrets and prepare migrations.

Notes
 - This repo uses Cloudinary for uploads and had client Supabase usage; code references in src/Components/Admin/store.js must be replaced to call server endpoints.
 - Keep Supabase as fallback read replica for a short period if desired.

Contact
Reply with which immediate task to run and whether zero-downtime CDC is required. If "start now" means provisioning Neon and creating API code, confirm and provide Neon credentials (or create the Neon project and give me the DATABASE_URL to use in examples and CI secrets).