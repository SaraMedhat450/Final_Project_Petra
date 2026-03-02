import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { 
    Calendar, Clock, MapPin, CreditCard, CheckCircle, 
    ArrowLeft, ArrowRight, ShieldCheck, User, Mail, Phone,
    Tag, Gift, Loader2, Info
} from 'lucide-react';
import { API_ENDPOINTS, COMMON_HEADERS, UPLOAD_URL } from '@/config/api';

const STEPS = [
    { id: 1, label: 'Schedule Service' },
    { id: 2, label: 'Book Service' },
    { id: 3, label: 'Completed' }
];

const BookService = () => {
    const { id } = useParams(); // service ID
    const navigate = useNavigate();
    const { user, token } = useSelector(state => state.auth);
    
    const [service, setService] = useState(null);
    const [provider, setProvider] = useState(null);
    const [loading, setLoading] = useState(true);
    const [step, setStep] = useState(1);
    const [submitting, setSubmitting] = useState(false);

    // Form State - Step 1
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [address, setAddress] = useState(user?.address || '');
    const [notes, setNotes] = useState('');
    
    // User Contact (Pre-filled from logged-in user)
    const [contactName, setContactName] = useState(user?.name || '');
    const [contactPhone, setContactPhone] = useState(user?.phone || '');
    const [contactEmail, setContactEmail] = useState(user?.email || '');

    // Form State - Step 2 (Payment & Coupons)
    const [paymentMethod, setPaymentMethod] = useState('cash');
    const [couponCode, setCouponCode] = useState('');
    const [discount, setDiscount] = useState(0);
    const [redeemPoints, setRedeemPoints] = useState(false);
    const [pointsUsed, setPointsUsed] = useState(0);

    const [availability, setAvailability] = useState([]);
    const [scheduleError, setScheduleError] = useState('');

    useEffect(() => {
        fetchServiceDetails();
    }, [id]);

    const fetchServiceDetails = async () => {
        try {
            const headers = { ...COMMON_HEADERS };
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }
            
            // 1. Fetch enriched service details
            const serviceRes = await fetch(API_ENDPOINTS.SERVICE_DETAILS(id), {
                headers
            });
            
            if (!serviceRes.ok) throw new Error('Failed to fetch service');
            const data = await serviceRes.json();
            const servicesArray = Array.isArray(data) ? data : (data.services || [data]);
            const rawSvc = servicesArray.find(s => Number(s.id) === Number(id)) || servicesArray[0];
            
            if (!rawSvc) throw new Error('Service data missing');

            // Parse images
            let firstImage = null;
            try {
                let raw = rawSvc.images;
                if (raw) {
                    while (typeof raw === 'string' && (raw.startsWith('[') || raw.startsWith('{') || raw.startsWith('"'))) {
                        try {
                            const parsed = JSON.parse(raw);
                            if (parsed === raw) break;
                            raw = parsed;
                        } catch (e) { break; }
                    }
                    if (Array.isArray(raw)) firstImage = raw[0];
                    else if (typeof raw === 'string') firstImage = raw.replace(/["'[\]\\]/g, '').trim();
                }
            } catch (e) {}

            const svc = {
                ...rawSvc,
                parsedImage: firstImage,
                displayName: rawSvc.Service_title?.name || rawSvc.name || rawSvc.description || 'Professional Service',
                availabilities: rawSvc.Provider_availabilities || []
            };

            setService(svc);
            setAvailability(svc.availabilities);

            // 2. Fetch the provider profile
            if (svc.userid) {
                const providerRes = await fetch(API_ENDPOINTS.PROVIDER_DETAILS(svc.userid), {
                    headers: COMMON_HEADERS
                });
                if (providerRes.ok) {
                    const providerData = await providerRes.json();
                    setProvider(providerData.provider || providerData);
                } else if (svc.User) {
                    setProvider(svc.User);
                }
            }
        } catch (error) {
            console.error('Failed to load service:', error);
        } finally {
            setLoading(false);
        }
    };

    // Validation logic for schedule
    useEffect(() => {
        if (!date || !time || availability.length === 0) {
            setScheduleError('');
            return;
        }

        const selectedDate = new Date(date);
        const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const selectedDay = dayNames[selectedDate.getDay()];

        const daySchedule = availability.find(a => a.day_of_week === selectedDay);

        if (!daySchedule) {
            setScheduleError(`The provider is not available on ${selectedDay}s.`);
            return;
        }

        if (daySchedule.status !== 'available') {
            setScheduleError(`The provider is currently unavailable on ${selectedDay}s.`);
            return;
        }

        // Time comparison
        const selectedTimeVal = time.replace(':', '');
        const startVal = daySchedule.start_time.replace(':', '');
        const endVal = daySchedule.end_time.replace(':', '');

        if (selectedTimeVal < startVal || selectedTimeVal > endVal) {
            setScheduleError(`Invalid time. Available on ${selectedDay} from ${daySchedule.start_time} to ${daySchedule.end_time}.`);
        } else {
            setScheduleError('');
        }
    }, [date, time, availability]);

    const handleApplyCoupon = () => {
        if (couponCode.toUpperCase() === 'WELCOME20') {
            setDiscount(20);
            alert('Coupon applied: $20 Off!');
        } else {
            alert('Invalid coupon code');
            setDiscount(0);
        }
    };

    const togglePoints = () => {
        const userPts = user?.points || 0;
        const pointsValue = Math.floor(userPts / 100); // e.g. 100 points = $1
        if (!redeemPoints) {
            setPointsUsed(pointsValue);
        } else {
            setPointsUsed(0);
        }
        setRedeemPoints(!redeemPoints);
    };

    const calculateTotal = () => {
        if (!service) return 0;
        let total = service.price;
        total -= discount;
        total -= pointsUsed;
        return total > 0 ? total : 0;
    };

    const handleSubmit = async () => {
        setSubmitting(true);
        try {
            const bookingData = {
                service_id: Number(id),
                provider_id: service.userid,
                customer_id: user?.id,
                booking_date: date,
                booking_time: time + ':00',
                phone: contactPhone || '',
                address: address || '',
                location: address || '',
                total_amount: calculateTotal(),
                payment_status: 'pending',
                payment_method: paymentMethod,
                notes: notes || null,
            };

            const res = await fetch(API_ENDPOINTS.BOOKINGS, {
                method: 'POST',
                headers: {
                    ...COMMON_HEADERS,
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(bookingData)
            });

            if (res.ok) {
                setStep(3);
            } else {
                const errData = await res.json().catch(() => null);
                console.error('Booking failed:', errData);
                alert('Booking failed. Please try again.');
            }
        } catch (error) {
            console.error('Booking error:', error);
            alert('An error occurred. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center pt-20">
            <Loader2 className="animate-spin text-[#04364A]" size={40} />
        </div>
    );

    if (!service) return (
        <div className="min-h-screen flex items-center justify-center pt-20">
            <p>Service not found.</p>
        </div>
    );

    const userPoints = user?.points || 0;
    const pointsValue = Math.floor(userPoints / 100);

    const imageUrl = service.parsedImage ? (service.parsedImage.startsWith('http') ? service.parsedImage : `${UPLOAD_URL}/${service.parsedImage.replace(/["'[\]\\]/g, '')}`) : null;

    return (
        <div className="min-h-screen bg-gray-50/50 pt-24 pb-20 font-sans">
            <div className="max-w-5xl mx-auto px-6">
                
                {/* Progress Bar */}
                <div className="mb-12 relative px-10">
                    <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 -z-0 rounded-full"></div>
                    <div 
                        className="absolute top-1/2 left-0 h-1 bg-[#04364A] -z-0 rounded-full transition-all duration-500"
                        style={{ width: `${((step - 1) / (STEPS.length - 1)) * 100}%` }}
                    ></div>
                    
                    <div className="flex justify-between relative z-10">
                        {STEPS.map((s) => {
                            const isActive = step >= s.id;
                            const isCurrent = step === s.id;
                            return (
                                <div key={s.id} className="flex flex-col items-center gap-3">
                                    <div className={`w-4 h-4 rounded-full border-4 box-content transition-all duration-300 ${
                                        isActive ? 'bg-[#04364A] border-white shadow-lg' : 'bg-gray-200 border-white'
                                    }`}></div>
                                    <span className={`text-xs font-black uppercase tracking-widest ${
                                        isCurrent ? 'text-[#04364A]' : 'text-gray-400'
                                    }`}>{s.label}</span>
                                </div>
                            ); 
                        })}
                    </div>
                </div>

                {/* Step 3: Success Screen */}
                {step === 3 && (
                    <div className="bg-white p-12 rounded-[2.5rem] border border-gray-100 shadow-xl text-center max-w-2xl mx-auto animate-fadeIn">
                        <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6 text-green-500">
                            <CheckCircle size={40} strokeWidth={3} />
                        </div>
                        <h2 className="text-3xl font-black text-[#04364A] mb-4">Booking Confirmed!</h2>
                        <p className="text-gray-500 text-lg mb-8 max-w-md mx-auto">
                            Thank you, {contactName.split(' ')[0]}. Your booking for <span className="font-bold text-[#04364A]">{service.description || 'this service'}</span> has been successfully placed.
                        </p>
                        <div className="flex justify-center gap-4">
                            <button 
                                onClick={() => navigate('/')}
                                className="px-8 py-3 bg-gray-100 hover:bg-gray-200 text-[#04364A] rounded-xl font-black uppercase tracking-widest text-xs transition-all"
                            >
                                Back Home
                            </button>
                            <button 
                                onClick={() => navigate('/provider/bookings')}
                                className="px-8 py-3 bg-[#04364A] hover:bg-[#176B87] text-white rounded-xl font-black uppercase tracking-widest text-xs transition-all"
                            >
                                View Bookings
                            </button>
                        </div>
                    </div>
                )}

                {/* Main Content Form */}
                {step < 3 && (
                    <div className="grid grid-cols-1 gap-8 animate-fadeIn">
                        {/* Step Title */}
                        <div className="flex items-center gap-3 mb-2">
                             <div className="w-2 h-2 rounded-full bg-[#04364A]"></div>
                             <h2 className="text-lg font-black text-[#04364A] uppercase tracking-wide">
                                 Step {step}: {STEPS[step-1].label}
                             </h2>
                        </div>

                        {/* STEP 1: SCHEDULE & DETAILS */}
                        {step === 1 && (
                            <div className="bg-[#FAF9F6] p-8 md:p-10 rounded-[2.5rem] shadow-sm">
                                {/* Service Visual Preview */}
                                <div className="mb-12 flex flex-col md:flex-row gap-8 items-center bg-white/50 p-6 rounded-[2rem] border border-white">
                                    <div className="w-32 h-32 shrink-0 rounded-2xl overflow-hidden bg-gray-100 flex items-center justify-center border-4 border-white shadow-sm">
                                        {imageUrl ? (
                                            <img src={imageUrl} className="w-full h-full object-cover" alt={service.displayName} />
                                        ) : (
                                            <ShieldCheck size={40} className="text-gray-200" />
                                        )}
                                    </div>
                                    <div className="text-center md:text-left">
                                        <h3 className="text-2xl font-black text-[#04364A] mb-2">{service.displayName}</h3>
                                        <p className="text-gray-400 text-sm font-medium max-w-lg">
                                            {service.description || 'Secure your slot with our professional partner to get high-quality service delivered to your doorstep.'}
                                        </p>
                                    </div>
                                </div>

                                {/* Provider Details Section */}
                                <div className="mb-10">
                                    <h3 className="text-xl font-black text-[#04364A] mb-6">Provider Details</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="bg-white/50 p-4 rounded-2xl border border-gray-200/50">
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">Service</label>
                                             <p className="font-bold text-[#04364A]">{service.displayName}</p>
                                        </div>
                                        <div className="bg-white/50 p-4 rounded-2xl border border-gray-200/50">
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">Provider</label>
                                            <p className="font-bold text-[#04364A]">{provider?.name || 'Loading...'}</p>
                                        </div>
                                        <div className="bg-white/50 p-4 rounded-2xl border border-gray-200/50">
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">Rate Type</label>
                                            <div className="flex justify-between items-center">
                                                <p className="font-bold text-[#04364A] capitalize">{service.price_Type}</p>
                                                <span className="text-xs font-bold text-[#64CCC5] bg-[#E0F7FA] px-2 py-1 rounded-md">
                                                    ${service.price}/{service.price_Type === 'Hourly' ? 'hr' : 'job'}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="bg-white/50 p-4 rounded-2xl border border-gray-200/50">
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">Phone</label>
                                            <p className="font-bold text-[#04364A]">{provider?.phone || 'N/A'}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Booking Details Section */}
                                <div>
                                    <h3 className="text-xl font-black text-[#04364A] mb-6">Booking Details</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                        <div>
                                            <label className="text-xs font-black text-gray-500 uppercase tracking-widest block mb-2">My Name</label>
                                            <input 
                                                type="text" 
                                                value={contactName}
                                                onChange={(e) => setContactName(e.target.value)}
                                                className="w-full p-4 bg-white rounded-xl border border-gray-200 focus:border-[#04364A] outline-none font-bold text-[#04364A]"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs font-black text-gray-500 uppercase tracking-widest block mb-2">Phone Number</label>
                                            <input 
                                                type="tel" 
                                                value={contactPhone}
                                                onChange={(e) => setContactPhone(e.target.value)}
                                                className="w-full p-4 bg-white rounded-xl border border-gray-200 focus:border-[#04364A] outline-none font-bold text-[#04364A]"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs font-black text-gray-500 uppercase tracking-widest block mb-2">Address</label>
                                            <input 
                                                type="text" 
                                                value={address}
                                                onChange={(e) => setAddress(e.target.value)}
                                                placeholder="Street, City, Zip"
                                                className="w-full p-4 bg-white rounded-xl border border-gray-200 focus:border-[#04364A] outline-none font-bold text-[#04364A]"
                                            />
                                        </div>
                                        <div>
                                             <label className="text-xs font-black text-gray-500 uppercase tracking-widest block mb-2">Date & Time</label>
                                             <div className="flex gap-2">
                                                 <input 
                                                     type="date" 
                                                     value={date}
                                                     onChange={(e) => setDate(e.target.value)}
                                                     min={new Date().toISOString().split('T')[0]}
                                                     className={`w-2/3 p-4 bg-white rounded-xl border outline-none font-bold text-[#04364A] text-sm transition-all ${
                                                         scheduleError ? 'border-red-200 focus:border-red-400' : 'border-gray-200 focus:border-[#04364A]'
                                                     }`}
                                                 />
                                                 <input 
                                                     type="time" 
                                                     value={time}
                                                     onChange={(e) => setTime(e.target.value)}
                                                     className={`w-1/3 p-4 bg-white rounded-xl border outline-none font-bold text-[#04364A] text-sm transition-all ${
                                                         scheduleError ? 'border-red-200 focus:border-red-400' : 'border-gray-200 focus:border-[#04364A]'
                                                     }`}
                                                 />
                                             </div>
                                             
                                             {scheduleError && (
                                                 <div className="mt-3 flex items-center gap-2 text-red-500 animate-fadeIn">
                                                     <Info size={14} />
                                                     <p className="text-[10px] font-black uppercase tracking-wider">{scheduleError}</p>
                                                 </div>
                                             )}

                                             {/* Mini Schedule Guide */}
                                             {!scheduleError && availability.length > 0 && (
                                                 <div className="mt-3 p-4 bg-white/50 rounded-xl border border-gray-100">
                                                     <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2">Schedule Overview</p>
                                                     <div className="flex flex-wrap gap-2">
                                                         {availability.map((s, i) => (
                                                             <div key={i} className="px-2 py-1 bg-[#64CCC5]/10 rounded-md flex items-center gap-1.5 border border-[#64CCC5]/10">
                                                                 <span className="text-[8px] font-black text-[#176B87] uppercase">{s.day_of_week.substring(0,3)}:</span>
                                                                 <span className="text-[8px] font-bold text-[#04364A]">{s.start_time}-{s.end_time}</span>
                                                             </div>
                                                         ))}
                                                     </div>
                                                 </div>
                                             )}
                                         </div>
                                     </div>
                                     <div className="mb-8">
                                         <label className="text-xs font-black text-gray-500 uppercase tracking-widest block mb-2">Notes (Optional)</label>
                                         <textarea 
                                             value={notes}
                                             onChange={(e) => setNotes(e.target.value)}
                                             placeholder="Give notes..."
                                             className="w-full p-4 bg-white rounded-xl border border-gray-200 focus:border-[#04364A] outline-none font-medium text-[#04364A] min-h-[120px] resize-none"
                                         ></textarea>
                                     </div>
 
                                     <div className="flex justify-end">
                                         <button 
                                             onClick={() => setStep(2)}
                                             disabled={!date || !time || !address || !contactName || !contactPhone || scheduleError}
                                             className="px-10 py-4 bg-[#04364A] hover:bg-[#176B87] text-white rounded-xl font-black uppercase tracking-widest text-xs flex items-center gap-2 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                                         >
                                             Continue <ArrowRight size={16} />
                                         </button>
                                     </div>
                                </div>
                            </div>
                        )}

                        {/* STEP 2: PAYMENT & CONFIRMATION */}
                        {step === 2 && (
                            <div className="bg-[#FAF9F6] p-8 md:p-10 rounded-[2.5rem] shadow-sm">
                                <h3 className="text-xl font-black text-[#04364A] mb-8">Review & Confirm</h3>
                                
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
                                    {/* Left: Input Fields */}
                                    <div className="lg:col-span-2 space-y-6">
                                         {/* Rate details */}
                                         <div className="mb-4">
                                             <h4 className="text-sm font-black text-[#04364A] uppercase tracking-widest">{service.displayName}</h4>
                                         </div>
                                         <div className="bg-white p-6 rounded-2xl border border-gray-100 flex items-center justify-between">
                                             <div>
                                                 <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Rate Type</p>
                                                 <div className="flex items-center gap-2">
                                                     <span className="px-3 py-1 bg-gray-100 rounded-md text-xs font-bold text-gray-600 uppercase">{service.price_Type}</span>
                                                 </div>
                                             </div>
                                             <div>
                                                 <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Price</p>
                                                 <p className="font-bold text-[#04364A] text-lg">
                                                     ${service.price}{service.max_price > service.price ? ` - $${service.max_price}` : ''}
                                                 </p>
                                             </div>
                                             <div>
                                                 <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Your Points</p>
                                                 <div className="flex items-center gap-1.5 text-yellow-500 font-bold">
                                                    <CreditCard size={14} /> {userPoints}
                                                </div>
                                             </div>
                                         </div>

                                         {/* Points Redemption */}
                                         {userPoints > 0 && (
                                             <div className="bg-white p-6 rounded-2xl border border-gray-100 flex items-center justify-between">
                                                  <div>
                                                     <h4 className="font-bold text-[#04364A] text-sm">Redeem {userPoints} Points?</h4>
                                                     <p className="text-xs text-gray-400 mt-1">Value: ${pointsValue} discount on this booking.</p>
                                                  </div>
                                                  <div 
                                                     onClick={togglePoints}
                                                     className={`w-14 h-8 rounded-full flex items-center p-1 cursor-pointer transition-colors ${redeemPoints ? 'bg-[#04364A]' : 'bg-gray-200'}`}
                                                  >
                                                     <div className={`w-6 h-6 rounded-full bg-white shadow-sm transform transition-transform ${redeemPoints ? 'translate-x-6' : 'translate-x-0'}`}></div>
                                                  </div>
                                             </div>
                                         )}

                                         {/* Coupon Code */}
                                         <div className="grid grid-cols-2 gap-6">
                                             <div>
                                                 <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">Coupon Code</label>
                                                 <div className="flex gap-2">
                                                     <input 
                                                         type="text" 
                                                         value={couponCode}
                                                         onChange={(e) => setCouponCode(e.target.value)}
                                                         placeholder="Enter Code"
                                                         className="w-full p-3 bg-white rounded-xl border border-gray-200 font-bold text-[#04364A] text-sm uppercase"
                                                     />
                                                     <button 
                                                         onClick={handleApplyCoupon}
                                                         className="px-4 bg-[#04364A] text-white rounded-xl font-bold text-xs hover:bg-[#176B87]"
                                                     >Apply</button>
                                                 </div>
                                             </div>
                                             <div>
                                                 <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">Payment Method</label>
                                                 <select 
                                                     value={paymentMethod}
                                                     onChange={(e) => setPaymentMethod(e.target.value)}
                                                     className="w-full p-3 bg-white rounded-xl border border-gray-200 font-bold text-[#04364A] text-sm"
                                                 >
                                                     <option value="cash">Cash After Service</option>
                                                     <option value="online" disabled>Online (Coming Soon)</option>
                                                 </select>
                                             </div>
                                         </div>
                                     </div>

                                     {/* Right: Payment Summary */}
                                     <div className="lg:col-span-1">
                                         <div className="bg-white p-6 rounded-2xl border border-gray-100 h-full flex flex-col">
                                             <h4 className="font-black text-[#04364A] mb-6 border-b border-gray-100 pb-4">Payment Summary</h4>
                                             
                                             <div className="space-y-4 text-sm flex-1">
                                                 <div className="flex justify-between font-medium text-gray-500">
                                                     <span>Price</span>
                                                     <span>${service.price}</span>
                                                 </div>
                                                 {discount > 0 && (
                                                     <div className="flex justify-between font-bold text-green-600">
                                                         <span>Discount (Coupon)</span>
                                                         <span>-${discount}</span>
                                                     </div>
                                                 )}
                                                 {redeemPoints && (
                                                      <div className="flex justify-between font-bold text-yellow-600">
                                                         <span>Points Redeemed</span>
                                                         <span>-${pointsUsed}</span>
                                                     </div>
                                                 )}
                                                 <div className="flex justify-between font-medium text-gray-500">
                                                     <span>Net Amount</span>
                                                     <span>${calculateTotal()}</span>
                                                 </div>
                                             </div>

                                             <div className="border-t border-gray-100 pt-4 mt-6">
                                                 <div className="flex justify-between items-end">
                                                     <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Grand Total</span>
                                                     <span className="text-2xl font-black text-[#04364A]">${calculateTotal()}</span>
                                                 </div>
                                             </div>
                                         </div>
                                     </div>
                                 </div>

                                 {/* Action Buttons */}
                                 <div className="flex justify-end gap-4">
                                     <button 
                                         onClick={() => setStep(1)}
                                         className="px-8 py-4 bg-white border border-gray-200 text-[#04364A] rounded-xl font-black uppercase tracking-widest text-xs hover:bg-gray-50"
                                     >
                                         Cancel
                                     </button>
                                     <button 
                                         onClick={handleSubmit}
                                         disabled={submitting}
                                         className="px-10 py-4 bg-[#04364A] hover:bg-[#176B87] text-white rounded-xl font-black uppercase tracking-widest text-xs flex items-center gap-2 shadow-lg hover:shadow-xl transition-all"
                                     >
                                         {submitting ? <Loader2 className="animate-spin" /> : 'Book Now'}
                                     </button>
                                 </div>
                             </div>
                         )}
                     </div>
                 )}
             </div>
         </div>
    );
};

export default BookService;
