const { Pool } = require('pg');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

function parseUrl(req) {
  const host = req.headers.host || 'localhost';
  return new URL(req.url, `http://${host}`);
}

module.exports = async (req, res) => {
  try {
    const url = parseUrl(req);
    const id = url.searchParams.get('id');

    if (req.method === 'GET') {
      if (id) {
        const q = 'SELECT id, name, category, price, stock, tag, description, images, colors, created_at, updated_at FROM products WHERE id = $1 LIMIT 1';
        const r = await pool.query(q, [id]);
        if (r.rows.length === 0) return res.status(404).json({ error: 'not found' });
        return res.status(200).json(r.rows[0]);
      }

      const r = await pool.query('SELECT id, name, category, price, stock, tag, description, images, colors, created_at, updated_at FROM products WHERE COALESCE(active, true) = true ORDER BY id');
      res.setHeader('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=30');
      return res.status(200).json(r.rows);
    }

    res.status(405).end();
  } catch (err) {
    console.error('api/products error', err);
    res.status(500).json({ error: 'internal' });
  }
};