import React from 'react';
import { Link } from 'react-router-dom';
import { Zap, CalendarDays } from 'lucide-react';

const ProviderOfferings = ({ services, getImageSrc }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {services.length > 0 ? (
                services.map(srv => {
                    const img = srv.firstImage || (Array.isArray(srv.images) ? srv.images[0] : srv.images);
                    const imageUrl = getImageSrc(img);

                    return (
                        <div key={srv.id} className="group bg-white rounded-[2.5rem] overflow-hidden soft-shadow border border-gray-100 hover:border-[#64CCC5]/30 transition-all duration-500 flex flex-col h-full">
                            <div className="h-48 overflow-hidden relative shrink-0 border-b border-gray-50 flex items-center justify-center bg-gray-50">
                                {imageUrl ? (
                                    <img 
                                        src={imageUrl} 
                                        alt={srv.name} 
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1581578731117-1045293d2f24?auto=format&fit=crop&q=80&w=1000'; }}
                                    />
                                ) : (
                                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-300">Service Image</span>
                                )}
                                <div className="absolute top-4 left-4 glass-card px-4 py-2 rounded-xl text-[10px] font-black text-[#04364A] uppercase tracking-widest border border-white/40 shadow-sm">
                                    {srv.price_Type}
                                </div>
                            </div>
                            <div className="p-8 space-y-4 flex flex-col flex-1">
                                <h3 className="text-lg font-black text-[#04364A] leading-tight group-hover:text-[#176B87] transition-colors line-clamp-1">{srv.name || srv.description || 'Service'}</h3>
                                <p className="text-xs text-gray-500 font-medium line-clamp-2">{srv.description || 'No description provided.'}</p>
                                
                                {/* Availabilities Summary */}
                                {srv.availabilities && srv.availabilities.length > 0 && (
                                    <div className="flex flex-wrap gap-2 pt-2">
                                        {Array.from(new Set(srv.availabilities.map(a => a.day_of_week))).map((day, idx) => (
                                            <span key={idx} className="inline-flex items-center gap-1 px-2 py-1 bg-gray-50 rounded-lg text-[8px] font-black text-[#176B87] uppercase tracking-wider border border-gray-100">
                                                <CalendarDays size={10} /> {day}
                                            </span>
                                        ))}
                                    </div>
                                )}

                                <div className="mt-auto pt-6 flex justify-between items-end">
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-[#64CCC5]">Investment</p>
                                        <p className="text-2xl font-black text-[#04364A]">
                                            ${srv.price}
                                            {srv.max_price && srv.max_price > srv.price && (
                                                <span className="text-sm text-gray-400 font-bold ml-1">- ${srv.max_price}</span>
                                            )}
                                            <span className="text-xs text-gray-400 font-bold ml-1">/{srv.price_Type?.toLowerCase().includes('hour') ? 'hr' : (srv.price_Type?.toLowerCase().includes('fix') ? 'total' : srv.price_Type?.toLowerCase() || 'hr')}</span>
                                        </p>
                                    </div>
                                    <Link 
                                        to={`/book/${srv.id}`}
                                        className="bg-[#04364A] text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-[#176B87] hover:shadow-lg hover:shadow-[#04364A]/20 transition-all flex items-center gap-2"
                                    >
                                        Book Now <Zap size={14} />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    );
                })
            ) : (
                <div className="col-span-full py-24 text-center bg-white rounded-[3rem] border border-gray-100 soft-shadow">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300">
                        <Zap size={24} />
                    </div>
                    <p className="text-[#04364A] font-black text-xl uppercase tracking-tighter">No services listed</p>
                    <p className="text-gray-400 font-medium mt-2">This provider hasn't listed any services yet.</p>
                </div>
            )}
        </div>
    );
};

export default ProviderOfferings;
