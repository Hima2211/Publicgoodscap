import { Button } from "@/components/ui/button";
import { 
  LucideIcon, 
  Globe, 
  DollarSign, 
  Palette, 
  Users, 
  Database, 
  HeartHandshake, 
  MessagesSquare,
  Boxes
} from "lucide-react";

interface CategoryTabsProps {
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

interface Category {
  id: string;
  label: string;
  icon: LucideIcon;
}

export default function CategoryTabs({ activeCategory, onCategoryChange }: CategoryTabsProps) {
  const categories: Category[] = [
    { id: 'all', label: 'All', icon: Globe },
    { id: 'gitcoin', label: 'Gitcoin', icon: HeartHandshake },
    { id: 'giveth', label: 'Giveth', icon: HeartHandshake },
    { id: 'karma', label: 'Karma', icon: HeartHandshake },
    { id: 'defi', label: 'DeFi', icon: DollarSign },
    { id: 'nft', label: 'NFT', icon: Palette },
    { id: 'dao', label: 'DAO', icon: Users },
    { id: 'infrastructure', label: 'Infrastructure', icon: Database },
    { id: 'public_goods', label: 'Public Goods', icon: HeartHandshake },
    { id: 'social', label: 'Social', icon: MessagesSquare }
  ];
  
  return (
    <div className="mt-1 mb-2 md:mb-4 overflow-x-auto no-scrollbar -mx-2 md:mx-0">
      <div className="flex space-x-1 md:space-x-2 min-w-max px-2 md:px-0">
        {categories.map(category => {
          const Icon = category.icon;
          const isActive = activeCategory === category.id;
          
          return (
            <Button
              key={category.id}
              variant={isActive ? 'default' : 'outline'}
              size="sm"
              className={`
                h-7 md:h-8 text-[10px] md:text-xs px-2 md:px-2.5
                ${isActive
                  ? 'bg-accent hover:bg-accent/90 text-darkBg'
                  : 'bg-darkCard hover:bg-darkCard/80 text-white hover:text-white'
                }
              `}
              onClick={() => onCategoryChange(category.id)}
            >
              <Icon className={`mr-1 md:mr-1.5 h-3 w-3 md:h-3.5 md:w-3.5 ${isActive ? 'text-darkBg' : 'text-accent'}`} />
              <span className="whitespace-nowrap">{category.label}</span>
            </Button>
          );
        })}
      </div>
    </div>
  );
}
