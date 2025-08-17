import React, { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import axios from "axios";

const SOCKET_URL = "http://localhost:8000";
const API_URL = "http://localhost:8000/api";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const socketRef = useRef(null);

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  const fetchNotifications = async () => {
  try {
    const res = await axios.get(`${import.meta.env.VITE_API_URL}/notifications`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setNotifications(res.data);
  } catch (err) {
    console.error("Error fetching notifications", err);
  }
};

  useEffect(() => {
    fetchNotifications();

    socketRef.current = io(SOCKET_URL, {
      query: { userId: user?._id },
    });

    socketRef.current.on("newNotification", (notif) => {
      setNotifications((prev) => [notif, ...prev]);
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-lg font-semibold mb-4">Notifications</h2>
      {notifications.length > 0 ? (
        notifications.map((n) => (
          <div
            key={n._id}
            className="p-3 mb-2 border rounded hover:bg-gray-50"
          >
            {n.message}
          </div>
        ))
      ) : (
        <p className="text-gray-500">No notifications</p>
      )}
    </div>
  );
}
