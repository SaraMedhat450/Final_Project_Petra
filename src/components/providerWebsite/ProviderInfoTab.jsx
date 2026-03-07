import React from 'react';
import { MapPin, Phone, Mail, Calendar } from 'lucide-react';

const ProviderInfoTab = ({ provider, availability = [] }) => {
    const dayOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    
    // Improved availability check for "Always Available" state
    const isAlwaysAvailable = availability.length === 0 || 
                             availability.some(slot => slot.day_of_week?.toLowerCase() === 'all days' || slot.day_of_week === 'All Days');

    const scheduleMap = availability.reduce((acc, slot) => {
        if (slot.day_of_week) {
            acc[slot.day_of_week.toLowerCase()] = slot;
        }
        return acc;
    }, {});

    const address = provider.address || provider.User?.address || provider.user?.address || '';
    const city = provider.city || provider.User?.city || provider.user?.city || '';
    const description = provider.description || provider.User?.description || provider.user?.description || '';

    return (
        <div className="bg-white p-12 rounded-[3rem] soft-shadow border border-gray-100 space-y-12 animate-in fade-in duration-500">
            {/* Biography Section */}
            <div className="space-y-4">
                <h3 className="text-xl font-black text-[#04364A] uppercase tracking-tight">Biography</h3>
                <p className="text-gray-500 font-medium leading-relaxed">
                    {description || (
                        <>
                            Verified professional providing services in <span className="text-[#04364A] font-bold">{city || address || 'Local Area'}</span>. 
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
                                <span>{(address || city) ? `${address}${address && city ? ', ' : ''}${city}` : 'Address not listed'}</span>
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

                    <div className="space-y-6 bg-gray-50/50 p-6 rounded-[2rem] border border-gray-100">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3 text-sm font-bold text-[#04364A]">
                                <Calendar size={18} className="text-[#64CCC5]" />
                                <span>Weekly Schedule</span>
                            </div>
                            <span className="text-[8px] font-black uppercase text-[#176B87] tracking-[0.2em]">Operational Hours</span>
                        </div>
                        
                        <div className="grid gap-2">
                            {dayOrder.map((day) => {
                                const slot = scheduleMap[day.toLowerCase()];
                                const isOpen = isAlwaysAvailable || !!slot;
                                return (
                                    <div key={day} className={`flex items-center justify-between p-3 rounded-xl transition-all ${isOpen ? 'bg-white shadow-sm border border-gray-100' : 'opacity-40'}`}>
                                        <div className="flex items-center gap-3">
                                            <div className={`w-1.5 h-1.5 rounded-full ${isOpen ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                                            <span className={`text-xs font-black ${isOpen ? 'text-[#04364A]' : 'text-gray-400'}`}>{day}</span>
                                        </div>
                                        {isOpen ? (
                                            <span className="text-[10px] font-bold text-gray-500 bg-gray-50 px-3 py-1 rounded-lg">
                                                {isAlwaysAvailable ? 'Always Available' : `${slot.start_time} - ${slot.end_time}`}
                                            </span>
                                        ) : (
                                            <span className="text-[9px] font-bold text-gray-300 uppercase tracking-tighter">Closed</span>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProviderInfoTab;
