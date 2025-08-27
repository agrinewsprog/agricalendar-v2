import { Router } from 'express';
import { getAdminEvents } from '../controllers/eventsController';
import { authenticateToken } from '../middlewares/authMiddleware';

const router = Router();

// Rutas de administración para eventos
router.get('/events', authenticateToken, getAdminEvents);

export default router;
