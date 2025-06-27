'use client';

import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { insertPostSchema, type InsertPost } from "@/shared/schema";
import { ArrowLeft, Save, Send, Eye, Upload, Package } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function CreatePost() {
  const router = useRouter();
  const { toast } = useToast();
  const [previewMode, setPreviewMode] = useState(false);

  const form = useForm<InsertPost>({
    resolver: zodResolver(insertPostSchema),
    defaultValues: {
      title: "",
      author: "",
      content: "",
      coverImage: "",
      category: "",
      tags: [],
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: InsertPost) => {
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      //if (!res.ok) throw new Error('Failed to create post');
      return res.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Success!",
        description: "Your post has been published.",
      });
      router.push(`/posts/${data.post.slug}`);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create post. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertPost) => {
    createMutation.mutate(data);
  };

  const watchedTitle = form.watch("title");
  const watchedContent = form.watch("content");

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <Link href="/" className="flex items-center text-slate-600 hover:text-primary mb-4 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Posts
          </Link>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Create New Post</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2">Share your story with the world</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPreviewMode(!previewMode)}
          >
            <Eye className="w-4 h-4 mr-2" />
            {previewMode ? "Edit" : "Preview"}
          </Button>
        </div>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title */}
            <div>
              <Label htmlFor="title" className="text-lg font-semibold text-slate-900 dark:text-white">
                Post Title
              </Label>
              <Input
                id="title"
                placeholder="Enter your post title..."
                className="mt-2 text-lg h-12"
                {...form.register("title")}
              />
              {form.formState.errors.title && (
                <p className="text-red-500 text-sm mt-1">{form.formState.errors.title.message}</p>
              )}
            </div>

            {/* Content */}
            <div>
              <Label htmlFor="content" className="text-lg font-semibold text-slate-900 dark:text-white">
                Content
              </Label>
              <div className="mt-2">
                <Textarea
                  id="content"
                  placeholder="Write your post content here... Use {{block name=&quot;product-showcase&quot; image=&quot;...&quot; products=&quot;sku1,sku2&quot;}} for dynamic blocks"
                  className="min-h-[400px] text-base leading-relaxed"
                  {...form.register("content")}
                />
                <div className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                  <p>✨ <strong>Dynamic Blocks:</strong> Use special syntax to embed interactive content:</p>
                  <code className="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded text-xs">
                    {`{{block name="product-showcase" image="image-url" products="sku1,sku2"}}`}
                  </code>
                </div>
              </div>
              {form.formState.errors.content && (
                <p className="text-red-500 text-sm mt-1">{form.formState.errors.content.message}</p>
              )}
            </div>

            {/* Block Examples */}
            <Card className="bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800">
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <Package className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Dynamic Block Examples</h4>
                    <div className="space-y-2 text-sm text-blue-700 dark:text-blue-200">
                      <div>
                        <strong>Product Showcase:</strong>
                        <code className="block bg-blue-100 dark:bg-blue-900 p-2 rounded mt-1 text-xs">
                          {`{{block name="tech-gadgets" image="https://images.unsplash.com/tech" products="laptop-pro,wireless-mouse"}}`}
                        </code>
                      </div>
                      <div>
                        <strong>Featured Items:</strong>
                        <code className="block bg-blue-100 dark:bg-blue-900 p-2 rounded mt-1 text-xs">
                          {`{{block name="featured-collection" products="smartphone,tablet-pro,smart-watch"}}`}
                        </code>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Author */}
            <div>
              <Label htmlFor="author" className="text-base font-semibold text-slate-900 dark:text-white">
                Author
              </Label>
              <Input
                id="author"
                placeholder="Your name"
                className="mt-2"
                {...form.register("author")}
              />
              {form.formState.errors.author && (
                <p className="text-red-500 text-sm mt-1">{form.formState.errors.author.message}</p>
              )}
            </div>

            {/* Cover Image */}
            <div>
              <Label htmlFor="coverImage" className="text-base font-semibold text-slate-900 dark:text-white">
                Cover Image URL
              </Label>
              <Input
                id="coverImage"
                placeholder="https://example.com/image.jpg"
                className="mt-2"
                {...form.register("coverImage")}
              />
            </div>

            {/* Category */}
            <div>
              <Label className="text-base font-semibold text-slate-900 dark:text-white">
                Category
              </Label>
              <Select onValueChange={(value) => form.setValue("category", value)}>
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="technology">Technology</SelectItem>
                  <SelectItem value="design">Design</SelectItem>
                  <SelectItem value="development">Development</SelectItem>
                  <SelectItem value="business">Business</SelectItem>
                  <SelectItem value="lifestyle">Lifestyle</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Tags */}
            <div>
              <Label htmlFor="tags" className="text-base font-semibold text-slate-900 dark:text-white">
                Tags (comma-separated)
              </Label>
              <Input
                id="tags"
                placeholder="react, typescript, tutorial"
                className="mt-2"
                onChange={(e) => {
                  const tags = e.target.value.split(',').map(tag => tag.trim()).filter(Boolean);
                  form.setValue("tags", tags);
                }}
              />
            </div>

            {/* Post Stats */}
            <Card>
              <CardContent className="p-4">
                <h4 className="font-semibold text-slate-900 dark:text-white mb-3">Post Statistics</h4>
                <div className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                  <div className="flex justify-between">
                    <span>Word count:</span>
                    <span>{watchedContent?.split(' ').filter(Boolean).length || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Reading time:</span>
                    <span>{Math.max(1, Math.ceil((watchedContent?.split(' ').filter(Boolean).length || 0) / 200))} min</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Characters:</span>
                    <span>{watchedContent?.length || 0}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end space-x-4 pt-6 border-t border-slate-200 dark:border-slate-700">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push('/')}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={createMutation.isPending}
            className="bg-primary text-white hover:bg-blue-700"
          >
            {createMutation.isPending ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Publishing...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Publish Post
              </>
            )}
          </Button>
        </div>
      </form>
    </motion.div>
  );
}