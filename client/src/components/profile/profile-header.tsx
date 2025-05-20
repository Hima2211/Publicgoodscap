import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Globe, Github, Twitter } from "lucide-react";

interface ProfileHeaderProps {
  user: any;
  stats: {
    totalContributions: number;
    followers: number;
    following: number;
  };
  onEditProfile?: () => void;
}

export function ProfileHeader({ user, stats, onEditProfile }: ProfileHeaderProps) {
  const initials = user.email?.split('@')[0].slice(0, 2).toUpperCase() || 'AN';
  // Generate Dicebear avatar URL using the user's username or email as seed
  const dicebearUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username || user.email}`;
  
  // Determine if user is a project owner (has at least one project)
  const isProjectOwner = user.projects?.length > 0;
  
  return (
    <div className="px-6 py-4 bg-darkCard border-b border-darkBorder">
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <Avatar className="w-20 h-20">
          <AvatarImage src={user.avatar_url || dicebearUrl} alt={user.name || 'Profile'} />
          <AvatarFallback className="bg-primary text-white text-xl">
            {initials}
          </AvatarFallback>
        </Avatar>
        
        {/* User Info & Stats */}
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-white">{user.name || user.email?.split('@')[0]}</h1>
                <Badge 
                  variant={isProjectOwner ? "success" : "default"}
                  className={isProjectOwner ? 
                    "bg-primary/10 text-primary" : 
                    "bg-accent/10 text-accent"
                  }
                >
                  {isProjectOwner ? 'Project Owner' : 'Member'}
                </Badge>
              </div>
              <p className="text-darkText">@{user.username || user.email?.split('@')[0].toLowerCase()}</p>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={onEditProfile}
            >
              Edit Profile
            </Button>
          </div>
          
          {/* Bio */}
          <p className="mt-2 text-white text-sm">
            {user.bio || 'No bio yet'}
          </p>
          
          {/* Quick Stats */}
          <div className="flex gap-4 mt-2 text-sm text-darkText">
            <span>{stats.totalContributions} contributions</span>
            <span>{stats.followers} followers</span>
            <span>{stats.following} following</span>
            {isProjectOwner && <span>{user.projects?.length} projects</span>}
          </div>
          
          {/* Links */}
          <div className="flex items-center gap-3 mt-2">
            {user.website && (
              <a 
                href={user.website} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-darkText hover:text-white"
                title="Website"
              >
                <Globe className="w-4 h-4" />
              </a>
            )}
            {user.github && (
              <a 
                href={user.github} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-darkText hover:text-white"
                title="Github"
              >
                <Github className="w-4 h-4" />
              </a>
            )}
            {user.twitter && (
              <a 
                href={user.twitter} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-darkText hover:text-white"
                title="Twitter"
              >
                <Twitter className="w-4 h-4" />
              </a>
            )}
          </div>
          
          {/* Additional Badges for Project Owners */}
          {isProjectOwner && (
            <div className="flex flex-wrap gap-2 mt-2">
              {user.projects?.some((p: any) => p.isHot) && (
                <Badge variant="default" className="bg-accent/10 text-accent">
                  Hot Projects
                </Badge>
              )}
              {user.projects?.some((p: any) => p.isTrending) && (
                <Badge variant="warning" className="bg-warning/10">
                  Trending Projects
                </Badge>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
