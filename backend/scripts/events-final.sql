-- Migración de eventos 2025+
DELETE FROM events WHERE id > 0;

INSERT INTO events (id, name, image, start_date, end_date, start_time, end_time, color, location, description, state, region, tipo, website, slugevento, status, idioma, user_id, created_at, updated_at) VALUES (9, 'IPPE 2025', '20220214ippe logo.png', '2025-01-28', '2025-01-30', '', '', '', '', '', '', '', '', '', 'evento-9', 'PUBLISHED', 1, 1, NOW(), NOW()) ON CONFLICT (slugevento) DO NOTHING;

-- Actualizar secuencia
SELECT setval(pg_get_serial_sequence('events', 'id'), (SELECT MAX(id) FROM events));
