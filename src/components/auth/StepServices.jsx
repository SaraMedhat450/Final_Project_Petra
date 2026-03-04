import React, { useState, useRef } from 'react';
import { Plus, X, Clock, Trash2, Camera, Image as ImageIcon, Edit2 } from 'lucide-react';
import { API_ENDPOINTS, COMMON_HEADERS, UPLOAD_URL } from '../../config/api';

const ServiceImage = ({ img, name }) => {
  const [src, setSrc] = useState(null);

  React.useEffect(() => {
    if (!img) {
      setSrc('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="150" height="150" fill="%23ddd"><rect width="150" height="150"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%23999" font-size="14">No Image</text></svg>');
      return;
    }

    if (img instanceof File || img instanceof Blob) {
      setSrc(URL.createObjectURL(img));
      return;
    }

    if (typeof img === 'string') {
      if (img.startsWith('http')) {
        setSrc(img);
      } else {
        const clean = img.replace(/^["']|["']$/g, '').trim();
        setSrc(`${UPLOAD_URL}/${clean}`);
      }
    }
  }, [img]);

  return (
    <img
      src={src}
      alt={name}
      className="w-full h-full object-cover"
      onError={(e) => { e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="150" height="150" fill="%23ddd"><rect width="150" height="150"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%23999" font-size="14">No Image</text></svg>'; }}
    />
  );
};

const StepServices = ({ formData, setFormData, submitForm, loading, backendErrors = {} }) => {
  const [showTimeSlotModal, setShowTimeSlotModal] = useState(false);
  const [selectedDay, setSelectedDay] = useState(null);
  const [currentTimeSlot, setCurrentTimeSlot] = useState({ from: '', to: '' });
  const [errors, setErrors] = useState({});
  const fileInputRef = useRef(null);
  const [previewUrl, setPreviewUrl] = useState(formData.serviceImg ? (formData.serviceImg instanceof File ? URL.createObjectURL(formData.serviceImg) : formData.serviceImg) : null);
  const [editingServiceId, setEditingServiceId] = useState(null);

  const activeServices = formData.activeServices || [];
  const setActiveServices = (newServices) => setFormData(prev => ({ ...prev, activeServices: newServices }));

  const isAlwaysAvailable = formData.isAlwaysAvailable;
  const setIsAlwaysAvailable = (val) => setFormData(prev => ({ ...prev, isAlwaysAvailable: val }));

  // formData.availability structure: { 'Monday': [{from, to, id}, ...], ... }
  const availability = formData.availability || {};

  const days = ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [fetchingCategories, setFetchingCategories] = useState(false);

  // Fetch Categories on Mount
  React.useEffect(() => {
    const fetchCategories = async () => {
      setFetchingCategories(true);
      try {
        const response = await fetch(API_ENDPOINTS.CATEGORIES, {
          headers: COMMON_HEADERS
        });

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const data = await response.json();
        const cats = Array.isArray(data) ? data : data.categories || data.data || [];
        // Filter only active categories
        setCategories(cats.filter(cat => cat.status === 'active'));
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setFetchingCategories(false);
      }
    };
    fetchCategories();
  }, []);

  // Fetch SubCategories when category changes
  React.useEffect(() => {
    if (!formData.categoryId) {
      setSubCategories([]);
      return;
    }
    const fetchSubCategories = async () => {
      try {
        const response = await fetch(`${API_ENDPOINTS.SUBCATEGORIES}?categoryId=${formData.categoryId}`, {
          headers: COMMON_HEADERS
        });

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const data = await response.json();
        const allSubCats = Array.isArray(data) ? data : data.subCategories || data.data || [];
        
        // Final fallback filter just in case
        setSubCategories(allSubCats.filter(sub => sub.status === 'active'));
      } catch (error) {
        console.error("Error fetching subcategories:", error);
      }
    };
    fetchSubCategories();
  }, [formData.categoryId]);

  const [services, setServices] = useState([]);
  const [fetchingServices, setFetchingServices] = useState(false);

  // Fetch Services when sub-category changes
  React.useEffect(() => {
    if (!formData.subcategoryId) {
      setServices([]);
      return;
    }
    const fetchServices = async () => {
      setFetchingServices(true);
      try {
        // Use SERVICE_ALL_DETAILS which usually contains the linked service_titles
        const url = `${API_ENDPOINTS.SERVICE_ALL_DETAILS}?subcategoryId=${formData.subcategoryId}`;
        console.log("Fetching services from:", url);
        
        const response = await fetch(url, {
          headers: COMMON_HEADERS
        });

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const result = await response.json();
        const resultData = Array.isArray(result) ? result : result.data || result.services || [];

        const mapped = resultData.map(srv => {
          // Robust image extraction
          let extractedImage = srv.image || srv.images || "";
          if (typeof extractedImage === 'string' && extractedImage.length > 0) {
            try {
              if (extractedImage.startsWith('[') || extractedImage.startsWith('{') || extractedImage.includes('\"')) {
                const cleanStr = extractedImage.replace(/^["']|["']$/g, '').replace(/\\"/g, '"');
                if (cleanStr.startsWith('[') || cleanStr.startsWith('{')) {
                  const parsed = JSON.parse(cleanStr);
                  extractedImage = Array.isArray(parsed) ? parsed[0] : parsed;
                } else {
                  extractedImage = cleanStr;
                }
              }
            } catch (e) { }
          }

          return {
            ...srv,
            name: srv.service_title?.title || srv.description || srv.service || srv.name || srv.service_title || `Service #${srv.id}`,
            service_title_id: srv.service_title_id || srv.id,
            displayImage: extractedImage,
            price: srv.price || ""
          };
        });

        setServices(mapped);
      } catch (error) {
        console.error("Error fetching services:", error);
      } finally {
        setFetchingServices(false);
      }
    };
    fetchServices();
  }, [formData.subcategoryId]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, serviceImg: file }));
      setPreviewUrl(URL.createObjectURL(file));
      if (errors.serviceImg) setErrors({ ...errors, serviceImg: "" });
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const addService = () => {
    if (!formData.service || !formData.price || !formData.serviceImg) {
      setErrors({
        ...errors,
        service: !formData.service ? "Select a service" : "",
        price: !formData.price ? "Enter price" : "",
        serviceImg: !formData.serviceImg ? "Image required" : "",
        addServiceError: "Please select a service, set a price, and upload an image first."
      });
      return;
    }

    // Validate price must be less than max_price
    if (formData.max_price && Number(formData.price) >= Number(formData.max_price)) {
      setErrors({
        ...errors,
        price: `Price must be less than max price ($${formData.max_price})`,
        addServiceError: `Price must be less than the maximum price ($${formData.max_price}).`
      });
      return;
    }

    let newActiveServices;
    if (editingServiceId) {
      newActiveServices = activeServices.map(s => s.id === editingServiceId ? {
        ...s,
        name: formData.service,
        service_title_id: formData.service_title_id,
        price: formData.price,
        max_price: formData.max_price,
        categoryId: formData.categoryId,
        subcategoryId: formData.subcategoryId,
        price_Type: formData.price_Type,
        image: formData.serviceImg,
        description: formData.description,
        serviceId: formData.serviceId
      } : s);
      setEditingServiceId(null);
    } else {
      const newService = {
        id: Date.now(),
        name: formData.service,
        service_title_id: formData.service_title_id,
        price: formData.price,
        max_price: formData.max_price,
        commission: formData.companyConission,
        categoryId: formData.categoryId,
        subcategoryId: formData.subcategoryId,
        price_Type: formData.price_Type,
        image: formData.serviceImg,
        description: formData.description,
        serviceId: formData.serviceId // Store the real backend ID
      };
      newActiveServices = [...activeServices, newService];
    }

    setFormData(prev => ({
      ...prev,
      service: '',
      service_title_id: '',
      price: '',
      max_price: '',
      serviceImg: null,
      description: '',
      activeServices: newActiveServices
    }));
    setPreviewUrl(null);
    setErrors({ ...errors, service: "", price: "", activeServices: "", addServiceError: "" });
  };

  const startEditService = (service) => {
    setFormData(prev => ({
      ...prev,
      categoryId: service.categoryId,
      subcategoryId: service.subcategoryId,
      service: service.name,
      service_title_id: service.service_title_id,
      price: service.price,
      max_price: service.max_price,
      price_Type: service.price_Type,
      serviceImg: service.image,
      description: service.description || '',
      serviceId: service.serviceId
    }));

    // Determine preview URL
    if (service.image instanceof File || service.image instanceof Blob) {
      setPreviewUrl(URL.createObjectURL(service.image));
    } else {
      setPreviewUrl(service.displayImage || service.image);
    }

    setEditingServiceId(service.id);
    // Smooth scroll up to the form
    window.scrollTo({ top: 300, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setEditingServiceId(null);
    setFormData(prev => ({
      ...prev,
      service: '',
      service_title_id: '',
      price: '',
      max_price: '',
      serviceImg: null,
      description: ''
    }));
    setPreviewUrl(null);
  };

  const removeService = (id) => {
    setActiveServices(activeServices.filter(service => service.id !== id));
    if (editingServiceId === id) {
      cancelEdit();
    }
  };

  const addTimeSlot = () => {
    if (!currentTimeSlot.from || !currentTimeSlot.to || !selectedDay) return;

    // Logic check: "To" must be after "From"
    if (currentTimeSlot.to <= currentTimeSlot.from) {
      setErrors({ ...errors, timeSlot: "'To' time must be later than 'From' time" });
      return;
    }

    const newSlot = {
      id: Date.now(),
      from: currentTimeSlot.from,
      to: currentTimeSlot.to,
      display: `${currentTimeSlot.from} - ${currentTimeSlot.to}`
    };

    const daySlots = availability[selectedDay] || [];
    const updatedAvailability = {
      ...availability,
      [selectedDay]: [...daySlots, newSlot]
    };

    setFormData(prev => ({
      ...prev,
      availability: updatedAvailability,
      days: updatedAvailability[selectedDay].length > 0 && !(prev.days || []).includes(selectedDay)
        ? [...(prev.days || []), selectedDay]
        : prev.days
    }));

    setCurrentTimeSlot({ from: '', to: '' });
    setErrors({ ...errors, timeSlot: "", days: "" });
    setShowTimeSlotModal(false);
  };

  const removeTimeSlot = (day, slotId) => {
    const daySlots = availability[day] || [];
    const updatedSlots = daySlots.filter(slot => slot.id !== slotId);

    const updatedAvailability = {
      ...availability,
      [day]: updatedSlots
    };

    setFormData(prev => ({
      ...prev,
      availability: updatedAvailability
    }));
  };

  const toggleDay = (day) => {
    setSelectedDay(selectedDay === day ? null : day);
    setErrors({ ...errors, days: "" });
  };

  const handleSubmit = () => {
    const newErrors = {};
    if (activeServices.length === 0 && (!formData.service || !formData.price || !formData.serviceImg)) {
      newErrors.activeServices = "Please add at least one service. Make sure you've selected a service, set a price, and re-uploaded the service image (required after page refresh).";
    }
    if (!isAlwaysAvailable) {
      const selectedDays = Object.keys(availability).filter(day => availability[day].length > 0);
      if (selectedDays.length === 0) {
        newErrors.days = "Please set a schedule for at least one day";
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    submitForm();
  };

  const handleSkip = () => {
    // Submit the form without requiring services or schedule
    submitForm(true);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">

      {/* Service Input Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-black text-[#04364A] tracking-widest mb-2 ml-1">Category</label>
          <select
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-white/50 outline-none transition-all focus:ring-2 focus:ring-[#04364A]/10 focus:border-[#04364A] font-bold text-sm"
            value={formData.categoryId}
            onChange={(e) => {
              const catId = Number(e.target.value);
              const selectedCat = categories.find(cat => cat.id === catId);
              setFormData(prev => ({ 
                ...prev, 
                categoryId: catId, 
                subcategoryId: "", 
                service: "",
                max_price: selectedCat?.max_price || 0,
                companyConission: selectedCat?.commission_fee || "10%"
              }));
              // fetchSubCategories(catId); // This is handled by useEffect
            }}
          >
            <option value="">{fetchingCategories ? "Loading..." : "Choose Category"}</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-black text-[#04364A] tracking-widest mb-2 ml-1">Sub Category</label>
          <select
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-white/50 outline-none transition-all focus:ring-2 focus:ring-[#04364A]/10 focus:border-[#04364A] font-bold text-sm"
            value={formData.subcategoryId}
            onChange={(e) => setFormData(prev => ({ ...prev, subcategoryId: Number(e.target.value), service: "" }))}
            disabled={!formData.categoryId}
          >
            <option value="">Choose Sub Category</option>
            {subCategories.map(sub => (
              <option key={sub.id} value={sub.id}>{sub.name}</option>
            ))}
          </select>
        </div>

        <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-black text-[#04364A] tracking-widest mb-2 ml-1">Service</label>
            <select
              className={`w-full px-4 py-3 border-2 ${errors.service ? 'border-red-500' : 'border-gray-200'} rounded-xl bg-white/50 outline-none transition-all focus:ring-2 focus:ring-[#04364A]/10 focus:border-[#04364A] font-bold text-sm`}
              value={formData.service}
              onChange={(e) => {
                const selectedName = e.target.value;
                const serviceObj = services.find(s => s.name === selectedName);

                setFormData(prev => ({
                  ...prev,
                  service: selectedName,
                  service_title_id: serviceObj?.service_title_id || serviceObj?.id || "",
                  serviceId: serviceObj?.id || serviceObj?.service_title_id || "",
                  price: serviceObj?.price || prev.price,
                  max_price: serviceObj?.max_price || prev.max_price,
                  price_Type: serviceObj?.price_Type || prev.price_Type || "Hourly"
                }));
                if (errors.service) setErrors({ ...errors, service: "" });
              }}
              disabled={!formData.subcategoryId}
            >
              <option value="">{fetchingServices ? "Loading..." : "Choose Service"}</option>
              {!fetchingServices && services.length === 0 && formData.subcategoryId && (
                <option value="" disabled>No services found (SubCat ID: {formData.subcategoryId})</option>
              )}
              {services.map((srv, idx) => (
                <option key={srv.id || idx} value={srv.name}>{srv.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-black text-[#04364A] tracking-widest mb-2 ml-1">Service Image</label>
            <div className="flex flex-col items-center justify-center p-3 h-[48px] bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 hover:border-[#04364A] transition-all group cursor-pointer" onClick={triggerFileInput}>
              {previewUrl ? (
                <div className="flex items-center gap-2">
                  <Camera size={16} className="text-[#04364A]" />
                  <span className="text-[10px] font-bold text-[#04364A] truncate max-w-[150px]">Image Uploaded</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <ImageIcon size={16} className="text-[#04364A]/40" />
                  <span className="text-[10px] font-bold text-[#04364A]/40">Click to upload</span>
                </div>
              )}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept="image/*"
              />
            </div>
            {errors.serviceImg && <p className="mt-1 text-[10px] text-red-500 font-bold">{errors.serviceImg}</p>}
          </div>
        </div>
        <div className="md:col-span-2 space-y-4">
          <div>
            <label className="block text-xs font-black text-[#04364A] tracking-widest mb-2 ml-1">Commission Fee (From Category)</label>
            <input
              type="text"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-gray-50 outline-none font-bold text-sm"
              readOnly
              value={formData.companyConission ? (String(formData.companyConission).includes('%') ? formData.companyConission : `${formData.companyConission}%`) : "10%"}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-black text-[#04364A] tracking-widest mb-2 ml-1">Price Type</label>
              <select
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-white/50 outline-none transition-all focus:ring-2 focus:ring-[#04364A]/10 focus:border-[#04364A] font-bold text-sm"
                value={formData.price_Type}
                onChange={(e) => setFormData(prev => ({ ...prev, price_Type: e.target.value }))}
              >
                <option value="Hourly">Hourly</option>
                <option value="Fixed">Fixed</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-black text-[#04364A] tracking-widest mb-2 ml-1">
                Price {formData.max_price && <span className="text-gray-400 font-bold">(Max: ${formData.max_price})</span>}
              </label>
              <input
                type="number"
                placeholder="Enter price"
                className={`w-full px-4 py-3 border-2 ${errors.price ? 'border-red-500' : (formData.price && formData.max_price && Number(formData.price) >= Number(formData.max_price)) ? 'border-red-500' : 'border-gray-200'} rounded-xl bg-white/50 outline-none transition-all focus:ring-2 focus:ring-[#04364A]/10 focus:border-[#04364A] font-bold text-sm placeholder:text-[#04364A]/40`}
                value={formData.price}
                onChange={(e) => {
                  setFormData(prev => ({ ...prev, price: e.target.value }));
                  if (errors.price) setErrors({ ...errors, price: "" });
                }}
              />
              {errors.price && (
                <p className="mt-1 text-[10px] text-red-500 font-bold">{errors.price}</p>
              )}
              {formData.price && formData.max_price && Number(formData.price) > Number(formData.max_price) && !errors.price && (
                <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded-lg flex items-center justify-between">
                  <span className="text-[9px] font-black text-red-600 tracking-tight">⚠ ERROR</span>
                  <p className="text-[9px] font-bold text-red-600 uppercase">
                    Exceeds Category Max (${formData.max_price})
                  </p>
                </div>
              )}
              {formData.price && formData.max_price && Number(formData.price) < Number(formData.max_price) && (
                <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded-lg flex items-center justify-between">
                  <span className="text-[9px] font-black text-green-600 tracking-tight">✓ VALID</span>
                  <p className="text-[9px] font-bold text-green-600 uppercase">
                    Within max price (${formData.max_price})
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="block text-xs font-black text-[#04364A] tracking-widest mb-2 ml-1">Description</label>
        <textarea
          rows={3}
          placeholder="Describe your service..."
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-white/50 outline-none transition-all focus:ring-2 focus:ring-[#04364A]/10 focus:border-[#04364A] resize-none font-medium text-sm placeholder:text-[#04364A]/40"
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
        />
      </div>

      {/* Always Available Toggle */}
      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border-2 border-gray-100">
        <span className="text-sm font-black text-[#04364A] tracking-widest">Always Available</span>
        <button
          type="button"
          onClick={() => setIsAlwaysAvailable(!isAlwaysAvailable)}
          className={`relative inline-flex h-7 w-14 items-center rounded-full transition-all duration-300 ${isAlwaysAvailable ? 'bg-[#04364A]' : 'bg-gray-300'
            }`}
        >
          <span
            className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform shadow-md ${isAlwaysAvailable ? 'translate-x-8' : 'translate-x-1'
              }`}
          />
        </button>
      </div>

      {/* Days and Specific Time Slots */}
      {!isAlwaysAvailable && (
        <div className="space-y-4 p-5 bg-gray-50 rounded-xl border-2 border-gray-100">
          <div>
            <label className="block text-xs font-black text-[#04364A] tracking-widest mb-3 ml-1">Select Day to Set Schedule</label>
            <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
              {days.map((day) => {
                const hasSlots = availability[day]?.length > 0;
                return (
                  <button
                    key={day}
                    type="button"
                    onClick={() => toggleDay(day)}
                    className={`py-3 px-1 rounded-xl text-[10px] font-bold transition-all duration-200 border-2 ${selectedDay === day
                      ? 'bg-[#04364A] text-white border-[#04364A] shadow-lg scale-105'
                      : hasSlots
                        ? 'bg-gray-100 text-[#04364A] border-gray-200 border-dashed'
                        : 'bg-white text-[#176B87] border-gray-200 hover:border-[#176B87]'
                      }`}
                  >
                    {day.slice(0, 3)}
                    {hasSlots && <div className="w-1.5 h-1.5 bg-[#04364A] rounded-full mx-auto mt-1"></div>}
                  </button>
                );
              })}
            </div>
            {errors.days && <p className="mt-2 text-xs text-red-500 font-bold ml-1">{errors.days}</p>}
          </div>

          {/* Time Management for Selected Day */}
          {selectedDay && (
            <div className="mt-4 p-4 bg-white/60 rounded-2xl border-2 border-gray-100 animate-in slide-in-from-top-2 duration-300">
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-xs font-black text-[#04364A] tracking-widest uppercase">
                  Schedule for <span className="text-[#176B87]">{selectedDay}</span>
                </h4>
                <button
                  type="button"
                  onClick={() => setShowTimeSlotModal(true)}
                  className="bg-[#04364A] text-white p-1.5 rounded-lg hover:bg-[#04364A]/80 transition-colors"
                >
                  <Plus size={16} />
                </button>
              </div>

              {availability[selectedDay]?.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {availability[selectedDay].map((slot) => (
                    <div
                      key={slot.id}
                      className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-full border border-gray-200 group"
                    >
                      <span className="text-[11px] font-bold text-[#04364A]">{slot.display}</span>
                      <button
                        type="button"
                        onClick={() => removeTimeSlot(selectedDay, slot.id)}
                        className="text-[#04364A] hover:text-red-500 transition-colors"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-[10px] text-[#04364A]/60 italic font-medium">No time slots added for this day yet.</p>
              )}
            </div>
          )}
        </div>
      )}

      <div className="flex justify-end pt-4 border-t-2 border-gray-100 gap-3">
        {editingServiceId && (
          <button
            type="button"
            onClick={cancelEdit}
            className="px-6 py-3 rounded-xl text-xs font-black transition-all hover:bg-gray-100 text-gray-400 uppercase tracking-widest"
          >
            Cancel
          </button>
        )}
        <button
          type="button"
          onClick={addService}
          className={`${editingServiceId ? 'bg-[#176B87] text-white border-none' : 'bg-white text-[#04364A] border-2 border-[#04364A]'} px-6 py-3 rounded-xl text-xs font-black transition-all hover:bg-[#04364A] hover:text-white flex items-center space-x-2 shadow-sm`}
        >
          {editingServiceId ? <Edit2 size={16} /> : <Plus size={16} />}
          <span>{editingServiceId ? 'Update Service' : 'Add Service'}</span>
        </button>
      </div>
      {errors.addServiceError && (
        <p className="text-[10px] text-red-500 font-bold text-center mt-2 animate-bounce">
          {errors.addServiceError}
        </p>
      )}

      {/* Added Services Display */}
      {activeServices.length > 0 && (
        <div className="space-y-3 max-w-4xl">
          <h3 className="text-sm font-black text-[#04364A] tracking-widest">Added Services</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {activeServices.map((service) => (
              <div
                key={service.id}
                className="relative bg-white rounded-lg border border-gray-100 shadow-sm transition-all overflow-hidden flex items-center h-14"
              >
                <div className="w-14 h-full bg-gray-50 flex-shrink-0">
                  <ServiceImage img={service.image || service.displayImage} name={service.name} />
                </div>
                <div className="px-2 flex-grow min-w-0 pr-12">
                  <div className="flex flex-col">
                    <h4 className="font-black text-[#04364A] text-[8px] uppercase tracking-tighter truncate">{service.name}</h4>
                    <div className="flex items-center gap-1.5 leading-none">
                      <div className="text-[9px] text-[#176B87] font-black">
                        ${service.price}
                        <span className="text-[7px] text-gray-400 font-bold ml-0.5">/{service.price_Type === 'Hourly' ? 'hr' : 'fix'}</span>
                      </div>
                      <div className="w-0.5 h-0.5 bg-gray-200 rounded-full"></div>
                      <div className="text-[7px] font-black text-[#64CCC5] uppercase tracking-tighter">
                        Com: {service.commission || '10%'}
                      </div>
                    </div>
                  </div>
                  <div className="absolute top-1/2 -translate-y-1/2 right-1.5 flex gap-1">
                    <button
                      type="button"
                      onClick={() => startEditService(service)}
                      className="p-1 bg-gray-50 text-[#176B87] rounded hover:bg-[#176B87] hover:text-white transition-all"
                    >
                      <Edit2 size={10} />
                    </button>
                    <button
                      type="button"
                      onClick={() => removeService(service.id)}
                      className="p-1 bg-gray-50 text-red-500 rounded hover:bg-red-500 hover:text-white transition-all"
                    >
                      <X size={10} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {errors.activeServices && <p className="text-sm text-red-500 font-bold text-center py-2 bg-red-50 rounded-xl border border-red-200">{errors.activeServices}</p>}

      {/* Sign Up Buttons */}
      <div className="flex flex-col sm:flex-row justify-end items-center gap-4 pt-4 border-t-2 border-gray-100">
        <button
          type="button"
          onClick={handleSkip}
          className="text-[#04364A] px-6 py-4 rounded-xl text-xs font-black transition-all hover:bg-gray-100 uppercase tracking-widest"
        >
          Skip for later
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={loading}
          className={`bg-[#04364A] hover:shadow-xl text-white px-10 py-4 rounded-xl text-xs font-black transition-all hover:scale-[1.02] duration-300 tracking-widest shadow-lg ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
        >
          {loading ? 'Processing...' : 'Complete Sign Up'}
        </button>
      </div>

      {/* Time Slot Modal */}
      {showTimeSlotModal && (
        <div className="fixed inset-0 bg-[#04364A]/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 w-full max-w-md mx-4 shadow-2xl border-2 border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-black text-[#04364A] tracking-wide">Add Slot for {selectedDay}</h3>
              <button
                type="button"
                onClick={() => setShowTimeSlotModal(false)}
                className="text-[#04364A] hover:text-red-500 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black text-[#04364A] tracking-widest mb-2 ml-1">From</label>
                  <input
                    type="time"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl outline-none transition-all focus:ring-2 focus:ring-[#04364A]/10 focus:border-[#04364A] font-bold"
                    value={currentTimeSlot.from}
                    onChange={(e) =>
                      setCurrentTimeSlot({ ...currentTimeSlot, from: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-[#04364A] tracking-widest mb-2 ml-1">To</label>
                  <input
                    type="time"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl outline-none transition-all focus:ring-2 focus:ring-[#04364A]/10 focus:border-[#04364A] font-bold"
                    value={currentTimeSlot.to}
                    onChange={(e) =>
                      setCurrentTimeSlot({ ...currentTimeSlot, to: e.target.value })
                    }
                  />
                </div>
              </div>

              {errors.timeSlot && (
                <p className="text-[11px] text-red-500 font-bold text-center py-2 bg-red-50 rounded-lg border border-red-200">
                  {errors.timeSlot}
                </p>
              )}

              <button
                type="button"
                onClick={addTimeSlot}
                disabled={!currentTimeSlot.from || !currentTimeSlot.to}
                className="w-full bg-[#04364A] text-white py-4 rounded-xl font-black text-sm hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add Time Slot
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StepServices;
