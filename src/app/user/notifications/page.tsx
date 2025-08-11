"use client";
import { Notification } from "@/types/Notification";
import axios from "axios";
import { useEffect, useState } from "react";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const fetchNotifications = async () => {
    const response = await axios.get("/api/notifications");
    setNotifications(response.data.notifications);
  };
  useEffect(() => {
    fetchNotifications();
  }, []);
  return (
    <>
      <h1 className="text-4xl font-bold text-center uppercase">
        Notifications
      </h1>
      {notifications.length === 0 ? (
        <p className="text-center text-2xl mt-6 uppercase">
          No new notifications
        </p>
      ) : (
        <div className="mt-6 space-y-4">
          {notifications.map((notification, index: number) => (
            <div
              className="collapse collapse-arrow border border-base-300 bg-base-300"
              key={index}
            >
              <input type="radio" name="my-accordion-2" />
              <div className="collapse-title font-semibold text-lg">
                {notification.title}
              </div>
              <div className="collapse-content text-sm">
                {notification.message} -{" "}
                <span>{new Date(notification.sendAt).toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
