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

  // Fetch stats from each platform
  const { data: givethStats = { totalProjects: 0, totalFunding: 0 }, 
    isLoading: givethLoading, 
    error: givethError,
    refetch: refetchGiveth
  } = useQuery({
    queryKey: ['giveth-projects-stats'],
    queryFn: async () => {
      const response = await fetch("/api/giveth", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: `
            query GetProjects {
              projects(orderBy: totalDonations, orderDirection: desc, first: 100) {
                id
                title
                totalDonations
              }
            }
          `
        })
      });
      if (!response.ok) throw new Error(`Failed to fetch Giveth stats: ${response.status}`);
      const { data } = await response.json();
      if (!data?.projects) throw new Error('No data from Giveth API');
      
      return {
        totalProjects: data.projects.length,
        totalFunding: data.projects.reduce((sum: number, p: any) => sum + Number(p.totalDonations || 0), 0)
      };
    }
  });

  const { data: gitcoinStats = { totalProjects: 0, totalFunding: 0 }, 
    isLoading: gitcoinLoading,
    error: gitcoinError,
    refetch: refetchGitcoin
  } = useQuery({
    queryKey: ['gitcoin-projects-stats'],
    queryFn: async () => {
      const response = await fetch("/api/gitcoin", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: `
            query GitcoinProjects {
              applications(first: 100) {
                status
                totalAmountDonatedInUsd
              }
            }
          `
        })
      });
      if (!response.ok) throw new Error(`Failed to fetch Gitcoin stats: ${response.status}`);
      const { data } = await response.json();
      if (!data?.applications) throw new Error('No data from Gitcoin API');
      
      const validProjects = data.applications.filter((app: any) => app.status === 'APPROVED');
      return {
        totalProjects: validProjects.length,
        totalFunding: validProjects.reduce((sum: number, p: any) => sum + Number(p.totalAmountDonatedInUsd || 0), 0)
      };
    }
  });

  const { data: karmaStats = { totalProjects: 0, totalFunding: 0 }, 
    isLoading: karmaLoading,
    error: karmaError,
    refetch: refetchKarma
  } = useQuery({
    queryKey: ['karma-projects-stats'],
    queryFn: async () => {
      const response = await fetch('https://gapapi.karmahq.xyz/projects');
      if (!response.ok) throw new Error(`Failed to fetch Karma stats: ${response.status}`);
      const data = await response.json();
      if (!Array.isArray(data)) throw new Error('Invalid response from Karma API');
      
      return {
        totalProjects: data.length,
        totalFunding: data.reduce((sum: number, p: any) => {
          const amount = p.grants?.[0]?.amount;
          return sum + (typeof amount === 'number' ? amount : 0);
        }, 0)
      };
    }
  });

  const handleRefreshAll = () => {
    refetchGiveth();
    refetchGitcoin();
    refetchKarma();
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 mb-2">
        <button
          className="px-4 py-2 bg-accent text-white rounded hover:bg-accent-dark disabled:opacity-50"
          disabled={syncing}
          onClick={async () => {
            setSyncing(true);
            setSyncResult(null);
            try {
              const res = await fetch("/api/admin/sync-giveth", { method: "POST" });
              const data = await res.json();
              if (res.ok) {
                setSyncResult(`Synced ${data.count} Giveth projects!`);
                refetchGiveth(); // Refresh stats after sync
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
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          onClick={handleRefreshAll}
          disabled={givethLoading || gitcoinLoading || karmaLoading}
        >
          Refresh All Stats
        </button>
      </div>

      {syncResult && (
        <div className="mb-2 text-xs text-white bg-gray-700 p-2 rounded whitespace-pre-line">
          {syncResult}
        </div>
      )}

      <div className="grid gap-2 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>
              Giveth
              {givethLoading && <span className="ml-2 text-sm text-gray-400">Loading...</span>}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-1 text-sm">
              {givethError ? (
                <div className="text-red-500">Error: {givethError instanceof Error ? givethError.message : String(givethError)}</div>
              ) : (
                <>
                  <div className="flex justify-between">
                    <span>Projects:</span>
                    <span className="font-bold">{givethStats.totalProjects}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Funding:</span>
                    <span className="font-bold">${givethStats.totalFunding.toLocaleString()}</span>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              Gitcoin
              {gitcoinLoading && <span className="ml-2 text-sm text-gray-400">Loading...</span>}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-1 text-sm">
              {gitcoinError ? (
                <div className="text-red-500">Error: {gitcoinError instanceof Error ? gitcoinError.message : String(gitcoinError)}</div>
              ) : (
                <>
                  <div className="flex justify-between">
                    <span>Projects:</span>
                    <span className="font-bold">{gitcoinStats.totalProjects}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Funding:</span>
                    <span className="font-bold">${gitcoinStats.totalFunding.toLocaleString()}</span>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              Karma
              {karmaLoading && <span className="ml-2 text-sm text-gray-400">Loading...</span>}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-1 text-sm">
              {karmaError ? (
                <div className="text-red-500">Error: {karmaError instanceof Error ? karmaError.message : String(karmaError)}</div>
              ) : (
                <>
                  <div className="flex justify-between">
                    <span>Projects:</span>
                    <span className="font-bold">{karmaStats.totalProjects}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Funding:</span>
                    <span className="font-bold">${karmaStats.totalFunding.toLocaleString()}</span>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
