// server/src/modules/jobs/jobs.routes.js
const express = require('express');
const router = express.Router();
const { pool } = require('../../db');

// Helper to map DB columns (snake_case) to API properties (camelCase)
const mapJob = (row) => ({
  id: String(row.id),
  title: row.title,
  company: row.company_name,
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
  requirements: Array.isArray(row.requirements) ? row.requirements : (typeof row.requirements === 'string' ? JSON.parse(row.requirements) : []),
  benefits: Array.isArray(row.benefits) ? row.benefits : (typeof row.benefits === 'string' ? JSON.parse(row.benefits) : []),
  status: row.status,
  featured: Boolean(row.featured),
  applicantsCount: Number(row.applicants_count || 0),
  postedAt: row.posted_at || 'Recently',
  createdAt: row.created_at,
});

// GET /api/v1/jobs
router.get('/', async (req, res) => {
  try {
    const { query, location, category, workplaceType, jobType, featured } = req.query;

    let sql = 'SELECT * FROM jobs WHERE status = \'PUBLISHED\'';
    const params = [];
    let paramIndex = 1;

    if (query) {
      sql += ` AND (LOWER(title) LIKE $${paramIndex} OR LOWER(company_name) LIKE $${paramIndex} OR LOWER(description) LIKE $${paramIndex})`;
      params.push(`%${query.toLowerCase()}%`);
      paramIndex++;
    }

    if (location) {
      sql += ` AND LOWER(location) LIKE $${paramIndex}`;
      params.push(`%${location.toLowerCase()}%`);
      paramIndex++;
    }

    if (category && category !== 'All') {
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

    sql += ' ORDER BY id DESC';

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

// GET /api/v1/jobs/:id
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const numId = parseInt(id, 10);

    let result;
    if (!isNaN(numId)) {
      result = await pool.query('SELECT * FROM jobs WHERE id = $1', [numId]);
    } else {
      result = await pool.query('SELECT * FROM jobs WHERE id = $1', [id]);
    }

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Job not found',
      });
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

// POST /api/v1/jobs
router.post('/', async (req, res) => {
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

    const sql = `
      INSERT INTO jobs (
        title, company_name, company_logo, category, job_type,
        workplace_type, location, salary_min, salary_max, experience_level,
        description, requirements, benefits, status, featured, posted_at
      ) VALUES (
        $1, $2, $3, $4, $5,
        $6, $7, $8, $9, $10,
        $11, $12, $13, 'PUBLISHED', false, 'Just now'
      ) RETURNING *
    `;

    const values = [
      title || 'Software Engineer',
      company || 'Tech Company',
      companyLogo || '💼',
      category || 'Software Engineering',
      jobType || 'Full-time',
      workplaceType || 'Remote',
      location || 'San Francisco, CA',
      Number(salaryMin) || 100000,
      Number(salaryMax) || 150000,
      experienceLevel || 'Mid-Level',
      description || '',
      JSON.stringify(requirements || []),
      JSON.stringify(benefits || []),
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

module.exports = router;
