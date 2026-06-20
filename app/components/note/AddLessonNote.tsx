"use client";

import { useRef, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2, UploadCloud, X } from "lucide-react";
import { uploadPdfService } from "@/app/services/noteServices";

interface Props {
    lesson: any;
    setShowAddNote: (v: boolean) => void;
}

export default function AddLessonNote({
    lesson,
    setShowAddNote,
}: Props) {

    const fileRef = useRef<HTMLInputElement>(null);

    const [title, setTitle] = useState("");
    const [pdf, setPdf] = useState<File | null>(null);


    const { mutate, isPending } = useMutation({
        mutationFn: uploadPdfService,

        onSuccess: () => {
            toast.success("تم رفع المذكرة بنجاح");
            setShowAddNote(false);
        },

        onError: (err: any) => {
            toast.error(err.message);
        },
    });


    const handleSubmit = () => {

        if (!title.trim())
            return toast.error("أدخل عنوان المذكرة");

        if (!pdf)
            return toast.error("اختر ملف PDF");


        const formData = new FormData();

        formData.append("title", title);

        formData.append(
            "levelId",
            lesson.level
        );

        formData.append(
            "subjectId",
            lesson.subject
        );

        formData.append(
            "courseId",
            lesson.course
        );

        formData.append(
            "lessonId",
            lesson._id
        );

        formData.append(
            "pdf",
            pdf
        );


        mutate(formData);

    };


    return (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">

            <div className="relative w-full max-w-md rounded-3xl bg-white shadow-2xl p-6">

                {/* Close Button */}
                <button
                    onClick={() => setShowAddNote(false)}
                    className="absolute left-5 top-5 h-9 w-9 rounded-full bg-gray-100 flex items-center justify-center hover:bg-red-100 transition"
                >
                    <X size={18} />
                </button>

                {/* Header */}
                <div className="mb-6">

                    <h2 className="text-2xl font-bold text-gray-900">
                        إضافة مذكرة
                    </h2>

                    <p className="text-sm text-gray-500 mt-1">
                        قم برفع ملف PDF وإضافة عنوان مناسب للمذكرة
                    </p>

                </div>

                {/* Title */}
                <div className="mb-4">

                    <label className="block mb-2 text-sm font-medium text-gray-700">
                        عنوان المذكرة
                    </label>

                    <input
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="مثال: مذكرة الوحدة الأولى"
                        className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                    />

                </div>

                {/* Hidden Input */}
                <input
                    type="file"
                    accept=".pdf"
                    ref={fileRef}
                    onChange={(e) => {
                        if (e.target.files?.[0]) {
                            setPdf(e.target.files[0]);
                        }
                    }}
                    className="hidden"
                />

                {/* Upload Area */}
                <button
                    onClick={() => fileRef.current?.click()}
                    className="w-full rounded-2xl border-2 border-dashed border-blue-300 bg-blue-50 p-6 transition hover:bg-blue-100 hover:border-blue-500"
                >

                    <div className="flex flex-col items-center gap-3">

                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white shadow">

                            <UploadCloud
                                size={28}
                                className="text-blue-600"
                            />

                        </div>

                        {
                            pdf
                                ?
                                <>
                                    <p className="font-semibold text-gray-800">
                                        {pdf.name}
                                    </p>

                                    <span className="text-xs text-green-600">
                                        تم اختيار الملف بنجاح
                                    </span>
                                </>
                                :
                                <>
                                    <p className="font-semibold text-gray-800">
                                        اختر ملف PDF
                                    </p>

                                    <span className="text-xs text-gray-500">
                                        اضغط هنا أو اسحب الملف للإضافة
                                    </span>
                                </>
                        }

                    </div>

                </button>


                {/* Actions */}
                <div className="mt-6 flex gap-3">

                    <button
                        onClick={() => setShowAddNote(false)}
                        className="flex-1 rounded-xl border border-gray-200 py-3 font-medium transition hover:bg-gray-100"
                    >
                        إلغاء
                    </button>


                    <button
                        onClick={handleSubmit}
                        disabled={isPending}
                        className="flex-1 rounded-xl bg-[#0066FF] py-3 font-semibold text-white transition hover:bg-[#0052CC] disabled:opacity-70"
                    >

                        {
                            isPending
                                ?
                                <div className="flex items-center justify-center gap-2">
                                    <Loader2 size={18} className="animate-spin" />
                                    <span>جارِ الرفع...</span>
                                </div>
                                :
                                "رفع المذكرة"
                        }

                    </button>

                </div>

            </div>

        </div>
    );
}