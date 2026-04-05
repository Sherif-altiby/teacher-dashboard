import { toast } from "sonner";
import { API } from "../constants";


export async function login(email: string, password: string) {
  try {
    const response = await fetch(`${API}/user/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
      credentials: "include"
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

export const checkAuth = async () => {
  try {
     const response = await fetch(`${API}/user/check`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include"
    });

    const data = await response.json()
    if(!data.teacher){
      location.href = "/login"
    }
  } catch (error) {
    location.href = '/login'
  }
}
