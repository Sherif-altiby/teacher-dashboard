import {
  BookOpen,
  FileQuestion,
  StickyNote,
  User,
  UserPlus,
  LayoutDashboard,
  Settings,
} from "lucide-react";

export const API = process.env.NEXT_PUBLIC_API_URL;

export const ROUTES = {
  DASHBOARD: "/",
  SUBJECTS: "/subjects",
  QUIZZES: "/quizzes",
  NOTES: "/notes",
  WAITING_LIST: "/waiting-list",
  PROFILE: "/profile",
  SETTINGS: "/settings",
};

export const MENUITEMS = [
  { name: "الرئيسية", icon: LayoutDashboard, link: ROUTES.DASHBOARD },
  { name: "المواد الدراسية", icon: BookOpen, link: ROUTES.SUBJECTS },
  { name: "الاختبارات", icon: FileQuestion, link: ROUTES.QUIZZES },
  { name: "المذكرات", icon: StickyNote, link: ROUTES.NOTES },
  { name: "قائمة الانتظار", icon: UserPlus, link: ROUTES.WAITING_LIST },
  { name: "الملف الشخصي", icon: User, link: ROUTES.PROFILE },
  // { name: "الاعدادت", icon: Settings, link: ROUTES.SETTINGS },
];

export const LEVELS = [
  { id: "", label: "الكل" },
  { id: "first", label: "الصف الأول" },
  { id: "second", label: "الصف الثاني" },
  { id: "third", label: "الصف الثالث" },
];
