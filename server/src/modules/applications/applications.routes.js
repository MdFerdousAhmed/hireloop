// server/src/modules/applications/applications.routes.js
const express = require('express');
const router = express.Router();
const { pool } = require('../../db');
const authenticate = require('../../middleware/auth');
const roleCheck = require('../../middleware/role');

function mapApplication(row) {
  return {
    id: String(row.id),
    jobId: String(row.job_id),
    userId: row.user_id || null,
    jobTitle: row.job_title,
    company: row.company_name,
    companyLogo: row.company_logo || '💼',
    fullName: row.full_name,
    email: row.email,
    phone: row.phone,
    cvUrl: row.cv_url,
    coverLetter: row.cover_letter,
    portfolio: row.portfolio,
    status: row.status,
    location: row.location,
    salary: `$${Math.round(Number(row.salary_min) / 1000)}k - $${Math.round(Number(row.salary_max) / 1000)}k`,
    appliedDate: row.created_at ? new Date(row.created_at).toISOString().split('T')[0] : '',
    createdAt: row.created_at,
  };
}

// GET /api/v1/applications (protected, scoped by user role)
router.get('/', authenticate, async (req, res) => {
  try {
    let sql;
    let params = [];

    if (req.user.role === 'ADMIN') {
      sql = `
        SELECT a.*, j.title AS job_title, j.company_name, j.company_logo, j.location, j.salary_min, j.salary_max
        FROM job_applications a
        JOIN jobs j ON a.job_id = j.id
        ORDER BY a.id DESC
      `;
    } else if (req.user.role === 'EMPLOYER') {
      const uRes = await pool.query('SELECT company_id FROM users WHERE id = $1', [req.user.id]);
      const companyId = uRes.rows[0]?.company_id || null;
      sql = `
        SELECT a.*, j.title AS job_title, j.company_name, j.company_logo, j.location, j.salary_min, j.salary_max
        FROM job_applications a
        JOIN jobs j ON a.job_id = j.id
        WHERE j.posted_by = $1
           OR ($2::int IS NOT NULL AND j.company_id = $2::int)
        ORDER BY a.id DESC
      `;
      params = [req.user.id, companyId];
    } else {
      sql = `
        SELECT a.*, j.title AS job_title, j.company_name, j.company_logo, j.location, j.salary_min, j.salary_max
        FROM job_applications a
        JOIN jobs j ON a.job_id = j.id
        WHERE a.user_id = $1 OR LOWER(a.email) = LOWER($2)
        ORDER BY a.id DESC
      `;
      params = [req.user.id, req.user.email];
    }

    const result = await pool.query(sql, params);
    const applications = result.rows.map(mapApplication);

    res.json({
      success: true,
      count: applications.length,
      data: applications,
    });
  } catch (error) {
    console.error('Error fetching applications:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve applications',
      error: error.message,
    });
  }
});

// POST /api/v1/applications (protected: authenticated candidate/user)
router.post('/', authenticate, async (req, res) => {
  const { jobId, fullName, email, phone, cvUrl, coverLetter, portfolio } = req.body;
  const numJobId = parseInt(jobId, 10);

  if (isNaN(numJobId)) {
    return res.status(400).json({ success: false, message: 'Valid jobId is required.' });
  }

  const applicantEmail = String(email || req.user.email).trim().toLowerCase();
  const applicantName = String(fullName || '').trim();
  if (!applicantName) {
    return res.status(400).json({ success: false, message: 'Full name is required.' });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const jobRes = await client.query('SELECT id, status FROM jobs WHERE id = $1', [numJobId]);
    if (jobRes.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ success: false, message: 'Job not found.' });
    }
    if (jobRes.rows[0].status !== 'PUBLISHED') {
      await client.query('ROLLBACK');
      return res.status(400).json({ success: false, message: 'This position is no longer accepting applications.' });
    }

    const dupCheck = await client.query(
      'SELECT id FROM job_applications WHERE job_id = $1 AND (user_id = $2 OR LOWER(email) = $3)',
      [numJobId, req.user.id, applicantEmail]
    );
    if (dupCheck.rows.length > 0) {
      await client.query('ROLLBACK');
      return res.status(409).json({ success: false, message: 'You have already applied to this position.' });
    }

    const result = await client.query(
      `INSERT INTO job_applications (
         job_id, user_id, full_name, email, phone, cv_url, cover_letter, portfolio, status
       ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'Pending Review')
       RETURNING *`,
      [
        numJobId,
        req.user.id,
        applicantName,
        applicantEmail,
        phone || '',
        cvUrl || 'Resume.pdf',
        coverLetter || '',
        portfolio || '',
      ]
    );

    await client.query(
      'UPDATE jobs SET applicants_count = applicants_count + 1 WHERE id = $1',
      [numJobId]
    );

    await client.query('COMMIT');

    const row = result.rows[0];
    res.status(201).json({
      success: true,
      message: 'Application submitted successfully',
      data: {
        id: String(row.id),
        jobId: String(row.job_id),
        userId: row.user_id,
        fullName: row.full_name,
        email: row.email,
        phone: row.phone,
        cvUrl: row.cv_url,
        status: row.status,
        appliedDate: new Date(row.created_at).toISOString().split('T')[0],
      },
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error creating application:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit application',
      error: error.message,
    });
  } finally {
    client.release();
  }
});

// PATCH /api/v1/applications/:id/status (Employer owner or Admin)
router.patch('/:id/status', authenticate, roleCheck(['EMPLOYER', 'ADMIN']), async (req, res) => {
  try {
    const appId = parseInt(req.params.id, 10);
    const { status } = req.body;
    const allowed = ['Pending Review', 'Under Review', 'Shortlisted', 'Interview', 'Offer', 'Hired', 'Rejected'];

    if (isNaN(appId)) {
      return res.status(400).json({ success: false, message: 'Invalid application ID' });
    }
    if (!allowed.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid application status' });
    }

    const appRes = await pool.query(
      `SELECT a.*, j.posted_by, j.company_id
       FROM job_applications a
       JOIN jobs j ON a.job_id = j.id
       WHERE a.id = $1`,
      [appId]
    );
    if (appRes.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    const appRow = appRes.rows[0];
    if (req.user.role !== 'ADMIN' && appRow.posted_by !== req.user.id) {
      const uRes = await pool.query('SELECT company_id FROM users WHERE id = $1', [req.user.id]);
      if (!uRes.rows[0]?.company_id || uRes.rows[0].company_id !== appRow.company_id) {
        return res.status(403).json({ success: false, message: 'Forbidden' });
      }
    }

    const updated = await pool.query(
      'UPDATE job_applications SET status = $1 WHERE id = $2 RETURNING *',
      [status, appId]
    );

    res.json({ success: true, data: updated.rows[0] });
  } catch (error) {
    console.error('Error updating application status:', error);
    res.status(500).json({ success: false, message: 'Failed to update status' });
  }
});

module.exports = router;
