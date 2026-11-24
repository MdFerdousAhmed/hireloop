
require("dotenv").config();

module.exports = {
  schema: "./src/db/schema/*.js",
  out: "./drizzle",
  dialect: "postgresql",

  dbCredentials: {
    url: process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL,
  },

  strict: true,
  verbose: true,
};
