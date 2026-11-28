// src/modules/admin-dashboard/admin-dashboard.service.js
const { db, pool } = require('../../db');
const { and, desc, eq, sql } = require('drizzle-orm');

const { users } = require('../../db/schema/users');
const { jobs } = require('../../db/schema/jobs');
const { job_applications } = require('../../db/schema/job_applications');
const { companies } = require('../../db/schema/companies');
const { admin_audit_logs } = require('../../db/schema/admin_audit_logs');
const { logAdminAction } = require('../../utils/adminAudit');

/**
 * Core admin dashboard data aggregation using independent scalar subqueries
 * so empty tables never wipe out counts via cross joins.
 */
const getDashboardData = async () => {
  const statsRes = await pool.query(`
    SELECT
      (SELECT COUNT(*)::int FROM users) AS "totalUsers",
      (SELECT COUNT(*)::int FROM users WHERE role = 'CANDIDATE') AS "totalCandidates",
      (SELECT COUNT(*)::int FROM users WHERE role = 'EMPLOYER') AS "totalEmployers",
      (SELECT COUNT(*)::int FROM users WHERE role = 'ADMIN') AS "totalAdmins",
      (SELECT COUNT(*)::int FROM companies) AS "totalCompanies",
      (SELECT COUNT(*)::int FROM companies WHERE verification_status = 'PENDING') AS "pendingCompanies",
      (SELECT COUNT(*)::int FROM jobs) AS "totalJobs",
      (SELECT COUNT(*)::int FROM jobs WHERE status = 'PENDING') AS "pendingJobs",
      (SELECT COUNT(*)::int FROM jobs WHERE status = 'PUBLISHED') AS "publishedJobs",
      (SELECT COUNT(*)::int FROM job_applications) AS "totalApplications"
  `);

  const recentRegistrations = await db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      role: users.role,
      isActive: users.isActive,
      createdAt: users.createdAt,
    })
    .from(users)
    .orderBy(desc(users.createdAt))
    .limit(10);

  const appStatusBreakdown = await db
    .select({
      status: job_applications.status,
      count: sql`COUNT(*)::int`.as('cnt'),
    })
    .from(job_applications)
    .groupBy(job_applications.status);

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
    .orderBy(desc(admin_audit_logs.performed_at))
    .limit(10);

  return {
    stats: statsRes.rows[0],
    recentRegistrations,
    appStatusBreakdown,
    recentAuditLogs,
  };
};

const listUsers = async (filters) => {
  const { page, limit, role, isActive } = filters;
  const whereClauses = [];
  if (role) whereClauses.push(eq(users.role, role));
  if (typeof isActive === 'boolean') whereClauses.push(eq(users.isActive, isActive));

  const whereExpr = whereClauses.length ? and(...whereClauses) : undefined;

  const rows = await db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      role: users.role,
      isActive: users.isActive,
      companyName: users.companyName,
      createdAt: users.createdAt,
    })
    .from(users)
    .where(whereExpr)
    .orderBy(desc(users.createdAt))
    .limit(limit)
    .offset((page - 1) * limit);

  const total = await db
    .select({ count: sql`COUNT(*)::int`.as('cnt') })
    .from(users)
    .where(whereExpr);

  const totalCount = Number(total[0]?.count || 0);
  return {
    rows,
    pagination: { page, limit, total: totalCount, totalPages: Math.ceil(totalCount / limit) },
  };
};

const listCompanies = async (filters) => {
  const { page, limit, verificationStatus } = filters;
  const where = verificationStatus ? eq(companies.verification_status, verificationStatus) : undefined;

  const rows = await db
    .select({
      id: companies.id,
      name: companies.name,
      industry: companies.industry,
      location: companies.location,
      website: companies.website,
      verificationStatus: companies.verification_status,
      createdAt: companies.created_at,
    })
    .from(companies)
    .where(where)
    .orderBy(desc(companies.created_at))
    .limit(limit)
    .offset((page - 1) * limit);

  const total = await db.select({ count: sql`COUNT(*)::int`.as('cnt') }).from(companies).where(where);
  const totalCount = Number(total[0]?.count || 0);

  return {
    rows,
    pagination: { page, limit, total: totalCount, totalPages: Math.ceil(totalCount / limit) },
  };
};

const listJobs = async (filters) => {
  const { page, limit, status } = filters;
  const where = status ? eq(jobs.status, status) : undefined;

  const rows = await db
    .select({
      id: jobs.id,
      title: jobs.title,
      company: jobs.company_name,
      location: jobs.location,
      status: jobs.status,
      companyId: jobs.company_id,
      applicantsCount: jobs.applicants_count,
      createdAt: jobs.created_at,
    })
    .from(jobs)
    .where(where)
    .orderBy(desc(jobs.id))
    .limit(limit)
    .offset((page - 1) * limit);

  const total = await db.select({ count: sql`COUNT(*)::int`.as('cnt') }).from(jobs).where(where);
  const totalCount = Number(total[0]?.count || 0);

  return {
    rows,
    pagination: { page, limit, total: totalCount, totalPages: Math.ceil(totalCount / limit) },
  };
};

const moderateJob = async (adminId, jobId, newStatus) => {
  const numJobId = parseInt(jobId, 10);
  if (isNaN(numJobId)) throw new Error('Invalid job ID');
  await db.update(jobs).set({ status: newStatus }).where(eq(jobs.id, numJobId));
  await logAdminAction(adminId, 'MODERATE_JOB', 'job', numJobId, { newStatus });
};

const updateUser = async (adminId, userId, updates) => {
  await db.update(users).set(updates).where(eq(users.id, userId));
  await logAdminAction(adminId, 'UPDATE_USER', 'user', userId, updates);
};

const verifyCompany = async (adminId, companyId, newStatus) => {
  const numCompanyId = parseInt(companyId, 10);
  if (isNaN(numCompanyId)) throw new Error('Invalid company ID');
  await db.update(companies).set({ verification_status: newStatus }).where(eq(companies.id, numCompanyId));
  await logAdminAction(adminId, 'VERIFY_COMPANY', 'company', numCompanyId, { newStatus });
};

const listAuditLogs = async (limit = 20) => {
  return db
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
    .orderBy(desc(admin_audit_logs.performed_at))
    .limit(limit);
};

module.exports = {
  getDashboardData,
  listUsers,
  listCompanies,
  listJobs,
  moderateJob,
  updateUser,
  verifyCompany,
  listAuditLogs,
};
