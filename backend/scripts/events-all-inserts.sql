-- Migración completa de eventos 2025+
DELETE FROM events WHERE id > 0;


-- Actualizar secuencia
SELECT setval(pg_get_serial_sequence('events', 'id'), (SELECT MAX(id) FROM events));
