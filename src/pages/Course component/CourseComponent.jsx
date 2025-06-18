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
    if (loading) return;
    if (!user) {
      navigate('/auth/login');
      return;
    }

    setLoading(true);
    try {
      const response = await checkParticularEnrolledCourse({ courseId: data._id });
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

  return (
    <>
      <div className="w-full mb-6">
        <div
          onClick={handleNavigation}
          role="button"
          tabIndex={0}
          className="group cursor-pointer border border-gray-300 rounded-2xl p-5 transition-all duration-300 hover:border-green-600 h-full flex flex-col"
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') handleNavigation();
          }}
        >
          {/* Image */}
          <div className="flex items-center mb-6">
            <img
              src={data.image}
              alt={data.title}
              className="rounded-lg w-full object-cover h-48"
              loading="lazy"
            />
          </div>

          {/* Content */}
          <div className="flex flex-col flex-grow">
            <h4 className="text-gray-900 font-semibold leading-7 mb-2 line-clamp-2">
              {data.title}
            </h4>
            <p className="text-gray-700 text-sm mb-4 line-clamp-3 flex-grow">
              {data.description}
            </p>

            <p className="text-gray-500 text-sm mb-3">
              {`${data?.curriculum?.length || 0} ${data?.curriculum?.length === 1 ? 'Lecture' : 'Lectures'}`} &mdash;{' '}
              <span className="italic">{data?.instructorName || 'Unknown Instructor'}</span>
            </p>

            {/* Bottom row: price and button */}
            <div className="flex items-center justify-between font-medium mt-auto">
              <span className="text-gray-800 font-bold text-lg">Rs. {data.pricing}</span>
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  handleNavigation();
                }}
                className="bg-[#1A6E0A] hover:bg-[#204718]"
                disabled={loading}
              >
                {loading ? 'Loading...' : 'Get Started'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
