'use client'
import { ParsedBlock } from "@/shared/schema";
import { ProductBlock } from "./product-block";
import { marked } from "marked";
import { useEffect, useState } from "react";

interface BlockRendererProps {
  blocks: ParsedBlock[];
  content: string;
}

export function BlockRenderer({ blocks, content }: BlockRendererProps) {
  
  // if (blocks.length === 0) {
  //   return <div className="prose prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: formatContent(content) }} />;
  // }

  let processedContent = content;
  
  // Replace block tags with placeholders
  blocks.forEach((block, index) => {
    const placeholder = `<div data-block-placeholder="${index}"></div>`;
    processedContent = processedContent.replace(block.originalText, placeholder);
  });

  // Split content by block placeholders
  const parts = processedContent.split(/(<div data-block-placeholder="\d+"><\/div>)/);
  
  return (
    <div className="prose prose-lg max-w-none">
      {parts.map((part, index) => {
        const blockMatch = part.match(/data-block-placeholder="(\d+)"/);
        if (blockMatch) {
          const blockIndex = parseInt(blockMatch[1]);
          const block = blocks[blockIndex];
          if (block) {
            return <ProductBlock key={`block-${blockIndex}`} block={block} />;
          }
        }
        
        if (part.trim()) {
          return (
            <AsyncFormattedContent key={`content-${index}`} content={part} />
          );
        }

        return null;
      })}
    </div>
  );
}

export async function formatContent(content: string): Promise<string> {
  // Configure marked for better HTML output
  marked.setOptions({
    breaks: true,
    gfm: true,
  });

  // Parse markdown to HTML
  const htmlContent = await marked(content);
  
  // Add custom classes to the generated HTML
  return htmlContent
    .replace(/<h2>/g, '<h2 class="text-2xl font-bold text-slate-900 dark:text-white mt-8 mb-4">')
    .replace(/<h3>/g, '<h3 class="text-xl font-semibold text-slate-900 dark:text-white mt-6 mb-3">')
    .replace(/<h4>/g, '<h4 class="text-lg font-semibold text-slate-900 dark:text-white mt-4 mb-2">')
    .replace(/<p>/g, '<p class="mb-6 text-slate-700 dark:text-slate-300">')
    .replace(/<strong>/g, '<strong class="font-semibold text-slate-900 dark:text-white">')
    .replace(/<code>/g, '<code class="bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded text-sm font-mono">')
    .replace(/<pre>/g, '<pre class="bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto my-6">')
    .replace(/<blockquote>/g, '<blockquote class="border-l-4 border-primary pl-4 italic text-slate-600 dark:text-slate-400 my-6">')
    .replace(/<ul>/g, '<ul class="list-disc list-inside mb-6 text-slate-700 dark:text-slate-300">')
    .replace(/<ol>/g, '<ol class="list-decimal list-inside mb-6 text-slate-700 dark:text-slate-300">')
    .replace(/<li>/g, '<li class="mb-2">');
}


function AsyncFormattedContent({ content }: { content: string }) {
  const [html, setHtml] = useState("");

  useEffect(() => {
    formatContent(content).then(setHtml);
  }, [content]);

  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}

