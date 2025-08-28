import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { createAutoTranslations, getEventTranslation, updateTranslation } from '../services/translationService';

const prisma = new PrismaClient();

// GET /api/events - Obtener todos los eventos (público)
export const getAllEvents = async (req: Request, res: Response) => {
  try {
    const { 
      language = 'es', 
      limit = '50', 
      offset = '0',
      tipo,
      region,
      startDate,
      endDate 
    } = req.query;

    const events = await prisma.event.findMany({
      where: {
        status: 'PUBLISHED',
        ...(tipo && { tipo: tipo as string }),
        ...(region && { region: region as string }),
        ...(startDate && { 
          startDate: { gte: new Date(startDate as string) } 
        }),
        ...(endDate && { 
          endDate: { lte: new Date(endDate as string) } 
        }),
      },
      include: {
        language: true,
        translations: {
          where: { 
            language: { 
              code: language as string 
            } 
          }
        },
        seoMetadata: {
          where: { 
            language: { 
              code: language as string 
            } 
          }
        }
      },
      orderBy: { startDate: 'asc' },
      take: parseInt(limit as string),
      skip: parseInt(offset as string),
    });

    res.json({
      success: true,
      data: events,
      meta: {
        total: events.length,
        limit: parseInt(limit as string),
        offset: parseInt(offset as string),
        language
      }
    });
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({
      success: false,
      error: 'Error al obtener eventos'
    });
  }
};

