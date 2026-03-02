import React from 'react';
import { ShieldCheck, Clock, Star, Heart } from 'lucide-react';

const WhyChooseUs = () => {
  const features = [
    {
      icon: ShieldCheck,
      title: "Verified Pro",
      desc: "All our service providers go through a manual verification process."
    },
    {
      icon: Clock,
      title: "Available 24/7",
      desc: "Book your service at any time that fits your busy schedule."
    },
    {
      icon: Star,
      title: "Quality Work",
      desc: "We ensure you get the best quality for every job we handle."
    },
    {
      icon: Heart,
      title: "Trusted by many",
      desc: "Thousands of happy customers trust us for their home services."
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          
          {/* Left Side - Text */}
          <div className="lg:w-1/2 space-y-8">
            <div className="space-y-4">
              <h4 className="text-[#64CCC5] font-bold uppercase tracking-widest text-sm">Why Us</h4>
              <h2 className="text-4xl font-black text-[#04364A] leading-tight">
                Quality Services You Can <br />
                <span className="text-[#176B87]">Always Trust</span>
              </h2>
              <p className="text-gray-500 text-lg">
                We make it easy to find and book reliable professionals for your home and office needs. No hidden fees, just great service.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {features.map((item, index) => (
                <div key={index} className="flex gap-4">
                  <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-[#176B87] shrink-0 border border-gray-100">
                    <item.icon size={24} />
                  </div>
                  <div className="space-y-1">
                    <h5 className="font-bold text-[#04364A]">{item.title}</h5>
                    <p className="text-sm text-gray-400 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Side - Image */}
          <div className="lg:w-1/2 relative">
            <div className="rounded-3xl overflow-hidden shadow-xl">
              <img 
                src="https://images.unsplash.com/photo-1581578731548-c64695cc6954?auto=format&fit=crop&w=800&q=80" 
                alt="Cleaning service" 
                className="w-full h-full object-cover"
              />
            </div>
            {/* Simple Floating Badge */}
            <div className="absolute -bottom-6 -right-6 bg-[#04364A] text-white p-6 rounded-2xl shadow-lg border-4 border-white">
              <p className="text-2xl font-black">100%</p>
              <p className="text-[10px] uppercase font-bold text-[#64CCC5]">Happy Clients</p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
