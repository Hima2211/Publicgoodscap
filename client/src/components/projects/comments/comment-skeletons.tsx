import { Skeleton } from "@/components/ui/skeletons";

export function CommentsSkeleton() {
  return (
    <div className="space-y-6">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex gap-3">
          <Skeleton className="w-10 h-10 rounded-full flex-shrink-0" />
          <div className="flex-1">
            <div className="p-4 rounded-lg bg-darkCard border border-darkBorder">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-16" />
                </div>
                <Skeleton className="h-4 w-16" />
              </div>
              <Skeleton className="h-4 w-full mt-2" />
              <Skeleton className="h-4 w-3/4 mt-1" />
            </div>
            
            {/* Nested replies */}
            <div className="pl-4 border-l border-darkBorder mt-4 space-y-4">
              {[1, 2].map((j) => (
                <div key={j} className="flex gap-3">
                  <Skeleton className="w-8 h-8 rounded-full flex-shrink-0" />
                  <div className="flex-1">
                    <div className="p-3 rounded-lg bg-darkCard border border-darkBorder">
                      <div className="flex items-center justify-between mb-2">
                        <Skeleton className="h-3 w-24" />
                        <Skeleton className="h-3 w-12" />
                      </div>
                      <Skeleton className="h-3 w-full" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
