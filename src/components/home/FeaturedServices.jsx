import React from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import ServiceCard from './ServiceCard';

const FeaturedServices = ({ services, providers, auth, loading }) => {
  if (loading) {
    return (
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col items-center text-center mb-16">
            <div className="w-12 h-1 border-4 border-[#64CCC5] border-t-transparent rounded-full animate-spin mb-4"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-[500px] bg-gray-50 animate-pulse rounded-[2.5rem]"></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Show top 6 services as featured
  const featured = services.slice(0, 6);

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#64CCC5]/5 rounded-full blur-[120px] -mr-64 -mt-64"></div>
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles size={18} className="text-[#64CCC5]" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#64CCC5]">Curated Selection</span>
            </div>
            <h2 className="text-5xl font-black text-[#04364A] tracking-tighter leading-none mb-6">
              Handpicked <span className="text-[#176B87]">Services</span>
            </h2>
            <p className="text-gray-400 font-medium text-lg max-w-lg">
              Discover top-rated professionals vetted for quality, reliability, and exceptional craftsmanship.
            </p>
          </div>
          
          <Link 
            to="/services"
            className="group flex items-center gap-3 text-[11px] font-black uppercase tracking-widest text-[#04364A] hover:text-[#176B87] transition-all"
          >
            Explore Market
            <div className="w-10 h-10 rounded-full bg-[#F0F9F9] flex items-center justify-center group-hover:bg-[#04364A] group-hover:text-white transition-all shadow-sm">
              <ArrowRight size={16} />
            </div>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {featured.map((service) => (
            <div key={service.id} className="h-full">
              <ServiceCard 
                service={service} 
                providers={providers} 
                auth={auth} 
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedServices;
