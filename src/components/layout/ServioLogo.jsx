import React from 'react';
import { Sparkles } from 'lucide-react';

const ServioLogo = ({ className = '', showText = true, light = false }) => {
    return (
        <div className={`flex items-center gap-2 group cursor-pointer ${className}`}>
            {/* Logo Icon */}
            <div className="relative">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-500 group-hover:rotate-[15deg] group-hover:scale-110 shadow-lg shadow-[#64CCC5]/10 ${light ? 'bg-white text-[#04364A]' : 'bg-[#04364A] text-[#64CCC5]'}`}>
                    <div className="absolute inset-0 bg-[#64CCC5]/10 rounded-xl animate-pulse blur-sm"></div>
                    <Sparkles size={24} strokeWidth={2.5} className="relative z-10" />
                </div>
                {/* Accent Dot */}
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#64CCC5] rounded-full border-2 border-white animate-bounce shadow-sm"></div>
            </div>

            {/* Logo Text */}
            {showText && (
                <span className={`text-2xl font-black tracking-tighter transition-colors duration-300 ${light ? 'text-white group-hover:text-[#64CCC5]' : 'text-[#04364A] group-hover:text-[#176B87]'}`}>
                    SERV<span className="text-[#64CCC5]">IO</span>
                </span>
            )}
        </div>
    );
};

export default ServioLogo;
