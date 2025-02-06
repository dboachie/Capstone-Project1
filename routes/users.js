const express = require('express');
const router = express.Router();
const { Client } = require('pg');
const client = new Client("postgres://dkb@localhost:5432/acme_world_travel_review_db");
const { authenticateToken } = require('../middleware/auth');
client.connect();
router.get('/profile', authenticateToken, async (req, res, next) => {
  try {
    const result = await client.query(
      'SELECT id, username, email, full_name, bio, country, created_at, role FROM users WHERE id = $1',
      [req.user.id]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});


router.get('/api/users/comments', authenticateToken, async (req, res, next) => {
  try {
    const result = await client.query(
      `SELECT c.*, r.title as review_title, p.name as place_name
         FROM comments c
         JOIN reviews r ON c.review_id = r.id
         JOIN places p ON r.place_id = p.id
         WHERE c.user_id = $1
         ORDER BY c.created_at DESC`,
      [req.user.id]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;