// GET /api/admin/events - Obtener todos los eventos para administradores
export const getAdminEvents = async (req: Request, res: Response) => {
  try {
    const { 
      language = 'es', 
      limit = '50', 
      offset = '0',
      status,
      tipo,
      region,
      startDate,
      endDate,
      search,
      userId
    } = req.query;

    // Construir filtros
    const whereClause: any = {};

    if (status && status !== 'ALL') {
      whereClause.status = status;
    }

    if (tipo && tipo !== 'ALL') {
      whereClause.tipo = tipo;
    }

    if (region && region !== 'ALL') {
      whereClause.region = region;
    }

    if (userId && userId !== 'ALL') {
      whereClause.userId = parseInt(userId as string);
    }

    if (startDate) {
      whereClause.startDate = { gte: new Date(startDate as string) };
    }

    if (endDate) {
      if (whereClause.startDate) {
        whereClause.startDate = { 
          ...whereClause.startDate,
          lte: new Date(endDate as string) 
        };
      } else {
        whereClause.startDate = { lte: new Date(endDate as string) };
      }
    }

    if (search) {
      whereClause.OR = [
        { name: { contains: search as string, mode: 'insensitive' } },
        { description: { contains: search as string, mode: 'insensitive' } },
        { location: { contains: search as string, mode: 'insensitive' } }
      ];
    }

    // Obtener total de eventos para paginación
    const total = await prisma.event.count({ where: whereClause });

    const events = await prisma.event.findMany({
      where: whereClause,
      include: {
        language: true,
        user: {
          select: { id: true, name: true, username: true, email: true }
        },
        translations: {
          where: { 
            language: { 
              code: language as string 
            } 
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: parseInt(limit as string),
      skip: parseInt(offset as string),
    });

    res.json({
      success: true,
      data: events,
      meta: {
        total,
        limit: parseInt(limit as string),
        offset: parseInt(offset as string),
        language,
        filters: {
          status,
          tipo,
          region,
          startDate,
          endDate,
          search,
          userId
        }
      }
    });
  } catch (error) {
    console.error('Error fetching admin events:', error);
    res.status(500).json({
      success: false,
      error: 'Error al obtener eventos para administración'
    });
  }
};

// GET /api/events/:slug - Obtener evento por slug con soporte multiidioma
export const getEventBySlug = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const { language = 'es' } = req.query;

    if (!slug) {
      return res.status(400).json({
        success: false,
        error: 'Slug requerido'
      });
    }

    // Buscar evento por slug original o por slug de traducción
    const event = await prisma.event.findFirst({
      where: {
        OR: [
          { slug },
          { 
            translations: { 
              some: { slug } 
            } 
          }
        ]
      },
      include: {
        language: true,
        user: {
          select: { id: true, name: true, username: true }
        },
        translations: {
          where: { 
            language: { 
              code: language as string 
            } 
          },
          include: {
            language: true
          }
        },
        seoMetadata: {
          where: { 
            language: { 
              code: language as string 
            } 
          },
          include: {
            language: true
          }
        }
      }
    });

    if (!event) {
      return res.status(404).json({
        success: false,
        error: 'Evento no encontrado'
      });
    }

    // Si hay traducciones disponibles, usar el contenido traducido
    let translatedEvent = { ...event };
    
    if (event.translations && event.translations.length > 0) {
      const translation = event.translations[0];
      translatedEvent = {
        ...event,
        name: translation.name || event.name,
        description: translation.description || event.description,
        location: translation.location || event.location,
        slug: translation.slug || event.slug
      };
    }

    // Si hay metadatos SEO disponibles, agregarlos al evento
    if (event.seoMetadata && event.seoMetadata.length > 0) {
      const seoData = event.seoMetadata[0];
      // Agregar datos SEO como propiedades adicionales
      (translatedEvent as any).seoTitle = seoData.title;
      (translatedEvent as any).seoDesc = seoData.description;
      (translatedEvent as any).keywords = seoData.keywords;
      (translatedEvent as any).ogImage = seoData.ogImage;
    }

    res.json({
      success: true,
      data: translatedEvent
    });
  } catch (error) {
    console.error('Error fetching event:', error);
    res.status(500).json({
      success: false,
      error: 'Error al obtener evento'
    });
  }
};

// GET /api/admin/events/:id - Obtener evento por ID para administradores
export const getAdminEventById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { language = 'es' } = req.query;

    if (!id || isNaN(parseInt(id))) {
      return res.status(400).json({
        success: false,
        error: 'ID de evento inválido'
      });
    }

    const event = await prisma.event.findUnique({
      where: { id: parseInt(id) },
      include: {
        language: true,
        user: {
          select: { id: true, name: true, username: true }
        },
        translations: {
          where: { 
            language: { 
              code: language as string 
            } 
          },
          include: {
            language: true
          }
        },
        seoMetadata: {
          where: { 
            language: { 
              code: language as string 
            } 
          },
          include: {
            language: true
          }
        }
      }
    });

    if (!event) {
      return res.status(404).json({
        success: false,
        error: 'Evento no encontrado'
      });
    }

    // Aplicar traducción si está disponible
    let translatedEvent = { ...event };
    if (event.translations && event.translations.length > 0) {
      const translation = event.translations[0];
      translatedEvent = {
        ...event,
        name: translation.name || event.name,
        description: translation.description || event.description,
        location: translation.location || event.location,
        slug: translation.slug || event.slug
      };
    }

    // Agregar metadatos SEO si están disponibles
    if (event.seoMetadata && event.seoMetadata.length > 0) {
      const seoData = event.seoMetadata[0];
      (translatedEvent as any).seoTitle = seoData.title;
      (translatedEvent as any).seoDesc = seoData.description;
      (translatedEvent as any).keywords = seoData.keywords;
      (translatedEvent as any).ogImage = seoData.ogImage;
    }

    res.json({
      success: true,
      data: translatedEvent
    });
  } catch (error) {
    console.error('Error fetching admin event:', error);
    res.status(500).json({
      success: false,
      error: 'Error al obtener evento'
    });
  }
};

