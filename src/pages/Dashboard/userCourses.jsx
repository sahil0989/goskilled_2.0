import React from 'react'
import CourseComponent from '../Course component/CourseComponent'
import { Skeleton } from '../../@/components/ui/skeleton'

export default function UserCourses({ purchasedCoursesData, notPurchasedCoursesData }) {
  return (
    <>
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        {/* <h2 className="text-gray-600 text-lg">No courses enrolled yet.</h2> */}

        <h2 className='text-lg font-semibold mb-8'>My Courses</h2>

        {purchasedCoursesData && purchasedCoursesData.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {purchasedCoursesData.map((courseItem) => (
              <CourseComponent key={courseItem?._id} data={courseItem} />
            ))}
          </div>
        ) : (
          <h1 className=" italic text-black/60">Purchased Courses for Start Learning</h1>
        )}
      </div>

      <div className="bg-white shadow-md rounded-lg p-6">
        {/* <h2 className="text-gray-600 text-lg">No courses enrolled yet.</h2> */}

        <h2 className='text-lg font-semibold mb-8'>Other Available Courses</h2>

        {notPurchasedCoursesData && notPurchasedCoursesData.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {notPurchasedCoursesData.map((courseItem) => (
              <CourseComponent key={courseItem?._id} data={courseItem} />
            ))}
          </div>
        ) : (
          <h1 className=" italic text-black/60">Purchased Courses for Start Learning</h1>
        )}
      </div>
    </>
  )
}
