-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profiles table
CREATE TABLE profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    address TEXT UNIQUE NOT NULL,
    username TEXT UNIQUE,
    name TEXT,
    email TEXT UNIQUE,
    bio TEXT,
    avatar_url TEXT,
    website TEXT,
    github TEXT,
    twitter TEXT,
    lens TEXT,
    farcaster TEXT,
    ens_name TEXT,
    passport_score FLOAT,
    is_passport_verified BOOLEAN DEFAULT false,
    impact_score INTEGER DEFAULT 0,
    total_points INTEGER DEFAULT 0,
    total_contributions DECIMAL(20,8) DEFAULT 0,
    stamp_categories JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create activities table
CREATE TABLE activities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID NOT NULL REFERENCES profiles(id),
    type TEXT NOT NULL,
    points INTEGER NOT NULL DEFAULT 0,
    metadata JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create projects table
CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    owner_id UUID NOT NULL REFERENCES profiles(id),
    name TEXT NOT NULL,
    description TEXT,
    website TEXT,
    github TEXT,
    twitter TEXT,
    image_url TEXT,
    category TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'draft',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create project_signals table
CREATE TABLE project_signals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id),
    profile_id UUID NOT NULL REFERENCES profiles(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(project_id, profile_id)
);

-- Create project_contributions table
CREATE TABLE project_contributions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id),
    profile_id UUID NOT NULL REFERENCES profiles(id),
    amount DECIMAL(20,8) NOT NULL,
    token_symbol TEXT NOT NULL,
    tx_hash TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create followers table
CREATE TABLE followers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    follower_id UUID NOT NULL REFERENCES profiles(id),
    following_id UUID NOT NULL REFERENCES profiles(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(follower_id, following_id)
);

-- Create profile_badges table
CREATE TABLE profile_badges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID NOT NULL REFERENCES profiles(id),
    badge_type TEXT NOT NULL,
    metadata JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(profile_id, badge_type)
);

-- Add indexes
CREATE INDEX idx_profiles_address ON profiles(address);
CREATE INDEX idx_activities_profile_id ON activities(profile_id);
CREATE INDEX idx_projects_owner_id ON projects(owner_id);
CREATE INDEX idx_project_signals_project_id ON project_signals(project_id);
CREATE INDEX idx_project_signals_profile_id ON project_signals(profile_id);
CREATE INDEX idx_project_contributions_project_id ON project_contributions(project_id);
CREATE INDEX idx_project_contributions_profile_id ON project_contributions(profile_id);
CREATE INDEX idx_followers_follower_id ON followers(follower_id);
CREATE INDEX idx_followers_following_id ON followers(following_id);
CREATE INDEX idx_profile_badges_profile_id ON profile_badges(profile_id);

-- Add updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_projects_updated_at
    BEFORE UPDATE ON projects
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();
