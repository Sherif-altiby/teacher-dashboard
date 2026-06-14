import Image from "next/image";
import {
  Mail,
  Phone,
  AlignRight,
  Camera,
  Save,
  Loader2,
  User2,
} from "lucide-react";
import { useAuthStore } from "@/app/store/authStore";
import { useMutation, useQuery } from "@tanstack/react-query";
import { API } from "@/app/constants";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { teacherUpdateAvatar } from "@/app/services/TeacherServices";
import { User } from "@/app/types";
import { getTeacherMe } from "@/app/services/authService";

interface UserUpdateDetails {
  name: string;
  email: string;
  about: string;
  phone: string;
  vCashNumber: string;
  vCashName: string;
  instaNumber: string;
  instaName: string;
}

const UpdatTeacherData = () => {
  const { user, setAuth } = useAuthStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [userDetails, setUserDetails] = useState({
    name: user?.name || "",
    email: user?.email || "",
    about: user?.about || "",
    phone: user?.phone || "",

    vCashNumber: user?.vCash?.number || "",
    vCashName: user?.vCash?.walletName || "",

    instaNumber: user?.instaPay?.number || "",
    instaName: user?.instaPay?.instaPayName || "",
  });


  const { data } = useQuery({
    queryKey: ["teacher-me"],
    queryFn: getTeacherMe,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: true,
  });

  useEffect(() => {
    if (data) {
      setAuth(data);

      setUserDetails({
        name: data.name,
        email: data.email,
        about: data.about,
        phone: data.phone,

        vCashNumber: data?.vCash?.number,
        vCashName: data?.vCash?.walletName,

        instaNumber: data?.instaPay?.number,
        instaName: data?.instaPay?.instaPayName,
      });
    }
  }, [data])


  const { mutate, isPending } = useMutation({
    mutationFn: async (updatedData: UserUpdateDetails) => {
      const response = await fetch(`${API}/teacher/change-data`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(updatedData),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "خطأ");
      return result;
    },
    onSuccess: (result) => {
      toast.success("تم التحديث");
      setAuth({ ...user, ...result.data });
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!userDetails.name || !userDetails.email) {
      return toast.error("يرجى ملء الحقول الأساسية");
    }



    mutate(userDetails);
  };

  const { mutate: uploadAvatar, isPending: isAvatarPending } = useMutation({
    mutationFn: teacherUpdateAvatar,
    onSuccess: (res) => {
      if (res.status) {
        toast.success("تم تحديث الصورة الشخصية بنجاح");

        const newUser = { ...user, avatar: res.data.avatar } as User
        setAuth(newUser)

      } else {
        toast.error(res.message || "فشل رفع الصورة");
      }
    },
    onError: () => {
      toast.error("حدث خطأ في الاتصال بالخادم");
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        return toast.error("حجم الصورة كبير جداً، الحد الأقصى 2 ميجابايت");
      }
      uploadAvatar(file);
    }
  };

  return (
    <div className="max-w-4xl mx-auto ">
      <div className="lg:col-span-9">
        <form
          onSubmit={handleSubmit}
          className="bg-white border border-slate-200 rounded-[2.5rem]  overflow-hidden"
        >
          {/* Header / Avatar */}
          <div className="bg-slate-50/50 p-3 md:p-8 border-b border-slate-100 flex flex-col md:flex-row items-center gap-6">
            {/* قسم الصورة */}
            <div className="relative group">
              <div className="w-16 h-16 md:w-24 md:h-24 rounded-xl md:rounded-3xl overflow-hidden border-4 border-white shadow-md relative bg-slate-200">
                <Image
                  src={user?.avatar || "/default-avatar.png"}
                  alt="Profile"
                  className={`w-full h-full object-cover transition-opacity ${isPending ? "opacity-40" : "opacity-100"}`}
                  width={100}
                  height={100}
                />


              </div>

              {/* حقل اختيار الملف المخفي */}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
              />

              {/* زر الكاميرا */}
              <button
                type="button"
                disabled={isAvatarPending}
                onClick={() => fileInputRef.current?.click()}
                className="absolute -bottom-2 -left-2 p-2 bg-white rounded-xl shadow-lg border border-slate-100 text-blue-600 hover:scale-110 active:scale-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isAvatarPending ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Camera size={16} />
                )}
              </button>
            </div>

            {/* النصوص */}
            <div className="text-center md:text-right">
              <h2 className="md:text-lg text-base font-black text-slate-900">
                إعدادات الحساب
              </h2>
              <p className="text-slate-400 text-[10px] md:text-xs font-medium">
                قم بتحديث معلوماتك الشخصية وصورتك العامة
              </p>
            </div>
          </div>

          {/* Form Fields Section */}
          <div className="p-4 md:p-12 grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-8">
            {/* Name Field */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 px-1 uppercase tracking-widest">
                الأسم الكامل
              </label>
              <div className="relative">
                <User2
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300"
                  size={18}
                />
                <input
                  type="text"
                  value={userDetails.name}
                  onChange={(e) =>
                    setUserDetails({ ...userDetails, name: e.target.value })
                  }
                  className="w-full bg-slate-50 border-none rounded-2xl py-3.5 pr-12 pl-4 text-slate-700 text-sm font-bold focus:ring-2 focus:ring-blue-100 transition-all outline-none"
                />
              </div>
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 px-1 uppercase tracking-widest">
                البريد الإلكتروني
              </label>
              <div className="relative">
                <Mail
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300"
                  size={18}
                />
                <input
                  type="email"
                  value={userDetails.email}
                  onChange={(e) =>
                    setUserDetails({ ...userDetails, email: e.target.value })
                  }
                  className="w-full bg-slate-50 border-none rounded-2xl py-3.5 pr-12 pl-4 text-slate-700 text-sm font-bold focus:ring-2 focus:ring-blue-100 transition-all outline-none"
                />
              </div>
            </div>

            {/* Phone Field */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 px-1 uppercase tracking-widest">
                رقم الهاتف
              </label>
              <div className="relative">
                <Phone
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300"
                  size={18}
                />
                <input
                  type="text"
                  value={userDetails.phone}
                  onChange={(e) =>
                    setUserDetails({ ...userDetails, phone: e.target.value })
                  }
                  className="w-full bg-slate-50 border-none rounded-2xl py-3.5 pr-12 pl-4 text-slate-700 text-sm font-bold focus:ring-2 focus:ring-blue-100 transition-all outline-none text-left"
                  dir="ltr"
                />
              </div>
            </div>

            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* vCash Number */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase">
                  رقم Vodafone Cash
                </label>
                <input
                  type="text"
                  value={userDetails.vCashNumber}
                  onChange={(e) =>
                    setUserDetails({
                      ...userDetails,
                      vCashNumber: e.target.value,
                    })
                  }
                  className="w-full bg-slate-50 rounded-2xl py-3 px-4 text-sm font-bold"
                />
              </div>

              {/* vCash Name */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase">
                  اسم المحفظة
                </label>
                <input
                  type="text"
                  value={userDetails.vCashName}
                  onChange={(e) =>
                    setUserDetails({
                      ...userDetails,
                      vCashName: e.target.value,
                    })
                  }
                  className="w-full bg-slate-50 rounded-2xl py-3 px-4 text-sm font-bold"
                />
              </div>
            </div>

            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              {/* Insta Number */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase">
                  رقم InstaPay
                </label>
                <input
                  type="text"
                  value={userDetails.instaNumber}
                  onChange={(e) =>
                    setUserDetails({
                      ...userDetails,
                      instaNumber: e.target.value,
                    })
                  }
                  className="w-full bg-slate-50 rounded-2xl py-3 px-4 text-sm font-bold"
                />
              </div>

              {/* Insta Name */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase">
                  اسم InstaPay
                </label>
                <input
                  type="text"
                  value={userDetails.instaName}
                  onChange={(e) =>
                    setUserDetails({
                      ...userDetails,
                      instaName: e.target.value,
                    })
                  }
                  className="w-full bg-slate-50 rounded-2xl py-3 px-4 text-sm font-bold"
                />
              </div>
            </div>

            {/* About Field */}
            <div className="md:col-span-2 space-y-2">
              <div className="flex justify-between items-end px-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  نبذة عنك
                </label>
                <span className="text-[9px] text-slate-300 font-bold">
                  {userDetails.about?.length || 0} / 200
                </span>
              </div>
              <div className="relative">
                <AlignRight
                  className="absolute right-4 top-5 text-slate-300"
                  size={18}
                />
                <textarea
                  rows={10}
                  value={userDetails.about}
                  onChange={(e) =>
                    setUserDetails({ ...userDetails, about: e.target.value })
                  }
                  className="w-full bg-slate-50 border-none rounded-2xl py-3.5 pr-12 pl-4 text-slate-700 text-sm font-bold focus:ring-2 focus:ring-blue-100 transition-all outline-none resize-none"
                  placeholder="اكتب نبذة مختصرة عن أسلوبك في التدريس..."
                />
              </div>
            </div>
          </div>

          {/* Footer Action */}
          <div className="bg-slate-50/50 p-8 flex justify-end gap-4 border-t border-slate-100">
            <button
              type="submit"
              disabled={isPending}
              className="flex items-center gap-2 px-8 py-3 bg-slate-900 text-white rounded-2xl text-sm font-black shadow-lg shadow-slate-200 hover:bg-blue-600 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending ? (
                <Loader2 className="animate-spin" size={16} />
              ) : (
                <Save size={16} />
              )}
              {isPending ? "جاري الحفظ..." : "حفظ التغييرات"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdatTeacherData;
