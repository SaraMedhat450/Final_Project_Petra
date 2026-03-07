import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ArrowRight, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';
import { API_ENDPOINTS, COMMON_HEADERS } from '../../config/api';

// --- Home Components ---
import Hero from '../../components/home/Hero';
import HomeCategories from '../../components/home/HomeCategories';
import ServiceList from '../../components/home/ServiceList';
import TopProviders from '../../components/home/TopProviders';
import HowItWorks from '../../components/home/HowItWorks';
import WhyChooseUs from '../../components/home/WhyChooseUs';


const Home = () => {
  // 1. Get Auth State from Redux
  const auth = useSelector((state) => state.auth);
  
  // 2. Data State
  const [categories, setCategories] = useState([]);
  const [services, setServices] = useState([]);
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState(['All']);

  // 3. Load Data
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      
      let fetchedCats = [];
      let fetchedServices = [];
      
      try {
        // Fetch Categories & All Service Details & Providers
        const [catRes, serveRes, provRes] = await Promise.all([
          fetch(API_ENDPOINTS.CATEGORIES, { headers: COMMON_HEADERS }),
          fetch(API_ENDPOINTS.SERVICE_ALL_DETAILS, { headers: COMMON_HEADERS }),
          fetch(API_ENDPOINTS.ACTIVE_PROVIDERS, { headers: COMMON_HEADERS })
        ]);
        
        // A. Process Categories
        if (catRes.ok) {
          const data = await catRes.json();
          const allCats = data.categories || data || [];
          fetchedCats = allCats.filter(cat => cat.status === 'active');
          setCategories(fetchedCats);
        }

        // B. Process Services with All Details
        if (serveRes.ok) {
            const data = await serveRes.json();
            const rawServices = Array.isArray(data) ? data : (data.services || data.data || []);
            
            fetchedServices = rawServices.map(s => {
                let firstImage = null;
                try {
                    let raw = s.images;
                    if (raw) {
                        while (typeof raw === 'string' && (raw.startsWith('[') || raw.startsWith('{') || raw.startsWith('"'))) {
                            try {
                                const parsed = JSON.parse(raw);
                                raw = parsed;
                            } catch (e) { break; }
                        }
                        if (Array.isArray(raw)) firstImage = raw[0];
                        else if (typeof raw === 'string') firstImage = raw.replace(/^["']+|["']+$/g, '');
                    }
                } catch (e) { console.error("Img error: ", e); }

                return {
                    id: s.id,
                    userid: s.userid,
                    providerId: s.userid,
                    name: s.Service_title?.name || s.name || s.description || 'Service',
                    price: s.price || 0,
                    price_Type: s.price_Type || 'Hourly',
                    maxPrice: s.max_price,
                    description: s.description,
                    rating: s.rating || 0,
                    category: s.Category?.name || 'General',
                    image: firstImage || s.images, 
                    status: s.status,
                    city: s.User?.city || 'Unknown'
                };
            }).filter(s => s.status === 'accepted' || s.status === 'active');
            setServices(fetchedServices);
        }

        // C. Process Providers
        if (provRes.ok) {
            const data = await provRes.json();
            const providersList = data.providers || data || [];
            
            const fetchedProviders = (Array.isArray(providersList) ? providersList : [])
                .map(p => {
                    const myServices = fetchedServices.filter(s => Number(s.userid) === Number(p.id));
                    const myCategories = [...new Set(myServices.map(s => s.category))];
                    
                    let roleDisplay = 'New Provider';
                    if (myCategories.length > 0) {
                        roleDisplay = myCategories.slice(0, 2).join(' & ');
                        if (myCategories.length > 2) roleDisplay += '...';
                    } else {
                        roleDisplay = p.role === 'provider' ? 'Service Provider' : (p.role || 'Service Pro');
                    }

                    return {
                        id: p.id,
                        name: p.name || 'Professional',
                        email: p.email,
                        phone: p.phone,
                        service: myCategories.length > 0 ? roleDisplay : null,
                        rating: p.rating || 0,
                        status: p.status,
                        city: p.city,
                        image: p.image && p.image !== 'profile.jpg' ? p.image : null
                    };
                });
            setProviders(fetchedProviders);
        }
        
      } catch (err) {
        console.error("Home API failed:", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
    
  }, []);

  // Welcome Toast
  useEffect(() => {
    const timer = setTimeout(() => {
      toast.success("Welcome to Servio!", {
        duration: 3000,
        position: 'bottom-right',
      });
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  // 4. Handle Multi-select Toggle
  const handleCategorySelect = (categoryName) => {
    setSelectedCategories(prev => {
      if (categoryName === 'All') return ['All'];
      
      const withoutAll = prev.filter(c => c !== 'All');
      
      if (withoutAll.includes(categoryName)) {
        // Toggle off: Remove if already selected
        const updated = withoutAll.filter(c => c !== categoryName);
        return updated.length === 0 ? ['All'] : updated;
      } else {
        // Toggle on: Add to selection
        return [...withoutAll, categoryName];
      }
    });
  };

  // 5. Filter Logic
  const filteredServices = React.useMemo(() => {
    return services.filter(s => {
      if (!s) return false;
      const sName = String(s.name || s.description || "");
      const matchesSearch = sName.toLowerCase().includes((searchQuery || "").toLowerCase());
      
      const matchesCategory = selectedCategories.includes('All') || 
                              selectedCategories.includes(s.category);
                              
      return matchesSearch && matchesCategory;
    });
  }, [services, searchQuery, selectedCategories]);

  return (
    <div className="bg-gray-50/50 min-h-screen font-sans selection:bg-[#64CCC5] selection:text-white relative overflow-hidden">
      {/* Dynamic Background Blobs */}
      <div className="absolute top-[5%] -left-64 w-[800px] h-[800px] bg-[#64CCC5]/10 rounded-full blur-[160px] pointer-events-none animate-pulse"></div>
      <div className="absolute top-[35%] -right-64 w-[1000px] h-[1000px] bg-[#176B87]/5 rounded-full blur-[200px] pointer-events-none animate-pulse"></div>
      <div className="absolute bottom-[5%] left-1/2 -translate-x-1/2 w-[1200px] h-[1200px] bg-[#04364A]/5 rounded-full blur-[220px] pointer-events-none"></div>

      {/* Hero Section - The Grand Entrance */}
      <Hero 
        services={services}
        searchQuery={searchQuery} 
        setSearchQuery={setSearchQuery} 
      />

      {/* Main Content Area */}
      <main className="divide-y divide-gray-100">
        
        {/* Categories Section */}
        <HomeCategories 
            categories={categories} 
            loading={loading} 
            selectedCategories={selectedCategories}
            onSelectCategory={handleCategorySelect}
        />

        {/* How It Works Section */}
        <HowItWorks />

        {/* Services Section */}
        <section className="py-24 bg-gray-50/80">
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex items-center justify-between mb-16 px-2">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3 text-[#64CCC5] animate-fade-in">
                            <div className="w-12 h-[22px] rounded-full bg-[#64CCC5]/10 flex items-center justify-center">
                                <Sparkles size={12} strokeWidth={3} />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-[0.4em]">Recommended for you</span>
                        </div>
                        <h3 className="text-5xl md:text-6xl font-black text-[#04364A] tracking-tighter leading-none">
                            Discover <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#176B87] to-[#04364A]">Services.</span>
                        </h3>
                    </div>
                    
                    <Link 
                        to="/services"
                        className="group flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-[#04364A] hover:text-[#04364A] transition-all"
                    >
                        See All
                        <div className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center group-hover:bg-[#04364A] group-hover:text-white transition-all">
                            <ArrowRight size={14} />
                        </div>
                    </Link>
                </div>
                
                <ServiceList 
                    services={filteredServices} 
                    providers={providers}
                    loading={loading} 
                    auth={auth} 
                />
            </div>
        </section>

        {/* Why Choose Us Section */}
        <WhyChooseUs />

        {/* Top Providers Section */}
        <section className="py-24 bg-white">
           <div className="max-w-7xl mx-auto px-6">
              <TopProviders providers={providers} loading={loading} />
           </div>
        </section>
      </main>
    </div>
  );
};

export default Home;
