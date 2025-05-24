import { Request, Response, NextFunction } from 'express';
import { supabaseAdmin } from '../supabase';
import { verifyMessage } from 'ethers';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    address: string;
    isAdmin: boolean;
  };
}

// Verify Web3 authentication
export const verifyWeb3Auth = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ message: "No signature provided" });
  }

  const [, signature] = authHeader.split(' ');
  const address = req.headers['x-wallet-address'] as string;
  const message = req.headers['x-auth-message'] as string;

  if (!address || !message) {
    return res.status(401).json({ message: "Missing authentication parameters" });
  }

  try {
    // Verify the signature
    const recoveredAddress = verifyMessage(message, signature);
    
    if (recoveredAddress.toLowerCase() !== address.toLowerCase()) {
      throw new Error('Invalid signature');
    }

    // Get or create user profile
    const { data: profile, error } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('address', address.toLowerCase())
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 is "not found"
      throw error;
    }

    if (!profile) {
      // Create new profile
      const { data: newProfile, error: createError } = await supabaseAdmin
        .from('profiles')
        .insert([{ address: address.toLowerCase() }])
        .select()
        .single();

      if (createError) throw createError;
      req.user = {
        id: newProfile.id,
        address: newProfile.address,
        isAdmin: false
      };
    } else {
      req.user = {
        id: profile.id,
        address: profile.address,
        isAdmin: profile.role === 'admin'
      };
    }

    next();
  } catch (err) {
    console.error('Auth error:', err);
    return res.status(401).json({ message: "Invalid authentication" });
  }
};

export const requireAdmin = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  if (!req.user?.isAdmin) {
    return res.status(403).json({ message: "Admin access required" });
  }
  next();
};