"use client";

import { useState } from "react";
import { useAuthStore } from "@/app/store/authStore";
import { useLevelStore } from "@/app/store/levelsStore";
import { useSubjectStore } from "@/app/store/subjectStore";
import { Plus, Save, Loader2, Trash2, Clock, RotateCcw, BookOpen, Layers, GraduationCap, LayoutGrid } from "lucide-react";
import { API } from "@/app/constants";
import { useQuery, useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import MainButton from "../common/MainButton";

const CreateQuiz = () => {
  const user = useAuthStore((s) => s.user);
  const levels = useLevelStore((s) => s.levels);
  const { setSubjects } = useSubjectStore();

  const [quizTitle, setQuizTitle] = useState("");
  const [quizDuration, setQuizDuration] = useState("");
  const [selectedLevelId, setSelectedLevelId] = useState("");
  const [selectedSubjectId, setSelectedSubjectId] = useState("");
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [questions, setQuestions] = useState([
    { title: "", answers: ["", "", "", ""], correctAnswer: "" },
  ]);

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>, callback: (val: string) => void) => {
    const value = e.target.value;
    callback(value);
    e.target.style.height = '46px'; 
    if (value) e.target.style.height = `${e.target.scrollHeight}px`;

    const isEnglish = /^[a-zA-Z0-9\s!@#$%^&*()_+={}\[\]:;"'<>,.?\/\\|`~-]+$/.test(value.trim().split('\n')[0]);
    e.target.style.direction = isEnglish && value ? 'ltr' : 'rtl';
    e.target.style.textAlign = isEnglish && value ? 'left' : 'right';
  };

  const resetAllTextareas = () => {
    document.querySelectorAll('textarea').forEach((ta: any) => {
        ta.style.height = '46px';
        ta.style.direction = 'rtl';
    });
  };

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

  const resetForm = () => {
    setQuizTitle("");
    setQuizDuration("");
    setSelectedLevelId("");
    setSelectedSubjectId("");
    setSelectedCourseId("");
    setQuestions([{ title: "", answers: ["", "", "", ""], correctAnswer: "" }]);
    setTimeout(resetAllTextareas, 100);
  };

  const uploadMutation = useMutation({
    mutationFn: async (quizData: any) => {
      const response = await fetch(`${API}/teacher/upload-quiz`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(quizData),
      });
      return response.json();
    },
    onSuccess: (data) => {
      if (data.status) {
        toast.success("تم رفع الاختبار بنجاح!");
        resetForm();
      } else {
        toast.error(data.message || "فشل رفع الاختبار");
      }
    },
  });

  const currentSubject = subjects.find((s: any) => s._id === selectedSubjectId);
  const availableCourses = currentSubject ? currentSubject.courses : [];

  const handleSaveQuiz = () => {
    if (!quizTitle || !selectedSubjectId || !selectedCourseId || !selectedLevelId || !quizDuration) {
      return toast.error("يرجى إكمال البيانات الأساسية");
    }
    uploadMutation.mutate({
      title: quizTitle,
      duration: Number(quizDuration),
      subjectId: selectedSubjectId,
      courseId: selectedCourseId,
      level: selectedLevelId,
      questions: questions,
    });
  };

  return (
    <div className="min-h-screen absolute inset-0 z-50 bg-[#F8FAFC] p-4 lg:p-8 overflow-y-auto font-sans text-right" dir="rtl">
      <div className="max-w-5xl mx-auto pb-20">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 bg-white p-8 rounded-[2rem] shadow-sm border border-slate-200/60">
          <div className="space-y-1">
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">إنشاء اختبار ذكي</h1>
            <p className="text-slate-500 font-medium">املأ البيانات لإطلاق اختبار جديد لطلابك.</p>
          </div>
          <div className="flex items-center gap-3">
             <button onClick={resetForm} title="إعادة ضبط" className="p-4 bg-slate-50 text-slate-400 rounded-2xl hover:bg-red-50 hover:text-red-500 transition-all active:scale-95 border border-slate-100">
                <RotateCcw size={22} />
             </button>
             <MainButton isPending={uploadMutation.isPending} icon={uploadMutation.isPending ? Loader2 : Save} text="حفظ ونشر الاختبار" setStateFn={handleSaveQuiz} />
          </div>
        </div>

        <div className="space-y-10">
          
          {/* Main Info Card */}
          <section className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-200/60 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50/50 rounded-full -mr-16 -mt-16 blur-3xl"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
              
              <div className="md:col-span-2 space-y-3">
                <label className="text-sm font-bold text-slate-700 mr-1 flex items-center gap-2">اسم الاختبار</label>
                <input value={quizTitle} onChange={(e) => setQuizTitle(e.target.value)} type="text" placeholder="مثال: التحدي البرمجي الأول" className="w-full px-6 py-4 bg-slate-50/50 border border-slate-200 rounded-2xl focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/5 font-bold outline-none transition-all placeholder:text-slate-300" />
              </div>

              <div className="space-y-3">
                <label className="text-sm font-bold text-slate-700 mr-1 flex items-center gap-2"><Clock size={16} className="text-indigo-500"/> الوقت (بالدقائق)</label>
                <input value={quizDuration} onChange={(e) => setQuizDuration(e.target.value)} type="number" placeholder="30" className="w-full px-6 py-4 bg-slate-50/50 border border-slate-200 rounded-2xl focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/5 font-bold outline-none transition-all" />
              </div>

              <div className="space-y-3">
                <label className="text-sm font-bold text-slate-700 mr-1 flex items-center gap-2"><GraduationCap size={16} className="text-indigo-500"/> المستوى</label>
                <div className="relative">
                    <select value={selectedLevelId} onChange={(e) => setSelectedLevelId(e.target.value)} className="w-full px-6 py-4 bg-slate-50/50 border border-slate-200 rounded-2xl focus:border-indigo-500 focus:bg-white outline-none appearance-none font-bold cursor-pointer">
                        <option value="">اختر المستوى</option>
                        {levels.map((l) => <option key={l._id} value={l._id}>{l.name}</option>)}
                    </select>
                </div>
              </div>

              <div className="space-y-3 lg:col-span-2">
                <label className="text-sm font-bold text-slate-700 mr-1 flex items-center gap-2"><BookOpen size={16} className="text-indigo-500"/> المادة الدراسية</label>
                <select value={selectedSubjectId} onChange={(e) => { setSelectedSubjectId(e.target.value); setSelectedCourseId(""); }} className="w-full px-6 py-4 bg-slate-50/50 border border-slate-200 rounded-2xl focus:border-indigo-500 focus:bg-white outline-none appearance-none font-bold cursor-pointer">
                    <option value="">حدد المادة</option>
                    {subjects.map((s: any) => <option key={s._id} value={s._id}>{s.name}</option>)}
                </select>
              </div>

              <div className="space-y-3 lg:col-span-2">
                <label className="text-sm font-bold text-slate-700 mr-1 flex items-center gap-2"><Layers size={16} className="text-indigo-500"/> الكورس التابع له</label>
                <select value={selectedCourseId} onChange={(e) => setSelectedCourseId(e.target.value)} disabled={!selectedSubjectId} className="w-full px-6 py-4 bg-slate-50/50 border border-slate-200 rounded-2xl focus:border-indigo-500 focus:bg-white outline-none appearance-none font-bold cursor-pointer disabled:opacity-40 transition-opacity">
                    <option value="">اختر الكورس</option>
                    {availableCourses.map((c: any) => <option key={c._id} value={c._id}>{c.title}</option>)}
                </select>
              </div>
            </div>
          </section>

          {/* Questions Divider */}
          <div className="flex items-center gap-4 px-4">
            <div className="h-[1px] flex-1 bg-slate-200"></div>
            <span className="text-slate-400 font-bold text-sm uppercase tracking-widest">أسئلة الاختبار</span>
            <div className="h-[1px] flex-1 bg-slate-200"></div>
          </div>

          {/* Questions List */}
          <div className="space-y-8">
            {questions.map((q, qIndex) => (
              <div key={qIndex} className="group bg-white p-8 rounded-[2.5rem] relative shadow-sm border border-slate-200/60 hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-500">
                
                {/* Delete Button */}
                <button onClick={() => setQuestions(questions.filter((_, i) => i !== qIndex))} className="absolute -left-3 -top-3 w-10 h-10 bg-white text-slate-300 hover:text-red-500 hover:shadow-lg hover:shadow-red-500/20 rounded-full flex items-center justify-center transition-all border border-slate-100 opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100">
                  <Trash2 size={18} />
                </button>

                <div className="flex flex-col gap-8">
                  <div className="flex items-start gap-5">
                    <div className="w-12 h-12 shrink-0 bg-indigo-600 text-white rounded-2xl flex items-center justify-center text-xl font-black shadow-lg shadow-indigo-200 ring-4 ring-indigo-50">
                        {qIndex + 1}
                    </div>
                    <div className="flex-1">
                      <textarea
                        value={q.title}
                        onChange={(e) => handleTextareaChange(e, (val) => {
                          const newQ = [...questions];
                          newQ[qIndex].title = val;
                          setQuestions(newQ);
                        })}
                        placeholder="اكتب السؤال هنا... يمكنك إضافة كود برمجي أيضاً"
                        className="w-full bg-transparent border-none py-2 text-xl font-bold text-slate-800 outline-none resize-none overflow-hidden min-h-[46px] font-mono placeholder:text-slate-200"
                        style={{ direction: 'rtl' }}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {q.answers.map((ans, aIndex) => (
                      <div key={aIndex} className={`relative group/ans flex items-center rounded-[1.5rem] border-2 transition-all duration-300 ${aIndex === 3 && ans !== "" ? "border-emerald-500 bg-emerald-50/30" : "border-slate-50 bg-slate-50/50 focus-within:border-indigo-500 focus-within:bg-white focus-within:ring-4 focus-within:ring-indigo-500/5"}`}>
                        <div className={`absolute right-4 w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-black transition-colors ${aIndex === 3 && ans !== "" ? "bg-emerald-500 text-white" : "bg-white text-slate-300 border border-slate-100"}`}>
                            {String.fromCharCode(65 + aIndex)}
                        </div>
                        <textarea
                          value={ans}
                          onChange={(e) => handleTextareaChange(e, (val) => {
                            const newQ = [...questions];
                            newQ[qIndex].answers[aIndex] = val;
                            newQ[qIndex].correctAnswer = newQ[qIndex].answers[3];
                            setQuestions(newQ);
                          })}
                          placeholder={aIndex === 3 ? "الإجابة الصحيحة" : `الخيار رقم ${aIndex + 1}`}
                          className="w-full pr-14 pl-6 py-5 bg-transparent font-bold text-slate-700 outline-none resize-none overflow-hidden min-h-[64px] font-mono text-sm placeholder:text-slate-300"
                          style={{ direction: 'rtl' }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Add Question Button */}
          <div className="flex justify-center mt-12">
            <button onClick={() => setQuestions([...questions, { title: "", answers: ["", "", "", ""], correctAnswer: "" }])} className="group relative flex items-center gap-4 px-10 py-5 bg-white border-2 border-dashed border-slate-200 rounded-[2rem] text-slate-400 hover:border-indigo-500 hover:text-indigo-600 hover:bg-indigo-50/30 transition-all duration-300 active:scale-95 shadow-sm">
                <div className="w-8 h-8 bg-slate-100 rounded-xl flex items-center justify-center group-hover:bg-indigo-500 group-hover:text-white transition-colors">
                    <Plus size={20} />
                </div>
                <span className="font-black text-sm uppercase tracking-[0.2em]">إضافة سؤال جديد</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateQuiz;