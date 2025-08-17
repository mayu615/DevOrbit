import React from "react";

export default function UserList({ users, onSelect }) {
  return (
    <div className="w-48 border p-2 rounded overflow-y-auto h-96 bg-white">
      {users.map((user) => (
        <div
          key={user._id}
          className="flex items-center justify-between p-2 cursor-pointer hover:bg-gray-200 rounded"
          onClick={() => onSelect(user)}
        >
          <span>{user.name}</span>
          {user.online && (
            <span className="w-2 h-2 bg-green-500 rounded-full ml-2"></span>
          )}
        </div>
      ))}
    </div>
  );
}
