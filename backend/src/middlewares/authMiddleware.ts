import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { prisma } from '../lib/prisma'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'

interface AuthRequest extends Request {
  user?: {
    userId: number
    email: string
    role: string
  }
}

export const authenticateToken = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1] // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Token de acceso requerido'
      })
    }

    // Verificar JWT
    const decoded = jwt.verify(token, JWT_SECRET) as any

    // Verificar que la sesión existe y no ha expirado
    const session = await prisma.userSession.findUnique({
      where: { token },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            role: true,
            state: true
          }
        }
      }
    })

    if (!session || session.expiresAt < new Date()) {
      return res.status(401).json({
        success: false,
        message: 'Token expirado o inválido'
      })
    }

    if (session.user.state !== 'ACTIVE') {
      return res.status(401).json({
        success: false,
        message: 'Usuario inactivo'
      })
    }

    // Agregar usuario al request
    req.user = {
      userId: session.user.id,
      email: session.user.email,
      role: session.user.role
    }

    next()

  } catch (error) {
    console.error('Error en autenticación:', error)
    return res.status(403).json({
      success: false,
      message: 'Token inválido'
    })
  }
}

// Middleware para verificar roles específicos
export const requireRole = (roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'No autenticado'
      })
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Permisos insuficientes'
      })
    }

    next()
  }
}

// Middleware para super admin
export const requireSuperAdmin = requireRole(['SUPER_ADMIN'])

// Middleware para admin o superior
export const requireAdmin = requireRole(['SUPER_ADMIN', 'ADMIN'])

// Middleware para editor o superior
export const requireEditor = requireRole(['SUPER_ADMIN', 'ADMIN', 'EDITOR'])
