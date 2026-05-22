"use client";
import { useState, useRef, useEffect } from "react";
import { Course } from "@/app/types";
import { Camera, X, ChevronDown } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useLevelStore } from "@/app/store/levelsStore";
import { updateCourse } from "@/app/services/coursesService";
import { toast } from "sonner";


interface Props {
  showUpdateCourse: boolean;
  setShowUpdateCourse: (val: boolean) => void;
  course: Course | undefined;
  subjectId: string;
}

const UpdateCourseModel = ({
  showUpdateCourse,
  setShowUpdateCourse,
  course,
  subjectId
}: Props) => {
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { levels } = useLevelStore();

  // الحالة المحلية للنموذج
  const [formData, setFormData] = useState({
    title: "",
    level: "",
    status: "",
    price: 0,
    offer: 0,
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // تحديث الحالة عند فتح المودال ببيانات الكورس المختار ومطابقة المستوى للحصول على الـ ID
  useEffect(() => {
    if (course && levels.length > 0) {
      const matchedLevel = levels.find((l) => l.name === course.level);
      setFormData({
        title: course.title,
        level: matchedLevel ? matchedLevel._id : "",
        status: course.status,
        price: course.price,
        offer: course.offer || 0,
      });
    }
  }, [course, levels]);

  // React Query Mutation باستخدام fetch
  const { mutate, isPending } = useMutation({
    mutationFn: updateCourse,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teacher-courses"] });
      toast.success("تم تحديث الكورس بنجاح");
      setShowUpdateCourse(false);
    },
    onError: (error: any) => {
      toast.error(error.message || "حدث خطأ ما");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const data = new FormData();
    data.append("title", formData.title);
    data.append("subjectId", subjectId);
    data.append("price", formData.price.toString());
    data.append("offer", formData.offer.toString());
    data.append("status", formData.status);
    data.append("level", formData.level);

    if (selectedFile) {
      data.append("image", selectedFile);
    }

    mutate({ courseId: course?._id || "", formData: data });
  };

  if (!showUpdateCourse) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm"
        onClick={() => setShowUpdateCourse(false)}
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-50">
          <h2 className="text-base font-bold text-slate-800">تعديل الكورس</h2>
          <button
            type="button"
            className="p-1.5 hover:bg-slate-100 rounded-full transition-colors"
            onClick={() => setShowUpdateCourse(false)}
          >
            <X size={18} className="text-slate-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-6 space-y-4">
          {/* Hidden File Input */}
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
          />

          {/* Custom Image Picker */}
          <div
            onClick={() => fileInputRef.current?.click()}
            className={`flex items-center gap-3 p-3 rounded-xl border-2 border-dashed transition-all cursor-pointer 
              ${selectedFile ? "bg-indigo-50 border-indigo-200" : "bg-slate-50 border-slate-100 hover:border-indigo-200"}`}
          >
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-indigo-600 shadow-sm">
              <Camera size={18} />
            </div>
            <div className="text-right flex-1">
              <p className="text-xs font-bold text-slate-700">
                {selectedFile ? "تم اختيار صورة جديدة" : "تغيير الغلاف"}
              </p>
              <p className="text-[10px] text-slate-400 truncate max-w-[200px]">
                {selectedFile ? selectedFile.name : "اضغط لرفع صورة أو اتركها كما هي"}
              </p>
            </div>
          </div>

          {/* Title Input */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase mr-1">عنوان الكورس</label>
            <input
              type="text"
              required
              placeholder="مثلاً: كورس اللغة الإنجليزية..."
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full bg-white border-b-2 border-slate-100 py-1.5 px-1 text-right outline-none focus:border-indigo-600 transition-all text-sm font-semibold text-slate-700"
            />
          </div>

          {/* Level & Status Selects */}
          <div className="flex gap-3">
            <div className="relative flex-1">
              <select
                value={formData.level} // نضع القيمة المختارة هنا
                onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                className="w-full bg-slate-50 border-none rounded-xl py-2.5 px-3 text-right appearance-none text-xs font-semibold text-slate-600 outline-none focus:ring-2 focus:ring-indigo-500/20"
              >
                <option value="" disabled>اختر المستوى</option>
                {levels.map((level) => (
                  <option key={level._id} value={level._id}>
                    {level.name}
                  </option>
                ))}
              </select>
              <ChevronDown size={12} className="absolute left-3 top-3.5 text-slate-400 pointer-events-none" />
            </div>

            <div className="relative flex-1">
              <select
                required
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full bg-slate-50 border-none rounded-xl py-2.5 px-3 text-right appearance-none text-xs font-semibold text-slate-600 outline-none focus:ring-2 focus:ring-indigo-500/20"
              >
                <option value="close">كورس مدفوع</option>
                <option value="open">كورس مجاني</option>
              </select>
              <ChevronDown size={12} className="absolute left-3 top-3.5 text-slate-400 pointer-events-none" />
            </div>
          </div>

          {/* Pricing Section */}
          <div className="flex items-center gap-3">
            <div className="flex-1 bg-slate-50 rounded-xl px-3 py-2 border border-slate-100">
              <label className="block text-[9px] font-bold text-slate-400 mb-0.5 text-right uppercase">السعر (EGP)</label>
              <input
                type="number"
                required
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: +e.target.value })}
                className="w-full bg-transparent outline-none text-right font-bold text-slate-700 text-sm"
              />
            </div>
            <div className="flex-1 bg-indigo-50/50 rounded-xl px-3 py-2 border border-indigo-100">
              <label className="block text-[9px] font-bold text-indigo-400 mb-0.5 text-right uppercase">الخصم</label>
              <input
                type="number"
                value={formData.offer}
                onChange={(e) => setFormData({ ...formData, offer: +e.target.value })}
                className="w-full bg-transparent outline-none text-right font-bold text-indigo-600 text-sm"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isPending}
              className="w-full bg-indigo-600 text-white py-2.5 rounded-xl font-bold text-xs shadow-md shadow-indigo-100 hover:bg-indigo-700 active:scale-[0.98] transition-all disabled:bg-slate-200 disabled:shadow-none disabled:text-slate-400"
            >
              {isPending ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  جاري الحفظ...
                </span>
              ) : (
                "حفظ التغييرات"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateCourseModel;