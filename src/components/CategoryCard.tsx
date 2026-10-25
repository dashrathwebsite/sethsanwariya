import React, { useState } from 'react';
import { Category } from '../types';
import { ImageOff, ArrowRight } from 'lucide-react';

interface CategoryCardProps {
  category: Category;
  onClick: (categoryId: string) => void;
  count?: number;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({ category, onClick, count }) => {
  const [imageError, setImageError] = useState(false);

  return (
    <div
      onClick={() => onClick(category.id)}
      className="group relative flex flex-col bg-white rounded-xl border border-[#E8DFD5] overflow-hidden shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer text-left"
    >
      <div className="relative aspect-4/3 w-full bg-[#F5EFEB] overflow-hidden">
        {!imageError && category.image_url ? (
          <img
            src={category.image_url}
            alt={category.name_hi}
            referrerPolicy="no-referrer"
            loading="lazy"
            onError={() => setImageError(true)}
            className="w-full h-full object-cover object-center group-hover:scale-104 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-gradient-to-br from-[#F5EFEB] to-[#EAE0D3] text-[#8C7A68]">
            <ImageOff className="w-8 h-8 mb-2 opacity-60" />
            <span className="text-xs font-hindi text-center font-medium">{category.name_hi}</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex flex-col justify-end p-4 text-white">
          <h3 className="text-lg font-bold font-hindi leading-snug">
            {category.name_hi}
          </h3>
          {category.name_en && (
            <p className="text-xs text-white/80 font-medium">
              {category.name_en}
            </p>
          )}
          {count !== undefined && (
            <span className="text-[11px] text-[#E2B158] font-semibold mt-1 tabular-nums">
              {count} कपड़े उपलब्ध
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
