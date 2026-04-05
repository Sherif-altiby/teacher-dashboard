"use client";

import { useQuery } from "@tanstack/react-query";
import SubjectCard from "../components/subject/SubjectCard";
import { getTeacherSubjects } from "../services/subjectService";
import { useAuthStore } from "../store/authStore";
import SubjectCardSkeleton from "../skeleton/SubjectSkeleton";
import { Subject } from "../types";

const SubjectsPage = () => {
  const user = useAuthStore((state) => state.user);

  const {
    data: subjects,
    isLoading,
  } = useQuery({
    queryKey: ["teacher-subjects", user?._id],
    queryFn: () => getTeacherSubjects(user!._id), 
    enabled: !!user?._id,
    staleTime: 1000 * 60 * 5,
  });

 
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 p-6">
      {isLoading ? (
         Array.from({ length: 3 }).map((_, i) => (
          <SubjectCardSkeleton key={i} />
        ))
      ) : (
         subjects?.map((subject: Subject) => (
          <SubjectCard
            image={subject.image}
            title={subject.name}
            key={subject._id}
            subId={subject._id}
          />
        ))
      )}
      
       {!isLoading && subjects?.length === 0 && (
        <div className="col-span-full text-center py-20 text-slate-400">
          لا يوجد مواد دراسية مسجلة حالياً.
        </div>
      )}
    </div>
  );
};

export default SubjectsPage;