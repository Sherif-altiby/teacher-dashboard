"use client";

import { X, Camera, ChevronDown } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useRef } from "react";
import { addCourse } from "@/app/services/coursesService";
import { toast } from "sonner";
import { useLevelStore } from "@/app/store/levelsStore";

const AddCourseModal = ({
  showAddCourse,
  subId,
}: {
  showAddCourse: (val: boolean) => void;
  subId: string;
}) => {
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const levels = useLevelStore((s) => s.levels);

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    subjectId: subId,
    price: 0,
    offer: 0,
    level: "",
    status: "close",
  });
  const [avatar, setAvatar] = useState<File | null>(null);

  // React Query Mutation
  const { mutate, isPending } = useMutation({
    mutationFn: addCourse,
    onSuccess: () => {
      toast.success("تم إضافة الكورس بنجاح");
      queryClient.invalidateQueries({ queryKey: ["teacher-courses"] });
      showAddCourse(false); // Close modal
    },
    onError: (error: any) => {
      toast.error(error.message || "حدث خطأ ما");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!avatar) return toast.warning("يرجى اختيار صورة للكورس");
    if (!formData.subjectId || !formData.level)
      return toast.warning("يرجى ملء جميع الحقول");

    mutate({
      ...formData,
      avatar: avatar,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
      <div
        className="absolute inset-0 bg-slate-900/20 backdrop-blur-md"
        onClick={() => showAddCourse(false)}
      />

      <div className="relative w-full max-w-lg bg-white rounded-4xl shadow-xl overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
        <div className="flex items-center justify-between px-8 py-6">
          <h2 className="text-xl font-bold text-slate-800">كورس جديد</h2>
          <button
            className="text-slate-400 hover:text-slate-600 transition-colors"
            onClick={() => showAddCourse(false)}
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-8 pb-8 space-y-5">
          {/* Hidden File Input */}
          <input
            type="file"
            className="hidden"
            ref={fileInputRef}
            onChange={(e) => setAvatar(e.target.files?.[0] || null)}
            accept="image/*"
          />

          {/* Image Picker UI */}
          <div
            onClick={() => fileInputRef.current?.click()}
            className={`flex items-center gap-4 p-4 rounded-2xl border transition-all cursor-pointer ${avatar ? "bg-green-50 border-green-200" : "bg-slate-50 border-slate-100 hover:bg-slate-100"}`}
          >
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-[#0066FF] shadow-sm">
              <Camera size={20} />
            </div>
            <div className="text-right">
              <p className="text-sm font-bold text-slate-700">
                {avatar ? "تم اختيار الصورة" : "صورة الغلاف"}
              </p>
              <p className="text-xs text-slate-400">
                {avatar ? avatar.name : "اضغط لرفع صورة"}
              </p>
            </div>
          </div>

          <div className="space-y-1">
            <input
              type="text"
              required
              placeholder="اسم الكورس..."
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="w-full bg-white border-b-2 border-slate-100 py-3 px-1 text-right outline-none focus:border-[#0066FF] transition-all text-lg font-medium"
            />
          </div>

          <div className="flex gap-4">
            <div className="relative flex-1">
              <select
                required
                className="w-full bg-slate-50 border-none rounded-xl py-3 px-4 text-right appearance-none text-sm font-bold text-slate-600 outline-none focus:ring-1 focus:ring-[#0066FF]"
                onChange={(e) =>
                  setFormData({ ...formData, level: e.target.value })
                }
              >
                {levels.map((level) => (
                  <option key={level._id} value={level._id}>
                    {level.name}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={14}
                className="absolute left-3 top-4 text-slate-400 pointer-events-none"
              />
            </div>

            <div className="relative flex-1">
              <select
                required
                className="w-full bg-slate-50 border-none rounded-xl py-3 px-4 text-right appearance-none text-sm font-bold text-slate-600 outline-none focus:ring-1 focus:ring-[#0066FF]"
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value })
                }
              >
                <option value={"close"}> هذا الكورس مدفوع </option>
                <option value={"open"}> هذا الكورس مجاني </option>
              </select>
              <ChevronDown
                size={14}
                className="absolute left-3 top-4 text-slate-400 pointer-events-none"
              />
            </div>
          </div>

          <div className="flex items-center gap-4 ">
            <div className="flex-1 bg-slate-50 rounded-xl px-4 py-2">
              <label className="block text-[10px] font-bold text-slate-400 mb-1 text-right">
                السعر الأصلي
              </label>
              <input
                type="number"
                required
                className="w-full bg-transparent outline-none text-right font-bold text-slate-700"
                placeholder="0"
                onChange={(e) =>
                  setFormData({ ...formData, price: +e.target.value })
                }
              />
            </div>
            <div className="flex-1 bg-slate-50 rounded-xl px-4 py-2">
              <label className="block text-[10px] font-bold text-slate-400 mb-1 text-right">
                قيمة الخصم
              </label>
              <input
                type="number"
                className="w-full bg-transparent outline-none text-right font-bold text-[#0066FF]"
                placeholder="0"
                onChange={(e) =>
                  setFormData({ ...formData, offer: +e.target.value })
                }
              />
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={isPending}
              className="w-full bg-[#0066FF] text-white py-4 rounded-2xl font-bold hover:opacity-90 active:scale-[0.98] transition-all disabled:bg-slate-300"
            >
              {isPending ? "جاري الحفظ..." : "حفظ ونشر الكورس"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCourseModal;
