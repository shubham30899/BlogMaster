'use client';

import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BlockRenderer } from "@/components/block-renderer";
import { CommentSystem } from "@/components/comment-system";
import { Skeleton } from "@/components/ui/skeleton";
import { Post, ParsedBlock } from "@shared/schema";
import { formatDate, calculateReadTime } from "@/lib/utils";
import { parseBlocks } from "@/lib/block-parser";
import { ChevronLeft, Heart, Bookmark, Share2, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

interface PostWithBlocks extends Post {
  blocks: ParsedBlock[];
}

export default function PostDetail() {
  const params = useParams();
  const { toast } = useToast();
  const slug = params.slug as string;

  const { data: post, isLoading } = useQuery<PostWithBlocks>({
    queryKey: ["/api/posts", slug],
    queryFn: async () => {
      const res = await fetch(`/api/posts/${slug}`);
      if (!res.ok) throw new Error('Failed to fetch post');
      const data = await res.json();
      return {
        ...data.post,
        blocks: parseBlocks(data.post.content),
      };
    },
    enabled: !!slug,
  });

  const handleLike = () => {
    toast({
      title: "Liked!",
      description: "You liked this post.",
    });
  };

  const handleBookmark = () => {
    toast({
      title: "Bookmarked!",
      description: "Post saved to your bookmarks.",
    });
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: post?.title,
        text: post?.title,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link copied!",
        description: "Post link copied to clipboard.",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-12 w-full" />
          <div className="flex items-center space-x-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
          <Skeleton className="h-64 w-full" />
          <div className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-16">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Post Not Found</h2>
          <p className="text-slate-600 dark:text-slate-400 mb-8">The post you're looking for doesn't exist.</p>
          <Link href="/">
            <Button>Back to Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  const readTime = calculateReadTime(post.content);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
    >
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-sm text-slate-600 dark:text-slate-400 mb-8">
        <Link href="/" className="hover:text-primary transition-colors">
          <ChevronLeft className="w-4 h-4 inline mr-1" />
          Back to Posts
        </Link>
      </nav>

      {/* Post Header */}
      <header className="mb-8">
        <div className="flex flex-wrap items-center gap-2 mb-4">
          {post.category && (
            <Badge variant="secondary">{post.category}</Badge>
          )}
          {post.tags?.map((tag) => (
            <Badge key={tag} variant="outline">{tag}</Badge>
          ))}
        </div>
        
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-6 leading-tight">
          {post.title}
        </h1>
        
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 dark:border-slate-700 pb-6">
          <div className="flex items-center space-x-4 mb-4 sm:mb-0">
            <Avatar className="w-12 h-12">
              <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${post.author}`} />
              <AvatarFallback>{post.author.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold text-slate-900 dark:text-white">{post.author}</p>
              <div className="flex items-center space-x-2 text-sm text-slate-600 dark:text-slate-400">
                <span>{formatDate(post.publishedDate)}</span>
                <span>•</span>
                <span>{readTime}</span>
                <span>•</span>
                <span className="flex items-center space-x-1">
                  <Eye className="w-4 h-4" />
                  <span>1.2k views</span>
                </span>
              </div>
            </div>
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
      </header>

      {/* Cover Image */}
      {post.coverImage && (
        <div className="mb-8">
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full h-64 md:h-96 object-cover rounded-xl"
          />
        </div>
      )}

      {/* Post Content */}
      <article className="prose prose-slate dark:prose-invert max-w-none mb-12">
        <BlockRenderer blocks={post.blocks} content={post.content} />
      </article>

      {/* Author Info */}
      <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-6 mb-8">
        <div className="flex items-start space-x-4">
          <Avatar className="w-16 h-16">
            <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${post.author}`} />
            <AvatarFallback>{post.author.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
              {post.author}
            </h3>
            <p className="text-slate-600 dark:text-slate-300 mb-4">
              Passionate developer and technical writer sharing insights about modern web development, 
              software architecture, and emerging technologies.
            </p>
            <Button variant="ghost" size="sm" className="text-primary hover:text-blue-700">
              Follow
            </Button>
          </div>
        </div>
      </div>

      {/* Comment System */}
      <CommentSystem postId={post.id} />
    </motion.div>
  );
}