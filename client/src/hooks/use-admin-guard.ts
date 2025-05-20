import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '@/lib/auth';

export function useAdminGuard() {
  const { isAdmin } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!isAdmin) {
      setLocation('/admin/login');
    }
  }, [isAdmin, setLocation]);

  return isAdmin;
}
