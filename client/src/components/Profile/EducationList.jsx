// src/components/Profile/EducationList.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Pencil, Trash2 } from "lucide-react";
import EducationForm from "./EducationForm";
import { useAuth } from "../../hooks/useAuth"; // make sure path is correct

export default function EducationList() {
  const { user, setUser } = useAuth(); // ✅ you were using user/setUser but not imported
  const [education, setEducation] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Load user education on mount / update
  useEffect(() => {
    setEducation(user?.education || []);
  }, [user]);

  const handleAdd = async (edu) => {
    let updatedList;
    if (editingIndex !== null) {
      updatedList = [...education];
      updatedList[editingIndex] = edu;
    } else {
      updatedList = [...education, edu];
    }

    try {
      const res = await axios.put(
        "http://localhost:8000/api/users/me",
        { ...user, education: updatedList },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      setEducation(res.data.education);
      setUser(res.data); // update context
      setEditingIndex(null);
    } catch (err) {
      console.error("Education update failed:", err);
    }
  };

  const handleEdit = (index) => {
    setEditingIndex(index);
    setIsFormOpen(true);
  };

  const handleDelete = async (index) => {
    const updatedList = education.filter((_, i) => i !== index);
    try {
      const res = await axios.put(
        "http://localhost:8000/api/users/me",
        { ...user, education: updatedList },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      setEducation(res.data.education);
      setUser(res.data);
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Education</h2>
        <button
          onClick={() => {
            setEditingIndex(null);
            setIsFormOpen(true);
          }}
          className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
        >
          + Add
        </button>
      </div>

      {education.length === 0 ? (
        <p className="text-gray-500">No education added yet.</p>
      ) : (
        <ul className="space-y-3">
          {education.map((edu, index) => (
            <li
              key={index}
              className="border p-3 rounded flex justify-between items-center"
            >
              <div>
                <p className="font-medium">{edu.school}</p>
                <p className="text-sm text-gray-600">
                  {edu.degree} ({edu.year})
                </p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(index)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <Pencil size={18} />
                </button>
                <button
                  onClick={() => handleDelete(index)}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Modal for add/edit */}
      {isFormOpen && (
        <EducationForm
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          initialData={editingIndex !== null ? education[editingIndex] : null}
          onSave={handleAdd}
        />
      )}
    </div>
  );
}
