// src/services/messageApi.js

// Get all messages for a conversation
export const getMessages = async (conversationId, token) => {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/messages/${conversationId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error("Failed to fetch messages");
  return res.json();
};

// Send a new message
export const sendMessage = async (conversationId, messageData, token) => {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/messages/${conversationId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(messageData),
  });
  if (!res.ok) throw new Error("Failed to send message");
  return res.json();
};

// Optional: delete a message
export const deleteMessage = async (messageId, token) => {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/messages/${messageId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error("Failed to delete message");
  return res.json();
};
