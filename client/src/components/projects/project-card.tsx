import { Button } from "@/components/ui/button";
import { Project } from "@shared/schema";
import { formatCurrency } from "@/lib/utils";
import { FaTwitter, FaDiscord, FaGithub, FaTelegram, FaGlobe, FaComment, FaRetweet } from "react-icons/fa";
import { BiUpvote } from "react-icons/bi";
import { FaFireFlameSimple } from "react-icons/fa6";
import { BiTrendingUp } from "react-icons/bi";
import { TbCheck } from "react-icons/tb";
import { LuClock } from "react-icons/lu";

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  // Determine progress percentage
  const progressPercentage = project.fundingProgress || 0;
  
  // Determine status icon and text
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
  
  // Determine progress bar color classes
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
  
  // Determine category badge style
  const categoryMap: Record<string, string> = {
    'defi': 'badge-defi',
    'nft': 'badge-nft',
    'dao': 'badge-dao',
    'infrastructure': '',
    'public_goods': '',
    'social': ''
  };
  
  const categoryClass = categoryMap[project.category] || '';
  
  // Format category display name
  const getCategoryName = (category: string) => {
    if (category === 'public_goods') return 'Public Goods';
    return category.charAt(0).toUpperCase() + category.slice(1);
  };
  
  // Social media icons
  const socialIcons = [];
  
  if (project.twitter) {
    socialIcons.push(
      <a key="twitter" href={project.twitter} className="social-icon text-darkText hover:text-primary" aria-label="Twitter" target="_blank" rel="noopener noreferrer">
        <FaTwitter />
      </a>
    );
  }
  
  if (project.discord) {
    socialIcons.push(
      <a key="discord" href={project.discord} className="social-icon text-darkText hover:text-primary" aria-label="Discord" target="_blank" rel="noopener noreferrer">
        <FaDiscord />
      </a>
    );
  }
  
  if (project.telegram) {
    socialIcons.push(
      <a key="telegram" href={project.telegram} className="social-icon text-darkText hover:text-primary" aria-label="Telegram" target="_blank" rel="noopener noreferrer">
        <FaTelegram />
      </a>
    );
  }
  
  if (project.github) {
    socialIcons.push(
      <a key="github" href={project.github} className="social-icon text-darkText hover:text-primary" aria-label="GitHub" target="_blank" rel="noopener noreferrer">
        <FaGithub />
      </a>
    );
  }
  
  if (project.website) {
    socialIcons.push(
      <a key="website" href={project.website} className="social-icon text-darkText hover:text-primary" aria-label="Website" target="_blank" rel="noopener noreferrer">
        <FaGlobe />
      </a>
    );
  }
  
  return (
    <div className="project-card bg-darkCard rounded-xl overflow-hidden border border-darkBorder shadow-card">
      {/* Project Header */}
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
      
      {/* Project Metrics */}
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
      
      {/* Project Interactions */}
      <div className="px-4 py-3 border-t border-darkBorder bg-darkCard bg-opacity-50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button 
            className="flex items-center gap-1.5 text-darkText hover:text-white transition-colors"
            onClick={() => {/* Add comment action */}}
          >
            <FaComment className="h-3.5 w-3.5" />
            <span className="text-sm">{project.commentCount || 0}</span>
          </button>
          <button 
            className="flex items-center gap-1.5 text-darkText hover:text-white transition-colors group"
            onClick={() => {/* Add upvote action */}}
          >
            <BiUpvote className="h-3.5 w-3.5 group-hover:-translate-y-0.5 transition-transform" />
            <span className="text-sm">{project.upvoteCount || 0}</span>
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
          >
            <a 
              href={project.fundingRoundLink || '#'} 
              target="_blank" 
              rel="noopener noreferrer"
            >
              {project.inFundingRound && progressPercentage < 100 ? 'Fund' : 'Donate'}
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
}
