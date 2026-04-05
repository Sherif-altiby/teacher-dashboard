"use client";

import { API } from "@/app/constants";
import CourseStatsSkeleton from "@/app/skeleton/CourseStatsSkeleto";
import { useQuery } from "@tanstack/react-query";
import { BookOpen, PlayCircle, Loader2 } from "lucide-react";

const SubStats = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["sub-stats"],
    queryFn: async () => {
      const res = await fetch(`${API}/teacher/sub-stats`, {
        credentials: "include",
      });

      if (res.status === 401) {
        window.location.href = "/login";
      }

      if (!res.ok) throw new Error("Failed to fetch stats");

      const result = await res.json();
      return result.data;
    },
  });

  if (isLoading) {
    return <CourseStatsSkeleton />;
  }

  return (
    <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm flex flex-col justify-between group hover:border-blue-200 transition-all">
      <div className="flex items-center gap-4 mb-6">
        <div className="h-12 w-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
          <BookOpen size={24} />
        </div>
        <div>
          <h4 className="text-slate-400 text-xs font-black uppercase tracking-wider">
            المحتوى التعليمي
          </h4>
          <p className="text-slate-900 font-black">المكتبة الخاصة بك</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* الكورسات */}
        <div className="bg-slate-50 p-4 rounded-3xl">
          <p className="text-2xl font-black text-slate-900">
            {data?.totalCourses || 0}
          </p>
          <p className="text-xs font-bold text-slate-500">كورسات منشورة</p>
        </div>

        {/* الدروس */}
        <div className="bg-blue-50 p-4 rounded-3xl">
          <div className="flex items-center gap-2">
            <PlayCircle size={14} className="text-blue-600" />
            <p className="text-2xl font-black text-blue-600">
              {data?.totalLessons || 0}
            </p>
          </div>
          <p className="text-xs font-bold text-blue-400 text-nowrap">
            درس فيديو
          </p>
        </div>
      </div>
    </div>
  );
};

export default SubStats;
