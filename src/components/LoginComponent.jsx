import { useState, useEffect, useRef } from "react";
import { Button } from "../@/components/ui/button";
import { Input } from "../@/components/ui/input";
import { Label } from "../@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../@/components/ui/tabs";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "sonner";
import axios from "axios";

const LoginComponent = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [userId, setUserId] = useState(null);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(0);
  const timerRef = useRef(null);
  const { login, setUser, fetchUserPayments } = useAuth();

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const loginData = {};
    const emailOrMobile = formData.get("emailOrMobile");

    if (emailOrMobile.includes("@")) {
      loginData.email = emailOrMobile;
    } else {
      loginData.mobileNumber = emailOrMobile;
    }

    loginData.password = formData.get("password");

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND}/api/auth/login`,
        loginData,
        { headers: { "Content-Type": "application/json" } }
      );

      const data = response?.data;

      localStorage.setItem("token", data?.data?.token);
      setUser(data?.data?.user);
      login(data?.data?.user?._id);
      fetchUserPayments(data?.data?.user?._id);
      toast.success("Login Successfully!!");
      navigate("/dashboard");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRequestOTP = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const mobileNumber = formData.get("mobileNumber");

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND}/api/auth/request-login-otp`,
        { mobileNumber },
        { headers: { "Content-Type": "application/json" } }
      );

      const data = response?.data;

      toast.info(`OTP sent to ${mobileNumber}`);
      setUserId(data?.data?.userId);
      setOtpSent(true);

      setTimer(60);
      timerRef.current = setInterval(() => {
        setTimer((prevTimer) => {
          if (prevTimer <= 1) {
            clearInterval(timerRef.current);
            return 0;
          }
          return prevTimer - 1;
        });
      }, 1000);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to send OTP");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND}/api/auth/login-with-otp`,
        { userId, otp },
        { headers: { "Content-Type": "application/json" } }
      );

      const data = response?.data;

      localStorage.setItem("token", data?.data?.token);
      setUser(data?.data?.user);
      login(data?.data?.user?._id);
      toast.success("Login Successfully!!");
      navigate("/dashboard");
    } catch (error) {
      toast.error(error?.response?.data?.message || "OTP verification failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (timer > 0) return;

    setIsLoading(true);

    try {
      const mobileNumber = document.getElementById("mobileNumber").value;

      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND}/api/auth/request-login-otp`,
        { mobileNumber },
        { headers: { "Content-Type": "application/json" } }
      );

      const data = response.data;
      setUserId(data.data.userId);

      setTimer(60);
      timerRef.current = setInterval(() => {
        setTimer((prevTimer) => {
          if (prevTimer <= 1) {
            clearInterval(timerRef.current);
            return 0;
          }
          return prevTimer - 1;
        });
      }, 1000);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to resend OTP");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center p-4 bg-gray-50" style={{ height: "calc(100vh - 80.8px)" }}>
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Login</CardTitle>
          <CardDescription className="text-center">Enter your credentials to access your account</CardDescription>
        </CardHeader>
        <CardContent>

          <Tabs defaultValue="password" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="password">Password</TabsTrigger>
              <TabsTrigger value="otp">OTP</TabsTrigger>
            </TabsList>

            <TabsContent value="password">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="emailOrMobile">Mobile Number</Label>
                  <Input
                    id="emailOrMobile"
                    name="emailOrMobile"
                    placeholder="Mobile Number"
                    required
                    pattern="^[6-9]\d{9}$"
                    title="Phone number should be 10 digits"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    • Do not start with 0<br />
                    • Phone number should be 10 digits
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" name="password" type="password" required />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Logging in..." : "Login"}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="otp">
              {!otpSent ? (
                <form onSubmit={handleRequestOTP} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="mobileNumber">Mobile Number</Label>
                    <Input id="mobileNumber" name="mobileNumber" placeholder="Enter your mobile number" required
                      pattern="^[6-9]\d{9}$"
                      title="Enter a valid 10-digit Phone number starting with 0-9"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      • Do not start with 0<br />
                      • Phone number should be 10 digits
                    </p>
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Sending OTP..." : "Send OTP"}
                  </Button>
                </form>
              ) : (
                <form onSubmit={handleVerifyOTP} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="otp">Enter OTP</Label>
                    <Input
                      id="otp"
                      name="otp"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      placeholder="Enter the OTP sent to your mobile"
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Verifying..." : "Verify OTP"}
                  </Button>
                  <div className="text-center">
                    <Button
                      type="button"
                      variant="link"
                      onClick={handleResendOTP}
                      disabled={timer > 0 || isLoading}
                      className="text-sm"
                    >
                      {timer > 0 ? `Resend OTP after ${timer}s` : "Resend OTP"}
                    </Button>
                  </div>
                </form>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-gray-500">
            Don't have an account?{" "}
            <Link to="/auth/register" className="text-primary font-medium hover:underline">
              Sign up
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default LoginComponent;
