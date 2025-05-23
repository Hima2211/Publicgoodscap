import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart } from "@/components/admin/line-chart";
import ProjectsTable from "@/components/admin/projects-table";
import StatsCards from "@/components/admin/stats-cards";
import ImportMonitor from "@/components/admin/import-monitor";
import { AdminHeader } from "@/components/admin/admin-header";
import SubmitForm from "@/components/projects/submit-form";
import { useAdminGuard } from "@/hooks/use-admin-guard";

export default function AdminDashboard() {
  const isAdmin = useAdminGuard();
  const { data: projects, isLoading } = useQuery({
    queryKey: ["api/projects"],
    queryFn: async () => {
      const response = await fetch("/api/projects");
      if (!response.ok) throw new Error("Failed to fetch projects");
      return response.json();
    },
    // Refetch every 30 seconds to keep admin dashboard up to date
    refetchInterval: 30000,
    // Also refetch when window regains focus
    refetchOnWindowFocus: true
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

  const stats = {
    totalProjects: projects?.length || 0,
    activeProjects: projects?.filter((p: any) => p.inFundingRound).length || 0,
    totalFunding: projects?.reduce((acc: number, p: any) => acc + (p.totalFunding || 0), 0) || 0,
    averageProgress: projects?.reduce((acc: number, p: any) => acc + (p.fundingProgress || 0), 0) / projects?.length || 0,
  };

  return (
    <div className="min-h-screen bg-darkBg">
      <AdminHeader />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="space-y-8">
          {/* Compact Stats Section */}
          <div className="grid gap-4">
            <StatsCards stats={stats} />
          </div>

          {/* Main Content Tabs */}
          <Card className="bg-darkCard border-darkBorder">
            <CardContent className="p-6">
              <Tabs defaultValue="overview">
                <TabsList className="mb-4">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="projects">Projects</TabsTrigger>
                  <TabsTrigger value="submit">Add Project</TabsTrigger>
                  <TabsTrigger value="import">Import</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="mt-4">
                  <div className="space-y-4">
                    <div>
                      <h2 className="text-lg font-semibold text-white mb-4">Project Growth</h2>
                      <LineChart data={[]} />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="projects" className="mt-4">
                  <div className="space-y-4">
                    <ProjectsTable projects={projects || []} />
                  </div>
                </TabsContent>

                <TabsContent value="submit" className="mt-4">
                  <div className="max-w-3xl mx-auto">
                    <SubmitForm isAdmin={true} />
                  </div>
                </TabsContent>

                <TabsContent value="import" className="mt-4">
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
