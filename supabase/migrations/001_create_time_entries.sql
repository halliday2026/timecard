-- Create time_entries table
CREATE TABLE time_entries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  hours_worked NUMERIC(5, 2),
  start_time TIME,
  end_time TIME,
  city TEXT,
  state TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for query performance
CREATE INDEX idx_time_entries_user_id ON time_entries(user_id);
CREATE INDEX idx_time_entries_user_date ON time_entries(user_id, date);

-- Enable Row Level Security
ALTER TABLE time_entries ENABLE ROW LEVEL SECURITY;

-- RLS Policies: users can only access their own entries
CREATE POLICY "Users can view own entries"
  ON time_entries FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own entries"
  ON time_entries FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own entries"
  ON time_entries FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own entries"
  ON time_entries FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_time_entries_updated_at
  BEFORE UPDATE ON time_entries
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
