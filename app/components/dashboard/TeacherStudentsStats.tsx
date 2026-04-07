import TeacherStudentsStatsSkeleton from "@/app/skeleton/TeacherStudentsStatsSkeleton";
import { ArrowUpRight, Users } from "lucide-react";
 
const TeacherStudentsStats = () => {

  // <TeacherStudentsStatsSkeleton />
  return (
    <div className="relative overflow-hidden bg-slate-900 rounded-[2.5rem] p-8 text-white rounded-xl shadow-slate-200 group transition-all ">
      <div className="relative z-10 flex flex-col h-full justify-between">
        <div className="flex justify-between items-start">
          <div className="h-12 w-12 bg-white/10 backdrop-blur-lg rounded-2xl flex items-center justify-center">
            <Users size={24} className="text-blue-400" />
          </div>
          <span className="text-[10px] font-black bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full border border-blue-500/30 uppercase tracking-tighter">
            إجمالي الوصول
          </span>
        </div>
        <div className="mt-8">
          <h3 className="text-5xl font-black tracking-tighter">
            {/* {stats.totalStudents.toLocaleString('ar-EG')} */}
          </h3>
          <p className="text-slate-400 font-bold mt-2 flex items-center gap-2">
            طالب ملتحق ببرامجك{" "}
            <ArrowUpRight size={14} className="text-emerald-400" />
          </p>
        </div>
      </div>
      {/* Decorative background glow */}
      <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-600/20 rounded-full blur-[80px]" />
    </div>
  );
};

export default TeacherStudentsStats;
