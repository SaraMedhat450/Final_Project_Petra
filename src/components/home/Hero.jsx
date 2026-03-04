import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import { Search, Sparkles, ChevronRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import 'swiper/css';
import 'swiper/css/pagination';
import { UPLOAD_URL } from '@/config/api';

// Static Unsplash Images for Home Services
const slides = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1581578731548-c64695ce6958?auto=format&fit=crop&w=2000&q=80', // Handyman/Tools
    title: 'Home Services',
    desc: 'Reliable home services that make your life easier — fast, safe, and done right the first time.'
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=2000&q=80', // Electrician
    title: 'Expert Repairs',
    desc: 'Quality craftsmanship for all your home repair needs. available 24/7.'
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1584622050111-993a426fbf0a?auto=format&fit=crop&w=2000&q=80', // Cleaning
    title: 'Professional Cleaning',
    desc: 'Spotless cleaning services for a fresh and healthy home environment.'
  },
  {
    id: 4,
    image: 'https://images.unsplash.com/photo-1604754742629-3e5728249d73?auto=format&fit=crop&w=2000&q=80', // Plumbing
    title: 'Plumbing Solutions',
    desc: 'Expert plumbing services to fix leaks, clogs, and installations quickly.'
  },
  {
    id: 5,
    image: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=2000&q=80', // Painting/General
    title: 'Home Improvement',
    desc: 'Transform your space with our verified home improvement professionals.'
  }
];

