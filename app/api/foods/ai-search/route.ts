import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';

interface AISearchResponse {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  servingSize?: number;
  source?: string;
}

type AIProvider = 'deepseek' | 'groq';

interface AIConfig {
  url: string;
  model: string;
  apiKey: string;
  provider: AIProvider;
}

function getAIConfigs(): AIConfig[] {
  const configs: AIConfig[] = [];

  // Prioridad 1: DeepSeek (tier gratuito generoso)
  if (process.env.DEEPSEEK_API_KEY) {
    configs.push({
      url: 'https://api.deepseek.com/v1/chat/completions',
      model: 'deepseek-chat',
      apiKey: process.env.DEEPSEEK_API_KEY,
      provider: 'deepseek',
    });
  }

  // Prioridad 2: Groq (fallback 100% gratis)
  // Intentar con múltiples modelos en orden de preferencia (si uno falla por modelo descontinuado, intenta el siguiente)
  if (process.env.GROQ_API_KEY) {
    const groqModels = [
      'llama-3.3-70b-versatile',  // Modelo más reciente
      'llama-3.1-8b-instant',      // Alternativa rápida
      'mixtral-8x7b-32768',        // Alternativa robusta
    ];
    
    // Agregar todos los modelos para que el sistema intente con cada uno en orden
    groqModels.forEach((model) => {
      configs.push({
        url: 'https://api.groq.com/openai/v1/chat/completions',
        model: model,
        apiKey: process.env.GROQ_API_KEY!,
        provider: 'groq',
      });
    });
  }

  return configs;
}

