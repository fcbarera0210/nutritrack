<div align="center">
  <h1>🍏 NutriTrack</h1>
  <p>Registro diario de alimentos y seguimiento nutricional con análisis, estadísticas y recordatorios.</p>
</div>

---

### ✨ Visión general
NutriTrack es una aplicación web (Next.js) para registrar comidas y ejercicios, calcular calorías y macros, visualizar estadísticas semanales, gestionar objetivos, y recibir recordatorios. El diseño está alineado con una maqueta en Figma para lograr una interfaz consistente y “pixel‑perfect”.

---

### ✅ Funcionalidades implementadas (MVP completo)
- **Autenticación**: registro, login, logout, sesiones JWT, guards server-side en layouts. Login y Register rediseñados con nuevo header oscuro, logo y formularios estilo moderno.
- **Dashboard diario** (rediseñado 2025-10): header en caja oscura con calendario semanal, racha y gráficos circulares; sección kcal; cards de ejercicio/agua; cards de comidas con lista de alimentos reales; navbar inferior simplificado; soporte para cambio de fecha con filtrado automático; skeleton de carga.
- **Gestión de alimentos**: búsqueda inteligente (sin tildes/mayúsculas), 50+ alimentos chilenos, filtros por categorías con íconos de Phosphor, formulario rediseñado con nuevo layout, carga incremental (15 por página), cards de alimentos con diseño oscuro.
- **Búsqueda nutricional por IA** (DeepSeek + Groq): busca automáticamente macros nutricionales por nombre de alimento usando IA. Sistema híbrido con fallback automático, soporte para múltiples modelos, e indicador visual de carga.
- **Sistema de favoritos**: marca alimentos favoritos, filtro de favoritos visible solo cuando hay favoritos, acceso rápido desde la página de agregar alimento.
- **Alimentos personalizados**: los usuarios pueden crear alimentos con información nutricional personalizada. Alimentos privados por usuario, filtro de alimentos personalizados, y validación mejorada.
- **Sistema de hidratación**: registro diario de consumo de agua con cards en el dashboard, modal de agregar hidratación con controles de incremento/decremento, y visualización de entradas diarias.
- **Gestión de ejercicios**: 12+ ejercicios, cálculo de calorías por fórmula MET, selector de iconos (24+ iconos de Phosphor), visualización y eliminación, modal de lista de ejercicios del día, y modal explicativo sobre cálculo de calorías.
- **Perfil de usuario**: datos personales, TDEE (Mifflin‑St Jeor), objetivos y nivel de actividad, ajuste de macros objetivo, campos adicionales (nombre, teléfono con formato automático +56, deportes preferidos, preferencias dietéticas, alergias), exportación CSV, modal informativo sobre cálculos nutricionales.
- **Estadísticas**: gráfico de calorías últimos 7 días con datos reales, logros (gamificación) y animaciones.
- **CRUD completo**: crear/editar/eliminar logs de alimentos y ejercicios con confirmaciones.
- **Recordatorios y notificaciones**: API CRUD de recordatorios, diseño consistente con iconos de Phosphor, funcionalidad de activación corregida.

Notas de diseño: migración a `@phosphor-icons/react` v2, tokens de color y utilidades Tailwind personalizadas (espaciados exactos), navbar con fondo #131917 y botón central #3CCC1F. Login/Register con header oscuro, logo de 3 puntos verticales, inputs con Phosphor Icons y borde focus #3CCC1F. Página "Agregar Alimento" rediseñada con filtros por íconos, cards oscuras, scroll horizontal y formulario moderno. Icono HandWaving con animación de color continua entre verde, amarillo y rojo.

---

### 🟡 Funcionalidades pendientes (roadmap)
- **APIs externas**: OpenFoodFacts, escáner de código de barras, reconocimiento por foto (IA).
- **Historial navegable**: días anteriores, selector de fechas y comparaciones.
- **Búsqueda avanzada**: más filtros, ordenamientos y búsquedas recientes.
- **Gamificación avanzada**: badges, celebraciones, galería de logros y rankings.
- **Wearables**: integración con Fitbit/Apple Watch/Google Fit.
- **Social**: compartir progreso, grupos y retos.
- **Recetas y planes**: base de recetas, recetas personalizadas, planificador semanal y lista de compras.
- **Micronutrientes**: vitaminas y minerales con visualización y alertas.
- **Optimización**: cache cliente, paginación, lazy load, queries optimizadas, code splitting.
- **PWA/SEO**: service worker offline, íconos y splash, mejoras SEO.
- **Testing**: unitarios, integración, E2E (Playwright) y optimización de bundle.

Detalle por prioridad: ver `FUNCIONALIDADES_PENDIENTES.md`.

---

