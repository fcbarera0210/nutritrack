'use client';

import { Modal } from './Modal';
import { Lightbulb, UserCircleCheck, WarningCircle } from '@phosphor-icons/react';

export function ExerciseCalculationInfo({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="¿Cómo se calculan las calorías quemadas?">
      <div className="space-y-6 text-[#131917]" style={{ fontFamily: 'Quicksand, sans-serif' }}>
        {/* Sección 1: Sistema MET */}
        <div>
          <h3 className="text-lg font-bold mb-3 text-[#131917]" style={{ fontFamily: 'Quicksand, sans-serif' }}>Sistema MET (Metabolic Equivalent of Task)</h3>
          <p className="text-sm mb-3" style={{ fontFamily: 'Quicksand, sans-serif' }}>
            Utilizamos el sistema <strong>MET</strong> para calcular las calorías quemadas durante el ejercicio. 
            El MET es una medida estándar que indica la intensidad de la actividad física comparada con el reposo.
          </p>
          
          <div className="bg-white rounded-[20px] p-4 mb-3">
            <p className="text-xs font-semibold mb-2 text-[#131917]" style={{ fontFamily: 'Quicksand, sans-serif' }}>¿Qué significa MET?</p>
            <ul className="text-xs space-y-1 text-[#131917]" style={{ fontFamily: 'Quicksand, sans-serif' }}>
              <li>• <strong>MET = 1:</strong> Equivale al gasto calórico en reposo</li>
              <li>• <strong>MET = 3:</strong> Actividad moderada (ej: caminar a paso normal)</li>
              <li>• <strong>MET = 6:</strong> Actividad vigorosa (ej: ciclismo moderado)</li>
              <li>• <strong>MET = 10+:</strong> Actividad muy intensa (ej: correr, CrossFit)</li>
            </ul>
          </div>
        </div>

        {/* Sección 2: Fórmula */}
        <div>
          <h3 className="text-lg font-bold mb-3 text-[#131917]" style={{ fontFamily: 'Quicksand, sans-serif' }}>Fórmula de Cálculo</h3>
          <p className="text-sm mb-3" style={{ fontFamily: 'Quicksand, sans-serif' }}>
            La fórmula utilizada es:
          </p>

          <div className="bg-white rounded-[20px] p-4 mb-3">
            <code className="text-sm bg-white px-3 py-2 rounded-[15px] block text-[#131917] font-bold" style={{ fontFamily: 'Quicksand, sans-serif' }}>
              Calorías quemadas = MET × Peso (kg) × Duración (horas)
            </code>
          </div>

          <p className="text-sm mb-3" style={{ fontFamily: 'Quicksand, sans-serif' }}>
            Donde:
          </p>
          <div className="bg-white rounded-[20px] p-4">
            <ul className="text-xs space-y-2 text-[#131917]" style={{ fontFamily: 'Quicksand, sans-serif' }}>
              <li>• <strong>MET:</strong> Valor de intensidad del ejercicio (ver tabla abajo)</li>
              <li>• <strong>Peso:</strong> Tu peso corporal en kilogramos</li>
              <li>• <strong>Duración:</strong> Tiempo de ejercicio en horas (se convierte automáticamente desde minutos)</li>
            </ul>
          </div>
        </div>

        {/* Sección 3: Valores MET por ejercicio */}
        <div>
          <h3 className="text-lg font-bold mb-3 text-[#131917]" style={{ fontFamily: 'Quicksand, sans-serif' }}>Valores MET por Tipo de Ejercicio</h3>
          <p className="text-sm mb-3" style={{ fontFamily: 'Quicksand, sans-serif' }}>
            Estos valores están basados en el <strong>Compendium of Physical Activities</strong>, una fuente científica reconocida:
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-xs border-collapse rounded-[20px] overflow-hidden" style={{ fontFamily: 'Quicksand, sans-serif' }}>
              <thead>
                <tr className="bg-[#131917]">
                  <th className="px-3 py-2 text-left text-white font-semibold">Ejercicio</th>
                  <th className="px-3 py-2 text-center text-white font-semibold">MET</th>
                  <th className="px-3 py-2 text-center text-white font-semibold">Intensidad</th>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-white border-b border-gray-200">
                  <td className="px-3 py-2 font-semibold text-[#131917]">Yoga</td>
                  <td className="px-3 py-2 text-center text-[#131917]">3.0</td>
                  <td className="px-3 py-2 text-center text-[#131917]">Baja</td>
                </tr>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <td className="px-3 py-2 font-semibold text-[#131917]">Pilates</td>
                  <td className="px-3 py-2 text-center text-[#131917]">3.5</td>
                  <td className="px-3 py-2 text-center text-[#131917]">Baja</td>
                </tr>
                <tr className="bg-white border-b border-gray-200">
                  <td className="px-3 py-2 font-semibold text-[#131917]">Caminata rápida</td>
                  <td className="px-3 py-2 text-center text-[#131917]">4.5</td>
                  <td className="px-3 py-2 text-center text-[#131917]">Moderada</td>
                </tr>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <td className="px-3 py-2 font-semibold text-[#131917]">Baile</td>
                  <td className="px-3 py-2 text-center text-[#131917]">5.0</td>
                  <td className="px-3 py-2 text-center text-[#131917]">Moderada</td>
                </tr>
                <tr className="bg-white border-b border-gray-200">
                  <td className="px-3 py-2 font-semibold text-[#131917]">Trotar</td>
                  <td className="px-3 py-2 text-center text-[#131917]">7.0</td>
                  <td className="px-3 py-2 text-center text-[#131917]">Vigorosa</td>
                </tr>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <td className="px-3 py-2 font-semibold text-[#131917]">Bicicleta estática / Elíptica</td>
                  <td className="px-3 py-2 text-center text-[#131917]">7.0</td>
                  <td className="px-3 py-2 text-center text-[#131917]">Vigorosa</td>
                </tr>
                <tr className="bg-white border-b border-gray-200">
                  <td className="px-3 py-2 font-semibold text-[#131917]">Ciclismo</td>
                  <td className="px-3 py-2 text-center text-[#131917]">8.0</td>
                  <td className="px-3 py-2 text-center text-[#131917]">Vigorosa</td>
                </tr>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <td className="px-3 py-2 font-semibold text-[#131917]">Escalar escaleras</td>
                  <td className="px-3 py-2 text-center text-[#131917]">9.0</td>
                  <td className="px-3 py-2 text-center text-[#131917]">Muy vigorosa</td>
                </tr>
                <tr className="bg-white border-b border-gray-200">
                  <td className="px-3 py-2 font-semibold text-[#131917]">Natación</td>
                  <td className="px-3 py-2 text-center text-[#131917]">10.0</td>
                  <td className="px-3 py-2 text-center text-[#131917]">Muy vigorosa</td>
                </tr>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <td className="px-3 py-2 font-semibold text-[#131917]">Correr</td>
                  <td className="px-3 py-2 text-center text-[#131917]">11.5</td>
                  <td className="px-3 py-2 text-center text-[#131917]">Muy vigorosa</td>
                </tr>
                <tr className="bg-white">
                  <td className="px-3 py-2 font-semibold text-[#131917]">CrossFit</td>
                  <td className="px-3 py-2 text-center text-[#131917]">12.0</td>
                  <td className="px-3 py-2 text-center text-[#131917]">Muy vigorosa</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Ejemplo */}
        <div>
          <h3 className="text-lg font-bold mb-3 text-[#131917]" style={{ fontFamily: 'Quicksand, sans-serif' }}>Ejemplo Práctico</h3>
          <div className="bg-[#E5C438]/20 rounded-[20px] p-4 text-xs text-[#131917]" style={{ fontFamily: 'Quicksand, sans-serif' }}>
            <p className="mb-2"><strong>Ejemplo:</strong> Correr durante 30 minutos con un peso de 70 kg</p>
            <ol className="space-y-1 ml-4 list-decimal">
              <li>Ejercicio seleccionado: <strong>Correr</strong> (MET = 11.5)</li>
              <li>Peso: <strong>70 kg</strong></li>
              <li>Duración: <strong>30 minutos</strong> = 0.5 horas</li>
              <li>Cálculo: 11.5 × 70 × 0.5 = <strong>402.5 kcal</strong></li>
            </ol>
          </div>
        </div>

        {/* Nota sobre ejercicios personalizados */}
        <div className="bg-white rounded-[20px] p-4">
          <p className="text-xs text-[#5A5B5A] flex items-start gap-2" style={{ fontFamily: 'Quicksand, sans-serif' }}>
            <WarningCircle size={18} weight="bold" className="text-[#E5C438] flex-shrink-0 mt-0.5" />
            <span><strong>Ejercicios personalizados:</strong> Si seleccionas "Otro ejercicio" y no está en la lista, 
            se utiliza un valor MET por defecto de 3.5 (actividad ligera). Esto es una estimación conservadora 
            para ejercicios de intensidad moderada.</span>
          </p>
        </div>

        <div className="pt-4 border-t border-gray-200 space-y-3">
          <p className="text-xs text-[#5A5B5A] flex items-start gap-2" style={{ fontFamily: 'Quicksand, sans-serif' }}>
            <Lightbulb size={18} weight="bold" className="text-[#6484E2] flex-shrink-0 mt-0.5" />
            <span><strong>Nota:</strong> Estos cálculos son estimaciones basadas en valores MET estándar. 
            El gasto calórico real puede variar según factores como la intensidad real del ejercicio, 
            el terreno, la técnica utilizada, el estado físico individual y otros factores personales.</span>
          </p>
          <p className="text-xs text-[#5A5B5A] flex items-start gap-2" style={{ fontFamily: 'Quicksand, sans-serif' }}>
            <UserCircleCheck size={18} weight="bold" className="text-[#6484E2] flex-shrink-0 mt-0.5" />
            <span><strong>Recomendación:</strong> Para obtener mediciones más precisas, considera usar dispositivos 
            de seguimiento de actividad física (pulseras, relojes inteligentes) o consultar con un profesional 
            del deporte que pueda evaluar tu gasto calórico específico.</span>
          </p>
        </div>

        {/* Botón de cerrar */}
        <div className="pt-4 pb-2">
          <button
            onClick={onClose}
            className="w-full bg-[#131917] rounded-[20px] px-4 py-[10px] text-white font-semibold hover:opacity-90 transition-opacity"
            style={{ fontFamily: 'Quicksand, sans-serif' }}
          >
            Cerrar
          </button>
        </div>
      </div>
    </Modal>
  );
}

