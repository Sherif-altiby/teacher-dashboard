"use client";

import { MENUITEMS } from "@/app/constants";
import { useShowStore } from "@/app/store/showMenuStore";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const Sidebar = () => {
  const { show, setShow } = useShowStore();
  const pathname = usePathname();

  return (
    <>
      {/* 1. Overlay for small screens */}
      {show && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 xl:hidden transition-all duration-300 animate-fade-in"
          onClick={() => setShow(false)}
        />
      )}

      {/* 2. Main Sidebar */}
      <aside
        className={`fixed top-0 bottom-0 right-0 z-50 xl:relative xl:z-0 xl:flex flex-col overflow-hidden h-full w-72 bg-white border border-slate-100 shadow-xl shadow-slate-200/50 rounded-l-3xl xl:rounded-3xl transition-all duration-300 ease-in-out
          ${show ? 'translate-x-0' : 'translate-x-full xl:translate-x-0'}
        `}
      >


        {/* Navigation Links container */}
        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-1.5 scrollbar-thin">
          <nav className="space-y-1.5">
            {MENUITEMS.map((item) => {
              const isActive = pathname === item.link;

              return (
                <Link
                  key={item.name}
                  href={item.link}
                  onClick={() => setShow(false)}
                  className={`
                    group relative w-full flex items-center gap-3.5 px-5 py-3.5 rounded-xl transition-all duration-200 active:scale-[0.98]
                    ${isActive
                      ? "bg-[#5700FF] text-white shadow-md shadow-[#5700FF]/20 font-bold"
                      : "text-slate-500 hover:bg-slate-50 hover:text-[#5700FF] font-medium"}
                  `}
                >
                  {/* Left Active indicator pill */}
                  <span
                    className={`absolute right-2 top-1/2 -translate-y-1/2 w-1 h-5 rounded-full bg-white transition-all duration-300 origin-center
                      ${isActive ? 'scale-y-100 opacity-100' : 'scale-y-0 opacity-0 group-hover:scale-y-70 group-hover:opacity-40 group-hover:bg-[#5700FF]'}
                    `}
                  />

                  {/* Icon */}
                  <item.icon
                    size={20}
                    strokeWidth={isActive ? 2.5 : 2}
                    className={`transition-all duration-200 shrink-0
                      ${isActive ? "text-white scale-105" : "text-slate-400 group-hover:text-[#5700FF] group-hover:scale-105"}
                    `}
                  />

                  {/* Text Label */}
                  <span className={`text-sm transition-colors duration-200 pr-1
                    ${isActive ? "text-white" : "text-slate-600 group-hover:text-[#5700FF]"}
                  `}>
                    {item.name}
                  </span>
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>
    </>
  );
};