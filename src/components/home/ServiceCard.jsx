import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UPLOAD_URL } from '@/config/api';
import { Star, ShieldCheck, ArrowUpRight } from 'lucide-react';

const ServiceCard = ({ service, providers, auth, viewMode = 'grid' }) => {
  const navigate = useNavigate();
  const isGuest = !auth?.isAuthenticated || auth?.role === 'guest';
  
  // Find provider name
  const provider = providers?.find(p => p.id === service.userid || p.id === service.providerId);
  const providerName = provider?.name || 'Provider';

  const getPriceTypeLabel = (type) => {
    if (!type) return 'hr';
    const t = type.toLowerCase();
    if (t.includes('hour')) return 'hr';
    if (t.includes('fix')) return 'total';
    return t;
  };

  // Build image URL from raw image string
  const getImageUrl = (img) => {
    if (!img || img === '00' || img === 'undefined' || img === 'null') return null;
    if (typeof img !== 'string') return null;
    if (img.startsWith('http')) return img;
    const clean = img.replace(/["'[\]\\]/g, '').trim();
    if (!clean) return null;
    return `${UPLOAD_URL}/${clean}`;
  };

  const imageUrl = getImageUrl(service.image);

  const handleViewService = () => {
    navigate(`/service/${service.id}`);
  };

  if (viewMode === 'list') {
    return (
      <div className="group relative bg-white rounded-[2rem] border border-gray-100 overflow-hidden flex flex-col sm:flex-row hover:shadow-xl transition-all duration-300">
        <div className="relative h-40 sm:h-auto sm:w-60 shrink-0 overflow-hidden bg-gray-50 flex items-center justify-center">
            {imageUrl ? (
            <img 
                src={imageUrl} 
                alt={service.name} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                onError={(e) => { 
                    if (e.target) e.target.style.display = 'none'; 
                    if (e.target && e.target.parentElement) {
                        const placeholder = document.createElement('div');
                        placeholder.className = "w-full h-full flex flex-col items-center justify-center bg-gray-100/50 text-gray-300";
                        placeholder.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-shield-check"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/></svg>';
                        e.target.parentElement.appendChild(placeholder);
                    }
                }}
            />
            ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100/50 text-gray-300">
                <ShieldCheck size={32} strokeWidth={1} />
            </div>
            )}
             <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest text-[#04364A] shadow-sm">
                {service.category}
            </div>
        </div>
        
        <div className="p-5 flex flex-col flex-1">
              <div className="flex justify-between items-start mb-1.5">
                <div className="flex-1">
                    <Link to={`/service/${service.id}`}>
                        <h3 className="text-lg font-black text-[#04364A] leading-tight hover:text-[#64CCC5] transition-colors line-clamp-1">{service.name}</h3>
                    </Link>
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <Link 
                            to={`/provider/${provider?.id || service.userid}`}
                            className="text-[9px] font-black text-[#64CCC5] uppercase tracking-widest hover:text-[#04364A] transition-colors block"
                        >
                            By {providerName}
                        </Link>
                        {service.city && service.city !== 'Unknown' && (
                            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1">
                                <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                                {service.city}
                            </span>
                        )}
                      </div>
                </div>
                <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-lg">
                    <Star size={10} fill="#F59E0B" className="text-[#F59E0B]" />
                    <span className="text-[10px] font-bold text-[#F59E0B]">{service.rating}</span>
                </div>
              </div>
             <p className="text-gray-400 text-xs font-medium leading-relaxed mb-3 line-clamp-2 min-h-[32px]">
                {service.description || 'no description yet'}
             </p>
             
             <div className="mt-auto flex items-center justify-between pt-3 border-t border-gray-50">
                 <div className="flex items-baseline gap-1">
                    <span className="text-xl font-black text-[#04364A]">
                       ${service.price}
                    </span>
                    <span className="text-[9px] font-medium text-gray-400">/{getPriceTypeLabel(service.price_Type)}</span>
                 </div>
                 <button 
                    onClick={handleViewService}
                    className="px-6 py-2.5 bg-[#04364A] hover:bg-[#176B87] text-white text-[10px] font-black uppercase tracking-[0.15em] rounded-xl shadow-lg shadow-[#04364A]/10 transition-all active:scale-[0.98] flex items-center gap-2"
                >
                    <span>View Service</span>
                    <ArrowUpRight size={14} />
                </button>
             </div>
        </div>
      </div>
    );
  }

  return (
    <div className="group relative bg-white rounded-[1.5rem] border border-gray-100 overflow-hidden flex flex-col h-full hover:shadow-xl transition-all duration-300">
      {/* Image */}
      <div className="relative h-44 w-full overflow-hidden bg-gray-50 flex items-center justify-center">
        {imageUrl ? (
          <img 
            src={imageUrl} 
            alt={service.name} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                onError={(e) => { 
                    if (e.target) e.target.style.display = 'none'; 
                    if (e.target && e.target.parentElement) {
                        const placeholder = document.createElement('div');
                        placeholder.className = "w-full h-full flex flex-col items-center justify-center bg-gray-100/50 text-gray-300";
                        placeholder.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-shield-check"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/></svg><span class="text-[9px] font-black uppercase tracking-widest mt-1">No Image</span>';
                        e.target.parentElement.appendChild(placeholder);
                    }
                }}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100/50 text-gray-300">
             <ShieldCheck size={32} strokeWidth={1} />
             <span className="text-[9px] font-black uppercase tracking-widest mt-1">No Image</span>
          </div>
        )}

        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest text-[#04364A] shadow-sm">
          {service.category}
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex justify-between items-start gap-3 mb-3">
           <div className="flex-1">
              <Link to={`/service/${service.id}`}>
                <h3 className="text-base font-black text-[#04364A] leading-tight line-clamp-2 min-h-[38px] hover:text-[#64CCC5] transition-colors">
                  {service.name}
                </h3>
              </Link>
           </div>
           <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-lg shrink-0">
              <Star size={10} fill="#F59E0B" className="text-[#F59E0B]" />
              <span className="text-[10px] font-black text-[#F59E0B]">{service.rating}</span>
           </div>
        </div>

        <div className="mb-4 flex-grow">
          <p className="text-gray-400 text-xs font-medium leading-relaxed line-clamp-2 min-h-[32px]">
             {service.description || 'no description yet'}
          </p>
        </div>

        <div className="mb-4 flex flex-wrap items-center gap-2">
            <Link 
                to={`/provider/${provider?.id || service.userid}`}
                className="text-[9px] font-black text-[#64CCC5] uppercase tracking-widest hover:text-[#04364A] transition-colors inline-block"
            >
                By {providerName}
            </Link>
            {service.city && service.city !== 'Unknown' && (
                <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1">
                    <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                    {service.city}
                </span>
            )}
        </div>

        {/* Price & Action */}
        <div className="pt-4 border-t border-gray-50">
          <div className="flex items-end justify-between mb-3">
             <div>
                <div className="flex items-baseline gap-1">
                   <span className="text-xl font-black text-[#04364A]">
                      ${service.price}
                   </span>
                   <span className="text-[12px] font-medium text-gray-400">/{getPriceTypeLabel(service.price_Type)}</span>
                </div>
             </div>
          </div>
          
          <button 
            onClick={handleViewService}
            className="w-full py-2.5 bg-[#04364A] hover:bg-[#176B87] text-white text-[10px] font-black uppercase tracking-[0.15em] rounded-xl shadow-lg shadow-[#04364A]/10 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
          >
            <span>View Service</span>
            <ArrowUpRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;
