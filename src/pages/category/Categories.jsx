import React, { useState, useEffect } from 'react';
import { Search, Grid, List } from 'lucide-react';
import { API_ENDPOINTS, COMMON_HEADERS } from '@/config/api';
import CategoryCard from '@/components/category/CategoryCard';
import { Link } from 'react-router-dom';

const Categories = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [viewMode, setViewMode] = useState('grid');
    const [sortBy, setSortBy] = useState('Default');

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

    return (
        <div className="bg-gray-50/50 min-h-screen pt-24 pb-20">
             {/* Header Section */}
             <div className="bg-[#04364A] py-20 px-6 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-[#64CCC5] rounded-full blur-[100px]"></div>
                    <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#176B87] rounded-full blur-[100px]"></div>
                </div>
                
                <div className="max-w-7xl mx-auto relative z-10 text-center">
                    <div className="inline-flex items-center gap-2 text-[#64CCC5] mb-4">
                        <div className="w-10 h-[2px] bg-[#64CCC5]"></div>
                        <span className="text-[10px] font-black uppercase tracking-[0.3em]">Directory</span>
                        <div className="w-10 h-[2px] bg-[#64CCC5]"></div>
                    </div>
                    
                    <h1 className="text-5xl md:text-7xl font-display font-black text-white tracking-tight mb-8">
                        Explore <span className="text-[#64CCC5]">Categories</span>
                    </h1>
                    
                    <p className="text-[#DAFFFB]/60 text-lg max-w-2xl mx-auto font-medium leading-relaxed mb-8">
                        Find the perfect professional for your needs across our specialized service categories.
                    </p>

                    {/* Stats Summary */}
                    {!loading && categories.length > 0 && (
                        <div className="flex items-center justify-center gap-8 mt-8">
                            <div className="text-center">
                                <div className="text-3xl font-black text-white">{categories.length}</div>
                                <div className="text-[10px] font-bold uppercase tracking-widest text-[#64CCC5]">Categories</div>
                            </div>
                            <div className="w-[1px] h-8 bg-white/10"></div>
                            <div className="text-center">
                                <div className="text-3xl font-black text-white">
                                    {categories.reduce((acc, cat) => acc + (cat.subcategories?.length || 0), 0)}
                                </div>
                                <div className="text-[10px] font-bold uppercase tracking-widest text-[#64CCC5]">Subcategories</div>
                            </div>
                        </div>
                    )}
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
                ) : filteredCategories.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredCategories.map(cat => (
                            <CategoryCard key={cat.id} category={cat} />
                        ))}
                    </div>
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
