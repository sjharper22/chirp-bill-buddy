
import { generateBaseStyles } from "./styles/base-styles";
import { generateComponentStyles } from "./styles/component-styles";
import { generatePrintStyles } from "./styles/print-styles";

export function generatePrintableCSS(): string {
  return [
    generateBaseStyles(),
    generateComponentStyles(),
    generatePrintStyles()
  ].join('\n');
}
