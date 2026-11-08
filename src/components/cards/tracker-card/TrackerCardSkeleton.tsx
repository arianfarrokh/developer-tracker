import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export function TrackerCardSkeleton({ className }: { className?: string }) {
  return (
    <Card
      className={cn(
        "w-full border border-border/80 bg-card/60 shadow-sm",
        className,
      )}
    >
      <CardContent className="space-y-4 p-4 sm:p-5">
        <div className="flex justify-between">
          <Skeleton className="h-3 w-16" />
          <div className="flex gap-1">
            <Skeleton className="size-7 rounded-md" />
            <Skeleton className="size-7 rounded-md" />
            <Skeleton className="size-7 rounded-md" />
          </div>
        </div>

        <div className="space-y-2">
          <Skeleton className="h-6 w-14 rounded-full" />
          <Skeleton className="h-7 w-3/4" />
          <Skeleton className="h-4 w-full" />
        </div>

        <div className="space-y-2 rounded-xl border border-border/60 p-3">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-2 w-full rounded-full" />
        </div>

        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <div className="space-y-2 rounded-xl border border-border/60 p-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full rounded-lg" />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
