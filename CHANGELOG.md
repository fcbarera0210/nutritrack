Changelog

0.1.2 - Rediseño Login y Register
- Login y Register rediseñados: header oscuro con logo (3 puntos verticales), formularios con nuevos estilos.
- Inputs: Phosphor Icons (At, Key, User, Eye/EyeClosed), padding 10px, fuente semibold 16px, placeholder #D9D9D9.
- Borde de focus: color #CEFB48 (lime verde del nuevo diseño).
- Sistema de versión centralizado: constante APP_VERSION en `lib/constants.ts` sincronizada con package.json y CHANGELOG.
- Guards server-side: protección de rutas sin middleware, usando layouts de grupos (app) y (auth).
- Fix: eliminado box-shadow global de inputs en páginas de auth para evitar doble borde.
- Fix: eliminadas referencias a iconos inexistentes en manifest.json y notifications.ts (error 404 resuelto).

0.1.1 - Dashboard y Navbar actualizados
- Cards de Ejercicio y Agua con nuevos estilos, iconografía contorneada y ejemplos.
- Cards de Comidas: layout, solapamiento de miniaturas, botón “+” destacado, nutrientes en una línea, imágenes demo (picsum).
- Navbar rediseñado: fondo #131917, padding 10/5, radio 15; botón central 38x38 #CEFB48.
- Migración a `@phosphor-icons/react` v2 en toda la app.
- Fix build Next 16: actualización de handlers en `/api/reminders/[id]`, export CSV y scripts de seed.

0.1.0 - Diseño header y home (inicial)
- Implementado nuevo fondo global y header con radio inferior 60px.
- Calendario semanal rediseñado: selección, alineación y espaciados.
- Box de kcal en sección oscura: racha + total kcal.
- Gráficos circulares (macros) con estilos definitivos.
- Limpieza de markdowns y estructura de documentación.

Nota: Sigue el formato semántico simplificado. Próximas entradas se agregan aquí.

