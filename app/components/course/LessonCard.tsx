import { API } from "@/app/constants";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Edit3, FileText, Play, Trash2, MoreVertical } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import { useState, useRef, useEffect } from "react";
import UpdateLesson from "./UpdateLesson";
import AddLessonNote from "../note/AddLessonNote";
import Link from "next/link";

const LessonCard = ({ lesson }: { lesson: any }) => {
  const queryClient = useQueryClient();

  const [showUpdateLesson, setShowUpdateLesson] = useState(false);
  const [showAddNote, setShowAddNote] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const getYouTubeThumbnail = (url: string) => {
    const videoId = url.split("v=")[1]?.split("&")[0] || url.split("/").pop();
    return `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      const res = await fetch(`${API}/teacher/delete-lesson/${lesson._id}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "حدث خطأ");
      return data.data;
    },
    onSuccess: () => {
      toast.success("تمت إضافة الدرس بنجاح");
      queryClient.invalidateQueries({ queryKey: ["lessons"] });
    },
    onError: (error: any) => {
      toast.error(error.message || "حدث خطأ أثناء الإضافة");
    },
  });

  return (
    <div className="bg-white rounded-xl   border border-slate-100 shadow-sm hover:shadow-md transition-all group">
      {/* Thumbnail Section */}
      <div className="relative aspect-video w-full overflow-hidden bg-slate-200 h-[150px]">
        <Image
          src={getYouTubeThumbnail(lesson.videoUrl)}
          alt={lesson.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          width={500}
          height={500}
        />
        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/30 transition-colors flex items-center justify-center">
          <Play size={32} className="text-white/80" fill="white" />
        </div>
      </div>

      {/* Content Section */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-slate-800 text-sm mb-1.5 line-clamp-1">
              {lesson.title}
            </h3>
            <p className="text-slate-500 text-xs line-clamp-2 leading-relaxed">
              {lesson.description}
            </p>
          </div>

          {/* Three-dot menu */}
          <div className="relative flex-shrink-0" ref={menuRef}>
            <button
              onClick={() => setMenuOpen((prev) => !prev)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all"
            >
              <MoreVertical size={16} />
            </button>

            {menuOpen && (
              <div className="absolute left-0 top-8 z-50 w-44 bg-white border border-slate-200 rounded-xl shadow-lg py-1 text-right">
                <button
                  onClick={() => { setShowUpdateLesson(true); setMenuOpen(false); }}
                  className="flex items-center gap-2.5 w-full px-3 py-2 text-xs text-blue-600 hover:bg-blue-50 transition-colors"
                >
                  <Edit3 size={14} />
                  تعديل
                </button>

                <button
                  onClick={() => { setShowAddNote(true); setMenuOpen(false); }}
                  className="flex items-center gap-2.5 w-full px-3 py-2 text-xs text-emerald-600 hover:bg-emerald-50 transition-colors"
                >
                  <FileText size={14} />
                  إضافة مذكرة
                </button>

                <Link
                  href={`/quizzes/create?level=${lesson.level}&course=${lesson.course}&subject=${lesson.subject}&lesson=${lesson._id}`}
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2.5 w-full px-3 py-2 text-xs text-purple-600 hover:bg-purple-50 transition-colors"
                >
                  <FileText size={14} />
                  إنشاء اختبار
                </Link>

                <div className="border-t border-slate-100 my-1" />

                <button
                  onClick={() => { mutate(); setMenuOpen(false); }}
                  className="flex items-center gap-2.5 w-full px-3 py-2 text-xs text-red-600 hover:bg-red-50 transition-colors"
                >
                  <Trash2 size={14} />
                  {isPending ? "جاري الحذف..." : "حذف"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {showUpdateLesson && (
        <UpdateLesson showUpdateLesson={setShowUpdateLesson} lesson={lesson} />
      )}

      {showAddNote && (
        <AddLessonNote lesson={lesson} setShowAddNote={setShowAddNote} />
      )}
    </div>
  );
};

export default LessonCard;