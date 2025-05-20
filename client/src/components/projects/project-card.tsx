import { Button } from "@/components/ui/button";
import { Project } from "@shared/schema";
import { formatCurrency } from "@/lib/utils";
import { Link, useLocation } from "wouter";
import { FaTwitter, FaDiscord, FaGithub, FaTelegram, FaGlobe, FaComment, FaRetweet, FaHeart } from "react-icons/fa";
import { BiUpvote } from "react-icons/bi";
import { FaFireFlameSimple } from "react-icons/fa6";
import { BiTrendingUp } from "react-icons/bi";
import { TbCheck } from "react-icons/tb";
import { LuClock } from "react-icons/lu";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { useAccount } from "wagmi";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { useToast } from "@/hooks/use-toast";

interface Comment {
  id: number;
  content: string;
  user: {
    address: string;
    avatar: string;
  };
  createdAt: string;
  likes: number;
  hasLiked: boolean;
}

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const [, setLocation] = useLocation();
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [upvoteAnimation, setUpvoteAnimation] = useState(false);
  const [isUpvoting, setIsUpvoting] = useState(false);
  const { address } = useAccount();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Fetch recent comments
  const { data: recentComments = [], isLoading: isLoadingComments } = useQuery<Comment[]>({
    queryKey: ['comments', project.id, 'recent'],
    queryFn: async () => {
      const response = await fetch(`/api/projects/${project.id}/comments?limit=2`);
      if (!response.ok) throw new Error('Failed to fetch comments');
      return response.json();
    },
    enabled: isCommentsOpen, // Only fetch when comments section is open
  });

  const createCommentMutation = useMutation({
    mutationFn: async (content: string) => {
      const response = await fetch(`/api/projects/${project.id}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, userId: address })
      });
      if (!response.ok) throw new Error('Failed to create comment');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', project.id] });
      setNewComment('');
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

      // Invalidate project data to refresh points count
      queryClient.invalidateQueries({ queryKey: ['projects'] });
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
  });    const handleCardClick = (e: React.MouseEvent) => {
      const target = e.target as HTMLElement;
      const commentsSection = target.closest(`#comments-section-${project.id}`);
      const interactionSection = target.closest('.interaction-section');
      
      if (!commentsSection && !interactionSection) {
        setLocation(`/project/${project.id}`);
      }
    };;

  const handleInteractionClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const handleCommentClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsCommentsOpen(!isCommentsOpen);
  };

  const handleSubmitComment = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!address || !newComment.trim()) return;
    await createCommentMutation.mutate(newComment);
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

  const progressPercentage = project.fundingProgress || 0;

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

  const categoryMap: Record<string, string> = {
    'defi': 'badge-defi',
    'nft': 'badge-nft',
    'dao': 'badge-dao',
    'infrastructure': '',
    'public_goods': '',
    'social': ''
  };

  const categoryClass = categoryMap[project.category] || '';

  const getCategoryName = (category: string) => {
    if (category === 'public_goods') return 'Public Goods';
    return category.charAt(0).toUpperCase() + category.slice(1);
  };

  const socialIcons = [];
  if (project.twitter) {
    socialIcons.push(
      <a key="twitter" href={project.twitter} className="social-icon text-darkText hover:text-primary" aria-label="Twitter" target="_blank" rel="noopener noreferrer" onClick={handleInteractionClick}>
        <FaTwitter className="h-4 w-4" />
      </a>
    );
  }

  if (project.discord) {
    socialIcons.push(
      <a key="discord" href={project.discord} className="social-icon text-darkText hover:text-primary" aria-label="Discord" target="_blank" rel="noopener noreferrer" onClick={handleInteractionClick}>
        <FaDiscord className="h-4 w-4" />
      </a>
    );
  }
  if (project.telegram) {
    socialIcons.push(
      <a key="telegram" href={project.telegram} className="social-icon text-darkText hover:text-primary" aria-label="Telegram" target="_blank" rel="noopener noreferrer" onClick={handleInteractionClick}>
        <FaTelegram className="h-4 w-4" />
      </a>
    );
  }

  if (project.github) {
    socialIcons.push(
      <a key="github" href={project.github} className="social-icon text-darkText hover:text-primary" aria-label="GitHub" target="_blank" rel="noopener noreferrer" onClick={handleInteractionClick}>
        <FaGithub className="h-4 w-4" />
      </a>
    );
  }

  if (project.website) {
    socialIcons.push(
      <a key="website" href={project.website} className="social-icon text-darkText hover:text-primary" aria-label="Website" target="_blank" rel="noopener noreferrer" onClick={handleInteractionClick}>
        <FaGlobe className="h-4 w-4" />
      </a>
    );
  }

  const renderComments = () => {
    if (!isCommentsOpen) return null;

    return (
      <div 
        id={`comments-section-${project.id}`}
        className="border-t border-darkBorder bg-darkBg"
        onClick={handleInteractionClick}
      >
        <div className="p-4">
          {address ? (
            <div className="flex gap-3 mb-4">
              <img
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${address}`}
                alt="Your avatar"
                className="w-8 h-8 rounded-full"
              />
              <div className="flex-1">
                <Textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Write a comment..."
                  className="bg-darkCard border-darkBorder mb-2 min-h-[80px] text-sm"
                />
                <div className="flex justify-end">
                  <Button
                    size="sm"
                    onClick={handleSubmitComment}
                    disabled={!newComment.trim()}
                  >
                    Comment
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-darkCard border border-darkBorder rounded-lg p-3 text-center mb-4">
              <p className="text-sm text-darkText mb-2">Want to join the discussion?</p>
              <Button
                size="sm"
                variant="outline"
                className="text-primary border-primary hover:bg-primary/10"
              >
                Connect Wallet
              </Button>
            </div>
          )}

          {isLoadingComments ? (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-accent mx-auto"></div>
            </div>
          ) : recentComments.length === 0 ? (
            <div className="text-center py-4 text-darkText text-sm">
              No comments yet. Be the first to comment!
            </div>
          ) : (
            <div>
              <ul className="space-y-4">
                {recentComments.map((comment) => (
                  <li key={comment.id} className="group">
                    <div className="flex gap-3">
                      <img
                        src={comment.user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${comment.user.address}`}
                        alt={`${comment.user.address} avatar`}
                        className="w-8 h-8 rounded-full"
                      />
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <span className="text-sm text-white">
                              {comment.user.address.slice(0, 6)}...{comment.user.address.slice(-4)}
                            </span>
                            <span className="mx-1.5 text-darkText">•</span>
                            <span className="text-xs text-darkText">
                              {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                            </span>
                          </div>
                          {address && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className={`flex items-center gap-1 opacity-0 group-hover:opacity-100 ${comment.hasLiked ? 'text-red-500' : 'text-darkText'}`}
                              onClick={(e) => handleLike(e, comment.id)}
                            >
                              <FaHeart className="h-3 w-3" />
                              <span className="text-xs">{comment.likes}</span>
                            </Button>
                          )}
                        </div>
                        <p className="text-sm text-white mt-1">{comment.content}</p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
              {project.commentCount > 2 && (
                <div className="text-center pt-4">
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
        </div>
      </div>
    );
  };

  return (
    <div 
      data-project-id={project.id}
      onClick={handleCardClick} 
      className="project-card bg-darkCard rounded-xl overflow-hidden border border-darkBorder shadow-card cursor-pointer hover:border-primary">
      <div className="p-4 flex items-start gap-3">
        <img 
          src={project.logo} 
          alt={`${project.name} logo`} 
          className="w-10 h-10 rounded-lg flex-shrink-0 object-cover" 
        />
        
        <div className="overflow-hidden">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-base text-white truncate">{project.name}</h3>
            <span className={`badge ${categoryClass} text-xs`}>{getCategoryName(project.category)}</span>
          </div>
          <p className="text-darkText text-sm line-clamp-2">
            {project.description}
          </p>
        </div>
      </div>
      
      <div className="px-4 pb-3">
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm text-darkText">
            {project.inFundingRound 
              ? `Round: ${progressPercentage === 100 ? 'Closed' : 'Open'} ${progressPercentage < 100 ? `(${progressPercentage}% funded)` : ''}`
              : 'Round: Closed'
            }
          </span>
          
          {StatusIcon && (
            <span className={`text-sm font-medium ${statusColor} flex items-center gap-1`}>
              <StatusIcon className="h-3.5 w-3.5" />
              <span>{statusText}</span>
            </span>
          )}
        </div>
        <div className="progress-bar mb-3">
          <div 
            className={`progress-fill ${progressColorClasses}`} 
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
        
        <div className="flex items-center justify-between mb-2">
          <div className="text-sm">
            <span className="text-darkText">Total Raised</span>
            <div className="font-medium text-white">{formatCurrency(project.totalFunding)}</div>
          </div>
          <div className="text-sm">
            <span className="text-darkText">Funding Sources</span>
            <div className="font-medium text-white">
              {project.fundingSources?.length ? project.fundingSources.join(', ') : 'None'}
            </div>
          </div>
        </div>
      </div>
      
      <div className="px-4 py-3 border-t border-darkBorder bg-darkCard bg-opacity-50 flex items-center justify-between interaction-section" onClick={handleInteractionClick}>
        <div className="flex items-center gap-2">
          <button 
            className="flex items-center gap-1.5 text-darkText hover:text-white transition-colors"
            onClick={handleCommentClick}
          >
            <FaComment className={`h-3.5 w-3.5 ${isCommentsOpen ? 'text-primary' : ''}`} />
            <span className="text-sm">{project.commentCount || 0}</span>
          </button>
          <button 
            className={`flex items-center gap-1.5 transition-colors group
              ${project.hasUpvoted ? 'text-primary' : 'text-darkText hover:text-white'}`}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleUpvote(e);
            }}
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
            className={`fund-button ${
              project.inFundingRound && progressPercentage < 100
                ? 'bg-primary hover:bg-opacity-90'
                : 'bg-darkCard hover:bg-opacity-90'
            } text-white rounded-lg px-3 py-1.5 text-sm font-medium transition-colors h-7`}
            asChild
            onClick={handleInteractionClick}
          >
            <a 
              href={project.fundingRoundLink || '#'} 
              target="_blank" 
              rel="noopener noreferrer"
              onClick={handleInteractionClick}
            >
              {project.inFundingRound && progressPercentage < 100 ? 'Fund' : 'Donate'}
            </a>
          </Button>
        </div>
      </div>

      {renderComments()}
    </div>
  );
}
