import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="bg-darkCard border-t border-darkBorder py-8 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-white font-display font-bold text-lg mb-4">BuidlMarketCap</h3>
            <p className="text-darkText text-sm">Discover and support the ecosystem's most impactful projects building the decentralized future.</p>
          </div>
          
          <div>
            <h4 className="text-white font-medium mb-4">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/docs" className="text-darkText hover:text-white transition-colors">Documentation</Link></li>
              <li><Link href="/funding" className="text-darkText hover:text-white transition-colors">Funding Rounds</Link></li>
              <li><Link href="/submit" className="text-darkText hover:text-white transition-colors">Submit Project</Link></li>
              <li><Link href="/api" className="text-darkText hover:text-white transition-colors">API</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-medium mb-4">Community</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-darkText hover:text-white transition-colors">Twitter</a></li>
              <li><a href="https://discord.com" target="_blank" rel="noopener noreferrer" className="text-darkText hover:text-white transition-colors">Discord</a></li>
              <li><a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-darkText hover:text-white transition-colors">GitHub</a></li>
              <li><a href="/blog" className="text-darkText hover:text-white transition-colors">Blog</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-medium mb-4">Subscribe to Updates</h4>
            <form className="flex" onSubmit={(e) => e.preventDefault()}>
              <Input 
                type="email" 
                placeholder="Enter your email" 
                className="bg-darkBg border-darkBorder rounded-l-lg" 
              />
              <Button type="submit" className="bg-primary hover:bg-opacity-90 text-white rounded-l-none">
                Subscribe
              </Button>
            </form>
            <p className="text-xs text-darkText mt-2">Get the latest updates about new projects and funding rounds.</p>
          </div>
        </div>
        
        <div className="mt-8 pt-6 border-t border-darkBorder flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-darkText mb-4 md:mb-0">© {new Date().getFullYear()} BuidlMarketCap. All rights reserved.</p>
          <div className="flex space-x-4">
            <Link href="/terms" className="text-darkText hover:text-white transition-colors">Terms</Link>
            <Link href="/privacy" className="text-darkText hover:text-white transition-colors">Privacy</Link>
            <Link href="/cookies" className="text-darkText hover:text-white transition-colors">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
