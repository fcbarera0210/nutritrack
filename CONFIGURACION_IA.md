# Configuración de Búsqueda por IA - Nutritrack

## 🔧 Configuración de Variables de Entorno

Para usar la funcionalidad de búsqueda nutricional por IA, necesitas configurar al menos una de las siguientes variables de entorno:

### Opción 1: DeepSeek (Recomendado - Tier Gratuito Generoso)

1. Obtén tu API key:
   - Ve a https://platform.deepseek.com
   - Crea una cuenta o inicia sesión
   - Ve a la sección de API Keys
   - Genera una nueva API key

2. Configura en `.env.local`:
   ```bash
   DEEPSEEK_API_KEY=sk-...
   ```

**Ventajas:**
- ✅ 5 millones de tokens gratis por mes (~25,000 búsquedas)
- ✅ Muy económico después del free tier
- ✅ Buen rendimiento en español

---

### Opción 2: Groq (100% Gratuito - Fallback)

1. Obtén tu API key:
   - Ve a https://console.groq.com
   - Crea una cuenta o inicia sesión
   - Ve a API Keys
   - Genera una nueva API key

2. Configura en `.env.local`:
   ```bash
   GROQ_API_KEY=gsk_...
   ```

**Ventajas:**
- ✅ 100% gratis siempre
- ✅ Sin límites de tokens
- ⚠️ Rate limits más estrictos (~30 requests/minuto)

---

### Configuración Híbrida (Recomendado)

Configura **ambas** para tener fallback automático:

```bash
# Prioridad 1: DeepSeek (tier gratuito generoso)
DEEPSEEK_API_KEY=sk-...

# Prioridad 2: Groq (fallback 100% gratis)
GROQ_API_KEY=gsk_...
```

**Cómo funciona:**
1. Intenta primero con **DeepSeek** (5M tokens/mes gratis)
2. Si DeepSeek falla o se alcanza el límite, usa **Groq** automáticamente
3. El usuario no nota ninguna diferencia

---

## 🚀 Configuración en Vercel (Producción)

1. Ve a tu proyecto en Vercel
2. Settings → Environment Variables
3. Agrega las variables:
   - `DEEPSEEK_API_KEY` (obligatorio si quieres usar DeepSeek)
   - `GROQ_API_KEY` (recomendado como fallback)

---

## 📊 Monitoreo de Uso

El código incluye logs que te permiten ver qué proveedor se está usando:

```
✅ Búsqueda nutricional completada usando deepseek para: Manzana
✅ Búsqueda nutricional completada usando groq para: Banana
```

Estos logs aparecen en:
- **Desarrollo**: Consola del servidor (`npm run dev`)
- **Producción**: Logs de Vercel (Dashboard → Logs)

---

## 💰 Estimación de Costos

### Con DeepSeek:
- **Primeras 25,000 búsquedas/mes**: GRATIS
- **Después**: ~$0.0002 por búsqueda adicional

### Con Groq:
- **Todas las búsquedas**: GRATIS (solo rate limits)

### Con ambos (híbrido):
- **Primeras 25,000 búsquedas/mes**: GRATIS (DeepSeek)
- **Después**: GRATIS (Groq automáticamente)

---

## 🧪 Prueba la Implementación

1. Inicia el servidor de desarrollo:
   ```bash
   npm run dev
   ```

2. Ve a la página de agregar alimento
3. Haz clic en "Alimento personalizado"
4. Ingresa un nombre de alimento (ej: "Manzana")
5. Haz clic en el botón "Buscar por IA" 🪄
6. Los campos deberían llenarse automáticamente

---

## ⚠️ Troubleshooting

### Error: "API de IA no configurada"
- Verifica que las variables de entorno estén configuradas correctamente
- Asegúrate de que `.env.local` exista en la raíz del proyecto
- Reinicia el servidor después de agregar variables de entorno

### Error: "Insufficient Balance" (DeepSeek)
- **Causa**: Has agotado el free tier de 5M tokens/mes o necesitas recargar créditos
- **Solución**: 
  - El sistema automáticamente intentará con Groq si está configurado
  - Para recargar DeepSeek: ve a https://platform.deepseek.com y agrega créditos
  - O simplemente usa Groq que es 100% gratis

### Error: "model decommissioned" (Groq)
- **Causa**: El modelo específico fue descontinuado
- **Solución**: El sistema automáticamente intentará con modelos alternativos:
  - `llama-3.3-70b-versatile` (primero)
  - `llama-3.1-8b-instant` (fallback)
  - `mixtral-8x7b-32768` (fallback final)
- Si todos los modelos fallan, verifica la documentación de Groq para modelos actuales

### Error: "Error al consultar groq API"
- Verifica que tu API key de Groq sea válida
- Puede ser que hayas alcanzado el rate limit (espera 1 minuto)
- El sistema intentará automáticamente con modelos alternativos

---

## 📝 Notas

- El sistema automáticamente intenta con DeepSeek primero, luego Groq
- Si ambos fallan, se muestra un error claro al usuario
- Los logs del servidor te ayudan a depurar problemas
- La respuesta incluye el proveedor usado (útil para debugging)

