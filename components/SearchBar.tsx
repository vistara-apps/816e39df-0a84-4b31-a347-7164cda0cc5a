'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, X, Filter } from 'lucide-react';
import { CategoryType } from '@/lib/types';

interface SearchBarProps {
  onSearch: (query: string) => void;
  onFilterToggle?: () => void;
  placeholder?: string;
  showFilter?: boolean;
  isLoading?: boolean;
}

export function SearchBar({ 
  onSearch, 
  onFilterToggle,
  placeholder = "Search legal rights...",
  showFilter = false,
  isLoading = false
}: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(query);
    }, 300);

    return () => clearTimeout(timer);
  }, [query, onSearch]);

  const handleClear = () => {
    setQuery('');
    inputRef.current?.focus();
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      handleClear();
    }
  };

  return (
    <div className="relative">
      <div 
        className={`
          flex items-center bg-white bg-opacity-20 backdrop-blur-sm rounded-lg border transition-all duration-200
          ${isFocused 
            ? 'border-white border-opacity-50 bg-opacity-30' 
            : 'border-white border-opacity-20'
          }
        `}
      >
        <div className="flex items-center pl-3">
          <Search 
            className={`w-4 h-4 transition-colors duration-200 ${
              isFocused ? 'text-white' : 'text-white text-opacity-70'
            }`}
            aria-hidden="true"
          />
        </div>
        
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="flex-1 px-3 py-2 bg-transparent text-white placeholder-white placeholder-opacity-70 focus:outline-none"
          aria-label="Search legal rights and information"
          disabled={isLoading}
        />
        
        {query && (
          <button
            onClick={handleClear}
            className="p-2 hover:bg-white hover:bg-opacity-10 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
            aria-label="Clear search"
          >
            <X className="w-4 h-4 text-white text-opacity-70" />
          </button>
        )}
        
        {showFilter && (
          <button
            onClick={onFilterToggle}
            className="p-2 hover:bg-white hover:bg-opacity-10 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 mr-1"
            aria-label="Toggle filters"
          >
            <Filter className="w-4 h-4 text-white text-opacity-70" />
          </button>
        )}
      </div>
      
      {isLoading && (
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          <div className="w-4 h-4 border-2 border-white border-opacity-30 border-t-white rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
}

// Quick search suggestions component
interface SearchSuggestionsProps {
  suggestions: string[];
  onSelect: (suggestion: string) => void;
  isVisible: boolean;
}

export function SearchSuggestions({ suggestions, onSelect, isVisible }: SearchSuggestionsProps) {
  if (!isVisible || suggestions.length === 0) return null;

  return (
    <div className="absolute top-full left-0 right-0 mt-2 glass-card rounded-lg shadow-lg z-50">
      <div className="p-2">
        <h4 className="text-sm font-semibold text-white text-opacity-80 mb-2 px-2">
          Popular searches
        </h4>
        <ul role="listbox" aria-label="Search suggestions">
          {suggestions.map((suggestion, index) => (
            <li key={index}>
              <button
                onClick={() => onSelect(suggestion)}
                className="w-full text-left px-3 py-2 text-sm text-white hover:bg-white hover:bg-opacity-10 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
                role="option"
              >
                {suggestion}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
