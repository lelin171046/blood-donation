import React, { useState } from "react";
import Example from "./Example"; // adjust path
import useAxiosSecure from "@/Hook/useAxiosSecure";
import toast from "react-hot-toast";
import useAxiosPublic from "@/Hook/useAxiosPublic";
import { uploadToImgBB } from "@/Share/ImageUpload";

// const img_hosting_key = import.meta.env.client.IMGBB_API_KEY;
// const img_hosting_api = `https://api.imgbb.com/1/upload?key=${img_hosting_key}`;

const AddBlogPage = () => {
  const [formData, setFormData] = useState({
    title: "",
    thumbnail: null,
    content: "",
  });
  const axiosSecure = useAxiosSecure();
  const axiosPublic = useAxiosPublic()

  const handleInputChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

 const handleSubmit = async (e) => {
  e.preventDefault();

  if (!formData.thumbnail) {
    toast.error("Please select an image");
    return;
  }

  // Prepare image for upload
   const uploadedImage = await uploadToImgBB(formData.thumbnail);
      console.log("ImgBB uploaded:", uploadedImage);
  // console.log(res.data);

  const plainText = new DOMParser()
    .parseFromString(formData.content, "text/html")
    .body.textContent;

  const blog = {
    title: formData.title,
    thumbnail: uploadedImage.url, // URL from imgbb
    content: formData.content,
    plainTextContent: plainText,
    status: "draft",
    createdAt: new Date().toISOString(),
  };

  const blogRes = await axiosSecure.post("/add-blog", blog);

  if (blogRes.data.insertedId) {
    toast.success("Add success");
    console.log("Submitted Blog:", blog);
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
         onChange={(e) =>
    handleInputChange("thumbnail", e.target.files[0]) // store file directly
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