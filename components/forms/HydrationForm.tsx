'use client';

import { useState } from 'react';
import { Drop, CaretUp, CaretDown } from '@phosphor-icons/react';
import { getTodayDateLocal } from '@/lib/utils/date';

interface HydrationFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function HydrationForm({ onSuccess, onCancel }: HydrationFormProps) {
  const [amount, setAmount] = useState(200);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleIncrement = () => {
    setAmount(prev => prev + 50);
  };

  const handleDecrement = () => {
    setAmount(prev => Math.max(50, prev - 50));
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '') {
      setAmount(0);
      return;
    }
    const numValue = parseInt(value);
    if (!isNaN(numValue) && numValue >= 0) {
      setAmount(numValue);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (amount <= 0) {
      setError('El monto debe ser mayor a 0');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/hydration/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: amount,
          date: getTodayDateLocal(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al registrar hidratación');
      }

      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      setError(error.message || 'Error al registrar hidratación');
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

      <div className="flex flex-col items-center">
        <label className="text-[#131917] text-[16px] font-semibold mb-4">
          Cantidad de agua (ml)
        </label>
        
        {/* Controles de cantidad */}
        <div className="flex items-center gap-4">
          {/* Botón disminuir */}
          <button
            type="button"
            onClick={handleDecrement}
            disabled={amount <= 50 || isSubmitting}
            className="w-12 h-12 rounded-[15px] bg-[#6484E2] text-white flex items-center justify-center hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <CaretDown size={24} weight="bold" />
          </button>

          {/* Input de cantidad */}
          <div className="relative">
            <input
              type="number"
              value={amount}
              onChange={handleAmountChange}
              min="0"
              step="50"
              className="w-[120px] bg-white rounded-[15px] border-2 border-transparent px-4 py-[10px] text-[#131917] placeholder-[#D9D9D9] text-[32px] font-bold text-center focus:outline-none focus:border-[#3CCC1F] focus:shadow-none transition-all"
              disabled={isSubmitting}
            />
            <div className="absolute -bottom-5 left-1/2 transform -translate-x-1/2 text-[#5A5B5A] text-xs font-medium">
              ml
            </div>
          </div>

          {/* Botón aumentar */}
          <button
            type="button"
            onClick={handleIncrement}
            disabled={isSubmitting}
            className="w-12 h-12 rounded-[15px] bg-[#6484E2] text-white flex items-center justify-center hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <CaretUp size={24} weight="bold" />
          </button>
        </div>
      </div>

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
          disabled={isSubmitting || amount <= 0}
          className="flex-1 bg-[#6484E2] rounded-[15px] px-4 py-[10px] text-white font-semibold text-[16px] hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <span>Guardando...</span>
            </>
          ) : (
            <>
              <Drop size={20} weight="bold" />
              <span>Guardar</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}

