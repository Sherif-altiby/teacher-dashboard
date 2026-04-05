const SubjectCardSkeleton = () => {
  return (
    <div className="relative h-70 w-full rounded-3xl overflow-hidden bg-slate-200 animate-pulse border border-slate-100">
      {/* 1. Content Container (Positioned at bottom to match your card) */}
      <div className="absolute bottom-0 inset-x-0 p-8 z-10 space-y-4">
        
        {/* 2. The Horizontal Line Skeleton */}
        <div className="h-1 w-12 bg-slate-300 rounded-full ml-auto" />

        {/* 3. The Title Skeleton (Two lines for a "Real" feel) */}
        <div className="space-y-2">
          <div className="h-6 w-3/4 bg-slate-300 rounded-lg ml-auto" />
          <div className="h-6 w-1/2 bg-slate-300 rounded-lg ml-auto" />
        </div>

        {/* 4. The Action Button Skeleton */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <div className="h-4 w-16 bg-slate-300 rounded-md" />
          <div className="w-10 h-10 bg-slate-300 rounded-xl" />
        </div>
      </div>

      {/* 5. Subtle Shimmer Overlay */}
      <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
    </div>
  );
};

export default SubjectCardSkeleton;