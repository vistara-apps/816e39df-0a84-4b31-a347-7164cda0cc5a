'use client';

import { ReactNode, useState } from 'react';
import { Scale, ArrowLeft } from 'lucide-react';
import { SearchBar } from './SearchBar';

interface AppShellProps {
  children: ReactNode;
  title?: string;
  showBack?: boolean;
  onBack?: () => void;
  variant?: 'frame';
  onSearch?: (query: string) => void;
  showSearch?: boolean;
}

export function AppShell({ 
  children, 
  title = 'PocketLegal',
  showBack = false,
  onBack,
  variant = 'frame',
  onSearch,
  showSearch = true
}: AppShellProps) {
  const [searchQuery, setSearchQuery] = useState('');
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-blue-600 to-accent">
      {/* Skip to main content link for accessibility */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-white text-primary px-4 py-2 rounded-lg font-semibold z-50"
      >
        Skip to main content
      </a>
      
      {/* Header */}
      <header 
        className="sticky top-0 z-40 glass-card rounded-none border-0 border-b border-white border-opacity-20"
        role="banner"
      >
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-3">
            {showBack && (
              <button
                onClick={onBack}
                className="p-2 rounded-lg hover:bg-white hover:bg-opacity-10 focus:bg-white focus:bg-opacity-20 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
                aria-label="Go back to previous page"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
            <div className="flex items-center space-x-2">
              <Scale className="w-6 h-6" aria-hidden="true" />
              <h1 className="text-heading font-bold">{title}</h1>
            </div>
          </div>
          
          {/* Search bar */}
          {showSearch && onSearch && (
            <div className="hidden sm:block w-64">
              <SearchBar 
                onSearch={onSearch}
                placeholder="Search rights..."
              />
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main 
        id="main-content"
        className="container mx-auto px-4 py-6 max-w-4xl"
        role="main"
        tabIndex={-1}
      >
        {children}
      </main>

      {/* Footer */}
      <footer 
        className="mt-auto p-4 text-center text-white text-opacity-70"
        role="contentinfo"
      >
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
