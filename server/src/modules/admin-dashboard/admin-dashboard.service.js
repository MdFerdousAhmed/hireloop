// src/modules/admin-dashboard/admin-dashboard.service.js
const db = require('../../db'); // Drizzle instance
const { and, eq, or, sql } = require('drizzle-orm');

// Import required tables (assume they exist)
const { users } = require('../../db/schema/users');
const { jobs } = require('../../db/schema/jobs');
const { job_applications } = require('../../db/schema/job_applications');
const { companies } = require('../../db/schema/companies');
const { admin_audit_logs } = require('../../db/schema/admin_audit_logs');

/**
 * Core admin dashboard data aggregation.
 * @param {Object} opts - pagination / filter options
 */
const getDashboardData = async (opts = {}) => {
  // 1️⃣ Global stats
  const stats = await db.select({
    totalUsers: sql`COUNT(*)`.as('total_users'),
    totalCandidates: sql`COUNT(*) FILTER (WHERE role = 'CANDIDATE')`.as('total_candidates'),
    totalEmployers: sql`COUNT(*) FILTER (WHERE role = 'EMPLOYER')`.as('total_employers'),
    totalAdmins: sql`COUNT(*) FILTER (WHERE role = 'ADMIN')`.as('total_admins'),
    totalCompanies: sql`COUNT(*)`.as('total_companies'),
    totalJobs: sql`COUNT(*)`.as('total_jobs'),
    pendingJobs: sql`COUNT(*) FILTER (WHERE status = 'PENDING')`.as('pending_jobs'),
    publishedJobs: sql`COUNT(*) FILTER (WHERE status = 'PUBLISHED')`.as('published_jobs'),
    totalApplications: sql`COUNT(job_applications.id)`.as('total_applications'),
  })
    .from(users)
    .crossJoin(companies) // dummy cross join to allow multiple tables in one SELECT
    .crossJoin(jobs)
    .crossJoin(job_applications);

  // 2️⃣ Recent registrations (users) – newest first
  const recentRegistrations = await db
    .select({ id: users.id, name: users.name, email: users.email, role: users.role, createdAt: users.createdAt })
    .from(users)
    .orderBy(users.createdAt.desc())
    .limit(10);

  // 3️⃣ Application status breakdown (overall)
  const appStatusBreakdown = await db
    .select({ status: job_applications.status, count: sql`COUNT(*)`.as('cnt') })
    .from(job_applications)
    .groupBy(job_applications.status);

  // 4️⃣ Job performance stats – average applications per job etc.
  const jobPerformance = await db
    .select({
      avgApps: sql`AVG(app_cnt)::numeric(10,2)`.as('avg_applications'),
      maxApps: sql`MAX(app_cnt)`.as('max_applications'),
      minApps: sql`MIN(app_cnt)`.as('min_applications'),
    })
    .from(
      db
        .select({ job_id: jobs.id, app_cnt: sql`COUNT(job_applications.id)`.as('app_cnt') })
        .from(jobs)
        .leftJoin(job_applications, eq(job_applications.job_id, jobs.id))
        .groupBy(jobs.id)
        .as('job_stats')
    );

  // 5️⃣ Recent audit logs (latest 10 actions)
  const recentAuditLogs = await db
    .select({
      id: admin_audit_logs.id,
      adminId: admin_audit_logs.admin_id,
      action: admin_audit_logs.action,
      resource: admin_audit_logs.resource,
      resourceId: admin_audit_logs.resource_id,
      details: admin_audit_logs.details,
      performedAt: admin_audit_logs.performed_at,
    })
    .from(admin_audit_logs)
    .orderBy(admin_audit_logs.performed_at.desc())
    .limit(10);

  return { stats: stats[0], recentRegistrations, appStatusBreakdown, jobPerformance: jobPerformance[0], recentAuditLogs };
};

/**
 * Helper to fetch paginated & filtered lists.
 */
const listUsers = async (filters) => {
  const { page, limit, role, isActive } = filters;
  const whereClauses = [];
  if (role) whereClauses.push(eq(users.role, role));
  if (typeof isActive === 'boolean') whereClauses.push(eq(users.isActive, isActive));

  const baseQuery = db.select({ id: users.id, name: users.name, email: users.email, role: users.role, isActive: users.isActive, createdAt: users.createdAt }).from(users);
  const filtered = whereClauses.length ? baseQuery.where(and(...whereClauses)) : baseQuery;

  const rows = await filtered.orderBy(users.createdAt.desc()).limit(limit).offset((page - 1) * limit);
  const total = await db.select({ count: sql`COUNT(*)`.as('cnt') }).from(users).where(whereClauses.length ? and(...whereClauses) : undefined);

  return {
    rows,
    pagination: { page, limit, total: Number(total[0].count), totalPages: Math.ceil(Number(total[0].count) / limit) },
  };
};

const listCompanies = async (filters) => {
  const { page, limit, verificationStatus } = filters;
  const where = verificationStatus ? eq(companies.verification_status, verificationStatus) : undefined;

  const rows = await db
    .select({ id: companies.id, name: companies.name, verificationStatus: companies.verification_status, createdAt: companies.created_at })
    .from(companies)
    .where(where)
    .orderBy(companies.created_at.desc())
    .limit(limit)
    .offset((page - 1) * limit);

  const total = await db.select({ count: sql`COUNT(*)`.as('cnt') }).from(companies).where(where);

  return { rows, pagination: { page, limit, total: Number(total[0].count), totalPages: Math.ceil(Number(total[0].count) / limit) } };
};

const listJobs = async (filters) => {
  const { page, limit, status } = filters;
  const where = status ? eq(jobs.status, status) : undefined;

  const rows = await db
    .select({ id: jobs.id, title: jobs.title, status: jobs.status, companyId: jobs.company_id, createdAt: jobs.created_at })
    .from(jobs)
    .where(where)
    .orderBy(jobs.created_at.desc())
    .limit(limit)
    .offset((page - 1) * limit);

  const total = await db.select({ count: sql`COUNT(*)`.as('cnt') }).from(jobs).where(where);

  return { rows, pagination: { page, limit, total: Number(total[0].count), totalPages: Math.ceil(Number(total[0].count) / limit) } };
};

/**
 * Update a job's status – used for moderation (publish, reject, close).
 */
const moderateJob = async (adminId, jobId, newStatus) => {
  await db.update(jobs).set({ status: newStatus }).where(eq(jobs.id, jobId)).run();
  // Log the moderation action
  const { logAdminAction } = require('../../utils/adminAudit');
  await logAdminAction(adminId, 'MODERATE_JOB', 'job', jobId, { newStatus });
};

/**
 * Change a user's role or activation status.
 */
const updateUser = async (adminId, userId, updates) => {
  await db.update(users).set(updates).where(eq(users.id, userId)).run();
  const { logAdminAction } = require('../../utils/adminAudit');
  await logAdminAction(adminId, 'UPDATE_USER', 'user', userId, updates);
};

/**
 * Verify or reject a company.
 */
const verifyCompany = async (adminId, companyId, newStatus) => {
  await db.update(companies).set({ verification_status: newStatus }).where(eq(companies.id, companyId)).run();
  const { logAdminAction } = require('../../utils/adminAudit');
  await logAdminAction(adminId, 'VERIFY_COMPANY', 'company', companyId, { newStatus });
};

module.exports = {
  getDashboardData,
  listUsers,
  listCompanies,
  listJobs,
  moderateJob,
  updateUser,
  verifyCompany,
};
