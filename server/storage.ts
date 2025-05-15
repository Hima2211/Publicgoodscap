import { users, type User, type InsertUser, projects, type Project, type InsertProject, type Comment, type InsertComment, type Activity, type InsertActivity, type ActivityType } from "@shared/schema";
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

  // Comment methods
  getComments(projectId: number): Promise<Comment[]>;
  getComment(id: number): Promise<Comment | undefined>;
  createComment(comment: InsertComment): Promise<Comment>;
  updateComment(id: number, comment: Partial<Comment>): Promise<Comment | undefined>;
  deleteComment(id: number): Promise<boolean>;
  upvoteComment(id: number): Promise<Comment | undefined>;

  // Activity methods
  getActivities(projectId: number): Promise<Activity[]>;
  createActivity(activity: InsertActivity): Promise<Activity>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private projectsData: Map<number, Project>;
  private comments: Map<number, Comment>;
  private activities: Map<number, Activity>;
  currentUserId: number;
  currentProjectId: number;
  currentCommentId: number;
  currentActivityId: number;

  constructor() {
    this.users = new Map();
    this.projectsData = new Map();
    this.comments = new Map();
    this.activities = new Map();
    this.currentUserId = 1;
    this.currentProjectId = 1;
    this.currentCommentId = 1;
    this.currentActivityId = 1;
    
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

  // Comment methods
  async getComments(projectId: number): Promise<Comment[]> {
    return Array.from(this.comments.values())
      .filter(comment => comment.projectId === projectId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async getComment(id: number): Promise<Comment | undefined> {
    return this.comments.get(id);
  }

  async createComment(insertComment: InsertComment): Promise<Comment> {
    const id = this.currentCommentId++;
    const now = new Date();
    
    const comment: Comment = {
      ...insertComment,
      id,
      parentId: insertComment.parentId || 0,
      upvotes: 0,
      createdAt: now,
      updatedAt: now,
    };

    this.comments.set(id, comment);

    // Create activity for the new comment
    await this.createActivity({
      projectId: comment.projectId,
      userId: comment.userId,
      type: 'comment',
      content: `New comment added`,
      metadata: { commentId: comment.id }
    });

    // Update project comment count
    const project = await this.getProject(comment.projectId);
    if (project) {
      await this.updateProject(project.id, {
        commentCount: project.commentCount + 1
      });
    }

    return comment;
  }

  async updateComment(id: number, update: Partial<Comment>): Promise<Comment | undefined> {
    const comment = this.comments.get(id);
    if (!comment) return undefined;

    const updatedComment = {
      ...comment,
      ...update,
      updatedAt: new Date()
    };
    this.comments.set(id, updatedComment);
    return updatedComment;
  }

  async deleteComment(id: number): Promise<boolean> {
    const comment = this.comments.get(id);
    if (!comment) return false;

    this.comments.delete(id);

    // Update project comment count
    const project = await this.getProject(comment.projectId);
    if (project) {
      await this.updateProject(project.id, {
        commentCount: project.commentCount - 1
      });
    }

    return true;
  }

  async upvoteComment(id: number): Promise<Comment | undefined> {
    const comment = this.comments.get(id);
    if (!comment) return undefined;

    const updatedComment = {
      ...comment,
      upvotes: comment.upvotes + 1
    };
    this.comments.set(id, updatedComment);
    return updatedComment;
  }

  // Activity methods
  async getActivities(projectId: number): Promise<Activity[]> {
    return Array.from(this.activities.values())
      .filter(activity => activity.projectId === projectId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async createActivity(insertActivity: InsertActivity): Promise<Activity> {
    const id = this.currentActivityId++;
    const activity: Activity = {
      ...insertActivity,
      id,
      metadata: insertActivity.metadata || {},
      createdAt: new Date()
    };
    this.activities.set(id, activity);
    return activity;
  }
}

export const storage = new MemStorage();
