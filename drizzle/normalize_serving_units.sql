-- Normalizar unidades de medida: todas las que no sean 'g' o 'ml' se convierten a 'unit'
UPDATE "foods"
SET "serving_unit" = 'unit'
WHERE "serving_unit" NOT IN ('g', 'ml')
  AND "serving_unit" IS NOT NULL;

