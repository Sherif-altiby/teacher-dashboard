import { ResultItemInterface } from "@/app/types";
import { Calendar, ChevronLeft, UserIcon } from "lucide-react";

export default function ResultItem ({result} : {result: ResultItemInterface}) {
    

    return (
        <tr key={result._id} className="hover:bg-slate-50/50 transition-colors group">
        <td className="px-6 py-3.5">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-slate-100 overflow-hidden border border-slate-200">
             
                <div className="w-full h-full flex items-center justify-center text-slate-400"><UserIcon size={16} /></div>
            </div>
            <div>
              <p className="text-sm font-bold text-slate-700">{result.student?.name || "طالب غير معروف"}</p>
            </div>
          </div>
        </td>
        <td className="px-6 py-3.5 text-slate-500 text-xs font-medium">
          <div className="flex items-center gap-2">
            <Calendar size={12} />
            {new Date(result.createdAt).toLocaleDateString('ar-EG')}
          </div>
        </td>
        <td className="px-6 py-3.5">
          <span className="text-xs font-bold text-slate-600">
             {result.correctAnswersCount} من {result.totalQuestions}
          </span>
        </td>
        <td className="px-6 py-3.5">
          <div className="flex items-center gap-3">
            <div className="flex-1 h-1.5 w-16 bg-slate-100 rounded-full overflow-hidden hidden sm:block">
              <div 
                className={`h-full transition-all duration-1000 ${result.score >= 50 ? 'bg-emerald-500' : 'bg-red-500'}`}
                style={{ width: `${result.score}%` }}
              />
            </div>
            <span className={`font-black text-sm ${result.score >= 50 ? 'text-emerald-600' : 'text-red-600'}`}>
              {result.score}%
            </span>
          </div>
        </td>
        <td className="px-6 py-3.5">
           <button className="flex items-center gap-1 text-indigo-600 font-bold text-xs hover:underline">
             التفاصيل
             <ChevronLeft size={14} />
           </button>
        </td>
      </tr>
    )
}