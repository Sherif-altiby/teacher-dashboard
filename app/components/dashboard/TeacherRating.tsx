"use client";

import { API } from '@/app/constants'
import TeacherRatingSkeleton from '@/app/skeleton/TeacherRatingSkeleton';
import { useQuery } from '@tanstack/react-query'
import { Star, Trophy, Loader2 } from 'lucide-react'

const TeacherRating = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['teacher-rates'],
    queryFn: async () => {
      const res = await fetch(`${API}/teacher/get-rates`, {
        credentials: "include"
      });

      // التعامل مع عدم تسجيل الدخول
      if (res.status === 401) {
        window.location.href = "/login";
        return;
      }

      if (!res.ok) throw new Error("Failed to fetch data");

      const json = await res.json();
      console.log(json)
      return json.stats; // الهيكل: { average: 4.8, total: 124 }
    }
  });

  // حالة التحميل (Skeleton Loader بسيط)
  if (isLoading) {
    return (
      <TeacherRatingSkeleton />
    );
  }

  // في حال وجود خطأ أو عدم وجود بيانات
  if (isError || !data) return null;

  return (
    <div className="bg-linear-to-br from-amber-50 to-orange-50 rounded-xl p-8 border border-amber-100/50 shadow-sm flex flex-col justify-between group transition-all hover:shadow-md">
      <div className="flex justify-between items-start">
        <div className="h-12 w-12 bg-white rounded-2xl flex items-center justify-center text-amber-500 shadow-sm border border-amber-100 group-hover:rotate-12 transition-transform">
          <Trophy size={24} />
        </div>
        <div className="text-left">
          <div className="flex gap-0.5" dir="ltr">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                size={14} 
                 fill={i < Math.floor(data.average) ? "#f59e0b" : "none"} 
                className={i < Math.floor(data.average) ? "text-amber-500" : "text-amber-200"} 
              />
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6">
        <div className="flex items-baseline gap-2">
          <h3 className="text-5xl font-black text-slate-900 leading-none">
            {data.average || 0}
          </h3>
          <span className="text-xl text-amber-600/50 font-black">/ 5</span>
        </div>
        
        <p className="text-amber-700/60 font-bold text-sm mt-2">
          بناءً على <span className="text-amber-600">{data.total || 0}</span> تقييم حقيقي من الطلاب
        </p>
      </div>
    </div>
  );
};

export default TeacherRating;