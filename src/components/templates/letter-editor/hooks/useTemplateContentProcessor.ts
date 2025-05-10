
import { useState, useEffect } from 'react';

export function useTemplateContentProcessor() {
  const [previewContent, setPreviewContent] = useState("");

  // Process content for preview - converts JSON if needed or uses HTML
  const processContentForPreview = (rawContent: string) => {
    try {
      // Check if content is JSON (Lexical format)
      const parsedContent = JSON.parse(rawContent);
      
      // If it's JSON, convert it to a readable format
      if (parsedContent && typeof parsedContent === 'object') {
        // Create a simple HTML representation of the content
        let previewHtml = '';
        
        try {
          // Try to extract text content from the Lexical JSON structure
          if (parsedContent.root && parsedContent.root.children) {
            parsedContent.root.children.forEach((node: any) => {
              if (node.type === 'paragraph') {
                let text = '';
                if (node.children) {
                  node.children.forEach((child: any) => {
                    if (child.type === 'text') {
                      text += child.text;
                    }
                  });
                }
                previewHtml += `<p>${text}</p>`;
              } else if (node.type === 'heading') {
                const headingLevel = node.tag || 'h2';
                let text = '';
                if (node.children) {
                  node.children.forEach((child: any) => {
                    if (child.type === 'text') {
                      text += child.text;
                    }
                  });
                }
                previewHtml += `<${headingLevel}>${text}</${headingLevel}>`;
              }
            });
          }
        } catch (parseError) {
          // Fallback for simple display
          previewHtml = `<p>${rawContent.substring(0, 100)}...</p>`;
        }
        
        setPreviewContent(previewHtml);
      } else {
        // If not valid JSON, use as plain text
        setPreviewContent(`<p>${rawContent}</p>`);
      }
    } catch (e) {
      // Not JSON, treat as plain text
      // Replace variables with styled spans
      const formattedContent = rawContent.replace(/\{\{([^}]+)\}\}/g, 
        (match) => `<span class="bg-blue-100 px-1 rounded">${match}</span>`);
      
      // Convert newlines to paragraph breaks
      const htmlContent = formattedContent
        .split('\n\n')
        .map(para => `<p>${para.replace(/\n/g, '<br>')}</p>`)
        .join('');
      
      setPreviewContent(htmlContent);
    }
  };

  return {
    previewContent,
    setPreviewContent,
    processContentForPreview
  };
}
