-- Create support_messages table
CREATE TABLE IF NOT EXISTS support_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  subject VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS support_messages_email_idx ON support_messages(email);
CREATE INDEX IF NOT EXISTS support_messages_created_at_idx ON support_messages(created_at DESC);

-- Enable RLS
ALTER TABLE support_messages ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert support messages
CREATE POLICY "Allow public insert" ON support_messages
  FOR INSERT
  WITH CHECK (true);
