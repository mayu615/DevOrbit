// src/pages/Messaging.jsx
import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { io } from "socket.io-client";
import { 
  Search, 
  MoreHorizontal, 
  Send, 
  Paperclip, 
  Smile, 
  Phone, 
  Video, 
  Info,
  Star,
  Archive,
  Trash2,
  Circle,
  MessageSquare,
  Bot,
  User,
  CheckCheck,
  Check
} from "lucide-react";

const SOCKET_URL = "http://localhost:8000";

// Avatar Component
const Avatar = ({ user, size = "md", showOnline = true }) => {
  const sizeClasses = {
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-sm", 
    lg: "w-12 h-12 text-base"
  };
  
  const initials = user?.name?.split(' ').map(n => n[0]).join('').toUpperCase() || '?';
  
  return (
    <div className="relative">
      <div className={`${sizeClasses[size]} bg-gradient-to-br from-teal-400 to-emerald-500 rounded-full flex items-center justify-center text-white font-semibold shadow-md`}>
        {user?.avatar ? (
          <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full object-cover" />
        ) : (
          initials
        )}
      </div>
      {showOnline && user?.online && (
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"
        />
      )}
    </div>
  );
};

// Message Bubble Component
const MessageBubble = ({ message, isOwn, isAI, currentUser }) => {
  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3 }}
      className={`flex items-end gap-3 mb-4 ${isOwn ? 'flex-row-reverse' : 'flex-row'}`}
    >
      {!isOwn && (
        <div className="flex-shrink-0">
          {isAI ? (
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-md">
              <Bot className="w-4 h-4 text-white" />
            </div>
          ) : (
            <Avatar user={{ name: message.senderName }} size="sm" showOnline={false} />
          )}
        </div>
      )}
      
      <div className={`max-w-[70%] ${isOwn ? 'items-end' : 'items-start'} flex flex-col`}>
        <motion.div
          className={`px-4 py-3 rounded-2xl shadow-sm ${
            isOwn 
              ? 'bg-gradient-to-r from-teal-500 to-emerald-500 text-white rounded-br-md' 
              : isAI
                ? 'bg-gradient-to-r from-blue-50 to-indigo-50 text-gray-800 border border-blue-200 rounded-bl-md'
                : 'bg-white text-gray-800 border border-gray-200 rounded-bl-md'
          }`}
          whileHover={{ scale: 1.01 }}
        >
          <p className="text-sm leading-relaxed">{message.text}</p>
        </motion.div>
        
        <div className={`flex items-center gap-2 mt-1 text-xs text-gray-500 ${isOwn ? 'flex-row-reverse' : 'flex-row'}`}>
          <span>{formatTime(message.createdAt)}</span>
          {isOwn && (
            <div className="flex items-center">
              {message.seenAt ? (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="text-teal-500"
                >
                  <CheckCheck className="w-3 h-3" />
                </motion.div>
              ) : message.deliveredAt ? (
                <Check className="w-3 h-3 text-gray-400" />
              ) : null}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

// Conversation Item Component
const ConversationItem = ({ conversation, isSelected, onClick, currentUserId }) => {
  const otherUser = conversation.participants?.find(p => p._id !== currentUserId);
  const timeAgo = (date) => {
    const diff = Date.now() - new Date(date).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 60) return `${minutes}m`;
    if (hours < 24) return `${hours}h`;
    return `${days}d`;
  };

  return (
    <motion.div
      whileHover={{ x: 4, backgroundColor: "rgba(15, 118, 110, 0.05)" }}
      className={`p-4 cursor-pointer border-l-4 transition-all duration-200 ${
        isSelected 
          ? 'bg-gradient-to-r from-teal-50 to-emerald-50 border-l-teal-500 shadow-sm' 
          : 'border-l-transparent hover:bg-gray-50'
      }`}
      onClick={() => onClick(conversation)}
    >
      <div className="flex items-center gap-3">
        <Avatar user={otherUser} showOnline={true} />
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-semibold text-gray-900 text-sm truncate">
              {otherUser?.name || 'Unknown User'}
            </h3>
            <span className="text-xs text-gray-500">
              {conversation.lastMessageAt && timeAgo(conversation.lastMessageAt)}
            </span>
          </div>
          
          <p className="text-xs text-teal-600 mb-1 truncate">
            {otherUser?.role || 'Professional'}
          </p>
          
          <p className="text-xs text-gray-500 truncate">
            {conversation.lastMessage || 'Start a conversation'}
          </p>
        </div>
        
        {conversation.unreadCount > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-5 h-5 bg-teal-500 text-white text-xs rounded-full flex items-center justify-center shadow-md"
          >
            {conversation.unreadCount}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

// Typing Indicator Component
const TypingIndicator = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    className="flex items-center gap-3 mb-4"
  >
    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-md">
      <Bot className="w-4 h-4 text-white" />
    </div>
    <div className="bg-white px-4 py-3 rounded-2xl rounded-bl-md border border-gray-200 shadow-sm">
      <div className="flex gap-1">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            animate={{ scale: [1, 1.5, 1] }}
            transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.2 }}
            className="w-2 h-2 bg-gray-400 rounded-full"
          />
        ))}
      </div>
    </div>
  </motion.div>
);

