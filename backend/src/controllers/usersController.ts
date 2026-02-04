import { Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import { prisma } from '../lib/prisma'

// Obtener todos los usuarios
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        role: true,
        state: true,
        createdAt: true,
        updatedAt: true,
        // No devolvemos password ni salt
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    res.json({
      success: true,
      data: users
    })
  } catch (error) {
    console.error('Error al obtener usuarios:', error)
    res.status(500).json({
      success: false,
      message: 'Error al obtener usuarios'
    })
  }
}

// Obtener un usuario por ID
export const getUserById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params

    const user = await prisma.user.findUnique({
      where: { id: parseInt(id) },
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        role: true,
        state: true,
        createdAt: true,
        updatedAt: true,
      }
    })

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      })
    }

    res.json({
      success: true,
      data: user
    })
  } catch (error) {
    console.error('Error al obtener usuario:', error)
    res.status(500).json({
      success: false,
      message: 'Error al obtener usuario'
    })
  }
}

// Crear un nuevo usuario
export const createUser = async (req: Request, res: Response) => {
  try {
    const { name, username, email, password, role, state } = req.body

    // Validaciones
    if (!name || !username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Nombre, usuario, email y contraseña son requeridos'
      })
    }

    // Verificar si el usuario o email ya existen
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { username },
          { email }
        ]
      }
    })

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: existingUser.username === username 
          ? 'El nombre de usuario ya existe' 
          : 'El email ya está registrado'
      })
    }

    // Encriptar contraseña
    const hashedPassword = await bcrypt.hash(password, 10)

    // Crear usuario
    const newUser = await prisma.user.create({
      data: {
        name,
        username,
        email,
        password: hashedPassword,
        role: role || 'ADMIN',
        state: state || 'ACTIVE'
      },
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        role: true,
        state: true,
        createdAt: true,
        updatedAt: true,
      }
    })

    res.status(201).json({
      success: true,
      message: 'Usuario creado exitosamente',
      data: newUser
    })
  } catch (error) {
    console.error('Error al crear usuario:', error)
    res.status(500).json({
      success: false,
      message: 'Error al crear usuario'
    })
  }
}

// Actualizar un usuario
export const updateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const { name, username, email, password, role, state } = req.body

    // Verificar que el usuario existe
    const existingUser = await prisma.user.findUnique({
      where: { id: parseInt(id) }
    })

    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      })
    }

    // Verificar si el username o email están siendo usados por otro usuario
    if (username || email) {
      const duplicateUser = await prisma.user.findFirst({
        where: {
          AND: [
            { id: { not: parseInt(id) } },
            {
              OR: [
                username ? { username } : {},
                email ? { email } : {}
              ]
            }
          ]
        }
      })

      if (duplicateUser) {
        return res.status(400).json({
          success: false,
          message: duplicateUser.username === username 
            ? 'El nombre de usuario ya existe' 
            : 'El email ya está registrado'
        })
      }
    }

    // Preparar datos para actualizar
    const updateData: any = {}
    if (name !== undefined) updateData.name = name
    if (username !== undefined) updateData.username = username
    if (email !== undefined) updateData.email = email
    if (role !== undefined) updateData.role = role
    if (state !== undefined) updateData.state = state
    
    // Si se proporciona una nueva contraseña, encriptarla
    if (password) {
      updateData.password = await bcrypt.hash(password, 10)
    }

    // Actualizar usuario
    const updatedUser = await prisma.user.update({
      where: { id: parseInt(id) },
      data: updateData,
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        role: true,
        state: true,
        createdAt: true,
        updatedAt: true,
      }
    })

    res.json({
      success: true,
      message: 'Usuario actualizado exitosamente',
      data: updatedUser
    })
  } catch (error) {
    console.error('Error al actualizar usuario:', error)
    res.status(500).json({
      success: false,
      message: 'Error al actualizar usuario'
    })
  }
}

// Eliminar un usuario
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const userId = parseInt(id)

    // Verificar que el usuario existe
    const existingUser = await prisma.user.findUnique({
      where: { id: userId }
    })

    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      })
    }

    // No permitir eliminar el propio usuario (opcional)
    const currentUserId = (req as any).user?.userId
    if (currentUserId === userId) {
      return res.status(400).json({
        success: false,
        message: 'No puedes eliminar tu propio usuario'
      })
    }

    // Eliminar usuario
    await prisma.user.delete({
      where: { id: userId }
    })

    res.json({
      success: true,
      message: 'Usuario eliminado exitosamente'
    })
  } catch (error) {
    console.error('Error al eliminar usuario:', error)
    res.status(500).json({
      success: false,
      message: 'Error al eliminar usuario'
    })
  }
}
