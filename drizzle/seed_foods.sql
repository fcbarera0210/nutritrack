-- Seed de alimentos chilenos para NutriTrack
-- Ejecutar este SQL en Neon Console

INSERT INTO "foods" (name, brand, calories, protein, carbs, fat, fiber, sodium, sugar, serving_size, serving_unit, barcode, source, is_custom, user_id)
VALUES
  ('Pan Marraqueta', NULL, 280, 9, 52, 3, 2.5, 560, 2, 100, 'g', NULL, 'local', false, NULL),
  ('Palta (Aguacate)', NULL, 160, 2, 9, 15, 7, 7, 0.7, 100, 'g', NULL, 'local', false, NULL),
  ('Tomate', NULL, 18, 0.9, 3.9, 0.2, 1.2, 5, 2.6, 100, 'g', NULL, 'local', false, NULL),
  ('Huevo', NULL, 155, 13, 1.1, 11, 0, 124, 0.6, 100, 'g', NULL, 'local', false, NULL),
  ('Queso Gouda', NULL, 380, 24, 2.2, 31, 0, 819, 0.5, 100, 'g', NULL, 'local', false, NULL),
  ('Leche Entera', 'Soprole', 61, 3.1, 4.8, 3.3, 0, 44, 4.8, 100, 'ml', NULL, 'local', false, NULL),
  ('Arroz Blanco Cocido', NULL, 130, 2.7, 28, 0.3, 0.4, 1, 0.1, 100, 'g', NULL, 'local', false, NULL),
  ('Pollo a la Plancha', NULL, 239, 27, 0, 14, 0, 82, 0, 100, 'g', NULL, 'local', false, NULL),
  ('Filete de Pescado', NULL, 206, 22, 0, 12, 0, 111, 0, 100, 'g', NULL, 'local', false, NULL),
  ('Papas Fritas', NULL, 319, 3.5, 41, 17, 3.5, 321, 0.3, 100, 'g', NULL, 'local', false, NULL)
ON CONFLICT DO NOTHING;

