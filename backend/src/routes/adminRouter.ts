import { Router } from 'express';
import { getAdminEvents, getAdminEventById } from '../controllers/eventsController';
import { authenticateToken } from '../middlewares/authMiddleware';

const router = Router();

// Rutas de administración para eventos
router.get('/events', authenticateToken, getAdminEvents);
router.get('/events/:id', authenticateToken, getAdminEventById);

export default router;
