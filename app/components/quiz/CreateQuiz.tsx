"use client";

import { useState, useEffect } from "react";
import { useAuthStore } from "@/app/store/authStore";
import { useLevelStore } from "@/app/store/levelsStore";
import { useSubjectStore } from "@/app/store/subjectStore";
import { 
  Plus, Save, Loader2, Trash2, Clock, 
  RotateCcw, BookOpen, Layers, LayoutGrid 
} from "lucide-react";
import { API } from "@/app/constants";
import { useQuery, useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import MainButton from "../common/MainButton";

const CreateQuiz = () => {
  const user = useAuthStore((s) => s.user);
  const levels = useLevelStore((s) => s.levels);
  const { setSubjects } = useSubjectStore();

  // --- State ---
  const [quizTitle, setQuizTitle] = useState("");
  const [quizDuration, setQuizDuration] = useState("");
  const [selectedLevelId, setSelectedLevelId] = useState("");
  const [selectedSubjectId, setSelectedSubjectId] = useState("");
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [questions, setQuestions] = useState([
    { title: "", answers: ["", "", "", ""], correctAnswer: "" },
  ]);

  // --- Logic: Text Direction & Auto-resize ---
  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>, callback: (val: string) => void) => {
    const value = e.target.value;
    callback(value);
    
    // Auto-resize height
    e.target.style.height = 'auto';
    e.target.style.height = `${e.target.scrollHeight}px`;

    // Detect Language (Arabic vs English/Code)
    const firstLine = value.trim().split('\n')[0];
    const isEnglishOrCode = /^[a-zA-Z0-9\s!@#$%^&*()_+={}\[\]:;"'<>,.?\/\\|`~-]+$/.test(firstLine);
    
    if (isEnglishOrCode && value) {
      e.target.style.direction = 'ltr';
      e.target.style.textAlign = 'left';
      e.target.style.unicodeBidi = 'plaintext'; // يحافظ على مكان السيمي-كولون والرموز
    } else {
      e.target.style.direction = 'rtl';
      e.target.style.textAlign = 'right';
      e.target.style.unicodeBidi = 'plaintext'; // أيضاً مفيد للعربي المتداخل مع كود
    }
  };

  // --- API: Get Subjects ---
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

  // --- Mutation: Upload Quiz ---
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
        toast.success("تم نشر الاختبار بنجاح");
        resetForm();
      } else {
        toast.error(data.message || "فشل رفع الاختبار");
      }
    },
  });

  const resetForm = () => {
    setQuizTitle("");
    setQuizDuration("");
    setSelectedLevelId("");
    setSelectedSubjectId("");
    setSelectedCourseId("");
    setQuestions([{ title: "", answers: ["", "", "", ""], correctAnswer: "" }]);
  };

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
    <div className="min-h-screen bg-[#FBFBFE] pb-24 text-right" dir="rtl">
      
      {/* Navbar / Action Header */}
      <header className=" bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 h-20 flex items-center justify-between">
          <div>
            <h1 className="md:text-xl md:font-bold text-slate-900">إنشاء اختبار</h1>
            <p className="text-xs text-slate-500 hidden sm:block">صمم اختبارك البرمجي أو التعليمي بدقة</p>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={resetForm} 
              className="p-2.5 text-slate-400 hover:bg-slate-100 rounded-xl transition-colors"
              title="إعادة ضبط الحقول"
            >
              <RotateCcw size={20} />
            </button>
            <MainButton 
              isPending={uploadMutation.isPending} 
              icon={uploadMutation.isPending ? Loader2 : Save} 
              text="نشر الآن" 
              setStateFn={handleSaveQuiz} 
            />
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8 space-y-6">
        
        {/* Section 1: Main Settings */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
          <div className="flex items-center gap-2 border-b border-slate-50 pb-4">
            <LayoutGrid size={18} className="text-indigo-600" />
            <h2 className="font-bold text-slate-800">إعدادات الاختبار</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
            <div className="md:col-span-8 space-y-2">
              <label className="text-xs font-bold text-slate-500 px-1">عنوان الاختبار</label>
              <input 
                value={quizTitle} 
                onChange={(e) => setQuizTitle(e.target.value)} 
                type="text" 
                placeholder="مثال: أساسيات لغة JavaScript" 
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
              <select 
                value={selectedLevelId} 
                onChange={(e) => setSelectedLevelId(e.target.value)} 
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-500 outline-none font-medium appearance-none cursor-pointer"
              >
                <option value="">اختر المستوى</option>
                {levels.map((l) => <option key={l._id} value={l._id}>{l.name}</option>)}
              </select>
            </div>

            <div className="md:col-span-4 space-y-2">
              <label className="text-xs font-bold text-slate-500 px-1 block">المادة</label>
              <select 
                value={selectedSubjectId} 
                onChange={(e) => { setSelectedSubjectId(e.target.value); setSelectedCourseId(""); }} 
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-500 outline-none font-medium appearance-none cursor-pointer"
              >
                <option value="">حدد المادة</option>
                {subjects.map((s: any) => <option key={s._id} value={s._id}>{s.name}</option>)}
              </select>
            </div>

            <div className="md:col-span-4 space-y-2">
              <label className="text-xs font-bold text-slate-500 px-1 block">الكورس</label>
              <select 
                value={selectedCourseId} 
                onChange={(e) => setSelectedCourseId(e.target.value)} 
                disabled={!selectedSubjectId} 
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-500 outline-none font-medium disabled:opacity-50 appearance-none cursor-pointer"
              >
                <option value="">اختر الكورس</option>
                {availableCourses.map((c: any) => <option key={c._id} value={c._id}>{c.title}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Section 2: Questions List */}
        <div className="space-y-6">
          <div className="flex items-center justify-between px-2">
            <h3 className="font-bold text-slate-700">الأسئلة ({questions.length})</h3>
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

              <div className="p-6 space-y-6">
                {/* Question Content */}
                <textarea
                  value={q.title}
                  onChange={(e) => handleTextareaChange(e, (val) => {
                    const newQ = [...questions];
                    newQ[qIndex].title = val;
                    setQuestions(newQ);
                  })}
                  placeholder="مثال: ما هو ناتج تنفيذ الكود التالي؟ let x = 090;"
                  className="w-full bg-white text-[16px] font-semibold text-slate-800 outline-none resize-none min-h-[50px] placeholder:text-slate-300"
                  style={{ unicodeBidi: 'plaintext' }}
                />

                {/* Answers Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {q.answers.map((ans, aIndex) => (
                    <div 
                      key={aIndex} 
                      className={`flex items-center gap-3 px-4 rounded-xl border transition-all ${aIndex === 3 ? 'bg-emerald-50/30 border-emerald-100 focus-within:border-emerald-500' : 'bg-slate-50 border-slate-100 focus-within:border-indigo-200 focus-within:bg-white'}`}
                    >
                      <span className={`text-[10px] font-black w-6 h-6 rounded flex items-center justify-center shrink-0 ${aIndex === 3 ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-500'}`}>
                        {String.fromCharCode(65 + aIndex)}
                      </span>
                      <textarea 
                        value={ans}
                        onChange={(e) => handleTextareaChange(e, (val) => {
                          const newQ = [...questions];
                          newQ[qIndex].answers[aIndex] = val;
                          newQ[qIndex].correctAnswer = newQ[qIndex].answers[3];
                          setQuestions(newQ);
                        })}
                        placeholder={aIndex === 3 ? "الإجابة الصحيحة" : `خيار ${aIndex + 1}`}
                        className="w-full py-3 bg-transparent outline-none font-bold text-sm text-slate-700 placeholder:text-slate-300 resize-none h-auto overflow-hidden"
                        style={{ unicodeBidi: 'plaintext' }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Add Question Trigger */}
        <button 
          onClick={() => setQuestions([...questions, { title: "", answers: ["", "", "", ""], correctAnswer: "" }])}
          className="w-full py-5 border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 font-bold hover:border-indigo-400 hover:text-indigo-500 hover:bg-indigo-50/30 transition-all flex items-center justify-center gap-2 group"
        >
          <Plus size={20} className="group-hover:rotate-90 transition-transform" />
          <span>إضافة سؤال جديد</span>
        </button>
      </main>
    </div>
  );
};

export default CreateQuiz;