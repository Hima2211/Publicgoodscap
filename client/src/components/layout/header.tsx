import { useState, useEffect } from "react";
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
import { Search, Sun, Moon, Grid2x2Check, List } from "lucide-react";
import { useTheme } from "next-themes";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { WalletConnect } from "wagmi/connectors";

interface HeaderProps {
  onCategoryChange?: (category: string) => void;
  onSearchQuery?: (query: string) => void;
}

const walletConnect = (projectId: string) =>
  new WalletConnect({
    projectId,
  });

export default function Header({
  onCategoryChange,
  onSearchQuery,
}: HeaderProps) {
  const [location] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Only access theme client-side to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  const navItems = [
    { label: "Discover", href: "/" },
    { label: "Categories", href: "/categories" },
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

  return (
    <header className="bg-darkBg border-b border-darkBorder sticky top-0 z-50">
      {/* Mobile header */}
      <div className="md:hidden">
        {/* Logo and theme toggle */}
        <div className="flex items-center justify-between py-2 px-3 bg-darkBg border-b border-darkBorder text-xs">
          <Link href="/" className="flex items-center">
            <svg
              width="32"
              height="32"
              viewBox="0 0 360 360"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect width="360" height="359.999" rx="55" fill="#CDEB63" />
              <ellipse
                cx="72.9444"
                cy="57.6796"
                rx="12.9444"
                ry="12.4902"
                fill="#262626"
              />
              <ellipse
                cx="107.81"
                cy="57.2414"
                rx="12.4903"
                ry="12.052"
                fill="#262626"
              />
              <ellipse
                cx="142.68"
                cy="57.391"
                rx="12.6453"
                ry="12.2016"
                fill="#262626"
              />
              <path
                d="M148.401 61.5605C148.447 61.6171 148.469 61.6965 148.469 61.7985C148.469 61.9005 148.43 61.9911 148.35 62.0705C148.271 62.1498 148.175 62.1895 148.061 62.1895H144.797C144.593 62.1895 144.423 62.0931 144.287 61.9005L143.165 60.2515L141.992 61.9005C141.868 62.0931 141.698 62.1895 141.482 62.1895H138.303C138.19 62.1895 138.094 62.1498 138.014 62.0705C137.935 61.9911 137.895 61.9005 137.895 61.7985C137.895 61.6965 137.918 61.6171 137.963 61.5605L140.717 57.6335L138.269 53.9785C138.224 53.9105 138.201 53.8311 138.201 53.7405C138.201 53.6385 138.241 53.5478 138.32 53.4685C138.4 53.3891 138.496 53.3495 138.609 53.3495H141.72C141.936 53.3495 142.117 53.4571 142.264 53.6725L143.25 55.1855L144.236 53.6725C144.384 53.4571 144.565 53.3495 144.78 53.3495H147.755C147.869 53.3495 147.965 53.3891 148.044 53.4685C148.124 53.5478 148.163 53.6385 148.163 53.7405C148.163 53.8311 148.141 53.9105 148.095 53.9785L145.596 57.6165L148.401 61.5605Z"
                fill="#FFFCFC"
              />
              <path
                d="M69.7554 55.3H76.8154C76.9621 55.3 77.0887 55.3533 77.1954 55.46C77.3021 55.5667 77.3554 55.6933 77.3554 55.84V58.68C77.3554 58.8267 77.3021 58.9533 77.1954 59.06C77.0887 59.1667 76.9621 59.22 76.8154 59.22H69.7554C69.6087 59.22 69.4821 59.1667 69.3754 59.06C69.2687 58.9533 69.2154 58.8267 69.2154 58.68V55.84C69.2154 55.6933 69.2687 55.5667 69.3754 55.46C69.4821 55.3533 69.6087 55.3 69.7554 55.3Z"
                fill="white"
              />
              <rect
                x="102.074"
                y="53.8447"
                width="7.93217"
                height="8.12102"
                fill="white"
              />
              <rect
                x="104.214"
                y="51.9163"
                width="7.93217"
                height="8.12102"
                fill="white"
              />
              <path
                d="M80.5 287V276.75H90.75V287H80.5ZM80.5 297.25H70.25V287H80.5V297.25ZM70.25 297.25V307.5H60V297.25H70.25ZM70.25 317.75V307.5H80.5V317.75H70.25ZM80.5 317.75H90.75V328H80.5V317.75ZM111.25 297.25V276.75H121.5V297.25H111.25ZM111.25 328H101V297.25H111.25V328ZM131.75 287V276.75H142V287H131.75ZM142 297.25V287H152.25V297.25H142ZM152.25 297.25H162.5V307.5H152.25V297.25ZM152.25 317.75H142V307.5H152.25V317.75ZM142 317.75V328H131.75V317.75H142Z"
                fill="#070707"
              />
            </svg>
            <span className="ml-1 text-sm font-bold text-white">youBuidl</span>
          </Link>

          <div className="flex items-center space-x-2">
            {useAccount().isConnected ? (
              <Button
                variant="default"
                size="sm"
                className="h-6 text-xs bg-accent hover:bg-accent/90 text-darkBg font-medium"
                onClick={() => useDisconnect().disconnect()}
              >
                Disconnect
              </Button>
            ) : (
              <Button
                variant="default"
                size="sm"
                className="h-6 text-xs bg-accent hover:bg-accent/90 text-darkBg font-medium"
                onClick={() =>
                  useConnect().connect({
                    connector: walletConnect("37b5e2fccd46c838885f41186745251e"),
                  })
                }
              >
                Connect Wallet
              </Button>
            )}

            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 rounded-full"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              {mounted &&
                (theme === "dark" ? (
                  <Sun className="h-3 w-3 text-accent" />
                ) : (
                  <Moon className="h-3 w-3 text-accent" />
                ))}
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
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 360 360"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect width="360" height="359.999" rx="55" fill="#CDEB63" />
                  <ellipse
                    cx="72.9444"
                    cy="57.6796"
                    rx="12.9444"
                    ry="12.4902"
                    fill="#262626"
                  />
                  <ellipse
                    cx="107.81"
                    cy="57.2414"
                    rx="12.4903"
                    ry="12.052"
                    fill="#262626"
                  />
                  <ellipse
                    cx="142.68"
                    cy="57.391"
                    rx="12.6453"
                    ry="12.2016"
                    fill="#262626"
                  />
                  <path
                    d="M148.401 61.5605C148.447 61.6171 148.469 61.6965 148.469 61.7985C148.469 61.9005 148.43 61.9911 148.35 62.0705C148.271 62.1498 148.175 62.1895 148.061 62.1895H144.797C144.593 62.1895 144.423 62.0931 144.287 61.9005L143.165 60.2515L141.992 61.9005C141.868 62.0931 141.698 62.1895 141.482 62.1895H138.303C138.19 62.1895 138.094 62.1498 138.014 62.0705C137.935 61.9911 137.895 61.9005 137.895 61.7985C137.895 61.6965 137.918 61.6171 137.963 61.5605L140.717 57.6335L138.269 53.9785C138.224 53.9105 138.201 53.8311 138.201 53.7405C138.201 53.6385 138.241 53.5478 138.32 53.4685C138.4 53.3891 138.496 53.3495 138.609 53.3495H141.72C141.936 53.3495 142.117 53.4571 142.264 53.6725L143.25 55.1855L144.236 53.6725C144.384 53.4571 144.565 53.3495 144.78 53.3495H147.755C147.869 53.3495 147.965 53.3891 148.044 53.4685C148.124 53.5478 148.163 53.6385 148.163 53.7405C148.163 53.8311 148.141 53.9105 148.095 53.9785L145.596 57.6165L148.401 61.5605Z"
                    fill="#FFFCFC"
                  />
                  <path
                    d="M69.7554 55.3H76.8154C76.9621 55.3 77.0887 55.3533 77.1954 55.46C77.3021 55.5667 77.3554 55.6933 77.3554 55.84V58.68C77.3554 58.8267 77.3021 58.9533 77.1954 59.06C77.0887 59.1667 76.9621 59.22 76.8154 59.22H69.7554C69.6087 59.22 69.4821 59.1667 69.3754 59.06C69.2687 58.9533 69.2154 58.8267 69.2154 58.68V55.84C69.2154 55.6933 69.2687 55.5667 69.3754 55.46C69.4821 55.3533 69.6087 55.3 69.7554 55.3Z"
                    fill="white"
                  />
                  <rect
                    x="102.074"
                    y="53.8447"
                    width="7.93217"
                    height="8.12102"
                    fill="white"
                  />
                  <rect
                    x="104.214"
                    y="51.9163"
                    width="7.93217"
                    height="8.12102"
                    fill="white"
                  />
                  <path
                    d="M80.5 287V276.75H90.75V287H80.5ZM80.5 297.25H70.25V287H80.5V297.25ZM70.25 297.25V307.5H60V297.25H70.25ZM70.25 317.75V307.5H80.5V317.75H70.25ZM80.5 317.75H90.75V328H80.5V317.75ZM111.25 297.25V276.75H121.5V297.25H111.25ZM111.25 328H101V297.25H111.25V328ZM131.75 287V276.75H142V287H131.75ZM142 297.25V287H152.25V297.25H142ZM152.25 297.25H162.5V307.5H152.25V297.25ZM152.25 317.75H142V307.5H152.25V317.75ZM142 317.75V328H131.75V317.75H142Z"
                    fill="#070707"
                  />
                </svg>
                <span className="ml-2 text-xl font-bold text-white">
                  youBuidl
                </span>
              </Link>

              <nav className="flex space-x-4">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`text-sm font-medium ${
                      location === item.href
                        ? "text-accent"
                        : "text-darkText hover:text-white"
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

              <Link href="/submit">
                <Button
                  variant="outline"
                  className="border-border hover:bg-darkCard"
                >
                  Submit Project
                </Button>
              </Link>

              {useAccount().isConnected ? (
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full"
                  onClick={() => useDisconnect().disconnect()}
                >
                  Disconnect
                </Button>
              ) : (
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full"
                  onClick={() =>
                    useConnect().connect({
                      connector: walletConnect({
                        options: {
                          projectId: "37b5e2fccd46c838885f41186745251e",
                        },
                      }),
                    })
                  }
                >
                  Connect
                </Button>
              )}

              <Button
                variant="ghost"
                size="icon"
                className="rounded-full"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              >
                {mounted &&
                  (theme === "dark" ? (
                    <Sun className="h-4 w-4 text-accent" />
                  ) : (
                    <Moon className="h-4 w-4 text-accent" />
                  ))}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
