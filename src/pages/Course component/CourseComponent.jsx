import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../@/components/ui/button';
import { useAuth } from '../../context/AuthContext';
import { checkParticularEnrolledCourse } from '../../api/ApiCall';

export default function CourseComponent({ data }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleNavigation = useCallback(async () => {
    if (loading) return; // Prevent double click
    if (!user) {
      navigate(`/course-details/${data._id}`);
      return;
    }

    setLoading(true);
    try {
      const response = await checkParticularEnrolledCourse({ courseId: data._id, id: user._id });
      if (response?.enrolled) {
        navigate(`/course-progress/${data._id}`);
      } else {
        navigate(`/course-details/${data._id}`);
      }
    } catch (error) {
      console.error("Failed to check enrollment:", error);
    } finally {
      setLoading(false);
    }
  }, [user, data._id, navigate, loading]);

  // Keyboard handler for the card div
  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleNavigation();
      }
    },
    [handleNavigation]
  );

  return (
    <div className="w-full mb-6">
      <div
        onClick={() => !loading && handleNavigation()}
        role="button"
        tabIndex={0}
        className={`group cursor-pointer border border-gray-300 rounded-2xl p-5 transition-all bg-white duration-300 hover:border-green-600 h-full flex flex-col
          ${loading ? 'opacity-70 pointer-events-none' : ''}
        `}
        onKeyDown={handleKeyDown}
        aria-label={`View details for course: ${data.title}`}
      >
        {/* Image */}
        <div className="flex items-center mb-6">
          <img
            src={data.image}
            alt={data.title || 'Course image'}
            className="rounded-lg w-full object-cover h-48"
            loading="lazy"
            draggable={false}
          />
        </div>

        {/* Content */}
        <div className="flex flex-col flex-grow">
          <h4
            className="text-gray-900 font-semibold leading-6 mb-2 line-clamp-2"
            title={data.title}
          >
            {data.title}
          </h4>
          <p
            className="text-gray-700 text-sm mb-4 line-clamp-2 flex-grow"
            title={data.description}
          >
            {data.description}
          </p>

          <p className="text-gray-500 text-sm mb-3">
            {`${data?.curriculum?.length || 0} ${
              data?.curriculum?.length === 1 ? 'Lecture' : 'Lectures'
            }`} &mdash;{' '}
            <span className="italic">{data?.instructorName || 'Unknown Instructor'}</span>
          </p>

          {/* Bottom row: price and button */}
          <div className="flex items-center justify-between font-medium mt-auto">
            <span className="text-gray-800 font-bold text-lg">Rs. {data.pricing?.standard}</span>
            <Button
              onClick={(e) => {
                e.stopPropagation();
                if (!loading) handleNavigation();
              }}
              className="bg-[#1A6E0A] hover:bg-[#204718]"
              disabled={loading}
              aria-label={`Get started with course ${data.title}`}
            >
              {loading ? 'Loading...' : 'Get Started'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
