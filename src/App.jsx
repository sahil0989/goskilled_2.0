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
import Courses from "./pages/Courses";
import StudentViewCourseDetailsPage from "./pages/Course component/StudentViewCourseDetailsPage";
import OfferPurchase from "./pages/CourseOrder";
import { InstructorProvider } from "./context/media-context/mediaContext";
import Blogs from "./pages/blogs/Blogs";
import BlogDetailPage from "./pages/blogs/BlogPage";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsConditions from "./pages/Terms&Conditions";
import RefundCancellation from "./pages/RefundCancellation";
import StudentProgress from "./pages/Course component/StudentProgress";
import PaymentPage from "./pages/payment/PaymentPage";
import PaymentSuccess from "./pages/payment/PaymentSuccess";
import PaymentReject from "./pages/payment/PaymentReject";
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
              <Route path="/courses" element={<Courses />} />
              <Route path="/course-details/:id" element={<StudentViewCourseDetailsPage />} />
              <Route path="/course-progress/:id" element={<StudentProgress />} />
              <Route path="/student/course-order" element={<OfferPurchase />} />
              <Route path="/payment" element={<PaymentPage />} />
              <Route path="/payment/success" element={<PaymentSuccess />} />
              <Route path="/payment-failed" element={<PaymentReject />} />
              <Route path="/about" element={<About />} />
              <Route path="/blogs" element={<Blogs />} />
              <Route path="/blogs/:id" element={<BlogDetailPage />} />
              <Route path="/contact" element={<ContactUs />} />
              <Route path="/RefundCancellation" element={<RefundCancellation />} />
              <Route path="/PrivacyPolicy" element={<PrivacyPolicy />} />
              <Route path="/TermsAndConditions" element={<TermsConditions />} />
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
