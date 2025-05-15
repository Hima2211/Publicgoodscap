
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart } from "@/components/admin/line-chart";
import ProjectsTable from "@/components/admin/projects-table";
import StatsCards from "@/components/admin/stats-cards";

export default function AdminDashboard() {
  const { data: projects, isLoading } = useQuery({
    queryKey: ["api/projects"],
    queryFn: async () => {
      const response = await fetch("/api/projects");
      if (!response.ok) throw new Error("Failed to fetch projects");
      return response.json();
    },
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const stats = {
    totalProjects: projects?.length || 0,
    activeProjects: projects?.filter((p: any) => p.inFundingRound).length || 0,
    totalFunding: projects?.reduce((acc: number, p: any) => acc + (p.totalFunding || 0), 0) || 0,
    averageProgress: projects?.reduce((acc: number, p: any) => acc + (p.fundingProgress || 0), 0) / projects?.length || 0,
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      
      <StatsCards stats={stats} />

      <Tabs defaultValue="overview" className="mt-8">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="funding">Funding</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Project Growth</CardTitle>
            </CardHeader>
            <CardContent>
              <LineChart data={[]} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="projects">
          <ProjectsTable projects={projects} />
        </TabsContent>

        <TabsContent value="funding">
          <Card>
            <CardHeader>
              <CardTitle>Funding Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <LineChart data={[]} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
