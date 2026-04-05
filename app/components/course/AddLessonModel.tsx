"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { X, Video, AlignRight, Link2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { API } from "@/app/constants";

// Types for the component props
interface AddLessonModalProps {
  setShowAddModal: (val: boolean) => void;
  courseId: string;
  subjectId: string;
}

const AddLessonModal = ({ setShowAddModal, courseId, subjectId }: AddLessonModalProps) => {
  const queryClient = useQueryClient();
  
  // Local Form State
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    videoUrl: "",
  });

   const { mutate, isPending } = useMutation({
    mutationFn: async (vars: { title: string; description: string; videoUrl: string; courseId: string; subjectId: string }) => {

        const res = await fetch(`${API}/teacher/add-lesson`, {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(vars),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "حدث خطأ");
        return data.data;
    },
    onSuccess: () => {
      toast.success("تمت إضافة الدرس بنجاح");
      // Refetch the lessons list to show the new card immediately
      queryClient.invalidateQueries({ queryKey: ["lessons", courseId] });
      setShowAddModal(false);
    },
    onError: (error: any) => {
      toast.error(error.message || "حدث خطأ أثناء الإضافة");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.videoUrl) {
      return toast.warning("يرجى ملء البيانات الأساسية");
    }

    mutate({
      ...formData,
      courseId,
      subjectId,
    });
  };

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-2">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-md transition-opacity" 
        onClick={() => setShowAddModal(false)}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300" dir="rtl">
        
        {/* Header */}
        <div className="flex items-center justify-between px-10 py-8 border-b border-slate-50">
          <h2 className="text-2xl font-semibold text-slate-800">إضافة درس جديد</h2>
          <button 
            className="p-2 bg-slate-50 text-slate-400 hover:text-slate-600 rounded-full transition-colors" 
            onClick={() => setShowAddModal(false)}
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 md:p-10 space-y-7">
          
          {/* Title Input */}
          <div className="space-y-2">
            <label className="block text-sm font-bold text-slate-700 mr-2">عنوان الدرس</label>
            <div className="relative">
              <input 
                type="text" 
                placeholder="مثلاً: الفصل الأول - مقدمة عامة"
                className="w-full bg-slate-50 border-none rounded-2xl py-4 px-12 text-right outline-none focus:ring-2 focus:ring-[#0066FF] transition-all"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                required
              />
              <Video className="absolute right-4 top-4 text-[#0066FF]" size={20} />
            </div>
          </div>

          {/* Video URL Input */}
          <div className="space-y-2">
            <label className="block text-sm font-bold text-slate-700 mr-2">رابط فيديو اليوتيوب</label>
            <div className="relative">
              <input 
                type="url" 
                placeholder="https://www.youtube.com/watch?v=..."
                className="w-full bg-slate-50 border-none rounded-2xl py-4 px-12 text-right outline-none focus:ring-2 focus:ring-[#0066FF] transition-all text-sm"
                value={formData.videoUrl}
                onChange={(e) => setFormData({...formData, videoUrl: e.target.value})}
                required
              />
              <Link2 className="absolute right-4 top-4 text-[#0066FF]" size={20} />
            </div>
          </div>

          {/* Description Input */}
          <div className="space-y-2">
            <label className="block text-sm font-bold text-slate-700 mr-2">وصف الدرس</label>
            <div className="relative">
              <textarea 
                rows={4}
                placeholder="اكتب تفاصيل أو ملاحظات حول هذا الدرس..."
                className="w-full bg-slate-50 border-none rounded-2xl py-4 px-12 text-right outline-none focus:ring-2 focus:ring-[#0066FF] transition-all resize-none"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
              />
              <AlignRight className="absolute right-4 top-4 text-[#0066FF]" size={20} />
            </div>
          </div>

          {/* Action Button */}
          <div className="pt-4">
            <button 
              type="submit"
              disabled={isPending}
              className="w-full bg-[#0066FF] text-white py-4 rounded-2xl font-semibold text-lg hover:bg-blue-700 active:scale-[0.98] transition-all shadow-xl shadow-blue-100 disabled:bg-slate-300 disabled:shadow-none flex items-center justify-center gap-3"
            >
              {isPending ? (
                <>
                  <Loader2 className="animate-spin" />
                  جاري الحفظ...
                </>
              ) : (
                "حفظ ونشر الدرس"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddLessonModal;