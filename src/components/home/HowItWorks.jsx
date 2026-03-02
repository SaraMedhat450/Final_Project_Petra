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
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-3xl font-black text-[#04364A] uppercase tracking-tight">How it works</h2>
          <div className="w-16 h-1 bg-[#64CCC5] mx-auto rounded-full"></div>
          <p className="text-gray-500 max-w-lg mx-auto">Getting things done is simple and fast. Follow these three easy steps.</p>
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
