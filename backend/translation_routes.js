// Código para añadir a eventsRouter.js o crear translationsRouter.js

import { Router } from "express";
import {
  getEventTranslations,
  saveEventTranslation,
  deleteEventTranslation,
} from "../controllers/eventsController.js";

const translationsRouter = Router();

// Obtener todas las traducciones de un evento
translationsRouter.get("/events/:id/translations", getEventTranslations);

// Crear o actualizar traducción
translationsRouter.post(
  "/events/:id/translations/:languageCode",
  saveEventTranslation
);
translationsRouter.put(
  "/events/:id/translations/:languageCode",
  saveEventTranslation
);

// Eliminar traducción
translationsRouter.delete(
  "/events/:id/translations/:languageCode",
  deleteEventTranslation
);

export default translationsRouter;
