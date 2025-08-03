
import { initTRPC } from '@trpc/server';
import { createHTTPServer } from '@trpc/server/adapters/standalone';
import 'dotenv/config';
import cors from 'cors';
import superjson from 'superjson';
import { z } from 'zod';

// Import schemas
import { 
  createProjectInputSchema,
  updateProjectInputSchema,
  searchFiltersSchema,
  createContractInputSchema,
  createAlertInputSchema,
  createCitizenEngagementInputSchema,
  createReportInputSchema
} from './schema';

// Import handlers
import { createProject } from './handlers/create_project';
import { getProjects } from './handlers/get_projects';
import { getProjectById } from './handlers/get_project_by_id';
import { updateProject } from './handlers/update_project';
import { searchProjects } from './handlers/search_projects';
import { getDashboardStats } from './handlers/get_dashboard_stats';
import { createContract } from './handlers/create_contract';
import { getContractsByProject } from './handlers/get_contracts_by_project';
import { createAlert } from './handlers/create_alert';
import { getAlerts } from './handlers/get_alerts';
import { resolveAlert } from './handlers/resolve_alert';
import { createCitizenEngagement } from './handlers/create_citizen_engagement';
import { getCitizenEngagements } from './handlers/get_citizen_engagements';
import { getAIAnalytics } from './handlers/get_ai_analytics';
import { generateAIInsights } from './handlers/generate_ai_insights';
import { createReport } from './handlers/create_report';
import { getReports } from './handlers/get_reports';

const t = initTRPC.create({
  transformer: superjson,
});

const publicProcedure = t.procedure;
const router = t.router;

const appRouter = router({
  // Health check
  healthcheck: publicProcedure.query(() => {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }),

  // Dashboard
  getDashboardStats: publicProcedure
    .query(() => getDashboardStats()),

  // Project management
  createProject: publicProcedure
    .input(createProjectInputSchema)
    .mutation(({ input }) => createProject(input)),

  getProjects: publicProcedure
    .query(() => getProjects()),

  getProjectById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(({ input }) => getProjectById(input.id)),

  updateProject: publicProcedure
    .input(updateProjectInputSchema)
    .mutation(({ input }) => updateProject(input)),

  searchProjects: publicProcedure
    .input(searchFiltersSchema)
    .query(({ input }) => searchProjects(input)),

  // Contract management
  createContract: publicProcedure
    .input(createContractInputSchema)
    .mutation(({ input }) => createContract(input)),

  getContractsByProject: publicProcedure
    .input(z.object({ projectId: z.number() }))
    .query(({ input }) => getContractsByProject(input.projectId)),

  // Alert system
  createAlert: publicProcedure
    .input(createAlertInputSchema)
    .mutation(({ input }) => createAlert(input)),

  getAlerts: publicProcedure
    .input(z.object({ limit: z.number().optional() }))
    .query(({ input }) => getAlerts(input.limit)),

  resolveAlert: publicProcedure
    .input(z.object({ alertId: z.number() }))
    .mutation(({ input }) => resolveAlert(input.alertId)),

  // Citizen engagement
  createCitizenEngagement: publicProcedure
    .input(createCitizenEngagementInputSchema)
    .mutation(({ input }) => createCitizenEngagement(input)),

  getCitizenEngagements: publicProcedure
    .input(z.object({ projectId: z.number().optional() }))
    .query(({ input }) => getCitizenEngagements(input.projectId)),

  // AI Analytics
  getAIAnalytics: publicProcedure
    .input(z.object({ projectId: z.number().optional() }))
    .query(({ input }) => getAIAnalytics(input.projectId)),

  generateAIInsights: publicProcedure
    .input(z.object({ projectId: z.number() }))
    .mutation(({ input }) => generateAIInsights(input.projectId)),

  // Reports
  createReport: publicProcedure
    .input(createReportInputSchema)
    .mutation(({ input }) => createReport(input)),

  getReports: publicProcedure
    .input(z.object({ isPublic: z.boolean().optional() }))
    .query(({ input }) => getReports(input.isPublic)),
});

export type AppRouter = typeof appRouter;

async function start() {
  const port = process.env['SERVER_PORT'] || 2022;
  const server = createHTTPServer({
    middleware: (req, res, next) => {
      cors()(req, res, next);
    },
    router: appRouter,
    createContext() {
      return {};
    },
  });
  
  server.listen(port);
  console.log(`GovTracker Indonesia TRPC server listening at port: ${port}`);
}

start();
