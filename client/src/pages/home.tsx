import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { PostCard } from "@/components/post-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Post } from "@shared/schema";
import { Link } from "wouter";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Home() {
  const { data, isLoading, error } = useQuery<{ posts: Post[] }>({
    queryKey: ["/api/posts"],
  });

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Error Loading Posts</h2>
          <p className="text-slate-600">Failed to load blog posts. Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary/10 to-emerald-500/10 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6">
            Share Your <span className="text-primary">Stories</span>
          </h1>
          <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
            A modern blogging platform with dynamic content blocks, perfect for developers and content creators
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/create">
              <Button size="lg" className="bg-primary text-white hover:bg-blue-700">
                Start Writing
              </Button>
            </Link>
            <Button size="lg" variant="outline">
              Explore Posts
            </Button>
          </div>
        </div>
      </div>

      {/* Blog Posts Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-slate-900">Latest Posts</h2>
          <div className="flex items-center space-x-4">
            <select className="border border-slate-300 rounded-lg px-3 py-2 text-sm">
              <option>All Categories</option>
              <option>Technology</option>
              <option>Design</option>
              <option>Programming</option>
            </select>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="h-48 w-full rounded-xl" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            ))}
          </div>
        ) : data?.posts && data.posts.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {data.posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center items-center space-x-2">
              <Button variant="ghost" size="icon">
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button size="sm" className="bg-primary text-white">1</Button>
              <Button variant="ghost" size="sm">2</Button>
              <Button variant="ghost" size="sm">3</Button>
              <span className="px-3 py-2 text-slate-500">...</span>
              <Button variant="ghost" size="sm">12</Button>
              <Button variant="ghost" size="icon">
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </>
        ) : (
          <div className="text-center py-16">
            <h3 className="text-xl font-semibold text-slate-900 mb-4">No Posts Yet</h3>
            <p className="text-slate-600 mb-8">Be the first to share your story!</p>
            <Link href="/create">
              <Button className="bg-primary text-white hover:bg-blue-700">
                Create Your First Post
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