async function callAIAPI(config: AIConfig, prompt: string): Promise<{ content: string; provider: string } | null> {
  try {
    const requestBody = {
      model: config.model,
      messages: [
        {
          role: 'system',
          content: 'Eres un experto en nutrición. Responde SOLO con JSON válido, sin texto adicional.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.3,
      max_tokens: 200,
    };

    const response = await fetch(config.url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.apiKey}`,
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData?.error?.message || 'Error desconocido';
      const errorCode = errorData?.error?.code || 'unknown_error';
      
      // Log detallado del error
      console.error(`❌ Error de ${config.provider} API [${errorCode}]:`, errorMessage);
      console.error(`   Detalles completos:`, JSON.stringify(errorData, null, 2));
      
      // Si es un error de saldo insuficiente, no intentar más con este proveedor
      if (errorMessage.includes('Insufficient Balance')) {
        return null; // Retornar null para que el sistema intente con el siguiente proveedor
      }
      
      // Si es un error de modelo descontinuado, permitir que el sistema intente con otro modelo del mismo proveedor
      if (errorMessage.includes('decommissioned') || errorMessage.includes('no longer supported')) {
        return null; // Intentar con el siguiente modelo/config
      }
      
      return null;
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || '';

    if (!content) {
      console.error(`⚠️ No se recibió respuesta de ${config.provider}`);
      return null;
    }

    return { content, provider: config.provider };
  } catch (error) {
    console.error(`❌ Error llamando a ${config.provider}:`, error);
    return null;
  }
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    const body = await req.json();
    const { foodName } = body;

    if (!foodName || typeof foodName !== 'string' || foodName.trim().length === 0) {
      return NextResponse.json({ error: 'El nombre del alimento es requerido' }, { status: 400 });
    }

    // Obtener configuraciones disponibles (DeepSeek primero, luego Groq)
    const aiConfigs = getAIConfigs();
    
    if (aiConfigs.length === 0) {
      return NextResponse.json(
        { error: 'API de IA no configurada. Por favor, configura DEEPSEEK_API_KEY o GROQ_API_KEY en las variables de entorno.' },
        { status: 500 }
      );
    }

    // Construir el prompt para la IA
    const prompt = `Busca información nutricional precisa para "${foodName.trim()}" en español.
    
Devuelve ÚNICAMENTE un objeto JSON válido con la siguiente estructura (valores por 100g):
{
  "calories": número (kcal por 100g),
  "protein": número (gramos por 100g),
  "carbs": número (gramos por 100g),
  "fat": número (gramos por 100g),
  "servingSize": número (tamaño de porción común en gramos, opcional),
  "source": "string (breve descripción de la fuente, opcional)"
}

Reglas importantes:
- Si no encuentras información exacta, usa valores aproximados de alimentos similares
- Los valores deben ser realistas y numéricos (no null ni undefined)
- Las calorías deben ser >= 0
- Las proteínas, carbohidratos y grasas deben ser >= 0
- Responder SOLO con el JSON, sin texto adicional`;

    // Intentar con cada proveedor en orden de prioridad
    let aiResponse: AISearchResponse | null = null;
    let usedProvider: string = 'unknown';
    let lastError: string = '';
    const providerErrors: Record<string, string> = {};

    for (const config of aiConfigs) {
      const result = await callAIAPI(config, prompt);
      
      if (result) {
        usedProvider = result.provider;
        
        try {
          // Limpiar el contenido por si tiene markdown o texto adicional
          const jsonMatch = result.content.match(/\{[\s\S]*\}/);
          const jsonString = jsonMatch ? jsonMatch[0] : result.content;
          aiResponse = JSON.parse(jsonString);
          break; // Success, salir del loop
        } catch (parseError) {
          console.error(`Error parseando respuesta de ${result.provider}:`, parseError);
          providerErrors[result.provider] = 'Error al procesar la respuesta';
          lastError = `Error al procesar la respuesta de ${result.provider}`;
          continue; // Intentar con el siguiente proveedor
        }
      } else {
        // El error ya fue logueado en callAIAPI
        providerErrors[config.provider] = 'No disponible';
        lastError = `Error al consultar ${config.provider}`;
        // Continuar con el siguiente proveedor
      }
    }

    // Si ningún proveedor funcionó
    if (!aiResponse) {
      // Crear mensaje de error más descriptivo
      const errorDetails = Object.keys(providerErrors).length > 0
        ? `Proveedores intentados: ${Object.keys(providerErrors).join(', ')}. ${lastError}`
        : lastError || 'No se pudo obtener respuesta de ningún proveedor de IA';
      
      // Mensaje más amigable para el usuario
      let userFriendlyMessage = 'No se pudo obtener información nutricional por IA en este momento.';
      
      if (providerErrors.deepseek === 'No disponible' && providerErrors.groq === 'No disponible') {
        userFriendlyMessage = 'Los servicios de IA no están disponibles. Por favor, ingresa los valores manualmente o intenta más tarde.';
      } else if (providerErrors.deepseek === 'No disponible') {
        userFriendlyMessage = 'El servicio principal de IA no está disponible. Intenta más tarde o ingresa los valores manualmente.';
      }
      
      return NextResponse.json(
        { error: userFriendlyMessage, details: errorDetails },
        { status: 500 }
      );
    }

    // Validar y normalizar los valores
    const validatedResponse: AISearchResponse = {
      calories: Math.max(0, Number(aiResponse.calories) || 0),
      protein: Math.max(0, Number(aiResponse.protein) || 0),
      carbs: Math.max(0, Number(aiResponse.carbs) || 0),
      fat: Math.max(0, Number(aiResponse.fat) || 0),
      servingSize: aiResponse.servingSize ? Math.max(0.1, Number(aiResponse.servingSize)) : undefined,
      source: aiResponse.source || undefined,
    };

    // Log para debugging (puedes eliminarlo en producción si prefieres)
    console.log(`✅ Búsqueda nutricional completada usando ${usedProvider} para: ${foodName.trim()}`);

    return NextResponse.json({ 
      success: true, 
      data: validatedResponse,
      provider: usedProvider, // Información opcional sobre qué proveedor se usó
    });
  } catch (error: any) {
    console.error('Error en búsqueda por IA:', error);
    return NextResponse.json(
      { error: 'Error al buscar información nutricional por IA', details: error.message },
      { status: 500 }
    );
  }
}
