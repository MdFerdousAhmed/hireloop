// server/src/modules/companies/companies.routes.js
const express = require('express');
const router = express.Router();
const { pool } = require('../../db');
const authenticate = require('../../middleware/auth');
const roleCheck = require('../../middleware/role');

function mapCompany(row) {
  return {
    id: String(row.id),
    name: row.name,
    logo: row.logo || '🏢',
    website: row.website || '',
    location: row.location || '',
    industry: row.industry || 'Technology',
    size: row.size || '11-50 employees',
    description: row.description || '',
    verificationStatus: row.verification_status,
    openJobs: Number(row.open_jobs || 0),
    createdAt: row.created_at,
  };
}

// GET /api/v1/companies
router.get('/', async (req, res) => {
  try {
    const { query, industry, limit } = req.query;
    const params = [];
    let idx = 1;

    let sql = `
      SELECT c.*, COUNT(j.id) FILTER (WHERE j.status = 'PUBLISHED') AS open_jobs
      FROM companies c
      LEFT JOIN jobs j ON j.company_id = c.id OR LOWER(j.company_name) = LOWER(c.name)
      WHERE c.verification_status != 'REJECTED'
    `;

    if (query) {
      sql += ` AND (LOWER(c.name) LIKE $${idx} OR LOWER(COALESCE(c.industry,'')) LIKE $${idx} OR LOWER(COALESCE(c.location,'')) LIKE $${idx})`;
      params.push(`%${String(query).toLowerCase()}%`);
      idx++;
    }

    if (industry && industry !== 'All') {
      sql += ` AND LOWER(COALESCE(c.industry,'')) LIKE $${idx}`;
      params.push(`%${String(industry).toLowerCase()}%`);
      idx++;
    }

    sql += ' GROUP BY c.id ORDER BY open_jobs DESC, c.id ASC';

    if (limit && !isNaN(parseInt(limit, 10))) {
      sql += ` LIMIT $${idx}`;
      params.push(Math.min(Math.max(parseInt(limit, 10), 1), 100));
    }

    const result = await pool.query(sql, params);
    res.json({ success: true, count: result.rows.length, data: result.rows.map(mapCompany) });
  } catch (err) {
    console.error('Error fetching companies:', err);
    res.status(500).json({ success: false, message: 'Failed to retrieve companies' });
  }
});

// GET /api/v1/companies/me (protected Employer/Admin)
router.get('/me', authenticate, roleCheck(['EMPLOYER', 'ADMIN']), async (req, res) => {
  try {
    const userRes = await pool.query('SELECT company_id, company_name FROM users WHERE id = $1', [req.user.id]);
    const userRow = userRes.rows[0];

    let compRes;
    if (userRow?.company_id) {
      compRes = await pool.query(
        `SELECT c.*, COUNT(j.id) FILTER (WHERE j.status = 'PUBLISHED') AS open_jobs
         FROM companies c
         LEFT JOIN jobs j ON j.company_id = c.id
         WHERE c.id = $1
         GROUP BY c.id`,
        [userRow.company_id]
      );
    } else {
      compRes = await pool.query(
        `SELECT c.*, COUNT(j.id) FILTER (WHERE j.status = 'PUBLISHED') AS open_jobs
         FROM companies c
         LEFT JOIN jobs j ON j.company_id = c.id
         WHERE c.owner_id = $1
         GROUP BY c.id
         LIMIT 1`,
        [req.user.id]
      );
    }

    if (compRes.rows.length === 0) {
      return res.json({
        success: true,
        data: {
          name: userRow?.company_name || '',
          website: '',
          industry: '',
          size: '11-50 employees',
          location: '',
          description: '',
          verificationStatus: 'PENDING',
          openJobs: 0,
        },
      });
    }

    res.json({ success: true, data: mapCompany(compRes.rows[0]) });
  } catch (err) {
    console.error('Error fetching my company:', err);
    res.status(500).json({ success: false, message: 'Failed to retrieve company profile' });
  }
});

// PUT /api/v1/companies/me (protected Employer/Admin)
router.put('/me', authenticate, roleCheck(['EMPLOYER', 'ADMIN']), async (req, res) => {
  const { name, website, industry, size, location, description, logo } = req.body;
  if (!name || !String(name).trim()) {
    return res.status(400).json({ success: false, message: 'Company name is required.' });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const userRes = await client.query('SELECT company_id FROM users WHERE id = $1', [req.user.id]);
    let companyId = userRes.rows[0]?.company_id;

    let companyRow;
    if (companyId) {
      const upd = await client.query(
        `UPDATE companies
         SET name = $1, website = $2, industry = $3, size = $4, location = $5, description = $6, logo = COALESCE($7, logo)
         WHERE id = $8
         RETURNING *`,
        [String(name).trim(), website || '', industry || '', size || '11-50 employees', location || '', description || '', logo || null, companyId]
      );
      companyRow = upd.rows[0];
    } else {
      const ins = await client.query(
        `INSERT INTO companies (name, website, industry, size, location, description, logo, verification_status, owner_id)
         VALUES ($1, $2, $3, $4, $5, $6, $7, 'PENDING', $8)
         RETURNING *`,
        [String(name).trim(), website || '', industry || '', size || '11-50 employees', location || '', description || '', logo || '🏢', req.user.id]
      );
      companyRow = ins.rows[0];
      companyId = companyRow.id;
    }

    await client.query(
      'UPDATE users SET company_id = $1, company_name = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3',
      [companyId, companyRow.name, req.user.id]
    );

    await client.query('COMMIT');
    res.json({ success: true, data: mapCompany(companyRow) });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error saving company profile:', err);
    res.status(500).json({ success: false, message: 'Failed to update company profile' });
  } finally {
    client.release();
  }
});

module.exports = router;
