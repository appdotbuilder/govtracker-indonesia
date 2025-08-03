
import { z } from 'zod';

// Enums
export const projectStatusEnum = z.enum(['planned', 'active', 'completed', 'suspended', 'cancelled']);
export const contractTypeEnum = z.enum(['construction', 'goods', 'services', 'consultancy']);
export const riskLevelEnum = z.enum(['low', 'medium', 'high', 'critical']);
export const userRoleEnum = z.enum(['public', 'admin', 'auditor']);
export const alertTypeEnum = z.enum(['budget_overflow', 'delay', 'anomaly', 'completion']);
export const engagementTypeEnum = z.enum(['feedback', 'discussion', 'survey', 'complaint']);

// Project schema
export const projectSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string(),
  budget: z.number(),
  allocated_funds: z.number(),
  actual_expenditures: z.number(),
  start_date: z.coerce.date(),
  end_date: z.coerce.date(),
  status: projectStatusEnum,
  contract_type: contractTypeEnum,
  location: z.string(),
  contractor: z.string().nullable(),
  transparency_score: z.number().min(0).max(100),
  risk_score: z.number().min(0).max(100),
  ai_completion_prediction: z.number().min(0).max(100).nullable(),
  ai_budget_overflow_risk: z.number().min(0).max(100).nullable(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date()
});

export type Project = z.infer<typeof projectSchema>;

// Create project input schema
export const createProjectInputSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  budget: z.number().positive(),
  allocated_funds: z.number().nonnegative(),
  actual_expenditures: z.number().nonnegative(),
  start_date: z.coerce.date(),
  end_date: z.coerce.date(),
  status: projectStatusEnum,
  contract_type: contractTypeEnum,
  location: z.string().min(1),
  contractor: z.string().nullable()
});

export type CreateProjectInput = z.infer<typeof createProjectInputSchema>;

// Update project input schema
export const updateProjectInputSchema = z.object({
  id: z.number(),
  name: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  budget: z.number().positive().optional(),
  allocated_funds: z.number().nonnegative().optional(),
  actual_expenditures: z.number().nonnegative().optional(),
  start_date: z.coerce.date().optional(),
  end_date: z.coerce.date().optional(),
  status: projectStatusEnum.optional(),
  contract_type: contractTypeEnum.optional(),
  location: z.string().min(1).optional(),
  contractor: z.string().nullable().optional()
});

export type UpdateProjectInput = z.infer<typeof updateProjectInputSchema>;

// Contract schema
export const contractSchema = z.object({
  id: z.number(),
  project_id: z.number(),
  contract_number: z.string(),
  title: z.string(),
  value: z.number(),
  contractor_name: z.string(),
  signed_date: z.coerce.date(),
  document_url: z.string().nullable(),
  created_at: z.coerce.date()
});

export type Contract = z.infer<typeof contractSchema>;

// Create contract input schema
export const createContractInputSchema = z.object({
  project_id: z.number(),
  contract_number: z.string().min(1),
  title: z.string().min(1),
  value: z.number().positive(),
  contractor_name: z.string().min(1),
  signed_date: z.coerce.date(),
  document_url: z.string().url().nullable()
});

export type CreateContractInput = z.infer<typeof createContractInputSchema>;

// Alert schema
export const alertSchema = z.object({
  id: z.number(),
  project_id: z.number(),
  type: alertTypeEnum,
  title: z.string(),
  message: z.string(),
  severity: riskLevelEnum,
  is_resolved: z.boolean(),
  created_at: z.coerce.date(),
  resolved_at: z.coerce.date().nullable()
});

export type Alert = z.infer<typeof alertSchema>;

// Create alert input schema
export const createAlertInputSchema = z.object({
  project_id: z.number(),
  type: alertTypeEnum,
  title: z.string().min(1),
  message: z.string().min(1),
  severity: riskLevelEnum
});

export type CreateAlertInput = z.infer<typeof createAlertInputSchema>;

// Citizen engagement schema
export const citizenEngagementSchema = z.object({
  id: z.number(),
  project_id: z.number(),
  type: engagementTypeEnum,
  title: z.string(),
  content: z.string(),
  author_name: z.string().nullable(),
  author_email: z.string().email().nullable(),
  is_anonymous: z.boolean(),
  status: z.enum(['pending', 'reviewed', 'responded']),
  admin_response: z.string().nullable(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date()
});

export type CitizenEngagement = z.infer<typeof citizenEngagementSchema>;

// Create citizen engagement input schema
export const createCitizenEngagementInputSchema = z.object({
  project_id: z.number(),
  type: engagementTypeEnum,
  title: z.string().min(1),
  content: z.string().min(1),
  author_name: z.string().nullable(),
  author_email: z.string().email().nullable(),
  is_anonymous: z.boolean().default(false)
});

export type CreateCitizenEngagementInput = z.infer<typeof createCitizenEngagementInputSchema>;

// AI Analytics schema
export const aiAnalyticsSchema = z.object({
  id: z.number(),
  project_id: z.number(),
  analysis_type: z.enum(['anomaly_detection', 'completion_prediction', 'budget_analysis', 'risk_assessment']),
  results: z.record(z.any()), // JSON field for flexible analytics data
  confidence_score: z.number().min(0).max(1),
  generated_at: z.coerce.date()
});

export type AIAnalytics = z.infer<typeof aiAnalyticsSchema>;

// Report schema
export const reportSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string(),
  report_type: z.enum(['transparency', 'audit', 'financial', 'progress']),
  file_url: z.string().nullable(),
  is_public: z.boolean(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date()
});

export type Report = z.infer<typeof reportSchema>;

// Create report input schema
export const createReportInputSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  report_type: z.enum(['transparency', 'audit', 'financial', 'progress']),
  file_url: z.string().url().nullable(),
  is_public: z.boolean().default(true)
});

export type CreateReportInput = z.infer<typeof createReportInputSchema>;

// Search filters schema
export const searchFiltersSchema = z.object({
  name: z.string().optional(),
  location: z.string().optional(),
  contractor: z.string().optional(),
  status: projectStatusEnum.optional(),
  contract_type: contractTypeEnum.optional(),
  budget_min: z.number().nonnegative().optional(),
  budget_max: z.number().nonnegative().optional(),
  start_date_from: z.coerce.date().optional(),
  start_date_to: z.coerce.date().optional(),
  risk_level: riskLevelEnum.optional(),
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(20)
});

export type SearchFilters = z.infer<typeof searchFiltersSchema>;

// Dashboard stats schema
export const dashboardStatsSchema = z.object({
  total_projects: z.number(),
  active_projects: z.number(),
  total_budget: z.number(),
  total_expenditures: z.number(),
  completed_projects: z.number(),
  high_risk_projects: z.number(),
  recent_alerts: z.number(),
  citizen_engagements: z.number()
});

export type DashboardStats = z.infer<typeof dashboardStatsSchema>;
