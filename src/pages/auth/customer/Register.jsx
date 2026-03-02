import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { API_ENDPOINTS, COMMON_HEADERS } from "@/config/api";

const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
      username: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      city: "",
      address: "",
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
    const handleChange = (e) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
      // Clear error for this field when user starts typing
      if (errors[e.target.name]) {
        setErrors({ ...errors, [e.target.name]: "" });
      }
    };
  
    const validateForm = () => {
      const newErrors = {};
  
      if (!formData.username.trim()) {
        newErrors.username = "Username is required";
      }
  
      if (!formData.email) {
        newErrors.email = "Email is required";
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = "Email is invalid";
      }
  
      if (!formData.phone.trim()) {
        newErrors.phone = "Phone is required";
      }
  
      if (!formData.password) {
        newErrors.password = "Password is required";
      } else if (formData.password.length < 6) {
        newErrors.password = "Password must be at least 6 characters";
      }
  
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = "Please confirm your password";
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      }
  
      if (!formData.city.trim()) {
        newErrors.city = "City is required";
      }
  
      if (!formData.address.trim()) {
        newErrors.address = "Address is required";
      }
  
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      if (validateForm()) {
        setLoading(true);
        try {
          const payload = {
            name: formData.username,
            email: formData.email,
            password: formData.password,
            phone: formData.phone,
            address: formData.address,
            city: formData.city,
            image: "https://example.com/image.jpg",
            role: "customer",
          };
  
          const response = await fetch(API_ENDPOINTS.REGISTER_CUSTOMER, {
            method: "POST",
            headers: COMMON_HEADERS,
            body: JSON.stringify(payload),
          });

        const contentType = response.headers.get("content-type");
        let data = {};
        if (contentType && contentType.indexOf("application/json") !== -1) {
            data = await response.json();
        } else {
            const text = await response.text();
            throw new Error(`Server returned non-JSON response: ${text.substring(0, 100)}`);
        }

        if (response.ok) {
          alert("Registration Successful!");
          navigate("/login");
        } else {
          // Log the raw data so we can see the exact validation error
          console.log("BE Error Detail:", data);
          
          if (data.errors) {
            const backendErrors = {};
            data.errors.forEach(err => {
              backendErrors[err.path === "name" ? "username" : err.path] = err.msg;
            });
            setErrors(backendErrors);
          } else {
            alert(data.message || "Registration failed. Check console for details.");
          }
        }
      } catch (error) {
        console.error("Registration error:", error);
        alert("An error occurred. Please check your connection.");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden bg-gray-50/50">
      {/* Decorative Blobs */}
      <div className="absolute top-0 -left-20 w-[600px] h-[600px] bg-[#64CCC5]/5 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-0 -right-20 w-[600px] h-[600px] bg-[#04364A]/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="w-full max-w-4xl relative z-10">
        <div className="bg-white shadow-2xl rounded-[3rem] p-10 sm:p-14 border border-white/20">
          
       
          <div className="flex flex-col items-center mb-10">
            
            <div className="text-center">
                <h1 className="text-5xl font-black text-[#04364A] mb-3 tracking-tight">
                Create Account
                </h1>
                <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Start your service journey with us</p>
            </div>
          </div>

          {/* Form */}
          <form
            className="grid grid-cols-1 sm:grid-cols-2 gap-6"
            onSubmit={handleSubmit}
          >
            <div className="sm:col-span-2">
              <label className="block mb-2 text-sm font-bold text-[#04364A]  tracking-wide">
                Username
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Enter your username"
                autoComplete="username"
                className={`w-full px-4 py-3 border-2 ${
                  errors.username ? 'border-red-500' : 'border-gray-200'
                } rounded-xl focus:ring-2 focus:ring-[#176B87]/10 focus:border-[#176B87] outline-none transition-all bg-white/50 placeholder:text-[#176B87]/40`}
              />
              {errors.username && (
                <p className="mt-1 text-sm text-red-500 font-medium">{errors.username}</p>
              )}
            </div>

            <div className="sm:col-span-2">
              <label className="block mb-2 text-sm font-bold text-[#04364A]  tracking-wide">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="name@example.com"
                autoComplete="email"
                className={`w-full px-4 py-3 border-2 ${
                  errors.email ? 'border-red-500' : 'border-gray-200'
                } rounded-xl focus:ring-2 focus:ring-[#176B87]/10 focus:border-[#176B87] outline-none transition-all bg-white/50 placeholder:text-[#176B87]/40`}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-500 font-medium">{errors.email}</p>
              )}
            </div>

            <div className="sm:col-span-2">
              <label className="block mb-2 text-sm font-bold text-[#04364A]  tracking-wide">
                Phone Number
              </label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter your phone number"
                autoComplete="tel"
                className={`w-full px-4 py-3 border-2 ${
                  errors.phone ? 'border-red-500' : 'border-gray-200'
                } rounded-xl focus:ring-2 focus:ring-[#176B87]/10 focus:border-[#176B87] outline-none transition-all bg-white/50 placeholder:text-[#176B87]/40`}
              />
              {errors.phone && (
                <p className="mt-1 text-sm text-red-500 font-medium">{errors.phone}</p>
              )}
            </div>

            <div className="relative">
              <label className="block mb-2 text-sm font-bold text-[#04364A]  tracking-wide">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  autoComplete="new-password"
                  className={`w-full px-4 py-3 border-2 ${
                    errors.password ? 'border-red-500' : 'border-gray-200'
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
                <p className="mt-1 text-sm text-red-500 font-medium">{errors.password}</p>
              )}
            </div>

            <div className="relative">
              <label className="block mb-2 text-sm font-bold text-[#04364A]  tracking-wide">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  autoComplete="new-password"
                  className={`w-full px-4 py-3 border-2 ${
                    errors.confirmPassword ? 'border-red-500' : 'border-gray-200'
                  } rounded-xl focus:ring-2 focus:ring-[#176B87]/10 focus:border-[#176B87] outline-none transition-all bg-white/50 placeholder:text-[#176B87]/40 pr-12`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#176B87] hover:text-[#64CCC5] transition-colors"
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-500 font-medium">{errors.confirmPassword}</p>
              )}
            </div>

            <div>
              <label className="block mb-2 text-sm font-bold text-[#04364A]  tracking-wide">
                City
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="Enter your city"
                autoComplete="address-level2"
                className={`w-full px-4 py-3 border-2 ${
                  errors.city ? 'border-red-500' : 'border-gray-200'
                } rounded-xl focus:ring-2 focus:ring-[#176B87]/10 focus:border-[#176B87] outline-none transition-all bg-white/50 placeholder:text-[#176B87]/40`}
              />
              {errors.city && (
                <p className="mt-1 text-sm text-red-500 font-medium">{errors.city}</p>
              )}
            </div>

            <div>
              <label className="block mb-2 text-sm font-bold text-[#04364A]  tracking-wide">
                Address
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Enter your full address"
                autoComplete="street-address"
                className={`w-full px-4 py-3 border-2 ${
                  errors.address ? 'border-red-500' : 'border-gray-200'
                } rounded-xl focus:ring-2 focus:ring-[#176B87]/10 focus:border-[#176B87] outline-none transition-all bg-white/50 placeholder:text-[#176B87]/40`}
              />
              {errors.address && (
                <p className="mt-1 text-sm text-red-500 font-medium">{errors.address}</p>
              )}
            </div>

            <div className="sm:col-span-2">
              <button
                type="submit"
                disabled={loading}
                className={`w-full bg-[#04364A] text-white py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-xs hover:bg-[#176B87] hover:shadow-2xl hover:scale-[1.02] transition-all duration-500 flex items-center justify-center gap-3 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {loading ? 'Creating Your Profile...' : 'Sign Up'}
              </button>
            </div>
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
              Already have an account?{" "}
              <Link 
                to="/login" 
                className="text-[#176B87] font-bold hover:text-[#64CCC5] transition-colors underline decoration-2 underline-offset-2"
              >
                Sign In
              </Link>
            </p>

            <p className="text-sm font-medium text-[#04364A]">
              Are you a Provider?{" "}
              <Link 
                to="/provider/signup" 
                className="text-[#176B87] font-bold hover:text-[#64CCC5] transition-colors underline decoration-2 underline-offset-2"
              >
                Register Here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
