import { API } from "../constants";

export const teacherUpdateAvatar = async (image: File) => {
  const data = new FormData();
  data.append('avatar', image);

  try {
    const res = await fetch(`${API}/teacher/change-avatar`, {
      method: "POST",
      credentials: "include",
      body: data 
    });

    const result = await res.json();

    if (!res.ok) {
      throw new Error(result.message || "حدث خطأ أثناء تحديث الصورة");
    }

    return result; 
  } catch (error: any) {
    console.error("Avatar Update Error:", error);
    return {
      status: false,
      message: error.message || "فشل الاتصال بالخادم"
    };
  }
};