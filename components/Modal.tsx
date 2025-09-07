'use client';

import { ReactNode, useEffect } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ModalProps {
  children: ReactNode;
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  variant?: 'dialog' | 'confirmation';
  className?: string;
}

export function Modal({ 
  children, 
  isOpen, 
  onClose, 
  title,
  variant = 'dialog',
  className
}: ModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay animate-fade-in" onClick={onClose}>
      <div 
        className={cn("modal-content animate-slide-up", className)}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        {title && (
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-heading text-textPrimary">{title}</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              aria-label="Close modal"
            >
              <X className="w-5 h-5 text-textSecondary" />
            </button>
          </div>
        )}

        {/* Content */}
        <div className="p-6 text-textPrimary">
          {children}
        </div>
      </div>
    </div>
  );
}
