import { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Menu, Search, Sun, Moon } from 'lucide-react';
import { useTheme } from 'next-themes';

export default function Header() {
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
    // Implement search functionality
    console.log("Searching for:", searchQuery);
  };
  
  return (
    <header className="bg-darkBg border-b border-darkBorder sticky top-0 z-50">
      {/* Mobile header (CoinMarketCap style) */}
      <div className="md:hidden">
        {/* Market stats bar */}
        <div className="flex items-center justify-between py-2 px-4 bg-darkBg border-b border-darkBorder text-xs">
          <div className="flex items-center">
            <span className="text-white font-medium">Market Cap</span>
            <span className="ml-2 text-white">$2.08 T</span>
            <span className="ml-1 text-green-400">+0.18%</span>
          </div>
          <div className="flex items-center">
            <span className="text-white font-medium">Volume</span>
            <span className="ml-2 text-white">$61.3 B</span>
            <span className="ml-1 text-red-400">-2.57%</span>
          </div>
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 rounded-full"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            >
              {mounted && (
                theme === 'dark' ? <Sun className="h-4 w-4 text-accent" /> : <Moon className="h-4 w-4 text-accent" />
              )}
            </Button>
          </div>
        </div>
        
        {/* Tabs navigation */}
        <div className="flex border-b border-darkBorder overflow-x-auto">
          <Button variant="ghost" className="flex-1 rounded-none border-b-2 border-accent text-white py-3 px-2">
            Projects
          </Button>
          <Button variant="ghost" className="flex-1 rounded-none border-b-0 text-darkText py-3 px-2">
            Watchlist
          </Button>
          <Button variant="ghost" className="flex-1 rounded-none border-b-0 text-darkText py-3 px-2">
            Overview
          </Button>
          <Button variant="ghost" className="flex-1 rounded-none border-b-0 text-darkText py-3 px-2">
            Funding
          </Button>
        </div>
        
        {/* Filters row */}
        <div className="flex items-center justify-between border-b border-darkBorder px-4 py-2">
          <div className="flex items-center">
            <span className="text-white text-sm">USD</span>
            <span className="mx-1 text-darkText">/</span>
            <span className="text-accent text-sm">TOP</span>
          </div>
          
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" className="text-xs rounded-full border-darkBorder bg-darkCard">
              Top 100 <svg className="ml-1 h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </Button>
            <Button variant="outline" size="sm" className="text-xs rounded-full border-darkBorder bg-darkCard">
              <span className="text-white">24h %</span> <svg className="ml-1 h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </Button>
          </div>
          
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-white">
                <Menu className="h-4 w-4" />
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
                
                <form onSubmit={handleSearch} className="relative mb-6">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-darkText" />
                  <Input
                    type="text"
                    placeholder="Search projects..."
                    className="w-full bg-darkBg border-darkBorder pl-10 pr-4 py-2"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </form>
                
                <div className="mt-auto">
                  <Button className="w-full bg-accent hover:bg-opacity-90 text-darkBg font-medium">
                    Connect Wallet
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
        
        {/* Table header */}
        <div className="flex items-center justify-between border-b border-darkBorder px-4 py-2 text-xs text-darkText">
          <span className="w-8">#</span>
          <span className="flex-1">Market Cap</span>
          <span className="w-24 text-right">Price</span>
          <span className="w-16 text-right">24h %</span>
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
                onChange={(e) => setSearchQuery(e.target.value)}
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
