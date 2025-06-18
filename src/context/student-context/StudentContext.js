import { createContext, useContext, useEffect, useState } from "react";
import { fetchStudentViewCourseListService } from "../../api/ApiCall";
const StudentContext = createContext(null);

export const StudentProvider = ({ children }) => {
    const [studentViewCoursesList, setStudentViewCoursesList] = useState([]);
    const [loadingState, setLoadingState] = useState(true);
    const [studentViewCourseDetails, setStudentViewCourseDetails] = useState(null);
    const [currentCourseDetailsId, setCurrentCourseDetailsId] = useState(null);
    const [studentBoughtCoursesList, setStudentBoughtCoursesList] = useState([]);
    const [studentCurrentCourseProgress, setStudentCurrentCourseProgress] = useState({});

    const fetchAllStudentViewCourses = async () => {
        const response = await fetchStudentViewCourseListService();

        if (response?.success) {
            setStudentViewCoursesList(response?.data)
        }
    }

    useEffect(() => {
        fetchAllStudentViewCourses()
    }, [])

    return (
        <StudentContext.Provider
            value={{
                studentViewCoursesList,
                setStudentViewCoursesList,
                loadingState,
                setLoadingState,
                studentViewCourseDetails,
                setStudentViewCourseDetails,
                currentCourseDetailsId,
                setCurrentCourseDetailsId,
                studentBoughtCoursesList,
                setStudentBoughtCoursesList,
                studentCurrentCourseProgress,
                setStudentCurrentCourseProgress,
            }}
        >
            {children}
        </StudentContext.Provider>
    );
};

export const useStudent = () => {
    return useContext(StudentContext);
};
