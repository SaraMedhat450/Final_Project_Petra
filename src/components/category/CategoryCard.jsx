import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LayoutGrid, Star, Tag } from 'lucide-react';
import { UPLOAD_URL } from '@/config/api';

const CategoryCard = ({ category }) => {
    const navigate = useNavigate();
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
        <div 
            className="group relative h-[520px] rounded-[3.5rem] flex flex-col transition-all duration-500 bg-[#F2F9F9] hover:shadow-2xl hover:-translate-y-3 overflow-hidden border border-gray-100 shadow-sm"
        >
            {/* Image Section - Enhanced & Larger */}
            <div 
                onClick={() => navigate(`/services?category=${encodeURIComponent(category.name)}`)}
                className="relative w-full h-[270px] overflow-hidden cursor-pointer"
            >
                {imageUrl ? (
                    <img 
                        src={imageUrl} 
                        alt={category.name} 
                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                        onError={(e) => { 
                            e.target.style.display = 'none'; 
                            e.target.parentElement.innerHTML = '<div class="w-full h-full flex flex-col items-center justify-center bg-[#F0F9F9] text-[#176B87]"><svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"><rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/></svg></div>'; 
                        }}
                    />
                ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-[#F0F9F9] text-[#176B87]">
                        <LayoutGrid size={48} strokeWidth={1} />
                    </div>
                )}
            

                <div className="absolute inset-0 bg-gradient-to-t from-[#04364A]/60 via-[#04364A]/10 to-transparent"></div>
                
         
            </div>
            
            {/* Content Area - Refined Spacing */}
            <div className="flex-1 flex flex-col p-8 items-center text-center">
                <Link 
                    to={`/services?category=${encodeURIComponent(category.name)}`}
                    className="text-2xl font-black tracking-tighter mb-2 text-[#04364A] hover:text-[#176B87] transition-all line-clamp-1 hover:scale-105 transform origin-center"
                >
                    {category.name}
                </Link>
                
                {/* Rating & Identity */}
                <div className="flex items-center gap-3 mb-6 justify-center">
                    {category.rating > 0 ? (
                        <div className="flex items-center gap-2 bg-yellow-50 px-3 py-1 rounded-full border border-yellow-100 shadow-sm">
                            <Star size={12} fill="#F59E0B" className="text-[#F59E0B]" />
                            <span className="text-[10px] font-black text-[#F59E0B] tracking-tight">{category.rating} PRO RATING</span>
                        </div>
                    ) : <span className="flex items-center gap-2  px-3 py-1 rounded-full  shadow-sm text-[10px] font-black text-[#F59E0B] tracking-tight"> 0<Star size={12} fill="#F59E0B" className="text-[#F59E0B]" /></span>}
                </div>

                {/* Sub-Filters Section */}
                <div className="w-full mb-auto pb-4">
                    <div className="flex items-center justify-center gap-2 mb-5 opacity-30">
                        <div className="w-8 h-[1px] bg-[#176B87]"></div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-[#176B87] whitespace-nowrap">Subcategories</span>
                        <div className="w-8 h-[1px] bg-[#176B87]"></div>
                    </div>

                    <div className="flex flex-wrap justify-center gap-2.5 px-2">
                        {subcats.length > 0 ? (
                            <>
                                {subcats.slice(0, 4).map(sub => (
                                    <Link 
                                        key={sub.id} 
                                        to={`/subcategories?categoryId=${category.id}&categoryName=${encodeURIComponent(category.name)}`}
                                        className="text-[10px] px-4 py-2 bg-white/100 text-gray-500 rounded-2xl font-bold uppercase tracking-tighter hover:bg-[#176B87] hover:text-white transition-all duration-300 border border-white/20 hover:border-transparent hover:shadow-md"
                                    >
                                        {sub.name}
                                    </Link>
                                ))}
                                {subcats.length > 4 && (
                                    <Link 
                                        to={`/subcategories?categoryId=${category.id}&categoryName=${encodeURIComponent(category.name)}`}
                                        className="text-[10px] px-4 py-2 bg-white/40 text-gray-400 rounded-2xl font-black border border-white/20 hover:bg-white hover:text-[#04364A] transition-all shadow-sm"
                                    >
                                        +{subcats.length - 4} More
                                    </Link>
                                )}
                            </>
                        ) : (
                            <p className="text-xs font-medium text-gray-400 italic opacity-60 leading-relaxed px-6">
                                {category.description || "Discover high-quality professional services in this category."}
                            </p>
                        )}
                    </div>
                </div>


            </div>
        </div>
    );
};

export default CategoryCard;
