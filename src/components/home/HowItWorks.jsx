import React from 'react';
import { Search, Calendar, CheckCircle } from 'lucide-react';

const HowItWorks = () => {
    const steps = [
        {
            icon: Search,
            title: "Search Service",
            desc: "Find what you need by browsing our categories or using the search bar."
        },
        {
            icon: Calendar,
            title: "Book a Time",
            desc: "Pick a date and time that works best for you and confirm your booking."
        },
        {
            icon: CheckCircle,
            title: "Enjoy Service",
            desc: "Our professional will arrive at your door to provide top-quality service."
        }
    ];

    return (
    <section className="py-20 bg-gray-50/50">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header */}
        <div className="text-center mb-20 space-y-6">
          <div className="flex flex-col items-center gap-4">
            <div className="flex items-center gap-3 text-[#64CCC5] animate-fade-in">
                <div className="w-10 h-[2px] bg-[#64CCC5]"></div>
                <span className="text-[10px] font-black uppercase tracking-[0.4em]">Simplified Process</span>
                <div className="w-10 h-[2px] bg-[#64CCC5]"></div>
            </div>
            <h2 className="text-5xl md:text-6xl font-black text-[#04364A] tracking-tighter leading-none">
              How <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#176B87] to-[#04364A]">It Works.</span>
            </h2>
          </div>
          <p className="text-[#04364A]/50 max-w-lg mx-auto font-medium text-lg leading-relaxed">
            Getting high-quality services is simpler than ever. 
            Three steps away from excellence.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid md:grid-cols-3 gap-12">
          {steps.map((step, index) => (
            <div key={index} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center space-y-6 hover:shadow-md transition-shadow">
              
              {/* Icon Circle */}
              <div className="w-16 h-16 bg-[#64CCC5]/10 rounded-full flex items-center justify-center mx-auto text-[#176B87]">
                <step.icon size={32} />
              </div>

              <div className="space-y-2">
                <span className="text-[10px] font-bold text-[#64CCC5] uppercase tracking-widest">Step {index + 1}</span>
                <h3 className="text-xl font-bold text-[#04364A]">{step.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{step.desc}</p>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default HowItWorks;
