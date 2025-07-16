import React, { useEffect, useState, useCallback } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button } from '../../@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../@/components/ui/dialog';
import { AlignRight, Check, ChevronLeft, ChevronRight, CircleX, Home, HomeIcon, LogOut, Play, Settings, User, X } from 'lucide-react';
import Confetti from 'react-confetti';
import { useStudent } from '../../context/student-context/StudentContext';
import { useAuth } from '../../context/AuthContext';
import {
    checkParticularEnrolledCourse,
    getCurrentCourseProgressService,
    markLectureAsViewedService,
    resetCourseProgressService,
} from '../../api/ApiCall';
import VideoPlayer from '../trial/VideoPlayer';

export default function StudentProgress() {

    const [isOpen, setIsOpen] = useState(true);

    const { user } = useAuth();
    const { studentCurrentCourseProgress, setStudentCurrentCourseProgress } = useStudent();
    const { id } = useParams();
    const navigate = useNavigate();

    const [currentLecture, setCurrentLecture] = useState(null);
    const [showCourseCompleteDialog, setShowCourseCompleteDialog] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false);
    const [loading, setLoading] = useState(true);

    const fetchCurrentCourseProgress = useCallback(async () => {
        if (!user) return;

        try {
            const response = await getCurrentCourseProgressService(id, user?._id);
            if (response?.success) {
                if (!response?.data?.isPurchased) return;

                setStudentCurrentCourseProgress({
                    courseDetails: response.data.courseDetails,
                    progress: response.data.progress,
                });

                const { courseDetails, progress, completed } = response.data;

                if (completed) {
                    setCurrentLecture(courseDetails.curriculum[0]);
                    setShowCourseCompleteDialog(true);
                    setShowConfetti(true);
                    return;
                }

                if (!progress || progress.length === 0) {
                    setCurrentLecture(courseDetails.curriculum[0]);
                } else {
                    const lastViewedIndex = progress.reduceRight((acc, item, index) => {
                        return acc === -1 && item.viewed ? index : acc;
                    }, -1);
                    setCurrentLecture(courseDetails.curriculum[lastViewedIndex + 1] || courseDetails.curriculum[0]);
                }
            }
        } catch (error) {
            console.error('Error fetching current course progress:', error);
        } finally {
            setLoading(false);
        }
    }, [id, setStudentCurrentCourseProgress, user]);

    useEffect(() => {
        async function fetchProgress() {
            setLoading(true);
            if (!user) {
                const userId = localStorage.getItem('user')
                if (!userId) {
                    navigate('/auth/login');
                    return;
                }
            }

            try {
                const enrolled = await checkParticularEnrolledCourse({ courseId: id });
                if (!enrolled?.enrolled) {
                    navigate(`/course-details/${id}`);
                    return;
                }

                await fetchCurrentCourseProgress();
            } catch (error) {
                console.error('Error in fetchProgress:', error);
            } finally {
                setLoading(false);
            }
        }

        fetchProgress();
    }, [user, id, navigate, fetchCurrentCourseProgress]);

    useEffect(() => {
        if (currentLecture?.progressValue === 1) {
            updateCourseProgress();
        }
        // eslint-disable-next-line
    }, [currentLecture?.progressValue]);

    const updateCourseProgress = useCallback(async () => {
        if (!currentLecture || !user) return;

        try {
            const response = await markLectureAsViewedService(id, currentLecture._id, user?._id);
            if (response?.success) {
                await fetchCurrentCourseProgress();
            }
        } catch (error) {
            console.error('Error updating course progress:', error);
        }
    }, [currentLecture, id, user, fetchCurrentCourseProgress]);

    const handleRewatchCourse = useCallback(async () => {
        if (!user || !studentCurrentCourseProgress?.courseDetails?._id) return;

        try {
            const response = await resetCourseProgressService(studentCurrentCourseProgress.courseDetails._id, user?._id);
            if (response?.success) {
                setShowConfetti(false);
                setShowCourseCompleteDialog(false);
                await fetchCurrentCourseProgress();
                setCurrentLecture(studentCurrentCourseProgress?.courseDetails?.curriculum[0]);
            }
        } catch (error) {
            console.error('Error resetting course progress:', error);
        }
    }, [fetchCurrentCourseProgress, studentCurrentCourseProgress?.courseDetails, user]);

    const handleLectureClick = useCallback((lecture) => {
        setCurrentLecture(lecture);
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-[calc(100vh-80px)]">
                <p className="text-lg font-semibold">Loading course progress...</p>
            </div>
        );
    }

    return (
        <>
            {showConfetti && <Confetti />}

            <div className='relative h-[calc(100vh-80px)] overflow-hidden'>
                {/* sidebar */}
                <div className={`absolute h-full  ${isOpen ? "w-[330px]" : "w-0 hidden"} shadow-lg p-4 bg-white z-50`}>
                    <div onClick={() => setIsOpen(!isOpen)} className={`md:hidden flex w-full justify-end mb-3`}>
                        <X />
                    </div>
                    <h2 className='text-xl font-semibold pb-5 md:pt-8'>Modules</h2>
                    <div className='p-4'>
                        {studentCurrentCourseProgress?.courseDetails?.curriculum.map((lecture) => {
                            const isCurrent = currentLecture?._id === lecture._id;
                            const isViewed = studentCurrentCourseProgress?.progress?.find((item) => item.lectureId === lecture._id)?.viewed;

                            return (
                                <div
                                    key={lecture._id}
                                    onClick={() => handleLectureClick(lecture)}
                                    className={`flex items-center space-x-2 text-sm font-bold cursor-pointer p-2 rounded
        ${isCurrent ? "bg-blue-100 text-blue-700" : "text-black hover:bg-gray-200"}`}
                                >
                                    {isViewed ? (
                                        <Check className={`h-4 w-4 ${isCurrent ? "text-blue-700" : "text-green-500"}`} />
                                    ) : (
                                        <Play className={`h-4 w-4 ${isCurrent ? "text-blue-700" : ""}`} />
                                    )}
                                    <span>{lecture.title}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* main content  */}
                <div className='md:pl-[350px] px-6'>

                    <div className=' my-5 flex items-center justify-between w-full'>
                        <Link to={"/courses"}>
                            <Button>
                                <HomeIcon size={18} /> Back
                            </Button>
                        </Link>
                        <Button
                            className="md:hidden"
                            onClick={() => setIsOpen(!isOpen)}>
                            {
                                isOpen ? (
                                    <CircleX size={18} />
                                ) : (
                                    <AlignRight size={18} />
                                )
                            }
                        </Button>
                    </div>

                    <div className='h-[calc(100vh-80px)] overflow-scroll md:p-4'>
                        <div className="flex-1 overflow-y-auto">
                            <VideoPlayer
                                className="w-full"
                                url={currentLecture?.videoUrl}
                                onProgressUpdate={setCurrentLecture}
                                progressData={currentLecture}
                            />
                            <div className="p-4 sm:p-6">
                                <h2 className="text-lg sm:text-2xl font-bold mb-2">{currentLecture?.title}</h2>
                            </div>
                        </div>
                    </div>
                </div>


                {showCourseCompleteDialog && (
                    <Dialog open={showCourseCompleteDialog} onOpenChange={setShowCourseCompleteDialog}>
                        <DialogContent className="bg-white text-black rounded-xl shadow-2xl max-w-[90vw] p-4 sm:p-6">
                            <DialogHeader>
                                <DialogTitle className="text-2xl sm:text-3xl font-bold text-center mb-2">🎉 Congratulations! 🎉</DialogTitle>
                            </DialogHeader>
                            <div className="text-center space-y-4">
                                <p className="text-base sm:text-lg">You have successfully completed this course!</p>
                                <div className="flex gap-4 justify-center flex-wrap">
                                    <Button
                                        onClick={() => navigate('/dashboard')}
                                        className="bg-[#1A6E0A] text-white hover:bg-[#1e4416] font-semibold px-6 py-2 rounded-full mt-4"
                                    >
                                        Go to Dashboard
                                    </Button>
                                    <Button
                                        onClick={handleRewatchCourse}
                                        className="bg-[#1A6E0A] text-white hover:bg-[#1e4416] font-semibold px-6 py-2 rounded-full mt-4"
                                    >
                                        Rewatch the Course
                                    </Button>
                                </div>
                            </div>
                        </DialogContent>
                    </Dialog>
                )}
            </div>
        </>
    )
}
