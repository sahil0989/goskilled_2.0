import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../../@/components/ui/card';
import { CheckCircle, Lock, PlayCircle } from 'lucide-react';
import { toast } from 'sonner';
import PaymentModel from '../../components/PaymentModel';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../@/components/ui/button';
import { Skeleton } from '../../@/components/ui/skeleton';
// import VideoPlayer from '../../components/videoPlayer/videoPlayer';
import { useStudent } from '../../context/student-context/StudentContext';
import {
    checkEnrolledCourse,
    checkPaymentStatus,
    checkPendingPayment,
    fetchStudentViewCourseDetailsService
} from '../../api/ApiCall';
import VideoPlayer from '../trial/VideoPlayer';

export default function StudentViewCourseDetailsPage() {
    const [openModel, setOpenModel] = useState(false);
    const [paymentStatus, setPaymentStatus] = useState("not_found");
    const [checkPayment, setCheckPayment] = useState(true);

    const { id } = useParams();
    const { user } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    const {
        studentViewCourseDetails,
        setStudentViewCourseDetails,
        setCurrentCourseDetailsId,
        loadingState,
        setLoadingState,
    } = useStudent();

    // Check login and payment status
    useEffect(() => {
        const handleLogin = async () => {
            const storedUser = localStorage.getItem("user");
            if (!storedUser) {
                navigate("/auth/login");
                return;
            }
            const userId = user?._id;
            if (!userId) return;

            const formData = { userId, courseId: id };
            const response = await checkPaymentStatus(formData);
            setPaymentStatus(response?.status);

            const data = await checkPendingPayment(userId);
            setCheckPayment(data?.canPurchase);
        };
        handleLogin();
        // eslint-disable-next-line
    }, [user, navigate]);

    // Fetch course details by ID
    useEffect(() => {
        if (!id) return;

        async function fetchData() {
            setLoadingState(true);
            setCurrentCourseDetailsId(id);

            const response = await fetchStudentViewCourseDetailsService(id);
            if (response?.success) {
                setStudentViewCourseDetails(response?.data);
            } else {
                setStudentViewCourseDetails(null);
            }
            setLoadingState(false);
        }

        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    // Reset details when location changes and is not course details page
    useEffect(() => {
        if (!location.pathname.includes('course/details')) {
            setStudentViewCourseDetails(null);
            setCurrentCourseDetailsId(null);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location.pathname]);

    if (loadingState) return <Skeleton className="w-full h-[400px]" />;

    const getIndexOfFreePreviewUrl = studentViewCourseDetails?.curriculum?.findIndex(
        (item) => item?.freePreview
    );

    // Handle Buy Now button click
    const handlePaymentBtn = async () => {
        if (!checkPayment) {
            toast.warning("Your previous payment is still pending.");
            return;
        }

        const userId = user?._id;
        const response = await checkEnrolledCourse(userId);

        if (response?.enrolled) {
            setOpenModel(true);
        } else {
            navigate('/student/course-order');
        }
    };

    return (
        <>
            <div className="container mx-auto p-4">
                <div className="bg-[#1A6E0A] text-white p-8 rounded-t-lg">
                    <h1 className="text-3xl font-bold mb-4">{studentViewCourseDetails?.title}</h1>
                    <p className="text-xl mb-4">{studentViewCourseDetails?.subtitle}</p>
                    <div className="flex items-center space-x-4 mt-2 text-sm">
                        <span>Created by: {studentViewCourseDetails?.instructorName}</span>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row gap-8 mt-8">
                    <main className="flex-grow">
                        <Card className="mb-8">
                            <CardHeader>
                                <CardTitle>What you'll learn</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                    {studentViewCourseDetails?.objectives
                                        ?.split(',')
                                        .map((objective, index) => (
                                            <li key={index} className="flex items-start">
                                                <CheckCircle className="mr-2 h-5 w-5 text-green-500 flex-shrink-0" />
                                                <span>{objective}</span>
                                            </li>
                                        ))}
                                </ul>
                            </CardContent>
                        </Card>

                        <Card className="mb-8">
                            <CardHeader>
                                <CardTitle>Course Description</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {studentViewCourseDetails?.description}
                            </CardContent>
                        </Card>

                        <Card className="mb-8">
                            <CardHeader>
                                <CardTitle>Course Curriculum</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul>
                                    {studentViewCourseDetails?.curriculum?.map((curriculumItem, index) => (
                                        <li
                                            key={index}
                                            className={`${curriculumItem?.freePreview ? 'cursor-pointer' : 'cursor-not-allowed'
                                                } flex items-center mb-4`}
                                        >
                                            {curriculumItem?.freePreview ? (
                                                <PlayCircle className="mr-2 h-4 w-4" />
                                            ) : (
                                                <Lock className="mr-2 h-4 w-4" />
                                            )}
                                            <span>{curriculumItem?.title}</span>
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>
                    </main>

                    <aside className="w-full md:w-[500px]">
                        <Card className="sticky top-4">
                            <CardContent className="p-6">
                                <div className="w-full mb-4 rounded-lg overflow-visible">
                                    <div className="relative w-full pt-[56.25%]"> {/* 16:9 aspect ratio */}
                                        <div className="absolute top-0 left-0 w-full h-full">
                                            <VideoPlayer
                                                url={
                                                    getIndexOfFreePreviewUrl !== -1
                                                        ? studentViewCourseDetails?.curriculum[getIndexOfFreePreviewUrl]?.videoUrl
                                                        : ''
                                                }
                                                width="100%"
                                                height="100%"
                                                controls
                                                onProgressUpdate={() => { }}
                                            />
                                        </div>
                                    </div>
                                </div>


                                <div className="mb-4">
                                    <span className="text-3xl font-bold">
                                        Rs. {studentViewCourseDetails?.pricing}
                                    </span>
                                </div>

                                {paymentStatus === "pending" ? (
                                    <Button className="w-full bg-[#1A6E0A] cursor-not-allowed" disabled>
                                        Payment processing...Please Wait
                                    </Button>
                                ) : (
                                    <Button
                                        onClick={() => handlePaymentBtn(studentViewCourseDetails?.pricing)}
                                        className="w-full bg-[#1A6E0A]"
                                    >
                                        Buy Now
                                    </Button>
                                )}
                            </CardContent>
                        </Card>
                    </aside>
                </div>
            </div>

            {openModel && (
                <PaymentModel
                    data={studentViewCourseDetails}
                    price={studentViewCourseDetails?.pricing}
                    setOpenModel={setOpenModel}
                />
            )}
        </>
    );
}
