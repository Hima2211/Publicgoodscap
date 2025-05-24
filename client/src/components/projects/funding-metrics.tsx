import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { ChevronDown, ChevronUp } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface FundingMetricsProps {
  data: {
    totalFunding: number;
    fundingChange24h?: number;
    fundingChangePercentage24h?: number;
    priceHistory?: { timestamp: string; value: number }[];
    fundingSources: string[];
    roundDeadline?: string;
  };
}

export function FundingMetrics({ data }: FundingMetricsProps) {
  const isPositiveChange = (data.fundingChangePercentage24h || 0) >= 0;

  return (
    <div className="p-6 bg-card rounded-lg border border-border">
      <div className="flex flex-col gap-2">
        <div className="flex items-baseline gap-3">
          <span className="text-3xl font-bold text-foreground">
            {formatCurrency(data.totalFunding)}
          </span>
          {data.fundingChangePercentage24h !== undefined && (
            <Badge variant={isPositiveChange ? "success" : "destructive"} className="text-sm">
              <span className="flex items-center gap-1">
                {isPositiveChange ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                {Math.abs(data.fundingChangePercentage24h).toFixed(2)}%
              </span>
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span>
            {data.fundingChange24h !== undefined && (
              <>
                {isPositiveChange ? "+" : ""}
                {formatCurrency(data.fundingChange24h)} (24h)
              </>
            )}
          </span>
          {data.roundDeadline && (
            <span>
              Round ends {formatDistanceToNow(new Date(data.roundDeadline), { addSuffix: true })}
            </span>
          )}
        </div>

        <div className="flex gap-2 mt-4">
          {data.fundingSources.map((source) => (
            <Button key={source} variant="outline" size="sm" asChild>
              <a href="#" className="text-xs">
                Fund via {source}
              </a>
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
