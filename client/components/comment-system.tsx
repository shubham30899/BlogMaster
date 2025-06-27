import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Reply, MoreHorizontal } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface Comment {
  id: number;
  author: string;
  content: string;
  timestamp: Date;
  likes: number;
  replies: Comment[];
}

interface CommentSystemProps {
  postId: number;
}

export function CommentSystem({ postId }: CommentSystemProps) {
  const [comments, setComments] = useState<Comment[]>([
    {
      id: 1,
      author: "Sarah Johnson",
      content: "Great article! The dynamic block parsing feature is really innovative. I've been looking for something like this for my own blog project.",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      likes: 5,
      replies: [
        {
          id: 2,
          author: "Mike Chen",
          content: "I agree! The implementation looks solid. Have you considered adding support for other block types beyond products?",
          timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
          likes: 2,
          replies: []
        }
      ]
    },
    {
      id: 3,
      author: "Alex Rivera",
      content: "The SSR approach with dynamic content is well executed. This could be a game-changer for content-heavy applications.",
      timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
      likes: 8,
      replies: []
    }
  ]);

  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [replyContent, setReplyContent] = useState("");

  const handleAddComment = () => {
    if (!newComment.trim()) return;

    const comment: Comment = {
      id: Date.now(),
      author: "You",
      content: newComment,
      timestamp: new Date(),
      likes: 0,
      replies: []
    };

    setComments([...comments, comment]);
    setNewComment("");
  };

  const handleAddReply = (parentId: number) => {
    if (!replyContent.trim()) return;

    const reply: Comment = {
      id: Date.now(),
      author: "You",
      content: replyContent,
      timestamp: new Date(),
      likes: 0,
      replies: []
    };

    setComments(comments.map(comment => 
      comment.id === parentId 
        ? { ...comment, replies: [...comment.replies, reply] }
        : comment
    ));

    setReplyContent("");
    setReplyingTo(null);
  };

  const handleLike = (commentId: number, isReply = false, parentId?: number) => {
    if (isReply && parentId) {
      setComments(comments.map(comment => 
        comment.id === parentId 
          ? {
              ...comment,
              replies: comment.replies.map(reply =>
                reply.id === commentId ? { ...reply, likes: reply.likes + 1 } : reply
              )
            }
          : comment
      ));
    } else {
      setComments(comments.map(comment => 
        comment.id === commentId ? { ...comment, likes: comment.likes + 1 } : comment
      ));
    }
  };

  const renderComment = (comment: Comment, isReply = false, parentId?: number) => (
    <Card key={comment.id} className={`${isReply ? 'ml-12 mt-4' : 'mb-6'} bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700`}>
      <CardContent className="p-4">
        <div className="flex items-start space-x-3">
          <Avatar className="w-8 h-8">
            <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${comment.author}`} />
            <AvatarFallback>{comment.author.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <span className="font-medium text-slate-900 dark:text-white">{comment.author}</span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {formatDate(comment.timestamp)}
              </span>
            </div>
            <p className="text-slate-700 dark:text-slate-300 mb-3">{comment.content}</p>
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                className="text-slate-500 hover:text-red-500 dark:text-slate-400"
                onClick={() => handleLike(comment.id, isReply, parentId)}
              >
                <Heart className="w-4 h-4 mr-1" />
                {comment.likes}
              </Button>
              {!isReply && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-slate-500 hover:text-primary dark:text-slate-400"
                  onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                >
                  <Reply className="w-4 h-4 mr-1" />
                  Reply
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                className="text-slate-500 hover:text-slate-700 dark:text-slate-400"
              >
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
        
        {replyingTo === comment.id && (
          <div className="mt-4 ml-11">
            <Textarea
              placeholder="Write a reply..."
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              className="mb-2"
              rows={3}
            />
            <div className="flex space-x-2">
              <Button size="sm" onClick={() => handleAddReply(comment.id)}>
                Reply
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setReplyingTo(null)}>
                Cancel
              </Button>
            </div>
          </div>
        )}
        
        {comment.replies.map(reply => renderComment(reply, true, comment.id))}
      </CardContent>
    </Card>
  );

  return (
    <div className="mt-12">
      <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
        Comments ({comments.length + comments.reduce((acc, c) => acc + c.replies.length, 0)})
      </h3>
      
      {/* Add Comment Form */}
      <Card className="mb-8 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <Avatar className="w-8 h-8">
              <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=You" />
              <AvatarFallback>Y</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <Textarea
                placeholder="Share your thoughts..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="mb-3"
                rows={3}
              />
              <Button onClick={handleAddComment} disabled={!newComment.trim()}>
                Post Comment
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Comments List */}
      <div>
        {comments.map(comment => renderComment(comment))}
      </div>
    </div>
  );
}