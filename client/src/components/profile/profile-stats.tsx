interface ProfileStatsProps {
  stats: {
    totalContributions: number;
    totalPoints: number;
    projects: number;
    impact: number;
  };
}

export function ProfileStats({ stats }: ProfileStatsProps) {
  return (
    <div className="flex gap-6 p-4 bg-darkCard border-b border-darkBorder text-sm">
      <div className="flex flex-col items-center">
        <span className="font-bold text-white">{stats.totalContributions}</span>
        <span className="text-darkText">Contributions</span>
      </div>
      
      <div className="flex flex-col items-center">
        <span className="font-bold text-primary">{stats.totalPoints}</span>
        <span className="text-darkText">Points</span>
      </div>
      
      <div className="flex flex-col items-center">
        <span className="font-bold text-accent">{stats.projects}</span>
        <span className="text-darkText">Projects</span>
      </div>
      
      <div className="flex flex-col items-center">
        <span className="font-bold text-secondary">${stats.impact.toLocaleString()}</span>
        <span className="text-darkText">Impact</span>
      </div>
    </div>
  );
}
