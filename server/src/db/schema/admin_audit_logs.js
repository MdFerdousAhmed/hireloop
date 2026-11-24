// src/db/schema/admin_audit_logs.js
const { pgTable, uuid, varchar, jsonb, timestamp } = require('drizzle-orm/pg-core');

const admin_audit_logs = pgTable('admin_audit_logs', {
  id: uuid('id').defaultRandom().primaryKey(),
  admin_id: uuid('admin_id').notNull(), // FK to users.id (ADMIN)
  action: varchar('action', { length: 120 }).notNull(), // e.g. 'VERIFY_COMPANY', 'CHANGE_USER_ROLE'
  resource: varchar('resource', { length: 60 }).notNull(), // e.g. 'company', 'user', 'job'
  resource_id: uuid('resource_id'), // may be null for generic actions
  details: jsonb('details'), // arbitrary extra data
  performed_at: timestamp('performed_at', { withTimezone: true }).defaultNow().notNull(),
});

module.exports = { admin_audit_logs };
