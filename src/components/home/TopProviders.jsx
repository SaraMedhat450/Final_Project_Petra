import React from 'react';
import { Link } from 'react-router-dom';
import { Star, ChevronLeft, ChevronRight, User, ArrowUpRight } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

import { UPLOAD_URL } from '@/config/api';

const TopProviders = ({ providers, loading }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-[400px] bg-gray-100 rounded-2xl"></div>
        ))}
      </div>
    );
  }

  if (!providers || providers.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="w-20 h-20 rounded-full bg-gray-50 flex items-center justify-center mx-auto mb-4">
          <User size={32} className="text-gray-300" />
        </div>
        <p className="text-gray-400 font-medium">No providers available yet.</p>
      </div>
    );
  }

  const getImageUrl = (image) => {
    if (!image || image === '00' || image === 'profile.jpg') return null;
    if (image.startsWith('http')) return image;
    return `${UPLOAD_URL}/${image.replace(/["'[\]\\]/g, '').trim()}`;
  };

  return (
    <div className="relative">
      {/* Modernized Header */}
      <div className="flex flex-col md:flex-row items-end md:items-center justify-between mb-16 px-4 gap-8">
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-[#64CCC5] animate-fade-in">
            <div className="w-12 h-[22px] rounded-full bg-[#64CCC5]/10 flex items-center justify-center">
              <User size={12} strokeWidth={3} />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.4em]">Expert</span>
          </div>
          <h2 className="text-5xl md:text-6xl font-black text-[#04364A] tracking-tighter leading-none">
            Top <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#176B87] to-[#04364A]">Providers.</span>
          </h2>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="hidden md:flex gap-2">
            <button className="provider-prev w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-[#04364A] hover:bg-[#04364A] hover:text-white transition-all">
              <ChevronLeft size={18} />
            </button>
            <button className="provider-next w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-[#04364A] hover:bg-[#04364A] hover:text-white transition-all">
              <ChevronRight size={18} />
            </button>
          </div>

          <Link 
            to="/providers"
            className="group flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-[#04364A] hover:text-[#04364A] transition-all"
          >
            See All
            <div className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center group-hover:bg-[#04364A] group-hover:text-white transition-all">
              <ArrowUpRight size={14} />
            </div>
          </Link>
        </div>
      </div>

      {/* Carousel */}
      <Swiper
        modules={[Navigation, Autoplay]}
        spaceBetween={24}
        slidesPerView={1}
        navigation={{
          prevEl: '.provider-prev',
          nextEl: '.provider-next',
        }}
        breakpoints={{
          640: { slidesPerView: 2, spaceBetween: 24 },
          1024: { slidesPerView: 4, spaceBetween: 24 },
        }}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        className="pb-6"
      >
        {providers.map((pro) => {
          const initials = pro.name ? pro.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) : '';
          const imageUrl = getImageUrl(pro.image);

          return (
            <SwiperSlide key={pro.id} className="h-auto">
                <div className="group relative bg-white rounded-[2.5rem] border border-gray-100 overflow-hidden flex flex-col h-full hover:shadow-2xl transition-all duration-500">
                
                {/* Image Container with Floating Button */}
                <div className="h-72 w-full overflow-hidden bg-gray-50 relative flex items-center justify-center">
                    {imageUrl ? (
                        <img 
                            src={imageUrl} 
                            alt={pro.name} 
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            onError={(e) => { e.target.style.display = 'none'; e.target.parentElement.innerHTML = 'Provider'; }}
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-[#F8FAFC] text-[#94A3B8]">
                            {initials ? (
                                <span className="text-5xl font-black opacity-40">{initials}</span>
                            ) : (
                                <User size={64} strokeWidth={1} />
                            )}
                        </div>
                    )}
                </div>

                <div className="p-8 flex flex-col flex-grow text-center">
                    <div className="mb-4">
                        <h3 className="text-2xl font-black text-[#04364A] tracking-tight leading-none mb-2">{pro.name}</h3>
                        <p className={`text-[10px] font-bold uppercase tracking-[0.2em] ${pro.service?.trim() ? 'text-[#64CCC5]' : 'text-gray-400'}`}>
                        {pro.service?.trim() ? pro.service : "No service added yet"}
                        </p>
                    </div>

                    <div className="flex items-center justify-center gap-2 mb-8 bg-gray-50/80 py-2 px-4 rounded-2xl w-fit mx-auto">
                        <Star size={14} fill="#F59E0B" className="text-[#F59E0B]" />
                        <span className="text-sm font-black text-[#04364A]">
                            {pro.rating > 0 ? pro.rating.toFixed(1) : "0.0"}
                        </span>
                        <span className="text-[10px] font-bold text-gray-300 ml-1 uppercase tracking-widest">Rating</span>
                    </div>

                <Link 
                        to={`/provider/${pro.id}`}
                        className="w-full py-3.5 bg-[#04364A] hover:bg-[#176B87] text-white text-xs font-black uppercase tracking-[0.15em] rounded-xl shadow-lg shadow-[#04364A]/10 transition-all active:scale-[0.98] flex items-center justify-center gap-2 group-hover:gap-3"
            >
                        View Profile
                    </Link>
                </div>
                </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
};

export default TopProviders;
