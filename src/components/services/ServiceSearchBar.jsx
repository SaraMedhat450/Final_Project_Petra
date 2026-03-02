import React from 'react';
import { Search, ChevronDown, SlidersHorizontal } from 'lucide-react';

const ServiceSearchBar = ({ searchQuery, setSearchQuery, selectedCategory, setSelectedCategory, categories, showFilters, setShowFilters }) => {
    return (
        <div className="max-w-7xl mx-auto px-6 -mt-10 relative z-20">
            <div className="bg-white p-4 rounded-3xl soft-shadow border border-gray-100 flex flex-col lg:flex-row items-center gap-4">
                <div className="flex-1 w-full relative">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input 
                        type="text"
                        placeholder="Search by service name or keyword..."
                        className="w-full pl-14 pr-6 py-4 bg-gray-50 rounded-2xl outline-none font-bold text-[#04364A] placeholder:text-gray-300 focus:bg-white focus:ring-2 focus:ring-[#64CCC5]/20 transition-all"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                
                <div className="flex items-center gap-3 w-full lg:w-auto">
                    <div className="relative flex-1 lg:flex-none">
                        <select 
                            className="appearance-none pl-6 pr-12 py-4 bg-gray-50 rounded-2xl font-black text-[10px] uppercase tracking-widest text-[#04364A] outline-none cursor-pointer hover:bg-gray-100 transition-all w-full"
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                        >
                            <option value="All">All Categories</option>
                            {categories.map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                        </select>
                        <ChevronDown size={14} className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>
                    
                    <button 
                        onClick={() => setShowFilters(!showFilters)}
                        className={`p-4 rounded-2xl transition-all lg:hidden ${showFilters ? 'bg-[#64CCC5] text-white' : 'bg-[#04364A] text-white hover:bg-[#176B87]'}`}
                    >
                        <SlidersHorizontal size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ServiceSearchBar;
