import { create } from 'zustand';
import { Project, CategoryEnum } from '@shared/schema';
import { apiRequest } from '@/lib/queryClient';

interface ProjectsState {
  projects: Project[];
  filteredProjects: Project[];
  isLoading: boolean;
  currentPage: number;
  totalPages: number;
  activeCategory: string;
  sortBy: string;
  searchQuery: string;
  
  // Actions
  fetchProjects: () => Promise<void>;
  setCategory: (category: string) => void;
  setSortBy: (sortBy: string) => void;
  setSearchQuery: (query: string) => void;
  setCurrentPage: (page: number) => void;
}

const PROJECTS_PER_PAGE = 100;

export const useProjectsStore = create<ProjectsState>((set, get) => ({
  projects: [],
  filteredProjects: [],
  isLoading: false,
  currentPage: 1,
  totalPages: 1,
  activeCategory: 'all',
  sortBy: 'trending',
  searchQuery: '',
  
  fetchProjects: async () => {
    set({ isLoading: true });
    
    try {
      const res = await apiRequest('GET', `/api/projects`, undefined);
      const projects = await res.json();
      
      set({
        projects: projects,
        filteredProjects: projects,
        isLoading: false,
        totalPages: Math.ceil(projects.length / PROJECTS_PER_PAGE)
      });
      
      // Apply any existing filters
      get().setCategory(get().activeCategory);
      
    } catch (error) {
      console.error('Error fetching projects:', error);
      set({ isLoading: false });
    }
  },
  
  setCategory: (category) => {
    set({ activeCategory: category, currentPage: 1 });
    
    const { projects, sortBy, searchQuery } = get();
    
    let filtered = [...projects];
    
    // Apply category filter
    if (category !== 'all') {
      filtered = filtered.filter(p => p.category === category);
    }
    
    // Apply search filter
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(lowerQuery) || 
        p.description.toLowerCase().includes(lowerQuery)
      );
    }
    
    // Apply sorting
    filtered = sortProjects(filtered, sortBy);
    
    set({ 
      filteredProjects: filtered,
      totalPages: Math.ceil(filtered.length / PROJECTS_PER_PAGE)
    });
  },
  
  setSortBy: (sortBy) => {
    set({ sortBy, currentPage: 1 });
    
    const { filteredProjects } = get();
    const sorted = sortProjects([...filteredProjects], sortBy);
    
    set({ filteredProjects: sorted });
  },
  
  setSearchQuery: (query) => {
    set({ searchQuery: query, currentPage: 1 });
    
    const { projects, activeCategory, sortBy } = get();
    
    let filtered = [...projects];
    
    // Apply category filter
    if (activeCategory !== 'all') {
      filtered = filtered.filter(p => p.category === activeCategory);
    }
    
    // Apply search filter
    if (query) {
      const lowerQuery = query.toLowerCase();
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(lowerQuery) || 
        p.description.toLowerCase().includes(lowerQuery)
      );
    }
    
    // Apply sorting
    filtered = sortProjects(filtered, sortBy);
    
    set({ 
      filteredProjects: filtered,
      totalPages: Math.ceil(filtered.length / PROJECTS_PER_PAGE)
    });
  },
  
  setCurrentPage: (page) => {
    set({ currentPage: page });
  }
}));

// Helper function to sort projects
function sortProjects(projects: Project[], sortBy: string): Project[] {
  switch (sortBy) {
    case 'total_funding':
      return [...projects].sort((a, b) => b.totalFunding - a.totalFunding);
    case 'recently_added':
      return [...projects].sort((a, b) => {
        const dateA = new Date(a.createdAt || 0).getTime();
        const dateB = new Date(b.createdAt || 0).getTime();
        return dateB - dateA;
      });
    case 'most_supported':
      return [...projects].sort((a, b) => (b.pointsCount || 0) - (a.pointsCount || 0));
    case 'trending':
    default:
      // Sort by a combination of factors (hot, trending, funding progress)
      return [...projects].sort((a, b) => {
        if (a.isHot && !b.isHot) return -1;
        if (!a.isHot && b.isHot) return 1;
        if (a.isTrending && !b.isTrending) return -1;
        if (!a.isTrending && b.isTrending) return 1;
        return b.totalFunding - a.totalFunding;
      });
  }
}
