// src/components/Profile/EmploymentList.jsx
import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import EmploymentForm from "./EmploymentForm";

export default function EmploymentList() {
  const [employment, setEmployment] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const handleAdd = (emp) => {
    if (editingIndex !== null) {
      // update existing
      const updated = [...employment];
      updated[editingIndex] = emp;
      setEmployment(updated);
      setEditingIndex(null);
    } else {
      // add new
      setEmployment([...employment, emp]);
    }
  };

  const handleEdit = (index) => {
    setEditingIndex(index);
    setIsFormOpen(true);
  };

  const handleDelete = (index) => {
    const updated = employment.filter((_, i) => i !== index);
    setEmployment(updated);
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Employment</h2>
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

      {employment.length === 0 ? (
        <p className="text-gray-500">No employment added yet.</p>
      ) : (
        <ul className="space-y-3">
          {employment.map((emp, index) => (
            <li
              key={index}
              className="border p-3 rounded flex justify-between items-center"
            >
              <div>
                <p className="font-medium">
                  {emp.title} at {emp.company}
                </p>
                <p className="text-sm text-gray-600">
                  {emp.from} - {emp.to || "Present"}
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
        <EmploymentForm
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          initialData={editingIndex !== null ? employment[editingIndex] : null}
          onSave={handleAdd}
        />
      )}
    </div>
  );
}
