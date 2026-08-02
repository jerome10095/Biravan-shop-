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
      const r = await pool.query('SELECT id, name, category, price, stock, tag, description, images, colors, created_at, updated_at FROM products ORDER BY id');
      return res.status(200).json(r.rows);
    }

    if (req.method === 'POST') {
      const body = req.body;
      const r = await pool.query(
        `INSERT INTO products (name, category, price, stock, tag, description, images, colors, created_at, updated_at) VALUES ($1,$2,$3,$4,$5,$6,$7,$8, now(), now()) RETURNING id`,
        [body.name, body.category, body.price || 0, body.stock || null, body.tag || null, body.description || '', JSON.stringify(body.images || []), JSON.stringify(body.colors || [])]
      );
      // notify clients to revalidate / trigger webhook if desired
      return res.status(201).json({ id: r.rows[0].id });
    }

    // For update/delete we expect /api/admin_products?id=123 and method PATCH/DELETE
    const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
    const id = url.searchParams.get('id');
    if (!id) return res.status(400).json({ error: 'missing id' });

    if (req.method === 'PATCH' || req.method === 'PUT') {
      const body = req.body;
      await pool.query(
        `UPDATE products SET name=$1, category=$2, price=$3, stock=$4, tag=$5, description=$6, images=$7, colors=$8, updated_at=now() WHERE id=$9`,
        [body.name, body.category, body.price || 0, body.stock || null, body.tag || null, body.description || '', JSON.stringify(body.images || []), JSON.stringify(body.colors || []), id]
      );
      return res.status(200).json({ ok: true });
    }

    if (req.method === 'DELETE') {
      await pool.query('DELETE FROM products WHERE id = $1', [id]);
      return res.status(200).json({ ok: true });
    }

    res.status(405).end();
  } catch (err) {
    console.error('api/admin_products error', err);
    res.status(500).json({ error: 'internal' });
  }
};