import { API } from "../constants";

interface AddLessonPayload {
    title: string;
    description: string;
    videoUrl: string;
    courseId: string;
    subjectId: string;
}

export const addLessonService = async (payload: AddLessonPayload) => {
    const res = await fetch(`${API}/teacher/add-lesson`, {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok) {
        throw new Error(data.message || "حدث خطأ أثناء إضافة الدرس");
    }

    return data.data;
};