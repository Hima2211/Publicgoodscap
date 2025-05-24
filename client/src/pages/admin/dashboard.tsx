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

export default function AdminDashboard() {
  const isAdmin = useAdminGuard();
  
  // Fetch and combine all project data
  const { data: projects, isLoading } = useQuery<Project[]>({
    queryKey: ["api/projects"],
    queryFn: async () => {
      const response = await fetch("/api/projects");
      if (!response.ok) throw new Error("Failed to fetch projects");
      const projects: Project[] = await response.json();
      return projects;
    }
  });

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

  const validProjects = projects || [];
  
  const stats = {
    totalProjects: validProjects.length,
    // Count projects with funding > 0 or in active round
    activeProjects: validProjects.filter(p => 
      (p.totalFunding > 0) || p.inFundingRound
    ).length,
    // Sum all project funding
    totalFunding: validProjects.reduce((sum, p) => 
      sum + (p.totalFunding || 0), 0
    ),
    // Calculate average funding progress
    averageProgress: validProjects.length ? 
      Math.round(
        validProjects.reduce((sum, p) => 
          sum + (p.fundingProgress || 0), 0
        ) / validProjects.length
      ) : 0
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
                  <ProjectsTable projects={validProjects} />
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
