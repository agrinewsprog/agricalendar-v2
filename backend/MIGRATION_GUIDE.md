# Script de Migración de Eventos MySQL → PostgreSQL

## Pasos para ejecutar la migración:

### 1. Instalar dependencias de MySQL

```bash
cd /home/agrinode/agricalendar-v2/backend
npm install mysql2
```

### 2. Configurar credenciales MySQL

Editar el archivo `scripts/migrate-from-mysql.js` y actualizar:

```javascript
const MYSQL_CONFIG = {
  host: "TU_HOST_MYSQL", // ej: localhost, 192.168.1.100
  user: "TU_USUARIO_MYSQL", // ej: root, agricalendar
  password: "TU_PASSWORD_MYSQL", // tu contraseña MySQL
  database: "TU_BASE_DATOS", // nombre de tu base de datos
  port: 3306,
};
```

### 3. Verificar mapeo de idiomas

Si tienes idiomas diferentes a 1=español, 2=inglés, actualizar:

```javascript
const LANGUAGE_MAP = {
  1: 1, // Tu idioma 1 MySQL -> ID en PostgreSQL
  2: 2, // Tu idioma 2 MySQL -> ID en PostgreSQL
  // ...
};
```

### 4. Probar conexión

```bash
node scripts/migrate-from-mysql.js test
```

### 5. Ejecutar migración

```bash
node scripts/migrate-from-mysql.js migrate
```

## Qué hace el script:

✅ Migra todos los eventos de MySQL a PostgreSQL
✅ Mapea campos automáticamente
✅ Genera slugs únicos si faltan
✅ Asigna todos los eventos al usuario admin (ID: 1)
✅ Marca todos como PUBLISHED
✅ Migra metadatos SEO si existen
✅ Maneja errores individualmente (continúa aunque falle uno)

## Campos migrados:

| MySQL       | PostgreSQL              | Observaciones                     |
| ----------- | ----------------------- | --------------------------------- |
| id          | id                      | Se mantiene el ID original        |
| name        | name                    | Título del evento                 |
| image       | image                   | URL de la imagen                  |
| start_date  | startDate               | Fecha de inicio                   |
| end_date    | endDate                 | Fecha de fin (opcional)           |
| start_time  | startTime               | Hora de inicio                    |
| end_time    | endTime                 | Hora de fin                       |
| color       | color                   | Color hex del evento              |
| location    | location                | Ubicación                         |
| description | description             | Descripción del evento            |
| state       | state                   | Valor numérico como string        |
| region      | region                  | Región geográfica                 |
| tipo        | tipo                    | Tipo de evento                    |
| website     | website                 | Sitio web                         |
| slugevento  | slug                    | URL amigable (se genera si falta) |
| idioma      | languageId              | Mapeado según LANGUAGE_MAP        |
| seo_title   | seoMetadata.title       | Metadatos SEO                     |
| seo_desc    | seoMetadata.description | Metadatos SEO                     |

## Valores por defecto:

- **userId**: 1 (admin actual)
- **status**: 'PUBLISHED' (todos publicados)
- **views**: 0
- **isRecurring**: false
- **isFeatured**: false
- **createdAt/updatedAt**: fecha actual

## Importante:

⚠️ **Backup**: Haz backup de PostgreSQL antes de migrar
⚠️ **Test**: Ejecuta primero con `test` para verificar conexiones
⚠️ **Duplicados**: Si hay eventos con el mismo slug, se generará uno nuevo

## Comandos de backup/restore:

```bash
# Backup antes de migrar
pg_dump -U agricalendar_user -h localhost agricalendar > backup_antes_migracion.sql

# Restore si algo sale mal
psql -U agricalendar_user -h localhost agricalendar < backup_antes_migracion.sql
```
