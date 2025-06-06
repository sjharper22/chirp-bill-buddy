
import { generateBaseStyles } from "./styles/base-styles";
import { generateComponentStyles } from "./styles/component-styles";
import { generatePrintStyles } from "./styles/print-styles";
import { generateTypographyStyles } from "./styles/typography";
import { generateProfessionalLayoutStyles } from "./styles/professional-layout";
import { generatePrintOptimizationStyles } from "./styles/print-optimization";

export function generatePrintableCSS(): string {
  return [
    generateTypographyStyles(),
    generateBaseStyles(),
    generateProfessionalLayoutStyles(),
    generateComponentStyles(),
    generatePrintStyles(),
    generatePrintOptimizationStyles()
  ].join('\n');
}
