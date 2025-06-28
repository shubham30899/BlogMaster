import { AppDataSource } from './database.config';
import { User } from './entity/user.entity';
import { Post } from './entity/post.entity';
export class MongoStorage {
    constructor() {
        this.currentUserId = 1;
        this.currentPostId = 1;
        this.initialized = false;
        this.userRepository = AppDataSource.getMongoRepository(User);
        this.postRepository = AppDataSource.getMongoRepository(Post);
    }
    async ensureInitialized() {
        if (!this.initialized) {
            await this.initializeSampleData();
            this.initialized = true;
        }
    }
    async initializeSampleData() {
        // Get the highest existing IDs to avoid conflicts
        const existingPosts = await this.postRepository.find({
            order: { id: 'DESC' },
            take: 1
        });
        if (existingPosts.length > 0) {
            this.currentPostId = existingPosts[0].id + 1;
            return; // Data already exists
        }
        const samplePosts = [
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
                publishedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
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
                publishedDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
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
                publishedDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
                updatedDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
            }
        ];
        for (const postData of samplePosts) {
            const id = this.currentPostId++;
            const post = this.postRepository.create({
                ...postData,
                id,
            });
            await this.postRepository.save(post);
        }
    }
    generateSlug(title) {
        return title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
    }
    async getUser(id) {
        const user = await this.userRepository.findOne({ where: { id } });
        return user ? this.convertUser(user) : undefined;
    }
    async getUserByUsername(username) {
        const user = await this.userRepository.findOne({ where: { username } });
        return user ? this.convertUser(user) : undefined;
    }
    async createUser(insertUser) {
        const id = this.currentUserId++;
        const user = this.userRepository.create({
            ...insertUser,
            id,
        });
        const savedUser = await this.userRepository.save(user);
        return this.convertUser(savedUser);
    }
    async getAllPosts() {
        await this.ensureInitialized();
        const posts = await this.postRepository.find({
            order: { publishedDate: 'DESC' }
        });
        return posts.map(post => this.convertPost(post));
    }
    async getPostById(id) {
        await this.ensureInitialized();
        const post = await this.postRepository.findOne({ where: { id } });
        return post ? this.convertPost(post) : undefined;
    }
    async getPostBySlug(slug) {
        await this.ensureInitialized();
        console.log("slug", slug);
        const post = await this.postRepository.findOne({ where: { slug } });
        return post ? this.convertPost(post) : undefined;
    }
    // async createPost(insertPost: InsertPost): Promise<PostType> {
    //   const id = this.currentPostId++;
    //   const slug = this.generateSlug(insertPost.title);
    //   const now = new Date();
    //   const post = this.postRepository.create({
    //     ...insertPost,
    //     id,
    //     slug,
    //     coverImage: insertPost.coverImage || undefined,
    //     category: insertPost.category || undefined,
    //     tags: insertPost.tags || undefined,
    //     publishedDate: now,
    //     updatedDate: now,
    //   });
    //   const savedPost = await this.postRepository.save(post);
    //   return this.convertPost(savedPost);
    // }
    async createPost(insertPost) {
        const id = this.currentPostId++;
        const slug = this.generateSlug(insertPost.title);
        const now = new Date();
        const post = this.postRepository.create({
            ...insertPost,
            id,
            slug,
            coverImage: insertPost.coverImage || undefined,
            category: insertPost.category || undefined,
            tags: insertPost.tags || undefined,
            publishedDate: now,
            updatedDate: now,
        });
        const savedPost = await this.postRepository.save(post);
        return this.convertPost(savedPost);
    }
    async updatePost(id, updatePost) {
        const existingPost = await this.postRepository.findOne({ where: { id } });
        if (!existingPost) {
            return undefined;
        }
        const updatedData = {
            ...updatePost,
            updatedDate: new Date(),
        };
        // Update slug if title changed
        if (updatePost.title) {
            updatedData.slug = this.generateSlug(updatePost.title);
        }
        await this.postRepository.update({ id }, updatedData);
        const updatedPost = await this.postRepository.findOne({ where: { id } });
        return updatedPost ? this.convertPost(updatedPost) : undefined;
    }
    async deletePost(id) {
        const result = await this.postRepository.delete({ id });
        return result.affected !== undefined && result.affected > 0;
    }
    convertUser(user) {
        const { _id, ...userWithoutId } = user;
        return userWithoutId;
    }
    convertPost(post) {
        const { _id, ...postWithoutId } = post;
        return postWithoutId;
    }
}
export const storage = new MongoStorage();
