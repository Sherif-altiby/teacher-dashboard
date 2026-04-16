  "use client";

import { Home, Bell, Menu } from "lucide-react";
import NavLink from "./Navlink";
import { useAuthStore } from "@/app/store/authStore";
import Image from "next/image";
import { useLevelStore } from "@/app/store/levelsStore";
import { useEffect } from "react";
import { useShowStore } from "@/app/store/showMenuStore";
import Link from "next/link";

export const Navbar = () => {
  const user = useAuthStore((state) => state.user);
  const fetchLevels = useLevelStore((state) => state.fetchLevels);

  const setShow = useShowStore(s => s.setShow)

  useEffect(() => {
    fetchLevels();
  }, [fetchLevels]);

  return (
    <nav className="h-18  bg-white/80 backdrop-blur-md border-b border-border sticky top-0 z-50 shadow-navbar">
      <div className="flex items-center justify-between h-full main-container">
        <Link href={'/profile'} className="flex items-center gap-3 ps-2 group cursor-pointer">
          <div className="text-end hidden sm:block">
            <p className="text-sm font-bold text-text-main group-hover:text-accent transition-colors">
              {user?.name || "Teacher Name"}
            </p>
          </div>

          <div className="relative">
            <div className="w-10 h-10 rounded-full border-2 border-white ring-2 ring-accent/10 overflow-hidden shadow-sm transition-transform group-hover:scale-105">
              <Image
                src={user?.avatar || "/default-avatar.png"}
                alt="Teacher Profile"
                width={40}
                height={40}
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            {/* Status Online Indicator */}
            <div className="absolute bottom-0 inset-e-0 w-3 h-3 bg-success border-2 border-white rounded-full" />
          </div>
        </Link>
        <div className="flex items-center gap-2 ">
          <NavLink icon={Home} href="/" />
          <NavLink icon={Bell} href="/notifications" />
          <div className="p-2.5 rounded-xl cursor-pointer block xl:hidden text-nav-icon hover:bg-slate-100 hover:text-text-main transition-all active:scale-95"
            onClick={() => setShow(true)}
          >
            <Menu size={22} strokeWidth={2} />
          </div>
        </div>
      </div>
    </nav>
  );
};
