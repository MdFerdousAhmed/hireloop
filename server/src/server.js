
require("dotenv").config();

const app = require("./app");
const { pool } = require("./db");

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Check Neon database connection
    await pool.query("SELECT 1");

    console.log("Neon PostgreSQL connected successfully");

    app.listen(PORT, () => {
      console.log(`HireLoop API running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Server startup failed:", error.message);
    process.exit(1);
  }
};

startServer();
