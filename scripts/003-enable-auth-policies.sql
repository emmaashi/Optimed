-- Enable Row Level Security on users table
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see and edit their own data
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON users
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Enable RLS on queue_entries
ALTER TABLE queue_entries ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own queue entries
CREATE POLICY "Users can view own queue entries" ON queue_entries
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own queue entries" ON queue_entries
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own queue entries" ON queue_entries
  FOR UPDATE USING (auth.uid() = user_id);

-- Enable RLS on chat_sessions
ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own chat sessions
CREATE POLICY "Users can view own chat sessions" ON chat_sessions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own chat sessions" ON chat_sessions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own chat sessions" ON chat_sessions
  FOR UPDATE USING (auth.uid() = user_id);

-- Hospitals table can be read by all authenticated users
ALTER TABLE hospitals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view hospitals" ON hospitals
  FOR SELECT USING (auth.role() = 'authenticated');
