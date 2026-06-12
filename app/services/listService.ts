import { API } from "../constants";

export const getWaitingList = async ({
    page = 1,
    limit = 10,
    method = "",
}: {
    page?: number;
    limit?: number;
    method?: "vCash" | "instaPay" | "";
}) => {
    const params = new URLSearchParams();

    params.append("page", page.toString());
    params.append("limit", limit.toString());

    if (method) {
        params.append("method", method);
    }

    const response = await fetch(
        `${API}/teacher/get-list?${params.toString()}`,
        {
            method: "GET",
            credentials: "include",
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "فشل جلب قائمة الانتظار");
    }

    return data;
};

export const removeItemList = async ({ courseId, userId }: { courseId: string; userId: string }) => {
    try {
        const response = await fetch(`${API}/teacher/delete-list-item`, {
            method: "DELETE",
            credentials: 'include',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ courseId, userId }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "حدث خطأ أثناء الحذف");
        }

        return data.data;
    } catch (error: any) {
        // Re-throw the error so React Query's onError can catch it
        throw new Error(error.message || "حاول مرة اخري");
    }
}