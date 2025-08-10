import React from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "@/Hook/useAxiosPublic";


const BlogDetails = () => {
  const { id } = useParams(); // blog _id from URL
  const axiosPublic = useAxiosPublic();

  const { data: blog, isLoading, isError, error } = useQuery({
    queryKey: ["blog", id], // unique cache for each blog
    queryFn: async () => {
      const res = await axiosPublic.get(`/all-blogs/${id}`); // your API endpoint
      return res.data;
    },
    enabled: !!id, // only run if id exists
  });

  if (isLoading) return <p>Loading blog...</p>;
  if (isError) return <p>Error: {error.message}</p>;
  if (!blog) return <p>No blog found</p>;

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">{blog.title}</h1>
      <img
        src={blog.thumbnail}
        alt={blog.title}
        className="w-full h-80 object-cover rounded mb-6"
      />
      <div
        dangerouslySetInnerHTML={{ __html: blog.content }}
        className="prose max-w-none"
      />
    </div>
  );
};

export default BlogDetails;
