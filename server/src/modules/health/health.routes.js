
const express = require("express");
const { pool } = require("../../db");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT NOW() AS database_time"
    );

    res.status(200).json({
      success: true,
      message: "HireLoop API is running",
      database: "Connected",
      time: result.rows[0].database_time,
    });
  } catch (error) {
    console.error("Database health check failed:", error);

    res.status(503).json({
      success: false,
      message: "Database connection failed",
    });
  }
});

module.exports = router;
