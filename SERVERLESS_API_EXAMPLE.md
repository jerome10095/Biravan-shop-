Serverless API Example (Vercel/Node + pg)

Purpose
Provide minimal server endpoints to replace client-side Supabase calls. These examples assume an existing Neon Postgres DATABASE_URL set as an environment variable in the deployment platform.

Install (for example project)
 - npm init -y
 - npm i pg
 - (Optional) npm i dotenv

ENV (server only)
 - DATABASE_URL=postgres://user:pass@host:5432/dbname
 - CLOUDINARY_CLOUD_NAME=...
 - CLOUDINARY_UPLOAD_PRESET=...
 - ORDER_WHATSAPP_NUMBER=+
 - ADMIN_JWT_SECRET=...

Example: GET /api/products (Vercel serverless function)

// Node (CommonJS or ESM depending on platform)
const { Pool } = require('pg');
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

module.exports = async (req, res) => {
  try {
    const cachedMaxAge = 60; // 60s edge cache; tune as needed
    res.setHeader('Cache-Control', `public, s-maxage=${cachedMaxAge}, stale-while-revalidate=30`);
    const r = await pool.query('SELECT id, name, price, images, category FROM products WHERE active = true ORDER BY sort_order');
    res.status(200).json(r.rows);
  } catch (err) {
    console.error('products error', err);
    res.status(500).json({ error: 'internal' });
  }
};

Example: POST /api/orders (validate + write + enqueue on failure)

const { Pool } = require('pg');
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).end();
  const body = req.body;
  // Basic validation — expand as needed
  if (!body.fullName || !body.phone || !Array.isArray(body.items) || body.items.length === 0) {
    return res.status(400).json({ error: 'invalid' });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const orderId = body.id || ('BV-' + Math.floor(100000 + Math.random() * 900000));
    await client.query(
      'INSERT INTO orders (id, customer_name, phone, address, items, subtotal, total, payment_method, created_at) VALUES ($1,$2,$3,$4,$5,$6,$7,$8, now())',
      [orderId, body.fullName, body.phone, body.address || '', JSON.stringify(body.items), body.subtotal || 0, body.total || 0, body.paymentMethod || '']
    );
    await client.query('COMMIT');
    // Optionally trigger downstream tasks (email, Slack, WhatsApp) asynchronously
    res.status(201).json({ id: orderId, status: 'created' });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('order write failed', err);
    // Fallback: enqueue to durable store (Redis/Upstash) or save to a local queue table
    // Respond with 202 Accepted + enqueue id for later retry
    res.status(202).json({ status: 'queued', error: 'temporary' });
  } finally {
    client.release();
  }
};

Notes
 - Use a proper migration tool for schema management.
 - For production, enable connection pooling compatible with serverless (Neon pooling or PgBouncer).
 - For caching on Vercel use Cache-Control headers; Vercel will cache at the edge for s-maxage.
 - Protect admin endpoints with JWT and validate tokens server-side.
 - For long-running retries use a durable queue (Upstash Redis, SQS, or a DB table with a worker process).

Next steps
 - Ask to generate concrete serverless files in the repo (I can add an /api/ folder with these handlers) and update frontend calls to use /api/* instead of Supabase client.