
import html2canvas from "html2canvas";

export async function renderSection(html: string): Promise<HTMLCanvasElement> {
  const container = document.createElement("div");
  container.innerHTML = html;
  container.style.position = "absolute";
  container.style.left = "-9999px";
  container.style.top = "0";
  container.style.width = "794px"; // A4 width at 96DPI
  container.style.backgroundColor = "#ffffff";
  container.style.fontFamily = "'Arial', sans-serif";
  container.style.color = "#000000";
  container.style.lineHeight = "1.6";
  container.style.fontSize = "14px";
  container.style.padding = "0";
  container.style.margin = "0";
  container.style.visibility = "visible";
  container.style.display = "block";
  container.style.boxSizing = "border-box";
  document.body.appendChild(container);
  
  // Wait for DOM rendering and fonts to load
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Force all elements to be visible and properly styled
  const allElements = container.querySelectorAll('*');
  allElements.forEach(el => {
    const element = el as HTMLElement;
    element.style.visibility = 'visible';
    element.style.opacity = '1';
    element.style.transform = 'none';
    
    // Ensure flex layouts work properly
    if (element.style.display === 'flex' || getComputedStyle(element).display === 'flex') {
      element.style.display = 'flex';
    }
  });
  
  const canvas = await html2canvas(container, {
    scale: 2,
    useCORS: true,
    logging: false,
    backgroundColor: "#ffffff",
    width: 794,
    height: container.scrollHeight,
    allowTaint: false,
    foreignObjectRendering: false,
    removeContainer: false,
    onclone: (clonedDoc) => {
      const clonedContainer = clonedDoc.body.querySelector('div');
      if (clonedContainer) {
        // Ensure the cloned container is visible and properly positioned
        clonedContainer.style.position = 'static';
        clonedContainer.style.transform = 'none';
        clonedContainer.style.width = '794px';
        clonedContainer.style.margin = '0';
        clonedContainer.style.padding = '0';
        clonedContainer.style.fontFamily = "'Arial', sans-serif";
        clonedContainer.style.backgroundColor = '#ffffff';
        clonedContainer.style.color = '#000000';
        clonedContainer.style.visibility = 'visible';
        clonedContainer.style.display = 'block';
        clonedContainer.style.boxSizing = 'border-box';
        
        // Force all child elements to be visible and properly styled
        const allClonedElements = clonedContainer.querySelectorAll('*');
        allClonedElements.forEach(el => {
          const element = el as HTMLElement;
          element.style.visibility = 'visible';
          element.style.opacity = '1';
          element.style.color = element.style.color || '#000000';
          element.style.backgroundColor = element.style.backgroundColor || 'transparent';
          element.style.boxSizing = 'border-box';
          
          // Ensure flex layouts work in cloned document
          if (element.style.display === 'flex' || getComputedStyle(element).display === 'flex') {
            element.style.display = 'flex';
          }
        });
        
        // Ensure images are loaded and properly styled in cloned document
        const images = clonedContainer.querySelectorAll('img');
        images.forEach(img => {
          img.style.display = 'block';
          img.style.maxWidth = '100%';
          img.style.height = 'auto';
          img.style.visibility = 'visible';
        });
      }
    }
  });
  
  document.body.removeChild(container);
  return canvas;
}
