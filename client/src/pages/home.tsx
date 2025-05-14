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
import { Input } from "@/components/ui/input";
import { Search, Grid2x2Check, List } from "lucide-react";

export default function Home() {
  const [view, setView] = useState<"cards" | "table">("cards");
  const [currentPage, setCurrentPage] = useState(1);
  const [category, setCategory] = useState("all");
  const [sortBy, setSortBy] = useState("trending");
  const [searchQuery, setSearchQuery] = useState("");
  
  const { data: projects = [], isLoading } = useQuery<Project[]>({
    queryKey: ["/api/projects", category, sortBy, searchQuery],
  });

  // Calculate pagination
  const projectsPerPage = 9;
  const totalPages = Math.ceil(projects.length / projectsPerPage);
  const indexOfLastProject = currentPage * projectsPerPage;
  const indexOfFirstProject = indexOfLastProject - projectsPerPage;
  const currentProjects = projects.slice(indexOfFirstProject, indexOfLastProject);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* View Controls & Filters */}
      <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-bold text-white">Web3 Project Explorer</h1>
          <p className="text-darkText mt-1">Discover and support the ecosystem's most impactful projects</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="w-full md:w-40 bg-darkCard border-darkBorder rounded-lg text-sm">
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
              <SelectTrigger className="w-full md:w-48 bg-darkCard border-darkBorder rounded-lg text-sm">
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
          
          <div className="flex border border-darkBorder rounded-lg overflow-hidden">
            <button 
              className={`px-3 py-2 text-sm flex items-center gap-1 ${view === 'cards' ? 'bg-darkCard' : 'bg-darkBg'}`}
              onClick={() => setView("cards")}
            >
              <Grid2x2Check className={`h-4 w-4 ${view === 'cards' ? 'text-primary' : 'text-darkText'}`} />
              <span className="hidden sm:inline">Cards</span>
            </button>
            <button 
              className={`px-3 py-2 text-sm flex items-center gap-1 ${view === 'table' ? 'bg-darkCard' : 'bg-darkBg'}`}
              onClick={() => setView("table")}
            >
              <List className={`h-4 w-4 ${view === 'table' ? 'text-primary' : 'text-darkText'}`} />
              <span className="hidden sm:inline">Table</span>
            </button>
          </div>
        </div>
      </div>
      
      {/* Category Tabs */}
      <CategoryTabs activeCategory={category} onCategoryChange={setCategory} />
      
      {/* Search Input (Mobile) */}
      <div className="md:hidden mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-darkText" />
          <Input
            type="text"
            placeholder="Search projects..."
            className="w-full bg-darkCard border-darkBorder pl-10 text-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      )}
      
      {/* Projects Display */}
      {!isLoading && (
        <>
          {/* Card View */}
          {view === "cards" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {currentProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
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
          {projects.length > 0 && (
            <Pagination 
              currentPage={currentPage} 
              totalPages={totalPages} 
              onPageChange={handlePageChange} 
            />
          )}
        </>
      )}
    </main>
  );
}
