import { ParsedBlock } from "@shared/schema";
import { ProductBlock } from "./product-block";

interface BlockRendererProps {
  blocks: ParsedBlock[];
  content: string;
}

export function BlockRenderer({ blocks, content }: BlockRendererProps) {
  if (blocks.length === 0) {
    return <div className="prose prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: formatContent(content) }} />;
  }

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
            <div 
              key={`content-${index}`} 
              dangerouslySetInnerHTML={{ __html: formatContent(part) }} 
            />
          );
        }
        
        return null;
      })}
    </div>
  );
}

function formatContent(content: string): string {
  // Basic markdown-like formatting
  return content
    .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-bold text-slate-900 mt-8 mb-4">$1</h2>')
    .replace(/^### (.*$)/gim, '<h3 class="text-xl font-semibold text-slate-900 mt-6 mb-3">$1</h3>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/\n\n/g, '</p><p class="mb-6">')
    .replace(/^(?!<)(.+)$/gm, '<p class="mb-6">$1</p>')
    .replace(/<p class="mb-6"><\/p>/g, '');
}
