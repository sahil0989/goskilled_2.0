import { createContext, useContext, useState } from "react";
const InstructorContext = createContext(null);

export const InstructorProvider = ({ children }) => {
  const [paymentData, setPaymentData] = useState({
    screenShot: '',
    imagePublicId: ''
  });
  const [mediaUploadProgress, setMediaUploadProgress] = useState(false);
  const [mediaUploadProgressPercentage, setMediaUploadProgressPercentage] = useState(0);
  const [instructorCoursesList, setInstructorCoursesList] = useState([]);
  const [currentEditedCourseId, setCurrentEditedCourseId] = useState(null);

  return (
    <InstructorContext.Provider
      value={{
        paymentData,
        setPaymentData,
        mediaUploadProgress,
        setMediaUploadProgress,
        mediaUploadProgressPercentage,
        setMediaUploadProgressPercentage,
        instructorCoursesList,
        setInstructorCoursesList,
        currentEditedCourseId,
        setCurrentEditedCourseId,
      }}
    >
      {children}
    </InstructorContext.Provider>
  );
};

// Hook to use InstructorContext
export const useMedia = () => {
  return useContext(InstructorContext);
};
