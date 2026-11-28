// src/modules/admin-dashboard/admin-dashboard.routes.js
const express = require('express');
const authenticate = require('../../middleware/auth');
const roleCheck = require('../../middleware/role');
const controller = require('./admin-dashboard.controller');

const router = express.Router();

// Protect every route – only ADMIN can access
router.use(authenticate, roleCheck(['ADMIN']));

// Overview
router.get('/', controller.getDashboard);
router.get('/audit-logs', controller.getAuditLogs);

// Users list & management
router.get('/users', controller.getUsers);
router.patch('/users/:userId', controller.patchUser);

// Companies list & verification
router.get('/companies', controller.getCompanies);
router.patch('/companies/:companyId', controller.patchCompany);

// Jobs list & moderation
router.get('/jobs', controller.getJobs);
router.patch('/jobs/:jobId', controller.patchJob);

module.exports = router;
