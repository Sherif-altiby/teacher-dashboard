"use client";

import { BellOff, ArrowRight, Bell } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";

const NotificationsPage = () => {
  const [isMounted, setIsMounted] = useState(false);

  // Fix for Hydration Error #418
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 text-right" dir="rtl">
      <div className="max-w-md w-full text-center space-y-8">
        
        {/* Animated Icon Container */}
        <div className="relative mx-auto w-32 h-32">
          <div className="absolute inset-0 bg-indigo-100 rounded-full animate-ping opacity-20"></div>
          <div className="relative bg-white rounded-full w-32 h-32 flex items-center justify-center shadow-xl shadow-indigo-500/10 border border-slate-100">
            <BellOff size={48} className="text-slate-300" />
            
            {/* Small floating notification badge */}
            <div className="absolute top-6 right-6 w-4 h-4 bg-slate-200 rounded-full border-4 border-white"></div>
          </div>
        </div>

        {/* Text Content */}
        <div className="space-y-3">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            لا توجد تنبيهات
          </h1>
          <p className="text-slate-500 font-medium leading-relaxed">
            تبدو لوحة التنبيهات فارغة حالياً. عندما تتلقى أي إشعارات جديدة بخصوص اختباراتك أو طلابك، ستظهر هنا.
          </p>
        </div>

        {/* Action Button */}
      

        

      </div>
    </div>
  );
};

export default NotificationsPage;