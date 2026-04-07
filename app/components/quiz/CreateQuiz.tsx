"use client";

import { useState } from "react";
import { useAuthStore } from "@/app/store/authStore";
import { useLevelStore } from "@/app/store/levelsStore";
import { useSubjectStore } from "@/app/store/subjectStore";
import { Plus, Save, Loader2, Trash2, Clock } from "lucide-react";
import { API } from "@/app/constants";
import { useQuery, useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import MainButton from "../common/MainButton";

const CreateQuiz = () => {
  const user = useAuthStore((s) => s.user);
  const levels = useLevelStore((s) => s.levels);
  const { setSubjects } = useSubjectStore();

  // --- States ---
  const [quizTitle, setQuizTitle] = useState("");
  const [quizDuration, setQuizDuration] = useState(""); // حقل المدة الجديد
  const [selectedLevelId, setSelectedLevelId] = useState("");
  const [selectedSubjectId, setSelectedSubjectId] = useState("");
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [questions, setQuestions] = useState([
    { title: "", answers: ["", "", "", ""], correctAnswer: "" },
  ]);

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
      console.log(result);
      if (!result.status) throw new Error("Failed to fetch");
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
  };

  // --- Mutation ---
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

  // --- Handlers ---
  const addQuestion = () => {
    setQuestions([
      ...questions,
      { title: "", answers: ["", "", "", ""], correctAnswer: "" },
    ]);
  };

  const updateQuestion = (index: number, field: string, value: any) => {
    const newQuestions = [...questions];
    if (field === "title") newQuestions[index].title = value;
    setQuestions(newQuestions);
  };

  const updateAnswer = (qIndex: number, aIndex: number, value: string) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].answers[aIndex] = value;
    // الإجابة الرابعة هي الصحيحة دائماً حسب منطق الكود الحالي
    newQuestions[qIndex].correctAnswer = newQuestions[qIndex].answers[3];
    setQuestions(newQuestions);
  };

  const removeQuestion = (index: number) => {
    if (questions.length > 1) {
      setQuestions(questions.filter((_, i) => i !== index));
    } else {
      toast.error("يجب أن يحتوي الاختبار على سؤال واحد على الأقل");
    }
  };

  const handleSaveQuiz = () => {
    if (
      !quizTitle ||
      !selectedSubjectId ||
      !selectedCourseId ||
      !selectedLevelId ||
      !quizDuration
    ) {
      return toast.error("يرجى إكمال البيانات الأساسية وتحديد مدة الاختبار");
    }

    const isAllValid = questions.every(
      (q) => q.title.trim() !== "" && q.answers[3].trim() !== "",
    );
    if (!isAllValid) {
      return toast.error(
        "يرجى التأكد من كتابة نص الأسئلة والإجابة الصحيحة (الخيار الرابع)",
      );
    }

    const quizData = {
      title: quizTitle,
      duration: Number(quizDuration), // إرسال المدة كرقـم
      subjectId: selectedSubjectId,
      courseId: selectedCourseId,
      level: selectedLevelId,
      questions: questions,
    };

    uploadMutation.mutate(quizData);
  };

  return (
    <div className="min-h-screen absolute right-0 top-0 left-0 z-50 bg-[#f4f4f7] p-4 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div>
            <h1 className="text-2xl xl:text-3xl font-black text-slate-900 tracking-tight">
              إنشاء اختبار جديد
            </h1>
            <p className="text-slate-500 font-medium mt-1">
              قم بتنظيم أسئلتك وتحديد الوقت المناسب لطلابك.
            </p>
          </div>
           

          <MainButton isPending={uploadMutation.isPending} icon={uploadMutation.isPending ? Loader2 : Save} text="حفظ ونشر الاختبار" setStateFn={handleSaveQuiz} />
        </div>

        <div className="space-y-8">
          {/* Main Info Card */}
          <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Quiz Title */}
              <div className="space-y-2 lg:col-span-2">
                <label className="text-sm font-black text-slate-600 flex items-center gap-2">
                  عنوان الاختبار
                </label>
                <input
                  value={quizTitle}
                  onChange={(e) => setQuizTitle(e.target.value)}
                  type="text"
                  placeholder="مثال: مراجعة الوحدة الأولى - ميكانيكا"
                  className="w-full px-5 py-4 bg-slate-50 border-2 border-transparent rounded-xl focus:border-[#5700FF] focus:bg-white font-bold outline-none transition-all"
                />
              </div>

              {/* Quiz Duration */}
              <div className="space-y-2">
                <label className="text-sm font-black text-slate-600 flex items-center gap-2">
                  <Clock size={16} className="text-slate-400" /> مدة الاختبار
                  (بالدقائق)
                </label>
                <input
                  value={quizDuration}
                  onChange={(e) => setQuizDuration(e.target.value)}
                  type="number"
                  placeholder="مثال: 30"
                  className="w-full px-5 py-4 bg-slate-50 border-2 border-transparent rounded-xl focus:border-[#5700FF] focus:bg-white font-bold outline-none transition-all"
                />
              </div>

              {/* Level Select */}
              <div className="space-y-2">
                <label className="text-sm font-black text-slate-600">
                  المستوى الدراسي
                </label>
                <select
                  value={selectedLevelId}
                  onChange={(e) => setSelectedLevelId(e.target.value)}
                  className="w-full px-5 py-4 bg-slate-50 border-2 border-transparent rounded-xl focus:border-[#5700FF] focus:bg-white font-bold outline-none cursor-pointer appearance-none"
                >
                  <option value="">اختر المستوى</option>
                  {levels.map((l) => (
                    <option key={l._id} value={l._id}>
                      {l.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Subject Select */}
              <div className="space-y-2">
                <label className="text-sm font-black text-slate-600">
                  المادة الدراسية
                </label>
                <select
                  value={selectedSubjectId}
                  onChange={(e) => {
                    setSelectedSubjectId(e.target.value);
                    setSelectedCourseId("");
                  }}
                  className="w-full px-5 py-4 bg-slate-50 border-2 border-transparent rounded-xl focus:border-[#5700FF] focus:bg-white font-bold outline-none cursor-pointer appearance-none"
                >
                  <option value="">اختر المادة</option>
                  {subjects.map((s: any) => (
                    <option key={s._id} value={s._id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Course Select */}
              <div className="space-y-2">
                <label className="text-sm font-black text-slate-600">
                  الكورس المرتبط
                </label>
                <select
                  value={selectedCourseId}
                  onChange={(e) => setSelectedCourseId(e.target.value)}
                  disabled={!selectedSubjectId}
                  className="w-full px-5 py-4 bg-slate-50 border-2 border-transparent rounded-xl focus:border-[#5700FF] focus:bg-white font-bold outline-none cursor-pointer disabled:opacity-50 appearance-none"
                >
                  <option value="">اختر الكورس</option>
                  {availableCourses.map((c: any) => (
                    <option key={c._id} value={c._id}>
                      {c.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Questions Section */}
          <div className="space-y-6">
            {questions.map((q, qIndex) => (
              <div
                key={qIndex}
                className="bg-white p-6 md:p-8 rounded-2xl relative shadow-sm border border-slate-100 group transition-all hover:border-indigo-100"
              >
                <button
                  onClick={() => removeQuestion(qIndex)}
                  className="absolute left-6 top-6 text-slate-300 hover:text-red-500 transition-colors p-2"
                  title="حذف السؤال"
                >
                  <Trash2 size={20} />
                </button>

                <div className="flex items-start gap-4 mb-8">
                  <div className="w-10 h-10 shrink-0 bg-slate-900 text-white rounded-lg flex items-center justify-center font-black shadow-md">
                    {qIndex + 1}
                  </div>
                  <div className="flex-1">
                    <input
                      value={q.title}
                      onChange={(e) =>
                        updateQuestion(qIndex, "title", e.target.value)
                      }
                      type="text"
                      placeholder="اكتب نص السؤال هنا..."
                      className="w-full bg-transparent border-b-2 border-slate-100 focus:border-[#5700FF] py-2 text-xl font-black text-slate-800 outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {q.answers.map((ans, aIndex) => (
                    <div
                      key={aIndex}
                      className={`relative flex items-center rounded-xl border-2 transition-all ${
                        aIndex === 3 && ans !== ""
                          ? "border-green-500 bg-green-50/30"
                          : "border-slate-100 bg-slate-50/50 focus-within:border-indigo-200"
                      }`}
                    >
                      <span className="absolute right-4 text-xs font-black text-slate-400">
                        {String.fromCharCode(65 + aIndex)}
                      </span>
                      <input
                        value={ans}
                        onChange={(e) =>
                          updateAnswer(qIndex, aIndex, e.target.value)
                        }
                        type="text"
                        placeholder={
                          aIndex === 3
                            ? "الإجابة الصحيحة"
                            : `خيار خاطئ ${aIndex + 1}`
                        }
                        className="w-full pr-10 pl-10 py-4 bg-transparent font-bold text-slate-700 outline-none"
                      />
                      {aIndex === 3 && (
                        <div className="absolute left-4 w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Add Question Button */}
          <div className="flex justify-center pb-20">
            <button
              onClick={addQuestion}
              className="flex flex-col items-center gap-3 text-slate-400 hover:text-[#5700FF] transition-all group"
            >
              <div className="w-16 h-16 border-2 border-dashed border-slate-300 rounded-2xl flex items-center justify-center group-hover:border-[#5700FF] group-hover:bg-indigo-50 transition-all group-active:scale-90">
                <Plus size={28} />
              </div>
              <span className="font-black text-sm uppercase tracking-wider">
                إضافة سؤال
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateQuiz;
