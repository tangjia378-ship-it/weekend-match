import { Coffee, ShoppingBag, GraduationCap, Megaphone, Bike, MoreHorizontal } from 'lucide-react';
import { JobCategory } from '../types';
import { categoryLabels } from '../utils/categoryConfig';

interface CategoryFilterProps {
  selected: JobCategory | null;
  onSelect: (category: JobCategory | null) => void;
}

const categoryIcons: Record<JobCategory, React.ReactNode> = {
  catering: <Coffee className="w-5 h-5" />,
  retail: <ShoppingBag className="w-5 h-5" />,
  education: <GraduationCap className="w-5 h-5" />,
  promotion: <Megaphone className="w-5 h-5" />,
  delivery: <Bike className="w-5 h-5" />,
  other: <MoreHorizontal className="w-5 h-5" />,
};

export const CategoryFilter: React.FC<CategoryFilterProps> = ({ selected, onSelect }) => {
  const categories: JobCategory[] = [
    'catering',
    'retail',
    'education',
    'promotion',
    'delivery',
    'other',
  ];

  return (
    <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
      <button
        onClick={() => onSelect(null)}
        className={`flex-shrink-0 flex items-center space-x-2 px-5 py-2.5 rounded-button font-medium transition-all ${
          selected === null
            ? 'bg-primary-500 text-white shadow-card'
            : 'bg-white text-gray-700 shadow-soft hover:shadow-card'
        }`}
      >
        <span>全部</span>
      </button>
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => onSelect(category)}
          className={`flex-shrink-0 flex items-center space-x-2 px-5 py-2.5 rounded-button font-medium transition-all ${
            selected === category
              ? 'bg-primary-500 text-white shadow-card'
              : 'bg-white text-gray-700 shadow-soft hover:shadow-card'
          }`}
        >
          {categoryIcons[category]}
          <span>{categoryLabels[category]}</span>
        </button>
      ))}
    </div>
  );
};
