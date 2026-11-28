// src/db/schema/jobs.js
const { pgTable, serial, varchar, text, timestamp, integer, boolean, jsonb } = require('drizzle-orm/pg-core');
const { companies } = require('./companies');

const jobs = pgTable('jobs', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  company_id: integer('company_id').references(() => companies.id),
  company_name: varchar('company_name', { length: 255 }).notNull(),
  company_logo: varchar('company_logo', { length: 255 }).default('💼'),
  category: varchar('category', { length: 120 }).notNull(),
  job_type: varchar('job_type', { length: 60 }).notNull().default('Full-time'),
  workplace_type: varchar('workplace_type', { length: 60 }).notNull().default('Remote'),
  location: varchar('location', { length: 255 }).notNull(),
  salary_min: integer('salary_min').notNull().default(100000),
  salary_max: integer('salary_max').notNull().default(150000),
  currency: varchar('currency', { length: 10 }).notNull().default('USD'),
  experience_level: varchar('experience_level', { length: 60 }).notNull().default('Mid-Level'),
  description: text('description').notNull(),
  requirements: jsonb('requirements').default([]),
  benefits: jsonb('benefits').default([]),
  status: varchar('status', { length: 32 }).notNull().default('PUBLISHED'), // PENDING, PUBLISHED, REJECTED, CLOSED
  featured: boolean('featured').notNull().default(false),
  applicants_count: integer('applicants_count').notNull().default(0),
  posted_by: varchar('posted_by', { length: 255 }),
  posted_at: varchar('posted_at', { length: 60 }).default('Just now'),
  created_at: timestamp('created_at').defaultNow(),
});

module.exports = { jobs };
