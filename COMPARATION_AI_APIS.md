# Comparativa de APIs de IA para Búsqueda Nutricional

## 📊 Resumen Ejecutivo

**Mejor opción para uso gratuito limitado:** DeepSeek (5M tokens/mes gratis)
**Mejor opción completamente gratuita:** Groq (ilimitado, pero con límites de rate)
**Mejor opción económica:** Together AI o DeepSeek (después del free tier)

---

## 🆓 Niveles Gratuitos y Precios

### 1. **DeepSeek** ⭐ (Recomendado para tu caso)

**Nivel Gratuito:**
- ✅ **5 millones de tokens por mes** (gratis)
- ✅ 1,000 análisis de imágenes/mes
- ✅ 60 minutos de audio/mes
- ✅ Acceso completo a la API

**Después del free tier:**
- Entrada: $0.07 por millón de tokens (cache hit) / $0.27 (cache miss)
- Salida: $1.10 por millón de tokens
- **Costo estimado por búsqueda:** ~$0.0002 (200 tokens)

**Modelo usado:** `deepseek-chat`

**Ventajas:**
- Tier gratuito generoso (5M tokens ≈ 25,000 búsquedas/mes)
- Muy económico después del free tier
- Buen rendimiento en español

**Desventajas:**
- Cobra desde la primera petición si superas el límite mensual

---

### 2. **Groq** 🚀 (100% Gratuito)

**Nivel Gratuito:**
- ✅ **Completamente gratis** (ilimitado)
- ✅ Sin límites de tokens mensuales
- ⚠️ Rate limit: ~30 requests/minuto (puede variar)

**Modelos disponibles:**
- Llama 3.1 70B, Mixtral 8x7B, etc.

**Ventajas:**
- **100% gratis siempre**
- Muy rápido (infraestructura especializada)
- Sin límites de tokens

**Desventajas:**
- Rate limits más estrictos
- Modelos opensource (pueden ser menos precisos que GPT)

**URL API:** `https://api.groq.com/openai/v1/chat/completions`

---

### 3. **OpenAI (GPT-4o-mini)**

**Nivel Gratuito:**
- ❌ **No hay tier gratuito persistente**
- 💰 Crédito inicial de $5 USD para nuevos usuarios (válido 3 meses)

**Precios:**
- Entrada: $0.15 por millón de tokens
- Salida: $0.60 por millón de tokens
- **Costo estimado por búsqueda:** ~$0.0002 (200 tokens)

**Ventajas:**
- Alta calidad de respuestas
- Buen soporte en español
- Muy estable

**Desventajas:**
- No hay tier gratuito continuo
- Más caro que DeepSeek

---

### 4. **Google Gemini**

**Nivel Gratuito:**
- ✅ **1,500 requests/día** gratis (Gemini Flash)
- ✅ **25 requests/día** gratis (Gemini Pro)

**Después del free tier:**
- Gemini Flash: ~$0.075 por millón de tokens entrada
- Gemini Pro: ~$1.25 por millón de tokens entrada

**Ventajas:**
- Tier gratuito generoso (1,500/día = 45,000/mes)
- Buen rendimiento general

**Desventajas:**
- Límites diarios (no mensuales)
- Pro puede ser caro

---

### 5. **Anthropic Claude**

**Nivel Gratuito:**
- ❌ **No hay tier gratuito** para API
- 💰 Créditos ocasionales para nuevos usuarios

**Precios:**
- Claude 3.5 Sonnet: $3 entrada / $15 salida por millón de tokens
- **Muy caro** para este caso de uso

**Ventajas:**
- Excelente calidad

**Desventajas:**
- Muy caro
- No hay tier gratuito

---

### 6. **Together AI**

**Nivel Gratuito:**
- ✅ $25 USD de crédito gratis para nuevos usuarios
- Después: precio por uso

**Modelos disponibles:**
- Llama, Mistral, etc. (opensource)

**Precios:**
- ~$0.20-0.60 por millón de tokens (según modelo)

**Ventajas:**
- Crédito inicial generoso
- Modelos opensource

**Desventajas:**
- Solo tiene crédito inicial, no tier permanente

---

### 7. **Hugging Face Inference API**

**Nivel Gratuito:**
- ✅ **300 requests/hora** gratis (usuarios registrados)
- ✅ Modelos opensource gratuitos

**Precios:**
- Después del límite: pay-as-you-go

**Ventajas:**
- Gratis para uso moderado
- Muchos modelos disponibles

**Desventajas:**
- Rate limits más estrictos (300/hora)

---

## 💡 Recomendación para tu Proyecto

### Opción 1: **DeepSeek** (Mejor balance)
- **5M tokens/mes gratis** = ~25,000 búsquedas/mes
- Después: muy económico ($0.07-1.10/M tokens)
- Perfecto para MVP y crecimiento inicial

### Opción 2: **Groq** (100% Gratuito)
- Ilimitado pero con rate limits
- Ideal si tienes pocos usuarios simultáneos
- Más rápido pero menos preciso

### Opción 3: **Configuración Híbrida**
- Usar DeepSeek como principal (con free tier)
- Groq como fallback si se alcanza el límite
- Mejor costo-beneficio

---

## 📈 Estimación de Costos Mensuales

Asumiendo **200 tokens por búsqueda** (~100 entrada + 100 salida):

| Proveedor | Free Tier | 1,000 búsquedas/mes | 10,000 búsquedas/mes | 100,000 búsquedas/mes |
|-----------|-----------|---------------------|----------------------|-----------------------|
| **DeepSeek** | 25,000 gratis | $0 | $0 | ~$0.22 |
| **Groq** | Ilimitado | $0 | $0 | $0 |
| **OpenAI** | $5 crédito (3 meses) | $0 (crédito) | $0 (crédito) | ~$0.20 |
| **Gemini Flash** | 45,000 gratis | $0 | $0 | ~$0.15 |
| **Claude** | $0 | ~$0.60 | ~$6 | ~$60 |

---

## 🔧 Próximos Pasos

1. **Si quieres usar DeepSeek:** Ya está implementado en el código actual
2. **Si quieres usar Groq:** Necesitarías cambiar la URL y el modelo
3. **Si quieres configuración híbrida:** Puedo implementar fallback automático

¿Qué prefieres? ¿DeepSeek con su free tier, Groq completamente gratis, o una solución híbrida?

