# 🔐 Configuración de Variables de Entorno para Producción

## Backend (.env)

```bash
# Base de datos
DATABASE_URL="postgresql://agricalendar_user:TU_PASSWORD_AQUI@localhost:5432/agricalendar"

# JWT Secret (genera uno único)
JWT_SECRET="tu_jwt_secret_muy_seguro_aqui_minimum_32_caracteres"

# Puerto del servidor
PORT=5000

# Entorno
NODE_ENV=production

# API de traducción (opcional, ya incluida gratis)
# TRANSLATION_API_KEY=""
```

## Frontend Public (.env)

```bash
# URL de la API
NEXT_PUBLIC_API_URL=https://agricalendar.net/api

# Entorno
NODE_ENV=production
```

## Frontend Admin (.env)

```bash
# URL de la API
NEXT_PUBLIC_API_URL=https://agricalendar.net/api

# Entorno
NODE_ENV=production
```

## 📝 Comandos para configurar:

```bash
# En el servidor
cd ~/agricalendar-v2

# Backend
cp backend/.env.example backend/.env
nano backend/.env
# Pegar la configuración de arriba y editar los valores

# Frontend Public
cp frontend-public/.env.example frontend-public/.env
nano frontend-public/.env
# Pegar la configuración de arriba

# Frontend Admin
cp frontend-admin/.env.example frontend-admin/.env
nano frontend-admin/.env
# Pegar la configuración de arriba
```

## 🗄️ Configurar Base de Datos:

```bash
# Crear usuario y base de datos en PostgreSQL
sudo -u postgres psql

# Dentro de PostgreSQL:
CREATE DATABASE agricalendar;
CREATE USER agricalendar_user WITH PASSWORD 'tu_password_aqui';
GRANT ALL PRIVILEGES ON DATABASE agricalendar TO agricalendar_user;
\q
```

## 🔑 Generar JWT Secret:

```bash
# Genera un JWT secret seguro
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```
