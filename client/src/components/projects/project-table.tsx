import { Project } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { useLocation } from "wouter";
import { FaTwitter, FaDiscord, FaGithub, FaTelegram, FaGlobe } from "react-icons/fa";

interface ProjectTableProps {
  projects: Project[];
}

export default function ProjectTable({ projects }: ProjectTableProps) {
  const [, setLocation] = useLocation();

  const handleLinkClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent row click when clicking links
  };

  // Format category display name
  const getCategoryName = (category: string) => {
    if (category === 'public_goods') return 'Public Goods';
    return category.charAt(0).toUpperCase() + category.slice(1);
  };
  
  // Determine category badge style
  const categoryMap: Record<string, string> = {
    'defi': 'badge-defi',
    'nft': 'badge-nft',
    'dao': 'badge-dao',
    'infrastructure': '',
    'public_goods': '',
    'social': ''
  };

  const handleRowClick = (projectId: number) => {
    setLocation(`/project/${projectId}`);
  };
  
  return (
    <div className="mb-8 overflow-x-auto table-container">
      <table className="w-full min-w-[1000px] border-collapse">
        <thead>
          <tr className="border-b border-darkBorder">
            <th className="px-4 py-3 text-left text-sm font-medium text-darkText">#</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-darkText">Project</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-darkText">Category</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-darkText">Links</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-darkText">Funding Status</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-darkText">Round</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-darkText">Funding Sources</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-darkText">Total Funding</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-darkText">Actions</th>
          </tr>
        </thead>
        <tbody>
          {projects.length === 0 ? (
            <tr>
              <td colSpan={9} className="px-4 py-8 text-center text-darkText">
                No projects found matching your criteria.
              </td>
            </tr>
          ) : (
            projects.map((project, index) => {
              // Progress percentage
              const progressPercentage = project.fundingProgress || 0;
              
              // Determine progress bar color classes
              let progressColorClasses = 'bg-primary';
              if (progressPercentage === 100) {
                progressColorClasses = 'bg-success';
              } else if (project.category === 'defi') {
                progressColorClasses = 'bg-gradient-to-r from-primary to-secondary';
              } else if (project.category === 'nft') {
                progressColorClasses = 'bg-gradient-to-r from-accent to-secondary';
              }
              
              // Round status
              let roundStatusClass = 'bg-success bg-opacity-10 text-success';
              let roundStatusText = 'Open';
              
              if (!project.inFundingRound || progressPercentage === 100) {
                roundStatusClass = 'bg-darkBorder text-darkText';
                roundStatusText = 'Closed';
              } else if (project.isTrending) {
                roundStatusClass = 'bg-warning bg-opacity-10 text-warning';
              }
              
              // Social media icons
              const socialIcons = [];
              
              if (project.twitter) {
                socialIcons.push(
                  <a key="twitter" href={project.twitter} className="social-icon text-darkText hover:text-primary" aria-label="Twitter" target="_blank" rel="noopener noreferrer" onClick={handleLinkClick}>
                    <FaTwitter />
                  </a>
                );
              }
              
              if (project.discord) {
                socialIcons.push(
                  <a key="discord" href={project.discord} className="social-icon text-darkText hover:text-primary" aria-label="Discord" target="_blank" rel="noopener noreferrer" onClick={handleLinkClick}>
                    <FaDiscord />
                  </a>
                );
              }
              
              if (project.telegram) {
                socialIcons.push(
                  <a key="telegram" href={project.telegram} className="social-icon text-darkText hover:text-primary" aria-label="Telegram" target="_blank" rel="noopener noreferrer" onClick={handleLinkClick}>
                    <FaTelegram />
                  </a>
                );
              }
              
              if (project.github) {
                socialIcons.push(
                  <a key="github" href={project.github} className="social-icon text-darkText hover:text-primary" aria-label="GitHub" target="_blank" rel="noopener noreferrer" onClick={handleLinkClick}>
                    <FaGithub />
                  </a>
                );
              }
              
              if (project.website) {
                socialIcons.push(
                  <a key="website" href={project.website} className="social-icon text-darkText hover:text-primary" aria-label="Website" target="_blank" rel="noopener noreferrer" onClick={handleLinkClick}>
                    <FaGlobe />
                  </a>
                );
              }
              
              return (
                <tr key={project.id} className="border-b border-darkBorder hover:bg-darkCard transition-colors cursor-pointer" onClick={() => handleRowClick(project.id)}>
                  <td className="px-4 py-4 text-sm">{index + 1}</td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <img 
                        src={project.logo} 
                        alt={`${project.name} logo`} 
                        className="w-8 h-8 rounded-md flex-shrink-0 object-cover" 
                      />
                      <div>
                        <h3 className="font-medium text-white">{project.name}</h3>
                        <p className="text-xs text-darkText truncate max-w-[200px]">{project.description}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span className={`badge ${categoryMap[project.category] || ''} text-xs`}>
                      {getCategoryName(project.category)}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex space-x-2">
                      {socialIcons}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-16 bg-darkBorder rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${progressColorClasses}`} 
                          style={{ width: `${progressPercentage}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-darkText">{progressPercentage}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${roundStatusClass}`}>
                      {roundStatusText}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-sm">
                    {project.fundingSources?.length 
                      ? project.fundingSources.join(', ') 
                      : '-'
                    }
                  </td>
                  <td className="px-4 py-4 text-sm font-medium">
                    {formatCurrency(project.totalFunding)}
                  </td>
                  <td className="px-4 py-4">
                    <Button
                      size="sm"
                      className={`${
                        project.inFundingRound && progressPercentage < 100
                          ? 'bg-primary hover:bg-opacity-90'
                          : 'bg-darkCard hover:bg-opacity-90'
                      } text-white rounded-lg px-3 py-1.5 text-xs font-medium transition-colors h-8`}
                      asChild
                    >
                      <a 
                        href={project.fundingRoundLink || '#'} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        onClick={handleLinkClick}
                      >
                        {project.inFundingRound && progressPercentage < 100 ? 'Fund' : 'Donate'}
                      </a>
                    </Button>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
