import React from 'react';
import { Zap } from 'lucide-react';

const ServiceHeader = ({ servicesCount }) => {
    return (
        <div className="bg-[#04364A] py-20 px-6 relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 right-0 w-96 h-96 bg-[#64CCC5] rounded-full blur-[100px]"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#176B87] rounded-full blur-[100px]"></div>
            </div>
            
            <div className="max-w-7xl mx-auto relative z-10">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-10">
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-[#64CCC5]">
                            <div className="w-10 h-[2px] bg-[#64CCC5]"></div>
                            <span className="text-[10px] font-black uppercase tracking-[0.3em]">Marketplace</span>
                        </div>
                        <h1 className="text-5xl md:text-6xl font-display font-black text-white tracking-tight">
                                <span className="text-[#64CCC5]">Services.</span>
                        </h1>
                        <p className="text-[#DAFFFB]/60 text-lg max-w-xl font-medium">
                            Discover thousands of specialists ready to handle your next project with precision.
                        </p>
                    </div>
                    
                    <div className="hidden lg:flex items-center gap-12 bg-white/5 backdrop-blur-md p-8 rounded-[3rem] border border-white/10">
                        <div className="text-center space-y-2">
                            <div className="w-10 h-10 bg-[#64CCC5] rounded-xl flex items-center justify-center text-[#04364A] mx-auto mb-2">
                                <Zap size={20} strokeWidth={2.5} />
                            </div>
                            <p className="text-2xl font-black text-white leading-none">{servicesCount}</p>
                            <p className="text-[8px] font-black uppercase tracking-widest text-[#DAFFFB]/40">Active Services</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ServiceHeader;
