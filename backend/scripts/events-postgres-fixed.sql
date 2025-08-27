-- Migración de eventos MySQL → PostgreSQL (CORREGIDO)
-- Basado en la estructura real de PostgreSQL

-- Insertar eventos con nombres de columnas correctos
INSERT INTO events (id, name, image, start_date, end_date, start_time, end_time, color, location, description, state, region, tipo, website, slugevento, status, idioma, user_id, created_at, updated_at) VALUES (6, 'PorciFORUM 2022', '20220209logo-porciforum2022_color.png', '2022-03-23', '2022-03-24', '15:30', '15:30', '2', 'Palacio de congresos La Llotja, Lleida, España', 'PorciFORUM 2022 más renovado que nunca. Vuelve en su 7ma edición comprometidos con el sector porcino.', '1', '4', '1', 'https://porciforum.info/', 'porciforum-2022', 'PUBLISHED', 1, 1, NOW(), NOW());

INSERT INTO events (id, name, image, start_date, end_date, start_time, end_time, color, location, description, state, region, tipo, website, slugevento, status, idioma, user_id, created_at, updated_at) VALUES (9, 'IPPE 2025', '20220214ippe logo.png', '2025-01-28', '2025-01-30', '17:15', '17:15', '1', 'Georgia World Congress Center, Atlanta, USA', 'International Production & Processing Expo (IPPE) regresa con más de 1,400 expositores', '1', '2', '1', 'www.ippexpo.org', 'ippe-2025', 'PUBLISHED', 1, 1, NOW(), NOW());

INSERT INTO events (id, name, image, start_date, end_date, start_time, end_time, color, location, description, state, region, tipo, website, slugevento, status, idioma, user_id, created_at, updated_at) VALUES (10, 'NutriFORUM 2022', '20220214logo-nutriforum2022_color (1).jpg', '2022-04-20', '2022-04-21', '9:45', '14:00', '3', 'La Llotja, Lleida, España', 'Vuelve la 6ta edición del NutriFORUM para seguir aportando al sector y definiendo la nutrición animal.', '1', '4', '1', 'https://nutriforum.info/', 'nutriforum-2022', 'PUBLISHED', 1, 1, NOW(), NOW());

INSERT INTO events (id, name, image, start_date, end_date, start_time, end_time, color, location, description, state, region, tipo, website, slugevento, status, idioma, user_id, created_at, updated_at) VALUES (13, 'ILDEX Vietnam', '20220214ildex vietnam.png', '2022-08-03', '2022-08-05', '12:00', '12:00', '5', 'Ciudad Ho Chi Minh, Vietnam', 'Feria de ganado, productos lácteos, procesamiento de carne y de la acuicultura', '1', '1', '2', 'ildex.com.vn/en/home', 'ildex-vietnam', 'PUBLISHED', 1, 1, NOW(), NOW());

INSERT INTO events (id, name, image, start_date, end_date, start_time, end_time, color, location, description, state, region, tipo, website, slugevento, status, idioma, user_id, created_at, updated_at) VALUES (14, 'WBC 2022', '20220214wbc madrid.png', '2022-09-04', '2022-09-08', '17:30', '17:30', '4', 'Madrid', 'El espacio para reunir a veterinarios trabajando en ganado lechero y vacuno y otros rumiantes, científicos de universidades e institutos de investigación, asesores de medicina de producción, profesionales', '1', '4', '1', 'https://www.wbc-madrid2022.com/index.php/es/', 'wbc-2022', 'PUBLISHED', 1, 1, NOW(), NOW());

-- Actualizar secuencia de IDs
SELECT setval(pg_get_serial_sequence('events', 'id'), (SELECT MAX(id) FROM events));
