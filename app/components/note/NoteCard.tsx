"use client";

import {
  FileText,
  Calendar,
  ExternalLink,
  Trash2,
  Edit3
} from 'lucide-react';
import { Note } from '@/app/types';
import Link from 'next/link';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { API } from '@/app/constants';
import { toast } from 'sonner';


const NoteCard = ({ note }: { note: Note }) => {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`${API}/teacher/delete-pdf`, {
        method: "DELETE",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ pdfId: id }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to delete");
      }

      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teacherNotes"] });
      toast.success("تم حذف المذكرة بنجاح");
    },
    onError: (error: any) => {
      toast.error(error.message || "حدث خطأ أثناء الحذف");
      console.error("Error deleting PDF:", error);
    },
  });


  return (
    <div className="bg-white rounded-xl p-6 border border-slate-100 shadow-sm hover:shadow-xl hover:border-emerald-100 transition-all duration-300 group relative overflow-hidden flex flex-col h-full">

      <div className="relative z-10 flex flex-col h-full">

        <div className="flex justify-between items-start mb-5">
          <div className="h-14 w-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300 shadow-sm border border-emerald-100/50">
            <FileText size={28} />
          </div>

          <div className="flex gap-1">
            <button className="p-2.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all" title="حذف"
              onClick={() => { mutate(note._id) }}
            >
              {isPending ? "جاري الحذف ..." : <Trash2 size={18} />}
            </button>
          </div>
        </div>

        {/* محتوى النص */}
        <div className="mb-6">
          <h3 className="text-xl font-black text-slate-900 mb-2 group-hover:text-emerald-700 transition-colors line-clamp-1">
            {note.title}
          </h3>
          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1 bg-slate-100 text-slate-600 text-[10px] font-black rounded-lg uppercase tracking-wider">
              {note.course?.title || "عام"}
            </span>
            <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-black rounded-lg uppercase tracking-wider">
              {note.level}
            </span>
          </div>
        </div>


        {/* الجزء السفلي: التاريخ وزر الإجراء */}
        <div className="mt-auto pt-5 border-t border-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2 text-slate-400">
            <Calendar size={14} />
            <span className="text-xs font-bold">
              {new Date(note.createdAt).toLocaleDateString('ar-EG')}
            </span>
          </div>

          <Link href={note.pdf} target='_blank' className="flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-emerald-600 transition-all active:scale-95 shadow-lg shadow-slate-200">
            <span>عرض الملف</span>
            <ExternalLink size={16} />
          </Link>
        </div>

      </div>
    </div>
  );
};

export default NoteCard;