import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { FundingStatusEnum, ProjectStatusEnum, CategoryEnum } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all projects
  app.get("/api/projects", async (req, res) => {
    try {
      const category = req.query.category as string;
      const sortBy = req.query.sortBy as string;
      const searchQuery = req.query.search as string;
      
      let projects = await storage.getAllProjects();
      
      // Filter by category if specified
      if (category && category !== 'all') {
        projects = projects.filter(project => project.category === category);
      }
      
      // Filter by search query if specified
      if (searchQuery) {
        const lowercaseQuery = searchQuery.toLowerCase();
        projects = projects.filter(project => 
          project.name.toLowerCase().includes(lowercaseQuery) || 
          project.description.toLowerCase().includes(lowercaseQuery)
        );
      }
      
      // Sort the projects
      if (sortBy) {
        switch (sortBy) {
          case 'total_funding':
            projects.sort((a, b) => b.totalFunding - a.totalFunding);
            break;
          case 'recently_added':
            projects.sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime());
            break;
          case 'most_supported':
            projects.sort((a, b) => (b.pointsCount || 0) - (a.pointsCount || 0));
            break;
          case 'trending':
          default:
            // Sort by a combination of factors (hot, trending, funding progress)
            projects.sort((a, b) => {
              if (a.isHot && !b.isHot) return -1;
              if (!a.isHot && b.isHot) return 1;
              if (a.isTrending && !b.isTrending) return -1;
              if (!a.isTrending && b.isTrending) return 1;
              return b.totalFunding - a.totalFunding;
            });
        }
      }
      
      res.json(projects);
    } catch (error) {
      console.error("Error fetching projects:", error);
      res.status(500).json({ message: "Failed to fetch projects" });
    }
  });

  // Get project by ID
  app.get("/api/projects/:id", async (req, res) => {
    try {
      const projectId = parseInt(req.params.id);
      const project = await storage.getProject(projectId);
      
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
      
      res.json(project);
    } catch (error) {
      console.error("Error fetching project:", error);
      res.status(500).json({ message: "Failed to fetch project" });
    }
  });

  // Create project endpoint and other CRUD operations would go here
  // but aren't included in the current feature set

  const httpServer = createServer(app);
  return httpServer;
}
