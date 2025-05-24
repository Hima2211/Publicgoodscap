import { useEffect, useState } from 'react';
import { useAuth } from '../../lib/auth';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';

interface ImpactPointsProps {
  className?: string;
}

export function ImpactPoints({ className }: ImpactPointsProps) {
  const { user, getPointHistory, calculateImpactScore } = useAuth();
  const [pointHistory, setPointHistory] = useState<any[]>([]);
  const [impactScore, setImpactScore] = useState<number>(0);

  useEffect(() => {
    const loadData = async () => {
      const [history, score] = await Promise.all([
        getPointHistory(),
        calculateImpactScore()
      ]);
      setPointHistory(history);
      setImpactScore(score);
    };

    if (user?.address) {
      loadData();
    }
  }, [user?.address]);

  return (
    <Card className={className}>
      <div className="p-6">
        <h3 className="text-lg font-semibold mb-4">Impact & Points</h3>
        
        <div className="space-y-6">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Impact Score</span>
              <Badge variant="default">{impactScore}</Badge>
            </div>
            <Progress value={impactScore} max={1000} className="h-2" />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Total Points</span>
              <span className="font-bold">{user?.totalPoints || 0}</span>
            </div>
            <div className="space-y-2 mt-4">
              {pointHistory.slice(0, 5).map((action, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">{action.type}</span>
                  <Badge variant="outline">+{action.points}</Badge>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-secondary p-3 rounded-lg">
              <div className="text-sm font-medium">Projects Supported</div>
              <div className="text-2xl font-bold">{user?.projectsSupported?.length || 0}</div>
            </div>
            <div className="bg-secondary p-3 rounded-lg">
              <div className="text-sm font-medium">Projects Signaled</div>
              <div className="text-2xl font-bold">{user?.projectsSignaled?.length || 0}</div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
