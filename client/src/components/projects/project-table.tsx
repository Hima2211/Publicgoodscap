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

  const handleRowClick = (projectId: string | number) => {
    setLocation(`/project/${projectId}`);
  };

  // Use the projects prop directly
  const displayProjects = projects || [];
  
  return (
    <div className="mb-8 overflow-x-auto table-container">
      <table className="w-full min-w-[1000px] border-collapse">
        <thead>
          <tr className="border-b border-darkBorder">
            <th className="px-4 py-3 text-left text-sm font-normal text-darkText">#</th>
            <th className="px-4 py-3 text-left text-sm font-normal text-darkText">Project</th>
            <th className="px-4 py-3 text-left text-sm font-normal text-darkText">Total Funding</th>
            <th className="px-4 py-3 text-left text-sm font-normal text-darkText">Category</th>
            <th className="px-4 py-3 text-left text-sm font-normal text-darkText">Funding Status</th>
            <th className="px-4 py-3 text-left text-sm font-normal text-darkText">Round</th>
            <th className="px-4 py-3 text-left text-sm font-normal text-darkText">Links</th>
            <th className="px-4 py-3 text-left text-sm font-normal text-darkText">Funding Sources</th>
            <th className="px-4 py-3 text-left text-sm font-normal text-darkText">Actions</th>
          </tr>
        </thead>
        <tbody>
          {displayProjects.length === 0 ? (
            <tr>
              <td colSpan={9} className="px-4 py-8 text-center text-darkText">
                No projects found matching your criteria.
              </td>
            </tr>
          ) : (
            displayProjects.map((project: any, index: number) => {
              // Robust mapping for both local and Gitcoin projects
              const name = project.name || project.title || 'Untitled';
              const logo = project.logo || project.logoImageUrl || '/placeholder-logo.png';
              const description = project.description || '';
              const totalFunding = Number(project.totalFunding ?? project.totalAmountDonatedInUsd ?? 0);
              const category = project.category || (Array.isArray(project.tags) && project.tags[0]) || 'public_goods';
              const round = project.roundId || project.roundMetaPtr || '-';
              const fundingSources = project.fundingSources || (project.roundId ? ['Gitcoin'] : []);
              const progressPercentage = project.fundingProgress ?? 0;
              // Determine progress bar color classes
              let progressColorClasses = 'bg-primary';
              if (progressPercentage === 100) {
                progressColorClasses = 'bg-success';
              } else if (category === 'defi') {
                progressColorClasses = 'bg-gradient-to-r from-primary to-secondary';
              } else if (category === 'nft') {
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
              const rowId = project.id;
              return (
                <tr key={rowId} className="border-b border-darkBorder hover:bg-darkCard transition-colors cursor-pointer" onClick={() => handleRowClick(rowId)}>
                  <td className="px-4 py-4 text-sm">{index + 1}</td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <img 
                        src={logo} 
                        alt={`${name} logo`} 
                        className="w-8 h-8 rounded-md flex-shrink-0 object-cover" 
                      />
                      <div>
                        <h3 className="font-bold text-white">{name}</h3>
                        <p className="text-xs font-normal text-darkText truncate max-w-[200px]">{description}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span className="font-medium text-foreground">{formatCurrency(totalFunding)}</span>
                  </td>
                  <td className="px-4 py-4">
                    <span className={`badge ${categoryMap[category] || ''} text-xs font-normal`}>
                      {getCategoryName(category)}
                    </span>
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
                      {round || '-'}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex space-x-2">
                      {socialIcons}
                    </div>
                  </td>
                  <td className="px-4 py-4 text-sm">
                    {fundingSources.length > 0 
                      ? fundingSources.join(', ') 
                      : '-'
                    }
                  </td>
                  <td className="px-4 py-4">
                    <Button
                      size="sm"
                      className={`bg-primary text-white rounded-lg px-3 py-1.5 text-xs font-medium transition-colors h-8`}
                      asChild
                    >
                      <a 
                        href={project.fundingRoundLink || project.website || '#'} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        onClick={handleLinkClick}
                      >
                        Fund
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
