
// This file re-exports the functionality from the new modular structure
// to maintain backward compatibility for any imports that haven't been updated
import { 
  generateCoverLetterFromSuperbills, 
  generateCoverLetter, 
  generateOptionsFromSuperbill 
} from './cover-letter';
import type { CoverLetterOptions } from './cover-letter';

// Re-export everything
export { 
  generateCoverLetterFromSuperbills,
  generateCoverLetter,
  generateOptionsFromSuperbill
};

export type { CoverLetterOptions };
