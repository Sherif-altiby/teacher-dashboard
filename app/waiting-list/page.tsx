"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Check,
  X,
  User,
  BookOpen,
  Calendar,
  ExternalLink,
  Loader2,
  ImageIcon,
  Mail,
  GraduationCap,
} from "lucide-react";
import { getWaitingList, removeItemList } from "../services/listService";
import { toast } from "sonner";
import { ListItem } from "../types";
import Image from "next/image";

export default function WaitingListPage() {
  const queryClient = useQueryClient();

  const { data: list, isLoading } = useQuery({
    queryKey: ["waiting-list"],
    queryFn: getWaitingList,
  });

  const { mutate, isPending } = useMutation({
    mutationFn: removeItemList,
    onSuccess: () => {
      toast.success("تم التفعيل بنجاح");
      queryClient.invalidateQueries({ queryKey: ["waiting-list"] });
    },
    onError: (error: any) => {
      toast.error(error.message || "حدث خطأ ما");
    },
  });

  if (isLoading)
    return (
      <div className="h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="animate-spin text-[#0066FF]" size={48} />
          <p className="text-slate-500 font-bold animate-pulse">
            جاري تحميل الطلبات...
          </p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-12" dir="rtl">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
          <div className="space-y-2">
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">
              طلبات الإنضمام
            </h1>
            <p className="text-slate-500 font-medium">
              لديك {list?.length || 0} طلبات بانتظار المراجعة حالياً
            </p>
          </div>
        </div>

        {/* List Section */}
        <div className="space-y-8">
          {list?.length > 0 ? (
            list.map((item: ListItem) => (
              <div
                key={item._id}
                className="group bg-white rounded-[2.5rem] p-2 border border-slate-100 shadow-xl shadow-slate-200/40 hover:shadow-2xl hover:shadow-blue-200/20 transition-all duration-500"
              >
                <div className="flex flex-col lg:flex-row items-stretch gap-4">
                  {/* 1. Enhanced Receipt Preview */}
                  <div className="relative overflow-hidden rounded-xl lg:w-56 h-64 lg:h-auto shrink-0">
                    <Image
                      src={item.image}
                      alt="Receipt"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      width={500}
                      height={500}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60"></div>
                    <a
                      href={item.image}
                      target="_blank"
                      className="absolute bottom-4 right-4 left-4 bg-white/20 backdrop-blur-md border border-white/30 text-white py-2.5 rounded-xl flex items-center justify-center gap-2 text-xs font-bold hover:bg-white hover:text-black transition-all"
                    >
                      <ExternalLink size={14} /> تكبير الإيصال
                    </a>
                  </div>

                  {/* 2. Main Content Info */}
                  <div className="flex-1 p-6 flex flex-col justify-between">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {/* Student Info */}
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <div className="h-12 w-12 bg-blue-50 rounded-2xl flex items-center justify-center text-[#0066FF]">
                            <User size={24} />
                          </div>
                          <div>
                            <h3 className="text-xl font-black text-slate-800">
                              {item.user.name}
                            </h3>
                            <div className="flex items-center gap-2 text-slate-400 text-sm mt-0.5">
                              <Mail size={14} />
                              {item.user.email}
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <span className="flex items-center gap-1.5 bg-slate-100 text-slate-600 px-3 py-1.5 rounded-lg text-xs font-bold">
                            <GraduationCap size={14} />
                            {item.user.level}
                          </span>
                        </div>
                      </div>

                      {/* Course Info Card */}
                      <div className="bg-slate-50/80 rounded-3xl p-4 border border-slate-100">
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">
                          الكورس المطلوب
                        </div>
                        <div className="flex items-center gap-4">
                          <Image
                            src={item?.course?.image}
                            className="w-14 h-14 rounded-2xl object-cover shadow-sm"
                            alt=""
                            width={50}
                            height={50}
                          />
                          <div>
                            <h4 className="font-black text-slate-800 text-lg leading-tight">
                              {item?.course?.title}
                            </h4>
                            <div className="flex items-center gap-1.5 text-slate-400 text-xs mt-1">
                              <Calendar size={12} />
                              {new Date(item.createdAt).toLocaleDateString(
                                "ar-EG",
                                { day: "numeric", month: "long" },
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* 3. Smarter Actions Row */}
                    <div className="mt-8 flex items-center justify-end gap-4 border-t border-slate-50 pt-6">
                      <button className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-10 py-3.5 rounded-2xl font-black shadow-lg shadow-emerald-200 hover:shadow-emerald-300 hover:-translate-y-0.5 active:translate-y-0 transition-all"
                         onClick={() => {
                            let listId = item._id;
                            let userId = item.user._id
                            mutate({listId, userId})
                         }}
                      >
                        <Check size={20} />
                        تفعيل الاشتراك الآن
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            /* Smart Empty State */
            <div className="bg-white rounded-[4rem] py-32 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 shadow-inner">
              <div className="h-24 w-24 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                <ImageIcon size={40} className="text-slate-200" />
              </div>
              <h2 className="text-2xl font-black text-slate-800">
                كل شيء هادئ هنا
              </h2>
              <p className="text-slate-400 font-medium mt-2">
                لا توجد طلبات إنضمام جديدة في الوقت الحالي
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
