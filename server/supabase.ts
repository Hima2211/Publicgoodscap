import { createClient } from '@supabase/supabase-js';
import { CONFIG } from './config';

const { url: supabaseUrl, serviceRoleKey } = CONFIG.supabase;

// Create Supabase client with service role key for backend operations
export const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);

// Create Supabase client with anonymous key for frontend operations
export const supabase = createClient(supabaseUrl, CONFIG.supabase.anonKey);

// Database types
export type Profile = {
  id: string;
  address: string;
  username?: string;
  name?: string;
  email?: string;
  bio?: string;
  avatar_url?: string;
  website?: string;
  github?: string;
  twitter?: string;
  lens?: string;
  farcaster?: string;
  ens_name?: string;
  passport_score?: number;
  is_passport_verified?: boolean;
  impact_score?: number;
  total_points?: number;
  total_contributions?: number;
  stamp_categories?: Record<string, number>;
  created_at?: string;
  updated_at?: string;
};

export type Activity = {
  id: string;
  profile_id: string;
  type: string;
  points: number;
  metadata: Record<string, any>;
  created_at: string;
};

export type Project = {
  id: string;
  owner_id: string;
  name: string;
  description: string;
  website?: string;
  github?: string;
  twitter?: string;
  image_url?: string;
  category: string;
  status: string;
  created_at: string;
  updated_at: string;
};
