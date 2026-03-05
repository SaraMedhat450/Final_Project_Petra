
import React, { useState } from 'react'
import StepInfo from '@/components/auth/StepInfo'
import StepServices from '@/components/auth/StepServices'
import toast from 'react-hot-toast';
import { API_ENDPOINTS, COMMON_HEADERS } from '@/config/api';
import { Link, useNavigate } from 'react-router-dom'

const ProviderRegister = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);

  // Initialize from localStorage if available
  const [formData, setFormData] = useState(() => {
    const saved = localStorage.getItem('provider_reg_data');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Don't restore file objects as they can't be stringified/parsed
        return { ...parsed, profilePicture: null, serviceImg: null };
      } catch (e) {
        console.error("Failed to parse saved data", e);
      }
    }
    return {
      fullName: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      address: "",
      city: "",
      service: "",
      price: "",
      max_price: "",
      days: [],
      hours: "",
      profilePicture: null,
      categoryId: "",
      subcategoryId: "",
      price_Type: "Hourly",
      serviceImg: null,
      description: "",
      companyConission: "10%",
      availability: {},
      isAlwaysAvailable: true,
      activeServices: [],
      serviceId: "",
      service_title_id: ""
    };
  });

  const [loading, setLoading] = useState(false);
  const [backendErrors, setBackendErrors] = useState({});

  // Save to localStorage whenever formData changes
  React.useEffect(() => {
    // Only save serializable data (no File objects)
    const { profilePicture, serviceImg, ...serializableData } = formData;
    localStorage.setItem('provider_reg_data', JSON.stringify(serializableData));
  }, [formData]);

  const submitForm = async (isSkipping = false) => {
    setLoading(true);
    setBackendErrors({});

    try {
      // Get service data from added services or current form
      const serviceData = formData.activeServices.length > 0
        ? formData.activeServices[0]
        : {
          service_title_id: formData.service_title_id,
          serviceId: formData.serviceId,
          price: formData.price,
          max_price: formData.max_price,
          categoryId: formData.categoryId,
          subcategoryId: formData.subcategoryId,
          price_Type: formData.price_Type,
          description: formData.description,
          image: formData.serviceImg
        };

      let day_of_week = null;
      let start_time = null;
      let end_time = null;
      let availabilityStatus = null;

      if (!isSkipping) {
        if (formData.isAlwaysAvailable) {
          day_of_week = "All Days";
          availabilityStatus = "always available";
          start_time = "09:00";
          end_time = "17:00";
        } else {
          availabilityStatus = "available";
          const scheduledDays = Object.keys(formData.availability || {}).filter(
            day => formData.availability[day]?.length > 0
          );

          if (scheduledDays.length > 0) {
            const firstDay = scheduledDays[0];
            const firstSlot = formData.availability[firstDay][0];
            day_of_week = firstDay;
            start_time = firstSlot.from;
            end_time = firstSlot.to;
          }
        }
      }

      // Service image name for the images JSON field
      const serviceImageName = serviceData.image instanceof File
        ? serviceData.image.name
        : (serviceData.displayImage || serviceData.image || "service.jpg");

      console.log("🛠 Preparing FormData. Current profilePicture:", formData.profilePicture);
      // Always use FormData so multer can handle file uploads
      const fd = new FormData();

      // --- User fields ---
      fd.append('name', formData.fullName);
      fd.append('email', formData.email);
      fd.append('password', formData.password);
      fd.append('phone', formData.phone);
      fd.append('address', formData.address || '');
      fd.append('city', formData.city || '');

      // --- Profile picture ---
      if (formData.profilePicture && (formData.profilePicture instanceof File || formData.profilePicture instanceof Blob)) {
        console.log("✅ Appending profile picture file:", formData.profilePicture.name);
        fd.append('image', formData.profilePicture);
      } else {
        console.log("⚠️ No profile picture file found, sending default string.");
        fd.append('image', 'profile.jpg');
      }

      // --- Service fields ---
      if (!isSkipping) {
        if (serviceData.categoryId || formData.categoryId) {
          fd.append('categoryId', String(serviceData.categoryId || formData.categoryId));
        }
        if (serviceData.subcategoryId || formData.subcategoryId) {
          fd.append('subcategoryId', String(serviceData.subcategoryId || formData.subcategoryId));
        }
        if (serviceData.service_title_id || formData.service_title_id) {
          fd.append('service_title_id', String(serviceData.service_title_id || formData.service_title_id));
        }

        const pType = serviceData.price_Type || formData.price_Type;
        if (pType) fd.append('price_Type', pType);

        const finalPrice = serviceData.price || formData.price;
        if (finalPrice) fd.append('price', String(finalPrice));

        const finalMaxPrice = serviceData.max_price || formData.max_price || finalPrice;
        if (finalMaxPrice) fd.append('max_price', String(finalMaxPrice));

        if (serviceData.description || formData.description) {
          fd.append('description', serviceData.description || formData.description);
        }

        // --- Service image ---
        if (serviceData.image && (serviceData.image instanceof File || serviceData.image instanceof Blob)) {
          console.log("✅ Appending service image file:", serviceData.image.name);
          fd.append('images', serviceData.image);
        } else {
          console.log("ℹ️ No service image file found, sending JSON image name:", serviceImageName);
          fd.append('images', JSON.stringify([serviceImageName]));
        }
      }
      fd.append('commission_fee', formData.companyConission || '10%');

      if (!isSkipping) {
        if (availabilityStatus) fd.append('availabilityStatus', availabilityStatus);
        if (day_of_week) fd.append('day_of_week', day_of_week);
        if (start_time) fd.append('start_time', start_time);
        if (end_time) fd.append('end_time', end_time);

        const availabilities = [];
        if (formData.isAlwaysAvailable) {
          availabilities.push({ day_of_week: 'All Days', start_time: '09:00', end_time: '17:00' });
        } else {
          Object.keys(formData.availability || {}).forEach(day => {
            (formData.availability[day] || []).forEach(slot => {
              availabilities.push({ day_of_week: day, start_time: slot.from, end_time: slot.to });
            });
          });
        }
        if (availabilities.length > 0) {
          fd.append('availabilities', JSON.stringify(availabilities));
        }
      }

      console.log("📤 Submitting Provider Registration (FormData):");

      const response = await fetch(API_ENDPOINTS.REGISTER_PROVIDER, {
        method: "POST",
        body: fd,
      });

      const result = await handleResponse(response);
      return result;

    } catch (error) {
      console.error("Provider registration error:", error);
      toast.error("An error occurred. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };


  const handleResponse = async (response) => {
    if (!response.ok && response.status !== 400) {
      const text = await response.text();
      console.error("Backend Error:", text);

      // Check if it's an ngrok error
      if (text.includes('ngrok') || text.includes('ERR_NGROK')) {
        toast.error("Backend server appears to be offline.");
      } else {
        toast.error(`Registration failed with status ${response.status}`);
      }
      return;
    }

    const contentType = response.headers.get("content-type");
    let data = {};
    if (contentType && contentType.indexOf("application/json") !== -1) {
      data = await response.json();
    } else {
      const text = await response.text();
      if (text.includes('ngrok') || text.includes('ERR_NGROK')) {
        alert("⚠️ Your backend server (ngrok tunnel) appears to be offline. Please restart it and try again.");
        return;
      }
      throw new Error(`Expected JSON but got: ${text.substring(0, 100)}...`);
    }

    if (response.ok) {
      toast.success("Registration successful!");
      localStorage.removeItem('provider_reg_data');
      navigate("/login");
    } else {
      // Show the specific error message from the backend
      if (data.errors) {
        const errorsObj = {};
        data.errors.forEach(err => {
          errorsObj[err.path === "name" ? "fullName" : err.path] = err.msg;
        });
        setBackendErrors(errorsObj);

        const basicInfoFields = ["fullName", "email", "phone", "password"];
        if (data.errors.some(err => basicInfoFields.includes(err.path === "name" ? "fullName" : err.path))) {
          setStep(1);
        }

        const firstError = data.errors[0]?.msg || "Validation failed";
        toast.error(`Registration failed: ${firstError}`);
      } else {
        toast.error(`Registration failed: ${data.message || "Unknown error"}`);
      }
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden bg-gray-50/50">
      {/* Decorative Blobs */}
      <div className="absolute top-0 -left-20 w-[600px] h-[600px] bg-[#64CCC5]/5 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-0 -right-20 w-[600px] h-[600px] bg-[#04364A]/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="w-full max-w-5xl relative z-10">
        {/* Brand Logo */}
        <div className="flex flex-col items-center mb-10">

          <div className="text-center">
            <h1 className="text-5xl font-black text-[#04364A] mb-3 tracking-tight">
              Provider Sign Up
            </h1>
          </div>
        </div>

        {/* Tab Headers */}
        <div className="flex w-full overflow-hidden rounded-t-3xl shadow-lg">
          <button
            onClick={() => setStep(1)}
            className={`flex-1 py-6 text-sm font-black uppercase tracking-widest transition-all duration-300 ${step === 1
              ? 'bg-white text-[#04364A] shadow-lg'
              : 'bg-white/20 backdrop-blur-sm text-white/60'
              }`}
          >
            Basic Information
          </button>
          <button
            onClick={() => step > 1 && setStep(2)}
            className={`flex-1 py-6 text-sm font-black uppercase tracking-widest transition-all duration-300 ${step === 2
              ? 'bg-white text-[#04364A] shadow-lg'
              : 'bg-[#64CCC5] backdrop-blur-sm text-[#f7fbff]'
              }`}
            disabled={step < 2}
          >
            Services Information
          </button>
        </div>

        {/* Content Container */}
        <div className="bg-white/95 backdrop-blur-sm p-8 sm:p-14 shadow-2xl rounded-b-3xl relative border-t-4 border-[#64CCC5]">
          <form onSubmit={(e) => e.preventDefault()} className="transition-all duration-300">
            {step === 1 && (
              <StepInfo
                formData={formData}
                setFormData={setFormData}
                nextStep={() => setStep(2)}
                backendErrors={backendErrors}
              />
            )}

            {step === 2 && (
              <StepServices
                formData={formData}
                setFormData={setFormData}
                submitForm={submitForm}
                loading={loading}
                backendErrors={backendErrors}
              />
            )}
          </form>

          {/* Footer Links */}
          <div className="mt-12 pt-8 border-t-2 border-[#64CCC5]/20 text-center space-y-4">
            <p className="text-[#04364A] text-sm font-bold uppercase tracking-widest">
              Already have Account?{' '}
              <Link
                to="/login"
                className="text-[#176B87]  decoration-2 underline-offset-4 hover:text-[#64CCC5] transition-colors"
              >
                Sign In
              </Link>
            </p>
            <p className="text-xs font-bold text-[#176B87] uppercase tracking-widest">
              Want to Sign Up as Customer?{' '}
              <Link
                to="/signup"
                className="text-[#04364A]  decoration-1 underline-offset-2 hover:text-[#64CCC5] transition-colors"
              >
                Click Here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProviderRegister