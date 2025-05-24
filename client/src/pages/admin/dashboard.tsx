import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProjectsTable from "@/components/admin/projects-table";
import StatsCards from "@/components/admin/stats-cards";
import ImportMonitor from "@/components/admin/import-monitor";
import { AdminHeader } from "@/components/admin/admin-header";
import SubmitForm from "@/components/projects/submit-form";
import { useAdminGuard } from "@/hooks/use-admin-guard";
import type { Project } from "@shared/schema";
import { fetchGitcoinProjects } from "@/lib/gitcoin";
import { fetchGivethProjects } from "@/lib/giveth";
import { fetchKarmaProjects } from "@/lib/karma";

export default function AdminDashboard() {
  const isAdmin = useAdminGuard();
  
  // Fetch projects from all sources with proper error handling
  const { data: gitcoinProjects = [], isLoading: gitcoinLoading } = useQuery<Project[]>({
    queryKey: ["gitcoin-projects"],
    queryFn: async () => {
      try {
        const data = await fetchGitcoinProjects({ first: 500 });
        return data.map(p => ({
          ...p,
          totalFunding: Number(p.totalAmountDonatedInUsd || 0),
          inFundingRound: p.status === 'APPROVED',
          fundingSources: ['Gitcoin']
        }));
      } catch (error) {
        console.error('Error fetching Gitcoin projects:', error);
        return [];
      }
    }
  });

  const { data: givethProjects = [], isLoading: givethLoading } = useQuery<Project[]>({
    queryKey: ["giveth-projects"],
    queryFn: async () => {
      try {
        const data = await fetchGivethProjects();
        return data.map(p => ({
          ...p,
          totalFunding: Number(p.totalDonations || 0),
          fundingSources: ['Giveth']
        }));
      } catch (error) {
        console.error('Error fetching Giveth projects:', error);
        return [];
      }
    }
  });

  const { data: karmaProjects = [], isLoading: karmaLoading } = useQuery<Project[]>({
    queryKey: ["karma-projects"],
    queryFn: async () => {
      try {
        const data = await fetchKarmaProjects();
        return data.map(p => ({
          ...p,
          totalFunding: Number(p.grants?.[0]?.amount || 0),
          fundingSources: ['Karma']
        }));
      } catch (error) {
        console.error('Error fetching Karma projects:', error);
        return [];
      }
    }
  });

  const isLoading = gitcoinLoading || givethLoading || karmaLoading;

  if (!isAdmin || isLoading) {
    return (
      <div className="min-h-screen bg-darkBg">
        <AdminHeader />
        <div className="flex items-center justify-center h-[calc(100vh-64px)]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
        </div>
      </div>
    );
  }

  // Combine all projects and normalize their data
  const allProjects = [
    ...(gitcoinProjects || []),
    ...(givethProjects || []),
    ...(karmaProjects || [])
  ];
  
  // Filter out invalid projects and normalize
  const validProjectsWithFunding = allProjects
    .filter(p => p && (
      // Must have basic data
      p.name &&
      p.description && 
      // Must have valid funding data
      (typeof p.totalFunding === 'number' && !isNaN(p.totalFunding))
    ))
    .map(p => ({
      ...p,
      // Ensure all required fields have default values
      totalFunding: Number(p.totalFunding || 0),
      fundingProgress: Number(p.fundingProgress || 0),
      inFundingRound: Boolean(p.inFundingRound),
      fundingSources: p.fundingSources || [],
      category: p.category || 'public_goods'
    }));

  const stats = {
    // Total number of valid projects
    totalProjects: validProjectsWithFunding.length,
    
    // Count projects that are either actively fundraising or have received funding
    activeProjects: validProjectsWithFunding.filter(p => 
      (p.inFundingRound === true) || // Actively fundraising
      ((p.totalFunding || p.totalAmountDonatedInUsd || 0) > 0) // Has received funding
    ).length,
    
    // Sum all project funding, accounting for different funding field names
    totalFunding: validProjectsWithFunding.reduce((sum, p) => {
      const funding = Number(p.totalFunding ?? p.totalAmountDonatedInUsd ?? 0);
      return sum + (isNaN(funding) ? 0 : funding);
    }, 0),
    
    // Calculate average funding progress for projects with valid progress data
    averageProgress: (() => {
      const projectsWithProgress = validProjectsWithFunding.filter(p => 
        typeof p.fundingProgress === 'number' && !isNaN(p.fundingProgress)
      );
      
      if (projectsWithProgress.length === 0) return 0;
      
      const totalProgress = projectsWithProgress.reduce((sum, p) => 
        sum + p.fundingProgress!, 0
      );
      
      return Math.round(totalProgress / projectsWithProgress.length);
    })()
  };

  return (
    <div className="min-h-screen bg-darkBg">
      <AdminHeader />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="space-y-8">
          <StatsCards stats={stats} />
          
          <Card className="bg-darkCard border-darkBorder">
            <CardContent className="p-6">
              <Tabs defaultValue="projects">
                <TabsList className="mb-4">
                  <TabsTrigger value="projects">Projects</TabsTrigger>
                  <TabsTrigger value="submit">Add Project</TabsTrigger>
                  <TabsTrigger value="import">Import</TabsTrigger>
                </TabsList>

                <TabsContent value="projects">
                  <ProjectsTable projects={validProjectsWithFunding} />
                </TabsContent>

                <TabsContent value="submit">
                  <div className="max-w-3xl mx-auto">
                    <SubmitForm isAdmin={true} />
                  </div>
                </TabsContent>

                <TabsContent value="import">
                  <ImportMonitor />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
