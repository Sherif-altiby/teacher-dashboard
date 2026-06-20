"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { useAuthStore } from "@/app/store/authStore";
import { useLevelStore } from "@/app/store/levelsStore";
import { useSubjectStore } from "@/app/store/subjectStore";
import {
    Save,
    Loader2,
    ChevronDown,
    FileText,
    UploadCloud,
    X,
} from "lucide-react";
import { API } from "@/app/constants";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import MainButton from "../common/MainButton";
import { uploadPdfService } from "@/app/services/noteServices";

interface CreateNoteModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const CreateNoteModal = ({ isOpen, onClose }: CreateNoteModalProps) => {
    const user = useAuthStore((s) => s.user);
    const levels = useLevelStore((s) => s.levels);
    const { setSubjects } = useSubjectStore();
    const queryClient = useQueryClient();
    const fileInputRef = useRef<HTMLInputElement>(null);

    // --- Form States ---
    const [noteTitle, setNoteTitle] = useState("");
    const [selectedLevelId, setSelectedLevelId] = useState("");
    const [selectedSubjectId, setSelectedSubjectId] = useState("");
    const [selectedCourseId, setSelectedCourseId] = useState("");
    const [pdfFile, setPdfFile] = useState<File | null>(null);
    const [isDragging, setIsDragging] = useState(false);

    // --- تصفير الفورم تماماً عند غلق أو فتح المودال لمنع تداخل البيانات القديمة ---
    useEffect(() => {
        if (!isOpen) {
            setNoteTitle("");
            setSelectedLevelId("");
            setSelectedSubjectId("");
            setSelectedCourseId("");
            setPdfFile(null);
            setIsDragging(false);
        }
    }, [isOpen]);

