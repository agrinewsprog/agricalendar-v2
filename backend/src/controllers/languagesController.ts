import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/languages - Obtener todos los idiomas
export const getAllLanguages = async (req: Request, res: Response) => {
  try {
    const languages = await prisma.language.findMany({
      where: { isActive: true },
      orderBy: [
        { isDefault: 'desc' },
        { name: 'asc' }
      ]
    });

    res.json({
      success: true,
      data: languages
    });
  } catch (error) {
    console.error('Error fetching languages:', error);
    res.status(500).json({
      success: false,
      error: 'Error al obtener idiomas'
    });
  }
};

// GET /api/languages/default - Obtener idioma por defecto
export const getDefaultLanguage = async (req: Request, res: Response) => {
  try {
    const defaultLanguage = await prisma.language.findFirst({
      where: { 
        isDefault: true,
        isActive: true 
      }
    });

    if (!defaultLanguage) {
      return res.status(404).json({
        success: false,
        error: 'Idioma por defecto no encontrado'
      });
    }

    res.json({
      success: true,
      data: defaultLanguage
    });
  } catch (error) {
    console.error('Error fetching default language:', error);
    res.status(500).json({
      success: false,
      error: 'Error al obtener idioma por defecto'
    });
  }
};
