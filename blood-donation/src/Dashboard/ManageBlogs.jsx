import useAxiosSecure from "@/Hook/useAxiosSecure";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// for auth-protected API calls

const ManageBlogs = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  // 1️⃣ Fetch blogs
  const { data: blogs = [], isLoading, error } = useQuery({
    queryKey: ["blogs"],
    queryFn: async () => {
      const res = await axiosSecure.get("/all-blogs");
      return res.data;
    },
  });

  // 2️⃣ Delete blog mutation
  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      await axiosSecure.delete(`/all-blogs/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["blogs"]); // refresh list
    },
  });

  // 3️⃣ Change status mutation
  const statusMutation = useMutation({
    mutationFn: async ({ id, status }) => {
      await axiosSecure.patch(`/blogs/${id}`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["blogs"]); // refresh list
    },
  });

  if (isLoading) return <p>Loading blogs...</p>;
  if (error) return <p>Failed to load blogs.</p>;

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Manage Blogs</h2>
      <table className="min-w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 border">Title</th>
            <th className="p-2 border">Status</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {blogs.map((blog) => (
            <tr key={blog._id}>
              <td className="p-2 border">{blog.title}</td>
              <td className="p-2 border">{blog.status}</td>
              <td className="p-2 border space-x-2">
                {/* Change status button */}
                <button
                  className="px-2 py-1 bg-blue-500 text-white rounded"
                  onClick={() =>
                    statusMutation.mutate({
                      id: blog._id,
                      status: blog.status === "draft" ? "public" : "draft",
                    })
                  }
                >
                  {blog.status === "draft" ? "Publish" : "Unpublish"}
                </button>

                {/* Delete button */}
                <button
                  className="px-2 py-1 bg-red-500 text-white rounded"
                  onClick={() => deleteMutation.mutate(blog._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManageBlogs;
