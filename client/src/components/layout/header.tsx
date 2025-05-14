import { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Menu, 
  Search, 
  Sun, 
  Moon, 
  Globe, 
  DollarSign, 
  Palette, 
  Users, 
  Database, 
  HeartHandshake, 
  MessagesSquare,
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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
      {/* Mobile header (CoinMarketCap style) */}
      <div className="md:hidden">
        {/* Market stats bar with logo */}
        <div className="flex items-center justify-between py-2 px-3 bg-darkBg border-b border-darkBorder text-xs">
          <Link href="/" className="flex items-center">
            <svg className="w-6 h-6 text-accent" viewBox="0 0 24 24" fill="currentColor">
              <path d="M21 14.5V11a9 9 0 0 0-18 0v3.5A4.5 4.5 0 0 0 6 22h12a4.5 4.5 0 0 0 3-7.5zM6 12h12v2H6v-2zm12 8H6a2.5 2.5 0 0 1 0-5h12a2.5 2.5 0 0 1 0 5z"/>
            </svg>
            <span className="ml-1 text-sm font-bold text-white">BuidlMark</span>
          </Link>
          
          <div className="flex flex-col items-end">
            <div className="flex items-center">
              <span className="text-white font-medium">Market Cap</span>
              <span className="ml-1 text-white">$2.08 T</span>
              <span className="ml-1 text-green-400">+0.18%</span>
            </div>
            <div className="flex items-center mt-0.5">
              <span className="text-white font-medium">Volume</span>
              <span className="ml-1 text-white">$61.3 B</span>
              <span className="ml-1 text-red-400">-2.57%</span>
            </div>
          </div>
          
          <div className="flex items-center">
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
        
        {/* Simple category navigation bar */}
        <div className="md:hidden bg-darkBg">
          <div className="overflow-x-auto flex space-x-1.5 p-1.5 min-w-max border-b border-darkBorder">
            <Button 
              variant="default"
              className="bg-accent hover:bg-accent/90 text-darkBg text-[10px] font-medium px-2 py-1 h-6"
              onClick={() => onCategoryChange?.('all')}
            >
              All
            </Button>
            <Button 
              variant="outline"
              className="bg-darkCard hover:bg-darkCard/80 text-white hover:text-white text-[10px] font-medium px-2 py-1 h-6"
              onClick={() => onCategoryChange?.('defi')}
            >
              DeFi
            </Button>
            <Button 
              variant="outline"
              className="bg-darkCard hover:bg-darkCard/80 text-white hover:text-white text-[10px] font-medium px-2 py-1 h-6"
              onClick={() => onCategoryChange?.('nft')}
            >
              NFT
            </Button>
            <Button 
              variant="outline"
              className="bg-darkCard hover:bg-darkCard/80 text-white hover:text-white text-[10px] font-medium px-2 py-1 h-6"
              onClick={() => onCategoryChange?.('dao')}
            >
              DAO
            </Button>
            <Button 
              variant="outline"
              className="bg-darkCard hover:bg-darkCard/80 text-white hover:text-white text-[10px] font-medium px-2 py-1 h-6"
              onClick={() => onCategoryChange?.('infrastructure')}
            >
              Infra
            </Button>
            <Button 
              variant="outline"
              className="bg-darkCard hover:bg-darkCard/80 text-white hover:text-white text-[10px] font-medium px-2 py-1 h-6"
              onClick={() => onCategoryChange?.('social')}
            >
              Social
            </Button>
          </div>
        </div>
        
        {/* Sort and View Controls */}
        <div className="flex items-center justify-between border-b border-darkBorder px-3 py-2">
          <div className="flex space-x-2 items-center">
            <button className="h-6 w-24 text-[10px] bg-darkCard border border-darkBorder rounded px-2 py-1 flex items-center justify-between">
              <span className="text-white">Trending</span>
              <svg className="h-3 w-3 text-darkText" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
          
          <div className="flex items-center space-x-1">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="h-6 w-6 text-darkText">
                  <Search className="h-3.5 w-3.5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="top" className="bg-darkCard border-darkBorder pt-16 pb-4 px-4">
                <form onSubmit={handleSearch} className="relative">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-darkText" />
                  <Input
                    type="text"
                    placeholder="Search projects..."
                    className="w-full bg-darkBg border-darkBorder pl-10 pr-4 py-2"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    autoFocus
                  />
                </form>
              </SheetContent>
            </Sheet>
            
            <div className="flex bg-darkCard rounded overflow-hidden border border-darkBorder">
              <button className="px-2 py-1 flex items-center text-[10px] bg-darkCard text-accent">
                <Grid2x2Check className="h-3 w-3" />
              </button>
              <button className="px-2 py-1 flex items-center text-[10px] bg-darkBg text-darkText">
                <List className="h-3 w-3" />
              </button>
            </div>
            
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="h-6 w-6 text-white">
                  <Menu className="h-3.5 w-3.5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="bg-darkCard border-darkBorder">
                <div className="flex flex-col h-full py-6">
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center">
                      <svg className="w-8 h-8 text-accent" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M21 14.5V11a9 9 0 0 0-18 0v3.5A4.5 4.5 0 0 0 6 22h12a4.5 4.5 0 0 0 3-7.5zM6 12h12v2H6v-2zm12 8H6a2.5 2.5 0 0 1 0-5h12a2.5 2.5 0 0 1 0 5z"/>
                      </svg>
                      <span className="ml-2 text-lg font-bold text-white">BuidlMarketCap</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2 mb-6">
                    {navItems.map((item) => (
                      <Link 
                        key={item.href} 
                        href={item.href}
                        className={`block px-3 py-2 rounded-lg text-base font-medium transition-colors ${
                          location === item.href 
                            ? 'bg-primary bg-opacity-10 text-primary' 
                            : 'text-darkText hover:bg-darkBg hover:text-white'
                        }`}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                  
                  <div className="mt-auto">
                    <Button className="w-full bg-accent hover:bg-opacity-90 text-darkBg font-medium">
                      Connect Wallet
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
      
      {/* Desktop header */}
      <div className="hidden md:block max-w-7xl mx-auto px-4 sm:px-6 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <Link href="/" className="flex items-center">
              <svg className="w-10 h-10 text-accent" viewBox="0 0 24 24" fill="currentColor">
                <path d="M21 14.5V11a9 9 0 0 0-18 0v3.5A4.5 4.5 0 0 0 6 22h12a4.5 4.5 0 0 0 3-7.5zM6 12h12v2H6v-2zm12 8H6a2.5 2.5 0 0 1 0-5h12a2.5 2.5 0 0 1 0 5z"/>
              </svg>
              <span className="ml-2 text-xl font-display font-bold text-white">BuidlMarketCap</span>
            </Link>
            
            <nav className="flex space-x-1">
              {navItems.map((item) => (
                <Link 
                  key={item.href} 
                  href={item.href}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    location === item.href 
                      ? 'bg-darkCard text-white' 
                      : 'text-darkText hover:bg-darkCard hover:text-white'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
          
          <div className="flex items-center space-x-4">
            <form onSubmit={handleSearch} className="relative hidden md:block">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-darkText" />
              <Input
                type="text"
                placeholder="Search projects..."
                className="w-64 bg-darkCard border-darkBorder pl-10 pr-4 py-2 text-sm"
                value={searchQuery}
                onChange={handleSearchChange}
              />
            </form>
            
            {/* Theme toggle button */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="rounded-full bg-darkCard border border-darkBorder"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              aria-label="Toggle theme"
            >
              {mounted && (
                theme === 'dark' ? (
                  <Sun className="h-5 w-5 text-accent" />
                ) : (
                  <Moon className="h-5 w-5 text-accent" />
                )
              )}
            </Button>
            
            <Button variant="default" className="hidden md:flex bg-accent hover:bg-opacity-90 text-darkBg font-medium">
              Connect Wallet
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
