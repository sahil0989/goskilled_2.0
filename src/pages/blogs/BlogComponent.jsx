import { Link } from 'react-router-dom';

export default function BlogComponent({ blog }) {
  return (
    <Link to={`/blogs/${blog._id}`} className="w-full max-lg:max-w-xl lg:w-1/3 mb-6">
      <div className="group cursor-pointer border border-gray-300 rounded-2xl p-5 transition-all duration-300 hover:border-green-800 h-full">
        <div className="flex items-center mb-6">
          <img
            src={blog.image}
            alt={blog.author}
            className="rounded-lg w-full object-cover h-48"
          />
        </div>
        <div>
          <h4 className="text-gray-900 font-medium leading-8 mb-3 line-clamp-2">
            {blog.title}
          </h4>
          <h4 className="text-gray-900/60 font-normal text-sm leading-8 mb-6 line-clamp-2">
            {blog.content}
          </h4>
          <div className="flex items-center justify-between font-medium">
            <h6 className="text-sm text-gray-500">By {blog.author}</h6>
            <span className="text-sm text-indigo-600">{blog.timeAgo}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
