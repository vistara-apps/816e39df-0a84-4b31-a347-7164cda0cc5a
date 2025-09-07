'use client';

import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface InfoCardProps {
  children: ReactNode;
  variant?: 'display' | 'summary';
  className?: string;
  onClick?: () => void;
  price?: number;
}

export function InfoCard({ 
  children, 
  variant = 'display',
  className,
  onClick,
  price
}: InfoCardProps) {
  const baseClasses = "info-card animate-fade-in";
  const variantClasses = {
    display: "p-6",
    summary: "p-4"
  };

  return (
    <div 
      className={cn(
        baseClasses,
        variantClasses[variant],
        onClick && "cursor-pointer hover:scale-105 transform transition-transform duration-200",
        className
      )}
      onClick={onClick}
    >
      {price && (
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">{children}</div>
          <div className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm font-semibold">
            ${(price / 100).toFixed(2)}
          </div>
        </div>
      )}
      {!price && children}
    </div>
  );
}
