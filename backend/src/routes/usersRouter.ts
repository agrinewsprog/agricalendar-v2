import { Router } from 'express'
import { 
  getAllUsers, 
  getUserById, 
  createUser, 
  updateUser, 
  deleteUser 
} from '../controllers/usersController'
import { authenticateToken } from '../middlewares/authMiddleware'

const router = Router()

// Todas las rutas requieren autenticación
router.use(authenticateToken)

// Rutas CRUD de usuarios
router.get('/', getAllUsers)
router.get('/:id', getUserById)
router.post('/', createUser)
router.put('/:id', updateUser)
router.delete('/:id', deleteUser)

export default router
