// src/modules/admin-dashboard/admin-dashboard.controller.js
const { paginationSchema, userFilterSchema, companyFilterSchema, jobFilterSchema } = require('./admin-dashboard.schemas');
const {
  getDashboardData,
  listUsers,
  listCompanies,
  listJobs,
  moderateJob,
  updateUser,
  verifyCompany,
  listAuditLogs,
} = require('./admin-dashboard.service');

// Helper to parse and validate query params
const parseQuery = (schema, query) => schema.parse(query);

// GET /api/v1/admin-dashboard – overview
const getDashboard = async (req, res) => {
  try {
    const data = await getDashboardData();
    res.json({ success: true, data });
  } catch (err) {
    console.error('Admin dashboard error:', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// GET /api/v1/admin-dashboard/audit-logs
const getAuditLogs = async (req, res) => {
  try {
    const data = await listAuditLogs(25);
    res.json({ success: true, data });
  } catch (err) {
    console.error('Admin audit logs error:', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// GET /api/v1/admin-dashboard/users – paginated user list with filters
const getUsers = async (req, res) => {
  try {
    const filters = parseQuery(userFilterSchema, req.query);
    const data = await listUsers(filters);
    res.json({ success: true, data });
  } catch (err) {
    console.error('Admin list users error:', err);
    res.status(400).json({ success: false, message: err.message });
  }
};

// GET /api/v1/admin-dashboard/companies – company list with filters
const getCompanies = async (req, res) => {
  try {
    const filters = parseQuery(companyFilterSchema, req.query);
    const data = await listCompanies(filters);
    res.json({ success: true, data });
  } catch (err) {
    console.error('Admin list companies error:', err);
    res.status(400).json({ success: false, message: err.message });
  }
};

// GET /api/v1/admin-dashboard/jobs – job list with filters
const getJobs = async (req, res) => {
  try {
    const filters = parseQuery(jobFilterSchema, req.query);
    const data = await listJobs(filters);
    res.json({ success: true, data });
  } catch (err) {
    console.error('Admin list jobs error:', err);
    res.status(400).json({ success: false, message: err.message });
  }
};

// PATCH /api/v1/admin-dashboard/jobs/:jobId – moderate job status
const patchJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const status = String(req.body.status || '').toUpperCase();
    const allowed = ['PENDING', 'PUBLISHED', 'REJECTED', 'CLOSED'];
    if (!allowed.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid job status' });
    }
    await moderateJob(req.user.id, jobId, status);
    res.json({ success: true, message: 'Job status updated' });
  } catch (err) {
    console.error('Admin moderate job error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// PATCH /api/v1/admin-dashboard/users/:userId – update user (role / isActive)
const patchUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const updates = {};
    if (req.body.role) {
      const role = String(req.body.role).toUpperCase();
      if (!['CANDIDATE', 'EMPLOYER', 'ADMIN'].includes(role)) {
        return res.status(400).json({ success: false, message: 'Invalid user role' });
      }
      updates.role = role;
    }
    if (typeof req.body.isActive === 'boolean') updates.isActive = req.body.isActive;
    if (Object.keys(updates).length === 0) return res.status(400).json({ success: false, message: 'No updates provided' });
    await updateUser(req.user.id, userId, updates);
    res.json({ success: true, message: 'User updated' });
  } catch (err) {
    console.error('Admin update user error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// PATCH /api/v1/admin-dashboard/companies/:companyId – verify/reject company
const patchCompany = async (req, res) => {
  try {
    const { companyId } = req.params;
    const verificationStatus = String(req.body.verificationStatus || '').toUpperCase();
    if (!['PENDING', 'VERIFIED', 'REJECTED'].includes(verificationStatus)) {
      return res.status(400).json({ success: false, message: 'Invalid verificationStatus' });
    }
    await verifyCompany(req.user.id, companyId, verificationStatus);
    res.json({ success: true, message: 'Company verification status updated' });
  } catch (err) {
    console.error('Admin verify company error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
  getDashboard,
  getUsers,
  getCompanies,
  getJobs,
  getAuditLogs,
  patchJob,
  patchUser,
  patchCompany,
};
