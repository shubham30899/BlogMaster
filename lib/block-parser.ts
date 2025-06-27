import { ParsedBlock } from "@shared/schema";

export function parseBlocks(content: string): ParsedBlock[] {
  const blockRegex = /\{\{block\s+([^}]+)\}\}/g;
  const blocks: ParsedBlock[] = [];
  let match;

  while ((match = blockRegex.exec(content)) !== null) {
    const blockAttributes = match[1];
    const originalText = match[0];
    
    // Parse attributes
    const nameMatch = blockAttributes.match(/name=["']([^"']+)["']/);
    const imageMatch = blockAttributes.match(/image=["']([^"']+)["']/);
    const productsMatch = blockAttributes.match(/products=["']([^"']+)["']/);
    
    const block: ParsedBlock = {
      type: "product", // For now, all blocks are product blocks
      name: nameMatch ? nameMatch[1] : "Untitled Block",
      image: imageMatch ? imageMatch[1] : undefined,
      products: productsMatch ? productsMatch[1].split(',').map(s => s.trim()) : [],
      originalText,
    };
    
    blocks.push(block);
  }

  return blocks;
}

export function renderContentWithBlocks(content: string, blocks: ParsedBlock[]): string {
  let processedContent = content;
  
  blocks.forEach((block, index) => {
    const placeholder = `<div data-block-id="${index}"></div>`;
    processedContent = processedContent.replace(block.originalText, placeholder);
  });
  
  return processedContent;
}

export function getSnippet(content: string, maxLength: number = 200): string {
  // Remove block tags first
  const cleanContent = content.replace(/\{\{block\s+[^}]+\}\}/g, '');
  
  // Remove markdown headers and other formatting
  const textOnly = cleanContent
    .replace(/#+\s*/g, '') // Remove markdown headers
    .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold
    .replace(/\*(.*?)\*/g, '$1') // Remove italic
    .replace(/\[(.*?)\]\(.*?\)/g, '$1') // Remove links
    .trim();
  
  if (textOnly.length <= maxLength) {
    return textOnly;
  }
  
  return textOnly.substring(0, maxLength).trim() + '...';
}
