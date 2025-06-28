import { z } from "zod";
import { User } from "../entity/user.entity";
import { Post } from "../entity/post.entity";

// User schemas
export const insertUserSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
});

// Post schemas
export const insertPostSchema = z.object({
  title: z.string().min(1),
  author: z.string().min(1),
  content: z.string().min(1),
  coverImage: z.string().optional(),
  category: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

export const updatePostSchema = insertPostSchema.partial();

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type UserType = Omit<User, '_id'>;
export type InsertPost = z.infer<typeof insertPostSchema>;
export type UpdatePost = z.infer<typeof updatePostSchema>;
export type PostType = Omit<Post, '_id'>;

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