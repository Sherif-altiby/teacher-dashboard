export interface UserCourse {
  _id: string;
  title: string;
}

export interface UserSubject {
  _id: string;
  name: string;
  courses: UserCourse[];
}


export interface User {
  _id: string;
  name: string;
  email: string;
  avatar: string;
  role: string;
  phone: string;
  about: string;
  subjects: UserSubject[];
  isBlocked: boolean;
  notifications: any[];
}

export interface Subject {
  _id: string;
  name: string;
  image: string;
  teachers: [id: string];
  courses: [id: string];
}

export interface Course {
  _id: string;
  title: string;
  subject: {
    _id: string,
    name: string
  }
  image: string;
  price: number,
  offer: number,
  level: string,
  status: string
}

export interface AuthState {
  user: User | null;
  setAuth: (user: User) => void;
  logout: () => void;
}


export interface ListItem {
  _id: string;
  user: {
    _id: string;
    name: string;
    email: string;
    level: string;
  };
  course: {
    _id: string;
    title: string;
    image: string
  };
  image: string;
  createdAt: Date
}

export interface ResultItemInterface {
  _id: string;
  quiz: string;
  count: number;
  correctAnswersCount: number;
  course: number;
  score: number;
  totalQuestions: number;
  student: {
    _id: string;
    name: string
  }
  createdAt: Date
}

export interface Note {
  _id: string;
  teacher: string;
  subject: {
    _id: string;
    name: string;
  }
  course: {
    _id: string;
    title: string;
  }
  title: string;
  level: string;
  pdf: string;
  createdAt: Date
}