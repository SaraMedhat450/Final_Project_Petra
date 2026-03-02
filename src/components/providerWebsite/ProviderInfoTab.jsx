import React from 'react';
import { MapPin, Phone, Mail, Calendar } from 'lucide-react';

const ProviderInfoTab = ({ provider, availability = [] }) => {
    // Sort availability by day of week if needed
    const dayOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const sortedAvailability = [...availability].sort((a, b) => 
        dayOrder.indexOf(a.day_of_week) - dayOrder.indexOf(b.day_of_week)
    );

    return (
        <div className="bg-white p-12 rounded-[3rem] soft-shadow border border-gray-100 space-y-12 animate-in fade-in duration-500">
            {/* Biography Section */}
            <div className="space-y-4">
                <h3 className="text-xl font-black text-[#04364A] uppercase tracking-tight">Biography</h3>
                <p className="text-gray-500 font-medium leading-relaxed">
                    {provider.description || (
                        <>
                            Verified professional providing services in <span className="text-[#04364A] font-bold">{provider.city || provider.address || 'Local Area'}</span>. 
                            Member since {provider.createdAt ? new Date(provider.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : '2024'}. 
                            Committed to high-quality results and professional excellence.
                        </>
                    )}
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-12 pt-10 border-t border-gray-50">
                {/* Logistics Column */}
                <div className="space-y-6">
                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#176B87]">Logistics</h4>
                    <div className="space-y-4">
                        <div className="flex items-start gap-4 text-sm font-bold text-[#04364A]">
                            <div className="w-10 h-10 rounded-xl bg-[#64CCC5]/10 flex items-center justify-center shrink-0 text-[#176B87]">
                                <MapPin size={20} />
                            </div>
                            <div className="pt-1">
                                <p className="text-gray-400 text-[10px] uppercase font-black mb-0.5">Location</p>
                                <span>{provider.address || 'Address not listed'}, {provider.city || 'City not listed'}</span>
                            </div>
                        </div>
                        <div className="flex items-start gap-4 text-sm font-bold text-[#04364A]">
                            <div className="w-10 h-10 rounded-xl bg-[#64CCC5]/10 flex items-center justify-center shrink-0 text-[#176B87]">
                                <Phone size={20} />
                            </div>
                            <div className="pt-1">
                                <p className="text-gray-400 text-[10px] uppercase font-black mb-0.5">Phone</p>
                                <span>{provider.phone || 'Phone not listed'}</span>
                            </div>
                        </div>
                        <div className="flex items-start gap-4 text-sm font-bold text-[#04364A]">
                            <div className="w-10 h-10 rounded-xl bg-[#64CCC5]/10 flex items-center justify-center shrink-0 text-[#176B87]">
                                <Mail size={20} />
                            </div>
                            <div className="pt-1">
                                <p className="text-gray-400 text-[10px] uppercase font-black mb-0.5">Email</p>
                                <span>{provider.email}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Operating Status Column */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#176B87]">Operating Status</h4>
                        <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${
                            provider.status === 'active' ? 'bg-green-50 text-green-600' : 'bg-amber-50 text-amber-600'
                        }`}>
                            {provider.status || 'Active'}
                        </span>
                    </div>

                    <div className="space-y-4 bg-gray-50/50 p-6 rounded-2xl border border-gray-100">
                        <div className="flex items-center gap-3 text-sm font-bold text-[#04364A] mb-2">
                            <Calendar size={18} className="text-[#64CCC5]" />
                            <span>Weekly Schedule</span>
                        </div>
                        
                        {sortedAvailability.length > 0 ? (
                            <div className="space-y-3">
                                {sortedAvailability.map((slot, idx) => (
                                    <div key={idx} className="flex items-center justify-between text-xs">
                                        <span className="font-black text-[#04364A]">{slot.day_of_week}</span>
                                        <div className="flex items-center gap-2">
                                            <span className="px-2 py-1 bg-white rounded-lg border border-gray-100 font-bold text-gray-500">
                                                {slot.start_time} - {slot.end_time}
                                            </span>
                                            <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center py-4 text-center">
                                <p className="text-[10px] font-bold text-gray-400 uppercase">Always Available</p>
                                <p className="text-[9px] text-gray-300 mt-1">Book services based on open slots</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProviderInfoTab;
