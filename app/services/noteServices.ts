import { API } from "../constants";

export const fetchTeacherNotes = async () => {
    const res = await fetch(`${API}/teacher/teacher-pdf`, {
        credentials: "include"
    });

    if (!res.ok) throw new Error('Failed to fetch data');

    const result = await res.json();
    return result.data;
};


export const uploadPdfService = async (formData: FormData) => {
    const response = await fetch(`${API}/teacher/upload-pdf`, {
        method: "POST",
        credentials: "include",
        body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "حدث خطأ أثناء رفع الملف");
    }

    return data;
};