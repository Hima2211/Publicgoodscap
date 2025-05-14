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
    <div className="mb-6 overflow-x-auto pb-2">
      <div className="flex space-x-2 min-w-max">
        {categories.map(category => {
          const Icon = category.icon;
          const isActive = activeCategory === category.id;
          
          return (
            <Button
              key={category.id}
              variant={isActive ? 'default' : 'outline'}
              className={
                isActive
                  ? 'bg-accent hover:bg-accent/90 text-darkBg'
                  : 'bg-darkCard hover:bg-darkCard/80 text-white hover:text-white'
              }
              onClick={() => onCategoryChange(category.id)}
            >
              <Icon className={`mr-2 h-4 w-4 ${isActive ? 'text-darkBg' : 'text-accent'}`} />
              {category.label}
            </Button>
          );
        })}
      </div>
    </div>
  );
}
