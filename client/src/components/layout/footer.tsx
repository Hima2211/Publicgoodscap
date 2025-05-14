import { Link, useLocation } from "wouter";
import { Home, Search, Send, Trophy, User } from 'lucide-react';

export default function Footer() {
  const [location] = useLocation();
  
  const mobileNavItems = [
    { icon: Home, label: 'Home', href: '/' },
    { icon: Search, label: 'Search', href: '/search' },
    { icon: Send, label: 'Submit', href: '/submit' },
    { icon: Trophy, label: 'Leaderboard', href: '/leaderboard' },
    { icon: User, label: 'Profile', href: '/profile' },
  ];

  return (
    <>
      {/* Mobile Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-darkCard border-t border-darkBorder md:hidden">
        <nav className="flex justify-around items-center py-2 px-4">
          {mobileNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = location === item.href;
            return (
              <Link 
                key={item.href}
                href={item.href}
                className="flex flex-col items-center"
              >
                <Icon 
                  className={`w-5 h-5 mb-1 ${isActive ? 'text-accent' : 'text-darkText'}`} 
                />
                <span className={`text-xs ${isActive ? 'text-accent' : 'text-darkText'}`}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Desktop Footer */}
      <footer className="bg-darkCard border-t border-darkBorder py-4 mt-12 hidden md:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <svg className="w-6 h-6 text-accent" viewBox="0 0 24 24" fill="currentColor">
                <path d="M21 14.5V11a9 9 0 0 0-18 0v3.5A4.5 4.5 0 0 0 6 22h12a4.5 4.5 0 0 0 3-7.5zM6 12h12v2H6v-2zm12 8H6a2.5 2.5 0 0 1 0-5h12a2.5 2.5 0 0 1 0 5z"/>
              </svg>
              <span className="ml-2 text-sm font-medium text-white">BuidlMarketCap</span>
            </div>
            
            <div className="flex flex-wrap justify-center space-x-4 text-xs">
              <Link href="/terms" className="text-darkText hover:text-white transition-colors">Terms</Link>
              <Link href="/privacy" className="text-darkText hover:text-white transition-colors">Privacy</Link>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-darkText hover:text-white transition-colors">Twitter</a>
              <a href="https://discord.com" target="_blank" rel="noopener noreferrer" className="text-darkText hover:text-white transition-colors">Discord</a>
            </div>
            
            <p className="text-xs text-darkText mt-4 md:mt-0">© {new Date().getFullYear()} BuidlMarketCap</p>
          </div>
        </div>
      </footer>
    </>
  );
}
