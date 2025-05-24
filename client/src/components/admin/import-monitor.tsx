import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart } from "@/components/admin/line-chart";
import { useState } from "react";

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
  const [syncing, setSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState<string | null>(null);
  const { data: stats, isLoading } = useQuery<ImportStats>({
    queryKey: ["api/admin/import-stats"],
    queryFn: async () => {
      const response = await fetch("/api/admin/import-stats");
      if (!response.ok) throw new Error("Failed to fetch import stats");
      return response.json();
    },
    refetchInterval: 60000, // Refresh every minute
  });

  // Helper: Calculate accurate stats from local data
  const getGivethStats = () => {
    try {
      const givethData = require('@/data/giveth-projects.json');
      const projects = Array.isArray(givethData.default) ? givethData.default : givethData;
      const totalProjects = projects.length;
      // If totalFunding is available, sum it; else 0
      const totalFunding = projects.reduce((acc, p) => acc + (p.totalFunding || 0), 0);
      return { totalProjects, totalFunding };
    } catch {
      return { totalProjects: 0, totalFunding: 0 };
    }
  };
  const givethStats = getGivethStats();

  if (isLoading) {
    return <div>Loading stats...</div>;
  }

  const hourLabels = Array.from({ length: 24 }, (_, i) => 
    `${23-i}h ago`
  ).reverse();

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 mb-2">
        <button
          className="px-4 py-2 bg-accent text-white rounded hover:bg-accent-dark"
          disabled={syncing}
          onClick={async () => {
            setSyncing(true);
            setSyncResult(null);
            try {
              const res = await fetch("/api/admin/sync-giveth", { method: "POST" });
              const data = await res.json();
              if (res.ok) {
                setSyncResult(`Synced ${data.count} Giveth projects!`);
              } else {
                setSyncResult(`Sync failed: ${data.error || 'Unknown error'}`);
              }
            } catch (e) {
              setSyncResult(`Sync failed: ${e instanceof Error ? e.message : String(e)}`);
            } finally {
              setSyncing(false);
            }
          }}
        >
          {syncing ? "Syncing..." : "Sync Giveth Projects"}
        </button>
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          disabled={syncing}
          onClick={async () => {
            setSyncing(true);
            setSyncResult(null);
            try {
              const res = await fetch("/api/admin/scrape-giveth-web", { method: "POST" });
              const data = await res.json();
              if (res.ok) {
                setSyncResult(`Scraped Giveth projects from web!\n${data.output}`);
              } else {
                setSyncResult(`Scrape failed: ${data.error || 'Unknown error'}`);
              }
            } catch (e) {
              setSyncResult(`Scrape failed: ${e instanceof Error ? e.message : String(e)}`);
            } finally {
              setSyncing(false);
            }
          }}
        >
          {syncing ? "Scraping..." : "Scrape Giveth Projects (Web)"}
        </button>
      </div>
      {syncResult && <div className="mb-2 text-xs text-white whitespace-pre-line">{syncResult}</div>}
      <div className="grid gap-2 md:grid-cols-2">
        {/* Compact Giveth Stats */}
        <Card>
          <CardHeader>
            <CardTitle>Giveth Stats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-1 text-sm">
              <div className="flex justify-between"><span>Total Projects:</span><span className="font-bold">{givethStats.totalProjects}</span></div>
              <div className="flex justify-between"><span>Total Funding:</span><span className="font-bold">{givethStats.totalFunding.toLocaleString()}</span></div>
            </div>
          </CardContent>
        </Card>
        {/* Compact Gitcoin Stats */}
        <Card>
          <CardHeader>
            <CardTitle>Gitcoin Stats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-1 text-sm">
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
        {/* Future Compact Karma Stats */}
        {/* <Card>
          <CardHeader>
            <CardTitle>Karma Stats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-1 text-sm">
              <div className="flex justify-between">
                <span>Total Projects:</span>
                <span className="font-bold">{stats?.karma.totalProjects}</span>
              </div>
              <div className="flex justify-between">
                <span>Active Rounds:</span>
                <span className="font-bold">{stats?.karma.activeRounds}</span>
              </div>
              <div className="flex justify-between">
                <span>Last Sync:</span>
                <span className="font-bold">{new Date(stats?.karma.lastSync || "").toLocaleString()}</span>
              </div>
            </div>
            <div className="mt-4 h-[200px]">
              <LineChart 
                data={hourLabels.map((label, i) => ({
                  date: label,
                  value: stats?.karma.projectsPerHour[i] || 0
                }))}
              />
            </div>
          </CardContent>
        </Card> */}
      </div>
    </div>
  );
}
