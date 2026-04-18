"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Lock, ShieldCheck, Eye, EyeOff, Loader2, KeyRound } from "lucide-react";
import { toast } from "sonner";
import { API } from "@/app/constants";

const ChangePassword = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [passwords, setPasswords] = useState({
    password: "",
    confirmPassword: "",
  });


  const { mutate, isPending } = useMutation({
    mutationFn: async (data: typeof passwords) => {
      const response = await fetch(`${API}/user/change-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "فشل تحديث كلمة المرور");
      return result;
    },
    onSuccess: () => {
      toast.success("تم تغيير كلمة المرور بنجاح");
      setPasswords({ password: "", confirmPassword: "" }); // إعادة تهيئة الحقول
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // التحقق من المطابقة قبل الإرسال
    if (passwords.password !== passwords.confirmPassword) {
      return toast.error("كلمات المرور غير متطابقة");
    }
    if (passwords.password.length < 6) {
      return toast.error("كلمة المرور يجب أن تكون 6 أحرف على الأقل");
    }

    mutate(passwords);
  };

  return (
    <div className="max-w-4xl mx-auto mt-10" dir="rtl">
      <div className="bg-white border border-slate-100 rounded-[2.5rem] shadow-xl shadow-slate-100/50 overflow-hidden">
        
        {/* Header Section */}
        <div className="bg-slate-50/50 p-8 border-b border-slate-100 flex items-center gap-5">
          <div className="w-9 md:h-14 h-9 md:w-14 bg-blue-600 rounded-lg md:rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
            <KeyRound  className="size-4  md:size-6" />
          </div>
          <div>
            <h2 className="md:text-2xl font-black text-slate-900">تغيير كلمة المرور</h2>
            <p className="text-slate-400 text-xs md:text-sm font-medium">تأكد من اختيار كلمة مرور قوية لحماية حسابك</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-8 md:p-10 space-y-6">
          
          {/* New Password Field */}
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 px-1 uppercase tracking-widest">
              كلمة المرور الجديدة
            </label>
            <div className="relative">
              <Lock className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
              <input
                type={showPassword ? "text" : "password"}
                value={passwords.password}
                onChange={(e) => setPasswords({ ...passwords, password: e.target.value })}
                className="w-full bg-slate-50 border-none rounded-2xl py-4 pr-12 pl-12 text-slate-700 font-bold focus:ring-2 focus:ring-blue-100 transition-all outline-none"
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600 transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Confirm Password Field */}
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 px-1 uppercase tracking-widest">
              تأكيد كلمة المرور
            </label>
            <div className="relative">
              <ShieldCheck className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
              <input
                type={showPassword ? "text" : "password"}
                value={passwords.confirmPassword}
                onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                className="w-full bg-slate-50 border-none rounded-2xl py-4 pr-12 pl-4 text-slate-700 font-bold focus:ring-2 focus:ring-blue-100 transition-all outline-none"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          {/* Security Tip */}
          <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 flex gap-3">
            <div className="text-amber-600 mt-0.5">
              <ShieldCheck size={16} />
            </div>
            <p className="text-xs text-amber-700 leading-relaxed font-medium">
              نصيحة: استخدم مزيجاً من الأحرف الكبيرة والصغيرة والأرقام والرموز لإنشاء كلمة مرور يصعب تخمينها.
            </p>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={isPending}
              className="w-full flex items-center justify-center gap-2 py-4 bg-slate-900 text-white rounded-2xl font-black shadow-lg shadow-slate-200 hover:bg-blue-600 transition-all active:scale-[0.98] disabled:opacity-50"
            >
              {isPending ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  جاري التحديث...
                </>
              ) : (
                "تحديث كلمة المرور"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;