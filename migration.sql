-- Migration to create the leads table for Meta Lead Ads
-- Run this in your Supabase SQL Editor

CREATE TABLE IF NOT EXISTS leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  leadgen_id TEXT UNIQUE NOT NULL,
  full_name TEXT,
  phone_number TEXT,
  email TEXT,
  created_time TIMESTAMPTZ,
  raw_payload JSONB DEFAULT '{}'::jsonb,
  inserted_at TIMESTAMPTZ DEFAULT now()
);

-- Disable Row Level Security (RLS) as requested/implied for service role usage or simple access
ALTER TABLE leads DISABLE ROW LEVEL SECURITY;

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS idx_leads_leadgen_id ON leads (leadgen_id);
