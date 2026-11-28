// server/src/modules/public/public.routes.js
const express = require('express');
const router = express.Router();
const { pool } = require('../../db');

// GET /api/v1/stats/public
router.get('/stats/public', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        (SELECT COUNT(*)::int FROM jobs WHERE status = 'PUBLISHED') AS active_jobs,
        (SELECT COUNT(*)::int FROM companies WHERE verification_status != 'REJECTED') AS total_companies,
        (SELECT COUNT(*)::int FROM users WHERE role = 'CANDIDATE') AS total_candidates,
        (SELECT COUNT(*)::int FROM job_applications) AS total_applications
    `);
    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    console.error('Error fetching public stats:', err);
    res.status(500).json({ success: false, message: 'Failed to retrieve platform statistics' });
  }
});

// POST /api/v1/contact
router.post('/contact', async (req, res) => {
  const { name, email, subject, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ success: false, message: 'Name, email, and message are required.' });
  }
  try {
    const result = await pool.query(
      `INSERT INTO contact_messages (name, email, subject, message)
       VALUES ($1, $2, $3, $4)
       RETURNING id, created_at`,
      [String(name).trim(), String(email).trim(), subject || 'General Inquiry', String(message).trim()]
    );
    res.status(201).json({ success: true, message: 'Message received', data: result.rows[0] });
  } catch (err) {
    console.error('Error saving contact message:', err);
    res.status(500).json({ success: false, message: 'Failed to send message' });
  }
});

module.exports = router;
