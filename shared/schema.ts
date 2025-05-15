import { pgTable, text, serial, integer, boolean, json, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Project Schema
export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  logo: text("logo").notNull(),
  category: text("category").notNull(),
  totalFunding: integer("total_funding").notNull().default(0),
  fundingSources: text("funding_sources").array(),
  website: text("website"),
  github: text("github"),
  twitter: text("twitter"),
  discord: text("discord"),
  telegram: text("telegram"),
  inFundingRound: boolean("in_funding_round").notNull().default(false),
  fundingRoundLink: text("funding_round_link"),
  fundingProgress: integer("funding_progress").notNull().default(0),
  roundDeadline: timestamp("round_deadline"),
  isHot: boolean("is_hot").notNull().default(false),
  isTrending: boolean("is_trending").notNull().default(false),
  commentCount: integer("comment_count").notNull().default(0),
  shareCount: integer("share_count").notNull().default(0),
  pointsCount: integer("points_count").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertProjectSchema = createInsertSchema(projects).omit({
  id: true,
  createdAt: true,
});

export type InsertProject = z.infer<typeof insertProjectSchema>;
export type Project = typeof projects.$inferSelect;

// Comment Schema
export const comments = pgTable("comments", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id").notNull().references(() => projects.id),
  userId: integer("user_id").notNull().references(() => users.id),
  content: text("content").notNull(),
  parentId: integer("parent_id").notNull().default(0),  // 0 means no parent
  upvotes: integer("upvotes").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertCommentSchema = createInsertSchema(comments).omit({
  id: true,
  upvotes: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertComment = z.infer<typeof insertCommentSchema>;
export type Comment = typeof comments.$inferSelect;

// Activity Schema
export const ActivityTypeEnum = z.enum(['comment', 'upvote', 'project_update', 'funding_update']);
export type ActivityType = z.infer<typeof ActivityTypeEnum>;

export const activities = pgTable("activities", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id").notNull().references(() => projects.id),
  userId: integer("user_id").notNull().references(() => users.id),
  type: text("type").notNull(),
  content: text("content").notNull(),
  metadata: json("metadata").notNull().$default(() => ({})),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertActivitySchema = createInsertSchema(activities).omit({
  id: true,
  createdAt: true,
});

export type InsertActivity = z.infer<typeof insertActivitySchema>;
export type Activity = typeof activities.$inferSelect;

// Funding Status Enum
export const FundingStatusEnum = z.enum(['open', 'closed']);
export type FundingStatus = z.infer<typeof FundingStatusEnum>;

// Project Status Enum
export const ProjectStatusEnum = z.enum(['hot', 'trending', 'new', 'funded']);
export type ProjectStatus = z.infer<typeof ProjectStatusEnum>;

// Category Enum
export const CategoryEnum = z.enum(['all', 'defi', 'nft', 'dao', 'infrastructure', 'public_goods', 'social']);
export type Category = z.infer<typeof CategoryEnum>;
