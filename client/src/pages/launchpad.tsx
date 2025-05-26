import React from 'react';
import { Rocket } from 'lucide-react';

export default function Launchpad() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
      <div className="animate-float">
        <div className="flex items-center justify-center w-20 h-20 rounded-full bg-accent/10 mb-6">
          <Rocket className="h-10 w-10 text-accent" />
        </div>
      </div>
      <h1 className="text-3xl font-bold mb-4">Launchpad Coming Soon</h1>
      <p className="text-muted-foreground max-w-md mb-8">
        Get ready to discover and support the next generation of public goods projects. 
        Our launchpad will help promising projects take off.
      </p>
      <div className="flex flex-col gap-4 items-center">
        <div className="bg-card border border-border rounded-lg p-4 max-w-sm w-full">
          <h3 className="font-medium mb-2">Features to Expect</h3>
          <ul className="text-sm text-muted-foreground text-left space-y-2">
            <li>• Project submissions and curation</li>
            <li>• Community voting and feedback</li>
            <li>• Direct support and funding</li>
            <li>• Project milestones tracking</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
