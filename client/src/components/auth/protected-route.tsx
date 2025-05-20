import { ReactNode, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '../../lib/auth.tsx';

interface ProtectedRouteProps {
  children: ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAdmin, user } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    // If no user is logged in, redirect to login
    if (!user) {
      setLocation('/admin/login');
      return;
    }
    
    // If user is logged in but not admin, show error and redirect
    if (user && !isAdmin) {
      console.error('Access denied: User does not have admin privileges');
      setLocation('/admin/login');
    }
  }, [isAdmin, user, setLocation]);

  // Show nothing while checking auth status
  if (!user || !isAdmin) {
    return null;
  }

  return <>{children}</>;
}
