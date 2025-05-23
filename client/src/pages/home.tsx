import { useState, useEffect } from "react";
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

  const { data: projects = [], isLoading } = useQuery<Project[]>({
    queryKey: ["/api/projects", category, sortBy, searchQuery],
  });

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

  // Calculate pagination
  const projectsPerPage = 100; // Match store's PROJECTS_PER_PAGE
  let allProjects = [...projects];
  if (useGitcoin) {
    allProjects = [...allProjects, ...gitcoinProjects];
  }
  if (useKarma) {
    allProjects = [...allProjects, ...karmaProjects];
  }
  
  // Filter by category if needed
  if (category !== 'all') {
    allProjects = allProjects.filter(p => p.category === category);
  }
  
  // Filter by search query if present
  if (searchQuery) {
    const query = searchQuery.toLowerCase();
    allProjects = allProjects.filter(p => 
      p.name.toLowerCase().includes(query) || 
      p.description.toLowerCase().includes(query)
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
        <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="hidden md:block">
            <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground">Public Goods Market Cap.</h1>
            <p className="text-foreground mt-1">Discover, track and support the ecosystem's most impactful Public goods.</p>
          </div>
          
          <div className="flex flex-wrap items-center gap-2 opacity-50">
            <CategoryTabs activeCategory={category} onCategoryChange={setCategory} />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <ProjectCardSkeleton key={i} />
          ))}
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* View Controls & Filters */}
      <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="hidden md:block">
          <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground">Public Goods Market Cap.</h1>
          <p className="text-foreground mt-1">Discover, track and support the ecosystem's most impactful Public goods.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="w-full md:w-32 bg-card border-border rounded-lg h-8 text-xs text-foreground transition-colors duration-500">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
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
              <SelectTrigger className="w-full md:w-36 bg-card border-border rounded-lg h-8 text-xs text-foreground transition-colors duration-500">
                <SelectValue placeholder="Sort by: Trending" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="trending">Sort by: Trending</SelectItem>
                <SelectItem value="total_funding">Total Funding</SelectItem>
                <SelectItem value="recently_added">Recently Added</SelectItem>
                <SelectItem value="most_supported">Most Supported</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex border border-border rounded-lg overflow-hidden">
            <button 
              className={`px-3 py-2 text-sm flex items-center gap-1 ${view === 'cards' ? 'bg-card text-foreground' : 'bg-background text-foreground'} transition-colors duration-500`}
              onClick={() => setView("cards")}
            >
              <Grid2x2Check className={`h-4 w-4 ${view === 'cards' ? 'text-primary' : 'text-darkText'}`} />
              <span className="hidden sm:inline">Cards</span>
            </button>
            <button 
              className={`px-3 py-2 text-sm flex items-center gap-1 ${view === 'table' ? 'bg-card text-foreground' : 'bg-background text-foreground'} transition-colors duration-500`}
              onClick={() => setView("table")}
            >
              <List className={`h-4 w-4 ${view === 'table' ? 'text-primary' : 'text-darkText'}`} />
              <span className="hidden sm:inline">Table</span>
            </button>
          </div>

          {/* Gitcoin/Karma/Local Toggle Buttons */}
          <button
            className={`px-3 py-1 rounded border text-xs font-medium transition-colors ${useGitcoin ? 'bg-primary text-white' : 'bg-card text-darkText border-border'}`}
            onClick={() => setUseGitcoin((v) => !v)}
          >
            {useGitcoin ? 'Hide Gitcoin Projects' : 'Show Gitcoin Projects'}
          </button>
          <button
            className={`px-3 py-1 rounded border text-xs font-medium transition-colors ${useKarma ? 'bg-primary text-white' : 'bg-card text-darkText border-border'}`}
            onClick={() => setUseKarma((v) => !v)}
          >
            {useKarma ? 'Hide Karma Projects' : 'Show Karma Projects'}
          </button>
        </div>
      </div>
      
      {/* Category Tabs - Only visible on desktop */}
      <div className="hidden md:block">
        <CategoryTabs activeCategory={category} onCategoryChange={setCategory} />
      </div>
      
      {/* Projects Display */}
      <>
        {/* Card View */}
        {view === "cards" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {gitcoinLoading && useGitcoin && (
              <div className="col-span-full py-12 text-center text-darkText">Loading Gitcoin projects...</div>
            )}
            {gitcoinError && useGitcoin && (
              <div className="col-span-full py-12 text-center text-red-500">{gitcoinError}</div>
            )}
            {karmaLoading && useKarma && (
              <div className="col-span-full py-12 text-center text-darkText">Loading Karma projects...</div>
            )}
            {karmaError && useKarma && (
              <div className="col-span-full py-12 text-center text-red-500">{karmaError}</div>
            )}
            {!gitcoinLoading && !gitcoinError && !karmaLoading && !karmaError && currentProjects.map((project) => (
              <ProjectCard key={project.id || project.uid} project={project} />
            ))}
            
            {currentProjects.length === 0 && !gitcoinLoading && !gitcoinError && !karmaLoading && !karmaError && (
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
