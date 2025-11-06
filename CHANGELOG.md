Changelog

0.3.1 - Correcciones de UI/UX y Ocultamiento de Botones en Modales
- **Mejoras de UI/UX**: Los botones de navegación (BottomNav y FloatingAddButton) ahora se ocultan automáticamente cuando hay modales abiertos para mejorar la experiencia de usuario y evitar interferencias visuales
- **Contexto de Modales**: Implementado sistema de contexto React (`ModalContext`) para gestionar el estado de los modales globalmente, permitiendo que los componentes se oculten automáticamente cuando hay modales activos
- **Dashboard**: Refactorizado para evitar doble renderizado y animaciones duplicadas, manteniendo la misma estructura durante la carga (skeleton inline) para una transición más suave
- **Correcciones**: Corregido problema de carga infinita en la página de perfil al eliminar bloqueo innecesario en useEffect. Corregido error de TypeScript donde `fetchProfile` no estaba disponible fuera del useEffect. El botón flotante ahora se oculta correctamente en la página de agregar alimento cuando hay modales abiertos (crear alimento personalizado, editar, eliminar, etc.)

0.3.0 - Sistema de Rachas, Edición de Alimentos Personalizados, Rediseño del Nav Bar y Correcciones de Autenticación
- **Correcciones críticas de autenticación**: Eliminado bypass de autenticación en producción que permitía acceso sin login. Mejorado el sistema de logout para funcionar correctamente en PWA usando `window.location.href` en lugar de `router.push()`. Agregadas verificaciones de autenticación en el cliente (dashboard y perfil) que redirigen automáticamente al login cuando detectan respuestas 401/403. El logout ahora limpia correctamente las cookies tanto en servidor como en cliente.
- **Sistema de rachas (streaks)**: Implementación completa de sistema de rachas que se activa cuando el usuario registra al menos 1 ejercicio o 1 comida por día. La racha se activa después de 3 días consecutivos, mostrando un mensaje en el dashboard con el ícono de llama. Los días con racha se muestran con el ícono de llama en el calendario semanal, con animación multicolor similar al HandWaving del header. El ícono alterna con la vocal del día cada 3 segundos (llama) y 2 segundos (vocal) con animación de fade suave.
- **Edición y eliminación de alimentos personalizados**: Los usuarios ahora pueden editar y eliminar sus alimentos personalizados desde la vista de detalles del alimento. Botones de editar (azul con ícono PencilSimpleLine) y eliminar (rojo con ícono Trash) visibles solo para alimentos personalizados del usuario. Modal de confirmación para eliminar con diseño mejorado.
- **Rediseño completo del nav bar**: Nav bar completamente rediseñado con botones individuales que tienen su propio fondo, borde y sombra. El botón activo muestra ícono + texto, mientras que los inactivos solo muestran el ícono. Espacio visible entre botones mostrando el fondo de la página. Animaciones suaves al cambiar entre pantallas (escala, fade, slide). Borde sólido de 3px color #404040 y sombra proyectada en cada botón.
- **Botón flotante para agregar alimentos**: Nuevo botón flotante redondo verde (#3CCC1F) con ícono Plus en la esquina inferior derecha de todas las páginas, navegando a la página de agregar alimento. Posicionado a 90px del bottom y 20px del right.
- **Correcciones en unidades de porción**: Corrección completa del sistema de unidades de porción (servingUnit) para que se muestre correctamente en todas las vistas (cards de alimentos, formulario de registro, modal de detalles en dashboard). Los cálculos ahora usan correctamente el servingSize y servingUnit del alimento.
- **Mejoras en el perfil**: El peso ahora muestra tanto el peso actual como el peso objetivo (formato: "86/75 kg"), con el peso objetivo en negrita y tamaño mayor. Layout de cards de Kcal y Peso cambiado a 50/50 horizontal. Border-radius de las cards de macros cambiado a 24px.
- **Botón de agregar comida en modal de detalles**: Agregado botón "Agregar Alimento" al final de la lista de alimentos en el modal de detalles de comidas del dashboard.
- **Mejoras en el calendario**: Animación de fade suave (0.8s) al alternar entre ícono de llama y vocal del día. El ícono de llama tiene animación multicolor cuando no está seleccionado, y color oscuro cuando está seleccionado.
- **Utilidades nuevas**: `lib/utils/streaks.ts` para manejo centralizado de rachas de usuario.
- **Componentes nuevos**: `FloatingAddButton` para el botón flotante de agregar alimentos.
- **API Routes actualizadas**: `/api/foods/[id]` ahora soporta PUT y DELETE para editar y eliminar alimentos personalizados. `/api/dashboard/today` ahora retorna `streakDays` y `servingUnit` correctamente. `/api/logs/create` y `/api/exercises/create` actualizan automáticamente las rachas del usuario.

0.2.2 - Límite de Búsquedas por IA y Mejoras de UX
- **Límite diario de búsquedas por IA**: Implementación de sistema de control con límite de 15 búsquedas diarias por usuario para gestionar el uso gratuito de APIs de IA (Groq/DeepSeek). Tabla `ai_search_logs` para rastrear búsquedas diarias.
- **Contador de búsquedas restantes**: Visualización en tiempo real del número de búsquedas disponibles en el formulario de alimento personalizado, con actualización automática después de cada búsqueda.
- **Mensaje informativo sobre IA**: Tip con icono Lightbulb inline que indica la importancia de ajustar el tamaño de porción antes de buscar por IA para obtener resultados más precisos.
- **Mejoras visuales al alcanzar límite**: Botón de búsqueda por IA se deshabilita cuando no quedan búsquedas, contador cambia a color rojo, y mensaje de advertencia claro para el usuario.
- **Diseño consistente de iconos informativos**: Iconos Lightbulb y UserCircleCheck ahora inline con el texto en modales de información (cálculo de objetivos y calorías de ejercicio), manteniendo consistencia visual en toda la aplicación.
- **API Routes nuevas**: `/api/foods/ai-search/limit` para obtener el estado del límite de búsquedas del usuario.
- **Base de datos**: Nueva tabla `ai_search_logs` con índice para búsquedas rápidas por usuario y fecha.

0.2.1 - Actualización de Paleta de Colores y Animación del Icono HandWaving
- **Actualización de color principal**: Cambio de color verde de `#CEFB48` a `#3CCC1F` en toda la aplicación para mantener consistencia visual.
- **Corrección de colores de proteínas**: Actualización de todos los iconos y elementos relacionados con proteínas para usar el nuevo color verde `#3CCC1F`.
- **Mejoras en diseño del perfil**: Ajuste del tamaño de texto del nombre en las cards de macros (Proteínas, Carbohidratos, Grasas) de 20px a 14px para mejor legibilidad.
- **Animación del icono HandWaving**: Implementación de animación de color continua que cambia entre verde (#3CCC1F), amarillo (#E5C438) y rojo (#DC3714) en el header del dashboard y perfil, creando un efecto visual atractivo y dinámico.

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
- Borde de focus: color #3CCC1F (lime verde del nuevo diseño).
- Sistema de versión centralizado: constante APP_VERSION en `lib/constants.ts` sincronizada con package.json y CHANGELOG.
- Guards server-side: protección de rutas sin middleware, usando layouts de grupos (app) y (auth).
- Fix: eliminado box-shadow global de inputs en páginas de auth para evitar doble borde.
- Fix: eliminadas referencias a iconos inexistentes en manifest.json y notifications.ts (error 404 resuelto).

0.1.1 - Dashboard y Navbar actualizados
- Cards de Ejercicio y Agua con nuevos estilos, iconografía contorneada y ejemplos.
- Cards de Comidas: layout, solapamiento de miniaturas, botón “+” destacado, nutrientes en una línea, imágenes demo (picsum).
- Navbar rediseñado: fondo #131917, padding 10/5, radio 15; botón central 38x38 #3CCC1F.
- Migración a `@phosphor-icons/react` v2 en toda la app.
- Fix build Next 16: actualización de handlers en `/api/reminders/[id]`, export CSV y scripts de seed.

0.1.0 - Diseño header y home (inicial)
- Implementado nuevo fondo global y header con radio inferior 60px.
- Calendario semanal rediseñado: selección, alineación y espaciados.
- Box de kcal en sección oscura: racha + total kcal.
- Gráficos circulares (macros) con estilos definitivos.
- Limpieza de markdowns y estructura de documentación.

Nota: Sigue el formato semántico simplificado. Próximas entradas se agregan aquí.