export default function Messaging() {
  const [users, setUsers] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || '{}');

  // AI Response Generator
  const getAIResponse = (message) => {
    const jobKeywords = [
      'job', 'career', 'position', 'role', 'salary', 'interview', 'skills', 
      'experience', 'qualification', 'hire', 'employment', 'work', 'company',
      'application', 'resume', 'cv', 'portfolio', 'opportunity', 'opening'
    ];
    
    const isJobRelated = jobKeywords.some(keyword => 
      message.toLowerCase().includes(keyword.toLowerCase())
    );
    
    if (!isJobRelated) {
      return "I can only assist with job-related inquiries. Please ask questions about positions, career opportunities, or professional development.";
    }
    
    const responses = [
      "That's a great question about your career! Let me help you with that opportunity.",
      "Based on your query, I'd recommend exploring our current openings that match your expertise.",
      "For this position, we typically look for candidates with relevant experience and strong problem-solving skills.",
      "I'd be happy to schedule a discussion about this role. What's your availability like?",
      "Your background sounds interesting! Could you tell me more about your experience in this field?",
      "This is definitely something we can explore further. What specific aspects of this role interest you most?",
      "Great timing! We have several positions that might align with your career goals."
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  };

  // Fetch functions
  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error(`Failed with status ${res.status}`);
      const data = await res.json();
      setUsers(data.filter(u => u._id !== user._id));
    } catch (err) {
      console.error("Error fetching users", err);
    }
  };

  const fetchConversations = async () => {
    try {
      const { data } = await axios.get("/api/messages/conversations", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setConversations(data.convos || []);
    } catch (err) {
      console.error("Error fetching conversations", err);
    }
  };

  const fetchMessages = async (conversationId) => {
    try {
      const { data } = await axios.get(`/api/messages/${conversationId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessages(data.messages || []);
    } catch (err) {
      console.error("Error fetching messages", err);
    }
  };

  const handleSelectUser = async (selectedUser) => {
    try {
      const { data } = await axios.post(
        "/api/messages/conversation",
        { otherUserId: selectedUser._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSelectedChat(data);
      fetchMessages(data._id);
      fetchConversations();
    } catch (err) {
      console.error("Error starting conversation", err);
    }
  };

  const handleSelectConversation = (conversation) => {
    setSelectedChat(conversation);
    fetchMessages(conversation._id);
  };

  const handleSendMessage = async () => {
    if (!messageText.trim() || !selectedChat) return;

    const tempMessage = {
      _id: Date.now().toString(),
      text: messageText,
      sender: user._id,
      senderName: user.name,
      createdAt: new Date(),
      deliveredAt: new Date()
    };

    setMessages(prev => [...prev, tempMessage]);
    const currentText = messageText;
    setMessageText("");
    setIsTyping(true);

    try {
      const receiverId = selectedChat.participants.find(p => p._id !== user._id)?._id;

      const { data } = await axios.post(
        "/api/messages/send",
        {
          conversationId: selectedChat._id,
          receiverId,
          text: currentText,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Update the temporary message with real data
      setMessages(prev => prev.map(msg => 
        msg._id === tempMessage._id ? data : msg
      ));

      // Emit via socket
      if (socketRef.current) {
        socketRef.current.emit("message:send", {
          conversationId: selectedChat._id,
          senderId: user._id,
          receiverId,
          text: data.text,
        });
      }

      // Simulate AI response after a delay
      setTimeout(() => {
        const aiResponse = {
          _id: (Date.now() + 1).toString(),
          text: getAIResponse(currentText),
          sender: 'ai_assistant',
          senderName: 'Career Assistant',
          createdAt: new Date(),
          isAI: true,
          deliveredAt: new Date()
        };
        
        setMessages(prev => [...prev, aiResponse]);
        setIsTyping(false);
        
        // You would also send this to your backend here
        // await sendAIMessage(aiResponse);
      }, 1500 + Math.random() * 1000);

    } catch (err) {
      console.error("Error sending message", err);
      setIsTyping(false);
      // Remove temporary message on error
      setMessages(prev => prev.filter(msg => msg._id !== tempMessage._id));
    }
  };

  // Socket setup
  useEffect(() => {
    if (!token || !user._id) return;

    socketRef.current = io(SOCKET_URL);

    socketRef.current.emit("user:online", { userId: user._id });

    socketRef.current.on("message:receive", (msg) => {
      if (selectedChat && msg.conversation === selectedChat._id) {
        setMessages(prev => [...prev, msg]);
      }
      fetchConversations();
    });

    socketRef.current.on("presence:update", ({ userId, online }) => {
      setUsers(prev =>
        prev.map(u => u._id === userId ? { ...u, online } : u)
      );
    });

    return () => socketRef.current?.disconnect();
  }, [selectedChat, token, user._id]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Initial load
  useEffect(() => {
    if (token) {
      fetchUsers();
      fetchConversations();
    }
  }, [token]);

  // Filter conversations
  const filteredConversations = conversations.filter(conv => {
    const otherUser = conv.participants?.find(p => p._id !== user._id);
    return otherUser?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
           otherUser?.role?.toLowerCase().includes(searchQuery.toLowerCase()) ||
           conv.lastMessage?.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const filteredUsers = users.filter(u =>
    u.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.role?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col shadow-lg">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-teal-50 to-emerald-50">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold text-gray-900">Messaging</h1>
            <div className="flex items-center gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 text-gray-500 hover:text-teal-600 hover:bg-teal-100 rounded-full transition-colors"
              >
                <MoreHorizontal className="w-5 h-5" />
              </motion.button>
            </div>
          </div>
          
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search messages"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
            />
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="px-4 py-3 border-b border-gray-200">
          <div className="flex gap-2">
            <motion.button
              whileHover={{ scale: 1.02 }}
              className="px-4 py-2 text-sm bg-gradient-to-r from-teal-500 to-emerald-500 text-white rounded-full shadow-md"
            >
              Focused
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
            >
              Unread
            </motion.button>
          </div>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto">
          <AnimatePresence>
            {filteredConversations.length > 0 && (
              <div className="border-b border-gray-100">
                <div className="p-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Recent Conversations
                </div>
                {filteredConversations.map((conversation) => (
                  <motion.div
                    key={conversation._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ConversationItem
                      conversation={conversation}
                      isSelected={selectedChat?._id === conversation._id}
                      onClick={handleSelectConversation}
                      currentUserId={user._id}
                    />
                  </motion.div>
                ))}
              </div>
            )}

            {filteredUsers.length > 0 && (
              <div>
                <div className="p-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Start New Conversation
                </div>
                {filteredUsers.map((userItem) => (
                  <motion.div
                    key={userItem._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                    whileHover={{ x: 4, backgroundColor: "rgba(15, 118, 110, 0.05)" }}
                    className="p-4 cursor-pointer hover:bg-gray-50 transition-all duration-200"
                    onClick={() => handleSelectUser(userItem)}
                  >
                    <div className="flex items-center gap-3">
                      <Avatar user={userItem} showOnline={true} />
                      <div>
                        <h3 className="font-medium text-gray-900 text-sm">
                          {userItem.name}
                        </h3>
                        <p className="text-xs text-teal-600">
                          {userItem.role || 'Professional'}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedChat ? (
          <>
            {/* Chat Header */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-white border-b border-gray-200 flex items-center justify-between shadow-sm"
            >
              <div className="flex items-center gap-3">
                <Avatar 
                  user={selectedChat.participants?.find(p => p._id !== user._id)} 
                  size="lg" 
                  showOnline={true} 
                />
                <div>
                  <h2 className="font-semibold text-gray-900">
                    {selectedChat.participants?.find(p => p._id !== user._id)?.name || 'Unknown User'}
                  </h2>
                  <p className="text-sm text-gray-500">
                    {selectedChat.participants?.find(p => p._id !== user._id)?.role || 'Professional'} • Available
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 text-gray-500 hover:text-teal-600 hover:bg-teal-50 rounded-full transition-colors"
                >
                  <Phone className="w-5 h-5" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 text-gray-500 hover:text-teal-600 hover:bg-teal-50 rounded-full transition-colors"
                >
                  <Video className="w-5 h-5" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 text-gray-500 hover:text-teal-600 hover:bg-teal-50 rounded-full transition-colors"
                >
                  <Info className="w-5 h-5" />
                </motion.button>
              </div>
            </motion.div>

            {/* Messages */}
            <div className="flex-1 p-4 overflow-y-auto bg-gradient-to-b from-gray-50 to-white">
              <div className="max-w-4xl mx-auto">
                {messages.map((message) => (
                  <MessageBubble
                    key={message._id}
                    message={message}
                    isOwn={message.sender === user._id}
                    isAI={message.isAI || message.sender === 'ai_assistant'}
                    currentUser={user}
                  />
                ))}
                
                <AnimatePresence>
                  {isTyping && <TypingIndicator />}
                </AnimatePresence>
                
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Message Input */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-white border-t border-gray-200 shadow-lg"
            >
              <div className="max-w-4xl mx-auto">
                <div className="flex items-end gap-3">
                  <div className="flex-1 bg-gray-100 rounded-3xl px-4 py-3 flex items-center gap-3 shadow-sm">
                    <input
                      type="text"
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      placeholder="Write a message..."
                      className="flex-1 bg-transparent outline-none text-sm placeholder-gray-500"
                    />
                    
                    <div className="flex items-center gap-2">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-1 text-gray-500 hover:text-teal-600 transition-colors"
                      >
                        <Paperclip className="w-4 h-4" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-1 text-gray-500 hover:text-teal-600 transition-colors"
                      >
                        <Smile className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </div>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleSendMessage}
                    disabled={!messageText.trim()}
                    className="p-3 bg-gradient-to-r from-teal-500 to-emerald-500 text-white rounded-full disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transition-all"
                  >
                    <Send className="w-5 h-5" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex-1 flex flex-col items-center justify-center text-center p-8"
          >
            <div className="w-24 h-24 bg-gradient-to-br from-teal-100 to-emerald-100 rounded-full flex items-center justify-center mb-6 shadow-lg">
              <MessageSquare className="w-12 h-12 text-teal-600" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              Your Messages
            </h2>
            <p className="text-gray-600 max-w-md">
              Send a message to start a conversation with professionals and get AI-powered career assistance.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}