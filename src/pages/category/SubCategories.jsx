import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Search, ArrowLeft, LayoutGrid, Star } from 'lucide-react';
import { API_ENDPOINTS, COMMON_HEADERS, UPLOAD_URL } from '@/config/api';

const SubCategories = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const categoryId = queryParams.get('categoryId');
    const categoryName = queryParams.get('categoryName');

    const [subcategories, setSubcategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchSubcategories = async () => {
            setLoading(true);
            try {
                const response = await fetch(API_ENDPOINTS.SUBCATEGORIES, { headers: COMMON_HEADERS });
                if (response.ok) {
                    const data = await response.json();
                    const allSubs = data.subcategories || data.data || (Array.isArray(data) ? data : []);
                    
                    // Filter by categoryId if provided, and only active ones
                    const filtered = allSubs.filter(sub => 
                        sub.status === 'active' && 
                        (!categoryId || String(sub.categoryId) === String(categoryId))
                    );
                    setSubcategories(filtered);
                }
            } catch (err) {
                console.error("Subcategories page failed to load:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchSubcategories();
    }, [categoryId]);

    const filteredSubs = subcategories.filter(s => 
        s.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const getImageUrl = (image) => {
        if (!image || image === '00' || image === '' || image === 'null' || image === 'undefined') return null;
        const clean = image.replace(/["'[\]\\]/g, '').trim();
        if (!clean) return null;
        return clean.startsWith('http') ? clean : `${UPLOAD_URL}/${clean}`;
    };

    return (
        <div className="bg-gray-50/50 min-h-screen pt-24 pb-20">
            {/* Header Section */}
            <div className="bg-[#04364A] py-20 px-6 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-[#64CCC5] rounded-full blur-[100px]"></div>
                    <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#176B87] rounded-full blur-[100px]"></div>
                </div>
                
                <div className="max-w-7xl mx-auto relative z-10 text-center">
                    <Link 
                        to="/categories" 
                        className="inline-flex items-center gap-2 text-[#64CCC5] mb-8 hover:text-white transition-colors group"
                    >
                        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Back to Categories</span>
                    </Link>
                    
                    <h1 className="text-5xl md:text-7xl font-display font-black text-white tracking-tight mb-8">
                        {categoryName || 'Sub'} <span className="text-[#64CCC5]">Categories</span>
                    </h1>
                    
                    <p className="text-[#DAFFFB]/60 text-lg max-w-2xl mx-auto font-medium leading-relaxed">
                        Explore specialized services within {categoryName || 'our categories'}.
                    </p>
                </div>
            </div>

            {/* Content Container */}
            <div className="max-w-7xl mx-auto px-6 -mt-10 relative z-20">
                {/* Search Bar */}
                <div className="bg-white p-4 rounded-3xl soft-shadow border border-gray-100 flex items-center gap-4 mb-16 shadow-xl lg:w-2/3 mx-auto">
                    <div className="flex-1 relative">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input 
                            type="text"
                            placeholder="Find a subcategory..."
                            className="w-full pl-14 pr-6 py-4 bg-gray-50 rounded-2xl outline-none font-bold text-[#04364A] placeholder:text-gray-300 focus:bg-white focus:ring-2 focus:ring-[#64CCC5]/20 transition-all"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                {/* Subcategories Grid */}
                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="h-[400px] bg-white animate-pulse rounded-[2.5rem] border border-gray-100"></div>
                        ))}
                    </div>
                ) : filteredSubs.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredSubs.map(sub => {
                            const imageUrl = getImageUrl(sub.image);
                            return (
                                <Link 
                                    key={sub.id}
                                    to={`/services?category=${encodeURIComponent(sub.name)}&subcategoryId=${sub.id}`}
                                    className="group relative h-[400px] rounded-[2.5rem] flex flex-col cursor-pointer transition-all duration-500 bg-[#F0F9F9] hover:shadow-2xl hover:-translate-y-2 overflow-hidden border border-gray-100"
                                >
                                    <div className="relative w-full h-[250px] overflow-hidden bg-[#E0F2F2] flex items-center justify-center">
                                        {imageUrl ? (
                                            <img 
                                                src={imageUrl} 
                                                alt={sub.name} 
                                                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex flex-col items-center justify-center bg-[#E0F2F2] text-[#176B87] gap-3">
                                                <LayoutGrid size={48} strokeWidth={1.5} />
                                                <span className="text-[10px] font-black uppercase tracking-widest">No Image</span>
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-t from-[#04364A]/20 to-transparent"></div>
                                    </div>
                                    
                                    <div className="flex-1 flex flex-col p-6 items-center text-center justify-center">
                                        <h3 className="text-xl font-black tracking-tight mb-2 text-[#04364A] group-hover:text-[#176B87] transition-colors line-clamp-2">
                                            {sub.name}
                                        </h3>
                                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#64CCC5] opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                                            Explore Services
                                        </p>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white rounded-[3rem] shadow-sm border border-gray-100">
                        <div className="mb-6 inline-flex w-16 h-16 bg-gray-50 rounded-full items-center justify-center text-gray-300">
                            <LayoutGrid size={32} />
                        </div>
                        <h3 className="text-xl font-black text-[#04364A] mb-2">No Subcategories Found</h3>
                        <p className="text-gray-400 font-medium">We couldn't find any subcategories for this category.</p>
                        <Link 
                            to="/categories" 
                            className="mt-8 inline-flex items-center gap-2 text-[#176B87] font-bold hover:gap-3 transition-all"
                        >
                            <ArrowLeft size={16} />
                            Back to Categories
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SubCategories;
