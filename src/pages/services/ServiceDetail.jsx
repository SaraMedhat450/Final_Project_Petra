import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Star, ShieldCheck, MapPin, Clock, ArrowLeft, 
    ArrowUpRight, CheckCircle2, Info, Share2, Heart,
    ChevronRight, Award, MessageSquare, User, Calendar
} from 'lucide-react';
import { API_ENDPOINTS, COMMON_HEADERS, UPLOAD_URL } from '@/config/api';

const ServiceDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const auth = useSelector(state => state.auth);
    
    const [service, setService] = useState(null);
    const [provider, setProvider] = useState(null);
    const [loading, setLoading] = useState(true);
    const [imageSrc, setImageSrc] = useState(null);
    const [gallery, setGallery] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchData();
        window.scrollTo(0, 0);
    }, [id]);

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            const headers = { ...COMMON_HEADERS };
            if (auth?.token) {
                headers['Authorization'] = `Bearer ${auth.token}`;
            }

            // 1. Primary Attempt: Fetch using the dedicated detail endpoint
            let foundService = null;
            try {
                const response = await fetch(API_ENDPOINTS.SERVICE_DETAILS(id), { headers });
                if (response.ok) {
                    const data = await response.json();
                    const servicesArray = Array.isArray(data) ? data : [data];
                    foundService = servicesArray.find(s => Number(s.id) === Number(id));
                }
            } catch (e) {
                console.warn("Primary fetch failed, will try fallback", e);
            }

            // 2. Fallback Attempt
            if (!foundService) {
                const fallbackResponse = await fetch(API_ENDPOINTS.SERVICE_ALL_DETAILS, { headers });
                if (fallbackResponse.ok) {
                    const data = await fallbackResponse.json();
                    const allServices = data.services || (Array.isArray(data) ? data : []);
                    foundService = allServices.find(s => Number(s.id) === Number(id));
                }
            }

            if (!foundService) {
                throw new Error('Service not found');
            }

            const rawSvc = foundService;

            // Map Service & Parse Images
            let firstImg = null;
            try {
                let raw = rawSvc.images;
                while (typeof raw === 'string' && (raw.startsWith('[') || raw.startsWith('{') || raw.startsWith('"') || raw.startsWith("'"))) {
                    try {
                        const cleaned = raw.replace(/^["']+|["']+$/g, '');
                        if (cleaned.startsWith('[') || cleaned.startsWith('{')) {
                            raw = JSON.parse(cleaned);
                        } else {
                            raw = cleaned;
                            break;
                        }
                    } catch (e) { break; }
                }
                
                if (Array.isArray(raw)) firstImg = raw[0];
                else if (typeof raw === 'string') firstImg = raw;
            } catch (e) {}
            
            setService({
                ...rawSvc,
                displayImage: firstImg || rawSvc.images,
                displayName: rawSvc.Service_title?.name || rawSvc.description || 'Professional Service',
                categoryName: rawSvc.Category?.name || 'Category',
                availabilities: rawSvc.Provider_availabilities || []
            });

            // Provider details 
            if (rawSvc.User) {
                setProvider({
                    ...rawSvc.User,
                    id: rawSvc.userid
                });
            } else if (rawSvc.userid) {
                setProvider({ id: rawSvc.userid, name: "Service Provider" });
            }

            // Gallery logic
            const gRes = await fetch(API_ENDPOINTS.SERVICE_GALLERY, { headers });
            if (gRes.ok) {
                const gData = await gRes.json();
                const images = gData.images || [];
                const serviceGallery = images.filter(img => Number(img.service_id) === Number(id));
                setGallery(serviceGallery);
            }
        } catch (err) {
            console.error("Fetch Error:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50/50 pt-20">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-[#04364A] border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-[#04364A] font-black uppercase tracking-widest text-[10px]">Loading Details...</p>
                </div>
            </div>
        );
    }

    if (error || !service) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50/50 pt-20 px-6 text-center">
                <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-6">
                    <Info size={40} />
                </div>
                <h2 className="text-3xl font-black text-[#04364A] mb-2 uppercase tracking-tight">Service Not Found</h2>
                <p className="text-gray-400 font-medium mb-8 max-w-md">We couldn't find the service you're looking for.</p>
                <Link to="/services" className="px-8 py-4 bg-[#04364A] text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-[#176B87] transition-all">
                    Back to Services
                </Link>
            </div>
        );
    }

    return (
        <div className="bg-gray-50/50 min-h-screen pb-24">
            <div className="pt-28 pb-10 px-6 max-w-7xl mx-auto flex items-center justify-between">
                <button 
                    onClick={() => navigate(-1)}
                    className="group flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-[#04364A] transition-all"
                >
                    <div className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center group-hover:bg-[#04364A] group-hover:text-white transition-all">
                        <ArrowLeft size={14} />
                    </div>
                    Back
                </button>
            </div>

            <main className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12">
                <div className="lg:col-span-8 space-y-12">
                    <div className="relative aspect-[16/9] w-full rounded-[3rem] overflow-hidden bg-white shadow-2xl shadow-[#04364A]/5 border border-white">
                        <img 
                            src={service.displayImage && !service.displayImage.startsWith('http') ? `${UPLOAD_URL}/${service.displayImage.replace(/["'[\]\\]/g, '')}` : service.displayImage} 
                            alt={service.displayName} 
                            className="w-full h-full object-cover"
                            onError={(e) => e.target.src = '/placeholder.jpg'} 
                        />
                        <div className="absolute top-8 left-8 bg-white/90 backdrop-blur-md px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest text-[#04364A] shadow-sm">
                            {service.categoryName || 'Category'}
                        </div>
                    </div>

                    <div className="bg-white rounded-[3rem] p-12 border border-white shadow-xl shadow-[#04364A]/5">
                        <div className="flex flex-wrap items-center gap-4 mb-6">
                            <div className="flex items-center gap-1 bg-yellow-50 px-3 py-1.5 rounded-full border border-yellow-100">
                                <Star size={14} fill="#F59E0B" className="text-[#F59E0B]" />
                                <span className="text-sm font-black text-[#F59E0B]">{service.rating || '0.0'}</span>
                            </div>
                        </div>

                        <h1 className="text-5xl font-black text-[#04364A] tracking-tight leading-tight mb-8">
                            {service.displayName}
                        </h1>

                        <div className="space-y-8">
                            {service.description ? (
                                <div>
                                    <h3 className="text-lg font-black text-[#04364A] uppercase tracking-widest mb-4 flex items-center gap-2">
                                        <Award size={20} className="text-[#64CCC5]" />
                                        About This Service
                                    </h3>
                                    <p className="text-gray-500 leading-relaxed text-lg font-medium">
                                        {service.description}
                                    </p>
                                </div>
                            ) : (
                                <div className="p-8 border-2 border-dashed border-gray-100 rounded-[2rem] text-center">
                                    <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">no description yet</p>
                                </div>
                            )}

                            <div className="pt-10 border-t border-gray-50">
                                <h3 className="text-lg font-black text-[#04364A] uppercase tracking-widest mb-6 flex items-center gap-2">
                                    <Clock size={20} className="text-[#64CCC5]" />
                                    Weekly Schedule
                                </h3>
                                
                                {service.availabilities && service.availabilities.length > 0 ? (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {[...service.availabilities]
                                            .sort((a, b) => {
                                                const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
                                                return days.indexOf(a.day_of_week) - days.indexOf(b.day_of_week);
                                            })
                                            .map((slot, idx) => (
                                            <div key={idx} className={`p-5 rounded-[1.5rem] border flex items-center justify-between transition-all ${slot.status === 'available' ? 'bg-white border-gray-100 shadow-sm' : 'bg-gray-50/50 border-gray-100 opacity-60'}`}>
                                                <div className="flex flex-col">
                                                    <span className="text-[10px] font-black uppercase tracking-[0.15em] text-gray-400 mb-1">{slot.day_of_week}</span>
                                                    <span className={`text-sm font-bold ${slot.status === 'available' ? 'text-[#04364A]' : 'text-gray-400'}`}>
                                                        {slot.status === 'available' ? `${slot.start_time} - ${slot.end_time}` : 'Day Off'}
                                                    </span>
                                                </div>
                                                <div className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider ${slot.status === 'available' ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
                                                    {slot.status}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="p-10 bg-gray-50/50 rounded-[2rem] border-2 border-dashed border-gray-100 text-center">
                                        <Calendar size={32} className="mx-auto text-gray-200 mb-4" />
                                        <p className="text-[#04364A] font-black text-sm uppercase tracking-widest">Always Available</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {gallery.length > 0 && (
                        <div className="bg-white rounded-[3rem] p-12 border border-white shadow-xl shadow-[#04364A]/5">
                            <h3 className="text-2xl font-black text-[#04364A] uppercase tracking-tight mb-8">Service Gallery</h3>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                                {gallery.map((item, idx) => (
                                    <div key={idx} className="aspect-square rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 group cursor-pointer transition-all hover:shadow-lg">
                                        <img 
                                            src={item.image && !item.image.startsWith('http') ? `${UPLOAD_URL}/${item.image.replace(/["'[\]\\]/g, '')}` : item.image} 
                                            alt={service.displayName} 
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                            onError={(e) => e.target.src = '/placeholder.jpg'}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <div className="lg:col-span-4 space-y-8 lg:sticky lg:top-28 h-fit">
                    <div className="bg-[#04364A] rounded-[3rem] p-10 text-white shadow-2xl shadow-[#04364A]/20 relative overflow-hidden group">
                        <div className="relative z-10">
                            <div className="flex items-baseline gap-2 mb-8">
                                <span className="text-5xl font-black">${service.price}</span>
                                <span className="text-sm font-bold opacity-60">/{service.price_Type || 'hr'}</span>
                            </div>
                            <button onClick={() => navigate(`/book/${id}`)} className="w-full py-5 bg-[#64CCC5] hover:bg-white hover:text-[#04364A] text-[#04364A] rounded-[1.5rem] font-black uppercase tracking-[0.2em] text-xs shadow-xl transition-all active:scale-[0.98] flex items-center justify-center gap-3">
                                Book Now
                                <ChevronRight size={18} />
                            </button>
                        </div>
                    </div>

                    <div className="bg-white rounded-[3rem] p-10 border border-white shadow-xl shadow-[#04364A]/5">
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-8">Service Provider</h4>
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-20 h-20 rounded-full bg-gray-50 border-4 border-white shadow-lg overflow-hidden flex items-center justify-center shrink-0">
                                {provider?.image ? (
                                    <img 
                                        src={provider.image && !provider.image.startsWith('http') ? `${UPLOAD_URL}/${provider.image.replace(/["'[\]\\]/g, '')}` : provider.image} 
                                        alt={provider.name} 
                                        className="w-full h-full object-cover" 
                                        onError={(e) => e.target.src = '/placeholder.jpg'}
                                    />
                                ) : (
                                    <User size={32} className="text-gray-300" />
                                )}
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-[#04364A] tracking-tight hover:text-[#64CCC5] transition-colors">
                                    <Link to={`/provider/${provider?.id || service.userid}`}>
                                        {provider?.name || 'No provider found'}
                                    </Link>
                                </h3>
                            </div>
                        </div>
                        <div className="space-y-4 pt-6 border-t border-gray-50">
                             <div className="flex items-center gap-4 text-xs font-bold text-gray-500">
                                <div className="w-8 h-8 rounded-xl bg-gray-50 flex items-center justify-center text-[#04364A]">
                                    <MapPin size={16} />
                                </div>
                                {provider?.city || provider?.address || 'Location Not Specified'}
                             </div>
                             {provider?.phone && (
                                <div className="flex items-center gap-4 text-xs font-bold text-gray-500">
                                    <div className="w-8 h-8 rounded-xl bg-gray-50 flex items-center justify-center text-[#04364A]">
                                        <Clock size={16} />
                                    </div>
                                    Contact: {provider.phone}
                                </div>
                             )}
                        </div>
                        <Link to={`/provider/${provider?.id || service.userid}`} className="w-full mt-8 py-4 border-2 border-gray-100 hover:border-[#04364A] hover:bg-gray-50 text-[#04364A] rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all flex items-center justify-center gap-2 group">
                            View Profile
                            <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                        </Link>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ServiceDetail;
