'use client';

import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface InputGroupProps {
  children: ReactNode;
  variant?: 'text' | 'textarea';
  label?: string;
  error?: string;
  className?: string;
}

export function InputGroup({ 
  children, 
  variant = 'text',
  label,
  error,
  className
}: InputGroupProps) {
  return (
    <div className={cn("input-group", className)}>
      {label && (
        <label className="block text-sm font-medium text-white mb-2">
          {label}
        </label>
      )}
      {children}
      {error && (
        <p className="text-red-300 text-sm mt-1">{error}</p>
      )}
    </div>
  );
}

interface InputFieldProps {
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  required?: boolean;
  multiline?: boolean;
  rows?: number;
  className?: string;
}

export function InputField({ 
  type = 'text',
  placeholder,
  value,
  onChange,
  required = false,
  multiline = false,
  rows = 3,
  className
}: InputFieldProps) {
  const baseClasses = "input-field";

  if (multiline) {
    return (
      <textarea
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        rows={rows}
        className={cn(baseClasses, "resize-none", className)}
      />
    );
  }

  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      required={required}
      className={cn(baseClasses, className)}
    />
  );
}
