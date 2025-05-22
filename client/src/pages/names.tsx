import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function Names() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);
    // Simulate search delay (replace with real search logic)
    await new Promise((res) => setTimeout(res, 1200));
    setIsSearching(false);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center transition-colors duration-500">
      <section className="w-full max-w-2xl mx-auto text-center pt-24 pb-24 px-4 bg-card rounded-3xl shadow-sm transition-colors flex flex-col items-center justify-center min-h-[60vh]">
        <h1
          className="text-4xl md:text-5xl font-extrabold mb-6 tracking-tight text-foreground"
          style={{
            fontFamily: 'SF Pro Rounded Heavy, -apple-system, BlinkMacSystemFont, sans-serif',
            fontSize: 48,
            fontStyle: 'normal',
            fontWeight: 400,
            letterSpacing: '-1px',
            lineHeight: '1.1em',
            textDecoration: 'none',
            textTransform: 'none',
            marginBottom: 40,
          }}
        >
          Claim your <span className="text-[#c5ed5e]">.youbuidl</span> & <span className="text-[#c5ed5e]">.givestation</span> name
        </h1>
        <p className="text-base md:text-lg text-foreground mb-10">
          Own your digital identity. Register a unique name for your project, community, or yourself on the next generation of web3.
        </p>
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row justify-center gap-2 w-full max-w-xl mx-auto relative">
          <Input
            type="text"
            placeholder="Search for a name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-gray-100 dark:bg-white/10 text-base px-4 py-3 rounded-full border border-gray-200 dark:border-white/20 focus:ring-2 focus:ring-[#c5ed5e] text-black dark:text-white shadow-sm placeholder:text-gray-400 dark:placeholder:text-blue-200 pr-12"
            disabled={isSearching}
            autoFocus
          />
          <Button
            type="submit"
            className="text-base px-6 py-3 rounded-full font-bold bg-gradient-to-r from-[#c5ed5e] to-[#60A5FA] text-[#0A1A3C] shadow-md hover:scale-105 transition-transform min-w-[120px]"
            disabled={isSearching || !searchQuery.trim()}
          >
            {isSearching ? (
              <span className="flex items-center justify-center gap-2">
                <span className="animate-spin inline-block w-5 h-5 border-2 border-t-transparent border-[#60A5FA] rounded-full"></span>
                Searching
              </span>
            ) : (
              'Search'
            )}
          </Button>
        </form>
      </section>
    </div>
  );
}
