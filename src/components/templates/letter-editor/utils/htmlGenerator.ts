
import { EditorState } from 'lexical';

export const generateHtmlContent = (state: EditorState): string => {
  let htmlContent = '';
  
  state.read(() => {
    // Create a temporary DOM element to render the content
    const tempDiv = document.createElement('div');
    const root = state._nodeMap.get('root');
    
    if (root && root.getChildren) {
      const children = root.getChildren();
      
      children.forEach((node: any) => {
        if (node.getType) {
          const nodeType = node.getType();
          
          // Handle different node types
          if (nodeType === 'paragraph') {
            // Preserve empty paragraphs as they represent line breaks
            const text = node.getTextContent();
            tempDiv.innerHTML += `<p>${text || '&nbsp;'}</p>`;
          } 
          else if (nodeType === 'heading') {
            const tag = `h${node.getTag()}`;
            const text = node.getTextContent();
            tempDiv.innerHTML += `<${tag}>${text}</${tag}>`;
          }
          else if (nodeType === 'list') {
            const listType = node.getListType() === 'number' ? 'ol' : 'ul';
            tempDiv.innerHTML += `<${listType}>${node.getChildren().map((li: any) => 
              `<li>${li.getTextContent()}</li>`).join('')}</${listType}>`;
          }
          else if (nodeType === 'quote') {
            const text = node.getTextContent();
            tempDiv.innerHTML += `<blockquote>${text}</blockquote>`;
          }
          else if (nodeType === 'horizontalrule') {
            tempDiv.innerHTML += '<hr />';
          }
          else if (nodeType === 'variable') {
            const variableName = node.getVariableName();
            tempDiv.innerHTML += `<span class="variable">{{${variableName}}}</span>`;
          }
          else if (nodeType === 'block') {
            // For block nodes, extract their content
            const blockContent = node.getChildren()
              .map((child: any) => {
                if (child.getType() === 'paragraph') {
                  // Preserve empty paragraphs within blocks too
                  const text = child.getTextContent();
                  return `<p>${text || '&nbsp;'}</p>`;
                } 
                else if (child.getType() === 'heading') {
                  const headingTag = `h${child.getTag()}`;
                  return `<${headingTag}>${child.getTextContent()}</${headingTag}>`;
                } 
                else if (child.getType() === 'variable') {
                  const varName = child.getVariableName();
                  return `<span class="variable">{{${varName}}}</span>`;
                }
                else {
                  return child.getTextContent();
                }
              })
              .join('');
            tempDiv.innerHTML += blockContent;
          }
          else {
            // Default handling for other node types
            tempDiv.innerHTML += node.getTextContent();
          }
        }
      });
    }
    
    htmlContent = tempDiv.innerHTML;
  });
  
  return htmlContent;
};
