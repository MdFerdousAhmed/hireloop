
require("dotenv").config();

const app = require("./app");
const { pool } = require("./db");
const { ensureSchema } = require("./db/ensureSchema");

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  // Try to verify DB connection; if it fails we still start the server (useful for local dev)
  try {
    await pool.query('SELECT 1');
    await ensureSchema();
    console.log('Neon PostgreSQL connected & schema verified');
  } catch (error) {
    console.warn('Database connection failed – continuing without DB:', error.message);
  }

  // Start the Express server regardless of DB status
  app.listen(PORT, () => {
    console.log(`HireLoop API running on port ${PORT}`);
  });
};

startServer();