### 🧱 Estructura del proyecto (resumen)
```
app/
  (auth)/login, register
  (app)/dashboard, add, stats, profile, profile/reminders, recipes
  api/ (auth, dashboard, foods, logs, exercises, stats, user, reminders, export)
components/
  ui, forms, features, dashboard
lib/
  auth, db, validations, utils (calories, categories, notifications, nutritionalAnalysis)
drizzle/ (migraciones y seeds)
public/ (PWA manifest e íconos)
```

---

### 🧪 Endpoints principales (API Routes)
- `auth`: `login`, `register`, `logout`
- `dashboard`: `today` (con soporte para fecha específica)
- `foods`: `search`, `ai-search`, `favorites`, `create`, `custom`, `[id]`
- `logs`: `create`, `delete`, `update`
- `exercises`: `create`, `delete`
- `hydration`: `create`
- `stats`: `weekly`
- `user`: `profile`
- `reminders`: `GET/POST`, `PUT/DELETE /[id]`
- `export`: `history`

Explora la lista completa en `app/api/` y el desglose en `RESUMEN_COMPLETO_PROYECTO.md`.

---

### 🗄️ Base de datos (Drizzle + PostgreSQL)
- Tablas: `users`, `user_profiles`, `foods`, `food_logs`, `exercises`, `user_streaks`, `achievements`, `meal_reminders`, `user_favorites`, `water_logs`.
- Campos adicionales: `manual_targets`, `target_weight`, `preferred_sports`, `dietary_preferences`, `food_allergies`, `bio`, `phone` en `user_profiles`; `icon` en `exercises`; `is_custom`, `user_id` en `foods`.
- Migraciones listas y seeds con 50+ alimentos (ver `drizzle/` y `scripts/`).

---

### 🎨 UI/UX y Figma
- Diseño mobile‑first responsive, paleta consistente (`#5FB75D`), componentes reutilizables y animaciones.
- Tipografía Inter optimizada; dark mode completo con variables CSS.
- Base “pixel‑perfect” en `app/globals.css`: tokens de color, tipografía, espaciado, radios, sombras y utilidades `.container`, `.section`, `.card`.
- Si no hay acceso a Figma, se pueden ajustar tokens a las medidas definidas en la maqueta.

---

### ⚙️ Requisitos y scripts
Requisitos: Node.js LTS, PostgreSQL (Neon recomendado) y variables de entorno configuradas.

**Configuración de variables de entorno**

Crea un archivo `.env.local` (o `.env`) en la raíz del proyecto con las siguientes variables:

```bash
# Obligatorio: URL de conexión a PostgreSQL
DATABASE_URL=postgresql://usuario:contraseña@host:puerto/database?sslmode=require

# Obligatorio: Secret para encriptación de sesiones JWT
# Genera uno seguro con: openssl rand -base64 32
NEXTAUTH_SECRET=tu-secret-seguro-aqui

# Opcional: URLs de la aplicación (para producción)
NEXTAUTH_URL=https://tu-dominio.com
APP_URL=https://tu-dominio.com

# Opcional: APIs de IA para búsqueda nutricional automática
# Configura al menos una de las siguientes (recomendado: ambas para fallback)
DEEPSEEK_API_KEY=sk-...          # Free tier: 5M tokens/mes
GROQ_API_KEY=gsk_...              # 100% gratis (rate limits)
```

**Nota**: El formato debe ser `KEY=value` (no `KEY:value`). Ver `.env.example` para referencia.

Desarrollo
```bash
npm run dev
```

Build y producción
```bash
npm run build
npm start
```

### 🚀 Deploy en Vercel
1. Crea un proyecto en Vercel y conecta el repo `fcbarera0210/nutritrack`.
2. Variables de entorno (Production/Preview/Development):
   - `DATABASE_URL` (Neon/Postgres) - **Obligatorio**
   - `NEXTAUTH_SECRET` - **Obligatorio**
   - `NEXTAUTH_URL` (opcional, para producción)
   - `APP_URL` (opcional, para producción)
3. Config por defecto de Next.js (ya incluida):
   - Build Command: `npm run build`
   - Install Command: `npm install`
   - Node: `>=18` (definido en `package.json` → `engines`)
4. Imágenes remotas permitidas (`next.config.ts`): Unsplash/picsum/loremflickr ya configurados.
5. (Opcional) `vercel.json` incluido para dejar explícitos comandos de build.

Base de datos y seeds (si aplica)
```bash
npm run db:generate
npm run db:studio
npm run seed
```

---

### 🧰 Stack
- Next.js, React, TypeScript, Tailwind CSS 4
- Drizzle ORM + PostgreSQL (Neon)
- Zod, Recharts, JWT (jose)

---

### 🚀 Estado del proyecto
- MVP funcional, listo para uso y despliegue (Vercel recomendado).
- Roadmap activo con funcionalidades opcionales y optimizaciones.

---

### 📄 Licencia
Este proyecto se distribuye con fines educativos y demostrativos. Ajusta la licencia según tus necesidades antes de publicación.

