import { cn } from "@/lib/utils";

export function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-border/50 dark:bg-darkBorder/50 transition-colors duration-300", className)}
      {...props}
    />
  );
}

export function ProjectCardSkeleton() {
  return (
    <div className="border border-border dark:border-darkBorder rounded-xl overflow-hidden bg-card dark:bg-darkCard transition-colors duration-500">
      <div className="p-4">
        <div className="flex gap-3">
          <Skeleton className="h-10 w-10 rounded-lg flex-shrink-0" />
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-5 w-16" />
            </div>
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4 mt-1" />
          </div>
        </div>
      </div>
      <div className="px-4 pb-3">
        <div className="flex items-center justify-between mb-1">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-20" />
        </div>
        <Skeleton className="h-1.5 w-full mb-3 rounded-full" />
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-3 w-16 mb-1" />
            <Skeleton className="h-4 w-24" />
          </div>
          <div>
            <Skeleton className="h-3 w-16 mb-1" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
      </div>
      <div className="px-4 py-3 border-t border-border dark:border-darkBorder">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-16" />
          </div>
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <Skeleton className="h-4 w-4" />
              <Skeleton className="h-4 w-4" />
              <Skeleton className="h-4 w-4" />
            </div>
            <Skeleton className="h-7 w-16 rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function ProjectDetailsSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 animate-pulse">
      <Skeleton className="h-9 w-24 mb-6" />
      
      <div className="flex flex-col md:flex-row gap-6 mb-8">
        <Skeleton className="w-24 h-24 rounded-xl flex-shrink-0" />
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-6 w-24 rounded-full" />
            <Skeleton className="h-6 w-20" />
          </div>
          <Skeleton className="h-5 w-full mb-2" />
          <Skeleton className="h-5 w-3/4 mb-4" />
          <div className="flex items-center gap-4">
            <Skeleton className="h-5 w-5" />
            <Skeleton className="h-5 w-5" />
            <Skeleton className="h-5 w-5" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-card dark:bg-darkCard rounded-xl p-6 border border-border dark:border-darkBorder transition-colors duration-500">
            <Skeleton className="h-6 w-32 mb-4" />
            <div className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </div>
        ))}
      </div>

      <div className="bg-card dark:bg-darkCard rounded-xl border border-border dark:border-darkBorder overflow-hidden transition-colors duration-500">
        <div className="border-b border-border dark:border-darkBorder">
          <div className="flex">
            <Skeleton className="h-12 w-1/2" />
            <Skeleton className="h-12 w-1/2" />
          </div>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function ProfileSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 animate-pulse">
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <Skeleton className="h-24 w-24 rounded-full" />
          <div>
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-5 w-96" />
          </div>
        </div>
        <div className="flex gap-6">
          <Skeleton className="h-16 w-24" />
          <Skeleton className="h-16 w-24" />
          <Skeleton className="h-16 w-24" />
          <Skeleton className="h-16 w-24" />
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <ProjectCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

export function LeaderboardSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-6">
        <Skeleton className="h-12 w-full max-w-md mx-auto rounded-lg" />
      </div>
      <div className="space-y-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="bg-card dark:bg-darkCard rounded-lg p-4 border border-border dark:border-darkBorder transition-colors duration-500">
            <div className="flex items-center gap-4">
              <Skeleton className="h-8 w-8" />
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="flex-1">
                <Skeleton className="h-5 w-48 mb-1" />
                <Skeleton className="h-4 w-3/4" />
              </div>
              <Skeleton className="h-6 w-24" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
