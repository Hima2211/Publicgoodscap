import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
      const totalFunding = projects.reduce((acc: number, p: any) => acc + (p.totalFunding || 0), 0);
      return { totalProjects, totalFunding };
    } catch {
      return { totalProjects: 0, totalFunding: 0 };
    }
  };
  const getGitcoinStats = () => {
    try {
      const gitcoinData = require('@/data/gitcoin-projects.json');
      const projects = Array.isArray(gitcoinData.default) ? gitcoinData.default : gitcoinData;
      const totalProjects = projects.length;
      const totalFunding = projects.reduce((acc: number, p: any) => acc + (p.totalFunding || 0), 0);
      return { totalProjects, totalFunding };
    } catch {
      return { totalProjects: 0, totalFunding: 0 };
    }
  };
  const getKarmaStats = () => {
    try {
      const karmaData = require('@/data/karma-projects.json');
      const projects = Array.isArray(karmaData.default) ? karmaData.default : karmaData;
      const totalProjects = projects.length;
      const totalFunding = projects.reduce((acc: number, p: any) => acc + (p.totalFunding || 0), 0);
      return { totalProjects, totalFunding };
    } catch {
      return { totalProjects: 0, totalFunding: 0 };
    }
  };
  const givethStats = getGivethStats();
  const gitcoinStats = getGitcoinStats();
  const karmaStats = getKarmaStats();

  if (isLoading) {
    return <div>Loading stats...</div>;
  }

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
      <div className="grid gap-2 md:grid-cols-3">
        {/* Compact Giveth Stats */}
        <Card>
          <CardHeader>
            <CardTitle>Giveth</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-1 text-sm">
              <div className="flex justify-between"><span>Projects:</span><span className="font-bold">{givethStats.totalProjects}</span></div>
              <div className="flex justify-between"><span>Funding:</span><span className="font-bold">{givethStats.totalFunding.toLocaleString()}</span></div>
            </div>
          </CardContent>
        </Card>
        {/* Compact Gitcoin Stats */}
        <Card>
          <CardHeader>
            <CardTitle>Gitcoin</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-1 text-sm">
              <div className="flex justify-between"><span>Projects:</span><span className="font-bold">{gitcoinStats.totalProjects}</span></div>
              <div className="flex justify-between"><span>Funding:</span><span className="font-bold">{gitcoinStats.totalFunding.toLocaleString()}</span></div>
            </div>
          </CardContent>
        </Card>
        {/* Compact Karma Stats */}
        <Card>
          <CardHeader>
            <CardTitle>Karma</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-1 text-sm">
              <div className="flex justify-between"><span>Projects:</span><span className="font-bold">{karmaStats.totalProjects}</span></div>
              <div className="flex justify-between"><span>Funding:</span><span className="font-bold">{karmaStats.totalFunding.toLocaleString()}</span></div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
