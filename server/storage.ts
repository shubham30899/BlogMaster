import { users, posts, type User, type InsertUser, type Post, type InsertPost, type UpdatePost } from "./shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Blog post methods
  getAllPosts(): Promise<Post[]>;
  getPostById(id: number): Promise<Post | undefined>;
  getPostBySlug(slug: string): Promise<Post | undefined>;
  createPost(post: InsertPost): Promise<Post>;
  updatePost(id: number, post: UpdatePost): Promise<Post | undefined>;
  deletePost(id: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private posts: Map<number, Post>;
  private currentUserId: number;
  private currentPostId: number;

  constructor() {
    this.users = new Map();
    this.posts = new Map();
    this.currentUserId = 1;
    this.currentPostId = 1;
    
    // Initialize with some sample posts
    this.initializeSamplePosts();
  }

  private initializeSamplePosts() {
    const samplePosts: Omit<Post, 'id'>[] = [
      {
        title: "Building Modern Web Applications with Next.js and TypeScript",
        slug: "building-modern-web-applications-nextjs-typescript",
        author: "Sarah Chen",
        content: `Next.js has revolutionized the way we build React applications, offering powerful features like Server-Side Rendering (SSR), Static Site Generation (SSG), and the new App Router. Combined with TypeScript, it provides an excellent developer experience and robust type safety for building scalable web applications.

## Key Features of Next.js 14

The latest version of Next.js introduces several groundbreaking features that make development more efficient and applications more performant. Let's explore the most significant improvements and how they can benefit your projects.

### App Router Architecture

The new App Router provides a more intuitive way to structure your application with file-based routing, nested layouts, and server components. This architecture enables better code organization and improved performance through automatic code splitting.

{{block name="Top Development Tools" image="/top-products.png" products="SKU123,SKU456,SKU789"}}

### TypeScript Integration

TypeScript provides excellent type safety and developer experience when building Next.js applications. The framework offers built-in TypeScript support with zero configuration, making it easier than ever to build type-safe applications.

### Performance Optimization

Next.js provides several built-in optimizations including automatic code splitting, image optimization, and intelligent prefetching. These features help ensure your applications load quickly and provide an excellent user experience.

## Conclusion

Next.js and TypeScript make a powerful combination for building modern web applications. The framework's built-in optimizations, combined with TypeScript's type safety, provide developers with the tools needed to build scalable, maintainable, and performant applications.`,
        coverImage: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
        category: "Technology",
        tags: ["nextjs", "typescript", "react", "web-development"],
        publishedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        updatedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      },
      {
        title: "Design Systems: Creating Consistent User Experiences",
        slug: "design-systems-consistent-user-experiences",
        author: "Alex Rivera",
        content: `Learn how to build and maintain design systems that scale across multiple products and teams. Discover best practices for component libraries, design tokens, and documentation strategies.

## What are Design Systems?

A design system is a collection of reusable components, guided by clear standards, that can be assembled together to build any number of applications.

## Building Component Libraries

Creating a robust component library is essential for maintaining consistency across your applications.

## Design Tokens

Design tokens are the visual design atoms of the design system — specifically, they are named entities that store visual design attributes.`,
        coverImage: "https://images.unsplash.com/photo-1561070791-2526d30994b5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
        category: "Design",
        tags: ["design-systems", "ui-ux", "components"],
        publishedDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 1 week ago
        updatedDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      },
      {
        title: "Advanced React Performance Optimization Techniques",
        slug: "advanced-react-performance-optimization",
        author: "Emily Watson",
        content: `Deep dive into React performance optimization strategies including memoization, code splitting, lazy loading, and advanced rendering patterns to build lightning-fast applications.

## Understanding React Performance

Performance optimization in React requires understanding how the virtual DOM works and when components re-render.

## Memoization Techniques

Learn when and how to use React.memo, useMemo, and useCallback to prevent unnecessary re-renders.

## Code Splitting

Implement dynamic imports and lazy loading to reduce initial bundle size.`,
        coverImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
        category: "Programming",
        tags: ["react", "performance", "optimization"],
        publishedDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
        updatedDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      }
    ];

    samplePosts.forEach(post => {
      const id = this.currentPostId++;
      this.posts.set(id, { ...post, id });
    });
  }

  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }

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

  async getAllPosts(): Promise<Post[]> {
    return Array.from(this.posts.values()).sort((a, b) => 
      new Date(b.publishedDate || 0).getTime() - new Date(a.publishedDate || 0).getTime()
    );
  }

  async getPostById(id: number): Promise<Post | undefined> {
    return this.posts.get(id);
  }

  async getPostBySlug(slug: string): Promise<Post | undefined> {
    console.log("slug",slug);
    
    return Array.from(this.posts.values()).find(post => post.slug === slug);
  }

  async createPost(insertPost: InsertPost): Promise<Post> {
    const id = this.currentPostId++;
    const slug = this.generateSlug(insertPost.title);
    const now = new Date();
    
    const post: Post = {
      ...insertPost,
      id,
      slug,
      coverImage: insertPost.coverImage || null,
      category: insertPost.category || null,
      tags: insertPost.tags || null,
      publishedDate: now,
      updatedDate: now,
    };
    
    this.posts.set(id, post);
    return post;
  }

  async updatePost(id: number, updatePost: UpdatePost): Promise<Post | undefined> {
    const existingPost = this.posts.get(id);
    if (!existingPost) {
      return undefined;
    }

    const updatedPost: Post = {
      ...existingPost,
      ...updatePost,
      updatedDate: new Date(),
    };

    // Update slug if title changed
    if (updatePost.title) {
      updatedPost.slug = this.generateSlug(updatePost.title);
    }

    this.posts.set(id, updatedPost);
    return updatedPost;
  }

  async deletePost(id: number): Promise<boolean> {
    return this.posts.delete(id);
  }
}

export const storage = new MemStorage();
