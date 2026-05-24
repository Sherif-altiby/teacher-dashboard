"use client"

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Plus, Search, BookOpen, Layers, X,
} from 'lucide-react';
import { API } from '../constants';
import QuizCard from '../components/quiz/QuizCard';
import QuizCardSkeleton from '../skeleton/QuizCardSkeleton';
import MainButton from '../components/common/MainButton';
import { useRouter } from 'next/navigation';
import CustomSelect from '../components/common/CustomSelect';

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
    <div className="min-h-screen p-2">

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-xl md:text-2xl font-semibold text-slate-900 tracking-tight">إدارة الاختبارات</h1>
          <p className="text-slate-500 font-bold mt-1">لديك {allQuizzes.length} اختبارات مسجلة في المنصة.</p>
        </div>

        <div onClick={() => { router.push('quizzes/create') }} ><MainButton icon={Plus} text="إنشاء اختبار جديد" /></div>
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

          <CustomSelect
            value={selectedCourse}
            onChange={setSelectedCourse}
            options={[
              { value: "all", label: "كل الكورسات" },
              ...dynamicCourses.map((c: any) => ({ value: c, label: c })),
            ]}
            icon={BookOpen}
            placeholder="كل الكورسات"
          />

          <CustomSelect
            value={selectedLevel}
            onChange={setSelectedLevel}
            options={[
              { value: "all", label: "كل المستويات" },
              ...dynamicLevels.map((l: any) => ({ value: l, label: l })),
            ]}
            icon={Layers}
            placeholder="كل المستويات"
          />

          <button
            onClick={() => { setSearchTerm(""); setSelectedCourse("all"); setSelectedLevel("all"); }}
            className="group w-full flex items-center justify-center gap-2 py-3 px-4 bg-slate-50/50 hover:bg-red-50/80 text-slate-500 hover:text-red-600 border border-slate-100/80 hover:border-red-100 rounded-xl font-bold text-sm cursor-pointer transition-all duration-250 active:scale-[0.98] shadow-xs"
          >
            <X size={16} className="transition-transform duration-250 group-hover:rotate-90 group-hover:scale-110" />
            <span>مسح الفلاتر</span>
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