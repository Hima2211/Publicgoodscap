import { useEffect, useState } from 'react';
import { useAuth } from '../../lib/auth';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { formatDistanceToNow } from 'date-fns';
import { ExternalLink, Flag, Heart } from 'lucide-react';
import Link from 'next/link';

interface ProjectActivityProps {
  className?: string;
}

interface ProjectData {
  id: string;
  name: string;
  description: string;
  amount?: string;
  timestamp: number;
}

export function ProjectActivity({ className }: ProjectActivityProps) {
  const { user, getProjectsData } = useAuth();
  const [projects, setProjects] = useState<{
    owned: ProjectData[];
    supported: ProjectData[];
    signaled: ProjectData[];
  }>({
    owned: [],
    supported: [],
    signaled: []
  });

  useEffect(() => {
    const loadProjects = async () => {
      const data = await getProjectsData();
      
      // Here you would typically fetch additional project details from your API
      // For now, we'll use placeholder data
      setProjects({
        owned: data.owned.map(id => ({
          id,
          name: 'Project ' + id.slice(0, 6),
          description: 'Project description',
          timestamp: Date.now() - Math.random() * 1000000000
        })),
        supported: data.supported.map(id => ({
          id,
          name: 'Project ' + id.slice(0, 6),
          description: 'Project description',
          amount: (Math.random() * 10).toFixed(2) + ' ETH',
          timestamp: Date.now() - Math.random() * 1000000000
        })),
        signaled: data.signaled.map(id => ({
          id,
          name: 'Project ' + id.slice(0, 6),
          description: 'Project description',
          timestamp: Date.now() - Math.random() * 1000000000
        }))
      });
    };

    if (user?.address) {
      loadProjects();
    }
  }, [user?.address]);

  return (
    <Card className={className}>
      <div className="p-6">
        <h3 className="text-lg font-semibold mb-4">Project Activity</h3>

        <Tabs defaultValue="owned" className="space-y-4">
          <TabsList>
            <TabsTrigger value="owned">
              Owned ({projects.owned.length})
            </TabsTrigger>
            <TabsTrigger value="supported">
              Supported ({projects.supported.length})
            </TabsTrigger>
            <TabsTrigger value="signaled">
              Signaled ({projects.signaled.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="owned">
            {projects.owned.length > 0 ? (
              <div className="space-y-4">
                {projects.owned.map((project) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    type="owned"
                  />
                ))}
              </div>
            ) : (
              <EmptyState message="You haven't created any projects yet" />
            )}
          </TabsContent>

          <TabsContent value="supported">
            {projects.supported.length > 0 ? (
              <div className="space-y-4">
                {projects.supported.map((project) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    type="supported"
                  />
                ))}
              </div>
            ) : (
              <EmptyState message="You haven't supported any projects yet" />
            )}
          </TabsContent>

          <TabsContent value="signaled">
            {projects.signaled.length > 0 ? (
              <div className="space-y-4">
                {projects.signaled.map((project) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    type="signaled"
                  />
                ))}
              </div>
            ) : (
              <EmptyState message="You haven't signaled any projects yet" />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Card>
  );
}

function ProjectCard({ project, type }: { project: ProjectData; type: 'owned' | 'supported' | 'signaled' }) {
  const icon = {
    owned: <ExternalLink className="h-4 w-4" />,
    supported: <Heart className="h-4 w-4" />,
    signaled: <Flag className="h-4 w-4" />
  }[type];

  return (
    <Link href={`/project/${project.id}`}>
      <div className="p-4 rounded-lg border hover:bg-secondary/50 transition-colors">
        <div className="flex items-start justify-between">
          <div>
            <h4 className="font-medium">{project.name}</h4>
            <p className="text-sm text-gray-600 mt-1">{project.description}</p>
            <div className="flex items-center space-x-2 mt-2">
              {icon}
              <span className="text-xs text-gray-500">
                {formatDistanceToNow(project.timestamp, { addSuffix: true })}
              </span>
              {project.amount && (
                <Badge variant="outline" className="ml-2">
                  {project.amount}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="text-center py-6 text-gray-500">
      <p>{message}</p>
    </div>
  );
}
