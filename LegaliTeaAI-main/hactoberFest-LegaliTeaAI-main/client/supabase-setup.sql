-- Create the summaries table for storing analysis results
CREATE TABLE IF NOT EXISTS summaries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) NOT NULL,
  original_text TEXT NOT NULL,
  analysis_result JSONB NOT NULL,
  document_type VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '24 hours'),
  saved BOOLEAN DEFAULT FALSE
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_summaries_email ON summaries(email);
CREATE INDEX IF NOT EXISTS idx_summaries_expires_at ON summaries(expires_at);
CREATE INDEX IF NOT EXISTS idx_summaries_created_at ON summaries(created_at);

-- Create a function to automatically delete expired records
CREATE OR REPLACE FUNCTION delete_expired_summaries()
RETURNS void AS $$
BEGIN
  DELETE FROM summaries WHERE expires_at < NOW() AND saved = FALSE;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to run the cleanup function periodically
-- Note: You'll need to set up a cron job or use Supabase Edge Functions for this
-- For now, expired records will be cleaned up when accessed