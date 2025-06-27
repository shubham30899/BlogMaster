import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const posts = pgTable("posts", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  author: text("author").notNull(),
  content: text("content").notNull(),
  coverImage: text("cover_image"),
  category: text("category"),
  tags: text("tags").array(),
  publishedDate: timestamp("published_date").defaultNow(),
  updatedDate: timestamp("updated_date").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertPostSchema = createInsertSchema(posts).omit({
  id: true,
  slug: true,
  publishedDate: true,
  updatedDate: true,
});

export const updatePostSchema = insertPostSchema.partial();

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertPost = z.infer<typeof insertPostSchema>;
export type UpdatePost = z.infer<typeof updatePostSchema>;
export type Post = typeof posts.$inferSelect;

// Block parsing types
export interface ParsedBlock {
  type: string;
  name: string;
  image?: string;
  products?: string[];
  originalText: string;
}

// Product types
export interface Product {
  sku: string;
  name: string;
  price: string;
  image: string;
}
