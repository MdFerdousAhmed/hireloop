
const {
  pgTable,
  pgEnum,
  uuid,
  varchar,
  text,
  boolean,
  timestamp,
} = require("drizzle-orm/pg-core");

const userRole = pgEnum("user_role", [
  "CANDIDATE",
  "EMPLOYER",
  "ADMIN",
]);

const users = pgTable("users", {
  id: uuid("id")
    .defaultRandom()
    .primaryKey(),

  name: varchar("name", {
    length: 120,
  }).notNull(),

  email: varchar("email", {
    length: 255,
  })
    .notNull()
    .unique(),

  passwordHash: text("password_hash").notNull(),

  role: userRole("role")
    .notNull()
    .default("CANDIDATE"),

  isActive: boolean("is_active")
    .notNull()
    .default(true),

  createdAt: timestamp("created_at", {
    withTimezone: true,
  })
    .defaultNow()
    .notNull(),

  updatedAt: timestamp("updated_at", {
    withTimezone: true,
  })
    .defaultNow()
    .notNull(),
});

module.exports = {
  users,
  userRole,
};
