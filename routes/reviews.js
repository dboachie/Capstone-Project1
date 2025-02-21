const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const { authenticateToken } = require('../middleware/auth');


router.get('/', authenticateToken, async (req, res, next) => {
  try {
    const result = await pool.query(

      `SELECT * FROM reviews
      WHERE user_id = $1
      `, [req.user.id]
    );
    res.json(result.rows);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Server error' });
  }
});



router.post('/', authenticateToken, async (req, res, next) => {
  try {
    const { rating, title, content, visit_date } = req.body;
    console.log(req.body)

    const result = await pool.query(
      `INSERT INTO reviews (user_id, rating, title, content, visit_date)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [req.user.id, rating, title, content, visit_date]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    if (err.code === '23505') {
      return res.status(400).json({ error: 'You have already reviewed this place' });
    }
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.put('/:id', authenticateToken, async (req, res, next) => {
  try {
    const { rating, content } = req.body;
    const result = await pool.query(
      `UPDATE reviews 
       SET rating = $1, content = $2, updated_at = CURRENT_TIMESTAMP
       WHERE id = $3 AND user_id = $4
       RETURNING *`,
      [rating, content, req.params.id, req.user.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Review not found or unauthorized' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.delete('/:id', authenticateToken, async (req, res, next) => {
  try {
    const result = await pool.query(
      'DELETE FROM reviews WHERE id = $1 AND user_id = $2 RETURNING *',
      [req.params.id, req.user.id]
    );
    console.log(result);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Review not found or unauthorized' });
    }
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;