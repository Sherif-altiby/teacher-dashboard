"use client";

import { API } from "@/app/constants";
import QuizzesStatsSkeleton from "@/app/skeleton/QuizzesStatsSkeleton";
import { useQuery } from "@tanstack/react-query";
import { LayoutGrid, Users2, ArrowUpRight, ClipboardCheck } from "lucide-react";
import Link from "next/link";

const TeacherQuizzesStats = () => {
  

  const { data, isLoading } = useQuery({
    queryKey: ['teacher-quizzes-stats'],
    queryFn: async () => {
      const res = await fetch(`${API}/teacher/quizzes-summary`, {
        credentials: "include"
      });
      
      if (!res.ok) throw new Error("Failed to fetch");
      
      const json = await res.json();
      return json.stats;   
    }
  });

  if(isLoading ) {
    return <QuizzesStatsSkeleton />
  }

  return (
    <div className="bg-linear-to-br from-indigo-50 to-violet-50/50 rounded-xl p-8 border border-indigo-100/50 shadow-sm flex flex-col justify-between group hover:border-indigo-200 transition-all relative overflow-hidden">

      <div className="flex items-center justify-between mb-6 relative z-10">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 bg-white rounded-2xl flex items-center justify-center text-indigo-600 group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300 shadow-sm border border-indigo-50">
            <LayoutGrid size={24} />
          </div>
          <div>
            <h4 className="text-indigo-900/40 text-[10px] font-black uppercase tracking-widest">
              نظام التقييم
            </h4>
            <p className="text-indigo-950 font-black text-lg">الاختبارات الذكية</p>
          </div>
        </div>
        
        <Link 
          href="/quizzes" 
          className="h-10 w-10 bg-indigo-600 text-white rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200 hover:bg-indigo-700 hover:-translate-y-1 transition-all active:scale-95"
        >
          <ArrowUpRight size={18} />
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-4 relative z-10">
        <div className="bg-white p-5 rounded-3xl border border-indigo-50 group-hover:border-indigo-100 transition-all duration-300 shadow-xs">
          <p className="text-3xl font-black text-slate-900 leading-none mb-2">
            {data?.totalQuizzes}
          </p>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">
            اختبار مفعل
          </p>
        </div>

        <div className="bg-indigo-100/40 p-5 rounded-3xl border border-indigo-100 group-hover:border-indigo-200 group-hover:bg-indigo-100/60 transition-all duration-300">
          <div className="flex items-center gap-2 mb-2">
            <Users2 size={16} className="text-indigo-600" />
            <p className="text-3xl font-black text-indigo-700 leading-none">
              {data?.totalSubmissions}
            </p>
          </div>
          <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-tighter">
            مشاركة طالب
          </p>
        </div>
      </div>

      
    </div>
  );
};

export default TeacherQuizzesStats;