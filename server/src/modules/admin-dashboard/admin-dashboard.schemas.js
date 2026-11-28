// src/modules/admin-dashboard/admin-dashboard.schemas.js
const { z } = require('zod');

const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(10),
});

const userFilterSchema = paginationSchema.extend({
  role: z.enum(['CANDIDATE', 'EMPLOYER', 'ADMIN']).optional(),
  isActive: z
    .enum(['true', 'false'])
    .transform((v) => v === 'true')
    .optional(),
});

const companyFilterSchema = paginationSchema.extend({
  verificationStatus: z.enum(['PENDING', 'VERIFIED', 'REJECTED']).optional(),
});

const jobFilterSchema = paginationSchema.extend({
  status: z.enum(['PENDING', 'PUBLISHED', 'REJECTED', 'CLOSED']).optional(),
});

module.exports = {
  paginationSchema,
  userFilterSchema,
  companyFilterSchema,
  jobFilterSchema,
};
