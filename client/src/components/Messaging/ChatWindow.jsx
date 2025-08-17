import React, { useEffect, useRef } from "react";

export default function ChatWindow({ messages = [], currentUserId }) {
  const scrollRef = useRef();

  // Auto-scroll to latest message
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Ensure messages is always an array
  const msgs = Array.isArray(messages) ? messages : [];

  return (
    <div className="flex-1 p-4 overflow-y-auto h-96 border rounded bg-white flex flex-col">
      {msgs.map((msg, idx) => (
        <div
          key={idx}
          className={`mb-2 p-2 rounded max-w-xs ${
            msg.sender === currentUserId
              ? "bg-blue-100 self-end text-right"
              : "bg-gray-100 self-start text-left"
          }`}
        >
          <strong>{msg.senderName || msg.sender}:</strong> {msg.text}
          <div className="text-xs text-gray-400">
            {msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString() : ""}
          </div>
        </div>
      ))}
      <div ref={scrollRef}></div>
    </div>
  );
}
