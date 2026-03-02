import React, { useState, useRef } from 'react'
import { Camera, User, Eye, EyeOff } from 'lucide-react'

const StepInfo = ({ formData, setFormData, nextStep, backendErrors = {} }) => {
  const [errors, setErrors] = useState({});
  const fileInputRef = useRef(null);
  const [previewUrl, setPreviewUrl] = useState(formData.profilePicture ? URL.createObjectURL(formData.profilePicture) : null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validate = () => {
    const newErrors = { ...backendErrors };
    const firstName = formData.fullName.split(' ')[0] || '';
    const lastName = formData.fullName.split(' ').slice(1).join(' ') || '';

    if (!firstName.trim()) newErrors.firstName = "First name is required";
    if (!lastName.trim()) newErrors.lastName = "Last name is required";

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.phone.trim()) newErrors.phone = "Phone is required";

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Confirmation is required";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (!formData.city.trim()) newErrors.city = "City is required";
    if (!formData.address.trim()) newErrors.address = "Address is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Update effect to sync backendErrors when they change
  React.useEffect(() => {
    if (Object.keys(backendErrors).length > 0) {
      setErrors(prev => ({ ...prev, ...backendErrors }));
    }
  }, [backendErrors]);

  const handleNext = () => {
    if (validate()) {
      nextStep();
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors({ ...errors, [field]: "" });
  };

  const handleNameChange = (isFirst, value) => {
    const parts = formData.fullName.split(' ');
    let newFullName = "";
    if (isFirst) {
      newFullName = `${value} ${parts.slice(1).join(' ')}`;
      if (errors.firstName) setErrors({ ...errors, firstName: "" });
    } else {
      newFullName = `${parts[0] || ''} ${value}`;
      if (errors.lastName) setErrors({ ...errors, lastName: "" });
    }
    setFormData(prev => ({ ...prev, fullName: newFullName }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, profilePicture: file }));
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Profile Picture Upload */}
      <div className="flex flex-col items-center justify-center mb-4">
        <div
          onClick={triggerFileInput}
          className="relative group cursor-pointer"
        >
          <div className={`w-32 h-32 rounded-full border-4 ${previewUrl ? 'border-[#64CCC5]' : 'border-gray-100'} overflow-hidden bg-white/50 flex items-center justify-center shadow-inner transition-all group-hover:border-[#64CCC5] group-hover:shadow-lg`}>
            {previewUrl ? (
              <img src={previewUrl} alt="Profile Preview" className="w-full h-full object-cover" />
            ) : (
              <User size={48} className="text-[#176B87]/30" />
            )}
          </div>
          <div className="absolute bottom-0 right-0 bg-[#176B87] p-2 rounded-full text-white shadow-lg transform transition-transform group-hover:scale-110">
            <Camera size={20} />
          </div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept="image/*"
          />
        </div>
        <p className="mt-3 text-[10px] font-black text-[#04364A]  tracking-widest">Profile Picture</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-xs font-black text-[#04364A]  tracking-widest mb-2 ml-1">First Name</label>
          <input
            type="text"
            placeholder="Enter your first name"
            className={`w-full px-5 py-3 border-2 ${errors.firstName ? 'border-red-500' : 'border-gray-200'} rounded-xl bg-white/50 outline-none transition-all focus:ring-2 focus:ring-[#176B87]/10 focus:border-[#176B87] font-bold text-sm placeholder:text-[#176B87]/40`}
            autoComplete="given-name"
            value={formData.fullName.split(' ')[0] || ''}
            onChange={(e) => handleNameChange(true, e.target.value)}
          />
          {errors.firstName && <p className="mt-1 text-xs text-red-500 font-medium">{errors.firstName}</p>}
        </div>
        <div>
          <label className="block text-xs font-black text-[#04364A]  tracking-widest mb-2 ml-1">Last Name</label>
          <input
            type="text"
            placeholder="Enter your last name"
            className={`w-full px-5 py-3 border-2 ${errors.lastName ? 'border-red-500' : 'border-gray-200'} rounded-xl bg-white/50 outline-none transition-all focus:ring-2 focus:ring-[#176B87]/10 focus:border-[#176B87] font-bold text-sm placeholder:text-[#176B87]/40`}
            autoComplete="family-name"
            value={formData.fullName.split(' ').slice(1).join(' ') || ''}
            onChange={(e) => handleNameChange(false, e.target.value)}
          />
          {errors.lastName && <p className="mt-1 text-xs text-red-500 font-medium">{errors.lastName}</p>}
        </div>

        <div>
          <label className="block text-xs font-black text-[#04364A]  tracking-widest mb-2 ml-1">Email</label>
          <input
            type="email"
            placeholder="Enter your business email"
            className={`w-full px-5 py-3 border-2 ${errors.email ? 'border-red-500' : 'border-gray-200'} rounded-xl bg-white/50 outline-none transition-all focus:ring-2 focus:ring-[#176B87]/10 focus:border-[#176B87] font-bold text-sm placeholder:text-[#176B87]/40`}
            autoComplete="email"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
          />
          {errors.email && <p className="mt-1 text-xs text-red-500 font-medium">{errors.email}</p>}
        </div>
        <div>
          <label className="block text-xs font-black text-[#04364A]  tracking-widest mb-2 ml-1">Phone</label>
          <input
            type="text"
            placeholder="Enter your phone number"
            className={`w-full px-5 py-3 border-2 ${errors.phone ? 'border-red-500' : 'border-gray-200'} rounded-xl bg-white/50 outline-none transition-all focus:ring-2 focus:ring-[#176B87]/10 focus:border-[#176B87] font-bold text-sm placeholder:text-[#176B87]/40`}
            autoComplete="tel"
            value={formData.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
          />
          {errors.phone && <p className="mt-1 text-xs text-red-500 font-medium">{errors.phone}</p>}
        </div>

        <div className="relative">
          <label className="block text-xs font-black text-[#04364A]  tracking-widest mb-2 ml-1">Password</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              autoComplete="new-password"
              className={`w-full px-5 py-3 border-2 ${errors.password ? 'border-red-500' : 'border-gray-200'} rounded-xl bg-white/50 outline-none transition-all focus:ring-2 focus:ring-[#176B87]/10 focus:border-[#176B87] font-bold text-sm placeholder:text-[#176B87]/40 pr-12`}
              value={formData.password}
              onChange={(e) => handleChange('password', e.target.value)}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[#176B87] hover:text-[#64CCC5] transition-colors"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.password && <p className="mt-1 text-xs text-red-500 font-medium">{errors.password}</p>}
        </div>
        <div className="relative">
          <label className="block text-xs font-black text-[#04364A]  tracking-widest mb-2 ml-1">Confirm Password</label>
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="••••••••"
              autoComplete="new-password"
              className={`w-full px-5 py-3 border-2 ${errors.confirmPassword ? 'border-red-500' : 'border-gray-200'} rounded-xl bg-white/50 outline-none transition-all focus:ring-2 focus:ring-[#176B87]/10 focus:border-[#176B87] font-bold text-sm placeholder:text-[#176B87]/40 pr-12`}
              value={formData.confirmPassword}
              onChange={(e) => handleChange('confirmPassword', e.target.value)}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[#176B87] hover:text-[#64CCC5] transition-colors"
            >
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.confirmPassword && <p className="mt-1 text-xs text-red-500 font-medium">{errors.confirmPassword}</p>}
        </div>

        <div>
          <label className="block text-xs font-black text-[#04364A]  tracking-widest mb-2 ml-1">City</label>
          <input
            type="text"
            placeholder="Enter your city"
            className={`w-full px-5 py-3 border-2 ${errors.city ? 'border-red-500' : 'border-gray-200'} rounded-xl bg-white/50 outline-none transition-all focus:ring-2 focus:ring-[#176B87]/10 focus:border-[#176B87] font-bold text-sm placeholder:text-[#176B87]/40`}
            autoComplete="address-level2"
            value={formData.city}
            onChange={(e) => handleChange('city', e.target.value)}
          />
          {errors.city && <p className="mt-1 text-xs text-red-500 font-medium">{errors.city}</p>}
        </div>
        <div>
          <label className="block text-xs font-black text-[#04364A]  tracking-widest mb-2 ml-1">Address</label>
          <input
            type="text"
            placeholder="Enter your address"
            className={`w-full px-5 py-3 border-2 ${errors.address ? 'border-red-500' : 'border-gray-200'} rounded-xl bg-white/50 outline-none transition-all focus:ring-2 focus:ring-[#176B87]/10 focus:border-[#176B87] font-bold text-sm placeholder:text-[#176B87]/40`}
            autoComplete="street-address"
            value={formData.address}
            onChange={(e) => handleChange('address', e.target.value)}
          />
          {errors.address && <p className="mt-1 text-xs text-red-500 font-medium">{errors.address}</p>}
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <button
          onClick={handleNext}
          className="bg-[#04364A] hover:shadow-xl text-white px-10 py-4 rounded-xl text-xs font-black  transition-all active:scale-95 shadow-lg tracking-widest hover:scale-[1.02] duration-300"
        >
          Next Step
        </button>
      </div>
    </div>
  )
}

export default StepInfo
