
-- Add new columns for admission form updates
ALTER TABLE public.admission_applications 
  ADD COLUMN IF NOT EXISTS father_name text,
  ADD COLUMN IF NOT EXISTS cnic_bform text,
  ADD COLUMN IF NOT EXISTS whatsapp_number text;

-- Make father_name required for new submissions (but nullable for existing rows)
-- We'll handle validation in the frontend
