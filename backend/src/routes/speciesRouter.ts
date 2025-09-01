import { Router } from 'express'
import { speciesController } from '../controllers/speciesController'

const router = Router()

// Obtener todas las especies
router.get('/', speciesController.getAllSpecies)

// Obtener una especie por ID
router.get('/:id', speciesController.getSpeciesById)

export default router
