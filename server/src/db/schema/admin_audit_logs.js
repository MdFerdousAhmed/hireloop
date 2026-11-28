// src/db/schema/admin_audit_logs.js
const { pgTable, uuid, varchar, jsonb, timestamp } = require('drizzle-orm/pg-core');

const admin_audit_logs = pgTable('admin_audit_logs', {
  id: uuid('id').defaultRandom().primaryKey(),
  admin_id: varchar('admin_id', { length: 255 }).notNull(),
  action: varchar('action', { length: 120 }).notNull(),
  resource: varchar('resource', { length: 60 }).notNull(),
  resource_id: varchar('resource_id', { length: 255 }),
  details: jsonb('details'),
  performed_at: timestamp('performed_at', { withTimezone: true }).defaultNow().notNull(),
});

module.exports = { admin_audit_logs };
