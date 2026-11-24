// src/db/schema/companies.js
const { pgTable, serial, varchar, text, timestamp } = require('drizzle-orm/pg-core');

const companies = pgTable('companies', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  logo: varchar('logo', { length: 255 }).default('🏢'),
  website: varchar('website', { length: 255 }),
  location: varchar('location', { length: 255 }),
  industry: varchar('industry', { length: 255 }),
  size: varchar('size', { length: 100 }),
  description: text('description'),
  verification_status: varchar('verification_status', { length: 32 }).notNull().default('VERIFIED'),
  created_at: timestamp('created_at').defaultNow(),
});

module.exports = { companies };
