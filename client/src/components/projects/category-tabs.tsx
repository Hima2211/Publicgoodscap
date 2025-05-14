import { Button } from "@/components/ui/button";

interface CategoryTabsProps {
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

export default function CategoryTabs({ activeCategory, onCategoryChange }: CategoryTabsProps) {
  const categories = [
    { id: 'all', label: 'All Projects' },
    { id: 'defi', label: 'DeFi' },
    { id: 'nft', label: 'NFT' },
    { id: 'dao', label: 'DAO' },
    { id: 'infrastructure', label: 'Infrastructure' },
    { id: 'public_goods', label: 'Public Goods' },
    { id: 'social', label: 'Social' }
  ];
  
  return (
    <div className="mb-6 overflow-x-auto pb-2">
      <div className="flex space-x-2 min-w-max">
        {categories.map(category => (
          <Button
            key={category.id}
            variant={activeCategory === category.id ? 'default' : 'outline'}
            className={
              activeCategory === category.id
                ? 'bg-primary text-white'
                : 'bg-darkCard hover:bg-opacity-80 text-white'
            }
            onClick={() => onCategoryChange(category.id)}
          >
            {category.label}
          </Button>
        ))}
      </div>
    </div>
  );
}
