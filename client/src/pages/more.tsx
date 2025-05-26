import React from 'react';
import { Link } from 'wouter';
import { 
  BookText, 
  Settings, 
  Trophy,
  Heart,
  Twitter,
  Globe,
  MessageCircle,
  HelpCircle,
  Info,
  Mail,
  Star
} from 'lucide-react';

const moreMenuSections = [
  {
    title: "General",
    items: [
      {
        label: "Learn",
        href: "/learn",
        icon: BookText,
        description: "Educational resources and tutorials"
      },
      {
        label: "Leaderboard",
        href: "/leaderboard",
        icon: Trophy,
        description: "Top projects and contributors"
      },
      {
        label: "Favorites",
        href: "/favorites",
        icon: Heart,
        description: "Your saved projects"
      }
    ]
  },
  {
    title: "Community",
    items: [
      {
        label: "Twitter",
        href: "https://twitter.com/youbuidl",
        icon: Twitter,
        description: "Follow us on Twitter",
        isExternal: true
      },
      {
        label: "Website",
        href: "https://youbuidl.io",
        icon: Globe,
        description: "Visit our website",
        isExternal: true
      },
      {
        label: "Feedback",
        href: "/feedback",
        icon: MessageCircle,
        description: "Share your thoughts"
      }
    ]
  },
  {
    title: "Support",
    items: [
      {
        label: "Help Center",
        href: "/help",
        icon: HelpCircle,
        description: "Get help and support"
      },
      {
        label: "About Us",
        href: "/about",
        icon: Info,
        description: "Learn about YouBuidl"
      },
      {
        label: "Contact",
        href: "/contact",
        icon: Mail,
        description: "Get in touch"
      }
    ]
  },
  {
    title: "Settings",
    items: [
      {
        label: "Settings",
        href: "/settings",
        icon: Settings,
        description: "Account and application settings"
      }
    ]
  }
];

export default function More() {
  return (
    <div className="container mx-auto px-4 py-6">
      {moreMenuSections.map((section, index) => (
        <div key={section.title} className={`mb-6 ${index > 0 ? 'mt-8' : ''}`}>
          <h2 className="text-sm font-semibold text-muted-foreground mb-3 px-2">{section.title}</h2>
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            {section.items.map((item, itemIndex) => {
              const Icon = item.icon;
              return (
                <Link key={item.href} href={item.href}>
                  <a 
                    className={`flex items-center px-4 py-3.5 hover:bg-accent/10 transition-colors
                      ${itemIndex < section.items.length - 1 ? 'border-b border-border' : ''}`}
                    {...(item.isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  >
                    <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-accent/10 mr-3">
                      <Icon className="h-4 w-4 text-accent" />
                    </div>
                    <div className="flex-grow">
                      <h3 className="text-sm font-medium text-foreground">{item.label}</h3>
                      <p className="text-xs text-muted-foreground mt-0.5">{item.description}</p>
                    </div>
                    {item.isExternal && (
                      <span className="text-xs text-muted-foreground ml-2">↗</span>
                    )}
                  </a>
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
