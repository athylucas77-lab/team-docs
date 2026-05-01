"use client";

import { useState } from "react";

export default function CreateNCRPage() {
  const [role] = useState("editor"); // admin | editor | viewer
  const canEdit = role === "admin" || role === "editor";

  const [ncr, setNcr] = useState({
    title: "",
    description: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setNcr({ ...ncr, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("NCR saved");
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Create NCR</h1>

      {!canEdit && (
        <p className="text-red-500">
          You do not have permission to edit NCR.
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="title"
          placeholder="NCR Title"
          value={ncr.title}
          onChange={handleChange}
          disabled={!canEdit}
          className="w-full border p-2"
        />

        <textarea
          name="description"
          placeholder="Description"
          value={ncr.description}
          onChange={handleChange}
          disabled={!canEdit}
          className="w-full border p-2"
        />

        {canEdit && (
          <button className="bg-blue-600 text-white px-4 py-2 rounded">
            Save NCR
          </button>
        )}
      </form>
    </div>
  );
}