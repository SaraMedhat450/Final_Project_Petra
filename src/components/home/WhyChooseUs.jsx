import React from 'react';
import { ShieldCheck, Clock, Star, Heart } from 'lucide-react';

// Import local images
import verifiedImg from '@/assets/verified.png';
import anytimeImg from '@/assets/anytime.png';
import qualityImg from '@/assets/quality.png';
import trustImg from '@/assets/trust.png';

const WhyChooseUs = () => {
  const features = [
    {
      icon: ShieldCheck,
      image: verifiedImg,
      title: "Verified Pro",
      desc: "All our service providers go through a manual verification process."
    },
    {
      icon: Clock,
      image: anytimeImg,
      title: "Available 24/7",
      desc: "Book your service at any time that fits your busy schedule."
    },
    {
      icon: Star,
      image: qualityImg,
      title: "Quality Work",
      desc: "We ensure you get the best quality for every job we handle."
    },
    {
      icon: Heart,
      image: trustImg,
      title: "Trusted by many",
      desc: "Thousands of happy customers trust us for their home services."
    }
  ];

  return (
    <section className="py-32 bg-gray-50/50">
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

            <div className="grid md:grid-cols-2 gap-6">
              {features.map((item, index) => (
                <div key={index} className="group relative bg-white p-6 rounded-[2rem] border border-gray-100 hover:shadow-2xl transition-all duration-500 overflow-hidden">
                  {/* Background Image Overlay on Hover */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-700">
                    <img src={item.image} alt="" className="w-full h-full object-cover" />
                  </div>
                  
                  <div className="relative z-10">
                    <div className="w-14 h-14 bg-[#DAFFFB] rounded-2xl flex items-center justify-center text-[#176B87] mb-6 shadow-inner ring-1 ring-white/50 group-hover:bg-[#04364A] group-hover:text-white transition-all duration-500">
                      <item.icon size={28} strokeWidth={1.5} />
                    </div>
                    <div className="space-y-2">
                      <h5 className="text-lg font-black text-[#04364A] tracking-tight">{item.title}</h5>
                      <p className="text-gray-400 text-xs font-medium leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Side - Image */}
          <div className="lg:w-1/2 relative group">
            <div className="rounded-[3rem] overflow-hidden shadow-2xl relative">
              <img 
                src={qualityImg} 
                alt="Quality Home Service" 
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#04364A]/40 to-transparent"></div>
            </div>
            
            {/* Premium Floating Badge */}
            <div className="absolute -bottom-8 -right-8 bg-white p-8 rounded-[2.5rem] shadow-2xl border border-gray-100 animate-bounce-slow">
              <p className="text-4xl font-black text-[#04364A] tracking-tighter">100%</p>
              <p className="text-[10px] uppercase font-black text-[#64CCC5] tracking-widest mt-1">Happy Clients</p>
              <div className="flex gap-1 mt-3 text-yellow-400">
                {[1,2,3,4,5].map(star => <Star key={star} size={10} fill="currentColor" />)}
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
