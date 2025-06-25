import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Post } from "@shared/schema";
import { formatDate, calculateReadTime } from "@/lib/utils";
import { getSnippet } from "@/lib/block-parser";
import { Link } from "wouter";

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  const snippet = getSnippet(post.content);
  const readTime = calculateReadTime(post.content);

  return (
    <Link href={`/posts/${post.slug}`}>
      <Card className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group">
        {post.coverImage && (
          <div className="aspect-video overflow-hidden">
            <img
              src={post.coverImage}
              alt={post.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        )}
        <CardContent className="p-6">
          <div className="flex items-center space-x-2 mb-3">
            {post.category && (
              <Badge variant="secondary" className="bg-primary/10 text-primary">
                {post.category}
              </Badge>
            )}
            <span className="text-slate-500 text-xs">
              {formatDate(post.publishedDate)}
            </span>
          </div>
          
          <h3 className="text-xl font-semibold text-slate-900 mb-3 group-hover:text-primary transition-colors line-clamp-2">
            {post.title}
          </h3>
          
          <p className="text-slate-600 mb-4 line-clamp-3">
            {snippet}
          </p>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Avatar className="w-8 h-8">
                <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${post.author}`} />
                <AvatarFallback>{post.author.charAt(0)}</AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium text-slate-700">{post.author}</span>
            </div>
            <span className="text-sm text-slate-500">{readTime}</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
