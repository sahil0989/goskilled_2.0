import axios from "axios";
import { logoutHelper } from "../context/AuthContext";
import { toast } from "sonner";

const token = localStorage.getItem('token');
const userId = JSON.parse(localStorage.getItem('user'));
const backendUrl = process.env.REACT_APP_BACKEND;

export const generateReferralLink = async (params) => {
    const baseUrl = `http://localhost:3000/referralLink`;
    const query = new URLSearchParams(params);

    if (userId) {
        query.append('id', userId);
    }

    return `${baseUrl}?${query.toString()}`;
};

export const getUserDetails = async () => {

    if (!token) {
        logoutHelper();
        return;
    }

    try {
        const response = await axios.get(`${process.env.REACT_APP_USER_DETAILS}/${userId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        logoutHelper()
        toast.error('Session Timeout Login Again!!')
    }
}

export const fetchReferredUser = async (id) => {
    try {
        if (id) {
            const response = await axios.get(`${backendUrl}/api/user/referrals/${id}`);
            return response.data;
        } else {
            const response = await axios.get(`${backendUrl}/api/user/referrals/${userId}`);
            return response.data;
        }
    } catch (err) {
        toast.error('Internal Server Error !!')
    }
}

export const checkReferralCode = async (code, id) => {
    try {
        const response = await axios.get(`${backendUrl}/api/user/check-referral/${code}/${id}`);
        return response.data;
    } catch (error) {
        return {
            success: false,
            verified: false,
            message: error.response?.data?.message || "Referral code verification failed",
        };
    }
};

export const fetchLeaderboardData = async () => {
    try {
        const response = await axios.get(`${backendUrl}/api/user/leaderboard`)

        return response.data;
    } catch (err) {
        console.log("Error: ", err.message);
    }
}

//kyc 

export const submitKYCDetails = async (data) => {
    try {
        const normalizedData = {
            whatsAppNumber: data?.whatsAppNumber,
            documentType: data?.documentType,
            documentNumber: data?.documentNumber,
            addressProofDocument: data?.addressDocUpload,
            panCard: data?.panUpload,
            panNumber: data?.panNumber,
            bankName: data?.bankName,
            accountHolderName: data?.accHolderName,
            accountNumber: data?.accNumber,
            ifscCode: data?.ifsc,
            upiId: data?.upiId || "",
            bankDocument: data?.bankDocumentFile,
            bankDocumentType: data?.bankDocumentType
        };

        const response = await axios.post(`${backendUrl}/api/kyc/submit/${userId}`, normalizedData);

        return response.data;
    } catch (err) {
        toast.error('Internal Server Error!!')
    }
}

// handle file

export async function mediaUploadService(formData, onProgressCallback) {
    try {
        const { data } = await axios.post(`${backendUrl}/media/upload`, formData, {
            onUploadProgress: (progressEvent) => {
                const percentCompleted = Math.round(
                    (progressEvent.loaded * 100) / progressEvent.total
                );
                if (onProgressCallback) {
                    onProgressCallback(percentCompleted);
                }
            },
        });

        return data;
    } catch (error) {
        toast.error('Media uploading Error!!');

        return {
            success: false,
            message: error?.response?.data?.message || 'Media upload failed.',
            error,
        };
    }
}

export async function mediaPhotoDeleteService(id) {
    try {
        const { data } = await axios.delete(`${backendUrl}/media/delete/photo/${id}`);
        return data;
    } catch (error) {
        toast.error('Error Occued !!');

        return {
            success: false,
            message: error?.response?.data?.message || 'Photo deletion failed.',
            error,
        };
    }
}

// courses

export async function checkEnrolledCourse() {
    const { data } = await axios.get(`${backendUrl}/student/course/course-enrolled/${userId}`);

    return data;
}

export async function fetchStudentViewCourseDetailsService(courseId) {
    const { data } = await axios.get(
        `${backendUrl}/student/course/get/details/${courseId}`
    );

    return data;
}

export async function checkParticularEnrolledCourse(info) {
    const { data } = await axios.get(`${backendUrl}/student/course/purchase-info/${info.courseId}/${userId}`)

    return data;
}

export async function getCurrentCourseProgressService(courseId) {
    const { data } = await axios.get(
        `${backendUrl}/student/course-progress/get/${userId}/${courseId}`
    );

    return data;
}

export async function markLectureAsViewedService(courseId, lectureId) {


    const { data } = await axios.post(
        `${backendUrl}/student/course-progress/mark-lecture-viewed`,
        {
            userId,
            courseId,
            lectureId,
        }
    );

    return data;
}

export async function resetCourseProgressService(courseId) {
    const { data } = await axios.post(
        `${backendUrl}/student/course-progress/reset-progress`,
        {
            userId,
            courseId,
        }
    );

    return data;
}

export async function fetchStudentViewCourseListService(query) {
    const { data } = await axios.get(`${backendUrl}/student/course/get?${query}`);

    return data;
}

// payment

export async function checkPaymentStatus(formData) {
    const { data } = await axios.post(`${backendUrl}/api/payment/check-status`, formData)

    return data;
}

export async function checkPendingPayment(userId) {
    const { data } = await axios.get(`${backendUrl}/api/payment/check-pending/${userId}`)

    return data;
}

export async function paymentSubmitService(formData) {
    const { data } = await axios.post(`${backendUrl}/api/payment/submit`, formData)

    return data;
}