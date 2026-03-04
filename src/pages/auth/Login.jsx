import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { Clock } from "lucide-react";

import { useDispatch } from "react-redux";
import { loginStart, loginSuccess, loginFailure } from "@/store/slices/authSlice";
import toast from 'react-hot-toast';

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const justRegistered = location.state?.registered === true;

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    dispatch(loginStart());

    try {
      const res = await fetch("https://api.petrajuniors.com/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      // Check if response is JSON
      const contentType = res.headers.get("content-type");
      let data;
      if (contentType && contentType.includes("application/json")) {
        data = await res.json();
      } else {
        const errorText = await res.text();
        console.error("Server returned non-JSON response:", errorText);
        throw new Error("Received unexpected response from server. Check console for details.");
      }

      if (!res.ok) {
        let errorMsg = data.message || "Your email or password is not correct";
        
        // If the backend reveals it's an admin role, hide it with the generic message
        if (errorMsg.toLowerCase().includes('admin')) {
          errorMsg = "Your email or password is not correct";
        }
        
        setErrors({ api: errorMsg });
        dispatch(loginFailure(errorMsg));
        return;
      }

      const userRole = data.role_name || data.role;

      // Prevent admin login through this portal
      if (userRole === 'admin') {
        const errorMsg = "Your email or password is not correct";
        setErrors({ api: errorMsg });
        dispatch(loginFailure(errorMsg));
        return;
      }

      // Successful login for customer or provider
      toast.success(`Welcome back, ${data.name || 'User'}!`);

      dispatch(
        loginSuccess({
          user: {
            id: data.id,
            email: data.email,
            name: data.name,
            image: data.image,
            phone: data.phone,
            city: data.city,
            role: userRole,
          },
          token: data.token,
          role: userRole,
        })
      );

      if (userRole === "customer") {
        navigate("/customer/booking");
      } else if (userRole === "provider") {
        // Save provider status for the pending notification
        if (data.status) {
          localStorage.setItem('providerStatus', data.status);
        }
        navigate("/provider");
      } else {
        navigate("/");
      }
    } catch (error) {
      console.error(error);
      const errorMsg = "Something went wrong, try again";
      setErrors({ api: errorMsg });
      dispatch(loginFailure(errorMsg));
    } finally {
      setLoading(false);
    }

    console.log(errors.api);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden bg-gray-50/50">
      {/* Decorative Blobs */}
      <div className="absolute top-0 -left-20 w-[600px] h-[600px] bg-[#64CCC5]/5 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-0 -right-20 w-[600px] h-[600px] bg-[#04364A]/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="w-full max-w-xl relative z-10">
        <div className="bg-white shadow-2xl rounded-[3rem] p-10 sm:p-14 border border-white/20">
          {/* Brand Logo */}
          <div className="flex flex-col items-center mb-10">
            <Link to="/" className="flex items-center gap-3 mb-6 group">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-[#04364A] shadow-xl shadow-[#04364A]/20 group-hover:scale-110 transition-transform duration-500">
                <span className="text-[#64CCC5] font-black text-2xl">P</span>
              </div>
            </Link>

            <div className="text-center">
              <h1 className="text-4xl font-black text-[#04364A] mb-3 tracking-tight">
                Welcome Back
              </h1>
            </div>
          </div>

          {/* Pending Approval Banner - shown for providers right after signup */}
          {justRegistered && (
            <div className="mb-6 p-5 bg-amber-50 border border-amber-200 rounded-2xl flex gap-4 items-start animate-in fade-in slide-in-from-top-2">
              <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                <Clock className="text-amber-600" size={20} />
              </div>
              <div>
                <p className="font-black text-amber-800 text-sm mb-1">Registration Successful! 🎉</p>
                <p className="text-amber-700 text-xs leading-relaxed">
                  Your provider account is <strong>pending admin approval</strong>. You can log in now and track your status from your portal. Services will be visible once your account is activated.
                </p>
              </div>
            </div>
          )}

          {/* Error Message */}
          {errors.api && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm font-bold animate-in fade-in slide-in-from-top-2">
              {errors.api}
            </div>
          )}

          {/* Form */}
          <form className="space-y-6" onSubmit={handleSubmit} noValidate>
            <div>
              <label className="block mb-2 text-sm font-bold text-[#04364A] tracking-wide">
                Email Address
              </label>
              <input
                type="email"
                placeholder="name@example.com"
                value={formData.email}
                onChange={(e) => {
                  setFormData({ ...formData, email: e.target.value });
                  if (errors.email) setErrors({ ...errors, email: "" });
                }}
                autoComplete="email"
                className={`w-full px-4 py-3 border-2 ${
                  errors.email ? "border-red-500" : "border-gray-200"
                } rounded-xl focus:ring-2 focus:ring-[#176B87]/10 focus:border-[#176B87] outline-none transition-all bg-white/50 placeholder:text-[#176B87]/40`}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-500 font-medium">
                  {errors.email}
                </p>
              )}
            </div>

            <div className="relative">
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-bold text-[#04364A] tracking-wide">
                  Password
                </label>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => {
                    setFormData({ ...formData, password: e.target.value });
                    if (errors.password) setErrors({ ...errors, password: "" });
                  }}
                  autoComplete="current-password"
                  className={`w-full px-4 py-3 border-2 ${
                    errors.password ? "border-red-500" : "border-gray-200"
                  } rounded-xl focus:ring-2 focus:ring-[#176B87]/10 focus:border-[#176B87] outline-none transition-all bg-white/50 placeholder:text-[#176B87]/40 pr-12`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#176B87] hover:text-[#64CCC5] transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-500 font-medium">
                  {errors.password}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-[#04364A] text-white py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-xs hover:bg-[#176B87] hover:shadow-2xl hover:scale-[1.02] transition-all duration-500 flex items-center justify-center gap-3 ${
                loading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {loading && (
                <svg
                  className="animate-spin h-[18px] w-[18px]"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8z"
                  ></path>
                </svg>
              )}
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          {/* Divider */}
          <div className="my-8 flex items-center">
            <div className="flex-1 border-t-2 border-[#64CCC5]/20"></div>
            <span className="px-4 text-sm font-bold text-[#176B87]">or</span>
            <div className="flex-1 border-t-2 border-[#64CCC5]/20"></div>
          </div>

          {/* Links */}
          <div className="text-center">
            <p className="text-sm font-medium text-[#04364A]">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="text-[#176B87] font-bold hover:text-[#64CCC5] transition-colors underline decoration-2 underline-offset-2"
              >
                Register Now
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;