import { Router, type IRouter } from "express";
import healthRouter from "./health";
import jobsRouter from "./jobs";
import dashboardRouter from "./dashboard";
import profileRouter from "./profile";
import alertsRouter from "./alerts";
import skillsRouter from "./skills";
import projectsRouter from "./projects";
import aiRouter from "./ai";
import careerIntelligenceRouter from "./career-intelligence";

import { requireAuth } from "../middleware/auth";

const router: IRouter = Router();

router.use(healthRouter);

// Protect all following routes
router.use(requireAuth);

router.use(jobsRouter);
router.use(dashboardRouter);
router.use(profileRouter);
router.use(alertsRouter);
router.use(skillsRouter);
router.use(projectsRouter);
router.use(aiRouter);
router.use(careerIntelligenceRouter);

export default router;
