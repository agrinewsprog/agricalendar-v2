import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const speciesController = {
  // Obtener todas las especies
  async getAllSpecies(req: Request, res: Response) {
    try {
      const species = await prisma.especie.findMany({
        orderBy: {
          nombre: 'asc'
        }
      })

      res.json({
        success: true,
        data: species,
        message: 'Especies obtenidas exitosamente'
      })
    } catch (error) {
      console.error('Error al obtener especies:', error)
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor',
        details: error instanceof Error ? error.message : 'Error desconocido'
      })
    }
  },

  // Obtener una especie por ID
  async getSpeciesById(req: Request, res: Response) {
    try {
      const { id } = req.params
      const speciesId = parseInt(id)

      if (isNaN(speciesId)) {
        return res.status(400).json({
          success: false,
          error: 'ID de especie inválido'
        })
      }

      const species = await prisma.especie.findUnique({
        where: {
          id: speciesId
        }
      })

      if (!species) {
        return res.status(404).json({
          success: false,
          error: 'Especie no encontrada'
        })
      }

      res.json({
        success: true,
        data: species,
        message: 'Especie obtenida exitosamente'
      })
    } catch (error) {
      console.error('Error al obtener especie:', error)
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor',
        details: error instanceof Error ? error.message : 'Error desconocido'
      })
    }
  }
}
