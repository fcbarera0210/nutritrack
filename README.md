<div align="center">
  <h1>🍏 NutriTrack</h1>
  <p>Registro diario de alimentos y seguimiento nutricional con análisis, estadísticas y recordatorios.</p>
</div>

---

### ✨ Visión general
NutriTrack es una aplicación web (Next.js) para registrar comidas y ejercicios, calcular calorías y macros, visualizar estadísticas semanales, gestionar objetivos, y recibir recordatorios. El diseño está alineado con una maqueta en Figma para lograr una interfaz consistente y “pixel‑perfect”.

---

### ✅ Funcionalidades implementadas (MVP completo)
- **Autenticación**: registro, login, logout, sesiones JWT, middleware de rutas.
- **Dashboard diario** (rediseñado 2025-10): header en caja oscura con calendario semanal, racha y gráficos circulares; sección kcal; cards de ejercicio/agua; cards de comidas con imágenes y botón rápido; navbar inferior actualizado.
- **Gestión de alimentos**: búsqueda inteligente (sin tildes/mayúsculas), 50+ alimentos chilenos, filtros por categorías, formulario con cantidad y cálculo automático de macros.
- **Gestión de ejercicios**: 12+ ejercicios, cálculo de calorías por fórmula MET, visualización y eliminación.
- **Perfil de usuario**: datos personales, TDEE (Mifflin‑St Jeor), objetivos y nivel de actividad, ajuste de macros objetivo, exportación CSV, dark mode toggle.
- **Estadísticas**: gráfico de calorías últimos 7 días con datos reales, logros (gamificación) y animaciones.
- **CRUD completo**: crear/editar/eliminar logs de alimentos y ejercicios con confirmaciones.
- **Recordatorios y notificaciones**: API CRUD de recordatorios, permisos de notificaciones, notificaciones visuales.

Notas de diseño: migración a `@phosphor-icons/react` v2, tokens de color y utilidades Tailwind personalizadas (espaciados exactos), navbar con fondo #131917 y botón central #CEFB48.

---

### 🟡 Funcionalidades pendientes (roadmap)
- **APIs externas**: OpenFoodFacts, escáner de código de barras, reconocimiento por foto (IA).
- **Favoritos**: marcar alimentos y sección "Mis Favoritos" con acceso rápido.
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
- `dashboard`: `today`
- `foods`: `search`
- `logs`: `create`, `delete`, `update`
- `exercises`: `create`, `delete`
- `stats`: `weekly`
- `user`: `profile`
- `reminders`: `GET/POST`, `PUT/DELETE /[id]`
- `export`: `history`

Explora la lista completa en `app/api/` y el desglose en `RESUMEN_COMPLETO_PROYECTO.md`.

---

### 🗄️ Base de datos (Drizzle + PostgreSQL)
- Tablas: `users`, `user_profiles`, `foods`, `food_logs`, `exercises`, `user_streaks`, `achievements`, `meal_reminders`.
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

Desarrollo
```bash
npm run dev
```

Build y producción
```bash
npm run build
npm start
```

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

