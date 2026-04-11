"use client";

import { useParams, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Plus, BookOpen, Loader2, Video } from "lucide-react";
import { useState } from "react";
import { getCourseLessons } from "@/app/services/coursesService";
import LessonCard from "@/app/components/course/LessonCard";
import AddLessonModal from "@/app/components/course/AddLessonModel";

export default function LessonsPage() {
  const { courseId } = useParams();
  const param = useSearchParams()
  const subjectId = param.get("subject")
  const [showAddModal, setShowAddModal] = useState(false);

  // Fetch Lessons
  const { data: lessons, isLoading } = useQuery({
    queryKey: ["lessons", courseId],
    queryFn: () => getCourseLessons(courseId as string),
    enabled: !!courseId,
  });


 

  if (isLoading) return (
    <div className="h-screen flex items-center justify-center">
      <Loader2 className="animate-spin text-blue-600" size={40} />
    </div>
  );

  return (
    <div className="min-h-screen  p-2 md:p-10" dir="rtl">

      {showAddModal && <AddLessonModal setShowAddModal={setShowAddModal} courseId={courseId as string} subjectId={subjectId || ""}/>}

      <div className="max-w-6xl mx-auto">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-4">
          <div className="text-center md:text-right">
            <h1 className="text-lg xl:text-3xl font-black text-slate-900">الدروس المضافة</h1>
            <p className="text-slate-500 mt-2 text-sm xl:text-lg">إدارة محتوى الكورس وتعديل تفاصيل الدروس</p>
          </div>
          <button 
            onClick={() => setShowAddModal(true)}
            className="bg-[#0066FF] text-white px-8 py-4 
                             rounded-xl font-bold flex gap-2 items-center shadow-lg 
                            shadow-blue-200 hover:bg-blue-700 transition-all active:scale-95 text-sm"
          >
            <Plus size={20} /> إضافة درس جديد
          </button>
        </div>

        {/* Lessons Grid */}
        {lessons && lessons.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {lessons.map((lesson: any) => (
             <LessonCard lesson={lesson} key={lesson._id} />
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="bg-white rounded-[3rem] p-24 text-center border-2 border-dashed border-slate-200">
            <BookOpen size={64} className="mx-auto text-slate-200 mb-6" />
            <h2 className="text-2xl font-bold text-slate-400">لا توجد دروس حالياً</h2>
            <p className="text-slate-400 mt-2">قم بالضغط على "إضافة درس جديد" للبدء</p>
          </div>
        )}
      </div>
    </div>
  );
}