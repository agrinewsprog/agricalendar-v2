// Código para añadir al eventsController.ts

import { Request, Response } from "express";

/**
 * Obtener todas las traducciones de un evento
 */
export const getEventTranslations = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const eventId = parseInt(id);

    if (isNaN(eventId)) {
      return res.status(400).json({
        success: false,
        message: 'ID de evento inválido'
      });
    }

    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: {
        translations: {
          include: {
            language: true
          }
        },
        seoMetadata: {
          include: {
            language: true
          }
        },
        language: true
      }
    });

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Evento no encontrado'
      });
    }

    res.json({
      success: true,
      data: event
    });
  } catch (error) {
    console.error('Error fetching event translations:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

/**
 * Crear o actualizar traducción de un evento
 */
export const saveEventTranslation = async (req: Request, res: Response) => {
  try {
    const { id, languageCode } = req.params;
    const eventId = parseInt(id);

    if (isNaN(eventId)) {
      return res.status(400).json({
        success: false,
        message: 'ID de evento inválido'
      });
    }

    // Buscar el idioma
    const language = await prisma.language.findUnique({
      where: { code: languageCode }
    });

    if (!language) {
      return res.status(404).json({
        success: false,
        message: 'Idioma no encontrado'
      });
    }

    // Verificar que el evento existe
    const event = await prisma.event.findUnique({
      where: { id: eventId }
    });

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Evento no encontrado'
      });
    }

    const { name, description, location, slug, seoTitle, seoDescription, keywords } = req.body;

    // Validaciones
    if (!name?.trim()) {
      return res.status(400).json({
        success: false,
        message: 'El nombre es requerido'
      });
    }

    if (!slug?.trim()) {
      return res.status(400).json({
        success: false,
        message: 'El slug es requerido'
      });
    }

    // Verificar que el slug sea único para este idioma
    const existingSlug = await prisma.eventTranslation.findFirst({
      where: {
        slug: slug,
        languageId: language.id,
        eventId: { not: eventId }
      }
    });

    if (existingSlug) {
      return res.status(400).json({
        success: false,
        message: 'Ya existe un evento con este slug en este idioma'
      });
    }

    // Transacción para crear/actualizar traducción y SEO
    const result = await prisma.$transaction(async (tx) => {
      // Crear o actualizar traducción
      const translation = await tx.eventTranslation.upsert({
        where: {
          eventId_languageId: {
            eventId: eventId,
            languageId: language.id
          }
        },
        update: {
          name: name.trim(),
          description: description?.trim() || null,
          location: location?.trim() || null,
          slug: slug.trim(),
          isAuto: false // Al editar manualmente, ya no es automática
        },
        create: {
          eventId: eventId,
          languageId: language.id,
          name: name.trim(),
          description: description?.trim() || null,
          location: location?.trim() || null,
          slug: slug.trim(),
          isAuto: false
        }
      });

      // Crear o actualizar SEO metadata si se proporcionó
      if (seoTitle || seoDescription || keywords) {
        await tx.seoMetadata.upsert({
          where: {
            eventId_languageId: {
              eventId: eventId,
              languageId: language.id
            }
          },
          update: {
            title: seoTitle?.trim() || '',
            description: seoDescription?.trim() || '',
            keywords: keywords?.trim() || null
          },
          create: {
            eventId: eventId,
            languageId: language.id,
            title: seoTitle?.trim() || '',
            description: seoDescription?.trim() || '',
            keywords: keywords?.trim() || null
          }
        });
      }

      return translation;
    });

    res.json({
      success: true,
      message: 'Traducción guardada exitosamente',
      data: result
    });

  } catch (error) {
    console.error('Error saving event translation:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

/**
 * Eliminar traducción de un evento
 */
export const deleteEventTranslation = async (req: Request, res: Response) => {
  try {
    const { id, languageCode } = req.params;
    const eventId = parseInt(id);

    if (isNaN(eventId)) {
      return res.status(400).json({
        success: false,
        message: 'ID de evento inválido'
      });
    }

    // Buscar el idioma
    const language = await prisma.language.findUnique({
      where: { code: languageCode }
    });

    if (!language) {
      return res.status(404).json({
        success: false,
        message: 'Idioma no encontrado'
      });
    }

    // Verificar que el evento existe
    const event = await prisma.event.findUnique({
      where: { id: eventId }
    });

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Evento no encontrado'
      });
    }

    // No permitir eliminar la traducción del idioma original
    if (event.languageId === language.id) {
      return res.status(400).json({
        success: false,
        message: 'No se puede eliminar la traducción del idioma original'
      });
    }

    // Eliminar traducción y metadatos SEO
    await prisma.$transaction(async (tx) => {
      await tx.eventTranslation.deleteMany({
        where: {
          eventId: eventId,
          languageId: language.id
        }
      });

      await tx.seoMetadata.deleteMany({
        where: {
          eventId: eventId,
          languageId: language.id
        }
      });
    });

    res.json({
      success: true,
      message: 'Traducción eliminada exitosamente'
    });

  } catch (error) {
    console.error('Error deleting event translation:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};
