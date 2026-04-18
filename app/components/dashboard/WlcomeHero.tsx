"use client";

import { useAuthStore } from "@/app/store/authStore";
import {  Calendar as CalendarIcon } from "lucide-react";

export const WelcomeHero = () => {
  // Arabic Date Logic
  const today = new Date().toLocaleDateString("ar-EG", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

   const  user  = useAuthStore(state => state.user);

  return (
    <div className="relative overflow-hidden rounded-xl md:rounded-4xl bg-linear-to-br from-[#5700FF] via-[#7000FF] to-[#8A00FF] p-8 shadow-[0_20px_50px_rgba(87,0,255,0.2)]">
      {/* Decorative Engineering Elements (Glows) */}
      <div className="absolute -top-24 -right-24 w-80 h-80 bg-white/10 rounded-full blur-[80px]" />
      <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-black/20 rounded-full blur-[60px]" />

      <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
        {/* Text Content Section */}
        <div className="space-y-3 text-right md:text-right"  >
          <h1 className="text-xl! md:text-5xl font-extrabold text-white leading-[1.2]">
            أهلاً بك مجدداً، <br />
            <span className="text-[#FACC15] drop-shadow-sm">أستاذ {user?.name}</span> 👋
          </h1>
        </div>

        {/* Date Glass-Badge */}
        <div className="group bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl md:rounded-3xl p-5 flex items-center gap-2 md:gap-5 text-white transition-all hover:bg-white/15">
          <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
            <CalendarIcon size={20} className="text-white" />
          </div>
          <div className="flex flex-col md:gap-1">
            <span className="text-[11px] text-white/50 font-bold uppercase tracking-wider">
              تاريخ اليوم
            </span>
            <span className="text-base md:font-bold tracking-tight">{today}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
