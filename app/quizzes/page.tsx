"use client"

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Plus, Search, BookOpen, Layers, ChevronDown, X,
} from 'lucide-react';
import { API } from '../constants';
import CreateQuiz from '../components/quiz/CreateQuiz';
import QuizCard from '../components/quiz/QuizCard';
import QuizCardSkeleton from '../skeleton/QuizCardSkeleton';
import MainButton from '../components/common/MainButton';
import { useRouter } from 'next/navigation';

const fetchTeacherQuizzes = async () => {
  const res = await fetch(`${API}/teacher/quizzes`, {
    credentials: "include"
  });

  if (!res.ok) throw new Error('Failed to fetch data');

  const result = await res.json();
  return result.data;
};

const QuizzesPage = () => {
  const router = useRouter();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("all");
  const [selectedLevel, setSelectedLevel] = useState("all");

  const { data: allQuizzes = [], isLoading, isError, refetch } = useQuery({
    queryKey: ['teacherQuizzes'],
    queryFn: fetchTeacherQuizzes,
  });


  const dynamicCourses = Array.from(new Set(allQuizzes.map((q: any) => q.course?.title))).filter(Boolean);
  const dynamicLevels = Array.from(new Set(allQuizzes.map((q: any) => q.level))).filter(Boolean);

  const filteredQuizzes = allQuizzes.filter((quiz: any) => {
    const matchesSearch = quiz.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCourse = selectedCourse === "all" || quiz.course?.title === selectedCourse;
    const matchesLevel = selectedLevel === "all" || quiz.level === selectedLevel;

    return matchesSearch && matchesCourse && matchesLevel;
  });

  if (isLoading) return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, i) => (
        <QuizCardSkeleton key={i} />
      ))}
    </div>
  );



  return (
    <div className="min-h-screen     p-4 lg:p-8 ml-0 xl:ml-4" dir="rtl">

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">إدارة الاختبارات</h1>
          <p className="text-slate-500 font-bold mt-1">لديك {allQuizzes.length} اختبارات مسجلة في المنصة.</p>
        </div>

        <div onClick={() => {router.push('quizzes/create')}} ><MainButton icon={Plus} text="إنشاء اختبار جديد"    /></div>
      </div>

      <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text" placeholder="ابحث بالعنوان..." value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pr-11 pl-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-[#5700FF]/20 font-bold text-sm outline-none"
            />
          </div>

          <div className="relative">
            <BookOpen className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <select
              value={selectedCourse} onChange={(e) => setSelectedCourse(e.target.value)}
              className="w-full pr-11 pl-4 py-3 bg-slate-50 border-none rounded-xl appearance-none outline-none cursor-pointer text-sm font-black"
            >
              <option value="all">كل الكورسات</option>
              {dynamicCourses.map((c: any) => <option key={c} value={c}>{c}</option>)}
            </select>
            <ChevronDown className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
          </div>

          <div className="relative">
            <Layers className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <select
              value={selectedLevel} onChange={(e) => setSelectedLevel(e.target.value)}
              className="w-full pr-11 pl-4 py-3 bg-slate-50 border-none rounded-xl appearance-none outline-none cursor-pointer text-sm font-black"
            >
              <option value="all">كل المستويات</option>
              {dynamicLevels.map((l: any) => <option key={l} value={l}>{l}</option>)}
            </select>
            <ChevronDown className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
          </div>

          <button
            onClick={() => { setSearchTerm(""); setSelectedCourse("all"); setSelectedLevel("all"); }}
            className="flex items-center justify-center gap-2 text-slate-400 hover:text-red-500 font-black transition-all"
          >
            <X size={18} /> مسح الفلاتر
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-right">
        {filteredQuizzes.length > 0 ? (
          <>
            {filteredQuizzes.map((quiz: any) => (
              <QuizCard quiz={quiz} key={quiz._id} />
            ))}


          </>
        ) : (
          <div className="col-span-full py-20 flex flex-col items-center justify-center bg-white rounded-[3rem] border border-dashed border-slate-200">
            <Search size={48} className="text-slate-200 mb-4" />
            <p className="text-slate-400 font-black text-xl">لا توجد اختبارات تطابق بحثك</p>
            <button onClick={() => { setSearchTerm(""); setSelectedCourse("all"); setSelectedLevel("all"); }} className="mt-4 text-[#5700FF] font-bold underline cursor-pointer">عرض كل الاختبارات</button>
          </div>
        )}
      </div>

    </div>
  );
};

export default QuizzesPage;