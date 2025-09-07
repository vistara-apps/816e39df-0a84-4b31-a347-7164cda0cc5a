'use client';

import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface ActionLinkProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary';
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}

export function ActionLink({ 
  children, 
  variant = 'primary',
  onClick,
  disabled = false,
  className
}: ActionLinkProps) {
  const baseClasses = "inline-flex items-center justify-center font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed";
  const variantClasses = {
    primary: "btn-primary",
    secondary: "btn-secondary"
  };

  return (
    <button
      className={cn(
        baseClasses,
        variantClasses[variant],
        className
      )}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
