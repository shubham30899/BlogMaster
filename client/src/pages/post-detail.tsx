import { useQuery } from "@tanstack/react-query";
import { useRoute, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BlockRenderer } from "@/components/block-renderer";
import { CommentSystem } from "@/components/comment-system";
import { SEOHead } from "@/components/seo-head";
import { Skeleton } from "@/components/ui/skeleton";
import { Post, ParsedBlock } from "@shared/schema";
import { formatDate, calculateReadTime } from "@/lib/utils";
import { getSnippet } from "@/lib/block-parser";
import { ChevronLeft, Heart, Bookmark, Share2, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

interface PostWithBlocks extends Post {
  blocks: ParsedBlock[];
}

export default function PostDetail() {
  const [, params] = useRoute("/posts/:slug");
  const slug = params?.slug;
  const { toast } = useToast();

  const { data: post, isLoading, error } = useQuery<PostWithBlocks>({
    queryKey: [`/api/posts/slug/${slug}`],
    enabled: !!slug,
  });

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: "Link copied!",
      description: "Post link has been copied to clipboard.",
    });
  };

  const handleBookmark = () => {
    toast({
      title: "Bookmarked!",
      description: "Post has been saved to your bookmarks.",
    });
  };

  const handleLike = () => {
    toast({
      title: "Liked!",
      description: "Thanks for your support!",
    });
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Post Not Found</h2>
          <p className="text-slate-600 mb-8">The post you're looking for doesn't exist or has been removed.</p>
          <Link href="/">
            <Button>
              <ChevronLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Skeleton className="h-8 w-32 mb-8" />
        <div className="space-y-4 mb-8">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-6 w-3/4" />
        </div>
        <Skeleton className="h-64 w-full rounded-xl mb-8" />
        <div className="space-y-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </div>
    );
  }

  if (!post) {
    return null;
  }

  const readTime = calculateReadTime(post.content);
  const snippet = getSnippet(post.content, 160);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
    >
      <SEOHead
        title={post.title}
        description={snippet}
        image={post.coverImage || undefined}
        url={window.location.href}
        type="article"
      />
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-sm text-slate-600 dark:text-slate-400 mb-8">
        <Link href="/">
          <Button variant="ghost" className="hover:text-primary">
            <ChevronLeft className="w-4 h-4 mr-2" />
            Home
          </Button>
        </Link>
      </nav>

      {/* Article Header */}
      <header className="mb-8">
        <div className="flex items-center space-x-2 mb-4">
          {post.category && (
            <Badge className="bg-primary/10 text-primary">
              {post.category}
            </Badge>
          )}
          <span className="text-slate-500 text-sm">
            {formatDate(post.publishedDate)}
          </span>
        </div>
        
        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
          {post.title}
        </h1>
        
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center space-x-4">
            <Avatar className="w-12 h-12">
              <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${post.author}`} />
              <AvatarFallback>{post.author.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold text-slate-900">{post.author}</p>
              <p className="text-sm text-slate-600">Senior Full Stack Developer</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4 text-sm text-slate-600">
            <span>{readTime}</span>
            <span>•</span>
            <div className="flex items-center space-x-2">
              <span className="flex items-center space-x-1">
                <Eye className="w-4 h-4" />
                <span>1.2k views</span>
              </span>
            </div>
            <span>•</span>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" className="hover:text-primary" onClick={handleLike}>
                <Heart className="w-4 h-4 mr-1" />
                42
              </Button>
              <Button variant="ghost" size="sm" className="hover:text-primary" onClick={handleBookmark}>
                <Bookmark className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" className="hover:text-primary" onClick={handleShare}>
                <Share2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Featured Image */}
      {post.coverImage && (
        <img
          src={post.coverImage}
          alt={post.title}
          className="w-full h-64 md:h-96 object-cover rounded-xl mb-8"
        />
      )}

      {/* Article Content with Block Rendering */}
      <article>
        <BlockRenderer blocks={post.blocks || []} content={post.content} />
      </article>

      {/* Author Bio */}
      <div className="mt-12 p-6 bg-slate-50 rounded-xl">
        <div className="flex items-start space-x-4">
          <Avatar className="w-16 h-16">
            <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${post.author}`} />
            <AvatarFallback>{post.author.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold text-slate-900 mb-2">{post.author}</h3>
            <p className="text-slate-600 mb-3">
              Senior Full Stack Developer with 8+ years of experience building scalable web applications. 
              Passionate about React, TypeScript, and modern web technologies.
            </p>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" className="text-primary hover:text-blue-700">
                Follow
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Comment System */}
      <CommentSystem postId={post.id} />
    </motion.div>
  );
}
