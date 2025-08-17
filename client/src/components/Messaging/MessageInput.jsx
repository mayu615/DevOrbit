import React, { useState } from "react";

export default function MessageInput({ onSend, onTyping }) {
  const [text, setText] = useState("");

  const handleSend = () => {
    if (text.trim() === "") return;
    onSend(text);
    setText("");
    if (onTyping) onTyping(false); // stop typing on send
  };

  const handleChange = (e) => {
    setText(e.target.value);
    if (onTyping) onTyping(e.target.value.length > 0); // emit typing
  };

  return (
    <div className="flex mt-2">
      <input
        type="text"
        value={text}
        onChange={handleChange}
        onKeyDown={(e) => e.key === "Enter" && handleSend()}
        placeholder="Type a message..."
        className="flex-1 border p-2 rounded focus:ring-2 focus:ring-blue-400"
      />
      <button
        onClick={handleSend}
        className="ml-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Send
      </button>
    </div>
  );
}
