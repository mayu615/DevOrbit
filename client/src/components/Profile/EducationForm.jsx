// src/components/Profile/EducationForm.jsx
import { useState, useEffect } from "react";
import Modal from "../Shared/Modal";

export default function EducationForm({ isOpen, onClose, initialData, onSave }) {
  const [form, setForm] = useState({
    school: "",
    degree: "",
    year: "",
  });

  // agar edit mode h to initial data load kro
  useEffect(() => {
    if (initialData) {
      setForm(initialData);
    } else {
      setForm({ school: "", degree: "", year: "" });
    }
  }, [initialData]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form); // parent (EducationList) ko bhejo
    onClose(); // modal band
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2 className="text-xl font-semibold mb-4">
        {initialData ? "Edit Education" : "Add Education"}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="school"
          placeholder="School / College"
          value={form.school}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="text"
          name="degree"
          placeholder="Degree"
          value={form.degree}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="text"
          name="year"
          placeholder="Passing Year"
          value={form.year}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
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
