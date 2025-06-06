
import { generateBaseStyles } from "./styles/base-styles";
import { generateComponentStyles } from "./styles/component-styles";
import { generatePrintStyles } from "./styles/print-styles";
import { headerStyles } from "./styles/header-styles";

export function generatePrintableCSS(): string {
  return [
    generateBaseStyles(),
    generateComponentStyles(),
    headerStyles,
    generatePrintStyles()
  ].join('\n');
}
