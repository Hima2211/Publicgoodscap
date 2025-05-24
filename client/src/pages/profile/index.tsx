import { useEffect } from 'react';
import { useAuth } from '../../lib/auth';
import { ProfileForm } from '../../components/profile/profile-form';
import { ActivityFeed } from '../../components/profile/activity-feed';
import { PassportVerification } from '../../components/profile/passport-verification';
import { ImpactPoints } from '../../components/profile/impact-points';
import { ProjectActivity } from '../../components/profile/project-activity';
import { ProfileBadges } from '../../components/profile/profile-badges';
import { Card } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { useRouter } from 'next/router';

export default function ProfilePage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Profile</h1>
        <p className="text-gray-600">Manage your profile and view your contributions</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          <Card className="p-6">
            <ProfileForm />
          </Card>
          <PassportVerification />
        </div>

        {/* Middle Column */}
        <div className="space-y-6 lg:col-span-2">
          <ImpactPoints />
          
          <Tabs defaultValue="activity" className="space-y-6">
            <TabsList>
              <TabsTrigger value="activity">Activity</TabsTrigger>
              <TabsTrigger value="projects">Projects</TabsTrigger>
              <TabsTrigger value="badges">Badges</TabsTrigger>
            </TabsList>

            <TabsContent value="activity">
              <Card className="p-6">
                <ActivityFeed />
              </Card>
            </TabsContent>

            <TabsContent value="projects">
              <ProjectActivity />
            </TabsContent>

            <TabsContent value="badges">
              <ProfileBadges />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
