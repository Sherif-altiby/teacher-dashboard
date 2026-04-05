const TeacherStudentsStatsSkeleton = () => {
  return (
    <div className="relative overflow-hidden bg-slate-900 rounded-[2.5rem] p-8 animate-pulse shadow-2xl border border-slate-800">
      <div className="relative z-10 flex flex-col h-full justify-between">
        
        {/* الجزء العلوي: الأيقونة والتاغ */}
        <div className="flex justify-between items-start">
          {/* سكيلتون الأيقونة */}
          <div className="h-12 w-12 bg-slate-800 rounded-2xl border border-slate-700/50" />
          
          {/* سكيلتون التاغ (إجمالي الوصول) */}
          <div className="h-6 w-20 bg-blue-500/10 rounded-full border border-blue-500/10" />
        </div>

        {/* الجزء السفلي: الأرقام والنصوص */}
        <div className="mt-8">
          {/* سكيلتون الرقم الكبير (العدد) */}
          <div className="h-12 w-32 bg-slate-800 rounded-xl mb-4" />
          
          {/* سكيلتون النص الوصفي */}
          <div className="flex items-center gap-2">
            <div className="h-4 w-40 bg-slate-800 rounded-full" />
            {/* سكيلتون السهم الصغير */}
            <div className="h-4 w-4 bg-emerald-500/20 rounded-md" />
          </div>
        </div>

      </div>

      {/* المحاكاة للتوهج الخلفي (اختياري لزيادة الواقعية) */}
      <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-900/10 rounded-full blur-[80px]" />
    </div>
  );
};

export default TeacherStudentsStatsSkeleton;