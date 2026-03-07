import React, { useState } from 'react';
import { Calendar, Clock, ChevronRight, ChevronLeft } from 'lucide-react';

const ProviderAvailability = ({ availability = [] }) => {
    const dayOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const shortDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    
    // Improved check for Always Available (empty array OR "All Days" in slots)
    const isAlwaysAvailable = availability.length === 0 || 
                             availability.some(slot => 
                                 slot.day_of_week?.toLowerCase() === 'all days' || 
                                 slot.day_of_week?.toLowerCase() === 'alldays'
                             );
    
    // Sort and map availability
    const scheduleMap = availability.reduce((acc, slot) => {
        if (slot.day_of_week) {
            acc[slot.day_of_week.toLowerCase()] = slot;
        }
        return acc;
    }, {});

    const [selectedDay, setSelectedDay] = useState(new Date().toLocaleDateString('en-US', { weekday: 'long' }));

    return (
        <div className="bg-white rounded-[2rem] p-8 soft-shadow border border-gray-100 space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#DAFFFB] flex items-center justify-center text-[#176B87]">
                        <Calendar size={18} />
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-[#04364A]">Availability</p>
                </div>
                <div className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                    <span className="text-[8px] font-black uppercase text-green-600 tracking-tighter">
                        {isAlwaysAvailable ? 'Always Open' : 'Live Status'}
                    </span>
                </div>
            </div>

            {/* Day Selector - Visual Grid */}
            <div className="grid grid-cols-7 gap-1">
                {dayOrder.map((day, idx) => {
                    const hasSlots = isAlwaysAvailable || !!scheduleMap[day.toLowerCase()];
                    const isSelected = selectedDay === day;
                    
                    return (
                        <button
                            key={day}
                            onClick={() => setSelectedDay(day)}
                            className={`flex flex-col items-center py-3 rounded-xl transition-all ${
                                isSelected 
                                    ? 'bg-[#04364A] text-white shadow-lg scale-105 z-10' 
                                    : hasSlots 
                                        ? 'bg-gray-50 text-[#04364A] hover:bg-[#DAFFFB]' 
                                        : 'bg-transparent text-gray-300 cursor-not-allowed opacity-50'
                            }`}
                        >
                            <span className="text-[8px] font-black uppercase tracking-tighter mb-1">{shortDays[idx]}</span>
                            <div className={`w-1.5 h-1.5 rounded-full ${hasSlots ? (isSelected ? 'bg-[#64CCC5]' : 'bg-[#64CCC5]') : 'bg-transparent'}`}></div>
                        </button>
                    );
                })}
            </div>

            {/* Time Slots Display */}
            <div className="bg-gray-50/50 rounded-2xl p-4 border border-gray-100">
                {isAlwaysAvailable || scheduleMap[selectedDay.toLowerCase()] ? (
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Clock size={16} className="text-[#176B87]" />
                            <div className="flex flex-col">
                                <span className="text-[10px] font-black text-[#04364A] uppercase tracking-wide">{selectedDay}</span>
                                <span className="text-[11px] font-bold text-gray-500">
                                    {isAlwaysAvailable ? 'All day available' : `${scheduleMap[selectedDay.toLowerCase()].start_time} - ${scheduleMap[selectedDay.toLowerCase()].end_time}`}
                                </span>
                            </div>
                        </div>
                        <button className="px-4 py-2 bg-[#64CCC5] text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-[#04364A] transition-all shadow-sm shadow-[#64CCC5]/20">
                            Book
                        </button>
                    </div>
                ) : (
                    <div className="text-center py-2">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">No Slots Available</p>
                    </div>
                )}
            </div>

            {/* Quick Note */}
            <p className="text-[8px] font-bold text-gray-300 text-center uppercase tracking-widest leading-relaxed">
                {isAlwaysAvailable 
                    ? "* Provider is available every day for your convenience."
                    : "* Timings may vary based on holidays or workload."}
            </p>
        </div>
    );
};

export default ProviderAvailability;
