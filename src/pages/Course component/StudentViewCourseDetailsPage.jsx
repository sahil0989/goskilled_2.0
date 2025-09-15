import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../../@/components/ui/card';
import { BookCheckIcon, Lock, PlayCircle, ShieldCheck, VideoIcon } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../@/components/ui/button';
import { Skeleton } from '../../@/components/ui/skeleton';
import { useStudent } from '../../context/student-context/StudentContext';
import {
    checkEnrolledCourse,
    checkPaymentStatus,
    checkPendingPayment,
    createPayment,
    fetchStudentViewCourseDetailsService
} from '../../api/ApiCall';
import VideoPlayer from '../trial/VideoPlayer';
import { FaCertificate } from 'react-icons/fa';
import Footer from '../../components/FooterSection';

export default function StudentViewCourseDetailsPage() {
    const [enrolled, setEnrolled] = useState(false);
    const [paymentStatus, setPaymentStatus] = useState('not_found');
    const [canPurchase, setCanPurchase] = useState(true);
    const [loading, setLoading] = useState(false);
    const [showPreview, setShowPreview] = useState(false);
    const [previewUrl, setPreviewUrl] = useState("");
    const [isExpanded, setIsExpanded] = useState(false);

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
        const checkUserPaymentStatus = async () => {
            if (!user?._id) return;

            try {
                const formData = { userId: user._id, courseId: id };
                const paymentResp = await checkPaymentStatus(formData);
                setPaymentStatus(paymentResp?.status || 'not_found');

                const response = await checkEnrolledCourse(user?._id);
                setEnrolled(response.enrolled);

                const pendingResp = await checkPendingPayment(user._id);
                setCanPurchase(pendingResp?.canPurchase ?? true);
            } catch (error) {
                console.error('Error checking payment status:', error);
            }
        };
        checkUserPaymentStatus();
    }, [user, id]);

    useEffect(() => {
        if (!id) return;

        async function fetchData() {
            setLoadingState(true);
            setCurrentCourseDetailsId(id);
            try {
                const response = await fetchStudentViewCourseDetailsService(id);
                if (response?.success) {
                    setStudentViewCourseDetails(response.data);
                } else {
                    setStudentViewCourseDetails(null);
                }
            } catch (error) {
                console.error('Error fetching course details:', error);
                setStudentViewCourseDetails(null);
            } finally {
                setLoadingState(false);
            }
        }

        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    // Reset details when route changes away from this page
    useEffect(() => {
        if (!location.pathname.includes('course/details')) {
            setStudentViewCourseDetails(null);
            setCurrentCourseDetailsId(null);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location.pathname]);

    if (loadingState) return <Skeleton className="w-full h-[400px]" />;

    const handlePaymentBtn = async () => {
        if (!localStorage.getItem('user')) {
            navigate('/auth/login');
            return;
        }

        if (!canPurchase) {
            toast.warning('Your previous payment is still pending.');
            return;
        }

        setLoading(true);
        try {
            const userId = user?._id;

            const courseData = {
                name: studentViewCourseDetails.title,
                id: studentViewCourseDetails._id,
                pricing: studentViewCourseDetails.pricing.standard
            }

            console.log('Course Data: ', courseData);

            console.log("Student View Data: ", studentViewCourseDetails)

            const data = {
                userId: user._id,
                email: user.email,
                mobileNumber: user.mobileNumber,
                courses: courseData,
                amount: studentViewCourseDetails.pricing.standard,
                packageType: "Skill Builder"
            }

            const response = await checkEnrolledCourse(userId);
            if (response?.enrolled) {
                const result = await createPayment(data);
                if (result.success) {
                    navigate('/payment', {
                        state: {
                            orderId: result.order.order_id,
                            paymentSessionId: result.order.payment_session_id,
                            userData: data
                        }
                    })
                }
                console.log(result);
            } else {
                navigate('/student/course-order');
            }
        } catch (error) {
            console.error('Error checking enrollment:', error);
            toast.error('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };



    const openPreview = (url) => {
        setPreviewUrl(url);
        setShowPreview(true);
    };

    const closePreview = () => {
        setShowPreview(false);
        setPreviewUrl("");
    };

    return (

        <>
            <div className="container mx-auto p-4">
                {/* Hero Section */}
                <div className='relative w-full h-auto bg-gradient-to-br from-[#1A6E0A] via-[#188F10] to-[#145708] p-6 rounded-lg text-white mb-6 overflow-hidden'>
                    {/* Decorative blurred radial background */}
                    <div className="absolute top-0 left-0 w-60 h-60 bg-white/10 rounded-full blur-2xl animate-pulse -z-10"></div>
                    <div className="absolute bottom-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-2xl animate-pulse -z-10"></div>

                    <div className="relative z-10">
                        <h1 className="text-3xl md:text-4xl font-bold drop-shadow-lg mb-2">{studentViewCourseDetails?.title}</h1>
                        <p className="text-md md:text-lg mb-6 opacity-90">{studentViewCourseDetails?.subtitle}</p>

                        <div className="space-y-2">
                            {studentViewCourseDetails?.heroSection?.content?.map((content, index) => (
                                <div key={index} className="flex items-center gap-3">
                                    <span className="bg-white/20 p-2 rounded-full text-white animate-pulse">
                                        <FaCertificate className="text-white-300" />
                                    </span>
                                    <span className="text-sm md:text-base font-medium">{content}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="flex flex-col-reverse md:flex-row gap-4">
                    <main className="w-full">
                        {/* What You'll Learn */}
                        <Card className="mb-4">
                            <CardHeader>
                                <CardTitle>What You’ll Learn</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    {studentViewCourseDetails?.whatYouWillLearn?.map((reason, index) => (
                                        <div key={index} className="flex items-start gap-2">
                                            <span className="mt-1"> <BookCheckIcon /> </span>
                                            <span className=' font-semibold'>{reason}</span>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Why Choose */}
                        <Card className="mb-4">
                            <CardHeader>
                                <CardTitle>Why Choose This Course</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    {studentViewCourseDetails?.whyChoose?.map((reason, index) => (
                                        <div key={index} className="flex items-start gap-2">
                                            <span className="mt-1"> <ShieldCheck /> </span>
                                            <span className=' font-semibold'>{reason}</span>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Description */}
                        <Card className="mb-4">
                            <CardHeader>
                                <CardTitle>Description</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p>{studentViewCourseDetails?.description}</p>
                            </CardContent>
                        </Card>

                        {/* FAQs */}
                        <Card>
                            <CardHeader>
                                <CardTitle>FAQ</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {studentViewCourseDetails?.faqs?.length ? (
                                    studentViewCourseDetails.faqs.map((faq, index) => (
                                        <div key={index} className="py-2">
                                            <details className="group border p-2 rounded-lg border-gray-200">
                                                <summary className="flex justify-between items-center font-medium cursor-pointer list-none">
                                                    <span>{faq.question}</span>
                                                    <span className="transition group-open:rotate-180">
                                                        <svg
                                                            fill="none"
                                                            height="24"
                                                            width="24"
                                                            viewBox="0 0 24 24"
                                                            stroke="currentColor"
                                                            strokeWidth="1.5"
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                        >
                                                            <path d="M6 9l6 6 6-6" />
                                                        </svg>
                                                    </span>
                                                </summary>
                                                <p className="text-neutral-600 mt-3">{faq.answer}</p>
                                            </details>
                                        </div>
                                    ))
                                ) : (
                                    <p>No FAQs available yet.</p>
                                )}
                            </CardContent>
                        </Card>

                        {/* Reviews */}
                        <Card className="my-4">
                            <CardHeader>
                                <CardTitle>Student Reviews</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {studentViewCourseDetails?.reviews?.map((rev, index) => (
                                    <div key={index} className="border-b pb-4">
                                        <div className="flex items-center justify-between mb-1">
                                            <h4 className="font-semibold text-lg">{rev.reviewer || "Anonymous"}</h4>
                                            <span className="text-yellow-500 font-medium">⭐ {rev.rating} / 5</span>
                                        </div>
                                        <p className="text-gray-700 italic">"{rev.comment}"</p>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </main>

                    <aside className="w-full">
                        <Card className=" w-full">
                            <CardContent className=" w-full">
                                {/* Video Preview */}
                                <div className=" w-full py-6">
                                    <div className="w-full h-full">
                                        <VideoPlayer className=' w-full' url={studentViewCourseDetails?.curriculum[0]?.videoUrl || ''} />
                                    </div>
                                </div>

                                {
                                    paymentStatus === 'rejected' && <div className='w-full flex justify-center py-2 text-xs text-red-600'>Previous Payment is rejected. Please Pay Again</div>
                                }

                                {/* Payment Button */}
                                {paymentStatus === 'pending' ? (
                                    <Button disabled className="w-full hover:bg-[#254b1d] py-4">Processing Payment...</Button>
                                ) : (
                                    <Button onClick={handlePaymentBtn} className="w-full bg-blue-700 hover:bg-[#254b1d] py-4 uppercase">
                                        {loading ? 'Processing...' : 'Enroll Now'}
                                    </Button>
                                )}

                                {/* Pricing Section */}
                                <div className="my-6 space-y-1">
                                    {
                                        enrolled ? (<p>
                                            <strong className=' text-xl'>₹{studentViewCourseDetails?.pricing?.standard}</strong>
                                        </p>) : (
                                            <p><strong className=' text-xl'>₹{studentViewCourseDetails?.pricing?.standard}</strong>, with premium Features <strong className=' text-xl'>₹{studentViewCourseDetails?.pricing?.premium}</strong></p>
                                        )
                                    }
                                    <p className='italic text-sm'>(Limited Offer – 50% Off!)</p>
                                    {
                                        studentViewCourseDetails?.heroSection?.features?.map((feature, index) => (
                                            <p key={index} className=' font-semibold'>🔹  {feature}</p>
                                        ))
                                    }

                                </div>
                                <div className="border rounded-lg overflow-hidden">
                                    <div className='text-lg font-semibold border-b-2 w-full px-5 py-3 bg-[#1A6E0A] rounded-t-lg text-white'>Modules</div>

                                    <div className="relative">
                                        <div
                                            className={`p-4 transition-all duration-500 ease-in-out ${isExpanded ? 'max-h-[1000px]' : 'max-h-[250px]'
                                                } overflow-hidden`}
                                        >
                                            {studentViewCourseDetails?.curriculum?.map((lecture, index) => (
                                                <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-md shadow-sm mb-2">
                                                    <span className="text-sm font-medium text-gray-800 flex items-center gap-3">
                                                        <VideoIcon size={20} />
                                                        <span className='hidden md:block'>Module {index + 1}:</span>
                                                        <span className='font-normal'>{lecture?.title}</span>
                                                    </span>
                                                    {lecture?.freePreview ? (
                                                        <PlayCircle onClick={() => openPreview(lecture?.videoUrl)} className='cursor-pointer' size={20} />
                                                    ) : (
                                                        <Lock size={20} className="text-gray-400" />
                                                    )}
                                                </div>
                                            ))}
                                        </div>

                                        {/* Blur effect when collapsed */}
                                        {!isExpanded && (
                                            <div className="absolute bottom-0 left-0 w-full h-12 bg-gradient-to-t from-white to-transparent pointer-events-none" />
                                        )}
                                    </div>

                                    {/* Toggle button */}
                                    <div className="flex justify-center py-2">
                                        <button
                                            className="text-sm text-green-700 hover:underline"
                                            onClick={() => setIsExpanded(!isExpanded)}
                                        >
                                            {isExpanded ? 'Show Less' : 'Show All'}
                                        </button>
                                    </div>
                                </div>

                            </CardContent>
                        </Card>
                    </aside>
                </div>
            </div>

            {showPreview && (
                <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center">
                    <div className="bg-white w-full max-w-3xl p-6 md:p-8 rounded-lg shadow-lg relative">
                        <button
                            onClick={closePreview}
                            className="absolute top-2 right-2 text-gray-500 hover:text-red-500 text-lg"
                        >
                            ✖
                        </button>
                        <div className="aspect-video w-full">
                            <VideoPlayer className=' w-full' url={previewUrl || ''} />
                        </div>
                    </div>
                </div>
            )}


            <Footer />

        </>
    );

}
