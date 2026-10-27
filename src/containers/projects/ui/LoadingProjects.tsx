import { MainCardSkeleton } from "@/components/cards/MainCardSkeleton";
const SKELETON_COUNT = 6;

export function LoadingProjects() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2">
          <SkeletonBar className="h-8 w-40" />
          <SkeletonBar className="h-4 w-56" />
        </div>
        <SkeletonBar className="h-10 w-36 rounded-md" />
      </div>
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: SKELETON_COUNT }).map((_, index) => (
          <MainCardSkeleton key={index} />
        ))}
      </div>
    </div>
  );
}


function SkeletonBar({ className }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-md bg-muted/80 ${className ?? ""}`}
      aria-hidden
    />
  );
}
