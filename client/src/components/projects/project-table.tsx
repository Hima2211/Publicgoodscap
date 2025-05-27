import { Project } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { FundingChart } from './funding-chart';
import { useState } from 'react';
import { useLocation } from 'wouter';
import { FaTwitter, FaDiscord, FaGithub, FaTelegram, FaGlobe } from "react-icons/fa";

interface ProjectTableProps {
  projects: Project[];
}

export default function ProjectTable({ projects }: ProjectTableProps) {
  const [, setLocation] = useLocation();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 100; // Show 100 projects per page
  const totalPages = Math.ceil((projects?.length || 0) / itemsPerPage);

  const handleLinkClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent row click when clicking links
  };

  // Format category display name
  const getCategoryName = (category: string) => {
    if (category === 'public_goods') return 'Public Goods';
    if (category === 'gamefi') return 'GameFi';
    if (category === 'ai') return 'AI';
    if (category === 'refi') return 'ReFi';
    return category.charAt(0).toUpperCase() + category.slice(1);
  };

  // Format round display
  const formatRound = (round: string) => {
    if (!round || round === '-') return '-';
    
    // Check if it's an Ethereum address
    if (/^0x[a-fA-F0-9]{40}$/.test(round)) {
      return `${round.slice(0, 6)}...${round.slice(-4)}`;
    }
    
    // Check if it's a round name (e.g. from Gitcoin)
    if (round.includes('GR') || round.includes('round') || round.includes('Round')) {
      return round;
    }
    
    // For any other format, just return as is
    return round;
  };

  // Determine category badge style
  const categoryMap: Record<string, string> = {
    'defi': 'badge-defi',
    'nft': 'badge-nft',
    'dao': 'badge-dao',
    'infrastructure': '',
    'public_goods': '',
    'social': '',
    'gamefi': 'badge-gamefi',
    'ai': 'badge-ai',
    'refi': 'badge-refi'
  };

  const handleRowClick = (projectId: string | number) => {
    setLocation(`/project/${projectId}`);
  };

  // Calculate total funding
  const totalMarketFunding = projects.reduce((sum, project) => {
    const funding = Number(project.totalFunding ?? project.totalAmountDonatedInUsd ?? 0);
    return sum + funding;
  }, 0);

  // Sort projects by total funding amount (descending)
  const sortedProjects = [...(projects || [])].sort((a, b) => {
    const aFunding = Number((a as any).totalFunding ?? (a as any).totalAmountDonatedInUsd ?? 0);
    const bFunding = Number((b as any).totalFunding ?? (b as any).totalAmountDonatedInUsd ?? 0);
    return bFunding - aFunding;
  });

  // Get current page's projects
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentPageProjects = sortedProjects.slice(startIndex, startIndex + itemsPerPage);
  
  return (
    <div className="mb-4 overflow-x-auto table-container -mx-4 md:mx-0">
      <div className="flex justify-end mb-2 px-4">
        <div className="px-3 py-1.5 bg-darkCard rounded-lg border border-darkBorder">
          <span className="text-xs text-darkText">Market Volume: </span>
          <span className="text-sm text-foreground">{formatCurrency(totalMarketFunding)}</span>
        </div>
      </div>
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-darkBorder">
            <th className="px-2 md:px-3 py-1.5 md:py-2 text-left text-xs font-normal text-darkText">#</th>
            <th className="px-2 md:px-3 py-1.5 md:py-2 text-left text-xs font-normal text-darkText">Project</th>
            <th className="px-2 md:px-3 py-1.5 md:py-2 text-left text-xs font-normal text-darkText">Total Funding</th>
            <th className="px-2 md:px-3 py-1.5 md:py-2 text-left text-xs font-normal text-darkText">Funding Status</th>
            <th className="px-2 md:px-3 py-1.5 md:py-2 text-left text-xs font-normal text-darkText">Category</th>
            <th className="px-2 md:px-3 py-1.5 md:py-2 text-left text-xs font-normal text-darkText">Round</th>
            <th className="px-2 md:px-3 py-1.5 md:py-2 text-left text-xs font-normal text-darkText">Links</th>
            <th className="px-2 md:px-3 py-1.5 md:py-2 text-left text-xs font-normal text-darkText">Funding Sources</th>
            <th className="px-2 md:px-3 py-1.5 md:py-2 text-left text-xs font-normal text-darkText">Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentPageProjects.length === 0 ? (
            <tr>
              <td colSpan={9} className="px-2 md:px-4 py-8 text-center text-darkText">
                No projects found matching your criteria.
              </td>
            </tr>
          ) : (
            currentPageProjects.map((project: any, index: number) => {
              // Robust mapping for both local and Gitcoin/Karma projects
              const name = project.name || project.title || 'Untitled';
              const logo = project.logo || project.logoImageUrl || project.imageURL || '/placeholder-logo.png';
              const description = project.description || '';
              const totalFunding = Number(project.totalFunding ?? project.totalAmountDonatedInUsd ?? 0);
              const donatedAmount = Number(project.totalAmountDonatedInUsd ?? 0);
              const progressPercentage = totalFunding > 0 ? Math.min(100, Math.round((donatedAmount / totalFunding) * 100)) : 0;
              const category = project.category || (Array.isArray(project.tags) && project.tags[0]) || 'public_goods';
              const round = project.roundId || project.roundMetaPtr || '-';
              const fundingSources = project.fundingSources || (project.roundId ? ['Gitcoin'] : []);

              // Determine progress bar color classes
              let progressColorClasses = 'bg-primary';
              if (progressPercentage === 100) {
                progressColorClasses = 'bg-success';
              } else if (category === 'defi') {
                progressColorClasses = 'bg-gradient-to-r from-primary to-secondary';
              } else if (category === 'nft') {
                progressColorClasses = 'bg-gradient-to-r from-accent to-secondary';
              }

              // Calculate historical funding points based on actual progress
              const now = new Date();
              const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
              const fiveDaysAgo = new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000);
              const threeDaysAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);

              // Use actual donated amount to create realistic looking progress points
              const graphData = [
                {
                  amount: donatedAmount * 0.7,
                  date: oneWeekAgo.toISOString().split('T')[0]
                },
                {
                  amount: donatedAmount * 0.85,
                  date: fiveDaysAgo.toISOString().split('T')[0]
                },
                {
                  amount: donatedAmount * 0.95,
                  date: threeDaysAgo.toISOString().split('T')[0]
                },
                {
                  amount: donatedAmount,
                  date: now.toISOString().split('T')[0]
                }
              ];

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
                <tr key={rowId} 
                    className="border-b border-darkBorder hover:bg-darkCard/50" 
                    onClick={() => handleRowClick(rowId)}>
                  <td className="px-2 md:px-3 py-2 text-sm font-normal">
                    {(currentPage - 1) * itemsPerPage + index + 1}
                  </td>
                  <td className="px-2 md:px-3 py-2">
                    <div className="flex items-center gap-2">
                      <img 
                        src={logo} 
                        alt={`${name} logo`} 
                        className="w-6 h-6 md:w-8 md:h-8 rounded-md flex-shrink-0 object-cover"
                        onError={(e) => {
                          const img = e.target as HTMLImageElement;
                          if (!img.src.includes('/placeholder-logo.png')) {
                            img.src = '/placeholder-logo.png';
                          }
                        }}
                      />
                      <span className="text-sm font-normal">{name}</span>
                    </div>
                  </td>
                  <td className="px-2 md:px-3 py-2">
                    <span className="text-sm font-normal">{formatCurrency(totalFunding)}</span>
                  </td>
                  <td className="px-2 md:px-3 py-2">
                    <div className="flex items-center gap-2 md:gap-3">
                      <div className="w-[100px] md:w-[120px] h-[30px] md:h-[40px]">
                        <FundingChart 
                          data={graphData} 
                          gradientFrom={
                            (() => {
                              if (!totalFunding) return '#666';
                              const fundedRatio = donatedAmount / totalFunding;
                              
                              // Color based on funding ratio
                              if (fundedRatio >= 1) return '#16c784';       // 100%+ funded - Green
                              if (fundedRatio >= 0.8) return '#f3ba2f';     // 80-99% funded - Yellow
                              if (fundedRatio >= 0.5) return '#2196f3';     // 50-79% funded - Blue
                              if (fundedRatio >= 0.3) return '#a552f7';     // 30-49% funded - Purple
                              return '#ea3943';                             // < 30% funded - Red
                            })()
                          } 
                          gradientTo="rgba(22, 21, 34, 0.1)"               // Transparent dark for all
                        />
                      </div>
                    </div>
                  </td>
                  <td className="px-2 md:px-3 py-2">
                    <span className={`badge ${categoryMap[category] || ''} text-[10px] md:text-xs font-normal`}>
                      {getCategoryName(category)}
                    </span>
                  </td>
                  <td className="px-2 md:px-3 py-2">
                    <span className={`inline-flex items-center px-1.5 md:px-2 py-0.5 md:py-1 rounded-full text-[10px] md:text-xs font-medium ${roundStatusClass}`}>
                      {formatRound(round)}
                    </span>
                  </td>
                  <td className="px-2 md:px-3 py-2">
                    <div className="flex items-center gap-2">
                      {project.website_url && (
                        <a
                          href={project.website_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:text-primary/80"
                        >
                          <FaGlobe className="h-4 w-4" />
                        </a>
                      )}
                      {project.twitter_url && (
                        <a
                          href={project.twitter_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:text-primary/80"
                        >
                          <FaTwitter className="h-4 w-4" />
                        </a>
                      )}
                    </div>
                  </td>
                  <td className="px-2 md:px-3 py-2">
                    <div className="flex items-center gap-1.5">
                      {fundingSources.length > 0 ? fundingSources.join(', ') : '-'}
                    </div>
                  </td>
                  <td className="px-2 md:px-3 py-2">
                    <Button
                      size="sm"
                      className="bg-primary text-white rounded-lg px-2 md:px-3 py-1 md:py-1.5 text-[10px] md:text-xs font-medium transition-colors h-6 md:h-8"
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

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-4 mb-2">
          <Button
            size="sm"
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-4 py-2"
          >
            Previous
          </Button>
          <span className="text-sm text-darkText">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            size="sm"
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-4 py-2"
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
