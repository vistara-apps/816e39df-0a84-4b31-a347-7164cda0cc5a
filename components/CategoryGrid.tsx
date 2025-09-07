'use client';

import { LEGAL_CATEGORIES } from '@/lib/constants';
import { CategoryType } from '@/lib/types';

interface CategoryGridProps {
  onCategorySelect: (category: CategoryType) => void;
}

export function CategoryGrid({ onCategorySelect }: CategoryGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {LEGAL_CATEGORIES.map((category) => (
        <div
          key={category.id}
          className="category-card group"
          onClick={() => onCategorySelect(category.id)}
        >
          <div className={`w-12 h-12 mx-auto mb-3 rounded-lg bg-gradient-to-r ${category.color} flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-200`}>
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
