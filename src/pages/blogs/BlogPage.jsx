import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function BlogDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_BACKEND}/blogs/${id}`);
        setBlog(res.data.data);
      } catch (error) {
        console.error('Blog fetch failed:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id]);

  if (loading) {
    return (
      <div className="text-center mt-20 text-gray-500 text-lg">
        Loading blog...
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="text-center mt-20">
        <h2 className="text-2xl font-semibold text-red-500">Blog not found</h2>
        <button
          onClick={() => navigate('/blogs')}
          className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <button
        onClick={() => navigate('/blogs')}
        className="mb-6 text-indigo-600 hover:underline text-sm"
      >
        ← Back to all blogs
      </button>

      <img
        src={blog.image}
        alt={blog.title}
        className="rounded-xl w-full mb-8 max-h-[400px] object-cover"
      />
      <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">{blog.title}</h1>
      <div className="flex justify-between items-center text-sm text-gray-500 mb-6">
        <p>By <span className="font-medium">{blog.author || "Unknown Author"}</span></p>
        {/* Optional timestamp if available */}
        <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
      </div>
      <p className="text-gray-700 leading-7 text-justify whitespace-pre-line">
        {blog.description || blog.content}
      </p>
    </section>
  );
}
