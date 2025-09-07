'use client';

import { Scale } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'overlay' | 'inline';
  message?: string;
}

const sizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-8 h-8',
  lg: 'w-12 h-12',
};

export function LoadingSpinner({ 
  size = 'md', 
  variant = 'default',
  message 
}: LoadingSpinnerProps) {
  const spinnerContent = (
    <div className="flex flex-col items-center space-y-3">
      <div className="relative">
        <Scale className={`${sizeClasses[size]} text-white animate-pulse`} />
        <div 
          className={`absolute inset-0 ${sizeClasses[size]} border-2 border-white border-opacity-30 border-t-white rounded-full animate-spin`}
          aria-hidden="true"
        />
      </div>
      {message && (
        <p className="text-sm text-white text-opacity-80 text-center">
          {message}
        </p>
      )}
    </div>
  );

  if (variant === 'overlay') {
    return (
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center"
        role="status"
        aria-label={message || "Loading"}
      >
        <div className="glass-card p-8 rounded-lg">
          {spinnerContent}
        </div>
      </div>
    );
  }

  if (variant === 'inline') {
    return (
      <div 
        className="flex items-center justify-center py-4"
        role="status"
        aria-label={message || "Loading"}
      >
        {spinnerContent}
      </div>
    );
  }

  return (
    <div 
      className="flex items-center justify-center min-h-[200px]"
      role="status"
      aria-label={message || "Loading"}
    >
      {spinnerContent}
    </div>
  );
}

// Skeleton loader for content cards
export function ContentSkeleton() {
  return (
    <div className="glass-card p-6 animate-pulse">
      <div className="flex justify-between items-start mb-4">
        <div className="space-y-2 flex-1">
          <div className="h-5 bg-white bg-opacity-20 rounded w-3/4"></div>
          <div className="h-4 bg-white bg-opacity-10 rounded w-1/2"></div>
        </div>
        <div className="h-6 bg-white bg-opacity-20 rounded-full w-16"></div>
      </div>
      <div className="space-y-2">
        <div className="h-4 bg-white bg-opacity-10 rounded w-full"></div>
        <div className="h-4 bg-white bg-opacity-10 rounded w-5/6"></div>
        <div className="h-4 bg-white bg-opacity-10 rounded w-4/6"></div>
      </div>
    </div>
  );
}

// Category skeleton loader
export function CategorySkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className="glass-card p-4 text-center animate-pulse">
          <div className="w-12 h-12 mx-auto mb-3 bg-white bg-opacity-20 rounded-lg"></div>
          <div className="h-5 bg-white bg-opacity-20 rounded mb-2"></div>
          <div className="h-4 bg-white bg-opacity-10 rounded"></div>
        </div>
      ))}
    </div>
  );
}
