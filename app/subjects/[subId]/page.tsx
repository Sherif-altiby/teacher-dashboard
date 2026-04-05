"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Plus, Filter, BookOpen } from "lucide-react";
import CourseCard from "@/app/components/course/CoursCard";
import { subjectCourses } from "@/app/services/coursesService";
import SubjectCardSkeleton from "@/app/skeleton/SubjectSkeleton";
import AddCourseModal from "@/app/components/course/AddCourseModel";
import { useLevelStore } from "@/app/store/levelsStore";

export default function CoursesPage() {
  const { subId } = useParams();
  const [level, setLevel] = useState<string>("");
  const [showAddCourse, setShowAddCourse] = useState(false);

  const levels = useLevelStore((s) => s.levels);

  const { data, isLoading } = useQuery({
    queryKey: ["teacher-courses", subId, level],
    queryFn: () => subjectCourses(subId as string, level),
    enabled: !!subId,
  });

  return (
    <div className="p-4 md:p-8  min-h-screen" dir="rtl">
      {/* Add Course Modal */}
      {showAddCourse && <AddCourseModal showAddCourse={setShowAddCourse} subId={subId as string} />}

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div>
          <h1 className="text-2xl font-black text-slate-900">الدورات المتاحة</h1>
          <p className="text-slate-500 text-sm mt-1">تصفح وأدر كورسات المادة الحالية</p>
        </div>

        <button
          className="flex items-center justify-center gap-2 bg-[#0066FF] text-white px-8 py-3.5 rounded-lg hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 active:scale-95"
          onClick={() => setShowAddCourse(true)}
        >
          <Plus size={22} />
          <span className="text-sm font-bold">إضافة كورس جديد</span>
        </button>
      </div>

      {/* Filter Section */}
      <div className="flex items-center gap-2 flex-wrap mb-4 overflow-x-auto pb-4 no-scrollbar border-b border-[#eee]">
        <div className="bg-white border border-slate-200 p-2 rounded-lg flex items-center gap-2 px-4 text-slate-600 shadow-sm">
          <Filter size={16} className="text-[#0066FF]" />
          <span className="text-sm   whitespace-nowrap">تصفية:</span>
        </div>

        {/* Clear Filter Button */}
        <button
          onClick={() => setLevel("")}
          className={`px-6 py-2.5 rounded-lg text-sm   transition-all border ${
            level === ""
              ? "bg-[#0066FF] text-white border-[#0066FF] shadow-md"
              : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
          }`}
        >
          الكل
        </button>

        {/* Levels from Store */}
        { levels.map((lvl) => (
          <button
            key={lvl._id}
            onClick={() => setLevel(lvl.name)}
            className={`px-6 py-2.5 rounded-lg text-sm  transition-all border whitespace-nowrap ${
              level === lvl.name
                ? "bg-[#0066FF] text-white border-[#0066FF] shadow-md"
                : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            {lvl.name}
          </button>
        ))}
      </div>

      {/* Grid Display */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {[1, 2, 3].map((n) => (
            <SubjectCardSkeleton key={n} />
          ))}
        </div>
      ) : data?.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {data.map((course: any) => (
            <CourseCard key={course._id} course={course} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200">
          <BookOpen size={48} className="text-slate-300 mb-4" />
          <p className="text-slate-500 font-bold text-lg">لا توجد كورسات مضافة حالياً لهذا الفلتر</p>
        </div>
      )}
    </div>
  );
}