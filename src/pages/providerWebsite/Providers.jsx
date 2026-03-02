import React, { useState, useEffect, useMemo } from 'react';
import { 
    Search, MapPin, Filter, Loader2, User, Zap, 
    ArrowLeft, ArrowRight, ChevronLeft, ChevronRight,
    Star, SortAsc, TrendingUp, Calendar
} from 'lucide-react';
import { API_ENDPOINTS, COMMON_HEADERS, UPLOAD_URL } from '@/config/api';
import ProviderCard from '@/components/providerWebsite/ProviderCard';
import { Link } from 'react-router-dom';

const ITEMS_PER_PAGE = 9;

const Providers = () => {
    const [providers, setProviders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterCity, setFilterCity] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState('rating'); // 'rating', 'name', 'newest'
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        fetchProviders();
        window.scrollTo(0, 0);
    }, []);

    const fetchProviders = async () => {
        setLoading(true);
        try {
            const [pRes, sRes, cRes] = await Promise.all([
                fetch(API_ENDPOINTS.ACTIVE_PROVIDERS, { headers: COMMON_HEADERS }),
                fetch(API_ENDPOINTS.SERVICES, { headers: COMMON_HEADERS }),
                fetch(API_ENDPOINTS.CATEGORIES, { headers: COMMON_HEADERS })
            ]);

            if (pRes.ok) {
                const pData = await pRes.json();
                const sData = sRes.ok ? await sRes.json() : [];
                const cData = cRes.ok ? await cRes.json() : [];

                const providerList = pData.providers || pData || [];
                const allServices = Array.isArray(sData.services) ? sData.services : (Array.isArray(sData) ? sData : []);
                const allCategories = Array.isArray(cData) ? cData : [];

                const categories = allCategories.filter(cat => cat.status === 'active');
                const services = allServices.filter(s => s.status === 'active');

                const categoryMap = categories.reduce((acc, cat) => {
                    acc[cat.id] = cat.name;
                    return acc;
                }, {});

                const enrichedProviders = providerList.map(p => {
                    const providerServices = services.filter(s => Number(s.userid) === Number(p.id));
                    const mainCategoryId = providerServices[0]?.categoryId;
                    const specialty = categoryMap[mainCategoryId] || (providerServices.length > 0 ? "Service Provider" : null);
                    
                    return {
                        ...p,
                        specialty,
                        servicesCount: providerServices.length,
                        rating: Number(p.rating || 0),
                        points: Number(p.points || 0)
                    };
                });

                setProviders(Array.isArray(enrichedProviders) ? enrichedProviders : []);
            }
        } catch (error) {
            console.error('Error fetching providers:', error);
        } finally {
            setLoading(false);
        }
    };

    

    // Filter and Sort Logic
    const processedProviders = useMemo(() => {
        let result = providers.filter(p => {
            const query = searchQuery.toLowerCase();
            const matchesSearch = (
                (p.name || '').toLowerCase().includes(query) || 
                (p.city || '').toLowerCase().includes(query) ||
                (p.specialty || '').toLowerCase().includes(query)
            );
            const matchesCity = filterCity ? (p.city || '').toLowerCase() === filterCity.toLowerCase() : true;
            return matchesSearch && matchesCity;
        });

        // Sorting
        result.sort((a, b) => {
            if (sortBy === 'rating') return b.rating - a.rating;
            if (sortBy === 'name') return (a.name || '').localeCompare(b.name || '');
            if (sortBy === 'newest') return b.id - a.id; 
            return 0;
        });

        return result;
    }, [providers, searchQuery, filterCity, sortBy]);

    // Pagination Logic
    const totalPages = Math.ceil(processedProviders.length / ITEMS_PER_PAGE);
    const paginatedProviders = processedProviders.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, filterCity, sortBy]);

    const cities = [...new Set(providers.map(p => p.city).filter(Boolean))];

    return (
        <div className="bg-gray-50/50 min-h-screen pb-20">
             {/* Header Section */}
             <div className="bg-[#04364A] py-28 px-6 relative overflow-hidden">
                <div className="absolute inset-0">
                    <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-[#64CCC5]/10 rounded-full blur-[120px]"></div>
                    <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-[#176B87]/10 rounded-full blur-[120px]"></div>
                </div>
                
                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="flex flex-col items-center text-center space-y-6">
                        <Link 
                            to="/" 
                            className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-[#64CCC5] hover:text-white transition-colors"
                        >
                            <ArrowLeft size={14} /> Back to Home
                        </Link>
                        
                        <h1 className="text-5xl md:text-7xl font-black text-white tracking-tight">
                            Expert <span className="text-[#64CCC5]">Providers</span>
                        </h1>
                        
                        <p className="text-[#DAFFFB]/60 text-lg max-w-2xl font-medium leading-relaxed">
                            Browse through our verified network of professionals ready to help you with your next project.
                        </p>
                    </div>
                </div>
            </div>

            {/* Content Container */}
            <div className="max-w-7xl mx-auto px-6 -mt-16 relative z-20">
                {/* Search & Filter Bar */}
                <div className="bg-white p-6 rounded-[2.5rem] shadow-2xl shadow-[#04364A]/10 border border-gray-100 mb-12">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                        {/* Search Input */}
                        <div className="lg:col-span-5 relative">
                            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" size={20} />
                            <input 
                                type="text" 
                                placeholder="Search by name, specialty..." 
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-14 pr-6 py-4 bg-gray-50 rounded-2xl outline-none font-bold text-[#04364A] placeholder:text-gray-300 focus:bg-white focus:ring-2 focus:ring-[#64CCC5]/20 transition-all border border-transparent focus:border-[#64CCC5]/30"
                            />
                        </div>
                        
                        {/* City Filter */}
                        <div className="lg:col-span-3 relative">
                            <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" size={20} />
                            <select 
                                value={filterCity}
                                onChange={(e) => setFilterCity(e.target.value)}
                                className="w-full pl-14 pr-10 py-4 bg-gray-50 rounded-2xl border border-transparent outline-none font-bold text-[#04364A] appearance-none cursor-pointer hover:bg-gray-100 transition-all focus:bg-white focus:border-[#64CCC5]/30 focus:ring-2 focus:ring-[#64CCC5]/20"
                            >
                                <option value="">All Regions</option>
                                {cities.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                            <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none">
                                <Filter size={16} className="text-gray-300" />
                            </div>
                        </div>

                        {/* Sorting */}
                        <div className="lg:col-span-3 relative">
                            <TrendingUp className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" size={20} />
                            <select 
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="w-full pl-14 pr-10 py-4 bg-gray-50 rounded-2xl border border-transparent outline-none font-bold text-[#04364A] appearance-none cursor-pointer hover:bg-gray-100 transition-all focus:bg-white focus:border-[#64CCC5]/30 focus:ring-2 focus:ring-[#64CCC5]/20"
                            >
                                <option value="rating">Top Rated</option>
                                <option value="name">Name (A-Z)</option>
                                <option value="newest">Newest First</option>
                            </select>
                            <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none">
                                <SortAsc size={16} className="text-gray-300" />
                            </div>
                        </div>

                        {/* Reset Toggle */}
                        <div className="lg:col-span-1 flex justify-center">
                            <button 
                                onClick={() => {setSearchQuery(''); setFilterCity(''); setSortBy('rating');}}
                                className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-[#04364A] hover:bg-[#64CCC5] hover:text-white transition-all shadow-sm"
                                title="Reset Filters"
                            >
                                <Zap size={20} fill="currentColor" className="opacity-50" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Results Header */}
                <div className="flex items-center justify-between mb-8 px-4">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
                        Showing <span className="text-[#04364A]">{processedProviders.length}</span> Professionals
                    </p>
                    {processedProviders.length > 0 && (
                        <div className="flex items-center gap-2">
                        
                           
                        </div>
                    )}
                </div>

                {loading ? (
                    <div className="flex flex-col justify-center items-center py-32 space-y-6">
                        <div className="relative">
                            <div className="w-20 h-20 border-4 border-[#64CCC5]/20 border-t-[#64CCC5] rounded-full animate-spin"></div>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <User size={24} className="text-[#64CCC5]" />
                            </div>
                        </div>
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#04364A]">Syncing Network...</p>
                    </div>
                ) : paginatedProviders.length > 0 ? (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {paginatedProviders.map((provider) => (
                                <ProviderCard 
                                    key={provider.id} 
                                    provider={provider} 
                                />
                            ))}
                        </div>

                        {/* Advanced Pagination */}
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
                                            // Show only first, last, and pages around current
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
                    <div className="text-center py-32 bg-white rounded-[4rem] border-4 border-dashed border-gray-50">
                        <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-8 text-gray-200">
                            <Search size={48} />
                        </div>
                        <h2 className="text-3xl font-black text-[#04364A] uppercase tracking-tight mb-4">No Connections Found</h2>
                        <p className="text-gray-400 font-medium mb-10 max-w-sm mx-auto">We couldn't find any providers matching your current search or filter criteria.</p>
                        <button 
                            onClick={() => {setSearchQuery(''); setFilterCity(''); setSortBy('rating');}}
                            className="px-10 py-4 bg-[#04364A] text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-[#176B87] shadow-xl transition-all active:scale-95"
                        >Clear Search Filters</button>
                    </div>
                )}
            </div>
   
        </div>
    );
};

export default Providers;

