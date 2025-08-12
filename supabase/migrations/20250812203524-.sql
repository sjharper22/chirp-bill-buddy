-- Create magic_link_tokens table for one-tap confirmations
CREATE TABLE IF NOT EXISTS public.magic_link_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  token TEXT NOT NULL UNIQUE,
  user_id UUID NOT NULL,
  action TEXT NOT NULL,
  payload JSONB,
  expires_at TIMESTAMPTZ NOT NULL DEFAULT (now() + interval '7 days'),
  used_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.magic_link_tokens ENABLE ROW LEVEL SECURITY;

-- Policies: owners can insert/select their own tokens (service role bypasses RLS)
CREATE POLICY "Users can create their own magic tokens"
ON public.magic_link_tokens
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own magic tokens"
ON public.magic_link_tokens
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Only admins can delete tokens
CREATE POLICY "Only admins can delete magic tokens"
ON public.magic_link_tokens
FOR DELETE
USING (has_role('admin'::app_role));

-- Trigger to maintain updated_at
CREATE TRIGGER set_magic_link_tokens_updated_at
BEFORE UPDATE ON public.magic_link_tokens
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Helpful indexes
CREATE INDEX IF NOT EXISTS idx_magic_tokens_token ON public.magic_link_tokens (token);
CREATE INDEX IF NOT EXISTS idx_magic_tokens_expires_used ON public.magic_link_tokens (expires_at, used_at);
