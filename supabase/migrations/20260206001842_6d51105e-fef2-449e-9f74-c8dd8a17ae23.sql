-- Add video_prompts column to saved_reels table
ALTER TABLE public.saved_reels 
ADD COLUMN IF NOT EXISTS video_prompts JSONB;