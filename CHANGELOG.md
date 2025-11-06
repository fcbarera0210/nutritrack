Changelog

0.2.0 - Búsqueda por IA, Alimentos Personalizados, Hidratación y Mejoras de UX
- **Búsqueda nutricional por IA**: Integración con DeepSeek y Groq para buscar automáticamente macros nutricionales por nombre de alimento. Sistema híbrido con fallback automático, soporte para múltiples modelos de Groq, y indicador visual de carga durante la búsqueda.
- **Sistema de favoritos**: Funcionalidad completa para marcar alimentos favoritos, filtro de favoritos visible solo cuando el usuario tiene favoritos, acceso rápido desde la página de agregar alimento.
- **Alimentos personalizados**: Los usuarios pueden crear sus propios alimentos con información nutricional personalizada. Alimentos privados por usuario, filtro de alimentos personalizados, y validación de campos mejorada.
- **Sistema de hidratación**: Registro diario de consumo de agua con cards en el dashboard, modal de agregar hidratación con controles de incremento/decremento, y visualización de entradas diarias.
- **Mejoras en ejercicios**: Selector de iconos para ejercicios (24+ iconos de Phosphor), cálculo automático de calorías con sistema MET, modal de lista de ejercicios del día, y modal de información sobre cálculo de calorías.
- **Dashboard mejorado**: Soporte para cambio de fecha en calendario (los datos se filtran por fecha seleccionada), skeleton de carga mientras se obtienen datos, carga del nombre de usuario junto con datos del dashboard para evitar parpadeo de iniciales.
- **Mejoras en cards de comidas**: Eliminación de macros en cards (solo kcal), lista de alimentos reales en lugar de contador, y mejor layout con información clara.
- **Mejoras en diseño**: Tamaños de fuente ajustados en cards de ejercicio/hidratación (28px total, 12px unidad), nav inferior simplificado (solo Inicio, Agregar, Perfil), sin scrollbar visible en desktop.
- **Perfil mejorado**: Campos adicionales (nombre, teléfono con formato automático +56, deportes preferidos, preferencias dietéticas, alergias), validación de teléfono (máx 9 dígitos), y diseño consistente con formularios de la app.
- **Recordatorios mejorados**: Diseño consistente con nueva paleta, iconos de Phosphor para cada comida (SunHorizon, Sun, MoonStars, Orange), y funcionalidad de activación de recordatorios corregida.
- **Base de datos**: Nuevas tablas `user_favorites`, `water_logs`, y campos adicionales en `user_profiles` y `exercises`.
- **API Routes nuevas**: `/api/foods/ai-search`, `/api/foods/favorites`, `/api/foods/create`, `/api/foods/custom`, `/api/foods/[id]`, `/api/hydration/create`, `/api/exercises/delete`.
- **Utilidades nuevas**: `lib/utils/date.ts` para manejo de fechas locales, `lib/utils/exerciseIcons.ts` para mapeo de iconos de ejercicios.
- **Componentes nuevos**: `CustomFoodForm`, `HydrationForm`, `ExerciseCalculationInfo`, `DashboardSkeleton`, `FoodListSkeleton`, `ProfileSkeleton` mejorado.

0.1.3 - Rediseño Página Agregar Alimento
- Página "Agregar Alimento" completamente rediseñada: header oscuro con botón volver, título y descripción.
- Filtros de categorías: solo íconos de Phosphor (Fish, Cheese, Cherries, Carrot, Plant, Bread, Avocado, Cookie, ClipboardText, Star), sin texto visible.
- Botón de información (Info) para ver índice de categorías con nombres completos.
- Scroll horizontal para filtros cuando no caben todos en pantalla.
- Cards de alimentos rediseñadas: fondo oscuro (#131917), layout en 2 filas (nombre/kcal arriba, macros/100g abajo), íconos de macros con colores.
- Sistema de favoritos: cards con borde amarillo (#E5C438) de 5px y estrella decorativa (60x60, opacidad 15%) en esquina superior derecha.
- Carga incremental: muestra 15 alimentos inicialmente y carga 15 más automáticamente al hacer scroll.
- Buscador oculto cuando se muestra el formulario de registro.
- Formulario de registro rediseñado: sin card blanca, inputs en una fila (cantidad y tipo de comida), valores calculados en fondo oscuro con layout horizontal.
- Botón "Favorito" en header del formulario: alterna entre borde amarillo y fondo amarillo, mantiene tamaño consistente.
- Corrección: eliminado doble borde en selects (box-shadow global excluido para selects con border-transparent).

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

