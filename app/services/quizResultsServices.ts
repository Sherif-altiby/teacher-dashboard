import { API } from "../constants";

export const getQuizResults = async (quizId: string) => {
    
    const response = await fetch(`${API}/teacher/quiz-results/${quizId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include"
    });
  
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || "فشل جلب النتائج");
    return result.data;
  };