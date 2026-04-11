"use client";

import { login } from "@/app/services/authService";
import { useAuthStore } from "@/app/store/authStore";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

export default function useLoginMutation() {
  const router = useRouter();

  const { setAuth } = useAuthStore();

  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      login(email, password),

    onSuccess: (data) => {
      
       
      setAuth(data.data.teacher);
      location.href = '/'

      setTimeout(() => {
        router.push("/");
      }, 1000);
    },

    onError: (error: any) => {},
  });
}
