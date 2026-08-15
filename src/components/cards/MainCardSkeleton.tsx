import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

export function MainCardSkeleton() {
  return (
    <Card className="max-w-[24rem] border-l-4 border-l-primary/40">
      <div className="flex items-center justify-end px-2 pt-1">
        <Skeleton className="size-4 rounded-sm" />
      </div>

      <CardHeader className="gap-3">
        <Skeleton className="h-7 w-2/3" />
        <div className="flex justify-end">
          <Skeleton className="h-8 w-16 rounded-2xl" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-2 flex-1 rounded-full" />
          <Skeleton className="h-4 w-8 rounded-sm" />
        </div>
      </CardHeader>

      <div className="px-2">
        <Separator />
      </div>

      <CardContent className="space-y-3">
        <div className="space-y-2 py-0.5">
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-4/5" />
        </div>

        <Separator />

        <div className="grid grid-cols-5 gap-1.5">
          {Array.from({ length: 5 }).map((_, index) => (
            <Skeleton key={index} className="h-5 w-full rounded-4xl" />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
