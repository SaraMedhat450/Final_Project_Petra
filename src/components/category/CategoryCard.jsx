import React from 'react';
import { Link } from 'react-router-dom';
import { LayoutGrid, Star, Tag } from 'lucide-react';
import { UPLOAD_URL } from '@/config/api';

const CategoryCard = ({ category }) => {
    const subcats = category.subcategories || [];
    const isActive = category.status === 'active';

    const getImageUrl = (image) => {
        if (!image || image === '00' || image === '' || image === 'null' || image === 'undefined') return null;
        const clean = image.replace(/["'[\]\\]/g, '').trim();
        if (!clean) return null;
        return clean.startsWith('http') ? clean : `${UPLOAD_URL}/${clean}`;
    };

    const imageUrl = getImageUrl(category.image);

    return (
        <Link 
            to={`/services?category=${encodeURIComponent(category.name)}`}
            className="group relative h-[400px] rounded-[2.5rem] flex flex-col cursor-pointer transition-all duration-500 bg-[#F0F9F9] hover:shadow-2xl hover:-translate-y-2 overflow-hidden border border-gray-100"
        >
            {/* Image - Full Width, Compact Height */}
            <div className="relative w-full h-[200px] overflow-hidden shadow-sm bg-[#E0F2F2] flex items-center justify-center">
                {imageUrl ? (
                    <img 
                        src={imageUrl} 
                        alt={category.name} 
                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                        onError={(e) => { e.target.style.display = 'none'; e.target.parentElement.innerHTML = '<div class="w-full h-full flex flex-col items-center justify-center bg-[#E0F2F2] text-[#176B87] gap-3"><svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-layout-grid"><rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/></svg><span class="text-[10px] font-black uppercase tracking-widest">No Image</span></div>'; }}
                    />
                ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-[#E0F2F2] text-[#176B87] gap-3">
                        <LayoutGrid size={48} strokeWidth={1.5} />
                        <span className="text-[10px] font-black uppercase tracking-widest">No Image</span>
                    </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#04364A]/20 to-transparent"></div>
            </div>
            
            {/* Content */}
            <div className="flex-1 flex flex-col p-6 items-center text-center">
                <h3 className="text-xl font-black tracking-tight mb-2 text-[#04364A] group-hover:text-[#176B87] transition-colors line-clamp-1">
                    {category.name}
                </h3>
                
                {/* Rating */}
                <div className="flex items-center gap-1.5 mb-3 justify-center">
                    {category.rating > 0 ? (
                        <>
                            <div className="flex gap-0.5 text-[#FFB000]">
                                {[1,2,3,4,5].map(star => (
                                    <Star 
                                        key={star} 
                                        size={10} 
                                        fill={star <= Math.round(category.rating || 0) ? 'currentColor' : 'none'} 
                                        className={star <= Math.round(category.rating || 0) ? '' : 'text-gray-300'}
                                    />
                                ))}
                            </div>
                            <span className="text-[10px] font-black text-[#04364A]/40">({category.rating})</span>
                        </>
                    ) : (
                        <span className="text-[10px] font-bold uppercase tracking-wider text-gray-300">New</span>
                    )}
                </div>

                {/* Subcategories - Header + List */}
                <div className="w-full mt-2 mb-4">
                    {subcats.length > 0 ? (
                        <>
                            <p className="text-[9px] font-black text-[#176B87] uppercase tracking-widest mb-3 opacity-60">Subcategories</p>
                            <div className="flex flex-wrap justify-center gap-1.5">
                                {subcats.slice(0, 3).map(sub => (
                                    <span key={sub.id} className="text-[9px] px-2 py-0.5 bg-white text-[#176B87] rounded-full border border-[#176B87]/10 font-bold group-hover:bg-[#176B87] group-hover:text-white transition-all duration-300">
                                        {sub.name}
                                    </span>
                                ))}
                                {subcats.length > 3 && (
                                    <span className="text-[9px] px-2 py-0.5 bg-white text-gray-400 rounded-full border border-gray-100 font-bold">
                                        +{subcats.length - 3}
                                    </span>
                                )}
                            </div>
                        </>
                    ) : (
                        <p className="text-xs font-medium text-gray-400 line-clamp-1 italic italic">
                            {category.description || "No subcategories"}
                        </p>
                    )}
                </div>
            </div>
        </Link>
    );
};

export default CategoryCard;
