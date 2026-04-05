import { API } from "@/app/constants";
import { useQuery } from "@tanstack/react-query";


export const useUser = () => {
  return useQuery({
    queryKey: ["auth-user"],
    queryFn: async () => {
      const res = await fetch(`${API}/user/check`, { credentials: "include" });
      if (!res.ok) throw new Error("Not authenticated");
      return res.json();
    },
    retry: false, 
    staleTime: 1000 * 60 * 5, 
  });
};