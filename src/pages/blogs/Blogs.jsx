import { useEffect, useState } from 'react';
import axios from 'axios';
import BlogComponent from './BlogComponent';

export default function Blogs() {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const res = await axios.get(`${process.env.REACT_APP_BACKEND}/blogs`);
                console.log(res.data.data);
                setBlogs(res.data.data);
            } catch (error) {
                console.error('Error fetching blogs:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchBlogs();
        // eslint-disable-next-line
    }, []);

    if (loading) {
        return (
            <section className="py-12 text-center text-gray-600">
                Loading blogs...
            </section>
        );
    }

    return (
        <section className="py-12">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <h2 className="font-manrope text-4xl font-bold text-gray-900 text-center mb-14">
                    Our popular blogs
                </h2>

                {blogs.length === 0 ? (
                    <p className="text-center text-gray-500">No blogs available.</p>
                ) : (
                    <div className="flex justify-center gap-y-8 flex-wrap md:gap-6 lg:gap-8">
                        {blogs.map((blog) => (
                            <BlogComponent key={blog._id} blog={blog} />
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}
