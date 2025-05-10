
import { useState, useEffect } from 'react';
import { EditorState } from 'lexical';
import { generateHtmlContent } from '../utils/htmlGenerator';

interface UseEditorStateProps {
  initialContent: string;
  onChange: (content: string, htmlContent?: string) => void;
}

export const useEditorState = ({ initialContent, onChange }: UseEditorStateProps) => {
  const [editorState, setEditorState] = useState<string | null>(null);
  const [isEditorInitialized, setIsEditorInitialized] = useState(false);
  
  // Initialize the editor with the content when it mounts
  useEffect(() => {
    if (initialContent && !isEditorInitialized) {
      try {
        setEditorState(initialContent);
        setIsEditorInitialized(true);
      } catch (error) {
        console.error('Error initializing editor with content:', error);
      }
    }
  }, [initialContent, isEditorInitialized]);
  
  const handleEditorChange = (state: EditorState) => {
    state.read(() => {
      const json = JSON.stringify(state.toJSON());
      
      // Generate HTML representation for preview
      const htmlContent = generateHtmlContent(state);
      
      onChange(json, htmlContent);
    });
  };
  
  return {
    editorState,
    isEditorInitialized,
    handleEditorChange
  };
};
