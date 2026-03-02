import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { API_ENDPOINTS, COMMON_HEADERS, UPLOAD_URL } from '@/config/api';

// Extracted Components
import ProviderProfileCard from '@/components/providerWebsite/ProviderProfileCard';
import ProviderOfferings from '@/components/providerWebsite/ProviderOfferings';
import ProviderInfoTab from '@/components/providerWebsite/ProviderInfoTab';
import ProviderReviewsTab from '@/components/providerWebsite/ProviderReviewsTab';

const ProviderDetail = () => {
    const { id } = useParams();
    const [provider, setProvider] = useState(null);
    const [services, setServices] = useState([]);
    const [availability, setAvailability] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('services');

    useEffect(() => {
        const fetchProviderData = async () => {
            setLoading(true);
            try {
                // 1. Fetch main provider details
                const pResponse = await fetch(API_ENDPOINTS.PROVIDER_DETAILS(id), {
                    headers: COMMON_HEADERS
                });
                
                let provData = null;
                if (pResponse.ok) {
                    const data = await pResponse.json();
                    provData = data.provider || (data.id ? data : null);
                }

                // 2. Fetch enriched services for this provider
                const sResponse = await fetch(API_ENDPOINTS.PROVIDER_SERVICES(id), {
                    headers: COMMON_HEADERS
                });

                if (sResponse.ok) {
                    const rawServices = await sResponse.json();
                    
                    // If we couldn't get provider data from P1, try to extract it from the first service (User object)
                    if (!provData && rawServices.length > 0 && rawServices[0].User) {
                        provData = {
                            ...rawServices[0].User,
                            id: rawServices[0].userid
                        };
                    }

                    if (provData) setProvider(provData);

                    // Extract availability from the first service that has it
                    const firstWithAvail = rawServices.find(s => s.Provider_availabilities && s.Provider_availabilities.length > 0);
                    if (firstWithAvail) {
                        setAvailability(firstWithAvail.Provider_availabilities);
                    }

                    // Process services with images and titles
                    const processedServices = rawServices.map(s => {
                        let firstImage = null;
                        try {
                            if (s.images) {
                                let raw = s.images;
                                while (typeof raw === 'string' && (raw.startsWith('[') || raw.startsWith('{') || raw.startsWith('"'))) {
                                    try { 
                                        const parsed = JSON.parse(raw);
                                        if (parsed === raw) break; 
                                        raw = parsed;
                                    } catch (e) { break; }
                                }
                                if (Array.isArray(raw)) firstImage = raw[0];
                                else if (typeof raw === 'string') firstImage = raw.replace(/^["']+|["']+$/g, '').replace(/\\"/g, '"').trim();
                            }
                        } catch (e) {}

                        return {
                            ...s,
                            service_name: s.Service_title?.name || s.name || "Professional Service",
                            category_name: s.Category?.name || "Service",
                            firstImage: firstImage || s.images
                        };
                    });
                    
                    setServices(processedServices);
                } else if (provData) {
                    setProvider(provData);
                    setServices([]);
                }

            } catch (error) {
                console.error("Error fetching provider details:", error);
            } finally {
                setLoading(false);
            }
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
                    <p className="text-[#04364A] font-black uppercase tracking-widest text-[10px]">Verifying Profile...</p>
                </div>
            </div>
        );
    }

    if (!provider) {
        return (
            <div className="min-h-screen pt-32 text-center bg-gray-50/50">
                <h2 className="text-2xl font-black text-[#04364A]">Provider not found</h2>
                <Link to="/" className="text-[#64CCC5] font-bold mt-4 inline-block">Return to Home</Link>
            </div>
        );
    }

    return (
        <div className="bg-gray-50/50 min-h-screen pb-20">
            <div className="max-w-7xl mx-auto px-6 pt-24 pb-6">
                <Link to="/providers" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#176B87] hover:text-[#04364A] transition-colors group">
                    <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                    Back to network
                </Link>
            </div>

            <main className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                <aside className="lg:col-span-4 space-y-8">
                    <ProviderProfileCard 
                        provider={provider} 
                        servicesCount={services.length} 
                        getImageSrc={getImageSrc} 
                    />
                </aside>

                <section className="lg:col-span-8 space-y-12">
                    <div className="space-y-8">
                        <div className="flex gap-10 border-b border-gray-100">
                            {[
                                { id: 'services', label: 'Offerings' },
                                { id: 'about', label: 'Company Info' },
                            ].map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`pb-4 text-[10px] font-black uppercase tracking-[0.2em] transition-all relative ${
                                        activeTab === tab.id ? 'text-[#04364A]' : 'text-gray-400 hover:text-gray-600'
                                    }`}
                                >
                                    {tab.label}
                                    {activeTab === tab.id && <div className="absolute bottom-0 left-0 w-full h-1 bg-[#64CCC5] rounded-full"></div>}
                                </button>
                            ))}
                        </div>

                        {activeTab === 'services' && <ProviderOfferings services={services} getImageSrc={getImageSrc} />}
                        {activeTab === 'about' && <ProviderInfoTab provider={provider} availability={availability} />}
                      
                    </div>
                </section>
            </main>
        </div>
    );
};


export default ProviderDetail;
