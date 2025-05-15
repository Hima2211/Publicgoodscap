import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { FaComment, FaRetweet, FaDollarSign } from 'react-icons/fa';
import { BiUpvote } from 'react-icons/bi';

interface ActivityItem {
  id: number;
  type: 'comment' | 'upvote' | 'share' | 'fund';
  user: {
    name: string;
    avatar: string;
  };
  content?: string;
  amount?: number;
  createdAt: Date;
}

interface ActivityFeedProps {
  projectId: number;
}

export default function ActivityFeed({ projectId }: ActivityFeedProps) {
  const [loading, setLoading] = useState(false);

  // Mock data for now - will be replaced with real data from API
  const activityItems: ActivityItem[] = [
    {
      id: 1,
      type: 'fund',
      user: {
        name: 'Alice',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alice'
      },
      amount: 500,
      createdAt: new Date('2024-01-20T10:00:00')
    },
    {
      id: 2,
      type: 'comment',
      user: {
        name: 'Bob',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bob'
      },
      content: 'Great project! Love what you\'re building.',
      createdAt: new Date('2024-01-19T15:30:00')
    },
    {
      id: 3,
      type: 'share',
      user: {
        name: 'Carol',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Carol'
      },
      createdAt: new Date('2024-01-19T09:15:00')
    },
    {
      id: 4,
      type: 'upvote',
      user: {
        name: 'Dave',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Dave'
      },
      createdAt: new Date('2024-01-18T22:45:00')
    }
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'comment':
        return <FaComment className="h-4 w-4" />;
      case 'upvote':
        return <BiUpvote className="h-4 w-4" />;
      case 'share':
        return <FaRetweet className="h-4 w-4" />;
      case 'fund':
        return <FaDollarSign className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const getActivityText = (item: ActivityItem) => {
    switch (item.type) {
      case 'comment':
        return 'commented';
      case 'upvote':
        return 'upvoted';
      case 'share':
        return 'shared';
      case 'fund':
        return `funded ${formatCurrency(item.amount || 0)}`;
      default:
        return 'acted on';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {activityItems.map((item) => (
        <div key={item.id} className="flex items-start gap-3 p-3 rounded-lg bg-darkCard border border-darkBorder hover:bg-darkCard/50 transition-colors">
          <img
            src={item.user.avatar}
            alt={item.user.name}
            className="w-8 h-8 rounded-full"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <div className={`p-1.5 rounded-full ${
                item.type === 'fund' ? 'bg-success/10 text-success' :
                item.type === 'comment' ? 'bg-accent/10 text-accent' :
                item.type === 'share' ? 'bg-warning/10 text-warning' :
                'bg-primary/10 text-primary'
              }`}>
                {getActivityIcon(item.type)}
              </div>
              <div>
                <span className="font-medium text-white">{item.user.name}</span>
                <span className="mx-1.5 text-darkText">•</span>
                <span className="text-darkText">{getActivityText(item)}</span>
                <span className="block text-xs text-darkText/80">{formatDistanceToNow(item.createdAt, { addSuffix: true })}</span>
              </div>
            </div>
            {item.type === 'comment' && item.content && (
              <p className="mt-2 text-sm text-darkText">{item.content}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
