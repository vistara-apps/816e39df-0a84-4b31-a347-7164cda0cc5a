'use client';

import { LEGAL_CATEGORIES } from '@/lib/constants';
import { CategoryType } from '@/lib/types';

interface CategoryGridProps {
  onCategorySelect: (category: CategoryType) => void;
}

export function CategoryGrid({ onCategorySelect }: CategoryGridProps) {
  const handleKeyDown = (event: React.KeyboardEvent, categoryId: CategoryType) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onCategorySelect(categoryId);
    }
  };

  return (
    <div 
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
      role="grid"
      aria-label="Legal categories"
    >
      {LEGAL_CATEGORIES.map((category) => (
        <div
          key={category.id}
          className="category-card group focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 focus:bg-opacity-20"
          onClick={() => onCategorySelect(category.id)}
          onKeyDown={(e) => handleKeyDown(e, category.id)}
          role="gridcell"
          tabIndex={0}
          aria-label={`${category.title}: ${category.description}`}
        >
          <div 
            className={`w-12 h-12 mx-auto mb-3 rounded-lg bg-gradient-to-r ${category.color} flex items-center justify-center text-2xl group-hover:scale-110 group-focus:scale-110 transition-transform duration-200`}
            aria-hidden="true"
          >
            {category.icon}
          </div>
          <h3 className="text-heading mb-2">{category.title}</h3>
          <p className="text-sm text-white text-opacity-80">
            {category.description}
          </p>
        </div>
      ))}
    </div>
  );
}
