const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

const healthRoutes = require("./modules/health/health.routes");
const adminDashboardRoutes = require("./modules/admin-dashboard/admin-dashboard.routes");
const jobsRoutes = require("./modules/jobs/jobs.routes");
const applicationsRoutes = require("./modules/applications/applications.routes");

const app = express();

app.use(helmet());

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Welcome to HireLoop API",
  });
});

app.use("/api/v1/auth", require("./modules/auth/auth.routes"));
app.use("/api/v1/jobs", jobsRoutes);
app.use("/api/v1/applications", applicationsRoutes);
app.use("/api/v1/admin-dashboard", adminDashboardRoutes);

module.exports = app;
