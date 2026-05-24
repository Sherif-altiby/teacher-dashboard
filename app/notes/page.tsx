"use client";

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Plus, Search, BookOpen, Layers, X,
  FileText
} from 'lucide-react';


import QuizCardSkeleton from '../skeleton/QuizCardSkeleton'; // يمكن استخدامه كقاعدة
import MainButton from '../components/common/MainButton';
import NoteCard from '../components/note/NoteCard';
import { Note } from '../types';
import CreateNote from '../components/note/CreateNote';
import { fetchTeacherNotes } from '../services/noteServices';
import CustomSelect from '../components/common/CustomSelect';

const NotesPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("all");
  const [selectedLevel, setSelectedLevel] = useState("all");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const { data: allNotes = [], isLoading, isError } = useQuery({
    queryKey: ['teacherNotes'],
    queryFn: fetchTeacherNotes,
  });


  const dynamicCourses = Array.from(new Set(allNotes.map((n: any) => n.course?.title))).filter(Boolean);
  const dynamicLevels = Array.from(new Set(allNotes.map((n: any) => n.level))).filter(Boolean);

  const filteredNotes = allNotes.filter((note: any) => {
    const matchesSearch = note.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCourse = selectedCourse === "all" || note.course?.title === selectedCourse;
    const matchesLevel = selectedLevel === "all" || note.level === selectedLevel;

    return matchesSearch && matchesCourse && matchesLevel;
  });

  if (isLoading) return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-8">
      {[...Array(6)].map((_, i) => (
        <QuizCardSkeleton key={i} />
      ))}
    </div>
  );

  return (
    <div className="min-h-screen p-4 lg:p-8 ml-0 xl:ml-4 font-arabic" dir="rtl">

      {/* الرأس - Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">إدارة المذكرات</h1>
            <p className="text-sm text-slate-500 font-bold mt-1">لديك {allNotes.length} مذكرات مرفوعة للطلاب.</p>
        </div>

        {/* استخدمنا نفس الـ MainButton مع تغيير اللون في الـ CSS الخاص به أو تمرير prop */}
        <MainButton
          icon={Plus}
          text="رفع مذكرة جديدة"
          setStateFn={setIsCreateModalOpen}
        />
      </div>

      <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

          {/* البحث */}
          <div className="relative">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="ابحث بالعنوان..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pr-11 pl-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-emerald-500/20 font-bold text-sm outline-none transition-all"
            />
          </div>

          {/* فلتر الكورس */}
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

          {/* فلتر المستوى */}
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

          {/* مسح الفلاتر */}
          <button
            onClick={() => { setSearchTerm(""); setSelectedCourse("all"); setSelectedLevel("all"); }}
            className="group w-full flex items-center justify-center gap-2 py-2 px-4 bg-slate-50/50 hover:bg-red-50/80 text-slate-500 hover:text-red-600 border border-slate-100/80 hover:border-red-100 rounded-xl font-bold text-xs cursor-pointer transition-all duration-250 active:scale-[0.98] shadow-xs"
          >
            <X size={16} className="transition-transform duration-250 group-hover:rotate-90 group-hover:scale-110" />
            <span>مسح الفلاتر</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-right">
        {filteredNotes.length > 0 ? (
          filteredNotes.map((note: Note) => (
            <NoteCard note={note} key={note._id} />
          ))
        ) : (
          <div className="col-span-full py-20 flex flex-col items-center justify-center bg-white rounded-[3rem] border border-dashed border-slate-200">
            <div className="h-20 w-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
              <FileText size={40} className="text-slate-200" />
            </div>
            <p className="text-lg text-slate-400 font-black">لا توجد مذكرات تطابق بحثك</p>
            <button
              onClick={() => { setSearchTerm(""); setSelectedCourse("all"); setSelectedLevel("all"); }}
                className="mt-4 text-emerald-600 font-bold text-xs underline cursor-pointer"
            >
              عرض كل المذكرات
            </button>
          </div>
        )}
      </div>

      {/* مودال إنشاء مذكرة */}
      {isCreateModalOpen && <CreateNote isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} />}
    </div>
  );
};

export default NotesPage;