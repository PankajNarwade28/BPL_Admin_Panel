import React from 'react';

// Skeleton loader for stats cards
export const StatsCardSkeleton = () => {
  return (
    <div className="bg-white rounded-2xl p-5 lg:p-6 flex items-start gap-4 border-2 border-gray-200 animate-pulse">
      {/* Icon skeleton */}
      <div className="w-14 h-14 rounded-2xl bg-gray-200 flex-shrink-0"></div>
      
      {/* Content skeleton */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="h-10 bg-gray-200 rounded w-20"></div>
          <div className="h-6 bg-gray-200 rounded w-12"></div>
        </div>
        <div className="h-4 bg-gray-200 rounded w-24"></div>
      </div>
    </div>
  );
};

// Skeleton loader for team purse cards
export const TeamPurseCardSkeleton = () => {
  return (
    <div className="bg-white rounded-xl p-3 border-2 border-gray-200 animate-pulse">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          {/* Logo skeleton */}
          <div className="w-8 h-8 rounded-full bg-gray-200 flex-shrink-0"></div>
          
          {/* Team info skeleton */}
          <div className="min-w-0 flex-1">
            <div className="h-3 bg-gray-200 rounded w-20 mb-1"></div>
            <div className="h-3 bg-gray-200 rounded w-16"></div>
          </div>
        </div>
        
        {/* Purse amount skeleton */}
        <div className="flex-shrink-0">
          <div className="h-5 bg-gray-200 rounded w-12 mb-1"></div>
          <div className="h-3 bg-gray-200 rounded w-10"></div>
        </div>
      </div>
    </div>
  );
};

// Skeleton loader for stats bar
export const StatsBarSkeleton = () => {
  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 lg:p-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        <StatsCardSkeleton />
        <StatsCardSkeleton />
        <StatsCardSkeleton />
        <StatsCardSkeleton />
      </div>
    </div>
  );
};

// Skeleton loader for team purse bar
export const TeamPurseBarSkeleton = () => {
  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 px-6 lg:px-8 py-4 border-t border-gray-200">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-xl bg-gray-200 animate-pulse"></div>
        <div>
          <div className="h-4 bg-gray-200 rounded w-24 mb-1 animate-pulse"></div>
          <div className="h-3 bg-gray-200 rounded w-32 animate-pulse"></div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-3">
        <TeamPurseCardSkeleton />
        <TeamPurseCardSkeleton />
        <TeamPurseCardSkeleton />
        <TeamPurseCardSkeleton />
        <TeamPurseCardSkeleton />
        <TeamPurseCardSkeleton />
      </div>
    </div>
  );
};

const SkeletonLoaders = {
  StatsCardSkeleton,
  TeamPurseCardSkeleton,
  StatsBarSkeleton,
  TeamPurseBarSkeleton
};

export default SkeletonLoaders;
