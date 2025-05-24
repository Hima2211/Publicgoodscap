import { formatDistanceToNow } from 'date-fns';
import { FaComment, FaRetweet } from 'react-icons/fa';
import { BiUpvote } from 'react-icons/bi';
import { useQuery } from '@tanstack/react-query';

interface ActivityItem {
  id: string;
  type: 'comment' | 'upvote' | 'share' | 'fund';
  user: {
    address: string;
    avatar?: string;
  };
  timestamp: string;
  content?: string;
  amount?: number;
}

interface ActivityFeedProps {
  projectId: number;
}

export default function ActivityFeed({ projectId }: ActivityFeedProps) {
  // Fetch activities from the API
  const { data: activities = [], isLoading } = useQuery<ActivityItem[]>({
    queryKey: ['activities', projectId],
    queryFn: async () => {
      try {
        const response = await fetch(`/api/projects/${projectId}/activities`);
        if (!response.ok) throw new Error('Failed to fetch activities');
        return response.json();
      } catch (error) {
        console.error('Error fetching activities:', error);
        return [];
      }
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-start gap-3 animate-pulse">
            <div className="w-10 h-10 rounded-full bg-muted" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-1/4 bg-muted rounded" />
              <div className="h-4 w-3/4 bg-muted rounded" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!activities.length) {
    return (
      <div className="text-center py-8">
        <p className="text-foreground">No activity yet</p>
      </div>
    );
  }

  const getActivityIcon = (type: ActivityItem['type']) => {
    switch (type) {
      case 'comment':
        return <FaComment className="h-4 w-4" />;
      case 'upvote':
        return <BiUpvote className="h-4 w-4" />;
      case 'share':
        return <FaRetweet className="h-4 w-4" />;
      case 'fund':
        return <span className="text-sm">💰</span>;
    }
  };

  const getActivityText = (activity: ActivityItem) => {
    const shortAddress = `${activity.user.address.slice(0, 6)}...${activity.user.address.slice(-4)}`;

    switch (activity.type) {
      case 'comment':
        return <span><span className="font-medium">{shortAddress}</span> commented: "{activity.content}"</span>;
      case 'upvote':
        return <span><span className="font-medium">{shortAddress}</span> upvoted the project</span>;
      case 'share':
        return <span><span className="font-medium">{shortAddress}</span> shared the project</span>;
      case 'fund':
        return <span><span className="font-medium">{shortAddress}</span> funded ${activity.amount}</span>;
    }
  };

  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg bg-card border border-border hover:bg-card/80 transition-colors">
          <img
            src={activity.user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${activity.user.address}`}
            alt="User avatar"
            className="w-10 h-10 rounded-full"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <div className={`p-1.5 rounded-full ${
                activity.type === 'fund' ? 'bg-success/10 text-success' :
                activity.type === 'comment' ? 'bg-accent/10 text-accent' :
                activity.type === 'share' ? 'bg-warning/10 text-warning' :
                'bg-primary/10 text-primary'
              }`}>
                {getActivityIcon(activity.type)}
              </div>
              <div>
                {getActivityText(activity)}
                <span className="block text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                </span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
