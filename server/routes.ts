import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertPostSchema, updatePostSchema } from "@shared/schema";
import { parseBlocks } from "../client/src/lib/block-parser";

export async function registerRoutes(app: Express): Promise<Server> {
  // GET /api/posts - Get all posts
  app.get("/api/posts", async (req, res) => {
    try {
      const posts = await storage.getAllPosts();
      res.json({ posts });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch posts" });
    }
  });

  // GET /api/posts/:id - Get post by ID
  app.get("/api/posts/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid post ID" });
      }

      const post = await storage.getPostById(id);
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }

      // Parse blocks in the content for rendering
      const blocks = parseBlocks(post.content);
      
      res.json({ ...post, blocks });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch post" });
    }
  });

  // GET /api/posts/slug/:slug - Get post by slug
  app.get("/api/posts/slug/:slug", async (req, res) => {
    try {
      const slug = req.params.slug;
      const post = await storage.getPostBySlug(slug);
      
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }

      // Parse blocks in the content for rendering
      const blocks = parseBlocks(post.content);
      
      res.json({ ...post, blocks });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch post" });
    }
  });

  // POST /api/posts - Create new post
  app.post("/api/posts", async (req, res) => {
    try {
      const validatedData = insertPostSchema.parse(req.body);
      const post = await storage.createPost(validatedData);
      res.status(201).json(post);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Failed to create post" });
      }
    }
  });

  // PUT /api/posts/:id - Update post
  app.put("/api/posts/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid post ID" });
      }

      const validatedData = updatePostSchema.parse(req.body);
      const post = await storage.updatePost(id, validatedData);
      
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }

      res.json(post);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Failed to update post" });
      }
    }
  });

  // DELETE /api/posts/:id - Delete post
  app.delete("/api/posts/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid post ID" });
      }

      const deleted = await storage.deletePost(id);
      if (!deleted) {
        return res.status(404).json({ message: "Post not found" });
      }

      res.json({ message: "Post deleted successfully", id });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete post" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
