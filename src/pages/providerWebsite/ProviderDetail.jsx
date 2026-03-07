import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { API_ENDPOINTS, COMMON_HEADERS, UPLOAD_URL } from '@/config/api';

import ProviderProfileCard from '@/components/providerWebsite/ProviderProfileCard';
import ProviderOfferings from '@/components/providerWebsite/ProviderOfferings';
import ProviderInfoTab from '@/components/providerWebsite/ProviderInfoTab';
import ProviderAvailability from '@/components/providerWebsite/ProviderAvailability';



const ProviderDetail = () => {
    const { id } = useParams();
    const [provider, setProvider]     = useState(null);
    const [services, setServices]     = useState([]);
    const [availability, setAvailability] = useState([]);
    const [loading, setLoading]       = useState(true);
    const [activeTab, setActiveTab]   = useState('services');
    const [priceRange, setPriceRange] = useState([0, 10000]);

    useEffect(() => {
        const fetchProviderData = async () => {
            setLoading(true);
            let provData = null;

            // ── STRATEGY A: Find provider in the active-providers list ────────
            // This is the most reliable source because the API is confirmed to work
            try {
                const r = await fetch(API_ENDPOINTS.ACTIVE_PROVIDERS, { headers: COMMON_HEADERS });
                if (r.ok) {
                    const d = await r.json();
                    // API returns { providers: [...], Count: N }
                    const list = d.providers || d.data || (Array.isArray(d) ? d : []);
                    const found = list.find(p =>
                        String(p.id) === String(id) ||
                        String(p.userid) === String(id)
                    );
                    if (found) {
                        // All fields (city, address, phone, email) are FLAT on the provider object
                        provData = { ...found };
                    }
                }
            } catch (e) { console.warn('[StrategyA] Active providers list fetch failed', e); }

            // ── STRATEGY B: Try the direct provider endpoint ───────────────────
            if (!provData) {
                try {
                    const r = await fetch(API_ENDPOINTS.PROVIDER_DETAILS(id), { headers: COMMON_HEADERS });
                    if (r.ok) {
                        const d = await r.json();
                        const raw = d.provider || d.data || (d.id ? d : null);
                        if (raw) provData = { ...raw, ...(raw.User || raw.user || {}) };
                    }
                } catch (e) { console.warn('[StrategyB] Direct provider fetch failed', e); }
            }

            // ── STRATEGY C: Extract provider info from services ───────────────
            // /service/provider/:id has a `User` object on each service
            let rawServices = [];
            try {
                const r = await fetch(API_ENDPOINTS.PROVIDER_SERVICES(id), { headers: COMMON_HEADERS });
                if (r.ok) {
                    const d = await r.json();
                    rawServices = Array.isArray(d) ? d : (d.services || d.data || []);

                    if (!provData && rawServices.length > 0) {
                        // Service's User object is our fallback location source
                        const svc = rawServices[0];
                        const u = svc.User || svc.user || {};
                        provData = {
                            id: svc.userid || id,
                            name:        u.name        || u.Name        || '',
                            email:       u.email       || u.Email       || '',
                            phone:       u.phone       || u.Phone       || '',
                            city:        u.city        || u.City        || '',
                            address:     u.address     || u.Address     || '',
                            image:       u.image       || u.Image       || u.avatar || '',
                            description: u.description || u.Description || '',
                            status:      u.status      || 'active',
                            rating:      u.rating      || 0,
                            createdAt:   u.createdAt   || null,
                        };
                    } else if (provData && rawServices.length > 0) {
                        // Patch any missing location from Service.User
                        const u = rawServices[0].User || rawServices[0].user || {};
                        provData = {
                            ...provData,
                            city:        provData.city        || u.city        || u.City    || '',
                            address:     provData.address     || u.address     || u.Address || '',
                            phone:       provData.phone       || u.phone       || u.Phone   || '',
                            image:       provData.image       || u.image       || u.avatar  || '',
                            description: provData.description || u.description || '',
                        };
                    }

                    // Extract availability
                    const withAvail = rawServices.find(s =>
                        s.Provider_availabilities && s.Provider_availabilities.length > 0
                    );
                    if (withAvail) setAvailability(withAvail.Provider_availabilities);

                    // Process services for rendering
                    const processed = rawServices.map(s => {
                        let firstImage = null;
                        try {
                            if (s.images) {
                                let raw = s.images;
                                while (typeof raw === 'string' && (raw.startsWith('[') || raw.startsWith('"'))) {
                                    try { const p = JSON.parse(raw); if (p === raw) break; raw = p; } catch { break; }
                                }
                                firstImage = Array.isArray(raw)
                                    ? raw[0]
                                    : String(raw).replace(/^["']+|["']+$/g, '').trim();
                            }
                        } catch {}
                        return {
                            ...s,
                            service_name:  s.Service_title?.name || s.name || 'Professional Service',
                            category_name: s.Category?.name       || 'Service',
                            firstImage:    firstImage || null,
                        };
                    });
                    setServices(processed);
                }
            } catch (e) { console.warn('[StrategyC] Services fetch failed', e); }

            if (provData) setProvider(provData);
            else setProvider(null);

            setLoading(false);
        };

        fetchProviderData();
    }, [id]);

    const getImageSrc = (img) => {
        if (!img || img === 'profile.jpg' || img === '00' || img === 'undefined' || img === 'null') return null;
        if (typeof img !== 'string') return null;
        if (img.startsWith('http')) return img;
        const clean = img.replace(/["'[\]\\]/g, '').trim();
        if (!clean) return null;
        return `${UPLOAD_URL}/${clean}`;
    };

    if (loading) {
        return (
            <div className="min-h-screen pt-24 flex items-center justify-center bg-gray-50/50">
                <div className="text-center space-y-4">
                    <div className="w-16 h-16 border-4 border-[#64CCC5] border-t-transparent rounded-full animate-spin mx-auto"></div>
                    <p className="text-[#04364A] font-black uppercase tracking-widest text-[10px]">Loading Profile...</p>
                </div>
            </div>
        );
    }

    if (!provider) {
        return (
            <div className="min-h-screen pt-32 text-center bg-gray-50/50">
                <h2 className="text-2xl font-black text-[#04364A]">Provider not found</h2>
                <Link to="/providers" className="text-[#64CCC5] font-bold mt-4 inline-block">← Back to Providers</Link>
            </div>
        );
    }


    return (
        <div className="bg-gray-50/50 min-h-screen pb-20">
            <div className="max-w-7xl mx-auto px-6 pt-24 pb-6">
                <Link to="/providers" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#176B87] hover:text-[#04364A] transition-colors group">
                    <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                    Back to providers
                </Link>
            </div>

            <main className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                {/* ── Sidebar ─────────────────────────────────────────────────── */}
                <aside className="lg:col-span-4 space-y-6 sticky top-28 self-start">
                    <ProviderProfileCard
                        provider={provider}
                        servicesCount={services.length}
                        getImageSrc={getImageSrc}
                        minPrice={services.length > 0 ? Math.min(...services.map(s => Number(s.price) || 0)) : null}
                    />
                    <ProviderAvailability availability={availability} />

                    {/* Price Range Slider */}
                    <div className="bg-white rounded-[2rem] p-4 shadow-sm border border-gray-100">
                        <div className="space-y-2">
                            <div className="flex justify-between items-end">
                                <p className="text-[10px] font-black text-[#04364A] uppercase tracking-widest">Price Range</p>
                                <span className="text-[9px] font-bold text-[#64CCC5]">{priceRange[0]} – {priceRange[1]} LE</span>
                            </div>
                            <input
                                type="range"
                                min="0"
                                max="10000"
                                step="50"
                                value={priceRange[1]}
                                onChange={e => setPriceRange([0, parseInt(e.target.value)])}
                                className="w-full h-1 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-[#64CCC5]"
                            />
                            <div className="flex justify-between text-[7px] font-black text-gray-300 uppercase tracking-widest">
                                <span>0 LE</span>
                                <span>10k LE</span>
                            </div>
                        </div>
                    </div>

                   
                </aside>

                {/* ── Main Content ──────────────────────────────────────────── */}
                <section className="lg:col-span-8 space-y-12">
                    <div className="space-y-8">
                        {/* Tabs */}
                        <div className="flex gap-10 border-b border-gray-100">
                            {[
                                { id: 'services', label: 'Offerings' },
                                { id: 'about',    label: 'Company Info' },
                            ].map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`pb-4 text-[10px] font-black uppercase tracking-[0.2em] transition-all relative ${
                                        activeTab === tab.id ? 'text-[#04364A]' : 'text-gray-400 hover:text-gray-600'
                                    }`}
                                >
                                    {tab.label}
                                    {activeTab === tab.id && (
                                        <div className="absolute bottom-0 left-0 w-full h-1 bg-[#64CCC5] rounded-full" />
                                    )}
                                </button>
                            ))}
                        </div>

                        {activeTab === 'services' && (
                            <ProviderOfferings
                                services={services.filter(s => (Number(s.price) || 0) >= priceRange[0] && (Number(s.price) || 0) <= priceRange[1])}
                                getImageSrc={getImageSrc}
                            />
                        )}
                        {activeTab === 'about' && (
                            <ProviderInfoTab provider={provider} availability={availability} />
                        )}
                    </div>
                </section>
            </main>
        </div>
    );
};

export default ProviderDetail;
