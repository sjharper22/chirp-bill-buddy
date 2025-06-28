
-- Update the visits table to support itemized CPT codes
-- We'll add a new column for itemized CPT codes while keeping the old one for backward compatibility
ALTER TABLE visits 
ADD COLUMN cpt_code_entries jsonb DEFAULT '[]'::jsonb;

-- Add a comment to explain the new structure
COMMENT ON COLUMN visits.cpt_code_entries IS 'Array of objects with structure: {code: string, description: string, fee: number}';

-- Update existing visits to migrate simple CPT codes to the new structure
-- This assumes a default fee and generic descriptions for existing codes
UPDATE visits 
SET cpt_code_entries = (
  SELECT jsonb_agg(
    jsonb_build_object(
      'code', cpt_code,
      'description', 'Service rendered',
      'fee', COALESCE(fee / jsonb_array_length(cpt_codes), 0)
    )
  )
  FROM jsonb_array_elements_text(cpt_codes) AS cpt_code
)
WHERE cpt_codes IS NOT NULL 
AND jsonb_array_length(cpt_codes) > 0
AND cpt_code_entries = '[]'::jsonb;
