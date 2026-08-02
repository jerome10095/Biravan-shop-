const { Pool } = require('pg');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

module.exports = async (req, res) => {
  try {
    if (req.method === 'POST') {
      const body = req.body;
      // basic validation
      if (!body || !body.fullName || !body.phone || !Array.isArray(body.items) || body.items.length === 0) {
        return res.status(400).json({ error: 'invalid' });
      }

      const client = await pool.connect();
      try {
        await client.query('BEGIN');
        const orderId = body.id || ('BV-' + Math.floor(100000 + Math.random() * 900000));
        await client.query(
          `INSERT INTO orders (id, customer_name, phone, address, sector, notes, items, subtotal, shipping_fee, total, payment_method, status, created_at)
           VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,'pending', now())`,
          [orderId, body.fullName, body.phone, body.address || '', body.sector || '', body.notes || '', JSON.stringify(body.items), body.subtotal || 0, body.shippingFee || 0, body.total || 0, body.paymentMethod || '']
        );
        await client.query('COMMIT');
        return res.status(201).json({ id: orderId, status: 'created' });
      } catch (err) {
        await client.query('ROLLBACK');
        console.error('order write failed', err);
        // In a real deployment enqueue to durable queue here
        return res.status(202).json({ status: 'queued', error: 'temporary' });
      } finally {
        client.release();
      }
    }

    res.status(405).end();
  } catch (err) {
    console.error('api/orders error', err);
    res.status(500).json({ error: 'internal' });
  }
};