const QuizCardSkeleton = () => {
  return (
    <div className="bg-white rounded-xl p-6 border border-slate-100 shadow-sm animate-pulse">
      {/* Header Skeleton */}
      <div className="flex justify-between items-start mb-6">
        <div className="w-16 h-6 bg-slate-200 rounded-full"></div>
        <div className="w-8 h-8 bg-slate-100 rounded-xl"></div>
      </div>

      {/* Title Skeleton */}
      <div className="h-7 bg-slate-200 rounded-lg w-3/4 mb-3"></div>

      {/* Tags Skeleton */}
      <div className="flex gap-2 mb-6">
        <div className="h-5 bg-slate-100 rounded-lg w-20"></div>
        <div className="h-5 bg-slate-100 rounded-lg w-16"></div>
      </div>

      {/* Stats Grid Skeleton */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="h-12 bg-slate-50 rounded-2xl w-full"></div>
        <div className="h-12 bg-slate-50 rounded-2xl w-full"></div>
      </div>

      {/* Footer Skeleton */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-50">
        <div className="h-5 bg-slate-100 rounded-md w-24"></div>
      </div>
    </div>
  );
};

export default QuizCardSkeleton;