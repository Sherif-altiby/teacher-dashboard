"use client";

import Link from 'next/link';
import { Compass, ArrowRight, Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[75vh] flex flex-col items-center justify-center text-center px-4" dir="rtl">
      {/* Glowing Icon Container */}
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-[#5700FF]/15 rounded-full blur-2xl animate-pulse" />
        <div className="relative h-28 w-28 bg-white border border-slate-100 rounded-[2rem] shadow-premium flex items-center justify-center text-[#5700FF]">
          <Compass size={56} className="animate-[spin_12s_linear_infinite]" />
        </div>
      </div>

      {/* 404 Title */}
      <h1 className="text-8xl font-black text-[#5700FF] tracking-wider mb-2 select-none drop-shadow-sm">
        404
      </h1>

      {/* Heading */}
      <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-4">
        عذراً، الصفحة غير موجودة!
      </h2>

      {/* Description */}
      <p className="text-slate-500 font-bold max-w-md mb-8 text-sm md:text-base leading-relaxed">
        يبدو أنك سلكت مساراً خاطئاً، أو أن الصفحة التي تبحث عنها قد تم نقلها أو حذفها من النظام.
      </p>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <Link
          href="/"
          className="flex items-center gap-2 bg-[#5700FF] text-white px-6 py-3.5 rounded-xl font-bold text-sm shadow-lg shadow-[#5700FF]/25 hover:scale-[1.02] hover:bg-[#4900d6] transition-all duration-200 cursor-pointer"
        >
          <Home size={18} />
          <span>العودة للرئيسية</span>
        </Link>

        <button
          onClick={() => window.history.back()}
          className="flex items-center gap-2 bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200/80 px-6 py-3.5 rounded-xl font-bold text-sm transition-all duration-200 active:scale-[0.98] cursor-pointer"
        >
          <span>الرجوع للخلف</span>
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
}
