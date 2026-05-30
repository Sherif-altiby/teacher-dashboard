"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuthStore } from "@/app/store/authStore";
import { useLevelStore } from "@/app/store/levelsStore";
import { useSubjectStore } from "@/app/store/subjectStore";
import {
    Plus, Save, Loader2, Trash2, Clock,
    RotateCcw, BookOpen, Layers, LayoutGrid, Image as ImageIcon, X, ArrowRight
} from "lucide-react";
import { API } from "@/app/constants";
import { useQuery, useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import MainButton from "@/app/components/common/MainButton";
import CustomSelect from "@/app/components/common/CustomSelect";
import Image from "next/image";

interface Question {
    title: string;
    titleImage?: File | string | null;
    titleImagePreview?: string;
    answers: Array<{
        text: string;
        image?: File | string | null;
        imagePreview?: string;
    }>;
    correctAnswer: {
        text: string;
        image?: File | string | null;
        imagePreview?: string;
    };
}

const EditQuiz = () => {
    const { id: quizId } = useParams();
    const router = useRouter();
    const user = useAuthStore((s) => s.user);
    const levels = useLevelStore((s) => s.levels);
    const { setSubjects } = useSubjectStore();

    // --- State ---
    const [quizTitle, setQuizTitle] = useState("");
    const [quizDuration, setQuizDuration] = useState("");
    const [selectedLevelId, setSelectedLevelId] = useState("");
    const [selectedSubjectId, setSelectedSubjectId] = useState("");
    const [selectedCourseId, setSelectedCourseId] = useState("");
    const [questions, setQuestions] = useState<Question[]>([]);

    // --- API: Get Quiz Details By ID ---
    const { data: quizData, isLoading: isQuizLoading } = useQuery({
        queryKey: ["quiz-details", quizId],
        queryFn: async () => {
            const response = await fetch(`${API}/teacher/quizzes/${quizId}`, {
                method: "GET",
                credentials: "include",
            });
            const result = await response.json();
            if (!result.status) throw new Error(result.message || "Failed to fetch quiz");
            return result.data;
        },
        enabled: !!quizId,
    });

    // --- API: Get Teacher Subjects ---
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
        enabled: !!user?._id,
    });

    const currentSubject = subjects.find((s: any) => s._id === selectedSubjectId);
    const availableCourses = currentSubject ? currentSubject.courses : [];

    // --- Sync Quiz Data into Local State ---
    useEffect(() => {
        if (quizData) {
            setQuizTitle(quizData.title || "");
            setQuizDuration(quizData.duration ? String(quizData.duration) : "");

            // مطابقة المستوى بالاسم أو الـ ID حسب تخزينه بالـ Schema الخاصة بك
            const matchedLevel = levels.find((l) => l.name === quizData.level || l._id === quizData.level);
            if (matchedLevel) setSelectedLevelId(matchedLevel._id);

            setSelectedSubjectId(quizData.subject?._id || quizData.subject || "");
            setSelectedCourseId(quizData.course?._id || quizData.course || "");

            // معالجة الأسئلة المرجعة من السيرفر وعمل المابينج للـ Previews
            if (quizData.questions && Array.isArray(quizData.questions)) {
                const mappedQuestions = quizData.questions.map((q: any) => ({
                    title: q.title || "",
                    titleImage: q.titleImage || null,
                    titleImagePreview: q.titleImage || "",
                    answers: q.answers.map((a: any) => ({
                        text: a.text || "",
                        image: a.image || null,
                        imagePreview: a.image || ""
                    })),
                    correctAnswer: {
                        text: q.correctAnswer?.text || "",
                        image: q.correctAnswer?.image || null,
                        imagePreview: q.correctAnswer?.image || ""
                    }
                }));
                setQuestions(mappedQuestions);
            }
        }
    }, [quizData, levels]);

    // --- Text Direction & Auto-resize ---
    const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>, callback: (val: string) => void) => {
        const value = e.target.value;
        callback(value);

        e.target.style.height = 'auto';
        e.target.style.height = `${e.target.scrollHeight}px`;

        const firstLine = value.trim().split('\n')[0];
        const isEnglishOrCode = /^[a-zA-Z0-9\s!@#$%^&*()_+={}\[\]:;"'<>,.?\/\\|`~-]+$/.test(firstLine);

        if (isEnglishOrCode && value) {
            e.target.style.direction = 'ltr';
            e.target.style.textAlign = 'left';
        } else {
            e.target.style.direction = 'rtl';
            e.target.style.textAlign = 'right';
        }
    };

    // --- Image Handling ---
    const handleImageUpload = (file: File, callback: (file: File, preview: string) => void) => {
        if (!file) return;
        if (!file.type.startsWith('image/')) {
            toast.error("يرجى اختيار صورة فقط");
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            toast.error("حجم الصورة يجب أن يكون أقل من 5 ميجابايت");
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            callback(file, reader.result as string);
        };
        reader.readAsDataURL(file);
    };

    const handleQuestionTitleImage = (qIndex: number, file: File) => {
        handleImageUpload(file, (file, preview) => {
            const newQuestions = [...questions];
            newQuestions[qIndex].titleImage = file;
            newQuestions[qIndex].titleImagePreview = preview;
            setQuestions(newQuestions);
        });
    };

    const handleAnswerImage = (qIndex: number, aIndex: number, file: File) => {
        handleImageUpload(file, (file, preview) => {
            const newQuestions = [...questions];
            newQuestions[qIndex].answers[aIndex].image = file;
            newQuestions[qIndex].answers[aIndex].imagePreview = preview;
            if (aIndex === 3) {
                newQuestions[qIndex].correctAnswer.image = file;
                newQuestions[qIndex].correctAnswer.imagePreview = preview;
            }
            setQuestions(newQuestions);
        });
    };

    const removeQuestionTitleImage = (qIndex: number) => {
        const newQuestions = [...questions];
        newQuestions[qIndex].titleImage = null;
        newQuestions[qIndex].titleImagePreview = "";
        setQuestions(newQuestions);
    };

    const removeAnswerImage = (qIndex: number, aIndex: number) => {
        const newQuestions = [...questions];
        newQuestions[qIndex].answers[aIndex].image = null;
        newQuestions[qIndex].answers[aIndex].imagePreview = "";
        if (aIndex === 3) {
            newQuestions[qIndex].correctAnswer.image = null;
            newQuestions[qIndex].correctAnswer.imagePreview = "";
        }
        setQuestions(newQuestions);
    };

    // --- Mutation: Update Quiz ---
    const updateMutation = useMutation({
        mutationFn: async (formData: FormData) => {
            const response = await fetch(`${API}/teacher/update-quiz/${quizId}`, {
                method: "PUT", // يمكنك تغييرها لـ POST إن كنت تستقبلها كـ POST في الراوت
                credentials: "include",
                body: formData,
            });
            return response.json();
        },
        onSuccess: (data) => {
            if (data.status) {
                toast.success("تم تحديث الاختبار بنجاح");
                router.refresh();
            } else {
                toast.error(data.message || "فشل تحديث الاختبار");
            }
        },
    });

    const handleUpdateQuiz = () => {
        if (!quizTitle || !selectedSubjectId || !selectedCourseId || !selectedLevelId || !quizDuration) {
            return toast.error("يرجى إكمال البيانات الأساسية");
        }

        const formData = new FormData();
        formData.append('title', quizTitle);
        formData.append('duration', quizDuration);
        formData.append('subjectId', selectedSubjectId);
        formData.append('courseId', selectedCourseId);
        formData.append('level', selectedLevelId);

        // تجهيز بنية نصوص الأسئلة والروابط القديمة إن وجدت
        const questionsData = questions.map(q => ({
            title: q.title,
            titleImage: typeof q.titleImage === 'string' ? q.titleImage : undefined,
            answers: q.answers.map(a => ({
                text: a.text,
                image: typeof a.image === 'string' ? a.image : undefined
            })),
            correctAnswer: {
                text: q.correctAnswer.text,
                image: typeof q.correctAnswer.image === 'string' ? q.correctAnswer.image : undefined
            }
        }));
        formData.append('questions', JSON.stringify(questionsData));

        // إضافة ملفات الصور الجديدة فقط للـ FormData
        questions.forEach((question, qIndex) => {
            if (question.titleImage instanceof File) {
                formData.append(`questions[${qIndex}][titleImage]`, question.titleImage);
            }

            question.answers.forEach((answer, aIndex) => {
                if (answer.image instanceof File) {
                    formData.append(`questions[${qIndex}][answers][${aIndex}][image]`, answer.image);
                }
            });

            if (question.correctAnswer.image instanceof File) {
                formData.append(`questions[${qIndex}][correctAnswer][image]`, question.correctAnswer.image);
            }
        });

        updateMutation.mutate(formData);
    };

    if (isQuizLoading) {
        return (
            <div className="min-h-screen bg-[#FBFBFE] flex flex-col items-center justify-center gap-3">
                <Loader2 className="animate-spin text-indigo-600" size={40} />
                <p className="text-sm font-medium text-slate-500">جاري تحميل بيانات الاختبار المعتمدة...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#FBFBFE] pb-24 text-right" dir="rtl">

            {/* Navbar / Action Header */}
            <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
                <div className="max-w-5xl mx-auto px-4 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => router.back()}
                            className="p-2 hover:bg-slate-100 rounded-xl text-slate-500 transition-colors"
                        >
                            <ArrowRight size={20} />
                        </button>
                        <div>
                            <h1 className="md:text-xl md:font-bold text-slate-900">تعديل الاختبار</h1>
                            <p className="text-xs text-slate-500 hidden sm:block">قم بتحديث أسئلة أو إعدادات الاختبار الحالي</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <MainButton
                            isPending={updateMutation.isPending}
                            icon={updateMutation.isPending ? Loader2 : Save}
                            text="حفظ التعديلات"
                            setStateFn={handleUpdateQuiz}
                        />
                    </div>
                </div>
            </header>

            <main className="max-w-5xl mx-auto px-4 py-8 space-y-6">

                {/* Section 1: Main Settings */}
                <div className="bg-white rounded-2xl border border-slate-200 p-3 md:p-6 shadow-sm space-y-6">
                    <div className="flex items-center gap-2 border-b border-slate-50 pb-4">
                        <LayoutGrid size={18} className="text-indigo-600" />
                        <h2 className="font-bold text-slate-800">إعدادات الاختبار الأساسية</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
                        <div className="md:col-span-8 space-y-2">
                            <label className="text-xs font-bold text-slate-500 px-1">عنوان الاختبار</label>
                            <input
                                value={quizTitle}
                                onChange={(e) => setQuizTitle(e.target.value)}
                                type="text"
                                placeholder="عنوان الاختبار"
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-medium"
                            />
                        </div>
                        <div className="md:col-span-4 space-y-2">
                            <label className="text-xs font-bold text-slate-500 px-1">المدة (بالدقائق)</label>
                            <div className="relative">
                                <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                <input
                                    value={quizDuration}
                                    onChange={(e) => setQuizDuration(e.target.value)}
                                    type="number"
                                    placeholder="30"
                                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-500 outline-none transition-all font-medium"
                                />
                            </div>
                        </div>

                        <div className="md:col-span-4 space-y-2">
                            <label className="text-xs font-bold text-slate-500 px-1 block">المستوى الدراسي</label>
                            <CustomSelect
                                value={selectedLevelId}
                                onChange={setSelectedLevelId}
                                options={levels.map((l) => ({ value: l._id, label: l.name }))}
                                icon={Layers}
                                placeholder="اختر المستوى"
                            />
                        </div>

                        <div className="md:col-span-4 space-y-2">
                            <label className="text-xs font-bold text-slate-500 px-1 block">المادة</label>
                            <CustomSelect
                                value={selectedSubjectId}
                                onChange={(val) => {
                                    setSelectedSubjectId(val);
                                    setSelectedCourseId("");
                                }}
                                options={subjects.map((s: any) => ({ value: s._id, label: s.name }))}
                                icon={BookOpen}
                                placeholder="حدد المادة"
                            />
                        </div>

                        <div className="md:col-span-4 space-y-2">
                            <label className="text-xs font-bold text-slate-500 px-1 block">الكورس</label>
                            <CustomSelect
                                value={selectedCourseId}
                                onChange={setSelectedCourseId}
                                options={availableCourses.map((c: any) => ({ value: c._id, label: c.title }))}
                                icon={LayoutGrid}
                                placeholder="اختر الكورس"
                                disabled={!selectedSubjectId}
                            />
                        </div>
                    </div>
                </div>

                {/* Section 2: Questions List */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between px-2">
                        <h3 className="font-bold text-slate-700">الأسئلة والخيارات ({questions.length})</h3>
                    </div>

                    {questions.map((q, qIndex) => (
                        <div key={qIndex} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:border-indigo-200 transition-all duration-300">

                            {/* Question Header */}
                            <div className="bg-slate-50/50 px-6 py-3 border-b border-slate-100 flex items-center justify-between">
                                <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-2 py-1 rounded">Q {qIndex + 1}</span>
                                <button
                                    onClick={() => setQuestions(questions.filter((_, i) => i !== qIndex))}
                                    className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>

                            <div className="p-3 md:p-6 space-y-6">
                                {/* Question Content */}
                                <div className="space-y-3">
                                    <textarea
                                        value={q.title}
                                        onChange={(e) => handleTextareaChange(e, (val) => {
                                            const newQ = [...questions];
                                            newQ[qIndex].title = val;
                                            setQuestions(newQ);
                                        })}
                                        placeholder="أدخل نص السؤال..."
                                        className="w-full bg-white text-[16px] font-semibold text-slate-800 outline-none resize-none min-h-[50px] placeholder:text-slate-300"
                                    />

                                    {/* Question Title Image Upload */}
                                    <div className="flex flex-col md:flex-row items-center gap-3">
                                        <label className="cursor-pointer">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                onChange={(e) => {
                                                    const file = e.target.files?.[0];
                                                    if (file) handleQuestionTitleImage(qIndex, file);
                                                }}
                                            />
                                            <div className="flex items-center gap-2 px-3 py-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors text-sm font-medium">
                                                <ImageIcon size={16} />
                                                <span>استبدال / إضافة صورة للسؤال</span>
                                            </div>
                                        </label>

                                        {/* Image Preview */}
                                        {q.titleImagePreview && (
                                            <div className="relative w-24 h-24 rounded-lg overflow-hidden border-2 border-indigo-200">
                                                <Image
                                                    src={q.titleImagePreview}
                                                    alt="Question"
                                                    fill
                                                    className="object-cover"
                                                />
                                                <button
                                                    onClick={() => removeQuestionTitleImage(qIndex)}
                                                    className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                                                >
                                                    <X size={12} />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Answers Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {q.answers.map((ans, aIndex) => (
                                        <div
                                            key={aIndex}
                                            className={`rounded-xl border transition-all ${aIndex === 3 ? 'bg-emerald-50/30 border-emerald-100' : 'bg-slate-50 border-slate-100'}`}
                                        >
                                            <div className="flex items-center gap-3 px-4 py-3">
                                                <span className={`text-[10px] font-black w-6 h-6 rounded flex items-center justify-center shrink-0 ${aIndex === 3 ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-500'}`}>
                                                    {String.fromCharCode(65 + aIndex)}
                                                </span>
                                                <textarea
                                                    value={ans.text}
                                                    onChange={(e) => handleTextareaChange(e, (val) => {
                                                        const newQ = [...questions];
                                                        newQ[qIndex].answers[aIndex].text = val;
                                                        if (aIndex === 3) {
                                                            newQ[qIndex].correctAnswer.text = val;
                                                        }
                                                        setQuestions(newQ);
                                                    })}
                                                    placeholder={aIndex === 3 ? "الإجابة الصحيحة" : `خيار ${aIndex + 1}`}
                                                    className="w-full bg-transparent outline-none font-bold text-sm text-slate-700 placeholder:text-slate-300 resize-none overflow-hidden"
                                                />
                                            </div>

                                            {/* Answer Image Upload */}
                                            <div className="px-4 pb-3 flex items-center gap-2">
                                                <label className="cursor-pointer">
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        className="hidden"
                                                        onChange={(e) => {
                                                            const file = e.target.files?.[0];
                                                            if (file) handleAnswerImage(qIndex, aIndex, file);
                                                        }}
                                                    />
                                                    <div className="flex items-center gap-1 px-2 py-1 bg-white border border-slate-200 rounded text-xs text-slate-600 hover:bg-slate-50 transition-colors">
                                                        <ImageIcon size={12} />
                                                        <span>صورة</span>
                                                    </div>
                                                </label>

                                                {/* Answer Image Preview */}
                                                {ans.imagePreview && (
                                                    <div className="relative w-12 h-12 rounded overflow-hidden border border-slate-200">
                                                        <Image
                                                            src={ans.imagePreview}
                                                            alt={`Answer ${aIndex + 1}`}
                                                            fill
                                                            className="object-cover"
                                                        />
                                                        <button
                                                            onClick={() => removeAnswerImage(qIndex, aIndex)}
                                                            className="absolute top-0 right-0 p-0.5 bg-red-500 text-white rounded-bl hover:bg-red-600 transition-colors"
                                                        >
                                                            <X size={10} />
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Add Question Trigger */}
                <button
                    onClick={() => setQuestions([
                        ...questions,
                        {
                            title: "",
                            titleImage: null,
                            titleImagePreview: "",
                            answers: [
                                { text: "", image: null, imagePreview: "" },
                                { text: "", image: null, imagePreview: "" },
                                { text: "", image: null, imagePreview: "" },
                                { text: "", image: null, imagePreview: "" }
                            ],
                            correctAnswer: { text: "", image: null, imagePreview: "" }
                        }
                    ])}
                    className="w-full py-5 border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 font-bold hover:border-indigo-400 hover:text-indigo-500 hover:bg-indigo-50/30 transition-all flex items-center justify-center gap-2 group"
                >
                    <Plus size={20} className="group-hover:rotate-90 transition-transform" />
                    <span className="text-[13px] md:text-[16px]">إضافة سؤال جديد للاختبار</span>
                </button>
            </main>
        </div>
    );
};

export default EditQuiz;