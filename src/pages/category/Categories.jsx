import React, { useState, useEffect } from 'react';
import { Search, Grid, List, ChevronRight,ChevronLeft } from 'lucide-react';
import { API_ENDPOINTS, COMMON_HEADERS } from '@/config/api';
import CategoryCard from '@/components/category/CategoryCard';
import { Link } from 'react-router-dom';
import categoriesBg from '@/assets/categories_bg.png';

const Categories = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [viewMode, setViewMode] = useState('grid');
    const [sortBy, setSortBy] = useState('Default');
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 12;

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [catRes, subRes] = await Promise.all([
                    fetch(API_ENDPOINTS.CATEGORIES, { headers: COMMON_HEADERS }),
                    fetch(API_ENDPOINTS.SUBCATEGORIES, { headers: COMMON_HEADERS })
                ]);
                
                let allCategories = [];
                let allSubcategories = [];

                if (catRes.ok) {
                    const data = await catRes.json();
                    // Handle different possible response structures
                    allCategories = data.categories || data.data || (Array.isArray(data) ? data : []);
                }

                if (subRes.ok) {
                    const data = await subRes.json();
                    allSubcategories = data.subcategories || data.data || (Array.isArray(data) ? data : []);
                }

                // Filter only active categories and subcategories
                const activeCategories = allCategories.filter(cat => cat.status === 'active');
                const activeSubcategories = allSubcategories.filter(sub => sub.status === 'active');

                // Merge subcategories into categories using categoryId
                const enrichedCategories = activeCategories.map(cat => ({
                    ...cat,
                    subcategories: activeSubcategories.filter(sub => 
                        Number(sub.categoryId) === Number(cat.id)
                    )
                }));

                setCategories(enrichedCategories);
            } catch (err) {
                console.error("Categories page failed to load:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const filteredCategories = categories.filter(c => 
        c.name.toLowerCase().includes(searchQuery.toLowerCase())
    ).sort((a, b) => {
        if (sortBy === 'Name: A-Z') return a.name.localeCompare(b.name);
        return a.id - b.id; // Default ID sort
    });

    // Pagination Logic
    const totalPages = Math.ceil(filteredCategories.length / ITEMS_PER_PAGE);
    const paginatedCategories = filteredCategories.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, sortBy]);

    return (
        <div className="bg-gray-50/50 min-h-screen pb-20">
             {/* Header Section */}
             <div className="bg-[#04364A] py-32 px-6 relative overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img src={categoriesBg} alt="background" className="w-full h-full object-cover opacity-15" />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#04364A] via-transparent to-[#04364A]"></div>
                    <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-[#64CCC5]/10 rounded-full blur-[120px] animate-pulse"></div>
                    <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-[#176B87]/20 rounded-full blur-[120px] animate-pulse delay-700"></div>
                    <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-[#64CCC5]/5 rounded-full blur-3xl animate-float"></div>
                </div>
                
                <div className="max-w-7xl mx-auto relative z-10 text-center">
                    <div className="flex flex-col items-center space-y-8">
                        <div className="inline-flex items-center gap-3 text-[#64CCC5] animate-fade-in">
                            <div className="w-10 h-[2px] bg-[#64CCC5]"></div>
                            <span className="text-[11px] font-black uppercase tracking-[0.4em]">Expert Directory</span>
                            <div className="w-10 h-[2px] bg-[#64CCC5]"></div>
                        </div>
                        
                        <div className="space-y-4">
                            <h1 className="text-6xl md:text-8xl font-display font-black text-white tracking-tighter leading-none animate-fade-in delay-100">
                                Explore <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#64CCC5] to-[#DAFFFB]">Categories.</span>
                            </h1>
                            
                            <p className="text-[#DAFFFB]/60 text-xl max-w-2xl mx-auto font-medium leading-relaxed animate-fade-in delay-200">
                                Find the perfect professional for your needs across our specialized service ecosystem.
                            </p>
                        </div>

                        {/* Stats Summary */}
                        {!loading && categories.length > 0 && (
                            <div className="flex items-center justify-center gap-12 mt-4 animate-fade-in delay-300">
                                <div className="text-center group">
                                    <div className="text-4xl font-black text-white group-hover:text-[#64CCC5] transition-colors">{categories.length}</div>
                                    <div className="text-[9px] font-bold uppercase tracking-widest text-[#64CCC5] mt-1 opacity-60">Categories</div>
                                </div>
                                <div className="w-[1px] h-10 bg-white/10"></div>
                                <div className="text-center group">
                                    <div className="text-4xl font-black text-white group-hover:text-[#64CCC5] transition-colors">
                                        {categories.reduce((acc, cat) => acc + (cat.subcategories?.length || 0), 0)}
                                    </div>
                                    <div className="text-[9px] font-bold uppercase tracking-widest text-[#64CCC5] mt-1 opacity-60">Specials</div>
                                </div>
                            </div>
                        )}
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
                            placeholder="Find a category..."
                            className="w-full pl-14 pr-6 py-4 bg-gray-50 rounded-2xl outline-none font-bold text-[#04364A] placeholder:text-gray-300 focus:bg-white focus:ring-2 focus:ring-[#64CCC5]/20 transition-all"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    {/* Simplified sort for categories */}
                    <div className="relative hidden sm:block">
                        <select 
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="appearance-none pl-6 pr-10 py-4 bg-gray-50 rounded-2xl font-black text-[10px] uppercase tracking-widest text-[#04364A] outline-none cursor-pointer hover:bg-gray-100 transition-all"
                        >
                            <option>Default</option>
                            <option>Name: A-Z</option>
                        </select>
                    </div>
                </div>

                {/* Categories Grid */}
                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                            <div key={i} className="h-[460px] bg-white animate-pulse rounded-[2.5rem] border border-gray-100"></div>
                        ))}
                    </div>
                ) : paginatedCategories.length > 0 ? (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {paginatedCategories.map(cat => (
                                <CategoryCard key={cat.id} category={cat} />
                            ))}
                        </div>

                        {/* Pagination UI */}
                        {totalPages > 1 && (
                            <div className="mt-20 flex flex-col items-center space-y-6">
                                <div className="flex items-center gap-4">
                                    <button 
                                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                        disabled={currentPage === 1}
                                        className="w-14 h-14 rounded-2xl border-2 border-gray-100 flex items-center justify-center text-[#04364A] hover:border-[#64CCC5] hover:text-[#64CCC5] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                                    >
                                        <ChevronLeft size={24} />
                                    </button>

                                    <div className="flex items-center gap-2">
                                        {[...Array(totalPages)].map((_, i) => {
                                            const page = i + 1;
                                            if (
                                                page === 1 || 
                                                page === totalPages || 
                                                (page >= currentPage - 1 && page <= currentPage + 1)
                                            ) {
                                                return (
                                                    <button 
                                                        key={page}
                                                        onClick={() => setCurrentPage(page)}
                                                        className={`w-12 h-12 rounded-2xl font-black text-sm transition-all ${
                                                            currentPage === page 
                                                            ? 'bg-[#04364A] text-white shadow-xl scale-110' 
                                                            : 'bg-white border-2 border-gray-100 text-[#04364A] hover:border-[#64CCC5]'
                                                        }`}
                                                    >
                                                        {page}
                                                    </button>
                                                );
                                            } else if (
                                                page === currentPage - 2 || 
                                                page === currentPage + 2
                                            ) {
                                                return <span key={page} className="text-gray-300">...</span>;
                                            }
                                            return null;
                                        })}
                                    </div>

                                    <button 
                                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                        disabled={currentPage === totalPages}
                                        className="w-14 h-14 rounded-2xl border-2 border-gray-100 flex items-center justify-center text-[#04364A] hover:border-[#64CCC5] hover:text-[#64CCC5] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                                    >
                                        <ChevronRight size={24} />
                                    </button>
                                </div>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                    Page {currentPage} of {totalPages}
                                </p>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="text-center py-20">
                        <p className="text-gray-400 font-medium">No categories found matching your search.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Categories;
