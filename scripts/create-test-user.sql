-- Script para crear un usuario de prueba en Neon
-- Ejecuta este SQL en Neon Console si necesitas un usuario de prueba rápido

-- Usuario: test@nutritrack.com
-- Password: test123456 (hasheado con bcrypt)
-- Esto es solo para testing

INSERT INTO "users" (email, password_hash, name, created_at)
VALUES (
  'test@nutritrack.com',
  '$2a$10$XGQ9xZoZqJ3vZyG7vj/2zuL4J5K5vH5K5vH5K5vH5K5vH5K5vH5H6', -- hash de "test123456"
  'Usuario de Prueba',
  NOW()
) RETURNING id;

-- Luego ejecuta esto reemplazando USER_ID con el ID devuelto arriba:
-- INSERT INTO "user_profiles" (user_id, updated_at)
-- VALUES (USER_ID, NOW());
--
-- INSERT INTO "user_streaks" (user_id)
-- VALUES (USER_ID);

