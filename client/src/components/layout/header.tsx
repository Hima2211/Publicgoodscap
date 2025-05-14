import { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Search, 
  Sun, 
  Moon,
  Grid2x2Check,
  List
} from 'lucide-react';
import { useTheme } from 'next-themes';

interface HeaderProps {
  onCategoryChange?: (category: string) => void;
  onSearchQuery?: (query: string) => void;
}

export default function Header({ onCategoryChange, onSearchQuery }: HeaderProps) {
  const [location] = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  
  // Only access theme client-side to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);
  
  const navItems = [
    { label: 'Discover', href: '/' },
    { label: 'Categories', href: '/categories' },
    { label: 'Learn', href: '/learn' }
  ];
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearchQuery) {
      onSearchQuery(searchQuery);
    }
  };
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    if (onSearchQuery) {
      onSearchQuery(e.target.value);
    }
  };
  
  return (
    <header className="bg-darkBg border-b border-darkBorder sticky top-0 z-50">
      {/* Mobile header */}
      <div className="md:hidden">
        {/* Logo and theme toggle */}
        <div className="flex items-center justify-between py-2 px-3 bg-darkBg border-b border-darkBorder text-xs">
          <Link href="/" className="flex items-center">
            <svg className="w-6 h-6 text-accent" viewBox="0 0 24 24" fill="currentColor">
              <path d="M21 14.5V11a9 9 0 0 0-18 0v3.5A4.5 4.5 0 0 0 6 22h12a4.5 4.5 0 0 0 3-7.5zM6 12h12v2H6v-2zm12 8H6a2.5 2.5 0 0 1 0-5h12a2.5 2.5 0 0 1 0 5z"/>
            </svg>
            <span className="ml-1 text-sm font-bold text-white">BuidlMark</span>
          </Link>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="default"
              size="sm"
              className="h-6 text-xs bg-accent hover:bg-accent/90 text-darkBg font-medium"
            >
              Connect
            </Button>
            
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-6 w-6 rounded-full"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            >
              {mounted && (
                theme === 'dark' ? <Sun className="h-3 w-3 text-accent" /> : <Moon className="h-3 w-3 text-accent" />
              )}
            </Button>
          </div>
        </div>

        {/* Market cap stats bar */}
        <div className="flex items-center justify-between py-2 px-3 bg-darkCard text-xs">
          <div className="flex items-center">
            <span className="text-white text-sm font-medium">Market Cap</span>
            <span className="ml-2 text-white text-sm">$2.08 T</span>
            <span className="ml-1 text-green-400 text-sm">+0.18%</span>
          </div>
          
          <div className="flex rounded overflow-hidden border border-darkBorder h-5">
            <button className="px-1.5 flex items-center text-[10px] bg-darkCard text-accent">
              <Grid2x2Check className="h-2.5 w-2.5" />
            </button>
            <button className="px-1.5 flex items-center text-[10px] bg-darkBg text-darkText">
              <List className="h-2.5 w-2.5" />
            </button>
          </div>
        </div>
      </div>
      
      {/* Desktop header */}
      <div className="hidden md:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex justify-between items-center py-4">
            {/* Logo and Navigation */}
            <div className="flex items-center">
              <Link href="/" className="flex items-center mr-8">
                <svg className="w-8 h-8 text-accent" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M21 14.5V11a9 9 0 0 0-18 0v3.5A4.5 4.5 0 0 0 6 22h12a4.5 4.5 0 0 0 3-7.5zM6 12h12v2H6v-2zm12 8H6a2.5 2.5 0 0 1 0-5h12a2.5 2.5 0 0 1 0 5z"/>
                </svg>
                <span className="ml-2 text-xl font-bold text-white">BuidlMarketCap</span>
              </Link>
              
              <nav className="flex space-x-4">
                {navItems.map(item => (
                  <Link 
                    key={item.href} 
                    href={item.href}
                    className={`text-sm font-medium ${
                      location === item.href ? 'text-accent' : 'text-darkText hover:text-white'
                    } transition-colors`}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>
            
            {/* Search and Right Section */}
            <div className="flex items-center space-x-4">
              <form onSubmit={handleSearch} className="relative">
                <Input
                  type="search"
                  placeholder="Search projects..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="w-64 bg-darkCard text-sm"
                />
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-darkText w-4 h-4" />
              </form>
              
              <Button
                variant="outline"
                className="border-border hover:bg-darkCard"
              >
                Submit Project
              </Button>
              
              <Button 
                variant="ghost" 
                size="icon"
                className="rounded-full"
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              >
                {mounted && (
                  theme === 'dark' ? <Sun className="h-4 w-4 text-accent" /> : <Moon className="h-4 w-4 text-accent" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
