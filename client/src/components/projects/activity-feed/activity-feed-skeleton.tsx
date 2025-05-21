import { Skeleton } from "@/components/ui/skeletons";

export function ActivityFeedSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-darkCard border border-darkBorder">
          <Skeleton className="w-8 h-8 rounded-full" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-full bg-darkBg">
                <Skeleton className="h-4 w-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-3 w-16" />
                </div>
                <Skeleton className="h-3 w-32 mt-1" />
              </div>
            </div>
            <Skeleton className="h-4 w-3/4 mt-2" />
          </div>
        </div>
      ))}
    </div>
  );
}
