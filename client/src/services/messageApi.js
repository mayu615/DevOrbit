import { request } from "./request";

// Get all messages for a conversation
export const getMessages = (conversationId, token) =>
  request(`/messages/${conversationId}`, "GET", null, token);

// Send a new message
export const sendMessage = (conversationId, messageData, token) =>
  request(`/messages/${conversationId}`, "POST", messageData, token);

// Delete a message
export const deleteMessage = (messageId, token) =>
  request(`/messages/${messageId}`, "DELETE", null, token);
