import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function MainCardSkeleton() {
  return (
    <Card
      className="w-full overflow-hidden border border-border/80 bg-card/60 shadow-sm"
      style={{ borderInlineStartWidth: "4px", borderInlineStartColor: "var(--primary)" }}
    >
      <CardHeader className="gap-4 pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1 space-y-2">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </div>
          <Skeleton className="size-4 shrink-0 rounded-sm" />
        </div>

        <div className="flex items-center justify-between gap-3">
          <Skeleton className="h-6 w-16 rounded-full" />
          <Skeleton className="h-4 w-10" />
        </div>

        <div className="flex items-center gap-2">
          <Skeleton className="h-2 flex-1 rounded-full" />
          <Skeleton className="h-4 w-8 rounded-sm" />
        </div>
      </CardHeader>

      <CardContent className="space-y-3 pt-0">
        <div className="h-px w-full bg-border/60" />

        <div className="flex flex-wrap gap-1.5">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-6 w-14 rounded-full" />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
