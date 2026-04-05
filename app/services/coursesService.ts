import { API } from "../constants";

export const subjectCourses = async (subId: string, level?: string) => {
  try {
    const url = new URL(`${API}/teacher/get-courses/${subId}`);
    if (level) url.searchParams.append("level", level);

    const res = await fetch(url.toString(), {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });

    const data = await res.json();
    return data.data;
  } catch (error) {
    console.error("Error fetching courses:", error);
    return null;
  }
};

export const addCourse = async (courseData: {
  title: string;
  subjectId: string;
  price: number;
  offer: number;
  level: string;
  avatar: File;
  status: string;
}) => {
  const formData = new FormData();

  formData.append("title", courseData.title);
  formData.append("subjectId", courseData.subjectId);
  formData.append("price", courseData.price.toString());
  formData.append("offer", courseData.offer.toString());
  formData.append("level", courseData.level);
  formData.append("avatar", courseData.avatar);
  formData.append("status", courseData.status);

  const response = await fetch(`${API}/teacher/add-course`, {
    method: "POST",
    body: formData,
    credentials: "include",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "حدث خطأ أثناء إضافة الكورس");
  }

  return data;
};

export const deleteCourse = async (id: string) => {
  try {
    const response = await fetch(`${API}/teacher/delete-course/${id}`, {
      method: "DELETE",
      credentials: "include",
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "حدث خطأ أثناء إضافة الكورس");
    }

    return data;
  } catch (error: any) {
    throw new Error(error.message || "Server Error");
  }
};

export const getCourseLessons = async (id: string) => {
  const response = await fetch(`${API}/teacher/get-course-lessons/${id}`, {
    method: "GET",
    credentials: "include",
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "حدث خطأ أثناء جلب الدروس");
  }
  return data.data;
};