// POST /api/events - Crear nuevo evento
export const createEvent = async (req: Request, res: Response) => {
  try {
    // Extraer datos del body (puede venir como FormData)
    const {
      name,
      startDate,
      endDate,
      startTime,
      endTime,
      color,
      location,
      address,
      description,
      state,
      region,
      tipo,
      type,
      website,
      status = 'DRAFT',
      languageId,
      organizerName,
      organizerEmail,
      organizerPhone,
      maxAttendees,
      registrationRequired,
      registrationDeadline,
      tags,
      registro,
      seoTitle,
      seoDesc
    } = req.body;

    // Validar campos requeridos
    if (!name) {
      return res.status(400).json({
        success: false,
        error: 'El nombre del evento es requerido'
      });
    }

    if (!startDate) {
      return res.status(400).json({
        success: false,
        error: 'La fecha de inicio es requerida'
      });
    }

    if (!languageId) {
      return res.status(400).json({
        success: false,
        error: 'El idioma es requerido'
      });
    }

    // Obtener userId del token JWT
    const userId = (req as any).user?.userId;
    if (!userId) {
      console.log('No userId found in request.user')
      return res.status(401).json({
        success: false,
        error: 'Usuario no autenticado'
      });
    }

    // Generar slug único
    const baseSlug = name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();

    let slug = baseSlug;
    let counter = 1;

    // Verificar que el slug sea único
    while (await prisma.event.findFirst({ where: { slug } })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    // Manejar imagen subida
    const imageFile = (req as any).file;
    const imagePath = imageFile ? `/images/eventos/${imageFile.filename}` : null;

    // Parsear tags si viene como string
    let parsedTags: string[] = [];
    if (tags) {
      try {
        parsedTags = typeof tags === 'string' ? JSON.parse(tags) : tags;
      } catch (error) {
        // Si no es JSON válido, dividir por comas
        parsedTags = typeof tags === 'string' ? tags.split(',').map(tag => tag.trim()) : [];
      }
    }

    const event = await prisma.event.create({
      data: {
        name,
        image: imagePath,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
        startTime,
        endTime,
        color: color || '#3B82F6',
        location,
        address,
        description,
        state,
        region,
        tipo: tipo || type, // Compatibilidad con ambos campos
        website,
        slug,
        status: status as any,
        languageId: parseInt(languageId),
        userId,
        organizerName,
        organizerEmail,
        organizerPhone,
        maxAttendees: maxAttendees ? parseInt(maxAttendees) : null,
        registrationRequired: registrationRequired === 'true' || registrationRequired === true,
        registrationDeadline: registrationDeadline ? new Date(registrationDeadline) : null,
        tags: parsedTags,
        registro,
        seoTitle,
        seoDesc
      },
      include: {
        language: true,
        user: {
          select: { id: true, name: true, username: true }
        }
      }
    });

    // TODO: Aquí implementaremos las traducciones automáticas
    // await createAutoTranslations(event.id, description);

    // Crear traducciones automáticas para todos los idiomas
    try {
      console.log(`🔄 Creating auto-translations for event ${event.id}`);
      await createAutoTranslations(event.id.toString(), {
        name,
        description,
        location,
        originalLanguage: 'es' // Por defecto, asumimos español como idioma original
      });
      console.log(`✅ Auto-translations created successfully for event ${event.id}`);
    } catch (translationError) {
      console.error(`❌ Error creating auto-translations for event ${event.id}:`, translationError);
      // No fallar la creación del evento si las traducciones fallan
    }

    res.status(201).json({
      success: true,
      data: event,
      message: 'Evento creado exitosamente con traducciones automáticas'
    });
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({
      success: false,
      error: 'Error al crear evento'
    });
  }
};

// PUT /api/events/:id - Actualizar evento
export const updateEvent = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({
        success: false,
        error: 'ID de evento requerido'
      });
    }

    const updateData = req.body;

    const event = await prisma.event.update({
      where: { id: parseInt(id) },
      data: {
        ...updateData,
        ...(updateData.startDate && { startDate: new Date(updateData.startDate) }),
        ...(updateData.endDate && { endDate: new Date(updateData.endDate) }),
        updatedAt: new Date()
      },
      include: {
        language: true,
        user: {
          select: { id: true, name: true, username: true }
        }
      }
    });

    res.json({
      success: true,
      data: event,
      message: 'Evento actualizado exitosamente'
    });
  } catch (error) {
    console.error('Error updating event:', error);
    res.status(500).json({
      success: false,
      error: 'Error al actualizar evento'
    });
  }
};

