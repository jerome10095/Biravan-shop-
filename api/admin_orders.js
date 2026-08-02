const { Pool } = require('pg');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const ADMIN_KEY = process.env.ADMIN_JWT_SECRET || process.env.ADMIN_KEY || 'changeme';

function isAdmin(req) {
  const key = req.headers['x-admin-key'] || req.headers['authorization']?.replace(/^Bearer\s+/, '') || '';
  return key === ADMIN_KEY;
}

module.exports = async (req, res) => {
  try {
    if (!isAdmin(req)) return res.status(401).json({ error: 'unauthorized' });

    if (req.method === 'GET') {
      const r = await pool.query('SELECT id, customer_name, phone, address, sector, notes, items, subtotal, shipping_fee, total, payment_method, status, created_at, updated_at FROM orders ORDER BY created_at DESC');
      return res.status(200).json(r.rows);
    }

    const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
    const id = url.searchParams.get('id');
    if (!id) return res.status(400).json({ error: 'missing id' });

    if (req.method === 'PATCH' || req.method === 'PUT') {
      const { status } = req.body;
      await pool.query('UPDATE orders SET status=$1, updated_at=now() WHERE id=$2', [status, id]);
      return res.status(200).json({ ok: true });
    }

    res.status(405).end();
  } catch (err) {
    console.error('api/admin_orders error', err);
    res.status(500).json({ error: 'internal' });
  }
};