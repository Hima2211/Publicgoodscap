import { Link, useLocation } from "wouter";
import { Home, User, Trophy, TagsIcon, BookText } from "lucide-react";

export default function Footer() {
  const [location] = useLocation();

  const navItems = [
    { label: "Discover", href: "/", icon: Home },
    { label: "Names", href: "/names", icon: TagsIcon },
    { label: "Board", href: "/leaderboard", icon: Trophy },
    { label: "Learn", href: "/learn", icon: BookText },
    { label: "Profile", href: "/profile", icon: User },
  ];

  return (
    <>
      {/* Mobile Navigation Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border md:hidden z-50">
        <nav className="px-4 py-2">
          <ul className="flex items-center justify-between">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location === item.href;
              
              return (
                <li key={item.href}>
                  <Link href={item.href}>
                    <a className="flex flex-col items-center p-2">
                      <Icon 
                        className={`h-5 w-5 mb-1 transition-colors duration-200 ${
                          isActive ? 'text-accent' : 'text-muted-foreground'
                        }`}
                      />
                      <span className={`text-[10px] font-medium transition-colors duration-200 ${
                        isActive ? 'text-accent' : 'text-muted-foreground'
                      }`}>
                        {item.label}
                      </span>
                    </a>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>

      {/* Desktop Footer */}
      <footer className="bg-card border-t border-border py-4 mt-12 hidden md:block transition-colors duration-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
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
              <span className="ml-2 text-xl font-bold text-white">youBuidl</span>
            </div>
            
            <div className="flex flex-wrap justify-center space-x-4 text-xs">
              <Link href="/terms" className="text-darkText font-normal hover:text-white transition-colors">Terms</Link>
              <Link href="/privacy" className="text-darkText font-normal hover:text-white transition-colors">Privacy</Link>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-darkText font-normal hover:text-white transition-colors">Twitter</a>
              <a href="https://discord.com" target="_blank" rel="noopener noreferrer" className="text-darkText font-normal hover:text-white transition-colors">Discord</a>
            </div>
            
            <p className="text-xs text-darkText font-normal mt-4 md:mt-0">© {new Date().getFullYear()} GiveStation.</p>
          </div>
        </div>
      </footer>
    </>
  );
}
