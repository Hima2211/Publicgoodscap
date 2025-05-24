import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { TrendingUp, Users, DollarSign, LineChart } from "lucide-react";

interface StatsCardsProps {
  stats: {
    totalProjects: number;
    activeProjects: number;
    totalFunding: number;
    averageProgress: number;
  };
}

export default function StatsCards({ stats }: StatsCardsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className="bg-darkCard border-darkBorder">
        <CardContent className="p-4">
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-primary/10 rounded-lg">
              <TrendingUp className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-darkText">Total Projects</p>
              <p className="text-2xl font-bold">{stats.totalProjects}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-darkCard border-darkBorder">
        <CardContent className="p-4">
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-green-500/10 rounded-lg">
              <Users className="h-4 w-4 text-green-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-darkText">Active Projects</p>
              <p className="text-2xl font-bold">{stats.activeProjects}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-darkCard border-darkBorder">
        <CardContent className="p-4">
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <DollarSign className="h-4 w-4 text-blue-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-darkText">Total Funding</p>
              <p className="text-2xl font-bold">{formatCurrency(stats.totalFunding)}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-darkCard border-darkBorder">
        <CardContent className="p-4">
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-purple-500/10 rounded-lg">
              <LineChart className="h-4 w-4 text-purple-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-darkText">Avg. Progress</p>
              <p className="text-2xl font-bold">{stats.averageProgress}%</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
