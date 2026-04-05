import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { API } from '../constants';

// 1. تعريف الهياكل (Types/Interfaces)
interface Course {
  _id: string;
  title: string;
}

interface Subject {
  _id: string;
  name: string;
  courses: Course[];
  teachers: string[];
  image: string;
  __v?: number;
}

interface SubjectState {
  subjects: Subject[];
  loading: boolean;
  error: string | null;
  
  // العمليات (Actions)
  setSubjects: (subjects: Subject[]) => void;
}


export const useSubjectStore = create<SubjectState>()(
  persist(
    (set) => ({
      subjects: [],
      loading: false,
      error: null,

      setSubjects: (subjects) => set({ subjects, error: null }),


      
    }),
    {
      name: 'teacher-subjects-storage', // اسم المفتاح في LocalStorage
      storage: createJSONStorage(() => localStorage), // تحديد مكان التخزين
    }
  )
);