'use client';

import { ReactNode } from 'react';
import { Scale, ArrowLeft } from 'lucide-react';

interface AppShellProps {
  children: ReactNode;
  title?: string;
  showBack?: boolean;
  onBack?: () => void;
  variant?: 'frame';
}

export function AppShell({ 
  children, 
  title = 'PocketLegal',
  showBack = false,
  onBack,
  variant = 'frame'
}: AppShellProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-blue-600 to-accent">
      {/* Header */}
      <header className="sticky top-0 z-40 glass-card rounded-none border-0 border-b border-white border-opacity-20">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-3">
            {showBack && (
              <button
                onClick={onBack}
                className="p-2 rounded-lg hover:bg-white hover:bg-opacity-10 transition-colors duration-200"
                aria-label="Go back"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
            <div className="flex items-center space-x-2">
              <Scale className="w-6 h-6" />
              <h1 className="text-heading font-bold">{title}</h1>
            </div>
          </div>
          
          {/* Search bar placeholder */}
          <div className="hidden sm:flex items-center bg-white bg-opacity-20 rounded-lg px-3 py-2 text-sm">
            <span className="text-white text-opacity-70">Search rights...</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 max-w-4xl">
        {children}
      </main>

      {/* Footer */}
      <footer className="mt-auto p-4 text-center text-white text-opacity-70">
        <p className="text-sm">
          PocketLegal - Your rights, simplified and actionable
        </p>
        <p className="text-xs mt-1">
          Always consult with a qualified attorney for specific legal advice
        </p>
      </footer>
    </div>
  );
}
