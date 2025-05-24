import { ReactNode, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '../../lib/auth.tsx';

interface ProtectedRouteProps {
  children: ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAdmin } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!isAdmin) {
      setLocation('/admin/login');
    }
  }, [isAdmin, setLocation]);

  if (!isAdmin) {
    return null;
  }

  return <>{children}</>;
}
