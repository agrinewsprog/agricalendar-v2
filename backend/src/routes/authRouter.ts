import { Router } from 'express'
import { login, logout, verifyToken, changePassword } from '../controllers/authController'
import { authenticateToken } from '../middlewares/authMiddleware'

const router = Router()

// Rutas públicas
router.post('/login', login)
router.post('/logout', logout)

// Rutas protegidas
router.get('/verify', verifyToken)
router.post('/change-password', authenticateToken, changePassword)

export default router
