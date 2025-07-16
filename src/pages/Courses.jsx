import React, { useEffect, useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@radix-ui/react-dropdown-menu';
import { Button } from '../@/components/ui/button';
import { ArrowUpDownIcon } from 'lucide-react';
import { Skeleton } from '../@/components/ui/skeleton';
import CourseComponent from './Course component/CourseComponent';
import { useStudent } from '../context/student-context/StudentContext';
import { fetchStudentViewCourseListService } from '../api/ApiCall';
import Footer from '../components/FooterSection';

export default function Courses() {

  const { studentViewCoursesList, setStudentViewCoursesList, loadingState, setLoadingState } = useStudent();

  const [sort, setSort] = useState('title-atoz');

  const sortOptions = [
    { id: 'price-lowtohigh', label: 'Price: Low to High' },
    { id: 'price-hightolow', label: 'Price: High to Low' },
    { id: 'title-atoz', label: 'Title: A to Z' },
    { id: 'title-ztoa', label: 'Title: Z to A' },
  ];

  useEffect(() => {
    return () => {
      sessionStorage.removeItem('filters');
    };
  }, []);

  useEffect(() => {
    if (sort !== null) fetchAllStudentViewCourses(sort);
    // eslint-disable-next-line
  }, [sort]);

  async function fetchAllStudentViewCourses(sort) {
    const query = new URLSearchParams({ sortBy: sort });
    const response = await fetchStudentViewCourseListService(query);
    if (response?.success) {
      setStudentViewCoursesList(response?.data);
      setLoadingState(false);
    }
  }

  return (
    <>
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <h1 className="text-3xl font-bold mb-6">All Courses</h1>

        <div className="flex justify-end items-center mb-6">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center gap-2 px-4 py-2 shadow-md">
                <ArrowUpDownIcon className="h-4 w-4" />
                <span className="text-sm font-medium">Sort By</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[200px] z-50">
              <DropdownMenuRadioGroup
                className="px-4 py-2 rounded-lg shadow-lg bg-white mt-4"
                value={sort}
                onValueChange={(value) => setSort(value)}
              >
                {sortOptions.map((sortItem) => (
                  <DropdownMenuRadioItem className="cursor-pointer px-2 py-1" value={sortItem.id} key={sortItem.id}>
                    {sortItem.label}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div>
          {studentViewCoursesList && studentViewCoursesList.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {studentViewCoursesList.map((courseItem) => (
                <CourseComponent key={courseItem?._id} data={courseItem} />
              ))}
            </div>
          ) : loadingState ? (
            <Skeleton />
          ) : (
            <h1 className="font-extrabold text-4xl text-center">No Courses Found</h1>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
}
