import React from 'react';
import { Star, User } from 'lucide-react';
import { UPLOAD_URL } from '@/config/api';

const ProviderProfileCard = ({ provider, servicesCount }) => {
    const getImageUrl = (image) => {
        if (!image || image === '00' || image === 'profile.jpg') return null;
        if (image.startsWith('http')) return image;
        return `${UPLOAD_URL}/${image.replace(/["'[\]\\]/g, '').trim()}`;
    };

    const imageUrl = getImageUrl(provider?.image);

    return (
        <div className="bg-white rounded-[3rem] p-10 soft-shadow border border-gray-100 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#DAFFFB]/30 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110"></div>
            
            <div className="relative z-10 text-center space-y-6">
                <div className="relative inline-block">
                    <div className="w-40 h-40 rounded-[2.5rem] overflow-hidden border-8 border-white soft-shadow mx-auto bg-gray-50 flex items-center justify-center">
                        {imageUrl ? (
                            <img 
                                src={imageUrl} 
                                alt={provider.name} 
                                className="w-full h-full object-cover"
                                onError={(e) => { e.target.style.display = 'none'; e.target.parentElement.innerHTML = '<div class="w-full h-full bg-[#F8FAFC] flex items-center justify-center text-[#94A3B8]"><svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-user"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg></div>'; }}
                            />
                        ) : (
                            <div className="w-full h-full bg-[#F8FAFC] flex items-center justify-center text-[#94A3B8]">
                                <User size={64} strokeWidth={1} />
                            </div>
                        )}
                    </div>
                </div>

                <div className="space-y-2">
                    <h1 className="text-3xl font-black text-[#04364A] tracking-tight leading-tight">{provider.name}</h1>
                    <div className="flex items-center justify-center gap-4">
                        <div className="flex items-center gap-1 text-amber-500">
                            <Star size={16} fill="currentColor" />
                            <span className="text-sm font-black">{provider.rating || '0.0'}</span>
                        </div>
                        <div className="w-1.5 h-1.5 bg-gray-200 rounded-full"></div>
                    </div>
                </div>

                <div className="pt-6 border-t border-gray-100 flex justify-between gap-4">
                    <div className="text-center flex-1">
                        <p className="text-xl font-black text-[#04364A]">{provider.points || '0'}</p>
                        <p className="text-[8px] font-black uppercase tracking-widest text-gray-400">Total Points</p>
                    </div>
                    <div className="w-px bg-gray-100"></div>
                    <div className="text-center flex-1">
                        <p className="text-xl font-black text-[#04364A]">{servicesCount}</p>
                        <p className="text-[8px] font-black uppercase tracking-widest text-gray-400">Services</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProviderProfileCard;
