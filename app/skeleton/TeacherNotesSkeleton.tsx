"use client";

const TeacherNotesSkeleton = () => {
  return (
    <div className="bg-linear-to-br from-emerald-50 to-teal-50/50 rounded-xl p-8 border border-emerald-100/50 shadow-sm flex flex-col justify-between relative overflow-hidden animate-pulse">
      
      {/* Header Skeleton */}
      <div className="flex items-center justify-between mb-6 relative z-10">
        <div className="flex items-center gap-4">
          {/* Icon Box Skeleton */}
          <div className="h-12 w-12 bg-white rounded-2xl border border-emerald-50 shadow-sm" />
          
          <div className="space-y-2">
            {/* Small Label Skeleton */}
            <div className="h-2 w-20 bg-emerald-200/50 rounded-full" />
            {/* Title Skeleton */}
            <div className="h-4 w-32 bg-emerald-200/80 rounded-full" />
          </div>
        </div>
        
        {/* Action Button Skeleton */}
        <div className="h-10 w-10 bg-emerald-200/60 rounded-xl" />
      </div>

      {/* Grid Skeleton */}
      <div className="grid grid-cols-2 gap-4 relative z-10">
        {/* Total Files Box Skeleton */}
        <div className="bg-white/80 p-5 rounded-3xl border border-emerald-50 space-y-3">
          <div className="h-8 w-12 bg-emerald-200/60 rounded-lg" />
          <div className="h-2 w-20 bg-slate-200 rounded-full" />
        </div>

        {/* Total Downloads Box Skeleton */}
        <div className="bg-emerald-100/40 p-5 rounded-3xl border border-emerald-100 space-y-3">
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 bg-emerald-300/40 rounded-full" />
            <div className="h-8 w-16 bg-emerald-300/40 rounded-lg" />
          </div>
          <div className="h-2 w-24 bg-emerald-200 rounded-full" />
        </div>
      </div>

      
    </div>
  );
};

export default TeacherNotesSkeleton;