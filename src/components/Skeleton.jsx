import React from 'react';

/**
 * Animated skeleton placeholder that mimics content.
 */
export function Skeleton({ className, ...props }) {
  return (
    <div
      className={`animate-pulse rounded-md bg-slate-200 dark:bg-slate-800 ${className}`}
      {...props}
    />
  );
}

/**
 * A skeleton loader for social feed cards.
 */
export function PostCardSkeleton() {
  return (
    <div className="glass-card rounded-2xl p-5 md:p-6 space-y-4">
      <div className="flex items-center space-x-3">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-20" />
        </div>
      </div>
      <div className="space-y-2">
        <Skeleton className="h-5 w-4/5" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>
      <Skeleton className="h-48 w-full rounded-xl" />
      <div className="flex justify-between items-center pt-2">
        <Skeleton className="h-8 w-16 rounded-lg" />
        <Skeleton className="h-8 w-16 rounded-lg" />
        <Skeleton className="h-8 w-16 rounded-lg" />
      </div>
    </div>
  );
}

/**
 * A skeleton loader for user cards.
 */
export function UserCardSkeleton() {
  return (
    <div className="glass-card rounded-2xl p-5 md:p-6 flex flex-col items-center text-center space-y-4">
      <Skeleton className="h-20 w-20 rounded-full" />
      <div className="space-y-2 flex flex-col items-center w-full">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-4 w-24" />
      </div>
      <div className="w-full space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
        <Skeleton className="h-3 w-4/5 mx-auto" />
        <Skeleton className="h-3 w-2/3 mx-auto" />
        <Skeleton className="h-3 w-3/5 mx-auto" />
      </div>
      <Skeleton className="h-9 w-full rounded-xl mt-2" />
    </div>
  );
}
