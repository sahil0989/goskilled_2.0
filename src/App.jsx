import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Navbar from "./components/Navbar";
import { AuthProvider } from "./context/AuthContext";
import Home from "./pages/Home";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import ContactUs from "./pages/ContactUs";
import About from "./pages/About";
import { Toaster } from "sonner";
import ProtectedRoute from "./validation/ProtectedRoute";
import UserDashboard from "./pages/Dashboard/UserDashboard";
import { StudentProvider } from "./context/student-context/StudentContext";
// import Courses from "./pages/Courses";
// import StudentViewCourseDetailsPage from "./pages/Course component/StudentViewCourseDetailsPage";
// import CourseProgress from "./pages/Course component/CourseProgress";
// import OfferPurchase from "./pages/CourseOrder";
import { InstructorProvider } from "./context/media-context/mediaContext";
import Blogs from "./pages/blogs/Blogs";
import BlogDetailPage from "./pages/blogs/BlogPage";
import MeetingPage from "./pages/meetings/MeetingPage";
import MeetingDetails from "./pages/meetings/MeetingDetails";
import FAQ from "./pages/Faq";
// import VideoPlayer from "./pages/trial/VideoPlayer";

function App() {

  return (
    <AuthProvider>
      <StudentProvider>
        <InstructorProvider>
          <BrowserRouter>
            <Navbar />
            <Toaster richColors position="bottom-right" />
            <div className="h-20 w-full"></div>
            <Routes>
              <Route path="/" element={<Home />} />
              {/* <Route path="/courses" element={<Courses />} /> */}
              {/* <Route path="/course-details/:id" element={<StudentViewCourseDetailsPage />} /> */}
              {/* <Route path="/course-progress/:id" element={<CourseProgress />} /> */}
              {/* <Route path="/student/course-order" element={<OfferPurchase />} /> */}
              <Route path="/about" element={<About />} />
              {/* <Route path="/video" element={<VideoPlayer url={"https://youtu.be/KxoRfrnqge8?si=TzBiDlNGy5xdHLra"} />} /> */}
              <Route path="/questions" element={<FAQ />} />
              <Route path="/blogs" element={<Blogs />} />
              <Route path="/blogs/:id" element={<BlogDetailPage />} />
              <Route path="/meetings" element={<MeetingPage />} />
              <Route path="/meetings/:id" element={<MeetingDetails />} />
              <Route path="/contact" element={<ContactUs />} />
              <Route path="/auth/register" element={<RegisterPage />} />
              <Route path="/referralLink" element={<RegisterPage />} />
              <Route path="/auth/login" element={<LoginPage />} />
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <UserDashboard />
                </ProtectedRoute>
              }
              />
            </Routes>
          </BrowserRouter>
        </InstructorProvider>
      </StudentProvider>
    </AuthProvider>
  );
}

export default App;
