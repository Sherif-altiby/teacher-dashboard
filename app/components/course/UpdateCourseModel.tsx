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

  // تحديث الحالة عند فتح المودال ببيانات الكورس المختار
  useEffect(() => {
    if (course) {
      setFormData({
        title: course.title,
        level: course.level, 
        status: course.status,
        price: course.price,
        offer: course.offer || 0,
      });
    }
  }, [course]);

  // React Query Mutation باستخدام fetch
  const { mutate, isPending } = useMutation({
    mutationFn: updateCourse,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teacher-subjects"] });
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
      <div className="relative w-full max-w-lg bg-white rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        <div className="flex items-center justify-between px-8 py-6 border-b border-slate-50">
          <h2 className="text-xl font-black text-slate-800">تعديل الكورس</h2>
          <button
            type="button"
            className="p-2 hover:bg-slate-100 rounded-full transition-colors"
            onClick={() => setShowUpdateCourse(false)}
          >
            <X size={20} className="text-slate-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-8 py-8 space-y-5">
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
            className={`flex items-center gap-4 p-4 rounded-2xl border-2 border-dashed transition-all cursor-pointer 
              ${selectedFile ? "bg-indigo-50 border-indigo-200" : "bg-slate-50 border-slate-100 hover:border-indigo-200"}`}
          >
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-indigo-600 shadow-sm">
              <Camera size={22} />
            </div>
            <div className="text-right flex-1">
              <p className="text-sm font-bold text-slate-700">
                {selectedFile ? "تم اختيار صورة جديدة" : "تغيير الغلاف"}
              </p>
              <p className="text-xs text-slate-400 truncate max-w-[200px]">
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
              className="w-full bg-white border-b-2 border-slate-100 py-2 px-1 text-right outline-none focus:border-indigo-600 transition-all text-lg font-bold text-slate-700"
            />
          </div>

          {/* Level & Status Selects */}
          <div className="flex gap-4">
            <div className="relative flex-1">
            <select
  value={formData.level} // نضع القيمة المختارة هنا
  onChange={(e) => setFormData({ ...formData, level: e.target.value })}
  className="..."
>
  <option value="" disabled>اختر المستوى</option>
  {levels.map((level) => (
    <option key={level._id} value={level._id}>
      {level.name}
    </option>
  ))}
</select>
              <ChevronDown size={14} className="absolute left-3 top-4 text-slate-400 pointer-events-none" />
            </div>

            <div className="relative flex-1">
              <select
                required
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full bg-slate-50 border-none rounded-xl py-3.5 px-4 text-right appearance-none text-sm font-bold text-slate-600 outline-none focus:ring-2 focus:ring-indigo-500/20"
              >
                <option value="close">كورس مدفوع</option>
                <option value="open">كورس مجاني</option>
              </select>
              <ChevronDown size={14} className="absolute left-3 top-4 text-slate-400 pointer-events-none" />
            </div>
          </div>

          {/* Pricing Section */}
          <div className="flex items-center gap-4">
            <div className="flex-1 bg-slate-50 rounded-2xl px-4 py-3 border border-slate-100">
              <label className="block text-[10px] font-bold text-slate-400 mb-1 text-right uppercase">السعر (EGP)</label>
              <input
                type="number"
                required
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: +e.target.value })}
                className="w-full bg-transparent outline-none text-right font-black text-slate-700 text-lg"
              />
            </div>
            <div className="flex-1 bg-indigo-50/50 rounded-2xl px-4 py-3 border border-indigo-100">
              <label className="block text-[10px] font-bold text-indigo-400 mb-1 text-right uppercase">الخصم</label>
              <input
                type="number"
                value={formData.offer}
                onChange={(e) => setFormData({ ...formData, offer: +e.target.value })}
                className="w-full bg-transparent outline-none text-right font-black text-indigo-600 text-lg"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={isPending}
              className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black text-lg shadow-xl shadow-indigo-200 hover:bg-indigo-700 active:scale-[0.98] transition-all disabled:bg-slate-200 disabled:shadow-none disabled:text-slate-400"
            >
              {isPending ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
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