const CourseStatsSkeleton = () => {
  return (
    <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm flex flex-col justify-between animate-pulse">
      
      {/* الجزء العلوي: الأيقونة والعنوان */}
      <div className="flex items-center gap-4 mb-6">
        {/* سكيلتون الأيقونة */}
        <div className="h-12 w-12 bg-slate-100 rounded-2xl" />
        
        <div className="space-y-2">
          {/* سكيلتون التصنيف */}
          <div className="h-3 w-20 bg-slate-100 rounded-full" />
          {/* سكيلتون العنوان الرئيسي */}
          <div className="h-4 w-32 bg-slate-200 rounded-full" />
        </div>
      </div>

      {/* الجزء السفلي: المربعات الإحصائية */}
      <div className="grid grid-cols-2 gap-4">
        
        {/* سكيلتون الكورسات */}
        <div className="bg-slate-50 p-4 rounded-3xl space-y-3">
          <div className="h-8 w-12 bg-slate-200 rounded-xl" />
          <div className="h-3 w-20 bg-slate-100 rounded-full" />
        </div>

        {/* سكيلتون الدروس */}
        <div className="bg-blue-50/50 p-4 rounded-3xl space-y-3">
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 bg-blue-100 rounded-full" />
            <div className="h-8 w-12 bg-blue-100 rounded-xl" />
          </div>
          <div className="h-3 w-16 bg-blue-100/50 rounded-full" />
        </div>

      </div>
    </div>
  );
};

export default CourseStatsSkeleton