// DELETE /api/events/:id - Eliminar evento
export const deleteEvent = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({
        success: false,
        error: 'ID de evento requerido'
      });
    }

    await prisma.event.delete({
      where: { id: parseInt(id) }
    });

    res.json({
      success: true,
      message: 'Evento eliminado exitosamente'
    });
  } catch (error) {
    console.error('Error deleting event:', error);
    res.status(500).json({
      success: false,
      error: 'Error al eliminar evento'
    });
  }
};

// PATCH /api/events/:id/status - Actualizar estado de evento
export const updateEventStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    if (!id) {
      return res.status(400).json({
        success: false,
        error: 'ID de evento requerido'
      });
    }

    if (!status || !['DRAFT', 'PUBLISHED', 'ARCHIVED', 'CANCELLED'].includes(status)) {
      return res.status(400).json({
        success: false,
        error: 'Estado válido requerido (DRAFT, PUBLISHED, ARCHIVED, CANCELLED)'
      });
    }

    const event = await prisma.event.update({
      where: { id: parseInt(id) },
      data: { 
        status: status as any,
        updatedAt: new Date()
      },
      include: {
        language: true,
        user: {
          select: { id: true, name: true, username: true }
        }
      }
    });

    res.json({
      success: true,
      data: event,
      message: 'Estado del evento actualizado exitosamente'
    });
  } catch (error) {
    console.error('Error updating event status:', error);
    res.status(500).json({
      success: false,
      error: 'Error al actualizar estado del evento'
    });
  }
};

// PUT /api/events/:id/translation/:language - Actualizar traducción específica
export const updateEventTranslationById = async (req: Request, res: Response) => {
  try {
    const { id, language } = req.params;
    const {
      name,
      description,
      location,
      slug,
      seoTitle,
      seoDescription,
      keywords
    } = req.body;

    if (!id || !language) {
      return res.status(400).json({
        success: false,
        error: 'ID del evento y código de idioma son requeridos'
      });
    }

    // Verificar que el evento existe
    const event = await prisma.event.findUnique({
      where: { id: parseInt(id) }
    });

    if (!event) {
      return res.status(404).json({
        success: false,
        error: 'Evento no encontrado'
      });
    }

    // Actualizar la traducción
    await updateTranslation(id, language, {
      name,
      description,
      location,
      slug,
      seoTitle,
      seoDescription,
      keywords
    });

    // Obtener la traducción actualizada
    const updatedTranslation = await prisma.eventTranslation.findUnique({
      where: {
        eventId_languageId: {
          eventId: parseInt(id),
          languageId: (await prisma.language.findUnique({ where: { code: language } }))!.id
        }
      },
      include: {
        language: true
      }
    });

    res.json({
      success: true,
      data: updatedTranslation,
      message: `Traducción en ${language} actualizada exitosamente`
    });

  } catch (error) {
    console.error('Error updating event translation:', error);
    res.status(500).json({
      success: false,
      error: 'Error al actualizar la traducción'
    });
  }
};

// GET /api/events/:id/translations - Obtener todas las traducciones de un evento
export const getEventTranslations = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        error: 'ID del evento es requerido'
      });
    }

    const event = await prisma.event.findUnique({
      where: { id: parseInt(id) },
      include: {
        language: true,
        translations: {
          include: {
            language: true
          }
        },
        seoMetadata: {
          include: {
            language: true
          }
        }
      }
    });

    if (!event) {
      return res.status(404).json({
        success: false,
        error: 'Evento no encontrado'
      });
    }

    res.json({
      success: true,
      data: {
        event,
        translations: event.translations,
        seoMetadata: event.seoMetadata
      }
    });

  } catch (error) {
    console.error('Error getting event translations:', error);
    res.status(500).json({
      success: false,
      error: 'Error al obtener las traducciones'
    });
  }
};
