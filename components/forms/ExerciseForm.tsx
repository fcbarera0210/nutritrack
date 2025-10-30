'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { Activity, Clock, Zap } from 'lucide-react';

// Common exercises with MET values (Metabolic Equivalent of Task)
const COMMON_EXERCISES = [
  { name: 'Caminata rápida', met: 4.5 },
  { name: 'Trotar', met: 7.0 },
  { name: 'Correr', met: 11.5 },
  { name: 'Ciclismo', met: 8.0 },
  { name: 'Natación', met: 10.0 },
  { name: 'Bicicleta estática', met: 7.0 },
  { name: 'Elíptica', met: 7.0 },
  { name: 'Escalar escaleras', met: 9.0 },
  { name: 'Yoga', met: 3.0 },
  { name: 'Pilates', met: 3.5 },
  { name: 'Baile', met: 5.0 },
  { name: 'CrossFit', met: 12.0 },
];

export function ExerciseForm({ onSuccess, onCancel }: { onSuccess?: () => void; onCancel?: () => void }) {
  const [exerciseName, setExerciseName] = useState('');
  const [duration, setDuration] = useState('');
  const [weight, setWeight] = useState('70'); // Default weight in kg
  const [customExercise, setCustomExercise] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const calculateCalories = () => {
    if (!duration || parseFloat(duration) <= 0) return 0;
    
    const selectedExercise = COMMON_EXERCISES.find(e => e.name === exerciseName);
    const met = selectedExercise?.met || 3.5; // Default MET
    const weightKg = parseFloat(weight) || 70;
    const durationHours = parseFloat(duration) / 60;
    
    // Formula: METs × weight (kg) × duration (hours)
    return Math.round(met * weightKg * durationHours);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/exercises/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: exerciseName,
          durationMinutes: parseFloat(duration),
          caloriesBurned: calculateCalories(),
          date: new Date().toISOString().split('T')[0],
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al registrar ejercicio');
      }

      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      setError(error.message || 'Error al registrar ejercicio');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="p-0 overflow-hidden">
      <div className="bg-gradient-to-r from-blue-600 to-blue-500 p-4 text-white">
        <h3 className="font-semibold text-lg flex items-center gap-2">
          <Activity className="w-5 h-5" />
          Registrar Ejercicio
        </h3>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-4">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
            {error}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Ejercicio
          </label>
          <select
            value={exerciseName}
            onChange={(e) => {
              setExerciseName(e.target.value);
              setCustomExercise(e.target.value === 'custom');
            }}
            className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-gray-900 focus:border-[#5FB75D] focus:ring-2 focus:ring-[#5FB75D]/20 transition-all duration-200"
            required
          >
            <option value="">Selecciona un ejercicio</option>
            {COMMON_EXERCISES.map(ex => (
              <option key={ex.name} value={ex.name}>
                {ex.name}
              </option>
            ))}
            <option value="custom">Otro ejercicio</option>
          </select>
        </div>

        {customExercise && (
          <div>
            <Input
              type="text"
              label="Nombre del ejercicio personalizado"
              placeholder="Ej: CrossFit, HIIT, etc."
              value={exerciseName}
              onChange={(e) => setExerciseName(e.target.value)}
              required
            />
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Duración (minutos)
          </label>
          <Input
            type="number"
            placeholder="30"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            required
            min="1"
            icon={<Clock className="w-5 h-5" />}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tu peso (kg) - para calcular calorías
          </label>
          <Input
            type="number"
            placeholder="70"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            required
            min="30"
            max="200"
            icon={<Activity className="w-5 h-5" />}
          />
        </div>

        {/* Calculated Calories Preview */}
        {duration && parseFloat(duration) > 0 && (
          <div className="bg-blue-50 rounded-xl p-4 border-2 border-blue-200">
            <p className="text-sm font-medium text-blue-900 mb-1 flex items-center gap-2">
              <Zap className="w-4 h-4" />
              Calorías quemadas (estimadas):
            </p>
            <p className="text-2xl font-bold text-blue-900">{calculateCalories()} kcal</p>
          </div>
        )}

        <div className="flex gap-3">
          {onCancel && (
            <Button variant="outline" fullWidth onClick={onCancel} type="button">
              Cancelar
            </Button>
          )}
          <Button type="submit" fullWidth isLoading={isSubmitting}>
            Registrar Ejercicio
          </Button>
        </div>
      </form>
    </Card>
  );
}

