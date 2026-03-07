import React from 'react';
import { Zap, Sparkles, TrendingUp } from 'lucide-react';
import servicesBg from '@/assets/services_bg.png';

const ServiceHeader = ({ servicesCount }) => {
    return (
        <div className="bg-[#04364A] py-32 px-6 relative overflow-hidden">
            {/* Background Image & Overlay */}
            <div className="absolute inset-0 z-0">
                <img src={servicesBg} alt="background" className="w-full h-full object-cover opacity-20" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#04364A] via-[#04364A]/80 to-transparent"></div>
                <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-[#64CCC5]/20 rounded-full blur-[120px] animate-pulse"></div>
                <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-[#176B87]/30 rounded-full blur-[120px] animate-pulse delay-700"></div>
                
                {/* Floating Decorative Elements */}
                <div className="absolute top-1/4 left-10 w-4 h-4 bg-[#64CCC5] rounded-full animate-float opacity-30"></div>
                <div className="absolute bottom-1/4 right-20 w-6 h-6 bg-[#176B87] rounded-full animate-float delay-1000 opacity-40"></div>
                <div className="absolute top-2/3 left-1/2 w-3 h-3 bg-white rounded-full animate-float delay-500 opacity-20"></div>
            </div>
            
            <div className="max-w-7xl mx-auto relative z-10">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-16">
                    <div className="space-y-8 max-w-2xl">
                        <div className="flex items-center gap-3 text-[#64CCC5] animate-fade-in">
                            <div className="w-12 h-[2px] bg-gradient-to-r from-[#64CCC5] to-transparent"></div>
                            <span className="text-[11px] font-black uppercase tracking-[0.4em] flex items-center gap-2">
                                <Sparkles size={14} /> 
                            </span>
                        </div>
                        
                        <div className="space-y-4">
                            <h1 className="text-6xl md:text-8xl font-display font-black text-white tracking-tighter leading-[0.9] animate-fade-in delay-100">
                                Perfect <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#64CCC5] to-[#DAFFFB]">Services.</span>
                            </h1>
                            <p className="text-[#DAFFFB]/70 text-xl font-medium leading-relaxed animate-fade-in delay-200">
                                Discover a curated network of top-tier professionals. 
                                We connect you with verified experts for every specialized task.
                            </p>
                        </div>

                        {/* Quick Stats in Header for Mobile */}
                        <div className="flex lg:hidden items-center gap-6 animate-fade-in delay-300">
                            <div className="px-5 py-3 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl">
                                <p className="text-2xl font-black text-[#64CCC5]">{servicesCount}</p>
                                <p className="text-[8px] font-black uppercase tracking-widest text-[#DAFFFB]/40">Active Jobs</p>
                            </div>
                        </div>
                    </div>
                    
                    {/* Floating Counter Card */}
                    <div className="hidden lg:block animate-fade-in delay-500">
                        <div className="relative group perspective-1000">
                            <div className="absolute -inset-1 bg-gradient-to-r from-[#64CCC5] to-[#176B87] rounded-[3.5rem] blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200 animate-float"></div>
                            <div className="relative bg-[#04364A]/60 backdrop-blur-2xl p-12 rounded-[3.5rem] border border-white/10 shadow-2xl flex flex-col items-center text-center space-y-4">
                                <div className="w-16 h-16 bg-gradient-to-br from-[#64CCC5] to-[#176B87] rounded-2xl flex items-center justify-center text-[#04364A] shadow-lg shadow-[#64CCC5]/20 animate-bounce">
                                    <Zap size={32} strokeWidth={2.5} />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-5xl font-black text-white tracking-tight">{servicesCount}</p>
                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#64CCC5]">Services</p>
                                </div>
                                <div className="flex items-center gap-2 px-4 py-2 bg-[#64CCC5]/10 rounded-full text-[#64CCC5] text-[9px] font-bold">
                                    <TrendingUp size={12} />
                                   
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ServiceHeader;
