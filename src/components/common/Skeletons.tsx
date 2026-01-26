import React from 'react';
import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className }) => (
  <div className={cn("animate-pulse bg-muted rounded-lg", className)} />
);

export const CardSkeleton: React.FC = () => (
  <div className="bg-card rounded-2xl border border-border p-6 space-y-4">
    <Skeleton className="h-12 w-12 rounded-xl" />
    <Skeleton className="h-6 w-3/4" />
    <Skeleton className="h-4 w-full" />
    <Skeleton className="h-4 w-2/3" />
    <Skeleton className="h-10 w-full rounded-lg" />
  </div>
);

export const PricingCardSkeleton: React.FC = () => (
  <div className="bg-card rounded-2xl border border-border p-8 space-y-6">
    <div className="space-y-2">
      <Skeleton className="h-6 w-1/2" />
      <Skeleton className="h-4 w-3/4" />
    </div>
    <div className="flex items-baseline gap-2">
      <Skeleton className="h-12 w-24" />
      <Skeleton className="h-4 w-12" />
    </div>
    <div className="space-y-3">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex items-center gap-3">
          <Skeleton className="h-5 w-5 rounded-full" />
          <Skeleton className="h-4 flex-1" />
        </div>
      ))}
    </div>
    <Skeleton className="h-12 w-full rounded-lg" />
  </div>
);

export const TableRowSkeleton: React.FC = () => (
  <div className="flex items-center gap-4 p-4 border-b border-border">
    <Skeleton className="h-10 w-10 rounded-lg" />
    <div className="flex-1 space-y-2">
      <Skeleton className="h-4 w-1/3" />
      <Skeleton className="h-3 w-1/2" />
    </div>
    <Skeleton className="h-8 w-20 rounded-lg" />
  </div>
);

export const HeroSkeleton: React.FC = () => (
  <div className="py-20 space-y-8">
    <div className="flex justify-center">
      <Skeleton className="h-8 w-48 rounded-full" />
    </div>
    <Skeleton className="h-16 w-3/4 mx-auto" />
    <Skeleton className="h-6 w-1/2 mx-auto" />
    <div className="flex justify-center gap-4">
      <Skeleton className="h-12 w-36 rounded-lg" />
      <Skeleton className="h-12 w-36 rounded-lg" />
    </div>
  </div>
);

export const ArticleSkeleton: React.FC = () => (
  <div className="bg-card rounded-2xl border border-border overflow-hidden">
    <Skeleton className="h-48 w-full rounded-none" />
    <div className="p-6 space-y-4">
      <div className="flex gap-2">
        <Skeleton className="h-6 w-16 rounded-full" />
        <Skeleton className="h-6 w-20 rounded-full" />
      </div>
      <Skeleton className="h-6 w-full" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-3/4" />
      <div className="flex items-center gap-3 pt-4">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="space-y-1">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-3 w-16" />
        </div>
      </div>
    </div>
  </div>
);

export const TestimonialSkeleton: React.FC = () => (
  <div className="bg-card rounded-2xl border border-border p-6 space-y-4">
    <div className="flex gap-1">
      {[...Array(5)].map((_, i) => (
        <Skeleton key={i} className="h-5 w-5" />
      ))}
    </div>
    <Skeleton className="h-4 w-full" />
    <Skeleton className="h-4 w-full" />
    <Skeleton className="h-4 w-2/3" />
    <div className="flex items-center gap-3 pt-2">
      <Skeleton className="h-12 w-12 rounded-full" />
      <div className="space-y-1">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-3 w-20" />
      </div>
    </div>
  </div>
);

export const FAQSkeleton: React.FC = () => (
  <div className="space-y-4">
    {[...Array(5)].map((_, i) => (
      <div key={i} className="bg-card rounded-xl border border-border p-5">
        <div className="flex items-center justify-between">
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-5 w-5 rounded" />
        </div>
      </div>
    ))}
  </div>
);

export const GridSkeleton: React.FC<{ count?: number }> = ({ count = 6 }) => (
  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
    {[...Array(count)].map((_, i) => (
      <CardSkeleton key={i} />
    ))}
  </div>
);
