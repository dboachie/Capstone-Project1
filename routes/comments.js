const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const { authenticateToken } = require('../middleware/auth');


router.get('/', authenticateToken, async (req, res) => {
  console.log(req.user)
  try {

    const result = await pool.query(
      `SELECT id, content, helpful_votes, report_count, moderation_status, created_at, updated_at
    FROM comments
    WHERE user_id = $1;`,
      [req.user.id]
    );
    console.log(result.rows)
    res.send(result.rows);

  }
  catch (err) {

    console.error(err);
    res.status(500).json({ error: 'Server error' });


  }
});

router.post('/', authenticateToken, async (req, res, next) => {
  try {
    const { rcomment } = req.body;
    console.log(req.body)

    const result = await pool.query(
      `INSERT INTO comments (user_id, comment)
       VALUES ($1, $2)
       RETURNING *`,
      [req.user.id, comments]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    if (err.code === '23505') {
      return res.status(400).json({ error: 'You have already commented this place' });
    }
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { content } = req.body;
    const result = await pool.query(
      `UPDATE comments 
      SET content = $1, updated_at = CURRENT_TIMESTAMP
      WHERE id = $2 AND user_id = $3
      RETURNING *`,
      [content, req.params.id, req.user.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Comment not found or unauthorized' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      'DELETE FROM comments WHERE id = $1 AND user_id = $2 RETURNING *',
      [req.params.id, req.user.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Comment not found or unauthorized' });
    }
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});



module.exports = router;