// src/modules/admin-dashboard/admin-dashboard.schemas.js
const { z } = require('zod');

// Generic pagination schema (max 50 per page)
const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(10),
});

// Optional filter for user list
const userFilterSchema = paginationSchema.extend({
  role: z.enum(['CANDIDATE', 'EMPLOYER', 'ADMIN']).optional(),
  isActive: z.boolean().optional(),
});

// Optional filter for companies
const companyFilterSchema = paginationSchema.extend({
  verificationStatus: z.enum(['PENDING', 'VERIFIED', 'REJECTED']).optional(),
});

// Optional filter for jobs
const jobFilterSchema = paginationSchema.extend({
  status: z.enum(['PENDING', 'PUBLISHED', 'REJECTED', 'CLOSED']).optional(),
});

module.exports = {
  paginationSchema,
  userFilterSchema,
  companyFilterSchema,
  jobFilterSchema,
};
