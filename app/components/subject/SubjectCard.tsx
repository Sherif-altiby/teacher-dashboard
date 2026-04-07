import { ChevronLeft, BookOpen } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface SubjectCardProps {
  image: string;
  title: string;
  subId: string;
  courseCount?: number; // Added a smart count badge
}

const SubjectCard = ({ image, title, subId, courseCount = 0 }: SubjectCardProps) => {
  return (
    <Link
      href={`/subjects/${subId}`}
      className="group relative block h-[320px] w-full rounded-[2rem] overflow-hidden bg-slate-900 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)]"
    >
      <Image
        src={image}
        alt={title}
        fill
        className="object-cover opacity-70 grayscale-[20%] group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700 ease-in-out"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
      
      <div className="absolute inset-0 border-[1px] border-white/10 rounded-[2rem] pointer-events-none group-hover:border-white/20 transition-colors" />

      <div className="absolute top-5 right-5 z-10">
        <div className="flex items-center gap-2 px-3 py-1.5 bg-black/30 backdrop-blur-md rounded-full border border-white/10 text-white/90 text-xs font-bold">
          <BookOpen size={14} className="text-indigo-400" />
          <span>{courseCount} كورس</span>
        </div>
      </div>

      <div className="absolute bottom-0 inset-x-0 p-6 z-10">
        <div className="h-[2px] w-8 bg-indigo-500 mb-3 rounded-full transition-all duration-500 group-hover:w-16" />

        <h3 className="text-2xl font-black text-white mb-4 tracking-tight drop-shadow-md">
          {title}
        </h3>

        <div className="flex items-center justify-between">
          <span className="text-white/0 group-hover:text-white/70 text-sm font-medium transition-all duration-500 -translate-x-4 group-hover:translate-x-0">
            اكتشف المحتوى
          </span>

          <div className="flex items-center justify-center h-11 w-11 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 text-white shadow-xl group-hover:bg-indigo-600 group-hover:border-indigo-400 group-hover:scale-110 transition-all duration-300">
            <ChevronLeft size={22} className="group-hover:-translate-x-1 transition-transform" />
          </div>
        </div>
      </div>

      <div className="absolute -bottom-10 inset-x-0 h-20 bg-indigo-500/20 blur-[60px] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    </Link>
  );
};

export default SubjectCard;