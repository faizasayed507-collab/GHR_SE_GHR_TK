import React from 'react';
import { Category } from '../types';
import { Sparkles, Shirt, Gem, Flower2, Gift, Home, LayoutGrid } from 'lucide-react';

interface HeaderPillsProps {
  selectedCategory: Category;
  onSelectCategory: (category: Category) => void;
  categoryCounts: Record<Category, number>;
}

export const HeaderPills: React.FC<HeaderPillsProps> = ({
  selectedCategory,
  onSelectCategory,
  categoryCounts,
}) => {
  const categories: { name: Category; icon: React.ReactNode }[] = [
    { name: 'All', icon: <LayoutGrid className="w-3.5 h-3.5" /> },
    { name: 'Clothing', icon: <Shirt className="w-3.5 h-3.5" /> },
    { name: 'Jewellery', icon: <Gem className="w-3.5 h-3.5" /> },
    { name: 'Perfumes', icon: <Flower2 className="w-3.5 h-3.5" /> },
    { name: 'Gift Baskets', icon: <Gift className="w-3.5 h-3.5" /> },
    { name: 'Home Decor', icon: <Home className="w-3.5 h-3.5" /> },
  ];

  return (
    <div className="bg-[#FFF9F5] border-b border-[#F2E8E1] py-3 px-4 overflow-x-auto no-scrollbar">
      <div className="max-w-7xl mx-auto flex items-center gap-2.5 min-w-max">
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.name;
          const count = categoryCounts[cat.name] || 0;

          return (
            <button
              key={cat.name}
              onClick={() => onSelectCategory(cat.name)}
              className={`flex items-center gap-2 px-5 py-2 rounded-full text-xs font-semibold transition-all duration-200 shrink-0 ${
                isSelected
                  ? 'active-pill shadow-xs'
                  : 'bg-white border border-[#F2E8E1] text-[#8C7B6C] hover:border-[#D4AF37] hover:text-[#4A3F35]'
              }`}
            >
              <span className={isSelected ? 'text-white' : 'text-[#A69689]'}>
                {cat.icon}
              </span>
              <span>{cat.name}</span>
              <span
                className={`ml-0.5 px-2 py-0.5 text-[10px] font-bold rounded-full ${
                  isSelected
                    ? 'bg-white/20 text-white'
                    : 'bg-[#FBF7F4] text-[#A69689]'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
