import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LayoutGrid, ChevronLeft, ChevronRight, Star, Sparkles } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';

import { UPLOAD_URL } from '@/config/api';

const HomeCategories = ({ categories, loading, selectedCategories, onSelectCategory }) => {
  const navigate = useNavigate();
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-pulse px-6 py-24">
        {[1, 2, 3].map(i => <div key={i} className="h-64 bg-gray-50 rounded-3xl"></div>)}
      </div>
    );
  }

  // Only show active categories
  const activeCategories = categories.filter(cat => cat.status === 'active');

  const getImageUrl = (image) => {
    if (!image || image === '00' || image === '' || image === 'null' || image === 'undefined') return null;
    const clean = image.replace(/["'[\]\\]/g, '').trim();
    if (!clean) return null;
    return clean.startsWith('http') ? clean : `${UPLOAD_URL}/${clean}`;
  };

  return (
    <div id="categories" className="py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between mb-16 px-4">
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-[#64CCC5] animate-fade-in">
              <div className="w-12 h-[22px] rounded-full bg-[#64CCC5]/10 flex items-center justify-center">
                <LayoutGrid size={12} strokeWidth={3} />
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.4em]">Browse Directory</span>
            </div>
            <h2 className="text-5xl md:text-6xl font-black text-[#04364A] tracking-tighter leading-none">
              Explore <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#176B87] to-[#04364A]">Categories.</span>
            </h2>
          </div>
           
           <div className="flex items-center gap-4">
             <div className="hidden md:flex gap-2">
                <button className="swiper-prev w-10 h-10 rounded-full border border-gray-100 flex items-center justify-center text-[#04364A] hover:bg-[#04364A] hover:text-white transition-all">
                   <ChevronLeft size={18} />
                </button>
                <button className="swiper-next w-10 h-10 rounded-full border border-gray-100 flex items-center justify-center text-[#04364A] hover:bg-[#04364A] hover:text-white transition-all">
                   <ChevronRight size={18} />
                </button>
             </div>
             <button 
                 onClick={() => navigate('/categories')}
                 className="group flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-[#04364A] hover:text-[#04364A] transition-all"
             >
               See All
               <div className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center group-hover:bg-[#04364A] group-hover:text-white transition-all">
                 <ChevronRight size={14} />
               </div>
             </button>
           </div>
        </div>

        <div className="px-2">
          {activeCategories.length > 0 ? (
            <Swiper
              modules={[Navigation, Autoplay]}
              spaceBetween={30}
              slidesPerView={1}
              navigation={{
                prevEl: '.swiper-prev',
                nextEl: '.swiper-next',
              }}
              breakpoints={{
                640: { slidesPerView: 2, spaceBetween: 20 },
                1024: { slidesPerView: 3, spaceBetween: 30 },
              }}
              loop={activeCategories.length > 3}
              autoplay={{ delay: 5000, disableOnInteraction: false }}
              className="pb-12"
            >
              {activeCategories.map((cat) => {
                const isActive = selectedCategories.includes(cat.name);
                const imageUrl = getImageUrl(cat.image);
                
                const cardStyles = { 
                  bg: 'bg-[#F0F9F9]', 
                  placeholder: 'bg-[#E0F2F2]', 
                  text: 'text-[#176B87]' 
                };
                
                return (
                  <SwiperSlide key={cat.id}>
                    <div 
                      onClick={() => navigate(`/subcategories?categoryId=${cat.id}&categoryName=${encodeURIComponent(cat.name)}`)}
                      className={`group relative h-[480px] rounded-[3rem] p-5 flex flex-col cursor-pointer transition-all duration-500 ${
                        isActive 
                          ? 'bg-[#04364A] shadow-2xl scale-[1.02] z-10' 
                          : `${cardStyles.bg} hover:shadow-xl hover:-translate-y-1`
                      }`}
                    >
                      {/* Image */}
                      <div className={`relative w-full h-[320px] rounded-[2.5rem] overflow-hidden shadow-lg mb-6 ${isActive ? 'bg-white/10' : cardStyles.placeholder}`}>
                          {imageUrl ? (
                              <img 
                                  src={imageUrl} 
                                  alt={cat.name} 
                                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                  onError={(e) => { 
                                      if (e.target) e.target.style.display = 'none'; 
                                      if (e.target && e.target.parentElement) {
                                          const placeholder = document.createElement('div');
                                          placeholder.className = "w-full h-full flex flex-col items-center justify-center bg-[#E0F2F2] text-[#176B87] gap-3";
                                          placeholder.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-layout-grid"><rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/></svg><span class="text-[10px] font-black uppercase tracking-widest">No Image</span>';
                                          e.target.parentElement.appendChild(placeholder);
                                      }
                                  }}
                              />
                          ) : (
                              <div className={`w-full h-full flex flex-col items-center justify-center ${isActive ? 'bg-white/5 text-[#64CCC5]' : `${cardStyles.placeholder} ${cardStyles.text}`} gap-3`}>
                                  <LayoutGrid size={48} strokeWidth={1.5} />
                                  <span className="text-[10px] font-black uppercase tracking-widest">No Image</span>
                              </div>
                          )}
                          <div className="absolute inset-0 bg-black/5 group-hover:opacity-0 transition-opacity"></div>
                      </div>
                      
                      {/* Content */}
                      <div className="flex-1 flex flex-col items-center text-center px-4">
                         <h3 className={`text-2xl font-black tracking-tight mb-2 ${isActive ? 'text-white' : 'text-[#04364A]'}`}>{cat.name}</h3>
                         
                         {/* Rating */}
                         <div className="flex items-center gap-1.5 mb-3 justify-center">
                            {cat.rating > 0 ? (
                              <>
                                <div className="flex gap-0.5 text-[#FFB000]">
                                  {[1,2,3,4,5].map(star => (
                                    <Star 
                                      key={star} 
                                      size={12} 
                                      fill={star <= Math.round(cat.rating || 0) ? 'currentColor' : 'none'} 
                                      className={star <= Math.round(cat.rating || 0) ? '' : 'text-gray-300'}
                                    />
                                  ))}
                                </div>
                                <span className={`text-[10px] font-black ${isActive ? 'text-white/60' : 'text-[#04364A]/40'}`}>({cat.rating})</span>
                              </>
                            ) : (
                              <span className="flex items-center gap-2  px-3 py-1 rounded-full  shadow-sm text-[10px] font-black text-[#F59E0B] tracking-tight"> 0<Star size={12} fill="#F59E0B" className="text-[#F59E0B]" /></span>
                            )}
                         </div>
  
                         {cat.description && (
                           <p className={`text-xs font-medium mb-2 line-clamp-1 ${isActive ? 'text-white/60' : 'text-gray-400'}`}>
                             {cat.description}
                           </p>
                         )}
  
                         <p className={`text-[9px] font-black uppercase tracking-[0.2em] mt-auto transition-all transform ${isActive ? 'text-[#64CCC5] opacity-100 translate-y-0' : 'text-[#64CCC5]/60 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0'}`}>
                            {isActive ? 'SELECTED CATEGORY' : 'EXPLORE CATEGORY'}
                         </p>
                      </div>
  
                      {isActive && (
                        <div className="absolute top-8 right-8 bg-[#64CCC5] px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-xl border-2 border-white/20 animate-in slide-in-from-right-4 duration-500">
                           <Sparkles size={14} className="text-[#04364A] animate-pulse" />
                           <span className="text-[8px] font-black text-[#04364A] tracking-tighter">SELECTED</span>
                        </div>
                      )}
                    </div>
                  </SwiperSlide>
                );
              })}
            </Swiper>
          ) : (
            <div className="text-center py-24 bg-gray-50/50 rounded-[3rem] border-4 border-dashed border-gray-100 animate-in fade-in zoom-in duration-700">
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-8 text-gray-200 shadow-sm border border-gray-50">
                <LayoutGrid size={40} strokeWidth={1} />
              </div>
              <h3 className="text-[#04364A] font-black text-2xl tracking-tight uppercase mb-3">No Categories Yet</h3>
              <p className="text-gray-400 font-medium max-w-sm mx-auto leading-relaxed px-6">
                We're currently expanding our service selection. Please check back soon for exciting new categories!
              </p>
              <button 
                onClick={() => navigate('/services')}
                className="mt-10 px-10 py-4 bg-[#04364A] text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-[#176B87] hover:shadow-2xl hover:scale-[1.05] transition-all duration-500"
              >
                Browse All Services
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomeCategories;
