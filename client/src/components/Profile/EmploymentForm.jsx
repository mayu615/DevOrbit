// src/components/Profile/EmploymentForm.jsx
import { useState, useEffect } from "react";
import Modal from "../Shared/Modal";

export default function EmploymentForm({ isOpen, onClose, initialData, onSave }) {
  const [form, setForm] = useState({
    company: "",
    title: "",
    from: "",
    to: "",
  });

  // agar edit mode h to initial data load kro
  useEffect(() => {
    if (initialData) {
      setForm(initialData);
    } else {
      setForm({ company: "", title: "", from: "", to: "" });
    }
  }, [initialData]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Employment saved:", form); // 🔹 Console log
    onSave(form); // parent (EmploymentList) ko bhejo
    onClose(); // modal band
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2 className="text-xl font-semibold mb-4">
        {initialData ? "Edit Employment" : "Add Employment"}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="company"
          placeholder="Company"
          value={form.company}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="text"
          name="title"
          placeholder="Job Title"
          value={form.title}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="text"
          name="from"
          placeholder="From (Year/Date)"
          value={form.from}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="text"
          name="to"
          placeholder="To (Year/Date or Present)"
          value={form.to}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          {initialData ? "Update" : "Save"}
        </button>
      </form>
    </Modal>
  );
}
