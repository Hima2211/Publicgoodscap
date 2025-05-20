import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import type { Project } from '@shared/schema';
import { formatCurrency } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

type LeaderboardProject = Project & { rank: number };

export default function Leaderboard() {
  const [activeTab, setActiveTab] = useState<'funding' | 'activity' | 'points'>('funding');

  const { data: projects, isLoading, error, isError } = useQuery<LeaderboardProject[]>({
    queryKey: ['projects', 'leaderboard', activeTab],
    queryFn: async () => {
      const response = await fetch(`/api/projects?view=leaderboard&sortBy=${activeTab}`);
      if (!response.ok) throw new Error('Failed to fetch leaderboard data');
      return response.json();
    }
  });

  const renderLeaderboardItem = (project: LeaderboardProject) => {
    const dicebearUrl = `https://api.dicebear.com/7.x/shapes/svg?seed=${project.name}`;
    
    return (
      <Link href={`/project/${project.id}`} key={project.id}>
        <Card className="mb-3 bg-darkCard border-darkBorder hover:bg-darkCard/80 transition-colors cursor-pointer">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0 w-8 text-xl font-bold text-darkText">
                #{project.rank}
              </div>
              <Avatar className="w-12 h-12">
                <AvatarImage src={project.logo || dicebearUrl} alt={project.name} />
                <AvatarFallback className="bg-primary/10">
                  {project.name.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h3 className="font-medium text-white">{project.name}</h3>
                <div className="text-sm text-darkText">
                  {project.description}
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-primary">
                  {activeTab === 'funding' && formatCurrency(project.totalFunding)}
                  {activeTab === 'activity' && (project.commentCount + project.shareCount).toLocaleString()}
                  {activeTab === 'points' && project.pointsCount?.toLocaleString()}
                </div>
                <div className="text-xs text-darkText">
                  {activeTab === 'funding' && 'Total Funding'}
                  {activeTab === 'activity' && 'Total Activity'}
                  {activeTab === 'points' && 'Points'}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    );
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">Failed to load leaderboard data</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      
      
      <Tabs defaultValue="funding" onValueChange={(value) => setActiveTab(value as typeof activeTab)}>
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="funding">
            Top Funding
          </TabsTrigger>
          <TabsTrigger value="activity">
            Most Active
          </TabsTrigger>
          <TabsTrigger value="points">
            Highest Points
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4">
          {projects?.map(project => renderLeaderboardItem(project))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
