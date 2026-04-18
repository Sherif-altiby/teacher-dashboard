"use client"

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { MoreVertical, Edit, Trash2, Eye } from "lucide-react";
import { Course } from "@/app/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteCourse } from "@/app/services/coursesService";
import { toast } from "sonner";
import UpdateCourseModel from "./UpdateCourseModel";

const CourseCard = ({ course, }: { course: Course, }) => {
  const [showMenu, setShowMenu] = useState(false);
  const hasOffer = course.offer > 0;
  const finalPrice = hasOffer ? course.price - course.offer : course.price;

  const [showUpdateCourse, setShowUpdateCourse] = useState(false);

  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: deleteCourse,
    onSuccess: () => {
      toast.success("تم خذف الكورس بنجاح");
      queryClient.invalidateQueries({ queryKey: ["teacher-courses"] });
    },
    onError: (error: any) => {
      toast.error(error.message || "حدث خطأ ما");
    },
  });


  return (
    <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 group relative">
      {showUpdateCourse && <UpdateCourseModel course={course} subjectId={course.subject._id} setShowUpdateCourse={setShowUpdateCourse} showUpdateCourse={showUpdateCourse} />}

      <div className="relative h-52 w-full rounded-xl overflow-hidden mb-5">
        <Image
          src={course.image}
          alt={course.title}
          width={200}
          height={200}
          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-700"
        />

        {/* Three Dots Menu Button */}
        <div className="absolute top-3 left-3 z-10">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="bg-white/90 backdrop-blur-md p-2 rounded-xl text-slate-700 hover:text-[#0066FF] transition-colors shadow-sm"
          >
            <MoreVertical size={18} />
          </button>

          {/* Dropdown Menu */}
          {showMenu && (
            <div className="absolute top-12 left-0 w-40 bg-white rounded-2xl shadow-2xl border border-slate-50 p-2 z-20 animate-in fade-in zoom-in duration-200">
             
              <button className="w-full flex items-center justify-end gap-2 px-3 py-2 hover:bg-red-50 rounded-lg text-xs font-bold text-red-500"
                onClick={() => {
                  mutate(course._id)
                }}
              >
                <span> {isPending ? "جاري الحذف ...." : "حذف"} </span>
                <Trash2 size={14} />
              </button>
            </div>
          )}
        </div>

        {/* Level Badge (Top Right) */}
        <div className="absolute top-3 right-3 bg-[#0066FF] px-4 py-1.5 rounded-xl text-[10px] font-black text-white shadow-lg">
          {course.level}
        </div>

        {/* Offer Percentage (Bottom Right) */}
        {hasOffer && (
          <div className="absolute bottom-3 right-3 bg-red-500 text-white px-3 py-1.5 rounded-xl text-xs font-bold animate-pulse">
            خصم {course.offer} ج.م
          </div>
        )}
      </div>

      {/* 2. Content Info */}
      <div className="px-1 text-right" dir="rtl">
        <p className="text-[#0066FF] text-[11px] font-bold mb-1 opacity-80 uppercase tracking-wider">
          {course.subject.name}
        </p>

          <h3 className="text-lg font-black text-slate-900 mb-3 leading-tight hover:text-[#0066FF] transition-colors cursor-pointer">
            {course.title}
          </h3>

        {/* 3. Pricing Section */}
        <div className="flex items-center justify-start flex-row-reverse gap-3 mb-2">
          {hasOffer ? (
            <>
              <span className="text-2xl font-black text-slate-900">
                {finalPrice}{" "}
                <span className="text-sm font-medium text-slate-500">ج.م</span>
              </span>
              <span className="text-slate-400 line-through text-xs font-bold decoration-red-400">
                {course.price} ج.م
              </span>
            </>
          ) : (
            <span className="text-2xl font-black text-slate-900">
              {course.price}{" "}
              <span className="text-sm font-medium text-slate-500">ج.م</span>
            </span>
          )}
        </div>

        {/* Footer: Link Button */}
        <div className="mt-4 pt-4 border-t border-slate-50 flex items-center justify-between">
          <Link
            href={`/lessons/${course._id}?subject=${course.subject._id}`}
            className="bg-slate-50 text-slate-900 px-4 py-2 rounded-xl text-xs font-bold hover:bg-[#0066FF] hover:text-white transition-all flex items-center gap-2"
          >
            <Eye size={14} />
            <span>تفاصيل الكورس</span>
          </Link>
        </div>
      </div>

      {/* Click outside overlay to close menu */}
      {showMenu && (
        <div className="fixed inset-0 z-0" onClick={() => setShowMenu(false)} />
      )}
    </div>
  );
};

export default CourseCard;
