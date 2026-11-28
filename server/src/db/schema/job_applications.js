// src/db/schema/job_applications.js
const { pgTable, serial, integer, varchar, text, timestamp } = require('drizzle-orm/pg-core');

const job_applications = pgTable('job_applications', {
  id: serial('id').primaryKey(),
  job_id: integer('job_id').notNull(),
  user_id: varchar('user_id', { length: 255 }),
  full_name: varchar('full_name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  phone: varchar('phone', { length: 60 }),
  cv_url: varchar('cv_url', { length: 500 }),
  cover_letter: text('cover_letter'),
  portfolio: varchar('portfolio', { length: 500 }),
  status: varchar('status', { length: 60 }).notNull().default('Pending Review'),
  created_at: timestamp('created_at').defaultNow(),
});

module.exports = { job_applications };
