import { users, type User, type InsertUser, projects, type Project, type InsertProject } from "@shared/schema";
import { sampleProjects } from "../client/src/data/projects";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Project methods
  getAllProjects(): Promise<Project[]>;
  getProject(id: number): Promise<Project | undefined>;
  createProject(project: InsertProject): Promise<Project>;
  updateProject(id: number, project: Partial<Project>): Promise<Project | undefined>;
  deleteProject(id: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private projectsData: Map<number, Project>;
  currentUserId: number;
  currentProjectId: number;

  constructor() {
    this.users = new Map();
    this.projectsData = new Map();
    this.currentUserId = 1;
    this.currentProjectId = 1;
    
    // Initialize with sample data
    sampleProjects.forEach(project => {
      this.projectsData.set(project.id, {
        ...project,
        id: project.id, // Keep the original ID
      });
      // Update the current ID counter to be greater than any existing ID
      if (project.id >= this.currentProjectId) {
        this.currentProjectId = project.id + 1;
      }
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  // Project methods
  async getAllProjects(): Promise<Project[]> {
    return Array.from(this.projectsData.values());
  }
  
  async getProject(id: number): Promise<Project | undefined> {
    return this.projectsData.get(id);
  }
  
  async createProject(insertProject: InsertProject): Promise<Project> {
    const id = this.currentProjectId++;
    const now = new Date();
    
    // Set default values for required fields if not provided
    const project: Project = { 
      ...insertProject, 
      id,
      totalFunding: insertProject.totalFunding || 0,
      fundingSources: insertProject.fundingSources || null,
      website: insertProject.website || null,
      github: insertProject.github || null,
      twitter: insertProject.twitter || null,
      discord: insertProject.discord || null,
      telegram: insertProject.telegram || null,
      inFundingRound: insertProject.inFundingRound || false,
      fundingRoundLink: insertProject.fundingRoundLink || null,
      fundingProgress: insertProject.fundingProgress || 0,
      roundDeadline: insertProject.roundDeadline || null,
      isHot: insertProject.isHot || false,
      isTrending: insertProject.isTrending || false,
      commentCount: insertProject.commentCount || 0,
      shareCount: insertProject.shareCount || 0,
      pointsCount: insertProject.pointsCount || 0,
      createdAt: now
    };
    
    this.projectsData.set(id, project);
    return project;
  }
  
  async updateProject(id: number, projectUpdate: Partial<Project>): Promise<Project | undefined> {
    const project = this.projectsData.get(id);
    
    if (!project) {
      return undefined;
    }
    
    const updatedProject = {
      ...project,
      ...projectUpdate
    };
    
    this.projectsData.set(id, updatedProject);
    return updatedProject;
  }
  
  async deleteProject(id: number): Promise<boolean> {
    return this.projectsData.delete(id);
  }
}

export const storage = new MemStorage();
