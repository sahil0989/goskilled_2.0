import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Navbar from "./components/Navbar";
import { AuthProvider } from "./context/AuthContext";
import Home from "./pages/Home";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import Courses from "./pages/Courses";
import ContactUs from "./pages/ContactUs";
import About from "./pages/About";
import { Toaster } from "sonner";
import ProtectedRoute from "./validation/ProtectedRoute";
import UserDashboard from "./pages/Dashboard/UserDashboard";

function App() {

  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Toaster richColors position="bottom-right" />
        <div className="h-20 w-full"></div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/about" element={<About />} />
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
    </AuthProvider>
  );
}

export default App;
