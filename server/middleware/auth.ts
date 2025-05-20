import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import supabase from '../supabase';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    isAdmin: boolean;
  };
}

export const verifyToken = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(' ')[1];
  
  try {
    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    if (error || !user) {
      throw new Error('Invalid token');
    }

    req.user = {
      id: user.id,
      email: user.email || '',
      isAdmin: user.email?.endsWith('@publicgoodscap.com') || false
    };

    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

export const requireAdmin = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  if (!req.user?.isAdmin) {
    return res.status(403).json({ message: "Admin access required" });
  }
  next();
};