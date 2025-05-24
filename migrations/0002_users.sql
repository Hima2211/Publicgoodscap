-- Create users table
CREATE TABLE users (
  address TEXT PRIMARY KEY,
  username TEXT UNIQUE,
  name TEXT,
  email TEXT UNIQUE,
  bio TEXT,
  avatar_url TEXT,
  website TEXT,
  github TEXT,
  twitter TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create user_activities table for tracking user actions and points
CREATE TABLE user_activities (
  id SERIAL PRIMARY KEY,
  user_address TEXT NOT NULL REFERENCES users(address) ON DELETE CASCADE,
  activity_type TEXT NOT NULL,
  points INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  metadata JSONB
);

-- Create contributions table for tracking user contributions
CREATE TABLE contributions (
  id SERIAL PRIMARY KEY,
  user_address TEXT NOT NULL REFERENCES users(address) ON DELETE CASCADE,
  project_id INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  amount DECIMAL NOT NULL,
  transaction_hash TEXT,
  platform TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Add user-related columns to existing tables
ALTER TABLE projects
ADD COLUMN owner_address TEXT REFERENCES users(address) ON DELETE SET NULL;

-- Create indexes
CREATE INDEX idx_user_activities_user_address ON user_activities(user_address);
CREATE INDEX idx_contributions_user_address ON contributions(user_address);
CREATE INDEX idx_projects_owner_address ON projects(owner_address);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_email ON users(email);
