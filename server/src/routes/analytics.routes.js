import Router from 'express';
import { getDashboardStats, getPriorityCrises, getTopNGOs, getTopDonors } from '../controllers/analytics.controller.js';

const router = Router();

router.get('/dashboard', getDashboardStats);
router.get('/priority-crises', getPriorityCrises);
router.get('/top-ngos', getTopNGOs);
router.get('/top-donors', getTopDonors);

export default router;
