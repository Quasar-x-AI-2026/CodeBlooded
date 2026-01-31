import Router from 'express';
import {processCrisisReport, getAllIssues} from '../controllers/crisis.controller.js';

const router = Router();

router.post('/process-report', processCrisisReport);
router.get('/issues', getAllIssues);

export default router;
