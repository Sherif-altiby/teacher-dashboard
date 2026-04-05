"use client";

import useLoginMutation from "@/app/hooks/auth/useLogin";
import { Mail, Lock, ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { mutate, isPending } = useLoginMutation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    mutate({ email, password });
  };

  return (
    <div className="min-h-screen w-full bg-[#F8FAFC] flex items-center justify-center p-6 z-50 overflow-hidden fixed inset-0">
      <div className="relative z-10 w-full max-w-115">
        {/* 3. The Login Card (Clean White) */}
        <div className="bg-white border border-slate-200 rounded-[2.5rem] p-10 shadow-[0_40px_100px_-20px_rgba(0,102,255,0.08)]">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Email Input */}
            <div className="space-y-2">
              <label className="text-[13px] font-bold text-slate-600 pr-2 block text-right">
                البريد الإلكتروني
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 right-0 flex items-center pr-4 text-slate-400 group-focus-within:text-[#0066FF] transition-colors">
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  placeholder="name@example.com"
                  className="w-full text-sm text-gray-500 bg-slate-50 border border-slate-100 rounded-2xl py-4 pr-12 pl-4   placeholder:text-slate-400 outline-none focus:border-[#0066FF]/30 focus:bg-white focus:ring-4 focus:ring-[#0066FF]/5 transition-all text-left   font-medium"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <div className="flex justify-between items-center px-2">
                <label className="text-[13px] font-bold text-slate-600 block text-right">
                  كلمة المرور
                </label>
                <Link
                  href="#"
                  className="text-xs font-bold text-[#0066FF] hover:underline underline-offset-4 transition-all"
                >
                  نسيت كلمة السر？
                </Link>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 right-0 flex items-center pr-4 text-slate-400 group-focus-within:text-[#0066FF] transition-colors">
                  <Lock size={18} />
                </div>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full text-sm text-gray-500 bg-slate-50 border border-slate-100 rounded-2xl py-4 pr-12 pl-4  placeholder:text-slate-400 outline-none focus:border-[#0066FF]/30 focus:bg-white focus:ring-4 focus:ring-[#0066FF]/5 transition-all text-left dir-ltr font-medium"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            {/* Primary Action Button */}
            <button
              className="group w-full bg-[#0066FF] hover:bg-[#0052CC] text-white font-black py-4 rounded-2xl shadow-[0_15px_30px_rgba(0,102,255,0.2)] hover:shadow-[0_20px_40px_rgba(0,102,255,0.3)] transition-all flex items-center justify-center gap-3 active:scale-[0.98]"
              disabled={isPending}
            >
              <span>
                {isPending ? "جاري تسجيل الدخول  ..." : "تسجيل الدخول "}{" "}
              </span>
              {isPending ? (
                <Loader2
                  size={20}
                  className="group-hover:-translate-x-1.25transition-transform"
                />
              ) : (
                <ArrowRight
                  size={20}
                  className="group-hover:-translate-x-1.25transition-transform"
                />
              )}
            </button>
          </form>
        </div>

        {/* 5. Bottom Copyright */}
        <p className="text-center mt-8 text-[11px] text-slate-400 font-medium">
          &copy; ٢٠٢٦ منصة العبقري التعليمية. جميع الحقوق محفوظة.
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
