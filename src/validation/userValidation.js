import * as yup from "yup";

// Form validation schema
export const registerSchema = yup.object().shape({
  name: yup
    .string()
    .min(2, "Full name must be at least 2 characters")
    .required("Full name is required"),
  email: yup
    .string()
    .email("Please enter a valid email address")
    .required("Email is required"),
  mobileNumber: yup
    .string()
    .length(10, "Mobile number must be of 10 characters"),
  password: yup
    .string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password"), null], "Passwords do not match")
    .required("Confirm Password is required"),
  referralCode: yup.string().required("Referral Code is required"),
});
