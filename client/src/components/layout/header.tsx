import React, { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Sun, Moon, Grid2x2Check, List, Compass, Trophy, BookOpen, User, Rocket } from "lucide-react";
import { useTheme } from "next-themes";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { useAuth } from "@/lib/auth";

interface HeaderProps {
  onCategoryChange?: (category: string) => void;
  onSearchQuery?: (query: string) => void;
}

function getAvatarUrl(seed?: string) {
  // Use the provided seed or a random one
  const finalSeed = seed || Math.random().toString(36).substring(7);
  return `https://api.dicebear.com/7.x/personas/svg?seed=${finalSeed}&backgroundColor=b6e3f4`;
}

export default function Header({
  onCategoryChange,
  onSearchQuery,
}: HeaderProps) {
  const [location] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [showSocials, setShowSocials] = useState(false);
  const [githubRepoCount, setGithubRepoCount] = useState<number | null>(null);
  const [project, setProject] = useState<{ totalFunding: number } | null>(null);

  const { address, isConnected } = useAccount();
  const avatarUrl = React.useMemo(() => getAvatarUrl(address), [address]);
  const { connectAsync, connectors, isPending } = useConnect();
  const { disconnectAsync } = useDisconnect();

  const handleConnect = async () => {
    try {
      const connector = connectors[0]; // WalletConnect connector
      if (connector) {
        // Add timeout and retry logic
        const timeout = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Connection timeout')), 15000)
        );
        
        try {
          await Promise.race([
            connectAsync({ 
              connector,
              chainId: 1 // Specify mainnet to reduce initial connection overhead
            }),
            timeout
          ]);
        } catch (error: any) {
          if (error.message === 'Connection timeout') {
            console.error('Connection timed out. Please try again.');
            return;
          }
          throw error;
        }
      }
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    }
  };

  const handleDisconnect = async () => {
    try {
      const timeout = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Disconnect timeout')), 5000)
      );
      
      try {
        await Promise.race([
          disconnectAsync(),
          timeout
        ]);
      } catch (error: any) {
        if (error.message === 'Disconnect timeout') {
          // Force disconnect on timeout
          await disconnectAsync().catch(() => {});
          return;
        }
        throw error;
      }
    } catch (error) {
      console.error('Failed to disconnect wallet:', error);
    }
  };

  // Only access theme client-side to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // Fetch GitHub repo count for youBuidl (replace with actual org/repo if needed)
    fetch('https://api.github.com/orgs/youBuidl/repos?per_page=1')
      .then((res) => {
        const total = res.headers.get('Link')?.match(/&page=(\d+)>; rel="last"/);
        if (total && total[1]) {
          setGithubRepoCount(Number(total[1]));
        } else {
          // fallback: count from first page
          return res.json().then((data) => setGithubRepoCount(Array.isArray(data) ? data.length : null));
        }
      })
      .catch(() => setGithubRepoCount(null));
  }, []);

  useEffect(() => {
    // Mock funding data fetch
    // In real scenarios, fetch from your API endpoint
    const mockFundingData = {
      totalFunding: 65560000, // Example funding amount
    };
    setProject(mockFundingData);
  }, []);

  const navItems = [
    { label: "Discover", href: "/" },
    { label: "YouBuidl Names", href: "/names" },
    { label: "Leaderboard", href: "/leaderboard" },
    { label: "Learn", href: "/learn" },
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

  // Wallet connection state is handled by useAccount, useConnect, and useDisconnect hooks
  // defined at the top of the component

  return (
    <header className="bg-background border-b border-border sticky top-0 z-50 transition-colors duration-500">
      {/* Mobile header */}
      <div className="md:hidden">
        {/* Logo and theme toggle */}
        <div className="flex items-center justify-between py-2 px-3 bg-background border-b border-border text-xs transition-colors duration-500">
          <Link href="/" className="flex items-center">
            <svg
              width="32"
              height="32"
              viewBox="0 0 360 360"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect width="360" height="359.999" rx="55" fill="#CDEB63" />
              <ellipse cx="72.9444" cy="57.6796" rx="12.9444" ry="12.4902" fill="#262626" />
              <ellipse cx="107.81" cy="57.2414" rx="12.4903" ry="12.052" fill="#262626" />
              <ellipse cx="142.68" cy="57.391" rx="12.6453" ry="12.2016" fill="#262626" />
              <path d="M148.401 61.5605C148.447 61.6171 148.469 61.6965 148.469 61.7985C148.469 61.9005 148.43 61.9911 148.35 62.0705C148.271 62.1498 148.175 62.1895 148.061 62.1895H144.797C144.593 62.1895 144.423 62.0931 144.287 61.9005L143.165 60.2515L141.992 61.9005C141.868 62.0931 141.698 62.1895 141.482 62.1895H138.303C138.19 62.1895 138.094 62.1498 138.014 62.0705C137.935 61.9911 137.895 61.9005 137.895 61.7985C137.895 61.6965 137.918 61.6171 137.963 61.5605L140.717 57.6335L138.269 53.9785C138.224 53.9105 138.201 53.8311 138.201 53.7405C138.201 53.6385 138.241 53.5478 138.32 53.4685C138.4 53.3891 138.496 53.3495 138.609 53.3495H141.72C141.936 53.3495 142.117 53.4571 142.264 53.6725L143.25 55.1855L144.236 53.6725C144.384 53.4571 144.565 53.3495 144.78 53.3495H147.755C147.869 53.3495 147.965 53.3891 148.044 53.4685C148.124 53.5478 148.163 53.6385 148.163 53.7405C148.163 53.8311 148.141 53.9105 148.095 53.9785L145.596 57.6165L148.401 61.5605Z" fill="#FFFCFC" />
              <path d="M69.7554 55.3H76.8154C76.9621 55.3 77.0887 55.3533 77.1954 55.46C77.3021 55.5667 77.3554 55.6933 77.3554 55.84V58.68C77.3554 58.8267 77.3021 58.9533 77.1954 59.06C77.0887 59.1667 76.9621 59.22 76.8154 59.22H69.7554C69.6087 59.22 69.4821 59.1667 69.3754 59.06C69.2687 58.9533 69.2154 58.8267 69.2154 58.68V55.84C69.2154 55.6933 69.2687 55.5667 69.3754 55.46C69.4821 55.3533 69.6087 55.3 69.7554 55.3Z" fill="white" />
              <rect x="102.074" y="53.8447" width="7.93217" height="8.12102" fill="white" />
              <rect x="104.214" y="51.9163" width="7.93217" height="8.12102" fill="white" />
              <path d="M80.5 287V276.75H90.75V287H80.5ZM80.5 297.25H70.25V287H80.5V297.25ZM70.25 297.25V307.5H60V297.25H70.25ZM70.25 317.75V307.5H80.5V317.75H70.25ZM80.5 317.75H90.75V328H80.5V317.75ZM111.25 297.25V276.75H121.5V297.25H111.25ZM111.25 328H101V297.25H111.25V328ZM131.75 287V276.75H142V287H131.75ZM142 297.25V287H152.25V297.25H142ZM152.25 297.25H162.5V307.5H152.25V297.25ZM152.25 317.75H142V307.5H152.25V317.75ZM142 317.75V328H131.75V317.75H142Z" fill="#070707" />
            </svg>
            <span className="ml-1 text-sm font-bold text-foreground">youBuidl</span>
          </Link>

          <div className="flex items-center space-x-2">
            {isConnected ? (
                <Button
                  variant="default"
                  size="sm"
                  className="h-6 text-xs bg-accent hover:bg-accent/90 text-darkBg font-medium relative"
                  onClick={() => handleDisconnect()}
                  disabled={isPending}
                >
                  {isPending ? (
                    <>
                      <span className="opacity-0">Disconnect</span>
                      <span className="absolute inset-0 flex items-center justify-center">
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                      </span>
                    </>
                  ) : 'Disconnect'}
                </Button>
              ) : (
                <Button
                  variant="default"
                  size="sm"
                  className="h-6 text-xs bg-accent hover:bg-accent/90 text-darkBg font-medium relative"
                  onClick={() => handleConnect()}
                  disabled={isPending}
                >
                  {isPending ? (
                    <>
                      <span className="opacity-0">Connect Wallet</span>
                      <span className="absolute inset-0 flex items-center justify-center">
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                      </span>
                    </>
                  ) : 'Connect Wallet'}
                </Button>
              )}

            <Link href="/launchpad">
              <Button
                variant="ghost"
                size="icon"
                className={`h-6 w-6 rounded-full border border-border shadow transition-all duration-300 focus:ring-2 focus:ring-accent/60 bg-card hover:bg-muted overflow-hidden`}
                aria-label="Launchpad"
              >
                <img 
                  src={`https://api.dicebear.com/7.x/personas/svg?seed=${address || 'default'}&backgroundColor=b6e3f4`}
                  alt="Profile Avatar"
                  className="w-full h-full object-cover rounded-full"
                />
              </Button>
            </Link>

            <Button
              variant="ghost"
              size="icon"
              className={`h-6 w-6 rounded-full border border-border shadow transition-all duration-300 focus:ring-2 focus:ring-accent/60 bg-card hover:bg-muted`}
              aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              {mounted &&
                (theme === "dark" ? (
                  <Sun className="h-3 w-3 text-accent transition-transform duration-300 rotate-0 scale-100" />
                ) : (
                  <Moon className="h-3 w-3 text-accent transition-transform duration-300 rotate-0 scale-100" />
                ))}
            </Button>
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
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 360 360"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect width="360" height="359.999" rx="55" fill="#CDEB63" />
                  <ellipse cx="72.9444" cy="57.6796" rx="12.9444" ry="12.4902" fill="#262626" />
                  <ellipse cx="107.81" cy="57.2414" rx="12.4903" ry="12.052" fill="#262626" />
                  <ellipse cx="142.68" cy="57.391" rx="12.6453" ry="12.2016" fill="#262626" />
                  <path d="M148.401 61.5605C148.447 61.6171 148.469 61.6965 148.469 61.7985C148.469 61.9005 148.43 61.9911 148.35 62.0705C148.271 62.1498 148.175 62.1895 148.061 62.1895H144.797C144.593 62.1895 144.423 62.0931 144.287 61.9005L143.165 60.2515L141.992 61.9005C141.868 62.0931 141.698 62.1895 141.482 62.1895H138.303C138.19 62.1895 138.094 62.1498 138.014 62.0705C137.935 61.9911 137.895 61.9005 137.895 61.7985C137.895 61.6965 137.918 61.6171 137.963 61.5605L140.717 57.6335L138.269 53.9785C138.224 53.9105 138.201 53.8311 138.201 53.7405C138.201 53.6385 138.241 53.5478 138.32 53.4685C138.4 53.3891 138.496 53.3495 138.609 53.3495H141.72C141.936 53.3495 142.117 53.4571 142.264 53.6725L143.25 55.1855L144.236 53.6725C144.384 53.4571 144.565 53.3495 144.78 53.3495H147.755C147.869 53.3495 147.965 53.3891 148.044 53.4685C148.124 53.5478 148.163 53.6385 148.163 53.7405C148.163 53.8311 148.141 53.9105 148.095 53.9785L145.596 57.6165L148.401 61.5605Z" fill="#FFFCFC" />
                  <path d="M69.7554 55.3H76.8154C76.9621 55.3 77.0887 55.3533 77.1954 55.46C77.3021 55.5667 77.3554 55.6933 77.3554 55.84V58.68C77.3554 58.8267 77.3021 58.9533 77.1954 59.06C77.0887 59.1667 76.9621 59.22 76.8154 59.22H69.7554C69.6087 59.22 69.4821 59.1667 69.3754 59.06C69.2687 58.9533 69.2154 58.8267 69.2154 58.68V55.84C69.2154 55.6933 69.2687 55.5667 69.3754 55.46C69.4821 55.3533 69.6087 55.3 69.7554 55.3Z" fill="white" />
                  <rect x="102.074" y="53.8447" width="7.93217" height="8.12102" fill="white" />
                  <rect x="104.214" y="51.9163" width="7.93217" height="8.12102" fill="white" />
                  <path d="M80.5 287V276.75H90.75V287H80.5ZM80.5 297.25H70.25V287H80.5V297.25ZM70.25 297.25V307.5H60V297.25H70.25ZM70.25 317.75V307.5H80.5V317.75H70.25ZM80.5 317.75H90.75V328H80.5V317.75ZM111.25 297.25V276.75H121.5V297.25H111.25ZM111.25 328H101V297.25H111.25V328ZM131.75 287V276.75H142V287H131.75ZM142 297.25V287H152.25V297.25H142ZM152.25 297.25H162.5V307.5H152.25V297.25ZM152.25 317.75H142V307.5H152.25V317.75ZM142 317.75V328H131.75V317.75H142Z" fill="#070707" />
                </svg>
                <span className="ml-1 text-sm font-bold text-foreground">youBuidl</span>
              </Link>
              <nav className="hidden md:flex items-center space-x-8">
                {/* Desktop navigation items */}
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`text-sm font-medium transition-colors duration-200 hover:text-accent ${
                      location === item.href ? "text-accent" : "text-foreground"
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
                {/* Socials Dropdown */}
                <div className="relative">
                  <button
                    className="text-sm font-normal text-darkText hover:text-white transition-colors flex items-center focus:outline-none"
                    onClick={() => setShowSocials((v) => !v)}
                    onBlur={() => setTimeout(() => setShowSocials(false), 150)}
                    type="button"
                  >
                    Socials
                    <svg className="ml-1 w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                  </button>
                  {showSocials && (
                    <div className="absolute right-0 mt-2 w-40 bg-card border border-border rounded shadow-lg z-50 animate-fade-in">
                      <a
                        href="https://twitter.com/youBuidl"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block px-4 py-2 text-sm text-darkText hover:bg-accent/10 hover:text-accent transition-colors"
                      >
                        <span className="inline-block mr-2 align-middle">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M22.46 5.924c-.793.352-1.646.59-2.542.698a4.48 4.48 0 0 0 1.965-2.475 8.94 8.94 0 0 1-2.828 1.082A4.48 4.48 0 0 0 16.11 4c-2.48 0-4.49 2.01-4.49 4.49 0 .352.04.695.116 1.022C7.728 9.36 4.1 7.57 1.67 4.95c-.387.664-.61 1.437-.61 2.26 0 1.56.794 2.94 2.003 3.75-.737-.023-1.43-.226-2.037-.563v.057c0 2.18 1.55 4 3.61 4.42-.377.103-.775.158-1.185.158-.29 0-.57-.028-.845-.08.57 1.78 2.23 3.08 4.2 3.12A8.98 8.98 0 0 1 2 19.54c-.65 0-1.29-.038-1.92-.112A12.7 12.7 0 0 0 7.29 21.5c8.39 0 12.98-6.95 12.98-12.98 0-.198-.004-.395-.013-.59A9.3 9.3 0 0 0 24 4.59a8.98 8.98 0 0 1-2.54.69z"/></svg>
                        </span>
                        Twitter
                      </a>
                      <a
                        href="https://discord.gg/youBuidl"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block px-4 py-2 text-sm text-darkText hover:bg-accent/10 hover:text-accent transition-colors"
                      >
                        <span className="inline-block mr-2 align-middle">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M20.317 4.369A19.791 19.791 0 0 0 16.885 3.2a.112.112 0 0 0-.119.056c-.523.927-1.104 2.13-1.513 3.084a17.978 17.978 0 0 0-5.505 0c-.409-.954-.99-2.157-1.513-3.084a.112.112 0 0 0-.119-.056A19.791 19.791 0 0 0 3.683 4.369a.105.105 0 0 0-.047.043C.533 9.04-.32 13.579.099 18.057a.112.112 0 0 0 .042.078c2.104 1.547 4.13 2.488 6.102 3.104a.112.112 0 0 0 .123-.041c.47-.65.888-1.34 1.247-2.062a.112.112 0 0 0-.061-.155c-.662-.25-1.293-.548-1.902-.892a.112.112 0 0 1-.011-.188c.128-.096.256-.192.382-.29a.112.112 0 0 1 .115-.01c4.005 1.83 8.317 1.83 12.299 0a.112.112 0 0 1 .116.01c.126.098.254.194.382.29a.112.112 0 0 1-.011.188c-.609.344-1.24.642-1.902.892a.112.112 0 0 0-.061.155c.359.722.777 1.412 1.247 2.062a.112.112 0 0 0 .123.041c1.972-.616 3.998-1.557 6.102-3.104a.112.112 0 0 0 .042-.078c.5-5.177-.838-9.684-3.537-13.645a.105.105 0 0 0-.047-.043zM8.02 15.331c-1.183 0-2.156-1.085-2.156-2.419 0-1.333.955-2.418 2.156-2.418 1.21 0 2.174 1.094 2.156 2.418 0 1.334-.955 2.419-2.156 2.419zm7.96 0c-1.183 0-2.156-1.085-2.156-2.419 0-1.333.955-2.418 2.156-2.418 1.21 0 2.174 1.094 2.156 2.418 0 1.334-.955 2.419-2.156 2.419z"/></svg>
                        </span>
                        Discord
                      </a>
                    </div>
                  )}
                </div>
                {/* GitHub Repo Count */}
                <a
                  href="https://github.com/youBuidl"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-2 flex items-center px-2 py-1 bg-card border border-border rounded text-sm font-medium text-foreground hover:text-accent transition-colors"
                  title="GitHub Repos"
                >
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24"><path d="M12 .5C5.73.5.5 5.73.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56 0-.28-.01-1.02-.02-2-3.2.7-3.88-1.54-3.88-1.54-.53-1.34-1.3-1.7-1.3-1.7-1.06-.72.08-.71.08-.71 1.17.08 1.78 1.2 1.78 1.2 1.04 1.78 2.73 1.27 3.4.97.11-.75.41-1.27.74-1.56-2.56-.29-5.26-1.28-5.26-5.7 0-1.26.45-2.29 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11.1 11.1 0 0 1 2.9-.39c.98.01 1.97.13 2.9.39 2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.8 1.19 1.83 1.19 3.09 0 4.43-2.7 5.41-5.27 5.7.42.36.79 1.09.79 2.2 0 1.59-.01 2.87-.01 3.26 0 .31.21.68.8.56C20.71 21.39 24 17.08 24 12c0-6.27-5.23-11.5-12-11.5z"/></svg>
                  {githubRepoCount !== null ? (
                    <span className="font-bold">{githubRepoCount}</span>
                  ) : (
                    <span className="font-bold">--</span>
                  )}
                </a>
              </nav>
            </div>

            {/* Right section with search and actions */}
            <div className="flex items-center space-x-4">
              <form onSubmit={handleSearch} className="hidden md:flex items-center">
                <Input
                  type="search"
                  placeholder="Search..."
                  className="w-64 h-8"
                  value={searchQuery}
                  onChange={handleSearchChange}
                />
              </form>

              
            
              <Button
                variant="outline"
                className="border-border hover:bg-card"
              >
                Submit Project
              </Button>
              

              {isConnected ? (
                <Button
                  variant="ghost"
                  size="sm"
                  className="rounded-full bg-accent/10 hover:bg-accent/20 text-accent"
                  onClick={() => handleDisconnect()}
                  disabled={isPending}
                >
                  {isPending ? 'Disconnecting...' : 'Disconnect'}
                </Button>
              ) : (
                <Button
                  variant="ghost"
                  size="sm"
                  className="rounded-full bg-accent/10 hover:bg-accent/20 text-accent"
                  onClick={() => handleConnect()}
                  disabled={isPending}
                >
                  {isPending ? 'Connecting...' : 'Connect Wallet'}
                </Button>
              )}

              <Button
                variant="ghost"
                size="icon"
                className={`rounded-full border border-border shadow transition-all duration-300 focus:ring-2 focus:ring-accent/60 bg-card hover:bg-muted`}
                aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              >
                {mounted &&
                  (theme === "dark" ? (
                    <Sun className="h-4 w-4 text-accent transition-transform duration-300 rotate-0 scale-100" />
                  ) : (
                    <Moon className="h-4 w-4 text-accent transition-transform duration-300 rotate-0 scale-100" />
                  ))}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}