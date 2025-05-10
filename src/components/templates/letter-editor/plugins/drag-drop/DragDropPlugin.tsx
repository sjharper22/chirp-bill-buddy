
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { useEffect, useRef } from 'react';
import { COMMAND_PRIORITY_HIGH, createCommand, LexicalCommand, LexicalEditor } from 'lexical';
import { $isBlockNode } from '../../nodes/BlockNode';

export const DRAG_BLOCK_START: LexicalCommand<DragEvent> = createCommand();
export const DRAG_BLOCK_END: LexicalCommand<DragEvent | null> = createCommand();

export function DragDropPlugin(): null {
  const [editor] = useLexicalComposerContext();
  const draggedNodeKey = useRef<string | null>(null);

  useEffect(() => {
    // Set up drag and drop functionality
    const rootElement = editor.getRootElement();
    if (!rootElement) return;

    const handleDragStart = (event: DragEvent) => {
      const target = event.target as HTMLElement;
      const dragHandle = target.closest('[data-drag-handle="true"]');
      
      if (dragHandle) {
        // Find the block element
        const blockElement = dragHandle.closest('.group');
        if (!blockElement) return;
        
        editor.update(() => {
          editor.dispatchCommand(DRAG_BLOCK_START, event);
        });

        // Set drag effect and data
        if (event.dataTransfer) {
          event.dataTransfer.effectAllowed = 'move';
          
          // Create a drag image to show while dragging
          const dragImage = document.createElement('div');
          dragImage.textContent = 'Block being dragged';
          dragImage.style.position = 'absolute';
          dragImage.style.top = '-9999px';
          document.body.appendChild(dragImage);
          
          event.dataTransfer.setDragImage(dragImage, 0, 0);
          
          // Clean up after drag is complete
          setTimeout(() => {
            document.body.removeChild(dragImage);
          }, 0);
        }
      }
    };

    const handleDragOver = (event: DragEvent) => {
      event.preventDefault();
      if (event.dataTransfer) {
        event.dataTransfer.dropEffect = 'move';
      }
    };

    const handleDrop = (event: DragEvent) => {
      event.preventDefault();
      editor.update(() => {
        editor.dispatchCommand(DRAG_BLOCK_END, event);
      });
    };

    const handleDragEnd = () => {
      editor.update(() => {
        editor.dispatchCommand(DRAG_BLOCK_END, null);
      });
    };

    rootElement.addEventListener('dragstart', handleDragStart);
    rootElement.addEventListener('dragover', handleDragOver);
    rootElement.addEventListener('drop', handleDrop);
    rootElement.addEventListener('dragend', handleDragEnd);

    return () => {
      rootElement.removeEventListener('dragstart', handleDragStart);
      rootElement.removeEventListener('dragover', handleDragOver);
      rootElement.removeEventListener('drop', handleDrop);
      rootElement.removeEventListener('dragend', handleDragEnd);
    };
  }, [editor]);

  // Register command listeners
  useEffect(() => {
    const dragStartListener = editor.registerCommand(
      DRAG_BLOCK_START,
      (event) => {
        // Find the node key from the DOM element being dragged
        const target = event.target as HTMLElement;
        const blockElement = target.closest('.group');
        if (!blockElement) return false;
        
        // Store the node key for use in drop
        // In a real implementation, we'd use dataset attributes or element identification
        // to determine which node is being dragged
        draggedNodeKey.current = 'placeholder-key';
        
        return true;
      },
      COMMAND_PRIORITY_HIGH
    );

    const dragEndListener = editor.registerCommand(
      DRAG_BLOCK_END,
      (event) => {
        if (!draggedNodeKey.current) return false;
        if (!event) {
          // Drag cancelled
          draggedNodeKey.current = null;
          return true;
        }
        
        // Implement actual block movement here
        // This would involve finding the target position and moving the dragged node
        
        // Reset drag state
        draggedNodeKey.current = null;
        return true;
      },
      COMMAND_PRIORITY_HIGH
    );

    return () => {
      dragStartListener();
      dragEndListener();
    };
  }, [editor]);

  return null;
}
