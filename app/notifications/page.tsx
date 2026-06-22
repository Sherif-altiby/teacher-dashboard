"use client";

import { useEffect } from "react";
import {
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { socket } from "../lib/socket";
import { deleteNotification, fetchNotifications } from "../services/notificationsService";
import NotificationSkeleton from "../skeleton/NotificationSkeleton";



type Notification = {
  _id: string;
  message: string;
  isRead: boolean;
  createdAt: string;
};

export default function NotificationPage({
  userId,
}: {
  userId: string;
}) {
  const queryClient = useQueryClient();

  // React Query
  const { data, isLoading } = useQuery({
    queryKey: ["notifications"],
    queryFn: fetchNotifications,
  });

  const notifications: Notification[] = data?.data || [];

  // Socket
  useEffect(() => {
    if (!userId) return;

    socket.emit("join", userId);

    socket.on("notification", (newNotification: Notification) => {
      queryClient.setQueryData(
        ["notifications"],
        (old: any) => {
          if (!old) return old;

          return {
            ...old,
            data: [newNotification, ...old.data],
          };
        }
      );
    });

    return () => {
      socket.off("notification");
    };
  }, [userId, queryClient]);

  // Delete
  const handleDelete = async (id: string) => {
    await deleteNotification(id);

    queryClient.setQueryData(["notifications"], (old: any) => {
      if (!old) return old;

      return {
        ...old,
        data: old.data.filter((n: Notification) => n._id !== id),
      };
    });
  };

  return (
    <div className="ctm-height">

      {isLoading ? (
        <NotificationSkeleton />
      ) : notifications.length === 0 ? (
        <div className="text-center text-gray-500 mt-10">
          لا يوجد اشعارت
        </div>
      ) : (
        <div className="container mx-auto px-4 lg:px-6 py-6 space-y-4">
          {notifications.map((n) => (
            <div
              key={n._id}
              className={`
                relative group transition-all duration-200
                border rounded-xl p-4 shadow-sm
                hover:shadow-md hover:-translate-y-[2px]
                ${n.isRead
                  ? "bg-white"
                  : "bg-blue-50 border-blue-200"
                }
              `}
            >
              {!n.isRead && (
                <span className="absolute top-4 left-3 w-2.5 h-2.5 bg-blue-500 rounded-full"></span>
              )}

              <div className="pl-6 pr-10">
                <p className="text-gray-800 font-medium">
                  {n.message}
                </p>

                <p className="text-xs text-gray-400 mt-1">
                  {new Date(n.createdAt).toLocaleString()}
                </p>
              </div>

              <button
                onClick={() => handleDelete(n._id)}
                className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition text-red-500 hover:text-red-700 text-sm"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}