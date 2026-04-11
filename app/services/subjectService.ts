import { API } from "../constants";

export async function getTeacherSubjects(teacherId: string) {
    try {
        const response = await fetch(`${API}/user/get-teacher-subjects`, {
            method: "POST",
            credentials: 'include',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ teacherId }),
        })

        const data = await response.json();
          
        return await data.data;
    } catch (error) {
        throw new Error("فشل في جلب المواد الدراسية للمعلم");   
    }
}