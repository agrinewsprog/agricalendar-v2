# AgriCalendar v2 🌾📅

Sistema de calendario agrícola multiidioma con gestión de eventos y panel administrativo completo.

## 🌍 Overview

AgriCalendar v2 es una plataforma integral de calendario agrícola multiidioma que soporta 6 idiomas (Español, Inglés, Portugués, Vietnamita, Tailandés, Indonesio) con capacidades de traducción automática, optimización SEO y diseño responsivo moderno.

## 🏗️ Arquitectura del Proyecto

Este es un **monorepo** que contiene tres aplicaciones principales:

```
agricalendar-v2/
├── backend/                 # API REST con Express.js + TypeScript + Prisma
├── frontend-public/         # Sitio público Next.js 14 (App Router)
├── frontend-admin/          # Panel administrativo Next.js 14 (App Router)
├── shared/                  # Utilidades y tipos compartidos
├── scripts/                 # Scripts de deployment
├── docker-compose.prod.yml  # Configuración Docker para producción
├── ecosystem.config.js      # Configuración de procesos PM2
└── DEPLOYMENT.md           # Guía de deployment
```

## 🚀 Aplicaciones

### Backend (`/backend`)

- **Tech Stack:** Node.js, Express.js, TypeScript, Prisma ORM, PostgreSQL
- **Características:**
  - API RESTful con operaciones CRUD completas
  - Servicio de traducción automática (MyMemory API)
  - Gestión de contenido multiidioma
  - Manejo de uploads de archivos
  - Autenticación y autorización
- **Puerto:** 5000 (desarrollo), configurable para producción

### Frontend Público (`/frontend-public`)

- **Tech Stack:** Next.js 14, TypeScript, Tailwind CSS, FullCalendar
- **Características:**
  - Soporte multiidioma con routing dinámico (`/[lang]/...`)
  - Optimización SEO con metadata dinámica
  - Interfaz de calendario responsiva con múltiples vistas
  - Filtrado y búsqueda de eventos
  - Server-side rendering para mejor rendimiento
- **Puerto:** 3000 (desarrollo)

### Frontend Admin (`/frontend-admin`)

- **Tech Stack:** Next.js 14, TypeScript, Tailwind CSS
- **Características:**
  - Panel de administración completo
  - Sistema de gestión de contenido
  - Creación y edición de eventos
  - Gestión de usuarios
  - Analytics y reportes
- **Puerto:** 3001 (desarrollo)

## 🌐 Supported Languages

- 🇪🇸 **Spanish (es)** - Primary language
- 🇺🇸 **English (en)**
- 🇧🇷 **Portuguese (pt)**
- 🇻🇳 **Vietnamese (vi)**
- 🇹🇭 **Thai (th)**
- 🇮🇩 **Indonesian (id)**

## ⚡ Quick Start

### Instalación y Desarrollo

1. **Clonar el repositorio:**

   ```bash
   git clone https://github.com/agrinewsprog/agricalendar-v2.git
   cd agricalendar-v2
   ```

2. **Configurar variables de entorno:**

   ```bash
   # Backend
   cp backend/.env.example backend/.env
   # Editar .env con tu configuración de base de datos

   # Frontend Público
   cp frontend-public/.env.example frontend-public/.env

   # Frontend Admin
   cp frontend-admin/.env.example frontend-admin/.env
   ```

3. **Iniciar Base de Datos (PostgreSQL):**

   ```bash
   docker-compose up -d postgres
   ```

4. **Configurar Backend:**

   ```bash
   cd backend
   npm install
   npx prisma migrate dev
   npm run seed
   npm run dev
   ```

5. **Iniciar Aplicaciones Frontend:**

   ```bash
   # Terminal 1: Frontend Público
   cd frontend-public
   npm install
   npm run dev

   # Terminal 2: Panel Admin
   cd frontend-admin
   npm install
   npm run dev
   ```

## 🏃‍♂️ Ejecutar en Desarrollo

### Opción 1: Ejecutar cada aplicación por separado

```bash
# Terminal 1: Backend
cd backend
npm run dev

# Terminal 2: Frontend Público
cd frontend-public
npm run dev

# Terminal 3: Panel Admin
cd frontend-admin
npm run dev
```

## 🌐 URLs de la Aplicación

### Desarrollo

- **Frontend Público**: http://localhost:3000
- **Panel Admin**: http://localhost:3001
- **API Backend**: http://localhost:5000
- **Prisma Studio**: http://localhost:5555

### Producción

- **Sitio Público**: https://agricalendar.net
- **Panel Admin**: https://agricalendar.net/admin
- **API**: https://agricalendar.net/api

## 📊 Base de Datos

### Modelos Principales:

- **Event**: Eventos agrícolas
- **EventTranslation**: Traducciones automáticas de eventos
- **Language**: Idiomas soportados por la plataforma
- **User**: Usuarios del sistema
- **SeoMetadata**: Metadatos SEO por idioma y evento

### Funcionalidades Implementadas:

- ✅ Sistema multiidioma completo
- ✅ Traducción automática con MyMemory API
- ✅ SEO optimizado por evento/idioma
- ✅ Calendario interactivo con FullCalendar
- ✅ Panel administrativo completo
- ✅ API REST completa
- ✅ Sistema de filtros y búsqueda

## 🔧 Scripts Disponibles

### Root (Monorepo):

```bash
npm run install:all    # Instalar dependencias en todos los proyectos
npm run dev           # Ejecutar todos los servicios en desarrollo
npm run build:all     # Build de todas las aplicaciones
npm run deploy        # Deploy con PM2
npm run deploy:docker # Deploy con Docker
```

### Backend:

```bash
npm run dev          # Desarrollo con nodemon
npm run build        # Compilar TypeScript
npm run start        # Producción
npm run db:generate  # Generar cliente Prisma
npm run db:push      # Sincronizar schema
npm run db:studio    # Abrir Prisma Studio
npm run seed         # Poblar base de datos
```

### Frontend (Público y Admin):

```bash
npm run dev          # Desarrollo
npm run build        # Build para producción
npm run start        # Servir build
npm run lint         # Linting
```

## 🚧 Estado del Proyecto

- ✅ Setup inicial completo
- ✅ Backend API completamente funcional
- ✅ Sistema de base de datos implementado
- ✅ Frontend público con multiidioma
- ✅ Panel administrativo funcional
- ✅ Sistema de traducciones automáticas
- ✅ SEO dinámico implementado
- ✅ Calendario interactivo con FullCalendar
- ✅ Sistema de filtros y búsqueda
- ✅ Configuración de producción lista
- ⏳ Pendiente: Deploy en servidor de producción

## 📝 Notas de Desarrollo

1. **Base de Datos**: PostgreSQL configurado con Docker para facilitar el desarrollo
2. **Puertos**: Backend (5000), Frontend público (3000), Admin (3001)
3. **Variables de entorno**: Configuradas en cada aplicación con archivos .env
4. **Traducciones**: Implementadas con MyMemory API (gratuita, sin API key)
5. **SEO**: Metadata dinámica generada automáticamente por idioma y evento
6. **Deployment**: Configurado para producción con Docker Compose y PM2

## � Deployment

Para instrucciones detalladas de deployment en producción, consulta [DEPLOYMENT.md](./DEPLOYMENT.md).

### Quick Deploy:

```bash
# Con PM2
npm run deploy

# Con Docker
npm run deploy:docker
```

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📞 Contacto

AgriNews - [@agrinewsprog](https://github.com/agrinewsprog)

Link del Proyecto: [https://github.com/agrinewsprog/agricalendar-v2](https://github.com/agrinewsprog/agricalendar-v2)