const Hero = ({ services, searchQuery, setSearchQuery }) => {
  const navigate = useNavigate();

  // 1. Get Dynamic Slides from Top Rated Services
  const heroSlides = React.useMemo(() => {
    if (!services || services.length === 0) return slides;

    // Get Top 5 Rated Services
    const topServices = [...services]
      .sort((a, b) => (b.rating || 0) - (a.rating || 0))
      .slice(0, 5);

    return topServices.map(s => ({
      id: s.id,
      image: s.image,
      title: s.name || s.Service_title?.name,
      desc: s.description || 'Professional home service you can trust.',
      category: s.category || s.Category?.name,
      price: s.price
    }));
  }, [services]);

  const handleSearchKeyPress = (e) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      navigate(`/services?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const getImageUrl = (img) => {
    // 1. Initial cleanup and fallback check
    if (!img || img === '00' || img === 'undefined' || img === 'null') return slides[0].image;
    
    // 2. Already a full URL?
    if (typeof img === 'string' && img.startsWith('http')) return img;

    // 3. Try to extract first image if it's a JSON string or array
    let finalPath = img;
    try {
        let raw = img;
        // Deeply parse in case of nested JSON strings
        while (typeof raw === 'string' && (raw.startsWith('[') || raw.startsWith('{') || raw.startsWith('"'))) {
            try {
                const parsed = JSON.parse(raw);
                raw = parsed;
            } catch (e) { break; }
        }
        
        if (Array.isArray(raw) && raw.length > 0) {
            finalPath = raw[0];
        } else if (typeof raw === 'string') {
            finalPath = raw;
        }
    } catch (e) {
        console.error("Hero Img Parse Error:", e);
    }

    // 4. Final path cleanup
    if (!finalPath || typeof finalPath !== 'string' || finalPath === '00' || finalPath === 'undefined' || finalPath === 'null') {
        return slides[0].image;
    }

    // 5. Clean up stray characters and build URL
    const cleanPath = finalPath.replace(/["'[\]\\]/g, '').trim();
    if (!cleanPath) return slides[0].image;

    // If it's a full URL now after parsing
    if (cleanPath.startsWith('http')) return cleanPath;

    return `${UPLOAD_URL}/${cleanPath}`;
  };

  return (
    <section className="relative h-[650px] w-full overflow-hidden bg-gray-900">
      <Swiper
        modules={[Pagination, Autoplay]}
        spaceBetween={0}
        speed={1000}
        autoplay={{ delay: 6000, disableOnInteraction: false }}
        pagination={{ 
          clickable: true,
          renderBullet: function (index, className) {
            return '<span class="' + className + '">0' + (index + 1) + '</span>';
          }
        }}
        className="h-full w-full hero-swiper"
      >
        {heroSlides.map((slide, index) => {
          const slideImage = getImageUrl(slide.image);
          
          return (
            <SwiperSlide key={`${slide.id}-${index}`}>
                <div className="relative w-full h-full flex items-center">
                {/* Background Image */}
                <div className="absolute inset-0">
                    <div className="absolute inset-0 bg-black/65 z-10" />
                    <img 
                        src={slideImage} 
                        alt={slide.title || 'Service'} 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                            if (e.target.src !== slides[0].image) {
                                e.target.src = slides[0].image;
                            }
                        }}
                    />
                </div>
                
                <div className="relative z-20 w-full max-w-7xl mx-auto px-6 md:px-12 pt-10">
                    <div className="max-w-2xl text-white">
                    <div className="flex items-center gap-2 mb-6 animate-in slide-in-from-left duration-700">
                        <Sparkles size={20} className="text-[#64CCC5]" />
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#64CCC5]">
                        {slide.category || 'Featured'} • Top Rated
                        </span>
                    </div>
                    
                    <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-8 drop-shadow-2xl leading-[0.9] animate-in slide-in-from-left duration-1000">
                        {slide.title}
                    </h1>
                    
                    <p className="text-lg md:text-xl text-gray-200 mb-12 font-medium drop-shadow-md leading-relaxed max-w-lg border-l-4 border-[#64CCC5] pl-6 animate-in slide-in-from-left duration-1000 delay-200 line-clamp-2">
                        {slide.desc}
                    </p>

                    <div className="flex flex-col sm:flex-row items-center gap-6 animate-in fade-in slide-in-from-bottom duration-1000 delay-500">
                        <div className="relative group w-full max-w-md">
                            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#64CCC5] transition-colors" size={20} />
                            <input 
                                type="text"
                                placeholder="Find a professional..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyDown={handleSearchKeyPress}
                                className="w-full bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl py-5 pl-16 pr-6 text-white placeholder-gray-400 focus:bg-white/20 focus:outline-none focus:ring-2 focus:ring-[#64CCC5]/50 transition-all font-medium"
                            />
                        </div>
                        {slide.id && typeof slide.id === 'number' ? (
                        <Link 
                            to={`/service/${slide.id}`} 
                            className="w-full sm:w-auto px-10 py-5 bg-[#64CCC5] text-[#04364A] text-xs font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-white transition-all shadow-xl shadow-[#04364A]/20 flex items-center justify-center gap-2"
                        >
                            <span>Book Now</span>
                            <ChevronRight size={16} />
                        </Link>
                        ) : (
                        <Link 
                            to={`/services${searchQuery.trim() ? `?search=${encodeURIComponent(searchQuery)}` : ''}`} 
                            className="w-full sm:w-auto px-10 py-5 bg-[#64CCC5] text-[#04364A] text-xs font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-white transition-all shadow-xl shadow-[#04364A]/20 flex items-center justify-center gap-2"
                        >
                            <span>Explore All</span>
                            <ChevronRight size={16} />
                        </Link>
                        )}
                    </div>
                    </div>
                </div>
                </div>
            </SwiperSlide>
          );
        })}
      </Swiper>

      {/* Custom Styles for Numbered Pagination */}
      <style>{`
        .hero-swiper .swiper-pagination {
          position: absolute;
          bottom: 40px !important;
          left: 48px !important;
          width: auto !important;
          text-align: left;
          z-index: 30;
          display: flex;
          align-items: flex-end; /* Align baselines */
          gap: 24px; /* Explicit gap between numbers */
        }
        .hero-swiper .swiper-pagination-bullet {
          width: auto !important;
          height: auto !important;
          background: transparent !important;
          color: rgba(255,255,255,0.4);
          font-family: inherit;
          font-size: 14px;
          font-weight: 700;
          opacity: 1 !important;
          margin: 0 !important; /* Reset margin, use gap instead */
          padding-bottom: 8px;
          border-radius: 0;
          transition: all 0.3s ease;
          position: relative;
          display: inline-block;
          cursor: pointer;
        }
        .hero-swiper .swiper-pagination-bullet-active {
          color: #ffffff;
          font-size: 20px;
          transform: translateY(2px); /* Subtle alignment fix */
        }
        .hero-swiper .swiper-pagination-bullet-active::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 3px;
          background-color: white;
        }
      `}</style>
    </section>
  );
};

export default Hero;
