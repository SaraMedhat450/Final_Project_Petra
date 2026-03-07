import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Search, ArrowLeft, LayoutGrid, Star, Sparkles } from 'lucide-react';
import { API_ENDPOINTS, COMMON_HEADERS, UPLOAD_URL } from '@/config/api';
import subcategoriesBg from '@/assets/subcategories_bg.png';

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
        <div className="bg-gray-50/50 min-h-screen pb-20">
            {/* Header Section */}
            <div className="bg-[#04364A] py-32 px-6 relative overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img src={subcategoriesBg} alt="background" className="w-full h-full object-cover opacity-20" />
                    <div className="absolute inset-0 bg-gradient-to-b from-[#04364A] via-transparent to-[#04364A]/80"></div>
                    <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-[#64CCC5]/10 rounded-full blur-[120px] animate-pulse"></div>
                    <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-[#176B87]/20 rounded-full blur-[120px] animate-pulse delay-700"></div>
                </div>
                
                <div className="max-w-7xl mx-auto relative z-10 text-center">
                    <Link 
                        to="/categories" 
                        className="inline-flex items-center gap-3 text-[#64CCC5] mb-12 hover:text-white transition-all group animate-fade-in"
                    >
                        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                        <span className="text-[10px] font-black uppercase tracking-[0.4em]">Back to Categories</span>
                    </Link>
                    
                    <div className="space-y-6">
                        <div className="flex items-center justify-center gap-3 text-[#64CCC5] animate-fade-in delay-100">
                            <div className="w-10 h-[2px] bg-[#64CCC5]"></div>
                            <span className="text-[11px] font-black uppercase tracking-[0.4em] flex items-center gap-2">
                                <Sparkles size={14} /> {categoryName || 'Market'} Specialized
                            </span>
                            <div className="w-10 h-[2px] bg-[#64CCC5]"></div>
                        </div>

                        <h1 className="text-6xl md:text-8xl font-display font-black text-white tracking-tighter leading-none animate-fade-in delay-200">
                            {categoryName || 'Sub'} <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#64CCC5] to-[#DAFFFB]">Categories.</span>
                        </h1>
                        
                        <p className="text-[#DAFFFB]/60 text-xl max-w-2xl mx-auto font-medium leading-relaxed animate-fade-in delay-300">
                            Explore specialized services tailored within {categoryName || 'our universe'}. 
                        </p>
                    </div>
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
                                    className="group relative h-[480px] rounded-[3.5rem] flex flex-col cursor-pointer transition-all duration-500 bg-white hover:shadow-2xl hover:-translate-y-3 overflow-hidden border border-gray-100 shadow-sm"
                                >
                                    {/* Jumbo Image Section */}
                                    <div className="relative w-full h-[240px] overflow-hidden bg-[#F0F9F9] flex items-center justify-center">
                                        {imageUrl ? (
                                            <img 
                                                src={imageUrl} 
                                                alt={sub.name} 
                                                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex flex-col items-center justify-center text-[#176B87]">
                                                <LayoutGrid size={48} strokeWidth={1} />
                                            </div>
                                        )}
                                        
                        
                                    </div>
                                    
                                    {/* Detailed Content Area */}
                                    <div className="flex-1 flex flex-col p-8 items-center text-center bg-[#F0F9F9]">
                                        <h3 className="text-2xl font-black tracking-tighter mb-3 text-[#04364A] group-hover:text-[#176B87] transition-all line-clamp-1 hover:scale-105 transform origin-center">
                                            {sub.name}
                                        </h3>
                                        
                                        {/* Dynamic Description */}
                                        <div className="mb-6 h-[60px] flex items-center justify-center px-2">
                                            <p className="text-gray-400 text-xs font-medium leading-relaxed line-clamp-2">
                                                {sub.description || `Discover high-quality ${sub.name.toLowerCase()} services and top-rated professionals.`}
                                            </p>
                                        </div>

                                       
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
