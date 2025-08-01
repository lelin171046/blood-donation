import React, { useState } from "react";
import Example from "./Example"; // Adjust import path accordingly

const AddBlogPage = () => {
  const [formData, setFormData] = useState({
    title: "",
    thumbnail: null,
    content: "",
  });

  const handleInputChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const blog = {
      ...formData,
      status: "draft", // default status
      createdAt: new Date().toISOString(),
    };
    console.log("Submitted Blog:", blog);
    // send blog to backend
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Add New Blog</h1>

      {/* Title */}
      <input
        type="text"
        placeholder="Blog Title"
        value={formData.title}
        onChange={(e) => handleInputChange("title", e.target.value)}
        className="w-full p-3 border border-gray-300 rounded mb-4"
      />

      {/* Thumbnail */}
      <input
        type="file"
        accept="image/*"
        onChange={(e) =>
          handleInputChange("thumbnail", URL.createObjectURL(e.target.files[0]))
        }
        className="mb-4"
      />

      {/* Rich Text Editor */}
      <Example
        value={formData.content}
        onChange={(value) => handleInputChange("content", value)}
        placeholder="Write your blog content here..."
      />

      {/* Submit */}
      <button
        onClick={handleSubmit}
        className="mt-4 px-6 py-2 bg-blue-600 text-white rounded"
      >
        Create Blog
      </button>
    </div>
  );
};

export default AddBlogPage;
