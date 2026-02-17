-- Migration to create the leads table for Meta Lead Ads
-- Run this in your Supabase SQL Editor

CREATE TABLE IF NOT EXISTS leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  lead_id TEXT UNIQUE NOT NULL,
  page_id TEXT,
  form_id TEXT,
  ad_id TEXT,
  adgroup_id TEXT,
  campaign_id TEXT,
  created_time TIMESTAMPTZ,
  fields JSONB DEFAULT '{}'::jsonb,
  raw_data JSONB DEFAULT '{}'::jsonb,
  status TEXT DEFAULT 'new',
  inserted_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security (RLS)
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Create policy to allow the service_role key to do everything
-- (The backend uses the service_role key)
CREATE POLICY "Service role can do everything" ON leads
  USING (true)
  WITH CHECK (true);

-- Optional: Create an index for faster lookups by lead_id
CREATE INDEX IF NOT EXISTS idx_leads_lead_id ON leads (lead_id);
