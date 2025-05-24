export interface User {
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
  ensName?: string;
  projects?: any[];
  totalPoints?: number;
  totalContributions?: number;
  impactScore?: number;
  isProjectOwner?: boolean;
  isProjectManager?: boolean;
  passportScore?: number;
  isPassportVerified?: boolean;
  stampCategories?: Record<string, number>;
  followers?: string[];
  following?: string[];
  projectsOwned?: string[];
  projectsSupported?: string[];
  projectsSignaled?: string[];
  badges?: string[];
  createdAt?: number;
  updatedAt?: number;
}

export interface UserStats {
  totalContributions: number;
  totalPoints: number;
  projects: number;
  impact: number;
}
