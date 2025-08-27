import { Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { prisma } from '../lib/prisma'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'
const JWT_EXPIRES_IN = '7d'

// Login
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email y contraseña son requeridos'
      })
    }

    // Buscar usuario por email
    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      })
    }

    // Verificar estado del usuario
    if (user.state !== 'ACTIVE') {
      return res.status(401).json({
        success: false,
        message: 'Usuario inactivo'
      })
    }

    // Verificar contraseña
    const isValidPassword = await bcrypt.compare(password, user.password)
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      })
    }

    // Generar token JWT
    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email, 
        role: user.role 
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    )

    // Guardar sesión en la base de datos
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 7) // 7 días

    await prisma.userSession.create({
      data: {
        userId: user.id,
        token,
        expiresAt
      }
    })

    // Respuesta exitosa (sin contraseña)
    const { password: _, salt: __, ...userWithoutPassword } = user

    res.json({
      success: true,
      message: 'Login exitoso',
      data: {
        user: userWithoutPassword,
        token
      }
    })

  } catch (error) {
    console.error('Error en login:', error)
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    })
  }
}

// Logout
export const logout = async (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '')

    if (token) {
      // Eliminar sesión de la base de datos
      await prisma.userSession.deleteMany({
        where: { token }
      })
    }

    res.json({
      success: true,
      message: 'Logout exitoso'
    })

  } catch (error) {
    console.error('Error en logout:', error)
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    })
  }
}

// Verificar token
export const verifyToken = async (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '')

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Token no proporcionado'
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
            name: true,
            username: true,
            email: true,
            role: true,
            state: true,
            createdAt: true,
            updatedAt: true
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

    res.json({
      success: true,
      data: {
        user: session.user,
        token
      }
    })

  } catch (error) {
    console.error('Error verificando token:', error)
    res.status(401).json({
      success: false,
      message: 'Token inválido'
    })
  }
}

// Cambiar contraseña
export const changePassword = async (req: Request, res: Response) => {
  try {
    const { currentPassword, newPassword } = req.body
    const userId = (req as any).user.userId

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Contraseña actual y nueva son requeridas'
      })
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'La nueva contraseña debe tener al menos 6 caracteres'
      })
    }

    // Buscar usuario
    const user = await prisma.user.findUnique({
      where: { id: userId }
    })

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      })
    }

    // Verificar contraseña actual
    const isValidPassword = await bcrypt.compare(currentPassword, user.password)
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: 'Contraseña actual incorrecta'
      })
    }

    // Hash de la nueva contraseña
    const hashedPassword = await bcrypt.hash(newPassword, 12)

    // Actualizar contraseña
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword }
    })

    // Invalidar todas las sesiones existentes
    await prisma.userSession.deleteMany({
      where: { userId }
    })

    res.json({
      success: true,
      message: 'Contraseña cambiada exitosamente. Por favor, inicia sesión nuevamente.'
    })

  } catch (error) {
    console.error('Error cambiando contraseña:', error)
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    })
  }
}
