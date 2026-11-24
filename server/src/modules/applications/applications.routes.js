// server/src/modules/applications/applications.routes.js
const express = require('express');
const router = express.Router();
const { pool } = require('../../db');

// GET /api/v1/applications
router.get('/', async (req, res) => {
  try {
    const sql = `
      SELECT 
        a.id,
        a.job_id,
        a.full_name,
        a.email,
        a.phone,
        a.cv_url,
        a.cover_letter,
        a.portfolio,
        a.status,
        a.created_at,
        j.title AS job_title,
        j.company_name,
        j.company_logo,
        j.location,
        j.salary_min,
        j.salary_max
      FROM job_applications a
      JOIN jobs j ON a.job_id = j.id
      ORDER BY a.id DESC
    `;

    const result = await pool.query(sql);

    const applications = result.rows.map(row => ({
      id: String(row.id),
      jobId: String(row.job_id),
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
      salary: `$${(Number(row.salary_min) / 1000).toFixed(0)}k - $${(Number(row.salary_max) / 1000).toFixed(0)}k`,
      appliedDate: new Date(row.created_at).toISOString().split('T')[0],
    }));

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

// POST /api/v1/applications
router.post('/', async (req, res) => {
  try {
    const {
      jobId,
      fullName,
      email,
      phone,
      cvUrl,
      coverLetter,
      portfolio,
    } = req.body;

    const numJobId = parseInt(jobId, 10);

    const insertSql = `
      INSERT INTO job_applications (
        job_id, full_name, email, phone, cv_url, cover_letter, portfolio, status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, 'Pending Review')
      RETURNING *
    `;

    const result = await pool.query(insertSql, [
      numJobId,
      fullName || 'Applicant',
      email || 'applicant@example.com',
      phone || '',
      cvUrl || 'Resume.pdf',
      coverLetter || '',
      portfolio || '',
    ]);

    // Increment applicants_count on jobs table
    await pool.query(
      'UPDATE jobs SET applicants_count = applicants_count + 1 WHERE id = $1',
      [numJobId]
    );

    const row = result.rows[0];

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully',
      data: {
        id: String(row.id),
        jobId: String(row.job_id),
        fullName: row.full_name,
        email: row.email,
        phone: row.phone,
        cvUrl: row.cv_url,
        status: row.status,
        appliedDate: new Date(row.created_at).toISOString().split('T')[0],
      },
    });
  } catch (error) {
    console.error('Error creating application:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit application',
      error: error.message,
    });
  }
});

module.exports = router;
