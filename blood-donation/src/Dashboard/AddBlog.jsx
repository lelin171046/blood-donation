import React, { useState } from "react";
import Example from "./Example"; // adjust path

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
    const plainText = new DOMParser().parseFromString(formData.content, 'text/html').body.textContent;
    const blog = {
      ...formData,
      plainTextContent: plainText,
      status: "draft",
      createdAt: new Date().toISOString(),
    };
    console.log("Submitted Blog:", blog);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Add New Blog</h1>

      <input
        type="text"
        placeholder="Blog Title"
        value={formData.title}
        onChange={(e) => handleInputChange("title", e.target.value)}
        className="w-full p-3 border border-gray-300 rounded mb-4"
      />

      <input
        type="file"
        accept="image/*"
        onChange={(e) =>
          handleInputChange("thumbnail", URL.createObjectURL(e.target.files[0]))
        }
        className="mb-4 w-full p-3 border border-gray-300 rounded"
      />

      {/* Rich Text Editor */}
      <Example
        value={formData.content}
        onChange={(value) => handleInputChange("content", value)}
        placeholder="Write your blog content here..."
      />

      <button
        onClick={handleSubmit}
        className="mt-4 bg-blue-600 text-white px-6 py-2 rounded"
      >
        Create Blog
      </button>
    </div>
  );
};

export default AddBlogPage;