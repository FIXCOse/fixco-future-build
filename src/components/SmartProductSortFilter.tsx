import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  DollarSign, 
  Star, 
  Target,
  Clock,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import { SortOption } from '@/hooks/useSmartProducts';

interface SmartProductSortFilterProps {
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  productCount: number;
}

const sortOptions = [
  {
    value: 'popularity' as SortOption,
    label: 'Mest Populära',
    icon: TrendingUp,
    description: 'Baserat på visningar, köp och betyg',
    color: 'from-purple-500 to-pink-500'
  },
  {
    value: 'value' as SortOption,
    label: 'Bäst Prisvärt',
    icon: Target,
    description: 'Bästa värdet för pengarna',
    color: 'from-green-500 to-emerald-500'
  },
  {
    value: 'price_low' as SortOption,
    label: 'Lägsta Pris',
    icon: ArrowDown,
    description: 'Från billigast till dyrast',
    color: 'from-blue-500 to-cyan-500'
  },
  {
    value: 'price_high' as SortOption,
    label: 'Högsta Pris',
    icon: ArrowUp,
    description: 'Från dyrast till billigast',
    color: 'from-red-500 to-orange-500'
  },
  {
    value: 'rating' as SortOption,
    label: 'Högst Betyg',
    icon: Star,
    description: 'Baserat på kundrecensioner',
    color: 'from-yellow-500 to-orange-500'
  },
  {
    value: 'newest' as SortOption,
    label: 'Nyaste Först',
    icon: Clock,
    description: 'Senast tillagda produkter',
    color: 'from-indigo-500 to-purple-500'
  }
];

export const SmartProductSortFilter: React.FC<SmartProductSortFilterProps> = ({
  sortBy,
  onSortChange,
  productCount
}) => {
  const currentSort = sortOptions.find(option => option.value === sortBy);

  return (
    <div className="mb-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">
            Sortera Produkter
          </h2>
          <p className="text-gray-300">
            Visar {productCount} produkter
          </p>
        </div>

        <div className="flex items-center gap-4">
          {currentSort && (
            <Badge className={`bg-gradient-to-r ${currentSort.color} text-white border-0 px-4 py-2 shadow-lg`}>
              <currentSort.icon className="h-4 w-4 mr-2" />
              {currentSort.label}
            </Badge>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {sortOptions.map((option) => {
          const isSelected = sortBy === option.value;
          return (
            <button
              key={option.value}
              onClick={() => onSortChange(option.value)}
              className={`
                p-4 rounded-xl transition-all duration-300 text-left
                ${isSelected 
                  ? `bg-gradient-to-r ${option.color} text-white shadow-xl scale-105 ring-2 ring-white/30` 
                  : 'bg-gradient-to-br from-gray-800 to-gray-900 text-gray-300 hover:text-white hover:shadow-lg hover:scale-102 border border-gray-700'
                }
              `}
            >
              <div className="flex items-center gap-3 mb-2">
                <option.icon className={`h-5 w-5 ${isSelected ? 'text-white' : 'text-gray-400'}`} />
                <span className="font-semibold text-sm">{option.label}</span>
              </div>
              <p className={`text-xs ${isSelected ? 'text-white/90' : 'text-gray-500'}`}>
                {option.description}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
};