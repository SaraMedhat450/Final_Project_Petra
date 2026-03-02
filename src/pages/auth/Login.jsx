
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";


import { useDispatch } from "react-redux";
import { loginStart, loginSuccess, loginFailure } from "@/store/slices/authSlice";

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
        const errorMsg = data.message || "Invalid email or password";
        setErrors({ api: errorMsg });
        dispatch(loginFailure(errorMsg));
        return;
      }

      // Successful login
      dispatch(
        loginSuccess({
          user: {
            id: data.id,
            email: data.email,
            name: data.name,
            image: data.image,
            phone: data.phone,
            city: data.city,
            role: data.role_name || data.role,
          },
          token: data.token,
          role: data.role_name || data.role, // Handle potential variations in key
        })
      );

      const userRole = data.role_name || data.role;
      if (userRole === "customer") {
        navigate("/customer/main");
      } else if (userRole === "provider") {
        navigate("/provider/main");
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
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
      
        <div className="bg-white/95 backdrop-blur-sm shadow-2xl rounded-3xl p-8 sm:p-10 border border-white/20">
        
          <div className="text-center mb-8">
            <h1 className="text-4xl font-black text-[#04364A] mb-2 tracking-tight">
              Welcome Back
            </h1>
            <p className="text-[#176B87] font-medium">Sign in to your account</p>
          </div>

          {/* Form */}
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block mb-2 text-sm font-bold text-[#04364A]  tracking-wide">
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
                  errors.email ? 'border-red-500' : 'border-[#64CCC5]/30'
                } rounded-xl focus:ring-2 focus:ring-[#64CCC5] focus:border-[#64CCC5] outline-none transition-all bg-white/50 placeholder:text-[#176B87]/40`}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-500 font-medium">{errors.email}</p>
              )}
            </div>

            <div className="relative">
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-bold text-[#04364A]  tracking-wide">
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
                    errors.password ? 'border-red-500' : 'border-[#64CCC5]/30'
                  } rounded-xl focus:ring-2 focus:ring-[#64CCC5] focus:border-[#64CCC5] outline-none transition-all bg-white/50 placeholder:text-[#176B87]/40 pr-12`}
                />
                
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-500 font-medium">{errors.password}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-[#04364A] text-white py-4 rounded-xl font-bold text-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300  tracking-wider"
            >
              Sign In
            </button>

            {errors.api && (
              <p className="text-center text-red-500 font-medium mt-2">
                {errors.api}
              </p>
            )}

          </form>

          {/* Divider */}
          <div className="my-8 flex items-center">
            <div className="flex-1 border-t-2 border-[#64CCC5]/20"></div>
            <span className="px-4 text-sm font-bold text-[#176B87] ">or</span>
            <div className="flex-1 border-t-2 border-[#64CCC5]/20"></div>
          </div>

          {/* Links */}
          <div className="space-y-4 text-center">
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