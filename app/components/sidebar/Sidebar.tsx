"use client";

import { MENUITEMS } from "@/app/constants";
import { useShowStore } from "@/app/store/showMenuStore";
import Link from "next/link";
import { usePathname } from "next/navigation"; // لإضافة حالة "Active"

export const Sidebar = () => {
  const { show, setShow } = useShowStore();
  const pathname = usePathname();

  return (
    <>
      {/* 1. Overlay للشاشات الصغيرة (يغلق المنيو عند الضغط خارجها) */}
      {show && (
        <div 
          className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40 xl:hidden transition-opacity"
          onClick={() => setShow(false)}
        />
      )}

      {/* 2. الـ Sidebar الرئيسي */}
      <aside 
        className={` flex-col overflow-hidden transition-all bg-glass-bg backdrop-blur-(--sidebar-blur) bg-white  shadow-lg rounded-3xl w-70 h-full hidden xl:flex ${show && 'flex! fixed top-0 right-0 z-50'}`}
      >
        <div className="flex-1 overflow-y-auto px-4 py-6 scrollbar-thin">
 

          <nav className="space-y-2">
            {MENUITEMS.map((item) => {
              const isActive = pathname === item.link;

              return (
                <Link
                  key={item.name}
                  href={item.link}
                  // إغلاق المنيو تلقائياً عند الضغط على رابط في الموبايل
                  onClick={() => setShow(false)}
                  className={`
                    group w-full flex items-center gap-3 px-5 py-4 rounded-2xl transition-all duration-300 active:scale-[0.95]
                    ${isActive 
                      ? "bg-[#5700FF] text-white shadow-lg shadow-[#5700FF]/30" 
                      : "text-slate-500 hover:bg-slate-50 hover:text-[#5700FF]"}
                  `}
                >
                  <item.icon
                    size={22}
                    strokeWidth={isActive ? 2.5 : 2}
                    className={`transition-colors duration-300 ${isActive ? "text-white" : "group-hover:text-[#5700FF]"}`}
                  />

                  <span className={`font-bold text-sm ${isActive ? "text-white" : "text-slate-600"}`}>
                    {item.name}
                  </span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* اختياري: فوتر صغير في الـ Sidebar */}
        <div className="p-6 border-t border-slate-50">
           <p className="text-[10px] text-slate-300 font-bold uppercase text-center">Version 3.0.1</p>
        </div>
      </aside>
    </>
  );
};