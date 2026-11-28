// server/src/modules/jobs/jobs.routes.js
const express = require('express');
const router = express.Router();
const { pool } = require('../../db');
const authenticate = require('../../middleware/auth');
const roleCheck = require('../../middleware/role');

const mapJob = (row) => ({
  id: String(row.id),
  title: row.title,
  company: row.company_name,
  companyId: row.company_id || null,
  companyLogo: row.company_logo || '💼',
  category: row.category,
  jobType: row.job_type,
  workplaceType: row.workplace_type,
  location: row.location,
  salaryMin: Number(row.salary_min),
  salaryMax: Number(row.salary_max),
  currency: row.currency || 'USD',
  experienceLevel: row.experience_level,
  description: row.description,
  requirements: Array.isArray(row.requirements)
    ? row.requirements
    : typeof row.requirements === 'string'
    ? JSON.parse(row.requirements || '[]')
    : [],
  benefits: Array.isArray(row.benefits)
    ? row.benefits
    : typeof row.benefits === 'string'
    ? JSON.parse(row.benefits || '[]')
    : [],
  status: row.status,
  featured: Boolean(row.featured),
  applicantsCount: Number(row.applicants_count || 0),
  postedBy: row.posted_by || null,
  postedAt: row.posted_at || 'Recently',
  createdAt: row.created_at,
});

// GET /api/v1/jobs
router.get('/', async (req, res) => {
  try {
    const { query, location, category, workplaceType, jobType, featured, company, limit } = req.query;

    let sql = "SELECT * FROM jobs WHERE status = 'PUBLISHED'";
    const params = [];
    let paramIndex = 1;

    if (query) {
      sql += ` AND (LOWER(title) LIKE $${paramIndex} OR LOWER(company_name) LIKE $${paramIndex} OR LOWER(description) LIKE $${paramIndex})`;
      params.push(`%${String(query).toLowerCase()}%`);
      paramIndex++;
    }

    if (company) {
      sql += ` AND LOWER(company_name) = $${paramIndex}`;
      params.push(String(company).toLowerCase());
      paramIndex++;
    }

    if (location && location !== 'All Locations') {
      if (String(location).toLowerCase() === 'remote') {
        sql += ` AND (LOWER(location) LIKE '%remote%' OR LOWER(workplace_type) = 'remote')`;
      } else {
        sql += ` AND LOWER(location) LIKE $${paramIndex}`;
        params.push(`%${String(location).toLowerCase()}%`);
        paramIndex++;
      }
    }

    if (category && category !== 'All' && category !== 'All Categories') {
      sql += ` AND category = $${paramIndex}`;
      params.push(category);
      paramIndex++;
    }

    if (workplaceType && workplaceType !== 'All') {
      sql += ` AND workplace_type = $${paramIndex}`;
      params.push(workplaceType);
      paramIndex++;
    }

    if (jobType && jobType !== 'All') {
      sql += ` AND job_type = $${paramIndex}`;
      params.push(jobType);
      paramIndex++;
    }

    if (featured === 'true') {
      sql += ` AND featured = true`;
    }

    sql += ' ORDER BY featured DESC, id DESC';

    if (limit && !isNaN(parseInt(limit, 10))) {
      sql += ` LIMIT $${paramIndex}`;
      params.push(Math.min(Math.max(parseInt(limit, 10), 1), 100));
    }

    const result = await pool.query(sql, params);
    const jobs = result.rows.map(mapJob);

    res.json({
      success: true,
      count: jobs.length,
      data: jobs,
    });
  } catch (error) {
    console.error('Error fetching jobs:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve jobs',
      error: error.message,
    });
  }
});

// GET /api/v1/jobs/employer/mine (protected: Employer/Admin)
router.get('/employer/mine', authenticate, roleCheck(['EMPLOYER', 'ADMIN']), async (req, res) => {
  try {
    const userRes = await pool.query('SELECT company_id, company_name FROM users WHERE id = $1', [req.user.id]);
    const userRow = userRes.rows[0];
    const companyId = userRow?.company_id || null;

    const sql = `
      SELECT * FROM jobs
      WHERE posted_by = $1
         OR ($2::int IS NOT NULL AND company_id = $2::int)
      ORDER BY id DESC
    `;
    const result = await pool.query(sql, [req.user.id, companyId]);
    res.json({ success: true, data: result.rows.map(mapJob) });
  } catch (error) {
    console.error('Error fetching employer jobs:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve employer jobs' });
  }
});

