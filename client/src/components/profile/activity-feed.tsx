import { useEffect, useState } from 'react';
import { useAuth } from '../../lib/auth';
import { Avatar } from '../ui/avatar';
import { Card } from '../ui/card';

interface Activity {
  id: string;
  type: string;
  points: number;
  timestamp: string;
  metadata: Record<string, any>;
}

export function ActivityFeed() {
  const { user } = useAuth();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await fetch(`/api/users/${user?.address}/activities`);
        const data = await response.json();
        setActivities(data);
      } catch (error) {
        console.error('Failed to fetch activities:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (user?.address) {
      fetchActivities();
    }
  }, [user?.address]);

  const formatActivity = (activity: Activity) => {
    switch (activity.type) {
      case 'contribution':
        return `Contributed ${activity.metadata.amount} to ${activity.metadata.projectName}`;
      case 'project_created':
        return `Created a new project: ${activity.metadata.projectName}`;
      case 'comment':
        return `Commented on ${activity.metadata.projectName}`;
      default:
        return 'Unknown activity';
    }
  };

  if (isLoading) {
    return <div>Loading activities...</div>;
  }

  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <Card key={activity.id} className="p-4 flex items-start space-x-4">
          <Avatar src={user?.avatar_url} fallback={user?.name?.[0] || 'U'} />
          <div className="flex-1">
            <p className="text-sm text-gray-900">{formatActivity(activity)}</p>
            <p className="text-xs text-gray-500">
              {new Date(activity.timestamp).toLocaleDateString()}
              {activity.points > 0 && ` • ${activity.points} points`}
            </p>
          </div>
        </Card>
      ))}
      {activities.length === 0 && (
        <p className="text-center text-gray-500">No activities yet</p>
      )}
    </div>
  );
