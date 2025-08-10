import React, { useState } from "react";
import Example from "./Example"; 
import useAxiosSecure from "@/Hook/useAxiosSecure";
import toast from "react-hot-toast";
import { uploadToImgBB } from "@/Share/ImageUpload";

const AddBlogPage = () => {
  const [formData, setFormData] = useState({
    title: "",
    thumbnail: null,
    content: "",
  });
  const [isLoading, setIsLoading] = useState(false); // <-- loading state
  const axiosSecure = useAxiosSecure();

  const handleInputChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.thumbnail) {
      toast.error("Please select an image");
      return;
    }

    try {
      setIsLoading(true); // start loading

      // Upload image
      const uploadedImage = await uploadToImgBB(formData.thumbnail);

      const plainText = new DOMParser()
        .parseFromString(formData.content, "text/html")
        .body.textContent;

      const blog = {
        title: formData.title,
        thumbnail: uploadedImage.url,
        content: formData.content,
        plainTextContent: plainText,
        status: "draft",
        createdAt: new Date().toISOString(),
      };

      const blogRes = await axiosSecure.post("/add-blog", blog);

      if (blogRes.data.insertedId) {
        toast.success("Blog added successfully");
        setFormData({ title: "", thumbnail: null, content: "" });
      }
    } catch (error) {
      toast.error("Failed to add blog");
      console.error(error);
    } finally {
      setIsLoading(false); // stop loading
    }
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
        onChange={(e) => handleInputChange("thumbnail", e.target.files[0])}
        className="mb-4 w-full p-3 border border-gray-300 rounded"
      />

      <Example
        value={formData.content}
        onChange={(value) => handleInputChange("content", value)}
        placeholder="Write your blog content here..."
      />

      <button
        onClick={handleSubmit}
        disabled={isLoading} // disable while loading
        className={`mt-4 px-6 py-2 rounded text-white ${
          isLoading ? "bg-gray-500 cursor-not-allowed" : "bg-blue-600"
        }`}
      >
        {isLoading ? "Uploading..." : "Create Blog"}
      </button>
    </div>
  );
};

export default AddBlogPage;
