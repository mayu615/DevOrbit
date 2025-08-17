import React from "react";
import RegisterForm from "../components/Auth/RegisterForm.jsx";

export default function Register() {
  return (
    <div className="max-w-md mx-auto bg-white shadow-md rounded-lg p-6">
      <h1 className="text-2xl font-semibold mb-4 text-center text-teal-700">
        Create Account
      </h1>
      <RegisterForm />
    </div>
  );
}
