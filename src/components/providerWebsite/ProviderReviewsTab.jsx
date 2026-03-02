import React from 'react';
import { MessageSquare } from 'lucide-react';

const ProviderReviewsTab = () => {
    return (
        <div className="col-span-full py-24 text-center bg-white rounded-[3rem] border border-gray-100 soft-shadow animate-in fade-in duration-500">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300">
                <MessageSquare size={24} />
            </div>
            <p className="text-[#04364A] font-black text-xl uppercase tracking-tighter">No testimonials yet</p>
            <p className="text-gray-400 font-medium mt-2">Reviews will appear here once the provider completes bookings.</p>
        </div>
    );
};

export default ProviderReviewsTab;
