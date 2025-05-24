import { Button } from "@/components/ui/button";
import { Project } from "@shared/schema";
import { formatCurrency } from "@/lib/utils";
import { getProjectLogo, getCategoryName } from "@/lib/project-utils";
import { Link, useLocation } from "wouter";
import { FaTwitter, FaDiscord, FaGithub, FaTelegram, FaGlobe, FaComment, FaRetweet } from "react-icons/fa";
import { BiUpvote } from "react-icons/bi";
import { FaFireFlameSimple } from "react-icons/fa6";
import { BiTrendingUp } from "react-icons/bi";
import { TbCheck } from "react-icons/tb";
import { LuClock } from "react-icons/lu";
import { useState } from "react";
import { useAccount } from "wagmi";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { CommentComposer } from "./comments/CommentComposer";
import { CommentThread } from "./comments/CommentThread";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { FundingChart } from './funding-chart';

interface Comment {
  id: number;
  content: string;
  projectId: number;
  userId: number;
  createdAt: string;
  parentId: number;
  threadId: number;
  depth: number;
  replyCount: number;
  upvotes: number;
  mentions: string[] | null;
  updatedAt: string;
  user?: {
    address: string;
    avatar: string;
  };
  hasLiked?: boolean;
}

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const [, setLocation] = useLocation();
  const [showCommentComposer, setShowCommentComposer] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [upvoteAnimation, setUpvoteAnimation] = useState(false);
  const [isUpvoting, setIsUpvoting] = useState(false);
  const [showFundModal, setShowFundModal] = useState(false);
  const { address } = useAccount();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Fetch recent comments for preview
  const { data: recentComments = [], isLoading: isLoadingComments } = useQuery<Comment[]>({
    queryKey: ['comments', project.id, 'recent'],
    queryFn: async () => {
      const response = await fetch(`/api/projects/${project.id}/comments?limit=2`);
      if (!response.ok) throw new Error('Failed to fetch comments');
      return response.json();
    },
    enabled: isPreviewOpen, // Only fetch when preview section is open
  });

  const createCommentMutation = useMutation({
    mutationFn: async ({ content, parentId }: { content: string, parentId?: number }) => {
      const response = await fetch(`/api/projects/${project.id}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, parentId, userId: address })
      });
      if (!response.ok) throw new Error('Failed to create comment');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', project.id] });
      setIsPreviewOpen(false);
      toast({
        description: "Comment posted successfully!",
        duration: 2000,
      });
    }
  });

  const likeMutation = useMutation({
    mutationFn: async (commentId: number) => {
      const response = await fetch(`/api/comments/${commentId}/like`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: address })
      });
      if (!response.ok) throw new Error('Failed to like comment');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', project.id] });
    }
  });

  const upvoteMutation = useMutation({
    mutationFn: async () => {
      if (!address) {
        throw new Error('Please connect your wallet to upvote');
      }
      const response = await fetch(`/api/projects/${project.id}/upvote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: address })
      });
      if (!response.ok) {
        const error = await response.json();
        if (error.code === 'ALREADY_UPVOTED') {
          throw new Error('You have already upvoted this project');
        }
        throw new Error('Failed to upvote project');
      }
      return response.json();
    },
    onMutate: () => {
      setIsUpvoting(true);
    },
    onSuccess: () => {
      // Optimistically update the UI
      setUpvoteAnimation(true);
      setTimeout(() => setUpvoteAnimation(false), 500);
      
      // Show success toast
      toast({
        description: "Project upvoted successfully!",
        duration: 2000,
      });

      // Invalidate both admin and regular project queries to refresh points count
      queryClient.invalidateQueries({ queryKey: ['api/projects'] });
      queryClient.invalidateQueries({ queryKey: ['/api/projects'] });
    },
    onError: (error: Error) => {
      // Show error toast
      toast({
        variant: "destructive",
        description: error.message,
        duration: 3000,
      });
    },
    onSettled: () => {
      setIsUpvoting(false);
    }
  });

  // Click on post content should navigate to detail view
  const handleCardClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    // Don't navigate if clicking on an interactive element
    if (
      target.closest('.interaction-section') || 
      target.closest(`#comments-section-${project.id}`) ||
      target.closest('a') || 
      target.closest('button')
    ) {
      return;
    }
    setLocation(`/project/${project.id}`);
  };

  // Click on comment icon shows reply composer
  const handleCommentIconClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!address) {
      toast({
        variant: "destructive", 
        description: "Please connect your wallet to comment",
        duration: 3000,
      });
      return;
    }
    setShowCommentComposer(true);
  };

  const handleInteractionClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const handleCommentClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsPreviewOpen(!isPreviewOpen);
  };

  const handleUpvote = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!address) {
      toast({
        variant: "destructive",
        description: "Please connect your wallet to upvote",
        duration: 3000,
      });
      return;
    }
    await upvoteMutation.mutateAsync();
  };

  // Calculate funding progress percentage
  const progressPercentage = project.totalAmountDonatedInUsd && project.totalFunding
    ? Math.min(100, Math.round((Number(project.totalAmountDonatedInUsd) / Number(project.totalFunding)) * 100))
    : Number(project.fundingProgress ?? 0);

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
  } else if (project.inFundingRound) {
    if (progressPercentage === 100) {
      StatusIcon = TbCheck;
      statusText = 'Funded';
      statusColor = 'text-success';
    } else {
      StatusIcon = null; // Show progress % instead
      statusText = '';
      statusColor = '';
    }
  } else {
    StatusIcon = LuClock;
    statusText = 'Coming Soon';
    statusColor = 'text-darkText';
  }

  let progressColorClasses = 'bg-primary';
  if (progressPercentage === 100) {
    progressColorClasses = 'bg-success';
  } else {
    switch (project.category) {
      case 'defi':
        progressColorClasses = 'bg-gradient-to-r from-primary to-secondary';
        break;
      case 'nft':
        progressColorClasses = 'bg-gradient-to-r from-accent to-secondary';
        break;
      case 'public_goods':
        progressColorClasses = 'bg-gradient-to-r from-success to-primary';
        break;
      case 'social':
        progressColorClasses = 'bg-gradient-to-r from-accent to-primary';
        break;
      case 'gamefi':
        progressColorClasses = 'bg-gradient-to-r from-[#FF6B6B] to-[#FF9999]';
        break;
      case 'ai':
        progressColorClasses = 'bg-gradient-to-r from-[#4A90E2] to-[#87CEEB]';
        break;
      case 'refi':
        progressColorClasses = 'bg-gradient-to-r from-[#50C878] to-[#98FB98]';
        break;
    }
  }

  const categoryMap: Record<string, string> = {
    'defi': 'badge-defi',
    'nft': 'badge-nft', 
    'dao': 'badge-dao',
    'infrastructure': 'badge-infrastructure',
    'public_goods': 'badge-public-goods',
    'social': 'badge-social',
    'gamefi': 'badge-gamefi',
    'ai': 'badge-ai',
    'refi': 'badge-refi'
  };

  const categoryClass = categoryMap[project.category] || '';

  const getCategoryName = (category?: string) => {
    if (!category) return (Array.isArray(project.tags) && project.tags[0]) || 'Uncategorized';
    if (category === 'public_goods') return 'Public Goods';
    return category.charAt(0).toUpperCase() + category.slice(1);
  };

  const category = project.category || (Array.isArray(project.tags) && project.tags[0]) || 'public_goods';

  const socialIcons = [];
  if (project.twitter) {
    socialIcons.push(
      <a key="twitter" href={project.twitter} className="social-icon text-foreground hover:text-primary" aria-label="Twitter" target="_blank" rel="noopener noreferrer" onClick={handleInteractionClick}>
        <FaTwitter className="h-4 w-4" />
      </a>
    );
  }

  if (project.discord) {
    socialIcons.push(
      <a key="discord" href={project.discord} className="social-icon text-foreground hover:text-primary" aria-label="Discord" target="_blank" rel="noopener noreferrer" onClick={handleInteractionClick}>
        <FaDiscord className="h-4 w-4" />
      </a>
    );
  }
  if (project.telegram) {
    socialIcons.push(
      <a key="telegram" href={project.telegram} className="social-icon text-foreground hover:text-primary" aria-label="Telegram" target="_blank" rel="noopener noreferrer" onClick={handleInteractionClick}>
        <FaTelegram className="h-4 w-4" />
      </a>
    );
  }

  if (project.github) {
    socialIcons.push(
      <a key="github" href={project.github} className="social-icon text-foreground hover:text-primary" aria-label="GitHub" target="_blank" rel="noopener noreferrer" onClick={handleInteractionClick}>
        <FaGithub className="h-4 w-4" />
      </a>
    );
  }

  if (project.website) {
    socialIcons.push(
      <a key="website" href={project.website} className="social-icon text-foreground hover:text-primary" aria-label="Website" target="_blank" rel="noopener noreferrer" onClick={handleInteractionClick}>
        <FaGlobe className="h-4 w-4" />
      </a>
    );
  }

  return (
    <div className="bg-card rounded-xl overflow-hidden border border-border shadow-card cursor-pointer hover:border-primary transition-colors duration-500">
      <div 
        data-project-id={project.id}
        onClick={handleCardClick} 
        className="project-card h-full"
      >
        <div className="p-4 flex items-start gap-3">
          <img 
            src={project.logo || project.logoImageUrl || getProjectLogo(project.category) || '/placeholder-logo.png'}
            alt={`${project.name} logo`}
            className="w-10 h-10 rounded-lg flex-shrink-0 object-cover"
            onError={(e) => {
              const img = e.target as HTMLImageElement;
              // Try fallback to category logo, then to placeholder
              if (!img.src.includes('placeholder-logo.png')) {
                img.src = getProjectLogo(project.category) || '/placeholder-logo.png';
              } else {
                img.src = '/placeholder-logo.png';
              }
            }}
          />
          
          <div className="overflow-hidden">
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-base text-foreground truncate">{project.name}</h3>
              <span className={`badge ${categoryClass} text-xs font-normal text-foreground`}>{getCategoryName(project.category)}</span>
            </div>
            <p className="text-foreground text-sm font-normal line-clamp-2">
              {project.description}
            </p>
          </div>
        </div>
        
        <div className="px-4 pb-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm text-foreground">
              {project.inFundingRound ? (
                progressPercentage === 100 ? (
                  'Round: Successfully Funded!'
                ) : (
                  `Round: Active (${progressPercentage}% funded)`
                )
              ) : project.roundId ? (
                'Round: Ended'
              ) : (
                'Round: Not Started'
              )}
            </span>
            
            {StatusIcon && (
              <span className={`text-sm font-normal ${statusColor} flex items-center gap-1`}>
                <StatusIcon className="h-3.5 w-3.5" />
                <span className="text-xs font-normal text-foreground">{statusText}</span>
              </span>
            )}
          </div>
          <div className="progress-bar mb-3">
            <div 
              className={`progress-fill ${progressColorClasses}`} 
              style={{ width: `${progressPercentage}%` }}
            >
              {progressPercentage > 0 && (
                <div className="progress-shimmer" />
              )}
            </div>
          </div>
          
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm">
              <span className="text-foreground">Total Raised</span>
              <div className="font-medium text-foreground">
                {formatCurrency(Number(project.totalFunding ?? project.totalAmountDonatedInUsd ?? 0))}
              </div>
            </div>
            <div className="text-sm">
              <span className="text-foreground">Funding Sources</span>
              <div className="font-medium text-foreground">
                {(project.fundingSources?.length || project.roundId) ? 
                  (project.fundingSources?.join(', ') || (project.roundId ? 'Gitcoin' : '')) : 'None'}
              </div>
            </div>
          </div>
        </div>
        
        <div className="px-4 py-3 border-t border-border bg-card bg-opacity-50 flex items-center justify-between interaction-section transition-colors duration-500" onClick={handleInteractionClick}>
          <div className="flex items-center gap-2">
            <button 
              className={`flex items-center gap-1.5 transition-colors ${isPreviewOpen ? 'text-primary' : 'text-foreground hover:text-primary'}`}
              onClick={handleCommentClick}
            >
              <FaComment className="h-3.5 w-3.5" />
              <span className="text-sm">{project.commentCount || 0}</span>
            </button>
            <button 
              className={`flex items-center gap-1.5 transition-colors group
                ${project.hasUpvoted ? 'text-primary' : 'text-foreground hover:text-primary'}`}
              onClick={handleUpvote}
            >
              <BiUpvote 
                className={`h-3.5 w-3.5 transition-all duration-200 ease-out
                  ${project.hasUpvoted ? 'text-primary scale-110' : 'group-hover:-translate-y-0.5'}
                  ${upvoteAnimation ? 'animate-bounce-short' : ''}`}
              />
              <span className="text-sm">{project.pointsCount}</span>
            </button>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="flex space-x-1.5">
              {socialIcons}
            </div>
            <Button 
              size="sm"
              className={`fund-button rounded-lg px-3 py-1.5 text-sm font-medium transition-colors h-7 border-none text-black ${
                project.inFundingRound && progressPercentage < 100 
                  ? 'bg-[#c5ed5e] hover:bg-[#b3db4c]' 
                  : 'bg-[#c5ed5e]/70 hover:bg-[#c5ed5e]/80'
              }`}
              onClick={(e) => { e.stopPropagation(); setShowFundModal(true); }}
            >
              {project.inFundingRound ? (
                progressPercentage < 100 ? 'Fund' : 'Round Closed'
              ) : (
                project.fundingSources?.length ? 'Fund' : 'Coming Soon'
              )}
            </Button>
          </div>
        </div>

        {/* Modal for Fund/Donate */}
        <Dialog open={showFundModal} onOpenChange={setShowFundModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{Array.isArray(project.fundingSources) && project.fundingSources.length && ["gitcoin","giveth","optimism"].some(p => project.fundingSources!.includes(p)) ? "Fund via External Platform" : "Donate to Project"}</DialogTitle>
              <DialogDescription>
                {Array.isArray(project.fundingSources) && project.fundingSources.length && ["gitcoin","giveth","optimism"].some(p => project.fundingSources!.includes(p)) ? (
                  <>
                    This project is listed on {project.fundingSources!.join(", ")}.<br />
                    You will earn <b>{project.pointsCount}</b> Points for funding.<br />
                    Please proceed to the platform to complete your donation.
                  </>
                ) : (
                  <>
                    Donate directly with USDT, ETH, or USDC.<br />
                    You will earn <b>{project.pointsCount}</b> Points for your donation.<br />
                    {/* TODO: Add donation form here */}
                  </>
                )}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="secondary">Cancel</Button>
              </DialogClose>
              {Array.isArray(project.fundingSources) && project.fundingSources.length && ["gitcoin","giveth","optimism"].some(p => project.fundingSources!.includes(p)) ? (
                <a href={project.fundingRoundLink || '#'} target="_blank" rel="noopener noreferrer">
                  <Button variant="default">Proceed</Button>
                </a>
              ) : (
                <Button variant="default">Donate</Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {isPreviewOpen && (
          <div className="border-t border-darkBorder">
            {address ? (
              <div className="flex gap-3 p-4">
                <img
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${address}`}
                  alt="Your avatar"
                  className="w-8 h-8 rounded-full"
                />
                <Button
                  variant="ghost"
                  className="flex-1 h-auto py-2 px-3 justify-start text-sm text-foreground hover:text-primary text-left"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowCommentComposer(true);
                  }}
                >
                  Write a comment...
                </Button>
              </div>
            ) : (
              <div className="text-center py-4 text-foreground text-sm">
                Connect your wallet to join the discussion
              </div>
            )}

            {recentComments.map((comment) => (
              <CommentThread
                key={comment.id}
                projectId={project.id}
                comment={comment}
              />
            ))}

            {project.commentCount > 2 && (
              <div className="text-center py-4">
                <Button
                  variant="link"
                  className="text-primary hover:text-primary/80"
                  onClick={(e) => {
                    e.stopPropagation();
                    setLocation(`/project/${project.id}?tab=discussion`);
                  }}
                >
                  View all {project.commentCount} comments
                </Button>
              </div>
            )}
          </div>
        )}

        <CommentComposer
          isOpen={showCommentComposer}
          onClose={() => setShowCommentComposer(false)}
          projectId={project.id}
          onSuccess={() => {
            setShowCommentComposer(false);
            setIsPreviewOpen(true);
          }}
        />
      </div>
    </div>
  );
}
