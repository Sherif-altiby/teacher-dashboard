"use client";

import { fetchTeacherNotes } from "@/app/services/noteServices";
import TeacherNotesSkeleton from "@/app/skeleton/TeacherNotesSkeleton";
import { useQuery } from "@tanstack/react-query";
import { FileText, Plus, Download } from "lucide-react";
import Link from "next/link";

const TeacherNotesStats = () => {
   
    const { data: allNotes = [], isLoading } = useQuery({
        queryKey: ['teacherNotes'],
        queryFn: fetchTeacherNotes,
      });

     if(isLoading) {
        return <TeacherNotesSkeleton />
     }

    return (

        <div className="bg-linear-to-br from-emerald-50 to-teal-50/50 rounded-xl p-8 border border-emerald-100/50 shadow-sm flex flex-col justify-between group hover:border-emerald-200 hover:shadow-lg transition-all duration-300 relative overflow-hidden">

            <div className="flex items-center justify-between mb-6 relative z-10">
                <div className="flex items-center gap-4">
                    <div className="h-12 w-12 bg-white rounded-2xl flex items-center justify-center text-emerald-600 group-hover:scale-110 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300 shadow-sm border border-emerald-50">
                        <FileText size={24} />
                    </div>
                    <div>
                        <h4 className="text-emerald-950/50 text-[10px] font-black uppercase tracking-widest">
                            المرفقات التعليمية
                        </h4>
                        <p className="text-emerald-950 font-black text-lg leading-tight">المذكرات والملخصات</p>
                    </div>
                </div>

                <Link
                    href="/notes"
                    className="h-10 w-10 bg-emerald-700 text-white rounded-xl flex items-center justify-center shadow-lg shadow-emerald-200 hover:bg-emerald-800 hover:-translate-y-1 transition-all active:scale-95"
                >
                    <Plus size={20} />
                </Link>
            </div>


            <div className="grid grid-cols-2 gap-4 relative z-10">

                <div className="bg-white p-5 rounded-3xl border border-emerald-50 group-hover:border-emerald-100 transition-all duration-300">
                    <p className="text-3xl font-black text-emerald-950 leading-none mb-2">
                        {allNotes.length}
                    </p>
                    <p className="text-[10px] font-bold text-emerald-950/60 uppercase tracking-tighter">
                        ملف PDF منشور
                    </p>
                </div>


                
            </div>


        </div>
    );
};

export default TeacherNotesStats;