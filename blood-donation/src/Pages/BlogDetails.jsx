import React from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "@/Hook/useAxiosPublic";

const BlogDetails = () => {
  const { id } = useParams(); // blog _id from URL
  const axiosPublic = useAxiosPublic();

  const { data: blog, isLoading, isError, error } = useQuery({
    queryKey: ["blog", id],
    queryFn: async () => {
      const res = await axiosPublic.get(`/all-blogs/${id}`);
      return res.data;
    },
    enabled: !!id,
  });

  if (isLoading) return <p className="text-center text-lg">Loading blog...</p>;
  if (isError) return <p className="text-center text-red-500">Error: {error.message}</p>;
  if (!blog) return <p className="text-center">No blog found</p>;

  return (
    <div className="max-w-3xl mx-auto p-6 border border-gray-200 rounded-lg shadow-sm bg-white">
      <h1 className="text-4xl font-bold mb-2 border-b pb-2">{blog.title}</h1>
      <p className="text-sm text-gray-500 mb-4">
        {new Date(blog.createdAt).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </p>
      <img
        src={blog.thumbnail}
        alt={blog.title}
        className="w-full h-80 object-cover rounded-lg border mb-6"
      />
      <div
        dangerouslySetInnerHTML={{ __html: blog.content }}
        className="prose max-w-none border-t pt-4"
      />
    </div>
  );
};

export default BlogDetails;
