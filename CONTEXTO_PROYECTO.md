Contexto del Proyecto

Tecnologías y stack
- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS v4 (tokens y utilidades personalizadas)
- Drizzle ORM + Neon/PostgreSQL

Estructura relevante
- app/: rutas, layout y estilos globales
- components/: UI y features (Dashboard, Forms, UI)
- lib/: auth, db, utils
- public/: assets

Diseño implementado (Header/Box oscura)
- Fondo global #D9D9D9
- Sección superior (box oscura #131917) con borde inferior redondeado 60px
- Header con botones 48x48 (#404040), iconos blancos 25px, padding superior 40px y laterales 25px
- Calendario semanal con selección en pastilla verde (#CEFB48) y alineación estable
- Box Kcal: racha (icono Fire #DC3714, texto 14px blanco) y total kcal (36px semibold blanco)
- Gráficos circulares (73px, fondo #404040, track 10px #5A5B5A, barra 10px redondeada)

Tokens clave (colores)
- Fondo claro: #D9D9D9
- Oscuro header: #131917
- Grises: #404040, #5A5B5A
- Acentos macros: Proteínas #CEF154, Carbohidratos #E5C438, Grasas #DC3714

Cómo ejecutar
1. npm i
2. npm run dev

Notas
- Utilidades Tailwind personalizadas (px-25, py-40, space-y-30, etc.) en app/globals.css
- Sin CSS inline; todo en clases/ utilidades