// GET /api/v1/jobs/saved/list (protected)
router.get('/saved/list', authenticate, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT j.*
       FROM saved_jobs s
       JOIN jobs j ON s.job_id = j.id
       WHERE s.user_id = $1
       ORDER BY s.created_at DESC`,
      [req.user.id]
    );
    res.json({ success: true, data: result.rows.map(mapJob) });
  } catch (error) {
    console.error('Error fetching saved jobs:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve saved jobs' });
  }
});

// POST /api/v1/jobs/:id/save (protected)
router.post('/:id/save', authenticate, async (req, res) => {
  try {
    const numId = parseInt(req.params.id, 10);
    if (isNaN(numId)) {
      return res.status(400).json({ success: false, message: 'Invalid job ID' });
    }

    const jobExists = await pool.query('SELECT id FROM jobs WHERE id = $1', [numId]);
    if (jobExists.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    const existing = await pool.query(
      'SELECT id FROM saved_jobs WHERE user_id = $1 AND job_id = $2',
      [req.user.id, numId]
    );

    if (existing.rows.length > 0) {
      await pool.query('DELETE FROM saved_jobs WHERE user_id = $1 AND job_id = $2', [req.user.id, numId]);
      return res.json({ success: true, data: { saved: false, jobId: String(numId) } });
    }

    await pool.query('INSERT INTO saved_jobs (user_id, job_id) VALUES ($1, $2)', [req.user.id, numId]);
    res.json({ success: true, data: { saved: true, jobId: String(numId) } });
  } catch (error) {
    console.error('Error toggling saved job:', error);
    res.status(500).json({ success: false, message: 'Failed to toggle saved job' });
  }
});

// GET /api/v1/jobs/:id
router.get('/:id', async (req, res) => {
  try {
    const numId = parseInt(req.params.id, 10);
    if (isNaN(numId)) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    const result = await pool.query('SELECT * FROM jobs WHERE id = $1', [numId]);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    res.json({
      success: true,
      data: mapJob(result.rows[0]),
    });
  } catch (error) {
    console.error('Error fetching job by ID:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve job details',
      error: error.message,
    });
  }
});

// POST /api/v1/jobs (protected: Employer/Admin)
router.post('/', authenticate, roleCheck(['EMPLOYER', 'ADMIN']), async (req, res) => {
  try {
    const {
      title,
      company,
      companyLogo,
      category,
      jobType,
      workplaceType,
      location,
      salaryMin,
      salaryMax,
      experienceLevel,
      description,
      requirements,
      benefits,
    } = req.body;

    if (!title || !description) {
      return res.status(400).json({ success: false, message: 'Job title and description are required.' });
    }

    const userRes = await pool.query('SELECT company_id, company_name FROM users WHERE id = $1', [req.user.id]);
    const userRow = userRes.rows[0];
    const resolvedCompanyName = company || userRow?.company_name || 'HireLoop Employer';
    const resolvedCompanyId = userRow?.company_id || null;

    const sql = `
      INSERT INTO jobs (
        title, company_id, company_name, company_logo, category, job_type,
        workplace_type, location, salary_min, salary_max, experience_level,
        description, requirements, benefits, status, featured, posted_by, posted_at
      ) VALUES (
        $1, $2, $3, $4, $5, $6,
        $7, $8, $9, $10, $11,
        $12, $13, $14, 'PUBLISHED', false, $15, 'Just now'
      ) RETURNING *
    `;

    const values = [
      String(title).trim(),
      resolvedCompanyId,
      resolvedCompanyName,
      companyLogo || '💼',
      category || 'Software Engineering',
      jobType || 'Full-time',
      workplaceType || 'Remote',
      location || 'Remote',
      Number(salaryMin) || 100000,
      Number(salaryMax) || 150000,
      experienceLevel || 'Mid-Level',
      String(description).trim(),
      JSON.stringify(Array.isArray(requirements) ? requirements : []),
      JSON.stringify(Array.isArray(benefits) ? benefits : []),
      req.user.id,
    ];

    const result = await pool.query(sql, values);
    const newJob = mapJob(result.rows[0]);

    res.status(201).json({
      success: true,
      message: 'Job opening posted successfully',
      data: newJob,
    });
  } catch (error) {
    console.error('Error creating job:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create job',
      error: error.message,
    });
  }
});

// PATCH /api/v1/jobs/:id (Employer owner or Admin)
router.patch('/:id', authenticate, roleCheck(['EMPLOYER', 'ADMIN']), async (req, res) => {
  try {
    const numId = parseInt(req.params.id, 10);
    if (isNaN(numId)) return res.status(400).json({ success: false, message: 'Invalid job ID' });

    const jobRes = await pool.query('SELECT * FROM jobs WHERE id = $1', [numId]);
    if (jobRes.rows.length === 0) return res.status(404).json({ success: false, message: 'Job not found' });

    const job = jobRes.rows[0];
    if (req.user.role !== 'ADMIN' && job.posted_by !== req.user.id) {
      const uRes = await pool.query('SELECT company_id FROM users WHERE id = $1', [req.user.id]);
      if (!uRes.rows[0]?.company_id || uRes.rows[0].company_id !== job.company_id) {
        return res.status(403).json({ success: false, message: 'Forbidden' });
      }
    }

    const { status } = req.body;
    const allowedStatuses = ['PUBLISHED', 'CLOSED', 'PENDING'];
    if (status && !allowedStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    const updated = await pool.query(
      'UPDATE jobs SET status = COALESCE($1, status) WHERE id = $2 RETURNING *',
      [status || null, numId]
    );
    res.json({ success: true, data: mapJob(updated.rows[0]) });
  } catch (error) {
    console.error('Error updating job:', error);
    res.status(500).json({ success: false, message: 'Failed to update job' });
  }
});

// DELETE /api/v1/jobs/:id (Employer owner or Admin)
router.delete('/:id', authenticate, roleCheck(['EMPLOYER', 'ADMIN']), async (req, res) => {
  try {
    const numId = parseInt(req.params.id, 10);
    if (isNaN(numId)) return res.status(400).json({ success: false, message: 'Invalid job ID' });

    const jobRes = await pool.query('SELECT * FROM jobs WHERE id = $1', [numId]);
    if (jobRes.rows.length === 0) return res.status(404).json({ success: false, message: 'Job not found' });

    const job = jobRes.rows[0];
    if (req.user.role !== 'ADMIN' && job.posted_by !== req.user.id) {
      const uRes = await pool.query('SELECT company_id FROM users WHERE id = $1', [req.user.id]);
      if (!uRes.rows[0]?.company_id || uRes.rows[0].company_id !== job.company_id) {
        return res.status(403).json({ success: false, message: 'Forbidden' });
      }
    }

    await pool.query('DELETE FROM jobs WHERE id = $1', [numId]);
    res.json({ success: true, message: 'Job deleted' });
  } catch (error) {
    console.error('Error deleting job:', error);
    res.status(500).json({ success: false, message: 'Failed to delete job' });
  }
});

module.exports = router;
