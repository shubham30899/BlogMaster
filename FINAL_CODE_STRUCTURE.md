# BlogCraft - Complete Next.js App Router Code

## Project Structure
```
├── app/                           # Next.js App Router
│   ├── layout.tsx                # Root layout with providers
│   ├── page.tsx                  # Home page with search/filter/pagination
│   ├── providers.tsx             # React Query + Theme providers
│   ├── globals.css               # Global Tailwind styles
│   ├── create/page.tsx           # Create new post page
│   └── posts/[slug]/page.tsx     # Dynamic post detail page
├── components/                    # UI Components
│   ├── navbar.tsx                # Navigation with theme toggle
│   ├── post-card.tsx             # Blog post cards with animations
│   ├── search-filter.tsx         # Search and filter functionality
│   ├── block-renderer.tsx        # Dynamic {{block}} content parser
│   ├── comment-system.tsx        # Comments with replies
│   ├── product-block.tsx         # Product showcase blocks
│   ├── seo-head.tsx              # SEO meta tags
│   └── ui/                       # Shadcn/ui components
├── lib/                          # Utilities
│   ├── utils.ts                  # Helper functions
│   ├── queryClient.ts            # React Query setup
│   └── block-parser.ts           # {{block}} parsing logic
├── hooks/                        # Custom hooks
│   ├── use-theme.tsx             # Dark/light theme toggle
│   └── use-toast.ts              # Toast notifications
├── shared/                       # Shared types
│   └── schema.ts                 # Database schemas and types
├── server/                       # Express Backend
│   ├── index.ts                  # Express server setup
│   ├── routes.ts                 # API endpoints
│   ├── storage.ts                # In-memory database
│   └── vite.ts                   # Vite middleware
├── data/                         # Mock data
│   └── products.ts               # Product showcase data
├── next.config.js                # Next.js configuration
├── tsconfig.json                 # TypeScript configuration
└── start-nextjs.js               # Development startup script
```

## Key Features Implemented

### Frontend (Next.js App Router)
- ✅ File-based routing with dynamic routes
- ✅ Server-side rendering optimizations
- ✅ API proxy to Express backend
- ✅ TypeScript with path aliases
- ✅ Responsive design with Tailwind CSS
- ✅ Dark/light theme toggle
- ✅ Search, filter, and pagination
- ✅ Framer Motion animations
- ✅ Toast notifications
- ✅ SEO optimization with meta tags

### Backend (Express API)
- ✅ RESTful API endpoints
- ✅ Dynamic {{block}} content parsing
- ✅ In-memory database with sample posts
- ✅ CRUD operations for blog posts
- ✅ Markdown content support
- ✅ SEO-friendly slug generation

### Dynamic Content System
- ✅ {{block}} syntax parsing
- ✅ Product showcase components
- ✅ Custom block renderer
- ✅ Mock product data integration

### UI/UX Features
- ✅ Comment system with replies
- ✅ Like, bookmark, and share functionality
- ✅ Reading time calculation
- ✅ Author profiles and avatars
- ✅ Category and tag filtering
- ✅ Mobile-responsive design

## Development Setup

### Local Development
```bash
# Option 1: Manual (2 terminals)
npm run dev              # Express backend (port 5000)
npx next dev            # Next.js frontend (port 3000)

# Option 2: Automated
node start-nextjs.js    # Runs both servers
```

### URLs
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- API Proxy: http://localhost:3000/api/*

## Production Deployment
```bash
npm run build           # Build Next.js + Express
npm run start           # Start production servers
```

## Technical Stack
- **Frontend**: Next.js 14+ App Router, TypeScript, Tailwind CSS
- **Backend**: Express.js, TypeScript
- **State**: TanStack Query (React Query)
- **UI**: Radix UI primitives (shadcn/ui)
- **Animations**: Framer Motion
- **Forms**: React Hook Form + Zod validation
- **Database**: In-memory storage (easily replaceable with PostgreSQL)