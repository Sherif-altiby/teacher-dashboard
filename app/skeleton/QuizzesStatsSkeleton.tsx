const QuizzesStatsSkeleton = () => {
    return (
      <div className="bg-linear-to-br from-indigo-50 to-violet-50/50 rounded-xl p-8 border border-indigo-100/50 shadow-sm flex flex-col justify-between relative overflow-hidden animate-pulse">
        
        {/* Header Skeleton */}
        <div className="flex items-center justify-between mb-6 relative z-10">
          <div className="flex items-center gap-4">
            {/* Icon Box Skeleton */}
            <div className="h-12 w-12 bg-white rounded-2xl border border-indigo-50 shadow-sm" />
            
            <div className="space-y-2">
              {/* Label Skeleton */}
              <div className="h-2 w-16 bg-indigo-200/50 rounded-full" />
              {/* Title Skeleton */}
              <div className="h-4 w-24 bg-indigo-200/80 rounded-full" />
            </div>
          </div>
          
          {/* Link Button Skeleton */}
          <div className="h-10 w-10 bg-indigo-200/60 rounded-xl" />
        </div>
  
        {/* Stats Grid Skeleton */}
        <div className="grid grid-cols-2 gap-4 relative z-10">
          {/* Card 1 Skeleton */}
          <div className="bg-white/60 p-5 rounded-3xl border border-indigo-50 space-y-3">
            <div className="h-8 w-12 bg-indigo-200/70 rounded-lg" />
            <div className="h-2 w-16 bg-slate-200 rounded-full" />
          </div>
  
          {/* Card 2 Skeleton */}
          <div className="bg-indigo-100/30 p-5 rounded-3xl border border-indigo-100 space-y-3">
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 bg-indigo-300/50 rounded-full" />
              <div className="h-8 w-12 bg-indigo-300/50 rounded-lg" />
            </div>
            <div className="h-2 w-16 bg-indigo-200 rounded-full" />
          </div>
        </div>
      </div>
    );
  };
  
  export default QuizzesStatsSkeleton;