"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Check,
  User,
  Calendar,
  ExternalLink,
  Loader2,
  Mail,
  GraduationCap,
  Search,
  Wallet,
  ArrowLeft,
  ArrowRight,
  Inbox,
} from "lucide-react";
import { getWaitingList, removeItemList } from "../services/listService";
import { toast } from "sonner";
import { ListItem } from "../types";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useLevelStore } from "../store/levelsStore";

// Visual identity per payment method — colors double as quick-scan status cues
const METHOD_STYLES: Record<
  string,
  { label: string; bar: string; badge: string }
> = {
  vCash: {
    label: "Vodafone Cash",
    bar: "bg-rose-500",
    badge: "bg-white/90 text-rose-600 border-rose-100",
  },
  instaPay: {
    label: "InstaPay",
    bar: "bg-violet-500",
    badge: "bg-white/90 text-violet-600 border-violet-100",
  },
};

export default function WaitingListPage() {
  const queryClient = useQueryClient();

  const [page, setPage] = useState(1);
  const limit = 10;

  const [method, setMethod] = useState<"" | "vCash" | "instaPay">("");
  const levels = useLevelStore((s) => s.levels);

  // Local input is separate from the debounced query value so we don't
  // refetch on every keystroke.
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [level, setLevel] = useState("");

  useEffect(() => {
    const id = setTimeout(() => {
      setSearch(searchInput);
      setPage(1);
    }, 350);
    return () => clearTimeout(id);
  }, [searchInput]);

  const { data: list, isLoading } = useQuery({
    // search/level were previously missing here, so changing them never
    // triggered a refetch unless `page` also happened to change.
    queryKey: ["waiting-list", page, method, search, level],
    queryFn: () =>
      getWaitingList({
        page,
        limit,
        method,
        search,
        level,
      }),
  });

  const { mutate, isPending, variables } = useMutation({
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
      <div className="h-screen flex items-center justify-center bg-[#F5F6F8]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="animate-spin text-[#14213D]" size={44} strokeWidth={2.5} />
          <p className="text-slate-500 text-sm font-bold animate-pulse">
            جاري تحميل الطلبات...
          </p>
        </div>
      </div>
    );

  const total = list?.lists?.length || 0;

  return (
    <div className="min-h-screen bg-[#F5F6F8] p-4 md:p-12" dir="rtl">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-5">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-black text-[#14213D] tracking-tight">
                طلبات الإنضمام
              </h1>
              <span className="flex items-center justify-center h-7 min-w-7 px-2 rounded-full bg-[#14213D] text-white text-xs font-black tabular-nums">
                {total}
              </span>
            </div>
            <p className="text-slate-500 text-sm font-medium">
              بانتظار مراجعة إيصال الدفع وتفعيل الاشتراك
            </p>
          </div>
        </div>

        {/* Toolbar: search + filters */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 space-y-4">
          <div className="relative">
            <Search
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
              size={18}
            />
            <input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="ابحث بالاسم أو البريد الإلكتروني..."
              className="w-full pl-4 pr-12 py-3 rounded-xl border border-slate-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#14213D]/15 focus:border-[#14213D]/30 transition-shadow"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-bold text-slate-400 ml-1">
              طريقة الدفع
            </span>
            <button
              onClick={() => {
                setMethod("");
                setPage(1);
              }}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#14213D]/30 ${
                method === ""
                  ? "bg-[#14213D] text-white"
                  : "bg-slate-50 text-slate-600 hover:bg-slate-100"
              }`}
            >
              الكل
            </button>
            <button
              onClick={() => {
                setMethod("vCash");
                setPage(1);
              }}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-300 ${
                method === "vCash"
                  ? "bg-rose-600 text-white"
                  : "bg-slate-50 text-slate-600 hover:bg-slate-100"
              }`}
            >
              <Wallet size={13} /> Vodafone Cash
            </button>
            <button
              onClick={() => {
                setMethod("instaPay");
                setPage(1);
              }}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300 ${
                method === "instaPay"
                  ? "bg-violet-600 text-white"
                  : "bg-slate-50 text-slate-600 hover:bg-slate-100"
              }`}
            >
              <Wallet size={13} /> InstaPay
            </button>
          </div>

          {levels.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-slate-50">
              <span className="text-[11px] font-bold text-slate-400 ml-1">
                المستوى
              </span>
              <button
                onClick={() => {
                  setLevel("");
                  setPage(1);
                }}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#14213D]/30 ${
                  level === ""
                    ? "bg-[#14213D] text-white"
                    : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                }`}
              >
                كل المستويات
              </button>
              {levels.map((l) => (
                <button
                  key={l._id}
                  onClick={() => {
                    setLevel(l._id);
                    setPage(1);
                  }}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300 ${
                    level === l._id
                      ? "bg-blue-600 text-white"
                      : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  {l.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* List */}
        <div className="space-y-6 mt-8">
          {list?.lists?.length > 0 ? (
            <>
              {list.lists.map((item: ListItem) => {
                const methodStyle = METHOD_STYLES[(item as any).method];
                const isThisPending =
                  isPending && (variables as any)?.userId === item.user._id;

                return (
                  <div
                    key={item._id}
                    className="group relative bg-white rounded-2xl border border-slate-100 shadow-md shadow-slate-200/40 hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 overflow-hidden"
                  >
                    {/* status spine — color carries payment-method info */}
                    <div
                      className={`absolute top-0 right-0 bottom-0 w-1.5 ${
                        methodStyle?.bar || "bg-slate-200"
                      }`}
                    />

                    <div className="flex flex-col lg:flex-row items-stretch">
                      {/* Receipt thumbnail */}
                      <div className="relative lg:w-52 h-56 lg:h-auto shrink-0 m-3 rounded-xl overflow-hidden">
                        <Image
                          src={item.image}
                          alt="إيصال الدفع"
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          width={500}
                          height={500}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/0 to-transparent" />
                        {methodStyle && (
                          <span
                            className={`absolute top-3 right-3 text-[10px] font-black px-2.5 py-1 rounded-full border ${methodStyle.badge}`}
                          >
                            {methodStyle.label}
                          </span>
                        )}
                        <a
                          href={item.image}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="absolute bottom-3 right-3 left-3 bg-white/15 backdrop-blur-md border border-white/25 text-white py-2.5 rounded-lg flex items-center justify-center gap-2 text-[11px] font-bold hover:bg-white hover:text-[#14213D] transition-all"
                        >
                          <ExternalLink size={14} /> تكبير الإيصال
                        </a>
                      </div>

                      {/* Perforated divider — receipt-stub motif, desktop only */}
                      <div className="hidden lg:flex flex-col items-center w-6 py-4 shrink-0">
                        <span className="h-3 w-3 rounded-full bg-[#F5F6F8] border border-slate-200 shrink-0" />
                        <span className="flex-1 w-px border-r border-dashed border-slate-200 my-1" />
                        <span className="h-3 w-3 rounded-full bg-[#F5F6F8] border border-slate-200 shrink-0" />
                      </div>

                      {/* Details */}
                      <div className="flex-1 p-6 flex flex-col justify-between min-w-0">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* Student */}
                          <div className="space-y-3 min-w-0">
                            <div className="flex items-center gap-3">
                              <div className="h-11 w-11 shrink-0 bg-slate-50 rounded-xl flex items-center justify-center text-[#14213D]">
                                <User size={20} />
                              </div>
                              <div className="min-w-0">
                                <h3 className="text-sm font-black text-slate-800 truncate">
                                  {item.user.name}
                                </h3>
                                <div className="flex items-center gap-1.5 text-slate-400 text-xs mt-0.5 min-w-0">
                                  <Mail size={13} className="shrink-0" />
                                  <span className="truncate">{item.user.email}</span>
                                </div>
                              </div>
                            </div>
                            <span className="inline-flex items-center gap-1.5 bg-slate-50 text-slate-600 px-3 py-1.5 rounded-lg text-[11px] font-bold">
                              <GraduationCap size={14} />
                              {item.user.level}
                            </span>
                          </div>

                          {/* Course */}
                          <div className="bg-[#F5F6F8] rounded-2xl p-4 border border-slate-100">
                            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">
                              الكورس المطلوب
                            </div>
                            <div className="flex items-center gap-3">
                              <Image
                                src={item?.course?.image}
                                className="w-12 h-12 rounded-xl object-cover shadow-sm shrink-0"
                                alt=""
                                width={48}
                                height={48}
                              />
                              <div className="min-w-0">
                                <h4 className="font-black text-slate-800 text-sm leading-tight truncate">
                                  {item?.course?.title}
                                </h4>
                                <div className="flex items-center gap-1.5 text-slate-400 text-[11px] mt-1 tabular-nums">
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

                        <div className="mt-6 flex items-center justify-end gap-3 border-t border-slate-50 pt-5">
                          <button
                            disabled={isThisPending}
                            className="flex items-center gap-2 bg-gradient-to-l from-emerald-500 to-teal-600 text-white px-7 py-3 rounded-xl text-sm font-black shadow-md shadow-emerald-200 hover:shadow-lg hover:shadow-emerald-200/70 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-60 disabled:cursor-not-allowed disabled:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 transition-all"
                            onClick={() => {
                              const courseId = item.course._id;
                              const userId = item.user._id;
                              mutate({ courseId, userId });
                            }}
                          >
                            {isThisPending ? (
                              <Loader2 size={17} className="animate-spin" />
                            ) : (
                              <Check size={17} />
                            )}
                            {isThisPending ? "جارٍ التفعيل..." : "تفعيل الاشتراك الآن"}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Moved outside the .map — previously this rendered once per
                  item instead of once for the whole list. */}
              {list?.pagination?.pages > 1 && (
                <div className="flex items-center justify-center gap-3 pt-4">
                  <button
                    disabled={page === 1}
                    onClick={() => setPage((prev) => prev - 1)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 bg-white text-sm font-bold text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#14213D]/20 transition-colors"
                  >
                    <ArrowRight size={15} /> السابق
                  </button>

                  <span className="font-bold text-slate-700 text-sm tabular-nums px-2">
                    صفحة {list.pagination.page} من {list.pagination.pages}
                  </span>

                  <button
                    disabled={page >= list.pagination.pages}
                    onClick={() => setPage((prev) => prev + 1)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 bg-white text-sm font-bold text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#14213D]/20 transition-colors"
                  >
                    التالي <ArrowLeft size={15} />
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="bg-white rounded-[2.5rem] py-28 flex flex-col items-center justify-center border border-slate-100 shadow-sm">
              <div className="h-20 w-20 bg-[#F5F6F8] rounded-full flex items-center justify-center mb-6">
                <Inbox size={32} className="text-slate-300" />
              </div>
              <h2 className="text-base font-black text-slate-800">
                لا توجد طلبات تحتاج مراجعة الآن
              </h2>
              <p className="text-slate-400 text-sm font-medium mt-2 text-center max-w-xs">
                بمجرد أن يرسل أحد الطلاب إيصال دفع جديد، سيظهر هنا فوراً
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}