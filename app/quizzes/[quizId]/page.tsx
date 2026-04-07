"use client";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { 
  Users, 
  Trophy, 
  Target, 
  ArrowRight,
  Loader
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { getQuizResults } from "@/app/services/quizResultsServices";
import StatCard from "@/app/components/quiz/StatCard";
import ResultItem from "@/app/components/quiz/ResultItem";
import { ResultItemInterface } from "@/app/types";

const QuizResultsPage = () => {
  const { quizId } = useParams();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["quiz-results", quizId],
    queryFn: () => getQuizResults(quizId as string),
    enabled: !!quizId,
  });

  if (isLoading) return <div className="min-h-screen flex items-center justify-center"><Loader /></div>;

  
  const avgScore = data.length > 0 
    ? (data.reduce((acc: number, curr: any) => acc + curr.score, 0) / data.length).toFixed(1) 
    : 0;
  const maxScore = data.length > 0 ? Math.max(...data.map((r: any) => r.score)) : 0;

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <Link href="/quizzes" className="flex items-center gap-2 text-slate-400 hover:text-indigo-600 transition-colors mb-4 text-sm font-bold">
            <ArrowRight size={18} />
            العودة للاختبارات
          </Link>
          <h1 className="text-3xl font-black text-slate-900">نتائج الاختبار</h1>
          <p className="text-slate-500 mt-1">تحليل أداء الطلاب وتفاصيل الإجابات</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-10">
        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <StatCard 
            icon={<Users className="text-blue-600" />} 
            label="إجمالي المشاركين" 
            value={data.length} 
            color="bg-blue-50" 
          />
          <StatCard 
            icon={<Target className="text-emerald-600" />} 
            label="متوسط الدرجات" 
            value={`${avgScore}%`} 
            color="bg-emerald-50" 
          />
          <StatCard 
            icon={<Trophy className="text-amber-600" />} 
            label="أعلى درجة" 
            value={`${maxScore}%`} 
            color="bg-amber-50" 
          />
        </div>

        {/* Results Table */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-8 border-b border-slate-50 flex justify-between items-center">
            <h2 className="text-xl font-bold text-slate-800 text-right">قائمة الطلاب</h2>
            <div className="text-sm text-slate-400 font-medium">عرض {data.length} نتيجة</div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-right">
              <thead className="bg-slate-50/50 text-slate-400 text-xs uppercase tracking-wider">
                <tr>
                  <th className="px-8 py-4 font-bold">الطالب</th>
                  <th className="px-8 py-4 font-bold">التاريخ</th>
                  <th className="px-8 py-4 font-bold">الإجابات الصحيحة</th>
                  <th className="px-8 py-4 font-bold">الدرجة النهائية</th>
                  <th className="px-8 py-4 font-bold">الحالة</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {data.map((result: ResultItemInterface) => (
                 <ResultItem result={result} key={result._id}  />
                ))}
              </tbody>
            </table>
            
            {data.length === 0 && (
              <div className="py-20 text-center text-slate-400">
                <p>لا توجد نتائج مسجلة لهذا الاختبار حتى الآن.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

 

export default QuizResultsPage;