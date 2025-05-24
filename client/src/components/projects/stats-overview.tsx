import { formatCurrency } from "@/lib/utils";

interface StatsOverviewProps {
  data: {
    totalFunding: number;
    pointsCount: number;
    donorsCount?: number;
    marketRank?: number;
    fundingSources: string[];
    roundDeadline?: string;
    roundId?: string;
  };
}

export function StatsOverview({ data }: StatsOverviewProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="p-4 bg-card rounded-lg border border-border">
        <div className="text-sm text-muted-foreground">Total Funding</div>
        <div className="text-xl font-semibold text-foreground mt-1">
          {formatCurrency(data.totalFunding)}
        </div>
      </div>
      
      <div className="p-4 bg-card rounded-lg border border-border">
        <div className="text-sm text-muted-foreground">Impact Points</div>
        <div className="text-xl font-semibold text-foreground mt-1">
          {data.pointsCount.toLocaleString()}
        </div>
      </div>
      
      <div className="p-4 bg-card rounded-lg border border-border">
        <div className="text-sm text-muted-foreground">Total Donors</div>
        <div className="text-xl font-semibold text-foreground mt-1">
          {data.donorsCount?.toLocaleString() || 'N/A'}
        </div>
      </div>
      
      <div className="p-4 bg-card rounded-lg border border-border">
        <div className="text-sm text-muted-foreground">Market Rank</div>
        <div className="text-xl font-semibold text-foreground mt-1">
          #{data.marketRank?.toLocaleString() || 'N/A'}
        </div>
      </div>
    </div>
  );
}
