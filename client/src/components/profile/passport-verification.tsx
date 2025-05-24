import { useEffect, useState } from 'react';
import { useAuth } from '../../lib/auth';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';

interface PassportVerificationProps {
  className?: string;
}

export function PassportVerification({ className }: PassportVerificationProps) {
  const { user, verifyPassport, isLoading } = useAuth();
  const [isVerifying, setIsVerifying] = useState(false);

  const handleVerify = async () => {
    setIsVerifying(true);
    try {
      await verifyPassport();
    } catch (error) {
      console.error('Verification failed:', error);
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <Card className={className}>
      <div className="p-6">
        <h3 className="text-lg font-semibold mb-4">Gitcoin Passport Verification</h3>
        
        {user?.isPassportVerified ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Passport Score</span>
              <Badge variant="success">{user.passportScore?.toFixed(2)}</Badge>
            </div>
            
            <Progress value={user.passportScore ? user.passportScore * 100 : 0} className="h-2" />
            
            <div className="grid grid-cols-2 gap-4 mt-4">
              {user.stampCategories && Object.entries(user.stampCategories).map(([category, count]) => (
                <div key={category} className="bg-secondary p-3 rounded-lg">
                  <div className="text-sm font-medium">{category}</div>
                  <div className="text-2xl font-bold">{count}</div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Verify your identity and boost your impact score by connecting your Gitcoin Passport.
            </p>
            <Button
              onClick={handleVerify}
              disabled={isVerifying || isLoading}
              className="w-full"
            >
              {isVerifying ? "Verifying..." : "Connect Passport"}
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
}
