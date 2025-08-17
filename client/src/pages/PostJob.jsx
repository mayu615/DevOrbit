// src/pages/PostJob.jsx
import React, { useState } from "react";
import { useAuthContext } from "../contexts/AuthContext.jsx";
import Button from "../components/Shared/Button.jsx";
import Loader from "../components/Shared/Loader.jsx";
import { createJob } from "../services/jobApi.js";
import { toast } from "react-hot-toast";
import { validateForm } from "../utils/validateForm.js";

export default function PostJob() {
  const { token } = useAuthContext(); // Auth token from context
  const [formData, setFormData] = useState({
    title: "",
    company: "",
    location: "",
    salary: "",
    description: "",
    type: "Full-time",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors({ ...errors, [name]: "" }); // Clear error on field change
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      toast.error("Please login first to post a job!");
      return;
    }

    // Validate form fields
    const validationErrors = validateForm(formData, {
      title: "required",
      company: "required",
      location: "required",
      description: "required|min:10",
      salary: "min:0",
    });

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);

    try {
      const res = await createJob(formData, token);
      toast.success("Job posted successfully!");
      console.log("Job created:", res);

      // Reset form
      setFormData({
        title: "",
        company: "",
        location: "",
        salary: "",
        description: "",
        type: "Full-time",
      });
    } catch (error) {
      toast.error(error.message || "Failed to post job");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-xl p-6">
      <h2 className="text-2xl font-bold mb-4 text-teal-600">Post a Job</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="title"
          placeholder="Job Title"
          value={formData.title}
          onChange={handleChange}
          className={`w-full border rounded-md px-3 py-2 ${errors.title ? "border-red-500" : ""}`}
        />
        {errors.title && <p className="text-red-500 text-sm">{errors.title}</p>}

        <input
          type="text"
          name="company"
          placeholder="Company Name"
          value={formData.company}
          onChange={handleChange}
          className={`w-full border rounded-md px-3 py-2 ${errors.company ? "border-red-500" : ""}`}
        />
        {errors.company && <p className="text-red-500 text-sm">{errors.company}</p>}

        <input
          type="text"
          name="location"
          placeholder="Location"
          value={formData.location}
          onChange={handleChange}
          className={`w-full border rounded-md px-3 py-2 ${errors.location ? "border-red-500" : ""}`}
        />
        {errors.location && <p className="text-red-500 text-sm">{errors.location}</p>}

        <input
          type="number"
          name="salary"
          placeholder="Salary (per month)"
          value={formData.salary}
          onChange={handleChange}
          className={`w-full border rounded-md px-3 py-2 ${errors.salary ? "border-red-500" : ""}`}
        />
        {errors.salary && <p className="text-red-500 text-sm">{errors.salary}</p>}

        <textarea
          name="description"
          placeholder="Job Description"
          value={formData.description}
          onChange={handleChange}
          className={`w-full border rounded-md px-3 py-2 ${errors.description ? "border-red-500" : ""}`}
          rows={4}
        />
        {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}

        <select
          name="type"
          value={formData.type}
          onChange={handleChange}
          className="w-full border rounded-md px-3 py-2"
        >
          <option value="Full-time">Full-time</option>
          <option value="Part-time">Part-time</option>
          <option value="Internship">Internship</option>
          <option value="Contract">Contract</option>
        </select>

        <Button type="submit" variant="primary" disabled={loading}>
          {loading ? <Loader size={20} /> : "Post Job"}
        </Button>
      </form>
    </div>
  );
}
