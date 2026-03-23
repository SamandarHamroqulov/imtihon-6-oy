import { Skeleton } from "@/components/ui/skeleton";

export function BookSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="aspect-[3/4.5] w-full rounded-[2rem]" />
      <div className="space-y-2 px-2">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <div className="flex justify-between items-center pt-2">
          <Skeleton className="h-6 w-20 rounded-lg" />
          <Skeleton className="h-4 w-12" />
        </div>
      </div>
    </div>
  );
}

export function PoetSkeleton() {
  return (
    <div className="flex items-center gap-5 p-4 rounded-3xl bg-secondary/10 border border-glass-border">
      <Skeleton className="h-16 w-16 md:h-20 md:w-20 rounded-2xl" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-6 w-3/4" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-4 rounded-full" />
          <Skeleton className="h-4 w-24" />
        </div>
      </div>
    </div>
  );
}

export function CommentSkeleton() {
  return (
    <div className="flex gap-4 p-5 rounded-2xl bg-secondary/10 border border-glass-border">
      <Skeleton className="h-10 w-10 rounded-full shrink-0" />
      <div className="flex-1 space-y-3">
        <div className="flex items-center gap-3">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-3 w-20" />
        </div>
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>
    </div>
  );
}
