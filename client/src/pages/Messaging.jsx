// src/pages/Messaging.jsx
import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import ChatWindow from "../components/Messaging/ChatWindow.jsx";
import MessageInput from "../components/Messaging/MessageInput.jsx";
import UserList from "../components/Messaging/UserList.jsx";

const SOCKET_URL = "http://localhost:8000"; // full URL required for socket

export default function Messaging() {
  const [users, setUsers] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const socketRef = useRef(null);

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  // ---------------- FETCH USERS ----------------
  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error(`Failed with status ${res.status}`);
      const data = await res.json();
      setUsers(data.filter(u => u._id !== user._id)); // exclude self
    } catch (err) {
      console.error("Error fetching users", err);
    }
  };

  // ---------------- FETCH CONVERSATIONS ----------------
  const fetchConversations = async () => {
    try {
      const { data } = await axios.get("/api/messages/conversations", {
        headers: { Authorization: `Bearer ${token}` },
      });

      // data.convos from backend
      setConversations(data.convos || []);
    } catch (err) {
      console.error("Error fetching conversations", err);
    }
  };

  // ---------------- FETCH MESSAGES ----------------
  const fetchMessages = async (conversationId) => {
    try {
      const { data } = await axios.get(`/api/messages/${conversationId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // data.messages from backend
      setMessages(data.messages || []);
    } catch (err) {
      console.error("Error fetching messages", err);
    }
  };

  // ---------------- CREATE / SELECT CONVERSATION ----------------
  const handleSelectUser = async (selectedUser) => {
    try {
      const { data } = await axios.post(
        "/api/messages/conversation",
        { otherUserId: selectedUser._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSelectedChat(data);
      fetchMessages(data._id);
      fetchConversations(); // refresh list
    } catch (err) {
      console.error("Error starting conversation", err);
    }
  };

  // ---------------- SEND MESSAGE ----------------
  const handleSendMessage = async (text) => {
    if (!text.trim() || !selectedChat) return;

    try {
      const receiverId = selectedChat.participants.find(p => p._id !== user._id)._id;

      const { data } = await axios.post(
        "/api/messages/send",
        {
          conversationId: selectedChat._id,
          receiverId,
          text,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessages(prev => [...prev, data]);

      // emit via socket
      if (socketRef.current) socketRef.current.emit("message:send", {
        conversationId: selectedChat._id,
        senderId: user._id,
        receiverId,
        text: data.text,
      });
    } catch (err) {
      console.error("Error sending message", err);
    }
  };

  // ---------------- SOCKET SETUP ----------------
  useEffect(() => {
    socketRef.current = io(SOCKET_URL);

    // user online event
    socketRef.current.emit("user:online", { userId: user._id });

    // receive real-time messages
    socketRef.current.on("message:receive", (msg) => {
      if (selectedChat && msg.conversation === selectedChat._id) {
        setMessages(prev => [...prev, msg]);
      }
      fetchConversations();
    });

    // presence updates
    socketRef.current.on("presence:update", ({ userId, online }) => {
      setUsers(prev =>
        prev.map(u => u._id === userId ? { ...u, online } : u)
      );
    });

    return () => socketRef.current.disconnect();
  }, [selectedChat]);

  // ---------------- INITIAL LOAD ----------------
  useEffect(() => {
    fetchUsers();
    fetchConversations();
  }, []);

  return (
    <div className="flex h-screen">
      <UserList users={users} onSelect={handleSelectUser} />

      <div className="flex-1 flex flex-col border-l">
        {selectedChat ? (
          <>
            <div className="p-4 border-b font-semibold">
              {selectedChat.participants
                .filter(p => p._id !== user._id)
                .map(p => p.name)
                .join(", ")}
            </div>
            <ChatWindow messages={messages} currentUserId={user._id} />
            <MessageInput onSend={handleSendMessage} />
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            Select a conversation or user to start chatting
          </div>
        )}
      </div>
    </div>
  );
}
