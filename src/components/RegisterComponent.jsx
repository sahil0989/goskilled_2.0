import React, { useState, useEffect } from "react";
import axios from "axios";
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
import { AlertCircle } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { registerSchema } from "../validation/userValidation";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  AlertDialog,
  AlertDialogDescription,
} from "../@/components/ui/alert-dialog";
import { useAuth } from "../context/AuthContext";
import { toast } from "sonner";

const RegisterComponent = () => {
  const [phoneData, setPhoneData] = useState({
    mobileNumber: "",
    otp: "",
    otpSent: false,
    timer: 60,
    canResend: false,
  });

  const { login, setUser } = useAuth();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const query = new URLSearchParams(useLocation().search);

  const referralCodeFromUrl = query.get("code") || "";
  const referralIdFromUrl = query.get("id") || "";

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: yupResolver(registerSchema),
    defaultValues: {
      referralCode: "",
    },
  });


  // Optimize state update functions
  const updatePhoneData = (updates) => {
    setPhoneData((prev) => ({ ...prev, ...updates }));
  };

  const handlePhoneChange = (e) => {
    const { name, value } = e.target;
    updatePhoneData({ [name]: value });
  };

  useEffect(() => {
    const validateReferral = async () => {
      if (referralCodeFromUrl && referralIdFromUrl) {
        try {
          const response = await axios.get(
            `${process.env.REACT_APP_BACKEND}/api/user/check-referrals/${referralCodeFromUrl}/${referralIdFromUrl}`
          );

          if (response.data?.data?.verified) {
            setValue("referralCode", referralCodeFromUrl);
            toast.success("Referral Code Verified!");
          } else {
            toast.warning("Referral Code is invalid.");
          }
        } catch (err) {
          toast.error("Error verifying referral code");
        }
      }
    };

    validateReferral();
    // eslint-disable-next-line
  }, [referralCodeFromUrl]);

  // Optimize timer logic using useEffect
  useEffect(() => {
    let intervalId;
    if (phoneData?.otpSent && phoneData?.timer > 0) {
      intervalId = setInterval(() => {
        setPhoneData((prev) => {
          const newTimer = prev.timer - 1;
          if (newTimer === 0) {
            clearInterval(intervalId);
            return { ...prev, timer: 0, canResend: true };
          }
          return { ...prev, timer: newTimer };
        });
      }, 1000);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [phoneData?.otpSent, phoneData?.timer]);

  const handleRegister = async (data) => {
    setError("");
    setSuccess("");
    setIsLoading(true);

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND}/api/auth/register`,
        data
      );

      setSuccess(response?.data?.message);
      updatePhoneData({
        otpSent: true,
        mobileNumber: data?.mobileNumber,
        timer: 60,
        canResend: false,
      });
      toast.success("Registration Successfully!! Please verify your Number")
    } catch (err) {
      toast.error(err.response?.data?.message)
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendOTP = async () => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND}/api/auth/request-login-otp`,
        {
          mobileNumber: phoneData?.mobileNumber,
        }
      );
      setSuccess(response?.data?.message);
      toast.info(`OTP send on ${phoneData?.mobileNumber}`);
      updatePhoneData({
        otpSent: true,
        timer: 60,
        canResend: false,
      });
    } catch (err) {
      toast.error('Failed to send OTP')
      setError(err.response?.data?.message || "Failed to send OTP");
    }
  };

  const handleVerifyOTP = async () => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND}/api/auth/verify-otp`, {
        mobileNumber: phoneData?.mobileNumber,
        otp: phoneData?.otp,
      });
      setSuccess(response?.data?.message);


      localStorage.setItem("token", response?.data?.data?.token);

      setUser(response?.data?.data?.user);
      login(response?.data?.data?.user?._id)

      toast.success('Verification Successfully!!')
      navigate("/dashboard");


    } catch (err) {
      toast.error(err.response?.data?.message || "OTP Error")
      setError(err.response?.data?.message || "OTP verification failed");
    }
  };

  return (
    <>
      <div
        className="flex justify-center items-center min-h-screen p-4 bg-gray-50 overflow-y-auto"
        style={{ height: "calc(100vh - 80.8px" }}
      >
        {!phoneData.otpSent ? (
          <Card className="w-full max-w-md">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold text-center">
                Create an account
              </CardTitle>
              <CardDescription className="text-center">
                Enter your information to create an account
              </CardDescription>
            </CardHeader>
            <CardContent>
              {error && (
                <AlertDialog variant="destructive" className="mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDialogDescription>{error}</AlertDialogDescription>
                </AlertDialog>
              )}
              {success && (
                <AlertDialog variant="destructive" className="mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDialogDescription>{success}</AlertDialogDescription>
                </AlertDialog>
              )}
              <form onSubmit={handleSubmit(handleRegister)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Controller
                    name="name"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        id="name"
                        placeholder="John Doe"
                        className={errors?.name ? "border-red-500" : ""}
                      />
                    )}
                  />
                  {errors?.name && (
                    <p className="text-sm text-red-500">{errors?.name}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Controller
                    name="email"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        id="email"
                        type="email"
                        placeholder="john.doe@example.com"
                        className={errors?.email ? "border-red-500" : ""}
                      />
                    )}
                  />
                  {errors?.email && (
                    <p className="text-sm text-red-500">{errors?.email?.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="mobileNumber">Phone Number</Label>
                  <Controller
                    name="mobileNumber"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        id="mobileNumber"
                        type="text"
                        placeholder="1234567898"
                        pattern="^[6-9]\d{9}$"
                        title="Enter a valid 10-digit WhatsApp number starting with 6-9"
                        className={errors?.mobileNumber ? "border-red-500" : ""}
                      />
                    )}
                  />
                  {errors?.mobileNumber && (
                    <p className="text-sm text-red-500">
                      {errors?.mobileNumber?.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Controller
                    name="password"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        id="password"
                        type="password"
                        className={errors?.password ? "border-red-500" : ""}
                      />
                    )}
                  />
                  {errors?.password && (
                    <p className="text-sm text-red-500">
                      {errors?.password?.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Controller
                    name="confirmPassword"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        id="confirmPassword"
                        type="password"
                        className={errors?.confirmPassword ? "border-red-500" : ""}
                      />
                    )}
                  />
                  {errors?.confirmPassword && (
                    <p className="text-sm text-red-500">
                      {errors?.confirmPassword?.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="referralCode">Referral Code</Label>
                  <Controller
                    name="referralCode"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        id="referralCode"
                        type="text"
                        className={errors?.referralCode ? "border-red-500" : ""}
                      />
                    )}
                  />
                  {errors?.referralCode && (
                    <p className="text-sm text-red-500">
                      {errors?.referralCode?.message}
                    </p>
                  )}
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Creating account..." : "Register"}
                </Button>
              </form>
            </CardContent>
            <CardFooter className="flex justify-center">
              <p className="text-sm text-gray-500">
                Already have an account?{" "}
                <Link
                  to="/auth/login"
                  className="text-primary font-medium hover:underline"
                >
                  Sign in
                </Link>
              </p>
            </CardFooter>
          </Card>
        ) : (
          <Card className="w-full max-w-md">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold text-center">
                Verify Your Phone Number
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="mobileNumber">Phone Number</Label>
                <Input
                  id="mobileNumber"
                  name="mobileNumber"
                  type="number"
                  disabled
                  value={phoneData?.mobileNumber}
                  onChange={handlePhoneChange}
                  required
                />
              </div>
              <div>OTP sent to mobile number.</div>
              <div className="space-y-2">
                <Label htmlFor="otp">OTP</Label>
                <Input
                  id="otp"
                  name="otp"
                  type="text"
                  inputMode="numeric"
                  onChange={handlePhoneChange}
                  required
                />
              </div>
              <Button className="w-full" onClick={handleVerifyOTP}>
                Verify OTP
              </Button>

              {phoneData.timer > 0 ? (
                <p className="w-full text-center">
                  Resend OTP in {phoneData?.timer} seconds
                </p>
              ) : (
                <Button
                  className="w-full"
                  onClick={handleSendOTP}
                  disabled={!phoneData?.canResend}
                >
                  Resend OTP
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </>
  );
};

export default RegisterComponent;
