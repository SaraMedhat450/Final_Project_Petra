import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { serviceService, categoryService } from '../../services';
import toast from 'react-hot-toast';
import TimePicker from "react-time-picker";
import "react-time-picker/dist/TimePicker.css";
import "react-clock/dist/Clock.css";


export default function AddNewService() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  const [ServiceImage, setServiceImage] = useState("Browser");

  const [available, setAvailable] = useState(true);
  const [addedServices, setAddedServices] = useState([]);

  const [serviceName, setServiceName] = useState("");
  const [commission, setCommission] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [pricingType, setPricingType] = useState("");
  const [state, setState] = useState("");
  const [description, setDescription] = useState("");

  const [selectedDay, setSelectedDay] = useState("Sunday");

  const [startTime, setStartTime] = useState("10:00");
  const [endTime, setEndTime] = useState("18:00");
  const [scheduleSlots, setScheduleSlots] = useState([]);

  const [serviceGallery, setServiceGallery] = useState([]);
  const [serviceImageFile, setServiceImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [allSubCategories, setAllSubCategories] = useState([]);
  const [allServiceTitles, setAllServiceTitles] = useState([]);
  const [mappings, setMappings] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, subCatRes, titleRes, mappingsRes] = await Promise.all([
          categoryService.getAllCategories(),
          categoryService.getSubCategories(),
          categoryService.getServiceTitles(),
          serviceService.getAllServices()
        ]);

        setCategories(Array.isArray(catRes.data) ? catRes.data : Array.isArray(catRes) ? catRes : []);
        setAllSubCategories(Array.isArray(subCatRes.data) ? subCatRes.data : Array.isArray(subCatRes) ? subCatRes : []);
        setAllServiceTitles(Array.isArray(titleRes.data) ? titleRes.data : Array.isArray(titleRes) ? titleRes : []);
        setMappings(Array.isArray(mappingsRes.data) ? mappingsRes.data : Array.isArray(mappingsRes) ? mappingsRes : []);
      } catch (error) {
        console.error("Failed to fetch initial data:", error);
        if (error.response?.status === 401) {
          toast.error("Session expired. Redirecting to login...");
        } else {
          toast.error("Failed to load initial data. Please refresh the page.");
        }
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (isEdit) {
      const fetchServiceDetails = async () => {
        try {
          const res = await serviceService.getAllServices();
          const service = res.data?.find(s => s.id === parseInt(id)) || res?.find(s => s.id === parseInt(id));
          
          if (service) {
            setCategory(service.categoryId);
            setSubCategory(service.subcategoryId);
            setServiceName(service.service_title_id);
            setPricingType(service.price_Type);
            setPrice(service.price);
            setCommission(service.commission_fee);
            setDescription(service.description);
            setState(service.state || "active");
            // For now, let's keep the image as it is or handle if it's external
            if (service.images && service.images.length > 0) {
              setServiceImage(service.images[0]);
            }
          }
        } catch (error) {
          console.error("Failed to fetch service details:", error);
          toast.error("Could not load service details for editing");
        }
      };
      fetchServiceDetails();
    }
  }, [id, isEdit]);

  const filteredSubCategories = allSubCategories.filter(sub => 
    !category || sub.categoryId === parseInt(category)
  );

  const filteredServiceTitles = allServiceTitles.filter(title => {
    if (!subCategory) return false;
    return mappings.some(m => m.subcategoryId === parseInt(subCategory) && m.service_title_id === title.id);
  });

  const handleCategoryChange = (val) => {
    setCategory(val);
    setSubCategory("");
    setServiceName("");
  };

  const handleSubCategoryChange = (val) => {
    setSubCategory(val);
    setServiceName("");
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const userData = JSON.parse(localStorage.getItem("userData") || "{}");
      const currentUserId = userData.id || 3; 

      // Flat payload structure based on the very first prompt's backend data
      const createFormData = (day, start, end) => {
        const formData = new FormData();
        // Mandatory fields based on your API list
        formData.append('categoryId', parseInt(category));
        formData.append('subcategoryId', parseInt(subCategory));
        formData.append('service_title_id', parseInt(serviceName));
        formData.append('price', parseFloat(price));
        formData.append('max_price', parseFloat(price) + 50); 
        formData.append('day_of_week', day === "Always" ? "Saturday" : day); 
        formData.append('start_time', start); 
        formData.append('end_time', end);
        formData.append('availability_status', "available");

        // Optional/Context fields
        formData.append('userid', currentUserId);
        formData.append('price_Type', pricingType || "Hourly");
        formData.append('description', description || "");
        formData.append('commission_fee', parseFloat(commission) || 0);
        formData.append('state', state || "active");

        if (serviceImageFile) {
          formData.append('images', serviceImageFile);
        } else if (serviceGallery.length > 0) {
          formData.append('images', serviceGallery[0]);
        }
        
        return formData;
      };

      let formData;

      if (available) {
        formData = createFormData("Always", "00:00", "23:59");
      } else {
        if (scheduleSlots.length === 0) {
          toast.error("Please add at least one schedule slot or select 'Always Available'");
          setLoading(false);
          return;
        }
        const firstDayGroup = scheduleSlots[0];
        const firstSlot = firstDayGroup.slots[0];
        formData = createFormData(firstDayGroup.day, firstSlot.start, firstSlot.end);
      }

      console.log(`Sending service entry...`);

      if (isEdit) {
        try {
          await serviceService.updateService(id, formData);
          toast.success("Service updated successfully!");
          setTimeout(() => navigate("/provider/serviceList"), 1500);
          return;
        } catch (err) {
          console.error("Failed to update service:", err);
          toast.error("Failed to update service");
          setLoading(false);
          return;
        }
      }

      try {
        await serviceService.createService(formData);
        toast.success(`Service added successfully!`);
      } catch (err) {
        if (err.response?.status === 401) {
           toast.error("Session expired or unauthorized. Please try logging in again.");
        } else {
           console.error(`Failed to add service:`, err.response?.data || err.message);
           const errorMsg = err.response?.data?.message || 'Server error. Please check your data.';
           toast.error(errorMsg);
        }
        throw err;
      }
      
      setTimeout(() => {
        navigate("/provider/serviceList");
      }, 1500);
      
    } catch (error) {
      console.error("Error saving service:", error);
      if (error.response?.status !== 401) {
        const errorMsg = error.response?.data?.message || 'Server error (500). Please check your data or contact support.';
        toast.error(errorMsg);
      }
    } finally {
      setLoading(false);
    }
  };


  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  const handleAddSchedule = () => {
    const formatTime = (timeStr) => {
      if (!timeStr) return "";
      const [hours, minutes] = timeStr.split(':');
      let h = parseInt(hours);
      const ampm = h >= 12 ? 'PM' : 'AM';
      h = h % 12 || 12;
      return `${h}:${minutes} ${ampm}`;
    };

    const displayTime = `${formatTime(startTime)} - ${formatTime(endTime)}`;
    const newSlot = {
      display: displayTime,
      start: startTime, // already in HH:mm
      end: endTime      // already in HH:mm
    };

    let updatedSlots = [...scheduleSlots];
    const existingSlotIndex = updatedSlots.findIndex(s => s.day === selectedDay);

    if (existingSlotIndex > -1) {
      if (!updatedSlots[existingSlotIndex].slots.some(s => s.display === displayTime)) {
        updatedSlots[existingSlotIndex] = {
          ...updatedSlots[existingSlotIndex],
          slots: [...updatedSlots[existingSlotIndex].slots, newSlot]
        };
      }
    } else {
      updatedSlots.push({ day: selectedDay, slots: [newSlot] });
    }
    
    updatedSlots.sort((a, b) => days.indexOf(a.day) - days.indexOf(b.day));
    setScheduleSlots(updatedSlots);

    const newCards = updatedSlots.map(slot => ({
      day: slot.day,
      name: serviceName || "Select Service",
      price: price ? `${price} Le` : "0 Le",
      commission: commission ? `${commission}%` : "0%",
      timings: slot.slots.map(s => s.display).join(', '),
      slots: slot.slots, // keep raw data
      category: category,
      subCategory: subCategory
    }));

    setAddedServices(newCards);
  };

  return (

    <>
    <div className="bg-[#f8f9fa] min-h-screen p-4">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6">
        <div className="bg-white px-6 py-2 rounded-lg shadow-sm border border-gray-100">
          <h1 className="text-lg font-bold text-sky-900">
            {isEdit ? 'Edit Service' : 'Requests New Service'}
          </h1>
        </div>
        {!isEdit && (
          <div className="bg-yellow-100 text-yellow-700 px-6 py-1.5 rounded-lg shadow-sm border border-[#fef3c7]">
            <span className="text-sm font-bold">PENDING</span>
          </div>
        )}
      </div>

      <div className="bg-white rounded-[1.5rem] shadow-sm p-8 border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-5 mb-8">
          {/* Row 1 */}
          <div>
            <label className="block mb-2 text-xs font-bold text-gray-600">
              Select Category <span className="text-red-500">*</span>
            </label>
            <select
              value={category}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className="block w-full px-4 py-2.5 bg-white border border-gray-200 text-gray-900 text-xs rounded-xl focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 shadow-sm appearance-none transition-all"
              style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236b7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='m19 9-7 7-7-7'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.75rem center', backgroundSize: '1rem' }}
            >
              <option value="">Select Category</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.category_name || cat.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-2 text-xs font-bold text-gray-600">
              Select Sub-Category <span className="text-red-500">*</span>
            </label>
            <select
              value={subCategory}
              onChange={(e) => handleSubCategoryChange(e.target.value)}
              className="block w-full px-4 py-2.5 bg-white border border-gray-200 text-gray-900 text-xs rounded-xl focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 shadow-sm appearance-none transition-all"
              style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236b7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='m19 9-7 7-7-7'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.75rem center', backgroundSize: '1rem' }}
            >
              <option value="">Select Sub-Category</option>
              {filteredSubCategories.map(sub => (
                <option key={sub.id} value={sub.id}>{sub.subcategory_name || sub.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-2 text-xs font-bold text-gray-600">
              Service <span className="text-red-500">*</span>
            </label>
            <select
              value={serviceName}
              onChange={(e) => setServiceName(e.target.value)}
              className="block w-full px-4 py-2.5 bg-white border border-gray-200 text-gray-900 text-xs rounded-xl focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 shadow-sm appearance-none transition-all"
              style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236b7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='m19 9-7 7-7-7'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.75rem center', backgroundSize: '1rem' }}
            >
              <option value="">Select Service</option>
              {filteredServiceTitles.map(title => (
                <option key={title.id} value={title.id}>{title.service_title || title.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-2 text-xs font-bold text-gray-600">
              Commission value
            </label>
            <input
              type="text"
              value={commission}
              disabled={true}
              className="block w-full px-4 py-2.5 bg-gray-100 border border-gray-200 text-gray-500 text-xs rounded-xl focus:ring-0 shadow-sm transition-all"
              placeholder="0"
            />
          </div>

          <div>
            <label className="block mb-2 text-xs font-bold text-gray-600">
              Pricing Type <span className="text-red-500">*</span>
            </label>
            <select
              value={pricingType}
              onChange={(e) => setPricingType(e.target.value)}
              className="block w-full px-4 py-2.5 bg-white border border-gray-200 text-gray-900 text-xs rounded-xl focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 shadow-sm appearance-none transition-all"
              style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236b7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='m19 9-7 7-7-7'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.75rem center', backgroundSize: '1rem' }}
            >
              <option value="">Pricing Type</option>
              <option value="Hourly">Hourly</option>
              <option value="Fixed">Fixed</option>
              <option value="Free">Free</option>
            </select>
          </div>

          <div>
            <label className="block mb-2 text-xs font-bold text-gray-600">
              Price <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="block w-full px-4 py-2.5 bg-white border border-gray-200 text-gray-900 text-xs rounded-xl focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 shadow-sm transition-all"
              placeholder="0"
            />
          </div>

          <div>
            <label className="block mb-2 text-xs font-bold text-gray-600">
              State <span className="text-red-500">*</span>
            </label>
            <select
              value={state}
              onChange={(e) => setState(e.target.value)}
              className="block w-full px-4 py-2.5 bg-white border border-gray-200 text-gray-900 text-xs rounded-xl focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 shadow-sm appearance-none transition-all"
              style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236b7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='m19 9-7 7-7-7'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.75rem center', backgroundSize: '1rem' }}
            >
              <option value="">State</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block mb-2 text-xs font-bold text-gray-600">
              Service Image <span className="text-red-500">*</span>
            </label>
            <div className="relative flex items-center">
              <div className="w-full px-4 py-2.5 bg-white border border-gray-200 text-gray-400 text-xs rounded-xl shadow-sm truncate pr-28 transition-all">
                {serviceImageFile ? serviceImageFile.name : ServiceImage}
              </div>
              <input
                type="file"
                id="image-upload"
                className="hidden"
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files?.[0]) {
                    setServiceImageFile(e.target.files[0]);
                  }
                }}
              />
              <label
                htmlFor="image-upload"
                className="absolute right-0 top-0 bottom-0 px-6 flex items-center bg-sky-900 text-white rounded-xl cursor-pointer hover:bg-sky-800 transition-all font-bold text-xs"
              >
                <i className="fa-solid fa-cloud-arrow-up mr-2 text-xs"></i>
                Upload
              </label>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 mb-8">
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={available}
              onChange={() => setAvailable(!available)}
            />
            <div className="w-10 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[6px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-green-700"></div>
          </label>
          <span className="text-xs font-bold text-gray-700">Always Available</span>
          <span className="text-[10px] text-green-700 font-medium">(Sets schedule to 24/7 for all days)</span>
        </div>

        {!available && (
          <div className="space-y-6">
            <div className="flex flex-wrap gap-2">
              {days.map((day) => {
                const hasSlots = scheduleSlots.some(s => s.day === day);
                const isSelected = selectedDay === day;
                return (
                  <button
                    key={day}
                    onClick={() => setSelectedDay(day)}
                    className={`relative px-6 py-2 rounded-full text-xs font-bold transition-all border ${
                      isSelected 
                        ? 'bg-[#074665] text-white border-[#074665]' 
                        : 'bg-white text-gray-500 border-gray-100 hover:border-gray-300'
                    }`}
                  >
                    {day}
                    {hasSlots && (
                      <span className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full border-2 border-white"></span>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-200 flex flex-wrap items-end gap-6 shadow-sm">
              <div className="flex gap-6">
                <div>
                  <label className="block text-[10px] text-gray-400 font-bold uppercase mb-1.5 ml-1">From</label>
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="bg-white border border-gray-200 rounded-xl px-4 py-2 text-xs font-bold text-gray-800 shadow-sm focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 min-w-[120px] transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-gray-400 font-bold uppercase mb-1.5 ml-1">To</label>
                  <input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="bg-white border border-gray-200 rounded-xl px-4 py-2 text-xs font-bold text-gray-800 shadow-sm focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 min-w-[120px] transition-all"
                  />
                </div>
              </div>
              <button
                onClick={handleAddSchedule}
                className="bg-sky-900 text-white px-8 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 hover:bg-sky-800 transition-all shadow-md active:scale-95"
              >
                <i className="fa-solid fa-plus text-xs"></i>
                Add Slot
              </button>
            </div>

            {addedServices.length > 0 && (
              <div className="mt-10">
                <div className="flex items-center gap-2 mb-5">
                   <div className="w-1 h-1 bg-sky-900 rounded-full"></div>
                   <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Full Weekly Schedule</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                  {addedServices.map((service, index) => (
                    <div key={index} className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-[10px] font-black text-sky-900 uppercase tracking-wider">{service.day}</span>
                        <span className="bg-sky-900 text-white text-[9px] font-bold px-2.5 py-1 rounded-full">
                          {service.slots.length} Slots
                        </span>
                      </div>
                      <div className="space-y-2.5">
                        {service.slots.map((slot, sIdx) => (
                          <div key={sIdx} className="flex justify-between items-center bg-gray-50 border border-gray-100 rounded-lg px-3 py-2">
                            <span className="text-[10px] font-bold text-gray-700">{slot.display}</span>
                            <button className="text-gray-300 hover:text-red-500 transition-colors">
                              <i className="fa-solid fa-circle-xmark text-xs"></i>
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        <div className="mt-10 md:grid-cols-2 gap-8">
          <div className='my-10'>
            <label className="block mb-2 text-xs font-bold text-gray-600">
              Service Gallery
            </label>
            <div className="relative flex items-center">
              <div className="w-full px-4 py-2.5 bg-white border border-gray-200 text-gray-400 text-xs rounded-xl shadow-sm truncate pr-28 transition-all">
                {serviceGallery.length > 0 ? `${serviceGallery.length} images selected` : "Browser"}
              </div>
              <input
                type="file"
                id="gallery-upload"
                multiple
                className="hidden"
                onChange={(e) => setServiceGallery([...e.target.files])}
              />
              <label
                htmlFor="gallery-upload"
                className="absolute right-0 top-0 bottom-0 px-6 flex items-center bg-sky-900 text-white rounded-xl cursor-pointer hover:bg-sky-800 transition-all font-bold text-xs"
              >
                <i className="fa-solid fa-images mr-2 text-xs"></i>
                Upload
              </label>
            </div>
          </div>
          
          <div className="md:row-span-2">
            <label className="block mb-2 text-xs font-bold text-gray-600">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="4"
              className="block w-full px-5 py-4 bg-white border border-gray-200 text-gray-900 text-xs rounded-2xl focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 shadow-sm resize-none transition-all"
              placeholder="Explain your service in detail..."
            ></textarea>
          </div>
        </div>

        <div className="flex justify-end mt-10">
          <button
            onClick={handleSave}
            disabled={loading || !category || !subCategory || !serviceName || !pricingType || !price || !description}
            className="bg-sky-900 text-white px-10 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-sky-800 transition-all disabled:opacity-50 shadow-lg shadow-sky-900/10 active:scale-95"
          >
            {loading ? (
              <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
            ) : (
              <i className="fa-solid fa-floppy-disk text-sm"></i>
            )}
            <span className="text-sm">{loading ? 'Saving...' : 'Save Service'}</span>
          </button>
        </div>
      </div>
    </div>
  </>
  );
}
