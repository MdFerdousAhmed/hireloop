// src/utils/adminAudit.js
const { db } = require('../db');
const { admin_audit_logs } = require('../db/schema/admin_audit_logs');

/**
 * Record an admin action for audit purposes.
 * @param {string} adminId - UUID/ID of the admin performing the action.
 * @param {string} action - Action name (e.g., 'VERIFY_COMPANY').
 * @param {string} resource - Resource type (e.g., 'company', 'user', 'job').
 * @param {string|number|null} resourceId - ID of the affected resource (if applicable).
 * @param {object} [details] - Additional JSON data describing the change.
 */
const logAdminAction = async (adminId, action, resource, resourceId = null, details = {}) => {
  await db.insert(admin_audit_logs).values({
    admin_id: String(adminId),
    action,
    resource,
    resource_id: resourceId !== null && resourceId !== undefined ? String(resourceId) : null,
    details,
  });
};

module.exports = { logAdminAction };
