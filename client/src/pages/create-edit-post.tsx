import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useRoute, useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { insertPostSchema, type InsertPost, type Post } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { ArrowLeft, Save, Send, Eye, Upload, Package } from "lucide-react";

const categories = [
  { value: "technology", label: "Technology" },
  { value: "design", label: "Design" },
  { value: "programming", label: "Programming" },
  { value: "devops", label: "DevOps" },
  { value: "mobile", label: "Mobile" },
  { value: "ai-ml", label: "AI/ML" },
];

export default function CreateEditPost() {
  const [, setLocation] = useLocation();
  const [, params] = useRoute("/edit/:id");
  const isEditing = Boolean(params?.id);
  const postId = params?.id ? parseInt(params.id) : undefined;
  const { toast } = useToast();

  // Fetch post data if editing
  const { data: post, isLoading: isLoadingPost } = useQuery<Post>({
    queryKey: [`/api/posts/${postId}`],
    enabled: isEditing && !!postId,
  });

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

  // Update form values when post data loads
  useState(() => {
    if (post && isEditing) {
      form.reset({
        title: post.title,
        author: post.author,
        content: post.content,
        coverImage: post.coverImage || "",
        category: post.category || "",
        tags: post.tags || [],
      });
    }
  });

  const createMutation = useMutation({
    mutationFn: async (data: InsertPost) => {
      const response = await apiRequest("POST", "/api/posts", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/posts"] });
      toast({
        title: "Success",
        description: "Post created successfully!",
      });
      setLocation("/");
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create post",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: InsertPost) => {
      const response = await apiRequest("PUT", `/api/posts/${postId}`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/posts"] });
      queryClient.invalidateQueries({ queryKey: [`/api/posts/${postId}`] });
      toast({
        title: "Success",
        description: "Post updated successfully!",
      });
      setLocation("/");
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update post",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertPost) => {
    // Parse tags string to array
    const formData = {
      ...data,
      tags: typeof data.tags === "string" 
        ? data.tags.split(",").map(tag => tag.trim()).filter(Boolean)
        : data.tags || [],
    };

    if (isEditing) {
      updateMutation.mutate(formData);
    } else {
      createMutation.mutate(formData);
    }
  };

  if (isLoadingPost) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse space-y-8">
          <div className="h-8 bg-slate-200 rounded w-1/3"></div>
          <div className="space-y-4">
            <div className="h-12 bg-slate-200 rounded"></div>
            <div className="h-12 bg-slate-200 rounded"></div>
            <div className="h-48 bg-slate-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  const watchedTitle = form.watch("title");
  const watchedContent = form.watch("content");

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            {isEditing ? "Edit Post" : "Create New Post"}
          </h1>
          <p className="text-slate-600 mt-2">Share your knowledge with the community</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" disabled>
            <Save className="w-4 h-4 mr-2" />
            Save Draft
          </Button>
          <Button 
            onClick={form.handleSubmit(onSubmit)}
            disabled={createMutation.isPending || updateMutation.isPending}
          >
            <Send className="w-4 h-4 mr-2" />
            {isEditing ? "Update" : "Publish"}
          </Button>
        </div>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Title Field */}
        <div>
          <Label htmlFor="title">
            Post Title <span className="text-red-500">*</span>
          </Label>
          <Input
            id="title"
            placeholder="Enter an engaging title for your post"
            {...form.register("title")}
            className="mt-2"
          />
          {form.formState.errors.title && (
            <p className="text-sm text-red-600 mt-1">
              {form.formState.errors.title.message}
            </p>
          )}
        </div>

        {/* Author Field */}
        <div>
          <Label htmlFor="author">
            Author Name <span className="text-red-500">*</span>
          </Label>
          <Input
            id="author"
            placeholder="Your name"
            {...form.register("author")}
            className="mt-2"
          />
          {form.formState.errors.author && (
            <p className="text-sm text-red-600 mt-1">
              {form.formState.errors.author.message}
            </p>
          )}
        </div>

        {/* Cover Image Field */}
        <div>
          <Label htmlFor="coverImage">Cover Image URL</Label>
          <div className="flex space-x-3 mt-2">
            <Input
              id="coverImage"
              type="url"
              placeholder="https://example.com/image.jpg"
              {...form.register("coverImage")}
              className="flex-1"
            />
            <Button type="button" variant="outline">
              <Upload className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-sm text-slate-500 mt-1">Upload an image or provide a URL to an image</p>
        </div>

        {/* Content Field */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <Label htmlFor="content">
              Post Content <span className="text-red-500">*</span>
            </Label>
            <div className="flex items-center space-x-2">
              <Button type="button" variant="outline" size="sm">
                <Package className="w-4 h-4 mr-1" />
                Insert Block
              </Button>
            </div>
          </div>
          <Textarea
            id="content"
            rows={20}
            placeholder={`Write your post content here...

You can use dynamic blocks like:
{{block name="Top Picks" image="/products.png" products="SKU123,SKU456"}}

This will render a custom product display component in your post.`}
            {...form.register("content")}
            className="font-mono text-sm"
          />
          {form.formState.errors.content && (
            <p className="text-sm text-red-600 mt-1">
              {form.formState.errors.content.message}
            </p>
          )}
          <div className="mt-2 text-sm text-slate-500">
            <p className="mb-1"><strong>Dynamic Blocks:</strong> Use {"{{block}}"} syntax to embed custom components</p>
            <code className="text-xs bg-slate-100 p-2 rounded block">
              {"{{block name=\"Block Title\" image=\"/image.png\" products=\"SKU123,SKU456\"}}"}
            </code>
          </div>
        </div>

        {/* Category and Tags */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="category">Category</Label>
            <Select
              value={form.watch("category") || ""}
              onValueChange={(value) => form.setValue("category", value)}
            >
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="tags">Tags</Label>
            <Input
              id="tags"
              placeholder="nextjs, typescript, react (comma separated)"
              {...form.register("tags")}
              className="mt-2"
            />
          </div>
        </div>

        {/* Preview Section */}
        <div className="border-t border-slate-200 pt-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-900">Preview</h3>
            <Button type="button" variant="outline" size="sm">
              <Eye className="w-4 h-4 mr-2" />
              Full Preview
            </Button>
          </div>
          <Card className="bg-slate-50">
            <CardContent className="p-6">
              <Card className="bg-white shadow-sm border border-slate-200 overflow-hidden">
                <div className="h-48 bg-slate-200 flex items-center justify-center">
                  <span className="text-slate-400">Cover Image Preview</span>
                </div>
                <div className="p-6">
                  <div className="flex items-center space-x-2 mb-3">
                    <span className="bg-primary/10 text-primary px-2 py-1 rounded-full text-xs font-medium">
                      {form.watch("category") || "Category"}
                    </span>
                    <span className="text-slate-500 text-xs">Just now</span>
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-3">
                    {watchedTitle || "Your Post Title Will Appear Here"}
                  </h3>
                  <p className="text-slate-600 mb-4">
                    {watchedContent 
                      ? watchedContent.substring(0, 200) + (watchedContent.length > 200 ? "..." : "")
                      : "Your post content preview will be displayed here once you start typing..."
                    }
                  </p>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-slate-300 rounded-full"></div>
                    <span className="text-sm font-medium text-slate-700">
                      {form.watch("author") || "Your Name"}
                    </span>
                  </div>
                </div>
              </Card>
            </CardContent>
          </Card>
        </div>

        {/* Form Actions */}
        <div className="flex items-center justify-between pt-6 border-t border-slate-200">
          <Button 
            type="button" 
            variant="ghost" 
            onClick={() => setLocation("/")}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Posts
          </Button>
          <div className="flex items-center space-x-3">
            <Button type="button" variant="outline" disabled>
              Save Draft
            </Button>
            <Button 
              type="submit"
              disabled={createMutation.isPending || updateMutation.isPending}
            >
              {isEditing ? "Update Post" : "Publish Post"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
