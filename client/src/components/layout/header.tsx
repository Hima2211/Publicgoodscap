import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Menu, Search, X } from 'lucide-react';

export default function Header() {
  const [location] = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <Link href="/" className="flex items-center">
              <svg className="w-10 h-10 text-primary" viewBox="0 0 24 24" fill="currentColor">
                <path d="M21 14.5V11a9 9 0 0 0-18 0v3.5A4.5 4.5 0 0 0 6 22h12a4.5 4.5 0 0 0 3-7.5zM6 12h12v2H6v-2zm12 8H6a2.5 2.5 0 0 1 0-5h12a2.5 2.5 0 0 1 0 5z"/>
              </svg>
              <span className="ml-2 text-xl font-display font-bold text-white">BuidlMarketCap</span>
            </Link>
            
            <nav className="hidden md:flex space-x-1">
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
            
            <Button variant="default" className="hidden md:flex bg-primary hover:bg-opacity-90 text-white">
              Connect Wallet
            </Button>
            
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden text-white">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="bg-darkCard border-darkBorder">
                <div className="flex flex-col h-full py-6">
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center">
                      <svg className="w-8 h-8 text-primary" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M21 14.5V11a9 9 0 0 0-18 0v3.5A4.5 4.5 0 0 0 6 22h12a4.5 4.5 0 0 0 3-7.5zM6 12h12v2H6v-2zm12 8H6a2.5 2.5 0 0 1 0-5h12a2.5 2.5 0 0 1 0 5z"/>
                      </svg>
                      <span className="ml-2 text-lg font-display font-bold text-white">BuidlMarketCap</span>
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
                    <Button className="w-full bg-primary hover:bg-opacity-90 text-white">
                      Connect Wallet
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
