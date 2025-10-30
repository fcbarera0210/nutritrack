import { InputHTMLAttributes, ReactNode } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: ReactNode;
  suffix?: ReactNode;
}

export function Input({
  label,
  error,
  icon,
  suffix,
  className = '',
  ...props
}: InputProps) {
  const inputId = props.id || props.name;
  
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            {icon}
          </div>
        )}
        <input
          id={inputId}
          className={`
            w-full rounded-md border-2 border-[var(--border-color)]
            px-4 py-3 text-[var(--foreground)] bg-[var(--card-bg)]
            focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--color-primary-50)]
            transition-all duration-200
            ${icon ? 'pl-12' : ''}
            ${suffix ? 'pr-12' : ''}
            ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-50' : ''}
            ${className}
          `}
          {...props}
        />
        {suffix && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[var(--primary)]">
            {suffix}
          </div>
        )}
        {error && (
          <p className="mt-1 text-sm text-red-600">{error}</p>
        )}
      </div>
    </div>
  );
}

