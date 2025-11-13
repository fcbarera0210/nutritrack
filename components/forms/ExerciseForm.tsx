'use client';

import { useState, useEffect } from 'react';
import { CaretDown, Barbell, Clock, Fire, PersonSimpleWalk, PersonSimpleBike, PersonSimpleRun, PersonSimpleSwim, PersonSimpleTaiChi, Heartbeat, Basketball, Pulse, PersonSimpleHike, BaseballHelmet, BeachBall, BowlingBall, BoxingGlove, Football, Horse, PersonSimpleSki, PersonSimpleSnowboard, PersonSimpleThrow, PingPong, SneakerMove, SoccerBall, TennisBall, Timer, Volleyball } from '@phosphor-icons/react';
import { getTodayDateLocal, formatDateLocal } from '@/lib/utils/date';

// Lista de iconos disponibles para ejercicios (solo iconos que existen en Phosphor Icons)
const EXERCISE_ICONS = [
  { name: 'Barbell', component: Barbell, label: 'Pesas' },
  { name: 'PersonSimpleWalk', component: PersonSimpleWalk, label: 'Caminar' },
  { name: 'PersonSimpleRun', component: PersonSimpleRun, label: 'Correr' },
  { name: 'PersonSimpleBike', component: PersonSimpleBike, label: 'Ciclismo' },
  { name: 'PersonSimpleSwim', component: PersonSimpleSwim, label: 'Natación' },
  { name: 'PersonSimpleTaiChi', component: PersonSimpleTaiChi, label: 'Yoga' },
  { name: 'Heartbeat', component: Heartbeat, label: 'Cardio' },
  { name: 'Basketball', component: Basketball, label: 'Básquetbol' },
  { name: 'Pulse', component: Pulse, label: 'Entrenamiento' },
  { name: 'PersonSimpleHike', component: PersonSimpleHike, label: 'Outdoor' },
  { name: 'BaseballHelmet', component: BaseballHelmet, label: 'Béisbol' },
  { name: 'BeachBall', component: BeachBall, label: 'Playa' },
  { name: 'BowlingBall', component: BowlingBall, label: 'Boliche' },
  { name: 'BoxingGlove', component: BoxingGlove, label: 'Boxeo' },
  { name: 'Football', component: Football, label: 'Fútbol Americano' },
  { name: 'Horse', component: Horse, label: 'Equitación' },
  { name: 'PersonSimpleSki', component: PersonSimpleSki, label: 'Esquí' },
  { name: 'PersonSimpleSnowboard', component: PersonSimpleSnowboard, label: 'Snowboard' },
  { name: 'PersonSimpleThrow', component: PersonSimpleThrow, label: 'Lanzamiento' },
  { name: 'PingPong', component: PingPong, label: 'Ping Pong' },
  { name: 'SneakerMove', component: SneakerMove, label: 'Zapatillas' },
  { name: 'SoccerBall', component: SoccerBall, label: 'Fútbol' },
  { name: 'TennisBall', component: TennisBall, label: 'Tenis' },
  { name: 'Timer', component: Timer, label: 'Cronómetro' },
  { name: 'Volleyball', component: Volleyball, label: 'Vóleibol' },
];

interface ExerciseType {
  id: number;
  name: string;
  met: number;
  icon: string | null;
}

interface ExerciseFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  exercise?: {
    id: number;
    name: string;
    durationMinutes: number;
    caloriesBurned: number;
    icon: string;
    date: string;
  };
  selectedDate?: Date; // Fecha seleccionada en el dashboard
}

