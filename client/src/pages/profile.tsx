import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useQuery } from '@tanstack/react-query';
import { Project } from '@shared/schema';
import ProjectCard from '@/components/projects/project-card';
import { Link, useLocation } from 'wouter';
import { useConnect, useAccount, useDisconnect } from 'wagmi';
import { walletConnect } from '@wagmi/connectors';
import { ProfileHeader } from '@/components/profile/profile-header';
import { ProfileStats } from '@/components/profile/profile-stats';
import { Activity } from 'lucide-react';
import { ProfileSkeleton } from '@/components/ui/skeletons';
import { useState } from 'react';
import { useAuth } from '@/lib/auth';
import type { User, UserStats } from '@/types/user';

export default function Profile() {
  const { user, isAuthenticated, isLoading: isAuthLoading, connectWallet } = useAuth();
  const [, setLocation] = useLocation();
  const [connectError, setConnectError] = useState<string | null>(null);

  const { data: userProjects, isLoading } = useQuery<Project[]>({
    queryKey: ['user-projects', user?.address],
    queryFn: async () => {
      const response = await fetch(`/api/users/${user?.address}/projects`);
      if (!response.ok) throw new Error('Failed to fetch user projects');
      return response.json();
    },
    enabled: !!user?.address,
  });

  // Fetch user stats
  const { data: userStats, isLoading: isStatsLoading } = useQuery<UserStats>({
    queryKey: ['user-stats', user?.address],
    queryFn: async () => {
      // TODO: Replace with actual API call
      return {
        totalContributions: 157,
        followers: 423,
        following: 256
      };
    },
    enabled: !!userId,
  });

  // Format stats for components
  const profileStats = {
    totalContributions: fullStats?.totalContributions ?? 0,
    totalPoints: 1250,
    projects: userProjects?.length ?? 0,
    impact: 25000
  };

  const socialStats = {
    totalContributions: fullStats?.totalContributions ?? 0,
    followers: fullStats?.followers ?? 0,
    following: fullStats?.following ?? 0
  };

  if (isLoading || isStatsLoading || isAuthLoading) {
    return <ProfileSkeleton />;
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-background transition-colors duration-500">
        <main className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
          <Card className="bg-card border-border text-foreground transition-colors duration-500">
            <CardHeader>
              <CardTitle>Please Connect Your Wallet</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-foreground mb-4">
                Connect your wallet to view your profile and manage your projects.
              </p>
              {connectError && (
                <div className="mb-2 text-red-500 text-sm">{connectError}</div>
              )}
              <Button 
                variant="default"
                className="bg-accent hover:bg-accent/90 text-accent-foreground"
                disabled={isAuthLoading}
                onClick={async () => {
                  setConnectError(null);
                  try {
                    await connectWallet();
                  } catch (err: any) {
                    setConnectError(err?.message || 'Connection failed');
                    console.error('WalletConnect error:', err);
                  }
                }}
              >
                {isAuthLoading ? 'Connecting...' : 'Connect Wallet'}
              </Button>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background transition-colors duration-500">
      <main className="max-w-7xl mx-auto sm:px-6">
        <div className="space-y-6 py-6">
          {/* Profile Header Card */}
          <Card className="bg-card border-border text-foreground overflow-hidden transition-colors duration-500">
            <ProfileHeader 
              user={{ address }}
              stats={socialStats} 
              onEditProfile={() => setLocation('/profile/edit')} 
            />
          </Card>

          {/* Profile Content Card */}
          <Card className="bg-card border-border text-foreground transition-colors duration-500">
            <CardContent className="p-6">              <ProfileStats stats={profileStats} />

              <Tabs defaultValue="projects" className="mt-8">
                <TabsList className="bg-muted border border-border w-full justify-start">
                  <TabsTrigger value="projects">Projects</TabsTrigger>
                  <TabsTrigger value="activity">Activity</TabsTrigger>
                  <TabsTrigger value="contributions">Contributions</TabsTrigger>
                  <TabsTrigger value="settings">Settings</TabsTrigger>
                </TabsList>

                <TabsContent value="projects" className="mt-6">
                  {isLoading ? (
                    <div className="flex justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
                    </div>
                  ) : userProjects?.length ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {userProjects.map((project) => (
                        <ProjectCard key={project.id} project={project} />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground mb-4">You haven't submitted any projects yet.</p>
                      <Button variant="default" asChild>
                        <Link href="/submit">Submit a Project</Link>
                      </Button>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="activity" className="mt-6">
                  <div className="space-y-4">
                    {/* Example activity items */}
                    <div className="flex items-start gap-4 p-4 bg-muted rounded-lg">
                      <Activity className="w-5 h-5 text-primary mt-1" />
                      <div>
                        <p className="text-foreground">Contributed to Project XYZ</p>
                        <p className="text-sm text-muted-foreground">2 hours ago</p>
                      </div>
                    </div>
                    {/* Add more activity items here */}
                  </div>
                </TabsContent>

                <TabsContent value="contributions" className="mt-6">
                  <div className="space-y-4">
                    {/* Example contribution history */}
                    <div className="grid gap-4">
                      <div className="p-4 bg-muted rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                          <h3 className="text-foreground font-medium">Contribution to DeFi Project</h3>
                          <span className="text-primary">+50 Points</span>
                        </div>
                        <p className="text-sm text-muted-foreground">Contributed technical feedback and testing</p>
                      </div>
                      {/* Add more contribution items here */}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="settings" className="mt-6">
                  <div className="space-y-6">
                    <div className="grid gap-4">
                      <h3 className="text-lg font-medium text-foreground">Profile Settings</h3>
                      <p className="text-muted-foreground">Profile customization options coming soon</p>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
