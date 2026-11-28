const {
  pgTable,
  uuid,
  varchar,
  text,
  boolean,
  timestamp,
  integer,
  jsonb,
} = require("drizzle-orm/pg-core");

const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 120 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  role: varchar("role", { length: 50 }).notNull().default("CANDIDATE"),
  isActive: boolean("is_active").notNull().default(true),
  headline: varchar("headline", { length: 255 }),
  location: varchar("location", { length: 255 }),
  bio: text("bio"),
  skills: jsonb("skills").default([]),
  phone: varchar("phone", { length: 60 }),
  portfolio: varchar("portfolio", { length: 500 }),
  resumeName: varchar("resume_name", { length: 255 }),
  companyName: varchar("company_name", { length: 255 }),
  companyId: integer("company_id"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

module.exports = {
  users,
};
