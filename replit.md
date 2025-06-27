# BlogCraft - Modern Blogging Platform

## Overview

BlogCraft is a modern full-stack blogging platform built with TypeScript, featuring dynamic content blocks and a clean, responsive interface. The application allows users to create, edit, and view blog posts with special support for embedded product blocks and rich content formatting.

## System Architecture

### Frontend Architecture
- **Framework**: Next.js 14+ with App Router and TypeScript
- **Routing**: Next.js App Router with file-based routing
- **State Management**: TanStack Query (React Query) for server state management
- **UI Components**: Radix UI primitives with custom Tailwind CSS styling (shadcn/ui design system)
- **Build Tool**: Next.js with Turbopack for fast development
- **Styling**: Tailwind CSS with CSS variables for theming
- **API Integration**: Proxy configuration to Express backend

### Backend Architecture
- **Runtime**: Node.js 20 with Express.js server
- **Database ORM**: Drizzle ORM with PostgreSQL dialect
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **API Design**: RESTful API with JSON responses
- **Development**: Hot module replacement with Vite middleware integration

### Database Schema
- **Users Table**: Basic user authentication (id, username, password)
- **Posts Table**: Blog posts with metadata (id, title, slug, author, content, coverImage, category, tags, timestamps)
- **Schema Validation**: Zod schemas with Drizzle integration for type-safe database operations

## Key Components

### Content Management
- **Block Parser**: Custom parser for dynamic content blocks (e.g., product showcases)
- **Rich Text Support**: Markdown-style content with embedded dynamic blocks
- **Image Handling**: Cover image support for posts
- **Categorization**: Post categories and tags for organization

### User Interface
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Component Library**: Comprehensive UI components (buttons, cards, forms, navigation)
- **Dark Mode Ready**: CSS variables setup for theme switching
- **Accessibility**: Radix UI primitives ensure ARIA compliance

### Dynamic Blocks
- **Product Blocks**: Special content blocks that render product information
- **Block Syntax**: `{{block name="..." image="..." products="..."}}` format
- **Mock Data Integration**: Product data from local mock files
- **Extensible Design**: Architecture supports adding new block types

## Data Flow

### Content Creation Flow
1. User navigates to create/edit page
2. Form submission validates against Zod schemas
3. Content is processed to generate URL-friendly slugs
4. Posts are stored in PostgreSQL via Drizzle ORM
5. Client updates via React Query cache invalidation

### Content Rendering Flow
1. Posts are fetched via REST API endpoints
2. Content is parsed for dynamic blocks on the server
3. Block data is enriched with product information
4. Client renders content with BlockRenderer component
5. Dynamic blocks are rendered as interactive components

### Authentication Flow
- Basic username/password authentication structure
- User sessions managed through Express middleware
- Password hashing and validation (implementation ready)

## External Dependencies

### Core Dependencies
- **Database**: Neon Database (serverless PostgreSQL)
- **ORM**: Drizzle ORM with PostgreSQL adapter
- **UI**: Radix UI component primitives
- **Forms**: React Hook Form with Zod validation
- **HTTP Client**: Native fetch API with custom wrapper
- **Date Handling**: date-fns for date formatting and manipulation

### Development Tools
- **TypeScript**: Full type safety across frontend and backend
- **ESBuild**: Fast production bundling for server code
- **PostCSS**: CSS processing with Tailwind CSS
- **Replit Integration**: Development environment optimizations

## Deployment Strategy

### Development Environment
- **Local Development**: `npm run dev` starts Express backend (port 5000) + `next dev` for frontend (port 3000)
- **Database**: Drizzle Kit for schema migrations (`npm run db:push`)
- **Port Configuration**: Express backend on 5000, Next.js frontend on 3000 with API proxy
- **API Proxy**: Next.js rewrites `/api/*` requests to Express backend

### Production Deployment
- **Build Process**: Next.js builds frontend assets, ESBuild bundles Express server
- **Static Assets**: Next.js built to `.next` directory
- **Server Bundle**: Express server bundled to `dist/index.js`
- **Deployment Target**: Configured for autoscale deployment with Next.js + Express
- **Environment Variables**: DATABASE_URL required for PostgreSQL connection

### Replit Configuration
- **Modules**: nodejs-20, web, postgresql-16
- **Workflows**: Automated start application workflow
- **Port Mapping**: External port 80 maps to internal port 5000
- **Hidden Files**: Configuration and build artifacts hidden from editor

## Changelog
- June 25, 2025: Initial setup with React/Express architecture
- June 25, 2025: Implemented all PDF requirements:
  * ✅ Home page with server-rendered blog posts
  * ✅ Post detail pages with dynamic {{block}} parsing
  * ✅ Create/Edit functionality with form validation
  * ✅ Full CRUD API endpoints
  * ✅ Dynamic block parsing and product rendering
  * ✅ Comment system with replies and interactions
  * ✅ Dark mode with theme toggle
  * ✅ Search and filter functionality
  * ✅ Pagination system
  * ✅ Toast notifications
  * ✅ Framer Motion animations
  * ✅ SEO meta tags and Open Graph
  * ✅ Markdown support with marked.js
  * ✅ Responsive design with Tailwind CSS
  * ✅ SEO-friendly slugs
- June 27, 2025: Converted frontend to Next.js App Router:
  * ✅ Next.js 14+ with App Router implementation
  * ✅ File-based routing for /posts/[slug], /create, /edit/[id]
  * ✅ API proxy configuration to Express backend
  * ✅ Updated components for Next.js compatibility
  * ✅ TypeScript path configuration for @/ imports
  * ✅ Development scripts for concurrent backend/frontend

## User Preferences

Preferred communication style: Simple, everyday language.