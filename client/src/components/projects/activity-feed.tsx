import { useQuery } from '@tanstack/react-query';
import { formatDistanceToNow } from 'date-fns';
import { FaComment, FaRetweet } from 'react-icons/fa';
import { BiUpvote } from 'react-icons/bi';

interface ActivityItem {
  id: number;
  type: 'comment' | 'upvote' | 'share' | 'fund';
  user: {
    address: string;
    avatar: string;
  };
  content?: string;
  amount?: number;
  createdAt: Date;
}

interface ActivityFeedProps {
  projectId: number;
}

export function ActivityFeed({ projectId }: ActivityFeedProps) {
  // Mock data for development - replace with actual API call later
  const mockActivities: ActivityItem[] = [
    {
      id: 1,
      type: 'fund',
      user: {
        address: '0x1234...5678',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alice'
      },
      amount: 1500,
      createdAt: new Date('2024-01-20T10:00:00')
    },
    {
      id: 2,
      type: 'comment',
      user: {
        address: '0x8765...4321',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bob'
      },
      content: 'Great project! Love what you\'re building.',
      createdAt: new Date('2024-01-19T15:30:00')
    },
    {
      id: 3,
      type: 'share',
      user: {
        address: '0x9876...2109',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Carol'
      },
      createdAt: new Date('2024-01-19T09:15:00')
    },
    {
      id: 4,
      type: 'upvote',
      user: {
        address: '0x5432...7890',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Dave'
      },
      createdAt: new Date('2024-01-19T08:45:00')
    }
  ];

  const { data: activities = mockActivities, isLoading } = useQuery<ActivityItem[]>({
    queryKey: ['activities', projectId],
    queryFn: async () => {
      // In development, return mock data
      if (process.env.NODE_ENV === 'development') {
        return mockActivities;
      }
      
      const response = await fetch(`/api/projects/${projectId}/activities`);
      if (!response.ok) throw new Error('Failed to fetch activities');
      return response.json();
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

  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <div key={activity.id} className="flex items-start gap-3">
          <img
            src={activity.user.avatar}
            alt={`${activity.user.address} avatar`}
            className="w-10 h-10 rounded-full"
          />
          <div className="flex-1">
            <p className="text-sm text-muted-foreground">
              <span className="font-medium text-foreground">
                {activity.user.address.slice(0, 6)}...{activity.user.address.slice(-4)}
              </span>{' '}
              {activity.type === 'fund' && (
                <>
                  funded <span className="font-medium">${activity.amount?.toLocaleString()}</span>
                </>
              )}
              {activity.type === 'comment' && 'commented'}
              {activity.type === 'share' && 'shared'}
              {activity.type === 'upvote' && 'upvoted'}
              <span className="ml-2">
                {formatDistanceToNow(activity.createdAt, { addSuffix: true })}
              </span>
            </p>
            {activity.content && (
              <p className="mt-1 text-foreground">{activity.content}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
