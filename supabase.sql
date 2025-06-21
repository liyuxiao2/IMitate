-- Create the users table to store user information
CREATE TABLE users (
    id UUID PRIMARY KEY REFERENCES auth.users(id),
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    total_score INTEGER DEFAULT 0
);

-- Create the history table to store case results for each user
CREATE TABLE history (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    patient_info JSONB,
    score INTEGER,
    submitted_diagnosis TEXT,
    submitted_aftercare TEXT,
    feedback TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Function to create a public user profile when a new user signs up in Supabase Auth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, username)
  VALUES (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'username'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to execute the function after a new user is inserted into the auth.users table
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Enable Row Level Security (RLS) for the tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE history ENABLE ROW LEVEL SECURITY;

-- Create policies for RLS
-- Users can see all other users' profiles (e.g., for leaderboards)
CREATE POLICY "Allow all users to view profiles" ON users
FOR SELECT USING (true);

-- Users can only insert their own profile
CREATE POLICY "Allow user to insert their own profile" ON users
FOR INSERT WITH CHECK (auth.uid() = id);

-- Users can only update their own profile
CREATE POLICY "Allow user to update their own profile" ON users
FOR UPDATE USING (auth.uid() = id);

-- Users can see their own history
CREATE POLICY "Allow user to view their own history" ON history
FOR SELECT USING (auth.uid() = user_id);

-- Users can only insert their own history
CREATE POLICY "Allow user to insert their own history" on history
FOR INSERT WITH CHECK (auth.uid() = user_id);
