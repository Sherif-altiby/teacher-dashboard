import { ChevronLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const SubjectCard = ({
  image,
  title,
  subId,
}: {
  image: string;
  title: string;
  subId: string;
}) => {
  return (
    <Link
      href={`/subjects/${subId}`}
      className="group relative h-70 w-full rounded-3xl overflow-hidden bg-slate-900 shadow-2xl transition-all duration-500 hover:-translate-y-3 hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.4)] cursor-pointer"
    >
      <Image
        src={image}
        alt={title}
        width={40}
        height={40}
        className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-110 group-hover:opacity-40 transition-all duration-700 ease-out"
      />

      <div className="absolute inset-0 bg-linear-to-t from-slate-900 via-slate-900/20 to-transparent opacity-90" />
      <div className="absolute inset-0 bg-linear-to-b from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

      <div className="absolute bottom-0 inset-x-0 p-8 z-10 text-right">
        <div className="h-1 w-12 rounded-full mb-4 transition-all duration-500 group-hover:w-full" />

        <h3 className="text-2xl font-black text-white mb-2 leading-tight drop-shadow-lg">
          {title}
        </h3>

        <div className="flex items-center justify-end gap-2 text-white font-bold text-sm group-hover:text-white/80 transition-colors">
          <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            التفاصيل
          </span>
          <div className="p-2 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 group-hover:bg-white group-hover:text-slate-900 transition-all duration-300">
            <ChevronLeft size={18} />
          </div>
        </div>
      </div>
    </Link>
  );
};

export default SubjectCard;
