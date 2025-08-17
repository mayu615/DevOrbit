import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../../contexts/AuthContext.jsx";
import { validateForm } from "../../utils/validateForm.js";
import Button from "../Shared/Button.jsx";
import Loader from "../Shared/Loader.jsx";

export default function RegisterForm() {
  const { register } = useAuthContext();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "developer", // default role
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");

    // Validate form
    const validationErrors = validateForm(form, {
      name: "required",
      email: "required|email",
      password: "required|min:6",
    });

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      await register(form);
      navigate("/"); // redirect after successful registration
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.message || err.message || "Registration failed. Try again.";
      setSubmitError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {submitError && (
        <div className="bg-red-100 text-red-700 px-3 py-2 rounded">
          {submitError}
        </div>
      )}

      <div>
        <label className="block mb-1 text-sm font-medium">Full Name</label>
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          autoComplete="name"
          className={`w-full border rounded px-3 py-2 focus:ring-2 focus:ring-teal-500 ${
            errors.name ? "border-red-500" : ""
          }`}
        />
        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
      </div>

      <div>
        <label className="block mb-1 text-sm font-medium">Email</label>
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          autoComplete="email"
          className={`w-full border rounded px-3 py-2 focus:ring-2 focus:ring-teal-500 ${
            errors.email ? "border-red-500" : ""
          }`}
        />
        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
      </div>

      <div>
        <label className="block mb-1 text-sm font-medium">Password</label>
        <input
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          autoComplete="new-password"
          className={`w-full border rounded px-3 py-2 focus:ring-2 focus:ring-teal-500 ${
            errors.password ? "border-red-500" : ""
          }`}
        />
        {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
      </div>

      <div>
        <label className="block mb-1 text-sm font-medium">Role</label>
        <select
          name="role"
          value={form.role}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-teal-500"
        >
          <option value="developer">Developer</option>
          <option value="recruiter">Recruiter</option>
        </select>
      </div>

      <Button type="submit" variant="primary" className="w-full" disabled={loading}>
        {loading ? <Loader size={20} /> : "Register"}
      </Button>
    </form>
  );
}
