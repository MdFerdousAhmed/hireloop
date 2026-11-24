// src/utils/adminAudit.js
const db = require('../db');
const { admin_audit_logs } = require('../db/schema/admin_audit_logs');

/**
 * Record an admin action for audit purposes.
 * @param {string} adminId - UUID of the admin performing the action.
 * @param {string} action - Action name (e.g., 'VERIFY_COMPANY').
 * @param {string} resource - Resource type (e.g., 'company', 'user', 'job').
 * @param {string|null} resourceId - UUID of the affected resource (if applicable).
 * @param {object} [details] - Additional JSON data describing the change.
 */
const logAdminAction = async (adminId, action, resource, resourceId = null, details = {}) => {
  await db
    .insert(admin_audit_logs)
    .values({
      admin_id: adminId,
      action,
      resource,
      resource_id: resourceId,
      details,
    })
    .run();
};

module.exports = { logAdminAction };
