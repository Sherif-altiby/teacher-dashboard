"use client";

import {
  ChevronLeft,
  HelpCircle,
  MoreVertical,
  Users,
  Trash2,
  Loader2,
  Edit,
} from "lucide-react";
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
        credentials: "include",
      });
      const data = await response.json();
      if (!data.status) throw new Error(data.message);
      return data;
    },
    onSuccess: () => {
      toast.success("تم حذف الاختبار بنجاح");
      setShowOptions(false);
      queryClient.invalidateQueries({ queryKey: ["teacherQuizzes"] });
    },
    onError: (error: any) => {
      toast.error(error.message || "حدث خطأ أثناء الحذف");
    },
  });

  return (
    <div className="bg-white rounded-xl p-6 border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all group relative">
      <div className="flex justify-between items-start mb-6">
        <div className="relative z-20">
          <button
            onClick={() => setShowOptions(!showOptions)}
            className="p-2 hover:bg-slate-50 rounded-xl transition-colors relative z-20"
          >
            <MoreVertical size={18} className="text-slate-400" />
          </button>

          {/* قائمة الخيارات الصغيرة */}
          {showOptions && (
            <div className="absolute top-full right-0 mt-3 w-48 bg-white rounded-2xl border border-slate-200 shadow-xl z-50 overflow-hidden">
              <Link
                href={`/quizzes/edit/${quiz._id}`}
                onClick={() => setShowOptions(false)}
                className="flex items-center justify-between px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-violet-50 hover:text-violet-700 transition-colors border-b border-slate-100"
              >
                <span>تعديل الاختبار</span>
                <Edit size={16} />
              </Link>

              <button
                onClick={() => deleteQuiz(quiz._id)}
                disabled={isPending}
                className="w-full flex items-center justify-between px-4 py-3 text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
              >
                <span>حذف الاختبار</span>

                {isPending ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Trash2 size={16} />
                )}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Click outside overlay to close menu */}
      {showOptions && (
        <div
          className="fixed inset-0 z-10 cursor-default"
          onClick={() => setShowOptions(false)}
        />
      )}

      <h3 className="text-base font-black text-slate-900 mb-2 group-hover:text-[#5700FF] transition-colors line-clamp-1">
        {quiz.title}
      </h3>

      <div className="flex flex-wrap gap-2 mb-6">
        <span className="text-slate-400 text-[11px] font-bold bg-slate-50 px-2 py-1 rounded-lg">
          {quiz.course?.title}
        </span>
        <span className="text-slate-400 text-[11px] font-bold bg-slate-50 px-2 py-1 rounded-lg">
          {quiz.level}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="flex items-center gap-2 bg-slate-50 p-3 rounded-2xl">
          <HelpCircle size={16} className="text-blue-500" />
          <span className="text-[11px] font-black text-slate-700">
            {quiz.questions?.length || 0} أسئلة
          </span>
        </div>
        <div className="flex items-center gap-2 bg-slate-50 p-3 rounded-2xl">
          <Users size={16} className="text-purple-500" />
          <span className="text-[11px] font-black text-slate-700">0 طالب</span>
        </div>
      </div>

      {quiz?.lessons?.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          {quiz.lessons.map((lesson: any) => (
            <span key={lesson._id} className="text-slate-400 text-[11px] font-bold bg-slate-50 px-2 py-1 rounded-lg">
              {lesson.title}
            </span>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between pt-4 border-t border-slate-50">
        <Link
          href={`/quizzes/${quiz._id}`}
          className="text-[#5700FF] font-black text-xs flex items-center gap-1 hover:gap-2 transition-all"
        >
          التفاصيل <ChevronLeft size={14} />
        </Link>
      </div>
    </div>
  );
};

export default QuizCard;
