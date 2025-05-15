
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart } from "@/components/admin/line-chart";

interface ImportStats {
  gitcoin: {
    totalProjects: number;
    projectsPerHour: number[];
    activeRounds: number;
    lastSync: string;
  };
  giveth: {
    totalProjects: number;
    projectsPerHour: number[];
    activeRounds: number;
    lastSync: string;
  };
}

export default function ImportMonitor() {
  const { data: stats, isLoading } = useQuery<ImportStats>({
    queryKey: ["api/admin/import-stats"],
    queryFn: async () => {
      const response = await fetch("/api/admin/import-stats");
      if (!response.ok) throw new Error("Failed to fetch import stats");
      return response.json();
    },
    refetchInterval: 60000, // Refresh every minute
  });

  if (isLoading) {
    return <div>Loading stats...</div>;
  }

  const hourLabels = Array.from({ length: 24 }, (_, i) => 
    `${23-i}h ago`
  ).reverse();

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        {/* Gitcoin Stats */}
        <Card>
          <CardHeader>
            <CardTitle>Gitcoin Import Stats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Total Projects:</span>
                <span className="font-bold">{stats?.gitcoin.totalProjects}</span>
              </div>
              <div className="flex justify-between">
                <span>Active Rounds:</span>
                <span className="font-bold">{stats?.gitcoin.activeRounds}</span>
              </div>
              <div className="flex justify-between">
                <span>Last Sync:</span>
                <span className="font-bold">{new Date(stats?.gitcoin.lastSync || "").toLocaleString()}</span>
              </div>
            </div>
            <div className="mt-4 h-[200px]">
              <LineChart 
                data={hourLabels.map((label, i) => ({
                  date: label,
                  value: stats?.gitcoin.projectsPerHour[i] || 0
                }))}
              />
            </div>
          </CardContent>
        </Card>

        {/* Giveth Stats */}
        <Card>
          <CardHeader>
            <CardTitle>Giveth Import Stats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Total Projects:</span>
                <span className="font-bold">{stats?.giveth.totalProjects}</span>
              </div>
              <div className="flex justify-between">
                <span>Active Rounds:</span>
                <span className="font-bold">{stats?.giveth.activeRounds}</span>
              </div>
              <div className="flex justify-between">
                <span>Last Sync:</span>
                <span className="font-bold">{new Date(stats?.giveth.lastSync || "").toLocaleString()}</span>
              </div>
            </div>
            <div className="mt-4 h-[200px]">
              <LineChart 
                data={hourLabels.map((label, i) => ({
                  date: label,
                  value: stats?.giveth.projectsPerHour[i] || 0
                }))}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
