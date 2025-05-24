import { useEffect, useState } from 'react';
import { useAuth } from '../../lib/auth';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { BadgeCheck } from 'lucide-react';

interface ProfileBadgesProps {
  className?: string;
}

export function ProfileBadges({ className }: ProfileBadgesProps) {
  const { user, getBadges } = useAuth();
  const [badges, setBadges] = useState<string[]>([]);

  useEffect(() => {
    const loadBadges = async () => {
      const userBadges = await getBadges();
      setBadges(userBadges);
    };

    if (user?.address) {
      loadBadges();
    }
  }, [user?.address]);

  // Badge metadata for display
  const badgeInfo: Record<string, { label: string; description: string }> = {
    EARLY_SUPPORTER: {
      label: 'Early Supporter',
      description: 'Among the first to support public goods on our platform'
    },
    TOP_DONOR: {
      label: 'Top Donor',
      description: 'Made significant contributions to public goods'
    },
    VERIFIED_BUILDER: {
      label: 'Verified Builder',
      description: 'Verified project creator with successful launches'
    },
    COMMUNITY_LEADER: {
      label: 'Community Leader',
      description: 'Active community member with high engagement'
    },
    PASSPORT_VERIFIED: {
      label: 'Passport Verified',
      description: 'Verified human with Gitcoin Passport'
    },
  };

  return (
    <Card className={className}>
      <div className="p-6">
        <h3 className="text-lg font-semibold mb-4">Achievement Badges</h3>
        
        {badges.length > 0 ? (
          <div className="grid grid-cols-2 gap-4">
            {badges.map((badgeId) => {
              const info = badgeInfo[badgeId] || {
                label: badgeId,
                description: 'Achievement badge'
              };
              
              return (
                <div
                  key={badgeId}
                  className="bg-secondary p-4 rounded-lg flex items-start space-x-3"
                >
                  <BadgeCheck className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-medium text-sm">{info.label}</h4>
                    <p className="text-xs text-gray-600 mt-1">
                      {info.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-6 text-gray-500">
            <p>No badges earned yet</p>
            <p className="text-sm mt-2">
              Support projects and engage with the community to earn badges!
            </p>
          </div>
        )}
      </div>
    </Card>
  );
}
