ALTER TABLE public.transcripts
  ADD COLUMN IF NOT EXISTS summary jsonb NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS action_items jsonb NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS summary_status text NOT NULL DEFAULT 'idle',
  ADD COLUMN IF NOT EXISTS summary_error text;