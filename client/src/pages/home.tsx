import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { PostCard } from "@/components/post-card";
import { SearchFilter } from "@/components/search-filter";
import { SEOHead } from "@/components/seo-head";
import { Skeleton } from "@/components/ui/skeleton";
import { Post } from "@shared/schema";
import { Link } from "wouter";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 6;

  const { data, isLoading, error } = useQuery<{ posts: Post[] }>({
    queryKey: ["/api/posts"],
  });

  useEffect(() => {
    if (data?.posts) {
      setFilteredPosts(data.posts);
    }
  }, [data?.posts]);

  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  const startIndex = (currentPage - 1) * postsPerPage;
  const currentPosts = filteredPosts.slice(startIndex, startIndex + postsPerPage);

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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <SEOHead
        title="Modern Blogging Platform"
        description="Share your stories with BlogCraft - a modern blogging platform featuring dynamic content blocks, responsive design, and powerful editing tools."
        type="website"
      />
      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="bg-gradient-to-br from-primary/10 to-emerald-500/10 dark:from-primary/5 dark:to-emerald-500/5 py-16"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-4xl md:text-6xl font-bold text-slate-900 dark:text-white mb-6"
          >
            Share Your <span className="text-primary">Stories</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl text-slate-600 dark:text-slate-300 mb-8 max-w-2xl mx-auto"
          >
            A modern blogging platform with dynamic content blocks, perfect for developers and content creators
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link href="/create">
              <Button size="lg" className="bg-primary text-white hover:bg-blue-700">
                Start Writing
              </Button>
            </Link>
            <Button size="lg" variant="outline">
              Explore Posts
            </Button>
          </motion.div>
        </div>
      </motion.div>

      {/* Blog Posts Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Latest Posts</h2>
          <div className="text-sm text-slate-600 dark:text-slate-400">
            {filteredPosts.length} post{filteredPosts.length !== 1 ? 's' : ''} found
          </div>
        </div>

        {/* Search and Filter */}
        {data?.posts && <SearchFilter posts={data.posts} onFilteredPosts={setFilteredPosts} />}

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
        ) : currentPosts && currentPosts.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {currentPosts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center space-x-2">
                <Button 
                  variant="ghost" 
                  size="icon"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(currentPage - 1)}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const pageNum = i + 1;
                  return (
                    <Button
                      key={pageNum}
                      size="sm"
                      variant={currentPage === pageNum ? "default" : "ghost"}
                      onClick={() => setCurrentPage(pageNum)}
                    >
                      {pageNum}
                    </Button>
                  );
                })}
                
                {totalPages > 5 && (
                  <>
                    <span className="px-3 py-2 text-slate-500">...</span>
                    <Button variant="ghost" size="sm" onClick={() => setCurrentPage(totalPages)}>
                      {totalPages}
                    </Button>
                  </>
                )}
                
                <Button 
                  variant="ghost" 
                  size="icon"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(currentPage + 1)}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-16">
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">No Posts Found</h3>
            <p className="text-slate-600 dark:text-slate-400 mb-8">
              {data?.posts?.length ? "No posts match your current filters." : "Be the first to share your story!"}
            </p>
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
