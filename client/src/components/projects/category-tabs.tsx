import { Button } from "@/components/ui/button";
import { 
  LucideIcon, 
  Globe, 
  DollarSign, 
  Palette, 
  Users, 
  Database, 
  HeartHandshake, 
  MessagesSquare 
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
    { id: 'all', label: 'All Projects', icon: Globe },
    { id: 'defi', label: 'DeFi', icon: DollarSign },
    { id: 'nft', label: 'NFT', icon: Palette },
    { id: 'dao', label: 'DAO', icon: Users },
    { id: 'infrastructure', label: 'Infrastructure', icon: Database },
    { id: 'public_goods', label: 'Public Goods', icon: HeartHandshake },
    { id: 'social', label: 'Social', icon: MessagesSquare }
  ];
  
  return (
    <div className="mb-4 md:mb-6 overflow-x-auto pb-2">
      <div className="flex space-x-1.5 md:space-x-2 min-w-max px-2 md:px-0">
        {categories.map(category => {
          const Icon = category.icon;
          const isActive = activeCategory === category.id;
          
          return (
            <Button
              key={category.id}
              variant={isActive ? 'default' : 'outline'}
              size="sm"
              className={`
                h-8 md:h-10 text-xs md:text-sm px-2.5 md:px-4
                ${isActive
                  ? 'bg-accent hover:bg-accent/90 text-darkBg'
                  : 'bg-darkCard hover:bg-darkCard/80 text-white hover:text-white'
                }
              `}
              onClick={() => onCategoryChange(category.id)}
            >
              <Icon className={`mr-1.5 md:mr-2 h-3.5 w-3.5 md:h-4 md:w-4 ${isActive ? 'text-darkBg' : 'text-accent'}`} />
              <span className="whitespace-nowrap">{category.label}</span>
            </Button>
          );
        })}
      </div>
    </div>
  );
}