export function ExerciseForm({ onSuccess, onCancel, exercise, selectedDate }: ExerciseFormProps) {
  const isEditing = !!exercise;
  const initialDate = exercise?.date || (selectedDate ? formatDateLocal(selectedDate) : getTodayDateLocal());
  
  const [exerciseName, setExerciseName] = useState(exercise?.name || '');
  const [duration, setDuration] = useState(exercise?.durationMinutes.toString() || '');
  const [weight, setWeight] = useState('');
  const [selectedIcon, setSelectedIcon] = useState<string>(exercise?.icon || 'Barbell');
  const [customExercise, setCustomExercise] = useState(false);
  const [manualCalories, setManualCalories] = useState<string>(exercise?.caloriesBurned.toString() || '');
  const [date, setDate] = useState(initialDate);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [exerciseTypes, setExerciseTypes] = useState<ExerciseType[]>([]);
  const [isLoadingExercises, setIsLoadingExercises] = useState(true);

  // Cargar ejercicios desde la BD
  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const response = await fetch('/api/exercises/types');
        if (response.ok) {
          const data = await response.json();
          setExerciseTypes(data);
          
          // Si estamos editando, verificar si el ejercicio es custom
          if (exercise && exercise.name) {
            const isCustom = !data.find((e: ExerciseType) => e.name === exercise.name);
            setCustomExercise(isCustom);
          }
        } else {
          console.error('Error fetching exercises');
          // Fallback a lista vacía si falla
          setExerciseTypes([]);
        }
      } catch (error) {
        console.error('Error fetching exercises:', error);
        setExerciseTypes([]);
      } finally {
        setIsLoadingExercises(false);
      }
    };
    fetchExercises();
  }, [exercise]);

  // Cargar peso del usuario desde el perfil
  useEffect(() => {
    const fetchUserWeight = async () => {
      try {
        const response = await fetch('/api/user/profile');
        if (response.ok) {
          const data = await response.json();
          if (data.weight) {
            setWeight(Math.round(data.weight).toString());
          } else {
            setWeight('70'); // Valor por defecto si no tiene peso configurado
          }
        } else {
          setWeight('70'); // Valor por defecto si falla la petición
        }
      } catch (error) {
        console.error('Error fetching user weight:', error);
        setWeight('70'); // Valor por defecto en caso de error
      }
    };
    fetchUserWeight();
  }, []);

  const calculateCalories = () => {
    if (!duration || parseFloat(duration) <= 0) return 0;
    
    // Buscar el ejercicio en la lista de tipos de ejercicios
    const selectedExercise = exerciseTypes.find(e => e.name === exerciseName);
    const met = selectedExercise?.met || 3.5; // Default MET si no se encuentra
    const weightKg = parseFloat(weight) || 70;
    const durationHours = parseFloat(duration) / 60;
    
    // Formula: METs × weight (kg) × duration (hours)
    return Math.round(met * weightKg * durationHours);
  };

  // Obtener las calorías finales (manuales si existen, sino calculadas)
  const getFinalCalories = () => {
    if (manualCalories && manualCalories.trim() !== '') {
      const parsed = parseFloat(manualCalories);
      return isNaN(parsed) ? 0 : Math.round(parsed);
    }
    return calculateCalories();
  };

  // Resetear calorías manuales cuando cambian los parámetros de cálculo
  useEffect(() => {
    if (customExercise) {
      setManualCalories('');
    }
  }, [duration, weight, customExercise]);

  // Actualizar el icono cuando se selecciona un ejercicio
  useEffect(() => {
    if (exerciseName && !customExercise) {
      const selectedExercise = exerciseTypes.find(e => e.name === exerciseName);
      if (selectedExercise?.icon) {
        setSelectedIcon(selectedExercise.icon);
      }
    }
  }, [exerciseName, customExercise, exerciseTypes]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Validar campos antes de enviar
    if (!exerciseName || exerciseName.trim() === '') {
      setError('Por favor selecciona o ingresa un nombre de ejercicio');
      return;
    }
    
    if (!duration || parseFloat(duration) <= 0) {
      setError('Por favor ingresa una duración válida');
      return;
    }
    
    setIsSubmitting(true);

    try {
      const durationValue = parseFloat(duration);
      const caloriesValue = getFinalCalories();
      
      if (caloriesValue <= 0) {
        setError('Por favor ingresa un valor válido de calorías');
        setIsSubmitting(false);
        return;
      }
      
      const payload = {
        name: exerciseName,
        durationMinutes: durationValue,
        caloriesBurned: caloriesValue,
        icon: selectedIcon,
        date: date,
      };

      const url = isEditing 
        ? `/api/exercises/${exercise.id}`
        : '/api/exercises/create';
      const method = isEditing ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.details || (isEditing ? 'Error al actualizar ejercicio' : 'Error al registrar ejercicio'));
      }

      // Resetear el formulario después de guardar exitosamente (solo si no está editando)
      if (!isEditing) {
        setExerciseName('');
        setDuration('');
        setCustomExercise(false);
        setManualCalories('');
      }
      setError('');

      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      console.error(isEditing ? 'Error al actualizar ejercicio:' : 'Error al registrar ejercicio:', error);
      setError(error.message || (isEditing ? 'Error al actualizar ejercicio' : 'Error al registrar ejercicio'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-[#DC3714]/10 border-2 border-[#DC3714] text-[#DC3714] px-4 py-3 rounded-[15px] text-sm font-semibold">
          {error}
        </div>
      )}

      {/* Ejercicio */}
      <div>
        <label className="block text-[#131917] text-[14px] font-medium mb-2">
          Ejercicio
        </label>
        <div className="relative">
          <select
            value={exerciseName}
            onChange={(e) => {
              setExerciseName(e.target.value);
              const isCustom = e.target.value === 'custom';
              setCustomExercise(isCustom);
              if (!isCustom) {
                setManualCalories('');
              }
            }}
            className="w-full bg-white rounded-[15px] border-2 border-transparent px-4 py-[10px] pr-10 text-[#131917] text-[16px] font-semibold focus:outline-none focus:border-[#3CCC1F] focus:shadow-none appearance-none transition-all"
            required
          >
            <option value="">{isLoadingExercises ? 'Cargando ejercicios...' : 'Selecciona un ejercicio'}</option>
            {exerciseTypes.map(ex => (
              <option key={ex.id} value={ex.name}>
                {ex.name}
              </option>
            ))}
            <option value="custom">Otro ejercicio</option>
          </select>
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none text-[#5A5B5A]">
            <CaretDown size={20} weight="bold" />
          </div>
        </div>
      </div>

      {customExercise && (
        <>
          <div>
            <label className="block text-[#131917] text-[14px] font-medium mb-2">
              Nombre del ejercicio personalizado
            </label>
            <input
              type="text"
              placeholder="Ej: CrossFit, HIIT, etc."
              value={exerciseName}
              onChange={(e) => setExerciseName(e.target.value)}
              className="w-full bg-white rounded-[15px] border-2 border-transparent px-4 py-[10px] text-[#131917] placeholder-[#D9D9D9] text-[16px] font-semibold focus:outline-none focus:border-[#3CCC1F] focus:shadow-none transition-all"
              required
            />
          </div>
        </>
      )}

      {/* Selección de Icono */}
      <div>
        <label className="block text-[#131917] text-[14px] font-medium mb-2">
          Icono del deporte
        </label>
        <div className="bg-[#D9D9D9] py-2 rounded-[15px] overflow-x-auto scrollbar-hide -mx-[25px] pl-[25px]">
          <div className="flex gap-2">
            {EXERCISE_ICONS.map((iconOption) => {
              const IconComponent = iconOption.component;
              const isSelected = selectedIcon === iconOption.name;
              return (
                <button
                  key={iconOption.name}
                  type="button"
                  onClick={() => setSelectedIcon(iconOption.name)}
                  className={`flex-shrink-0 w-9 h-9 rounded-[10px] transition-all flex items-center justify-center ${
                    isSelected
                      ? 'bg-[#E5C438] text-[#131917]'
                      : 'bg-white text-[#131917] hover:opacity-90'
                  }`}
                  title={iconOption.label}
                >
                  <IconComponent size={18} weight="bold" />
                </button>
              );
            })}
            <div className="flex-shrink-0 w-[25px]"></div>
          </div>
        </div>
      </div>

      {/* Duración */}
      <div>
        <label className="block text-[#131917] text-[14px] font-medium mb-2">
          Duración (minutos)
        </label>
        <div className="relative">
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#5A5B5A]">
            <Clock size={20} weight="bold" />
          </div>
          <input
            type="number"
            placeholder="30"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            required
            min="1"
            className="w-full bg-white rounded-[15px] border-2 border-transparent pl-[50px] pr-4 py-[10px] text-[#131917] placeholder-[#D9D9D9] text-[16px] font-semibold focus:outline-none focus:border-[#3CCC1F] focus:shadow-none transition-all"
          />
        </div>
      </div>

      {/* Peso */}
      <div>
        <label className="block text-[#131917] text-[14px] font-medium mb-2">
          Tu peso (kg) - para calcular calorías
        </label>
        <div className="relative">
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#5A5B5A]">
            <Barbell size={20} weight="bold" />
          </div>
          <input
            type="number"
            placeholder="70"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            required
            min="30"
            max="200"
            className="w-full bg-white rounded-[15px] border-2 border-transparent pl-[50px] pr-4 py-[10px] text-[#131917] placeholder-[#D9D9D9] text-[16px] font-semibold focus:outline-none focus:border-[#3CCC1F] focus:shadow-none transition-all"
          />
        </div>
      </div>

      {/* Calorías - Campo editable para ejercicios custom o cuando se está editando, preview para ejercicios normales */}
      {duration && parseFloat(duration) > 0 && (
        <>
          {(customExercise || isEditing) ? (
            <div>
              <label className="block text-[#131917] text-[14px] font-medium mb-2">
                Calorías quemadas
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#5A5B5A]">
                  <Fire size={20} weight="bold" />
                </div>
                <input
                  type="number"
                  value={manualCalories || calculateCalories()}
                  onChange={(e) => setManualCalories(e.target.value)}
                  min="0"
                  className="w-full bg-white rounded-[15px] border-2 border-transparent pl-[50px] pr-4 py-[10px] text-[#131917] text-[16px] font-semibold focus:outline-none focus:border-[#3CCC1F] focus:shadow-none transition-all"
                />
              </div>
              <p className="text-[#5A5B5A] text-xs mt-1">
                Calculado automáticamente: {calculateCalories()} kcal (puedes modificarlo)
              </p>
            </div>
          ) : (
            <div className="bg-[#E5C438]/20 border-2 border-[#E5C438] rounded-[15px] p-4">
              <p className="text-[#131917] text-sm font-medium mb-1 flex items-center gap-2">
                <Fire size={18} weight="bold" className="text-[#DC3714]" />
                Calorías quemadas (estimadas):
              </p>
              <p className="text-[#131917] text-2xl font-bold">{calculateCalories()} kcal</p>
            </div>
          )}
        </>
      )}

      {/* Campo de Fecha - Solo visible al editar */}
      {isEditing && (
        <div>
          <label className="block text-[#131917] text-[14px] font-medium mb-2">
            Fecha
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            max={getTodayDateLocal()}
            className="w-full bg-white rounded-[15px] border-2 border-transparent px-4 py-[10px] text-[#131917] text-[16px] font-semibold focus:outline-none focus:border-[#3CCC1F] focus:shadow-none transition-all"
          />
        </div>
      )}

      {/* Botones de acción */}
      <div className="flex gap-3 pt-4">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="flex-1 text-[#DC3714] font-semibold text-[16px] hover:opacity-90 transition-opacity"
          >
            Cancelar
          </button>
        )}
        <button
          type="submit"
          disabled={isSubmitting || !exerciseName || !duration || (customExercise && getFinalCalories() <= 0)}
          className="flex-1 bg-[#E5C438] rounded-[15px] px-4 py-[10px] text-[#131917] font-semibold text-[16px] hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <span>{isEditing ? 'Actualizando...' : 'Guardando...'}</span>
            </>
          ) : (
            <>
              <Fire size={20} weight="bold" />
              <span>{isEditing ? 'Actualizar' : 'Guardar'}</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}

