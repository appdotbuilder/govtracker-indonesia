
import { 
  serial, 
  text, 
  pgTable, 
  timestamp, 
  numeric, 
  integer, 
  boolean,
  date,
  json,
  real,
  pgEnum
} from 'drizzle-orm/pg-core';

// Define enums
export const projectStatusEnum = pgEnum('project_status', ['planned', 'active', 'completed', 'suspended', 'cancelled']);
export const contractTypeEnum = pgEnum('contract_type', ['construction', 'goods', 'services', 'consultancy']);
export const riskLevelEnum = pgEnum('risk_level', ['low', 'medium', 'high', 'critical']);
export const alertTypeEnum = pgEnum('alert_type', ['budget_overflow', 'delay', 'anomaly', 'completion']);
export const engagementTypeEnum = pgEnum('engagement_type', ['feedback', 'discussion', 'survey', 'complaint']);
export const engagementStatusEnum = pgEnum('engagement_status', ['pending', 'reviewed', 'responded']);
export const analysisTypeEnum = pgEnum('analysis_type', ['anomaly_detection', 'completion_prediction', 'budget_analysis', 'risk_assessment']);
export const reportTypeEnum = pgEnum('report_type', ['transparency', 'audit', 'financial', 'progress']);

// Projects table
export const projectsTable = pgTable('projects', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description').notNull(),
  budget: numeric('budget', { precision: 15, scale: 2 }).notNull(),
  allocated_funds: numeric('allocated_funds', { precision: 15, scale: 2 }).notNull(),
  actual_expenditures: numeric('actual_expenditures', { precision: 15, scale: 2 }).notNull(),
  start_date: date('start_date').notNull(),
  end_date: date('end_date').notNull(),
  status: projectStatusEnum('status').notNull(),
  contract_type: contractTypeEnum('contract_type').notNull(),
  location: text('location').notNull(),
  contractor: text('contractor'),
  transparency_score: real('transparency_score').notNull().default(0),
  risk_score: real('risk_score').notNull().default(0),
  ai_completion_prediction: real('ai_completion_prediction'),
  ai_budget_overflow_risk: real('ai_budget_overflow_risk'),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull()
});

// Contracts table
export const contractsTable = pgTable('contracts', {
  id: serial('id').primaryKey(),
  project_id: integer('project_id').references(() => projectsTable.id).notNull(),
  contract_number: text('contract_number').notNull(),
  title: text('title').notNull(),
  value: numeric('value', { precision: 15, scale: 2 }).notNull(),
  contractor_name: text('contractor_name').notNull(),
  signed_date: date('signed_date').notNull(),
  document_url: text('document_url'),
  created_at: timestamp('created_at').defaultNow().notNull()
});

// Alerts table
export const alertsTable = pgTable('alerts', {
  id: serial('id').primaryKey(),
  project_id: integer('project_id').references(() => projectsTable.id).notNull(),
  type: alertTypeEnum('type').notNull(),
  title: text('title').notNull(),
  message: text('message').notNull(),
  severity: riskLevelEnum('severity').notNull(),
  is_resolved: boolean('is_resolved').notNull().default(false),
  created_at: timestamp('created_at').defaultNow().notNull(),
  resolved_at: timestamp('resolved_at')
});

// Citizen engagement table
export const citizenEngagementTable = pgTable('citizen_engagement', {
  id: serial('id').primaryKey(),
  project_id: integer('project_id').references(() => projectsTable.id).notNull(),
  type: engagementTypeEnum('type').notNull(),
  title: text('title').notNull(),
  content: text('content').notNull(),
  author_name: text('author_name'),
  author_email: text('author_email'),
  is_anonymous: boolean('is_anonymous').notNull().default(false),
  status: engagementStatusEnum('status').notNull().default('pending'),
  admin_response: text('admin_response'),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull()
});

// AI Analytics table
export const aiAnalyticsTable = pgTable('ai_analytics', {
  id: serial('id').primaryKey(),
  project_id: integer('project_id').references(() => projectsTable.id).notNull(),
  analysis_type: analysisTypeEnum('analysis_type').notNull(),
  results: json('results').notNull(),
  confidence_score: real('confidence_score').notNull(),
  generated_at: timestamp('generated_at').defaultNow().notNull()
});

// Reports table
export const reportsTable = pgTable('reports', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  report_type: reportTypeEnum('report_type').notNull(),
  file_url: text('file_url'),
  is_public: boolean('is_public').notNull().default(true),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull()
});

// TypeScript types for the table schemas
export type Project = typeof projectsTable.$inferSelect;
export type NewProject = typeof projectsTable.$inferInsert;
export type Contract = typeof contractsTable.$inferSelect;
export type NewContract = typeof contractsTable.$inferInsert;
export type Alert = typeof alertsTable.$inferSelect;
export type NewAlert = typeof alertsTable.$inferInsert;
export type CitizenEngagement = typeof citizenEngagementTable.$inferSelect;
export type NewCitizenEngagement = typeof citizenEngagementTable.$inferInsert;
export type AIAnalytics = typeof aiAnalyticsTable.$inferSelect;
export type NewAIAnalytics = typeof aiAnalyticsTable.$inferInsert;
export type Report = typeof reportsTable.$inferSelect;
export type NewReport = typeof reportsTable.$inferInsert;

// Export all tables for proper query building
export const tables = {
  projects: projectsTable,
  contracts: contractsTable,
  alerts: alertsTable,
  citizenEngagement: citizenEngagementTable,
  aiAnalytics: aiAnalyticsTable,
  reports: reportsTable
};
