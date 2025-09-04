import { Router } from 'express';
import {
  getAllEvents,
  getEventBySlug,
  getAdminEventById,
  createEvent,
  updateEvent,
  updateEventStatus,
  deleteEvent,
  updateEventTranslationById,
  getEventTranslations,
  saveEventTranslation,
  deleteEventTranslation
} from '../controllers/eventsController';
import { authenticateToken } from '../middlewares/authMiddleware';
import upload from '../middlewares/uploadMiddleware';

const router = Router();

// Rutas públicas
router.get('/', getAllEvents);
router.get('/id/:id', authenticateToken, getAdminEventById); // Ruta temporal para obtener por ID
router.get('/:slug', getEventBySlug);

// Rutas protegidas (requieren autenticación)
router.post('/', authenticateToken, upload.single('image'), createEvent);
router.put('/:id', authenticateToken, upload.single('image'), updateEvent);
router.patch('/:id/status', authenticateToken, updateEventStatus);
router.delete('/:id', authenticateToken, deleteEvent);

// Rutas de traducciones
router.get('/:id/translations', authenticateToken, getEventTranslations);
router.put('/:id/translation/:language', authenticateToken, updateEventTranslationById);
router.post('/:id/translations/:languageCode', authenticateToken, saveEventTranslation);
router.put('/:id/translations/:languageCode', authenticateToken, saveEventTranslation);
router.delete('/:id/translations/:languageCode', authenticateToken, deleteEventTranslation);

export default router;
