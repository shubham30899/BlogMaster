import { z } from "zod";
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
