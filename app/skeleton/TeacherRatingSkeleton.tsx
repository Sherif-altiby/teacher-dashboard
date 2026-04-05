const TeacherRatingSkeleton = () => {
  return (
    <div className="bg-amber-50/40 rounded-[2.5rem] p-8 border border-amber-100/50 shadow-sm flex flex-col justify-between animate-pulse">
      <div className="flex justify-between items-start">
        <div className="h-12 w-12 bg-white/80 rounded-2xl border border-amber-100" />

        <div className="flex gap-1" dir="ltr">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-3.5 w-3.5 bg-amber-200/50 rounded-full" />
          ))}
        </div>
      </div>

      <div className="mt-6">
        <div className="flex items-baseline gap-2">
          <div className="h-12 w-20 bg-slate-200 rounded-xl" />

          <div className="h-6 w-10 bg-amber-200/30 rounded-lg" />
        </div>

        <div className="mt-3 space-y-2">
          <div className="h-3 w-48 bg-amber-200/40 rounded-full" />
        </div>
      </div>
    </div>
  );
};

export default TeacherRatingSkeleton;
