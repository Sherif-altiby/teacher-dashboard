import { toast } from "sonner";
import { API } from "../constants";


export async function login(email: string, password: string) {
  try {
    const response = await fetch(`/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      toast.error(data.message || "فشل عملية تسجيل الدخول");
      throw new Error(data.message || "فشل عملية تسجيل الدخول");
    }

    toast.success("تم تسجيل الدخول بنجاح!");

    return data;
  } catch (error: any) {
    throw error;
  }
}


export const getTeacherMe = async () => {
  const res = await fetch(`${API}/teacher/me`, {
    method: "GET",
    credentials: "include",
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to fetch teacher data");
  }

  return data.data;
};