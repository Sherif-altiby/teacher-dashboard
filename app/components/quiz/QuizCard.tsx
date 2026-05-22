"use client";

import { ChevronLeft, HelpCircle, MoreVertical, Users, Trash2, Loader2, Edit } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useState } from "react";
import { API } from "@/app/constants";
import Link from "next/link";

const QuizCard = ({ quiz }: { quiz: any }) => {
  const queryClient = useQueryClient();
  const [showOptions, setShowOptions] = useState(false);

  // منطق الحذف باستخدام React Query
  const { mutate: deleteQuiz, isPending } = useMutation({
    mutationFn: async (quizId: string) => {
      const response = await fetch(`${API}/teacher/quiz-delete/${quizId}`, {
        method: "DELETE",
        credentials: "include"
      });
      const data = await response.json();
      if (!data.status) throw new Error(data.message);
      return data;
    },
    onSuccess: () => {
      toast.success("تم حذف الاختبار بنجاح");
      setShowOptions(false)
      queryClient.invalidateQueries({ queryKey: ["teacherQuizzes"] });
    },
    onError: (error: any) => {
      toast.error(error.message || "حدث خطأ أثناء الحذف");
    },
  });


  return (
    <div className="bg-white rounded-xl p-6 border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all group relative">
      <div className="flex justify-between items-start mb-6">
        <div className="px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-tighter bg-emerald-50 text-emerald-600 border border-emerald-100">
          نشط
        </div>

        <div className="relative z-20">
          <button
            onClick={() => setShowOptions(!showOptions)}
            className="p-2 hover:bg-slate-50 rounded-xl transition-colors relative z-20"
          >
            <MoreVertical size={18} className="text-slate-400" />
          </button>

          {/* قائمة الخيارات الصغيرة */}
          {showOptions && (
            <div className="absolute left-0 mt-2 w-40 bg-white border border-slate-100 rounded-2xl shadow-premium z-20 py-1.5 overflow-hidden animate-dropdown">
              {/* تعديل الاختبار */}
              <Link
                href={`/quizzes/edit/${quiz._id}`}
                className="flex items-center gap-2.5 px-4 py-3 text-slate-600 hover:bg-slate-50 hover:text-[#5700FF] text-xs font-bold transition-all cursor-pointer border-b border-slate-50/60"
                onClick={() => setShowOptions(false)}
              >
                <Edit size={14} className="text-slate-400" />
                <span>تعديل الاختبار</span>
              </Link>

              {/* حذف الاختبار */}
              <button
                onClick={() => deleteQuiz(quiz._id)}
                disabled={isPending}
                className="w-full flex items-center gap-2.5 px-4 py-3 text-red-500 hover:bg-red-50 hover:text-red-600 text-xs font-bold transition-all cursor-pointer disabled:opacity-50 disabled:pointer-events-none text-right"
              >
                {isPending ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <Trash2 size={14} className="text-red-400" />
                )}
                <span>حذف الاختبار</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Click outside overlay to close menu */}
      {showOptions && (
        <div className="fixed inset-0 z-10 cursor-default" onClick={() => setShowOptions(false)} />
      )}

      <h3 className="text-xl font-black text-slate-900 mb-2 group-hover:text-[#5700FF] transition-colors line-clamp-1">
        {quiz.title}
      </h3>

      <div className="flex flex-wrap gap-2 mb-6">
        <span className="text-slate-400 text-xs font-bold bg-slate-50 px-2 py-1 rounded-lg">
          {quiz.course?.title}
        </span>
        <span className="text-slate-400 text-xs font-bold bg-slate-50 px-2 py-1 rounded-lg">
          {quiz.level}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="flex items-center gap-2 bg-slate-50 p-3 rounded-2xl">
          <HelpCircle size={16} className="text-blue-500" />
          <span className="text-xs font-black text-slate-700">
            {quiz.questions?.length || 0} أسئلة
          </span>
        </div>
        <div className="flex items-center gap-2 bg-slate-50 p-3 rounded-2xl">
          <Users size={16} className="text-purple-500" />
          <span className="text-xs font-black text-slate-700">0 طالب</span>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-slate-50">
        <Link href={`/quizzes/${quiz._id}`} className="text-[#5700FF] font-black text-sm flex items-center gap-1 hover:gap-2 transition-all">
          التفاصيل <ChevronLeft size={16} />
        </Link>
      </div>
    </div>
  );
};

export default QuizCard;