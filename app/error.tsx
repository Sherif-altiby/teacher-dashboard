"use client";

import Link from 'next/link';
import { ServerCrash, ArrowRight, Home, RefreshCw } from 'lucide-react';

export default function ServerError() {
  return (
    <div className="min-h-[75vh] flex flex-col items-center justify-center text-center px-4" dir="rtl">
      {/* Icon Container */}
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-red-500/15 rounded-full blur-2xl animate-pulse" />
        <div className="relative h-28 w-28 bg-white border border-slate-100 rounded-[2rem] shadow-premium flex items-center justify-center text-red-500">
          <ServerCrash size={56} className="animate-[bounce_3s_ease-in-out_infinite]" />
        </div>
      </div>

      {/* 500 Title */}
      <h1 className="text-8xl font-black text-red-500 tracking-wider mb-2 select-none drop-shadow-sm">
        500
      </h1>

      {/* Heading */}
      <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-4">
        خطأ في الخادم!
      </h2>

      {/* Description */}
      <p className="text-slate-500 font-bold max-w-md mb-8 text-sm md:text-base leading-relaxed">
        حدث خطأ غير متوقع في الخادم. فريقنا على علم بالمشكلة وسيتم إصلاحها قريباً. يرجى المحاولة مرة أخرى.
      </p>

      {/* Error Code Badge */}
      <div className="flex items-center gap-2 bg-red-50 border border-red-100 text-red-400 text-xs font-mono px-4 py-2 rounded-full mb-8">
        <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
        Internal Server Error — 500
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <button
          onClick={() => window.location.reload()}
          className="flex items-center gap-2 bg-red-500 text-white px-6 py-3.5 rounded-xl font-bold text-sm shadow-lg shadow-red-500/25 hover:scale-[1.02] hover:bg-red-600 transition-all duration-200 cursor-pointer"
        >
          <RefreshCw size={18} />
          <span>إعادة المحاولة</span>
        </button>

        <Link
          href="/"
          className="flex items-center gap-2 bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200/80 px-6 py-3.5 rounded-xl font-bold text-sm transition-all duration-200 active:scale-[0.98] cursor-pointer"
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