import React, { useState, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { API_ENDPOINTS, COMMON_HEADERS } from '@/config/api';

// --- Services Components ---
import ServiceHeader from '@/components/services/ServiceHeader';
import ServiceSearchBar from '@/components/services/ServiceSearchBar';
import ServiceSidebar from '@/components/services/ServiceSidebar';
import ServiceListing from '@/components/services/ServiceListing';

const Services = () => {
    const auth = useSelector((state) => state.auth);
    const location = useLocation();
    
    // --- Data State ---
    const [services, setServices] = useState([]);
    const [categories, setCategories] = useState([]);
    const [providers, setProviders] = useState([]);
    const [loading, setLoading] = useState(true);

    // --- Filter & UI State ---
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [selectedArea, setSelectedArea] = useState('All');
    const [priceRange, setPriceRange] = useState([0, 100000]); // Max 100k
    const [sortBy, setSortBy] = useState('Newest');
    const [viewMode, setViewMode] = useState('grid');
    const [showFilters, setShowFilters] = useState(false);
    
    // --- Store URL Categories for Resolution ---
    const [pendingCategoryName, setPendingCategoryName] = useState(null);

    // --- Pagination State ---
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;

    // 1. Check URL params on mount
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const catParam = params.get('category');
        const searchParam = params.get('search');
        
        if (catParam) setPendingCategoryName(catParam);
        if (searchParam) setSearchQuery(searchParam);
    }, [location.search]);

    // 2. Fetch All Required Data
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // Fetch All Details, Categories, AND Active Providers
                const [servRes, catRes, provRes, subRes] = await Promise.all([
                    fetch(API_ENDPOINTS.SERVICE_ALL_DETAILS, { headers: COMMON_HEADERS }),
                    fetch(API_ENDPOINTS.CATEGORIES, { headers: COMMON_HEADERS }),
                    fetch(API_ENDPOINTS.ACTIVE_PROVIDERS, { headers: COMMON_HEADERS }),
                    fetch(API_ENDPOINTS.SUBCATEGORIES, { headers: COMMON_HEADERS })
                ]);

                // A. Categories
                let fetchedCats = [];
                if (catRes.ok) {
                    const data = await catRes.json();
                    fetchedCats = (data.categories || data || []).filter(c => c.status === 'active');
                    setCategories(fetchedCats);

                    // Resolve pending category name from URL
                    if (pendingCategoryName) {
                        const matched = fetchedCats.find(c => c.name.toLowerCase().trim() === pendingCategoryName.toLowerCase().trim());
                        if (matched) setSelectedCategory(matched.id);
                        setPendingCategoryName(null);
                    }
                }

                // B. Subcategories
                let fetchedSubs = [];
                if (subRes.ok) {
                    const data = await subRes.json();
                    fetchedSubs = (data.subcategories || data || []).filter(s => s.status === 'active');
                    
                    // Also check subcategories for URL match if category didn't match
                    if (pendingCategoryName && selectedCategory === 'All') {
                         const matchedSub = fetchedSubs.find(s => s.name.toLowerCase().trim() === pendingCategoryName.toLowerCase().trim());
                         if (matchedSub) {
                            // Note: We search by subcategory name/ID. 
                            // Since our sidebar doesn't show subcategories yet, we set the selection to this ID
                            setSelectedCategory(matchedSub.id); 
                         }
                    }
                }

                // C. Providers
                let activeProviders = [];
                if (provRes.ok) {
                    const data = await provRes.json();
                    activeProviders = data.providers || data || [];
                    setProviders(activeProviders);
                }

                // D. Parse Services
                if (servRes.ok) {
                    const data = await servRes.json();
                    const rawServices = Array.isArray(data) ? data : (data.services || data.data || []);
                    
                    const mappedServices = rawServices.map(s => {
                        let firstImage = null;
                        try {
                            let rawImages = s.images;
                            if (rawImages) {
                                while (typeof rawImages === 'string' && (rawImages.startsWith('[') || rawImages.startsWith('{') || rawImages.startsWith('"'))) {
                                    try {
                                        const parsed = JSON.parse(rawImages);
                                        rawImages = parsed;
                                    } catch (e) { break; }
                                }
                                if (Array.isArray(rawImages)) firstImage = rawImages[0];
                                else if (typeof rawImages === 'string') firstImage = rawImages.replace(/^["']+|["']+$/g, '');
                            }
                        } catch (e) { console.error("Img error: ", e); }

                        // Enhanced city discovery
                        const city = s.User?.city || s.city || activeProviders.find(p => p.id === s.userid)?.city || 'Unknown';

                        // 1. Resolve Category Info
                        const cid = s.categoryId || s.category_id || (typeof s.category !== 'object' && s.category !== null ? s.category : null);
                        const foundCat = fetchedCats.find(c => String(c.id) === String(cid));
                        
                        let catName = foundCat?.name || 
                                     s.Category?.name || 
                                     (typeof s.category === 'string' ? s.category : s.category?.name) || 
                                     s.categoryName || 
                                     s.category_name || 
                                     'General';

                        // 2. Resolve Subcategory Info
                        const sid = s.subcategoryId || s.subcategory_id || (typeof s.subcategory !== 'object' && s.subcategory !== null ? s.subcategory : null);
                        const foundSub = fetchedSubs.find(sub => String(sub.id) === String(sid));

                        let subName = foundSub?.name || 
                                      s.Subcategory?.name || 
                                      (typeof s.subcategory === 'string' ? s.subcategory : s.subcategory?.name) || 
                                      s.subcategoryName || 
                                      s.subcategory_name || 
                                      '';

                        return {
                            id: s.id,
                            userid: s.userid,
                            providerId: s.userid,
                            name: s.Service_title?.name || s.name || s.description || 'Service',
                            price: s.price || 0,
                            price_Type: s.price_Type || 'Hourly',
                            rating: s.rating || 0,
                            category: catName,
                            categoryId: cid ? String(cid) : null,
                            subcategory: subName,
                            subcategoryId: sid ? String(sid) : null,
                            image: firstImage || s.images,
                            description: s.description,
                            status: s.status,
                            city: city,
                            provider: s.User ? {
                                id: s.userid,
                                name: s.User.name,
                                image: s.User.image,
                                city: s.User.city
                            } : activeProviders.find(p => p.id === s.userid)
                        };
                    });

                    // Update states
                    const activeServices = mappedServices.filter(s => s.status === 'accepted' || s.status === 'active');
                    setServices(activeServices);
                    
                    // Log distribution for debugging
                    const dist = activeServices.reduce((acc, s) => {
                        acc[s.category] = (acc[s.category] || 0) + 1;
                        return acc;
                    }, {});
                    console.log("Services loaded. Distribution:", dist);
                   
                    // If providers wasn't enough, we still have the derived ones
                    if (activeProviders.length === 0) {
                        const uniqueDerived = Array.from(
                            new Map(activeServices.map(s => [s.userid, s.provider])).values()
                        ).filter(Boolean);
                        setProviders(uniqueDerived);
                    }
                }
            } catch (err) {
                console.error("Critical: Marketplace data load failed", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // 4. Derive unique areas from both services and providers for max coverage
    const areas = useMemo(() => {
        const fromServices = services.map(s => s.city);
        const fromProviders = providers.map(p => p.city);
        
        const combined = [...fromServices, ...fromProviders]
            .filter(city => city && city !== 'Unknown' && city !== 'undefined')
            .map(city => city.trim());

        return [...new Set(combined)].sort();
    }, [services, providers]);

    // 5. Reset page when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, selectedCategory, selectedArea, priceRange, sortBy]);

    // 3. Optimized Filtering & Sorting logic
    const filteredServices = useMemo(() => {
        return (services || [])
            .filter(s => {
                const searchStr = `${s.name} ${s.description} ${s.category} ${s.subcategory}`.toLowerCase();
                const matchesQuery = searchStr.includes(searchQuery.toLowerCase());
                
                const sCatId = s.categoryId ? String(s.categoryId) : '';
                const sSubId = s.subcategoryId ? String(s.subcategoryId) : '';
                const selCatId = selectedCategory !== 'All' ? String(selectedCategory) : 'All';
                
                // Match if Category ID is 'All' OR match against categoryId OR subcategoryId
                const matchesCategory = selCatId === 'All' || sCatId === selCatId || sSubId === selCatId;

                const matchesArea = selectedArea === 'All' || 
                    s.city.toLowerCase().trim() === selectedArea.toLowerCase().trim();
                const matchesPrice = (s.price || 0) >= priceRange[0] && (s.price || 0) <= priceRange[1];
                return matchesQuery && matchesCategory && matchesArea && matchesPrice;
            })
            .sort((a, b) => {
                if (sortBy === 'Price: Low to High') return a.price - b.price;
                if (sortBy === 'Price: High to Low') return b.price - a.price;
                if (sortBy === 'Top Rated') return b.rating - a.rating;
                return b.id - a.id; // Newest by default
            });
    }, [services, searchQuery, selectedCategory, selectedArea, priceRange, sortBy]);

    // 6. Pagination Calculation
    const totalPages = Math.ceil(filteredServices.length / itemsPerPage);
    const paginatedServices = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return filteredServices.slice(start, start + itemsPerPage);
    }, [filteredServices, currentPage, itemsPerPage]);

    const resetFilters = () => {
        setSearchQuery('');
        setSelectedCategory('All');
        setSelectedArea('All');
        setPriceRange([0, 100000]);
        setSortBy('Newest');
    };

    return (
        <div className="bg-gray-50/50 min-h-screen pt-24 pb-20">
            <ServiceHeader servicesCount={services.length} />
            
            <ServiceSearchBar 
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                categories={categories}
                showFilters={showFilters}
                setShowFilters={setShowFilters}
            />

            <main className="max-w-7xl mx-auto px-6 py-20 flex flex-col lg:flex-row gap-12">
                <ServiceSidebar 
                    categories={categories}
                    selectedCategory={selectedCategory}
                    setSelectedCategory={setSelectedCategory}
                    areas={areas}
                    selectedArea={selectedArea}
                    setSelectedArea={setSelectedArea}
                    priceRange={priceRange}
                    setPriceRange={setPriceRange}
                    showFilters={showFilters}
                />

                <ServiceListing 
                    filteredServices={paginatedServices}
                    totalResults={filteredServices.length}
                    loading={loading}
                    viewMode={viewMode}
                    setViewMode={setViewMode}
                    sortBy={sortBy}
                    setSortBy={setSortBy}
                    selectedCategory={selectedCategory}
                    providers={providers}
                    auth={auth}
                    resetFilters={resetFilters}
                    currentPage={currentPage}
                    totalPages={totalPages}
                    setCurrentPage={setCurrentPage}
                />
            </main>
        </div>
    );
};

export default Services;
