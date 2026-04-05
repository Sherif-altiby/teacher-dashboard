import { API } from "@/app/constants";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Edit3, Play, Trash2 } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";

const LessonCard = ({ lesson }: { lesson: any }) => {
      const queryClient = useQueryClient();

  const getYouTubeThumbnail = (url: string) => {
    const videoId = url.split("v=")[1]?.split("&")[0] || url.split("/").pop();
    return `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
  };

   const { mutate, isPending } = useMutation({
       mutationFn: async () => {
           const res = await fetch(`${API}/teacher/delete-lesson/${lesson._id}`, {
               method: "DELETE",
               credentials: "include",
           });
           const data = await res.json();
           if (!res.ok) throw new Error(data.message || "حدث خطأ");
           return data.data;
       },
       onSuccess: () => {
         toast.success("تمت إضافة الدرس بنجاح");
         // Refetch the lessons list to show the new card immediately
         queryClient.invalidateQueries({ queryKey: ["lessons"] });
        },
       onError: (error: any) => {
         toast.error(error.message || "حدث خطأ أثناء الإضافة");
       },
     });


  return (
    <div className="bg-white rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-sm hover:shadow-md transition-all group">
      {/* Thumbnail Section */}
      <div className="relative aspect-video w-full overflow-hidden bg-slate-200">
        <Image
          src={getYouTubeThumbnail(lesson.videoUrl)}
          alt={lesson.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          width={500}
          height={500}
        />
        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/30 transition-colors flex items-center justify-center">
          <Play size={32} className="text-white/80" fill="white" />
        </div>
      </div>

      {/* Content Section */}
      <div className="p-7">
        <h3 className="font-black text-slate-800 text-xl mb-2 line-clamp-1">
          {lesson.title}
        </h3>
        <p className="text-slate-500 text-sm line-clamp-2 leading-relaxed mb-4">
          {lesson.description}
        </p>

        {/* Management Buttons Row */}
        <div className="grid grid-cols-2 gap-3 pt-6 border-t border-slate-50">
          <button className="flex items-center justify-center gap-2 py-3 rounded-xl bg-blue-50 text-[#0066FF]  text-sm hover:bg-[#0066FF] hover:text-white transition-all">
            <Edit3 size={16} />
            تعديل
          </button>
          <button
            onClick={() => mutate()}
            className="flex items-center justify-center gap-2 py-3 rounded-xl bg-red-50 text-red-600  text-sm hover:bg-red-600 hover:text-white transition-all"
         
         >
            <Trash2 size={16} />
            {isPending ? "جاري الحذف..." : "حذف"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LessonCard;
