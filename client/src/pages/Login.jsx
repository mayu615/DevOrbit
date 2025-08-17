import React from "react";
import LoginForm from "../components/Auth/LoginForm.jsx";

export default function Login() {
  return (
    <div className="max-w-md mx-auto bg-white shadow-md rounded-lg p-6">
      <h1 className="text-2xl font-semibold mb-4 text-center text-teal-700">
        Login
      </h1>
      <LoginForm />
    </div>
  );
}
