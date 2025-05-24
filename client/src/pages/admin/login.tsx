import { useState } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AdminHeader } from '@/components/admin/admin-header';
import { useToast } from '@/hooks/use-toast';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    if (!email.endsWith('@publicgoodscap.com')) {
      toast({
        title: "Invalid email",
        description: "Only @publicgoodscap.com email addresses are allowed",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }
    
    try {
      const success = await login(password); // Only pass password, not email
      if (success) {
        setLocation('/admin/dashboard');
        toast({
          title: "Login successful",
          description: "Welcome back, admin!",
        });
      } else {
        toast({
          title: "Login failed",
          description: "Invalid credentials. Please try again.",
          variant: "destructive",
        });
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-darkBg">
      <AdminHeader />
      <main className="flex items-center justify-center px-4 py-12 sm:px-6">
        <Card className="w-full max-w-[400px] bg-darkCard border-darkBorder">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Admin Login</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Input
                  type="email"
                  placeholder="admin@publicgoodscap.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-darkBg border-darkBorder"
                  required
                />
              </div>
              <div className="space-y-2">
                <Input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-darkBg border-darkBorder"
                  required
                />
              </div>
              <Button 
                type="submit" 
                className="w-full bg-accent hover:bg-accent/90 text-darkBg"
                disabled={isLoading}
              >
                {isLoading ? 'Signing in...' : 'Sign in'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
