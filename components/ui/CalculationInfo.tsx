'use client';

import { Modal } from './Modal';
import { Lightbulb, UserCircleCheck } from '@phosphor-icons/react';

export function CalculationInfo({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="¿Cómo se calculan tus objetivos?">
      <div className="space-y-6 text-[#131917]" style={{ fontFamily: 'Quicksand, sans-serif' }}>
        {/* Sección 1: Cálculo de Calorías */}
        <div>
          <h3 className="text-lg font-bold mb-3 text-[#131917]" style={{ fontFamily: 'Quicksand, sans-serif' }}>Cálculo de Calorías Diarias (TDEE)</h3>
          <p className="text-sm mb-3" style={{ fontFamily: 'Quicksand, sans-serif' }}>
            Utilizamos la <strong>ecuación de Mifflin-St Jeor</strong> para calcular tu metabolismo basal (BMR):
          </p>
          
          <div className="bg-white rounded-[20px] p-4 mb-3">
            <p className="text-xs font-semibold mb-2 text-[#131917]" style={{ fontFamily: 'Quicksand, sans-serif' }}>Para hombres:</p>
            <code className="text-xs bg-white px-3 py-2 rounded-[15px] block text-[#131917]" style={{ fontFamily: 'Quicksand, sans-serif' }}>
              BMR = 10 × peso(kg) + 6.25 × altura(cm) - 5 × edad + 5
            </code>
            
            <p className="text-xs font-semibold mb-2 mt-3 text-[#131917]" style={{ fontFamily: 'Quicksand, sans-serif' }}>Para mujeres:</p>
            <code className="text-xs bg-white px-3 py-2 rounded-[15px] block text-[#131917]" style={{ fontFamily: 'Quicksand, sans-serif' }}>
              BMR = 10 × peso(kg) + 6.25 × altura(cm) - 5 × edad - 161
            </code>
          </div>

          <p className="text-sm mb-3" style={{ fontFamily: 'Quicksand, sans-serif' }}>
            Luego multiplicamos tu BMR por tu <strong>nivel de actividad</strong>:
          </p>

          <div className="bg-white rounded-[20px] p-4 mb-3">
            <ul className="text-xs space-y-1 text-[#131917]" style={{ fontFamily: 'Quicksand, sans-serif' }}>
              <li>• <strong>Sedentario:</strong> × 1.2</li>
              <li>• <strong>Ligeramente activo:</strong> × 1.375</li>
              <li>• <strong>Moderadamente activo:</strong> × 1.55</li>
              <li>• <strong>Muy activo:</strong> × 1.725</li>
              <li>• <strong>Extra activo:</strong> × 1.9</li>
            </ul>
          </div>

          <p className="text-sm" style={{ fontFamily: 'Quicksand, sans-serif' }}>
            <strong>TDEE = BMR × Multiplicador de Actividad</strong>
          </p>
        </div>

        {/* Sección 2: Ajuste por Objetivo */}
        <div>
          <h3 className="text-lg font-bold mb-3 text-[#131917]" style={{ fontFamily: 'Quicksand, sans-serif' }}>Ajuste según tu Objetivo</h3>
          <p className="text-sm mb-3" style={{ fontFamily: 'Quicksand, sans-serif' }}>
            Ajustamos las calorías según tu meta:
          </p>

          <div className="bg-white rounded-[20px] p-4">
            <div className="space-y-3 text-xs" style={{ fontFamily: 'Quicksand, sans-serif' }}>
              <div>
                <strong className="text-[#DC3714]">Pérdida de Peso:</strong> TDEE - 500 kcal
                <p className="text-[#5A5B5A] mt-1">Crea un déficit calórico para perder peso gradualmente</p>
              </div>
              <div>
                <strong className="text-[#9A7F1F]">Mantenimiento:</strong> TDEE sin cambios
                <p className="text-[#5A5B5A] mt-1">Mantiene tu peso actual</p>
              </div>
              <div>
                <strong className="text-[#7A8F2E]">Ganancia Muscular:</strong> TDEE + 300 kcal
                <p className="text-[#5A5B5A] mt-1">Proporciona energía extra para ganar músculo</p>
              </div>
            </div>
          </div>
        </div>

        {/* Sección 3: Cálculo de Macros */}
        <div>
          <h3 className="text-lg font-bold mb-3 text-[#131917]" style={{ fontFamily: 'Quicksand, sans-serif' }}>Distribución de Macros</h3>
          <p className="text-sm mb-3" style={{ fontFamily: 'Quicksand, sans-serif' }}>
            Los macros se distribuyen según tu objetivo:
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-xs border-collapse rounded-[20px] overflow-hidden" style={{ fontFamily: 'Quicksand, sans-serif' }}>
              <thead>
                <tr className="bg-[#131917]">
                  <th className="px-3 py-2 text-left text-white font-semibold">Objetivo</th>
                  <th className="px-3 py-2 text-center text-white font-semibold">Proteína</th>
                  <th className="px-3 py-2 text-center text-white font-semibold">Carbohidratos</th>
                  <th className="px-3 py-2 text-center text-white font-semibold">Grasas</th>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-white border-b border-gray-200">
                  <td className="px-3 py-2 font-semibold text-[#DC3714]">Pérdida de Peso</td>
                  <td className="px-3 py-2 text-center text-[#131917]">30%</td>
                  <td className="px-3 py-2 text-center text-[#131917]">35%</td>
                  <td className="px-3 py-2 text-center text-[#131917]">35%</td>
                </tr>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <td className="px-3 py-2 font-semibold text-[#9A7F1F]">Mantenimiento</td>
                  <td className="px-3 py-2 text-center text-[#131917]">25%</td>
                  <td className="px-3 py-2 text-center text-[#131917]">40%</td>
                  <td className="px-3 py-2 text-center text-[#131917]">35%</td>
                </tr>
                <tr className="bg-white">
                  <td className="px-3 py-2 font-semibold text-[#7A8F2E]">Ganancia Muscular</td>
                  <td className="px-3 py-2 text-center text-[#131917]">30%</td>
                  <td className="px-3 py-2 text-center text-[#131917]">45%</td>
                  <td className="px-3 py-2 text-center text-[#131917]">25%</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className="text-sm mt-3" style={{ fontFamily: 'Quicksand, sans-serif' }}>
            Los porcentajes se convierten a gramos usando:
          </p>
          <div className="bg-white rounded-[20px] p-4 mt-2">
            <ul className="text-xs space-y-1 text-[#131917]" style={{ fontFamily: 'Quicksand, sans-serif' }}>
              <li>• <strong>Proteína:</strong> 1g = 4 kcal</li>
              <li>• <strong>Carbohidratos:</strong> 1g = 4 kcal</li>
              <li>• <strong>Grasas:</strong> 1g = 9 kcal</li>
            </ul>
          </div>
        </div>

        {/* Ejemplo */}
        <div>
          <h3 className="text-lg font-bold mb-3 text-[#131917]" style={{ fontFamily: 'Quicksand, sans-serif' }}>Ejemplo Práctico</h3>
          <div className="bg-[#3CCC1F]/20 rounded-[20px] p-4 text-xs text-[#131917]" style={{ fontFamily: 'Quicksand, sans-serif' }}>
            <p className="mb-2"><strong>Usuario:</strong> Hombre, 70kg, 170cm, 30 años, Moderadamente activo, Mantenimiento</p>
            <ol className="space-y-1 ml-4 list-decimal">
              <li>BMR = 10 × 70 + 6.25 × 170 - 5 × 30 + 5 = <strong>1,667 kcal</strong></li>
              <li>TDEE = 1,667 × 1.55 = <strong>2,585 kcal</strong></li>
              <li>Objetivo = 2,585 + 0 = <strong>2,585 kcal/día</strong></li>
              <li>Macros:
                <ul className="ml-4 mt-1 space-y-0.5">
                  <li>• Proteína: (2,585 × 25%) ÷ 4 = <strong>161g</strong></li>
                  <li>• Carbohidratos: (2,585 × 40%) ÷ 4 = <strong>258g</strong></li>
                  <li>• Grasas: (2,585 × 35%) ÷ 9 = <strong>101g</strong></li>
                </ul>
              </li>
            </ol>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-200 space-y-3">
          <p className="text-xs text-[#5A5B5A]" style={{ fontFamily: 'Quicksand, sans-serif' }}>
            <Lightbulb size={14} weight="bold" className="text-[#5A5B5A] inline-block align-middle mr-1" />
            <strong>Nota:</strong> Estos cálculos son estimaciones basadas en fórmulas científicas reconocidas. 
            Los resultados pueden variar según tu metabolismo individual, y es recomendable ajustarlos según 
            tu progreso y necesidades específicas.
          </p>
          <p className="text-xs text-[#5A5B5A]" style={{ fontFamily: 'Quicksand, sans-serif' }}>
            <UserCircleCheck size={14} weight="bold" className="text-[#5A5B5A] inline-block align-middle mr-1" />
            <strong>Recomendación:</strong> Siempre se recomienda consultar con un profesional de la salud 
            (nutricionista, dietista o médico) para obtener un plan nutricional personalizado que se ajuste 
            a tus necesidades específicas, condiciones de salud y objetivos personales.
          </p>
        </div>

        {/* Botón de cerrar */}
        <div className="pt-4">
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

