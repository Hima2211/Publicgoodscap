
import { useQuery } from "@tanstack/react-query";
import { Project } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatCurrency } from "@/lib/utils";
import { useParams, useLocation, Link } from "wouter";
import {
  FaTwitter,
  FaDiscord,
  FaGithub,
  FaTelegram,
  FaGlobe,
  FaComment,
  FaRetweet,
} from "react-icons/fa";
import { BiUpvote } from "react-icons/bi";
import { FaFireFlameSimple } from "react-icons/fa6";
import { BiTrendingUp } from "react-icons/bi";
import { TbCheck } from "react-icons/tb";
import { LuClock } from "react-icons/lu";
import ActivityFeed from "@/components/projects/activity-feed";
import Discussion from "@/components/projects/discussion";

export default function ProjectDetails() {
  const { id } = useParams();
  const [location] = useLocation();
  const searchParams = new URLSearchParams(location.split('?')[1]);
  const defaultTab = searchParams.get('tab') || 'activity';
  const projectId = parseInt(id || "");

  const { data: project, isLoading, error } = useQuery<Project>({
    queryKey: ["api/projects", projectId],
    queryFn: async () => {
      const response = await fetch(`/api/projects/${projectId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch project details');
      }
      return response.json();
    },
    enabled: !isNaN(projectId),
  });

  if (isLoading) {
    return <ProjectDetailsSkeleton />;
  }

  // Error state
  if (error || !project) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-4rem)] gap-4">
        <h2 className="text-2xl font-bold text-white">Project not found</h2>
        <p className="text-darkText">The project you're looking for doesn't exist or has been removed.</p>
        <Link href="/">
          <Button variant="outline">← Back to Projects</Button>
        </Link>
      </div>
    );
  }

  // Format category display name
  const getCategoryName = (category?: string) => {
    if (!category) return '';
    if (category === 'public_goods') return 'Public Goods';
    return category.charAt(0).toUpperCase() + category.slice(1);
  };

  // Determine progress percentage and colors
  const progressPercentage = project.fundingProgress || 0;
  let progressColorClasses = 'bg-primary';

  if (progressPercentage === 100) {
    progressColorClasses = 'bg-success';
  } else if (project.category === 'defi') {
    progressColorClasses = 'bg-gradient-to-r from-primary to-secondary';
  } else if (project.category === 'nft') {
    progressColorClasses = 'bg-gradient-to-r from-accent to-secondary';
  } else if (project.category === 'public_goods') {
    progressColorClasses = 'bg-gradient-to-r from-success to-primary';
  } else if (project.category === 'social') {
    progressColorClasses = 'bg-gradient-to-r from-accent to-primary';
  }

  // Determine project status
  let StatusIcon = null;
  let statusText = '';
  let statusColor = '';

  if (project.isHot) {
    StatusIcon = FaFireFlameSimple;
    statusText = 'Hot Project';
    statusColor = 'text-success';
  } else if (project.isTrending) {
    StatusIcon = BiTrendingUp;
    statusText = 'Trending';
    statusColor = 'text-warning';
  } else if (project.inFundingRound && progressPercentage === 100) {
    StatusIcon = TbCheck;
    statusText = 'Funded';
    statusColor = 'text-darkText';
  } else if (!project.inFundingRound) {
    StatusIcon = LuClock;
    statusText = 'New';
    statusColor = 'text-darkText';
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Back Button */}
      <Link href="/">
        <Button variant="outline" className="mb-6">
          ← Back to Projects
        </Button>
      </Link>

      {/* Project Header */}
      <div className="flex flex-col md:flex-row gap-6 mb-8">
        <img
          src={project.logo || '/placeholder-logo.png'}
          alt={`${project.name} logo`}
          className="w-24 h-24 rounded-xl flex-shrink-0 object-cover"
        />

        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold text-white">{project.name}</h1>
            <span className={`badge text-sm px-3 py-1 rounded-full ${progressPercentage === 100 ? 'bg-success bg-opacity-10 text-success' : 'bg-primary bg-opacity-10 text-primary'}`}>
              {getCategoryName(project.category)}
            </span>
            {StatusIcon && (
              <span className={`text-sm font-medium ${statusColor} flex items-center gap-1`}>
                <StatusIcon className="h-4 w-4" />
                <span>{statusText}</span>
              </span>
            )}
          </div>
          
          <p className="text-lg text-darkText mb-4">
            {project.description}
          </p>

          <div className="flex items-center gap-4">
            {project.website && (
              <a
                href={project.website}
                target="_blank"
                rel="noopener noreferrer"
                className="social-icon text-darkText hover:text-primary"
                aria-label="Website"
              >
                <FaGlobe className="h-5 w-5" />
              </a>
            )}
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="social-icon text-darkText hover:text-primary"
                aria-label="GitHub"
              >
                <FaGithub className="h-5 w-5" />
              </a>
            )}
            {project.twitter && (
              <a
                href={project.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="social-icon text-darkText hover:text-primary"
                aria-label="Twitter"
              >
                <FaTwitter className="h-5 w-5" />
              </a>
            )}
            {project.discord && (
              <a
                href={project.discord}
                target="_blank"
                rel="noopener noreferrer"
                className="social-icon text-darkText hover:text-primary"
                aria-label="Discord"
              >
                <FaDiscord className="h-5 w-5" />
              </a>
            )}
            {project.telegram && (
              <a
                href={project.telegram}
                target="_blank"
                rel="noopener noreferrer"
                className="social-icon text-darkText hover:text-primary"
                aria-label="Telegram"
              >
                <FaTelegram className="h-5 w-5" />
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Project Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Funding Status */}
        <div className="bg-darkCard rounded-xl p-6 border border-darkBorder">
          <h3 className="text-lg font-medium text-white mb-4">Funding Status</h3>
          
          <div className="mb-4">
            <span className="text-sm text-darkText">Total Raised</span>
            <div className="text-2xl font-bold text-white">{formatCurrency(project.totalFunding || 0)}</div>
          </div>

          {project.inFundingRound && (
            <>
              <div className="mb-2">
                <span className="text-sm text-darkText">Current Round</span>
                <div className="progress-bar mt-2 mb-1">
                  <div
                    className={`progress-fill ${progressColorClasses}`}
                    style={{ width: `${progressPercentage}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-darkText">
                  <span>{progressPercentage}% funded</span>
                  {project.roundDeadline && (
                    <span>Ends {new Date(project.roundDeadline).toLocaleDateString()}</span>
                  )}
                </div>
              </div>

              <Button
                className={`w-full mt-4 ${
                  progressPercentage < 100
                    ? 'bg-primary hover:bg-opacity-90'
                    : 'bg-darkCard hover:bg-opacity-90'
                }`}
                asChild
              >
                <a
                  href={project.fundingRoundLink || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {progressPercentage < 100 ? 'Fund Project' : 'Round Closed'}
                </a>
              </Button>
            </>
          )}
        </div>

        {/* Project Impact */}
        <div className="bg-darkCard rounded-xl p-6 border border-darkBorder">
          <h3 className="text-lg font-medium text-white mb-4">Project Impact</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-sm text-darkText">Funding Sources</span>
              <div className="font-medium text-white mt-1">
                {project.fundingSources?.length || 0}
              </div>
            </div>
            <div>
              <span className="text-sm text-darkText">Points Earned</span>
              <div className="font-medium text-white mt-1">
                {project.pointsCount || 0}
              </div>
            </div>
            <div>
              <span className="text-sm text-darkText">Comments</span>
              <div className="font-medium text-white mt-1">
                {project.commentCount || 0}
              </div>
            </div>
            <div>
              <span className="text-sm text-darkText">Shares</span>
              <div className="font-medium text-white mt-1">
                {project.shareCount || 0}
              </div>
            </div>
          </div>
        </div>

        {/* Project Engagement */}
        <div className="bg-darkCard rounded-xl p-6 border border-darkBorder">
          <h3 className="text-lg font-medium text-white mb-4">Get Involved</h3>
          
          <div className="flex flex-col gap-3">
            <Button 
              variant="outline" 
              className="w-full justify-start gap-2"
              onClick={() => {
                const newUrl = `/projects/${projectId}?tab=discussion`;
                window.history.pushState(null, '', newUrl);
                const newSearchParams = new URLSearchParams(location.split('?')[1]);
                newSearchParams.set('tab', 'discussion');
              }}
            >
              <FaComment className="h-4 w-4" />
              <span>Comment ({project.commentCount || 0})</span>
            </Button>
            <Button variant="outline" className="w-full justify-start gap-2">
              <BiUpvote className="h-4 w-4" />
              <span>Vote ({project.pointsCount || 0})</span>
            </Button>
            <Button variant="outline" className="w-full justify-start gap-2">
              <FaRetweet className="h-4 w-4" />
              <span>Share ({project.shareCount || 0})</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Project Activity & Discussion */}
      <div className="bg-darkCard rounded-xl border border-darkBorder overflow-hidden">
        <Tabs defaultValue={defaultTab}>
          <TabsList className="flex p-0 bg-darkBg border-b border-darkBorder">
            <TabsTrigger 
              value="activity" 
              className="flex-1 px-6 py-3 data-[state=active]:bg-darkCard data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none"
            >
              Recent Activity
            </TabsTrigger>
            <TabsTrigger 
              value="discussion" 
              className="flex-1 px-6 py-3 data-[state=active]:bg-darkCard data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none"
            >
              Discussion
            </TabsTrigger>
          </TabsList>

          <div className="p-6">
            <TabsContent value="activity">
              <ActivityFeed projectId={projectId} />
            </TabsContent>
            <TabsContent value="discussion">
              <Discussion projectId={projectId} />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </main>
  );
}
