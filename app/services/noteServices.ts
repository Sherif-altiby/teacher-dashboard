import { API } from "../constants";

export const fetchTeacherNotes = async () => {
    const res = await fetch(`${API}/teacher/teacher-pdf`, {
        credentials: "include"
    });

    if (!res.ok) throw new Error('Failed to fetch data');

    const result = await res.json();
    return result.data;
};