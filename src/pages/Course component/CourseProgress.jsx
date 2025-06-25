import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '../../@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../@/components/ui/dialog';
import { Check, ChevronLeft, ChevronRight, Play } from 'lucide-react';
import Confetti from 'react-confetti';

import VideoPlayer from '../../components/videoPlayer/videoPlayer';
import { useStudent } from '../../context/student-context/StudentContext';
import { useAuth } from '../../context/AuthContext';
import {
    checkParticularEnrolledCourse,
    getCurrentCourseProgressService,
    markLectureAsViewedService,
    resetCourseProgressService,
} from '../../api/ApiCall';

export default function CourseProgress() {
    const { user } = useAuth();
    const { studentCurrentCourseProgress, setStudentCurrentCourseProgress } = useStudent();
    const { id } = useParams();
    const navigate = useNavigate();

    const [currentLecture, setCurrentLecture] = useState(null);
    const [showCourseCompleteDialog, setShowCourseCompleteDialog] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false);
    const [isSideBarOpen, setIsSideBarOpen] = useState(false);
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
        if (window.innerWidth < 768) {
            setIsSideBarOpen(false);
        }
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

            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-300 bg-white shadow-md">
                <div className="flex flex-col sm:flex-row items-start sm:items-center sm:justify-between space-y-2 sm:space-y-0 sm:space-x-4 w-full overflow-hidden">
                    <Button
                        onClick={() => navigate('/dashboard')}
                        className="bg-[#1A6E0A] hover:bg-[#1e4416] px-3 py-3 text-white hover:text-white"
                        variant="ghost"
                        size="md"
                    >
                        <ChevronLeft className="w-4 h-4 mr-2" />
                        Back to My Courses
                    </Button>
                    <h1 className="text-base sm:text-lg font-bold truncate max-w-[250px] sm:max-w-xs">
                        {studentCurrentCourseProgress?.courseDetails?.title}
                    </h1>
                </div>
                <Button onClick={() => setIsSideBarOpen(!isSideBarOpen)} className="ml-2 lg:hidden">
                    {isSideBarOpen ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
                </Button>
            </div>

            {/* Main Content Section */}
            <div className="flex flex-col md:flex-col lg:flex-row h-[calc(100vh-128px)] overflow-hidden bg-white text-black">
                {/* Main Video Area */}
                <div className="flex-1 overflow-y-auto">
                    <VideoPlayer
                        className="w-full h-[220px] sm:h-[300px] md:h-[400px] lg:h-[500px]"
                        url={currentLecture?.videoUrl}
                        onProgressUpdate={setCurrentLecture}
                        progressData={currentLecture}
                    />
                    <div className="p-4 sm:p-6">
                        <h2 className="text-lg sm:text-2xl font-bold mb-2">{currentLecture?.title}</h2>
                    </div>
                </div>

                {/* Sidebar */}
                <div className={`fixed lg:relative z-40 right-0 bottom-0 w-full lg:w-[400px] bg-white border-l border-gray-300 shadow-lg transition-transform duration-300 ${isSideBarOpen ? 'translate-x-0' : 'translate-x-full'} lg:translate-x-0 overflow-y-auto`}>
                    <Tabs defaultValue="content" className="h-full flex flex-col">
                        <TabsList className="grid grid-cols-2 p-0 h-12 lg:h-14 bg-gray-100 shadow-md text-sm lg:text-base">
                            <TabsTrigger value="content" className="rounded-none h-full text-black">
                                Course Content
                            </TabsTrigger>
                            <TabsTrigger value="overview" className="rounded-none h-full text-black">
                                Overview
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="content" className="flex-1 overflow-y-auto max-h-[calc(100vh-200px)] p-4 bg-gray-50">
                            {studentCurrentCourseProgress?.courseDetails?.curriculum.map((lecture) => (
                                <div
                                    key={lecture._id}
                                    onClick={() => handleLectureClick(lecture)}
                                    className="flex items-center space-x-2 text-sm font-bold text-black cursor-pointer hover:bg-gray-200 p-2 rounded"
                                >
                                    {studentCurrentCourseProgress?.progress?.find((item) => item.lectureId === lecture._id)?.viewed ? (
                                        <Check className="h-4 w-4 text-green-500" />
                                    ) : (
                                        <Play className="h-4 w-4" />
                                    )}
                                    <span>{lecture.title}</span>
                                </div>
                            ))}
                        </TabsContent>

                        <TabsContent value="overview" className="flex-1 overflow-y-auto max-h-[calc(100vh-200px)] p-4 bg-gray-50">
                            <h2 className="text-lg sm:text-xl font-bold mb-4">About this course</h2>
                            <p className="text-gray-600">{studentCurrentCourseProgress?.courseDetails?.description}</p>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>

            {/* Completion Dialog */}
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
        </>
    );
}
