import React from 'react';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

import ServiceCard from './ServiceCard';

const ServiceList = ({ services, providers, loading, auth }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
        {[1, 2, 3].map(i => <div key={i} className="h-[400px] bg-gray-100 animate-pulse rounded-[2rem]"></div>)}
      </div>
    );
  }

  return (
    <div id="services" className="relative">
      {services.length > 0 ? (
        <div className="relative group">
           {/* Custom Navigation Buttons */}
           <button className="swiper-button-prev-unique absolute top-1/2 -left-4 z-10 w-12 h-12 bg-white rounded-full shadow-xl flex items-center justify-center text-[#04364A] hover:bg-[#04364A] hover:text-white transition-all -translate-y-1/2 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto">
              <ChevronLeft size={24} />
           </button>
           <button className="swiper-button-next-unique absolute top-1/2 -right-4 z-10 w-12 h-12 bg-white rounded-full shadow-xl flex items-center justify-center text-[#04364A] hover:bg-[#04364A] hover:text-white transition-all -translate-y-1/2 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto">
              <ChevronRight size={24} />
           </button>

           <Swiper
             modules={[Navigation, Autoplay]}
             spaceBetween={24}
             slidesPerView={1}
             navigation={{
               prevEl: '.swiper-button-prev-unique',
               nextEl: '.swiper-button-next-unique',
             }}
             breakpoints={{
               640: { slidesPerView: 2, spaceBetween: 24 },
               1024: { slidesPerView: 3, spaceBetween: 32 },
               1280: { slidesPerView: 3, spaceBetween: 40 },
             }}
             autoplay={{ delay: 6000, disableOnInteraction: false }}
             className="py-10 px-4 -mx-4"
           >
             {services.map((service) => (
               <SwiperSlide key={service.id} className="h-auto">
                 <ServiceCard 
                   service={service} 
                   providers={providers}
                   auth={auth} 
                 />
               </SwiperSlide>
             ))}
           </Swiper>
        </div>
      ) : (
        <div className="text-center py-24 bg-white rounded-[3rem] border-4 border-dashed border-gray-100">
           <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-400">
             <Search size={32} /> 
           </div>
           <p className="text-[#04364A] font-black text-xl uppercase tracking-tighter">No results found</p>
           <p className="text-gray-400 font-medium mt-2">Try searching for a different service or category.</p>
        </div>
      )}
    </div>
  );
};

export default ServiceList;
