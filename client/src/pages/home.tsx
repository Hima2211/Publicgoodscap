import { useState, useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import CategoryTabs from "@/components/projects/category-tabs";
import ProjectCard from "@/components/projects/project-card";
import ProjectTable from "@/components/projects/project-table";
import Pagination from "@/components/projects/pagination";
import { Project } from "@shared/schema";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Grid2x2Check, List } from "lucide-react";
import { ProjectCardSkeleton } from "@/components/ui/skeletons";
import { fetchGitcoinProjects } from "@/lib/gitcoin";
import { fetchKarmaProjects } from "@/lib/karma";
import { fetchGivethProjects } from "@/lib/giveth";

export default function Home() {
  const [view, setView] = useState<"cards" | "table">("cards");
  const [currentPage, setCurrentPage] = useState(1);
  const [category, setCategory] = useState("all");
  const [sortBy, setSortBy] = useState("trending");
  const [searchQuery, setSearchQuery] = useState("");
  const [useGitcoin, setUseGitcoin] = useState(false);
  const [gitcoinProjects, setGitcoinProjects] = useState<any[]>([]);
  const [gitcoinLoading, setGitcoinLoading] = useState(false);
  const [gitcoinError, setGitcoinError] = useState<string | null>(null);
  const [useKarma, setUseKarma] = useState(false);
  const [karmaProjects, setKarmaProjects] = useState<any[]>([]);
  const [karmaLoading, setKarmaLoading] = useState(false);
  const [karmaError, setKarmaError] = useState<string | null>(null);
  const [useGiveth, setUseGiveth] = useState(false);
  const [givethProjects, setGivethProjects] = useState<any[]>([]);
  const [givethLoading, setGivethLoading] = useState(false);
  const [givethError, setGivethError] = useState<string | null>(null);

  const { data: projects = [], isLoading } = useQuery<Project[]>({
    queryKey: ["/api/projects", category, sortBy, searchQuery],
  });

  // Initialize platform states based on category
  useEffect(() => {
    // Enable all platforms when viewing all projects
    if (category === 'all') {
      setUseGitcoin(true);
      setUseKarma(true);
      setUseGiveth(true);
      return;
    }

    // Enable specific platform based on category
    setUseGitcoin(category === 'gitcoin');
    setUseKarma(category === 'karma');
    setUseGiveth(category === 'giveth');
  }, [category]);

  useEffect(() => {
    let cancelled = false;
    if (!useGitcoin) return;
    if (gitcoinLoading) return; // Prevent duplicate fetches
    setGitcoinLoading(true);
    setGitcoinError(null);
    fetchGitcoinProjects({ first: 100 }) // Fetch more projects to ensure we don't miss important ones
      .then((fetched) => {
        if (!cancelled) {
          setGitcoinProjects(fetched);
          setGitcoinLoading(false);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setGitcoinError("Failed to fetch Gitcoin projects");
          setGitcoinLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [useGitcoin]);

  useEffect(() => {
    let cancelled = false;
    if (!useKarma) return;
    if (karmaLoading) return;
    setKarmaLoading(true);
    setKarmaError(null);
    fetchKarmaProjects()
      .then((fetched) => {
        if (!cancelled) {
          console.log('Karma projects fetched:', fetched); // Debug log
          setKarmaProjects(fetched);
          setKarmaLoading(false);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setKarmaError("Failed to fetch Karma projects");
          setKarmaLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [useKarma]);

  useEffect(() => {
    let cancelled = false;
    if (!useGiveth) return;
    if (givethLoading) return;
    setGivethLoading(true);
    setGivethError(null);
    fetchGivethProjects()
      .then((fetched) => {
        if (!cancelled) {
          console.log('Giveth projects fetched:', fetched);
          setGivethProjects(fetched);
          setGivethLoading(false);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setGivethError("Failed to fetch Giveth projects");
          setGivethLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [useGiveth]);

  // Calculate pagination with both local and external projects
  const projectsPerPage = 100;
  let allProjects = [...projects]; // Start with local projects

  // Add platform-specific projects
  if (useGitcoin) {
    allProjects = [...allProjects, ...gitcoinProjects.map(p => ({
      ...p,
      category: 'gitcoin' // Ensure category is set
    }))];
  }
  if (useKarma) {
    allProjects = [...allProjects, ...karmaProjects.map(p => ({
      ...p,
      category: 'karma'
    }))];
  }
  if (useGiveth) {
    allProjects = [...allProjects, ...givethProjects.map(p => ({
      ...p,
      category: 'giveth'
    }))];
  }

  // Filter projects 
  // Filter by category if it's not a platform-specific category
  if (category !== 'all' && !['gitcoin', 'giveth', 'karma'].includes(category)) {
    allProjects = allProjects.filter(p => p.category === category);
  }
  
  // Filter by search query
  if (searchQuery) {
    const query = searchQuery.toLowerCase();
    allProjects = allProjects.filter(p => 
      (p.name?.toLowerCase().includes(query) || p.description?.toLowerCase().includes(query))
    );
  }

  const totalPages = Math.ceil(allProjects.length / projectsPerPage);
  const startIndex = (currentPage - 1) * projectsPerPage;
  const endIndex = startIndex + projectsPerPage;
  const currentProjects = allProjects.slice(startIndex, endIndex);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (isLoading) {
    return (
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <ProjectCardSkeleton key={i} />
          ))}
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-2 md:px-6 pt-0.5 md:pt-6">
      <div className="mb-0 md:mb-4 px-0 md:px-0 flex flex-col md:flex-row justify-between items-start md:items-center gap-0.5 md:gap-4">
        <div className="hidden md:block">
          <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground">Public Goods Market Cap.</h1>
          <p className="text-foreground mt-0.5">Discover, track and support the ecosystem's most impactful Public goods.</p>
        </div>
        <div className="flex flex-wrap items-center gap-1 md:gap-2 px-0 md:px-0">
          <div className="relative">
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="w-full md:w-30 bg-card border-border rounded-lg h-7 md:h-8 text-xs text-foreground transition-colors duration-500">
                <SelectValue placeholder="Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Categories</SelectItem>
                <SelectItem value="gitcoin">Gitcoin</SelectItem>
                <SelectItem value="giveth">Giveth</SelectItem>
                <SelectItem value="karma">Karma</SelectItem>
                <SelectItem value="defi">DeFi</SelectItem>
                <SelectItem value="nft">NFT</SelectItem>
                <SelectItem value="dao">DAO</SelectItem>
                <SelectItem value="infrastructure">Infrastructure</SelectItem>
                <SelectItem value="public_goods">Public Goods</SelectItem>
                <SelectItem value="social">Social</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="relative">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full md:w-36 bg-card border-border rounded-lg h-7 md:h-8 text-xs text-foreground transition-colors duration-500">
                <SelectValue placeholder="Trending" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="trending">Trending</SelectItem>
                <SelectItem value="total_funding">Total Funding</SelectItem>
                <SelectItem value="recently_added">Recently Added</SelectItem>
                <SelectItem value="most_supported">Most Supported</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex border border-border rounded-lg overflow-hidden h-7 md:h-8">
            <button 
              className={`px-2 md:px-3 py-1.5 md:py-2 text-xs flex items-center gap-1 ${view === 'cards' ? 'bg-card text-foreground' : 'bg-background text-foreground'} transition-colors duration-500`}
              onClick={() => setView("cards")}
            >
              <Grid2x2Check className={`h-3.5 w-3.5 md:h-4 md:w-4 ${view === 'cards' ? 'text-primary' : 'text-darkText'}`} />
              <span className="hidden sm:inline">Cards</span>
            </button>
            <button 
              className={`px-2 md:px-3 py-1.5 md:py-2 text-xs flex items-center gap-1 ${view === 'table' ? 'bg-card text-foreground' : 'bg-background text-foreground'} transition-colors duration-500`}
              onClick={() => setView("table")}
            >
              <List className={`h-3.5 w-3.5 md:h-4 md:w-4 ${view === 'table' ? 'text-primary' : 'text-darkText'}`} />
              <span className="hidden sm:inline">Table</span>
            </button>
          </div>
        </div>
      </div>
      
      {/* Market Volume button - visible on mobile above tabs, on desktop in controls */}
      <div className="flex md:hidden justify-end mb-1 px-2">
        <div className="px-3 py-1.5 bg-darkCard rounded-lg border border-darkBorder">
                    <span className="text-sm text-foreground">{/* TODO: Insert total market funding value here, e.g. formatCurrency(totalMarketFunding) */}</span>
        </div>
      </div>
      {/* Category Tabs - Only visible on desktop, no margin, no mobile scrollbar */}
      <div className="hidden md:block">
        <div className="flex justify-end mb-2 px-4">
          <div className="px-3 py-1.5 bg-darkCard rounded-lg border border-darkBorder">
            <span className="text-xs text-darkText">Market Volume: </span>
            <span className="text-sm text-foreground">{/* TODO: Insert total market funding value here, e.g. formatCurrency(totalMarketFunding) */}</span>
          </div>
        </div>
        <CategoryTabs activeCategory={category} onCategoryChange={setCategory} />
      </div>
      {/* Projects Display */}
      <>
        {/* Card View */}
        {view === "cards" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {gitcoinError && category === 'gitcoin' && (
              <div className="col-span-full py-12 text-center text-red-500">{String(gitcoinError)}</div>
            )}
            {givethError && category === 'giveth' && (
              <div className="col-span-full py-12 text-center text-red-500">{String(givethError)}</div>
            )}
            {karmaError && category === 'karma' && (
              <div className="col-span-full py-12 text-center text-red-500">{String(karmaError)}</div>
            )}
            {currentProjects.map((project: Project) => (
              <ProjectCard key={project.id || `project-${Date.now()}`} project={project} />
            ))}
            
            {currentProjects.length === 0 && (
              <div className="col-span-full py-12 text-center">
                <p className="text-darkText">No projects found matching your criteria.</p>
              </div>
            )}
          </div>
        )}
        
        {/* Table View */}
        {view === "table" && (
          <ProjectTable projects={currentProjects} />
        )}
        
        {/* Pagination */}
        {allProjects.length > 0 && (
          <Pagination 
            currentPage={currentPage} 
            totalPages={totalPages} 
            onPageChange={handlePageChange} 
          />
        )}
      </>
    </main>
  );
}