    // --- Fetch Subjects ---
    const { data: subjects = [] } = useQuery({
        queryKey: ["teacher-subjects", user?._id],
        queryFn: async () => {
            const response = await fetch(`${API}/user/get-teacher-subjects`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ teacherId: user?._id }),
            });
            const result = await response.json();
            if (!result.status) throw new Error("Failed");
            setSubjects(result.data);
            return result.data;
        },
        enabled: !!user?._id && isOpen,
    });

    const availableCourses = useMemo(() => {
        if (!selectedSubjectId) return [];
        const currentSubject = subjects.find((s: any) => s._id === selectedSubjectId);
        return currentSubject?.courses || [];
    }, [subjects, selectedSubjectId]);

    // --- Handlers ---
    const handleFile = (file: File) => {
        if (file.type === "application/pdf") {
            setPdfFile(file);
        } else {
            toast.error("يرجى اختيار ملف PDF فقط");
        }
    };

    const onDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files?.[0]) handleFile(e.dataTransfer.files[0]);
    };

    // --- Upload Mutation ---
    const uploadMutation = useMutation({
        mutationFn: uploadPdfService,

        onSuccess: (data) => {
            toast.success("تم نشر المذكرة بنجاح");

            queryClient.invalidateQueries({
                queryKey: ["teacherNotes"],
            });

            onClose();
        },

        onError: (error: Error) => {
            toast.error(error.message || "حدث خطأ في السيرفر");
        },
    });

    const handleSave = () => {
        if (!noteTitle.trim()) return toast.error("أدخل عنوان المذكرة أولاً");
        if (!selectedLevelId) return toast.error("يرجى اختيار المستوى الدراسي");
        if (!selectedSubjectId) return toast.error("يرجى اختيار المادة الدراسية");
        if (!pdfFile) return toast.error("يرجى إرفاق ملف المذكرة (PDF)");

        const formData = new FormData();
        formData.append("title", noteTitle);
        formData.append("levelId", selectedLevelId);
        formData.append("subjectId", selectedSubjectId);
        formData.append("courseId", selectedCourseId);
        formData.append("pdf", pdfFile);

        uploadMutation.mutate(formData);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Modal Container */}
            <div className="relative bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-300" dir="rtl">

                {/* Header */}
                <div className="px-8 pt-8 pb-4 flex items-center justify-between border-b border-slate-50">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-emerald-200">
                            <FileText size={24} />
                        </div>
                        <div>
                            <h2 className="text-base font-black text-slate-800">إضافة مذكرة جديدة</h2>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors">
                        <X size={24} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-8 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">

                    {/* Title & Level */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="group space-y-2">
                            <label className="text-xs font-black text-slate-500 mr-1 group-focus-within:text-emerald-600 transition-colors">عنوان المذكرة</label>
                            <input
                                value={noteTitle}
                                onChange={(e) => setNoteTitle(e.target.value)}
                                placeholder="مثال: ملخص ليلة الامتحان..."
                                className="w-full px-5 py-3 bg-slate-50 border-2 border-transparent rounded-2xl focus:border-emerald-500 focus:bg-white outline-none transition-all font-bold text-sm text-slate-700 placeholder:text-slate-300"
                            />
                        </div>

                        <div className="group space-y-2">
                            <label className="text-xs font-black text-slate-500 mr-1 group-focus-within:text-emerald-600 transition-colors">المستوى</label>
                            <div className="relative">
                                <select
                                    value={selectedLevelId}
                                    onChange={(e) => setSelectedLevelId(e.target.value)}
                                    className="w-full px-5 py-3 bg-slate-50 border-2 border-transparent rounded-2xl focus:border-emerald-500 focus:bg-white outline-none transition-all font-bold text-sm appearance-none text-slate-700"
                                >
                                    <option value="">اختر المستوى</option>
                                    {levels.map((l) => <option key={l._id} value={l._id}>{l.name}</option>)}
                                </select>
                                <ChevronDown className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" size={18} />
                            </div>
                        </div>
                    </div>

                    {/* Subject & Course Selectors */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="group space-y-2">
                            <label className="text-xs font-black text-slate-500 mr-1 group-focus-within:text-emerald-600 transition-colors">المادة</label>
                            <div className="relative">
                                <select
                                    value={selectedSubjectId}
                                    onChange={(e) => { setSelectedSubjectId(e.target.value); setSelectedCourseId(""); }}
                                    className="w-full px-5 py-3 bg-slate-50 border-2 border-transparent rounded-2xl focus:border-emerald-500 focus:bg-white outline-none transition-all font-bold text-sm appearance-none text-slate-700"
                                >
                                    <option value="">اختر المادة</option>
                                    {subjects.map((s: any) => <option key={s._id} value={s._id}>{s.name}</option>)}
                                </select>
                                <ChevronDown className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" size={18} />
                            </div>
                        </div>

                        <div className="group space-y-2">
                            <label className="text-xs font-black text-slate-500 mr-1 group-focus-within:text-emerald-600 transition-colors">الكورس</label>
                            <div className="relative">
                                <select
                                    value={selectedCourseId}
                                    onChange={(e) => setSelectedCourseId(e.target.value)}
                                    disabled={!selectedSubjectId}
                                    className="w-full px-5 py-3 bg-slate-50 border-2 border-transparent rounded-2xl focus:border-emerald-500 focus:bg-white outline-none transition-all font-bold text-sm appearance-none text-slate-700 disabled:opacity-40 transition-opacity"
                                >
                                    <option value="">{selectedSubjectId ? "اختر الكورس" : "حدد المادة أولاً"}</option>
                                    {availableCourses.map((c: any) => <option key={c._id} value={c._id}>{c.title}</option>)}
                                </select>
                                <ChevronDown className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" size={18} />
                            </div>
                        </div>
                    </div>

                    {/* Upload Area */}
                    <div className="space-y-2">
                        <label className="text-xs font-black text-slate-500 mr-1">الملف المرفق</label>
                        {!pdfFile ? (
                            <div
                                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                                onDragLeave={() => setIsDragging(false)}
                                onDrop={onDrop}
                                onClick={() => fileInputRef.current?.click()}
                                className={`border-3 border-dashed rounded-xl p-8 flex flex-col items-center justify-center gap-4 transition-all cursor-pointer group ${isDragging ? "border-emerald-500 bg-emerald-50 shadow-inner" : "border-slate-100 bg-slate-50/50 hover:border-emerald-300 hover:bg-white"}`}
                            >
                                <input type="file" accept=".pdf" className="hidden" ref={fileInputRef} onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />
                                <div className={`w-9 h-9 rounded-lg flex items-center justify-center transition-transform duration-500 ${isDragging ? "scale-110 bg-emerald-500 text-white" : "bg-white text-slate-300 group-hover:text-emerald-500 shadow-sm"}`}>
                                    <UploadCloud size={20} />
                                </div>
                                <div className="text-center">
                                    <p className="text-sm font-bold text-slate-600">اسحب الملف هنا أو تصفح المجلدات</p>
                                    <p className="text-[10px] text-slate-400 mt-0.5">صيغة الملف المدعومة فقط هي PDF</p>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center justify-between p-4 bg-emerald-500 rounded-2xl text-white shadow-lg shadow-emerald-100 animate-in slide-in-from-bottom-2">
                                <div className="flex items-center gap-4">
                                    <div className="w-9 h-9 bg-white/20 rounded-lg flex items-center justify-center">
                                        <FileText size={18} />
                                    </div>
                                    <div>
                                        <p className="font-bold text-xs line-clamp-1">{pdfFile.name}</p>
                                        <p className="text-white/70 text-[9px] font-black uppercase">ملف جاهز للنشر الآن</p>
                                    </div>
                                </div>
                                <button onClick={() => setPdfFile(null)} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                                    <X size={20} />
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Sticky Footer */}
                <div className="p-6 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between gap-4">
                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            className="px-5 py-2.5 font-black text-xs text-slate-400 hover:text-slate-600 transition-colors"
                        >
                            إلغاء
                        </button>
                        <MainButton
                            isPending={uploadMutation.isPending}
                            icon={uploadMutation.isPending ? Loader2 : Save}
                            text="نشر المذكرة الآن"
                            setStateFn={handleSave}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateNoteModal;