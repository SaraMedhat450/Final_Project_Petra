import React from 'react';
import { Link } from 'react-router-dom';
import { Star, MapPin, Award, Zap, ArrowRight, User } from 'lucide-react';
import { UPLOAD_URL } from '@/config/api';

const ProviderCard = ({ provider }) => {
    const getImageUrl = (image) => {
        if (!image || image === '00' || image === 'profile.jpg') return null;
        if (image.startsWith('http')) return image;
        return `${UPLOAD_URL}/${image.replace(/["'[\]\\]/g, '').trim()}`;
    };

    const imageUrl = getImageUrl(provider.image);

    return (
        <Link 
            to={`/provider/${provider.id}`}
            className="group bg-white rounded-[2.5rem] p-6 border border-gray-100 hover:border-[#64CCC5]/50 hover:shadow-xl hover:shadow-[#64CCC5]/10 transition-all duration-300 flex flex-col items-center text-center relative overflow-hidden h-full"
        >
            <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-gray-50 to-transparent -z-0"></div>
            
            <div className="relative z-10 mb-4">
                <div className="w-28 h-28 rounded-[2rem] p-1 bg-white border-4 border-gray-50 shadow-lg mb-4 mx-auto group-hover:scale-105 transition-transform duration-500 flex items-center justify-center overflow-hidden">
                    {imageUrl ? (
                        <img 
                            src={imageUrl} 
                            alt={provider.name} 
                            className="w-full h-full object-cover rounded-[1.8rem]"
                            onError={(e) => { e.target.style.display = 'none'; e.target.parentElement.innerHTML = '<div class="w-full h-full bg-[#F8FAFC] flex items-center justify-center text-[#94A3B8]"><svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-user"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg></div>'; }}
                        />
                    ) : (
                        <div className="w-full h-full bg-[#F8FAFC] flex items-center justify-center text-[#94A3B8]">
                            <User size={40} strokeWidth={1.5} />
                        </div>
                    )}
                </div>
            </div>

            <div className="space-y-1 mb-4">
                <h3 className="text-lg font-black text-[#04364A] group-hover:text-[#176B87] transition-colors line-clamp-1">{provider.name}</h3>
                {provider.specialty && (
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#64CCC5]">
                        {provider.specialty}
                    </p>
                )}
            </div>
            
            <div className="flex items-center gap-1.5 mb-6 text-sm font-bold text-gray-400">
                <MapPin size={14} className="text-[#64CCC5]" /> {provider.city || 'Location Pending'}
            </div>

            <div className="w-full grid grid-cols-3 gap-2 py-4 border-t border-b border-gray-50 mb-6">
                <div className="flex flex-col items-center">
                    <span className="flex items-center gap-1 text-amber-500 font-black text-sm">
                        <Star size={12} fill="currentColor" /> {provider.rating || '0.0'}
                    </span>
                    <span className="text-[8px] font-black uppercase tracking-widest text-gray-300">Rating</span>
                </div>
                <div className="flex flex-col items-center border-l border-r border-gray-50">
                    <span className="flex items-center gap-1 text-[#04364A] font-black text-sm">
                        <Award size={12} /> {provider.points || '0'}
                    </span>
                    <span className="text-[8px] font-black uppercase tracking-widest text-gray-300">Points</span>
                </div>
                <div className="flex flex-col items-center">
                    <span className="flex items-center gap-1 text-[#64CCC5] font-black text-sm uppercase">
                        <Zap size={12} /> {provider.status || 'Active'}
                    </span>
                    <span className="text-[8px] font-black uppercase tracking-widest text-gray-300">Status</span>
                </div>
            </div>

            <span className="mt-auto inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#04364A] group-hover:text-[#64CCC5] transition-colors">
                View Profile <ArrowRight size={14} />
            </span>
        </Link>
    );
};

export default ProviderCard;
