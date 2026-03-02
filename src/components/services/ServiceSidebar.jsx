import React from 'react';
import { Filter } from 'lucide-react';

const ServiceSidebar = ({ 
    categories, 
    selectedCategory, 
    setSelectedCategory,
    areas,
    selectedArea,
    setSelectedArea,
    priceRange, 
    setPriceRange, 
    showFilters 
}) => {
    return (
        <aside className={`lg:w-72 shrink-0 space-y-10 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm sticky top-32">
                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#176B87] mb-8 flex items-center gap-2">
                    <Filter size={14} /> Refine Results
                </h4>
                
                <div className="space-y-10">
                    {/* Category List */}
                    <div className="space-y-4">
                        <p className="text-xs font-black text-[#04364A] uppercase tracking-widest leading-none ml-1">Domain</p>
                        <div className="relative">
                            <div className="space-y-1.5 max-h-[240px] overflow-y-auto pr-2 custom-sidebar-scroll">
                                <button 
                                    onClick={() => setSelectedCategory('All')}
                                    className={`w-full text-left px-5 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                                        selectedCategory === 'All' ? 'bg-[#04364A] text-[#64CCC5] shadow-lg shadow-[#04364A]/20' : 'text-gray-400 hover:bg-gray-50'
                                    }`}
                                >All Domains</button>
                                {categories.map(cat => (
                                    <button 
                                        key={cat.id}
                                        onClick={() => setSelectedCategory(cat.id)}
                                        className={`w-full text-left px-5 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                                            String(selectedCategory) === String(cat.id) ? 'bg-[#64CCC5] text-[#04364A] shadow-lg shadow-[#64CCC5]/20' : 'text-gray-400 hover:bg-gray-50'
                                        }`}
                                    >{cat.name}</button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Area/Location Filter */}
                    <div className="space-y-4">
                        <p className="text-xs font-black text-[#04364A] uppercase tracking-widest leading-none ml-1">Areas</p>
                        <div className="relative">
                            <div className="space-y-1.5 max-h-[200px] overflow-y-auto pr-2 custom-sidebar-scroll">
                                <button 
                                    onClick={() => setSelectedArea('All')}
                                    className={`w-full text-left px-5 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                                        selectedArea === 'All' ? 'bg-[#176B87] text-white shadow-lg shadow-[#176B87]/20' : 'text-gray-400 hover:bg-gray-50'
                                    }`}
                                >All Regions</button>
                                {areas.map(area => (
                                    <button 
                                        key={area}
                                        onClick={() => setSelectedArea(area)}
                                        className={`w-full text-left px-5 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                                            selectedArea.toLowerCase().trim() === area.toLowerCase().trim() ? 'bg-[#176B87] text-white shadow-lg shadow-[#176B87]/20' : 'text-gray-400 hover:bg-gray-50'
                                        }`}
                                    >{area}</button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Price Range */}
                    <div className="space-y-6">
                        <div className="flex justify-between items-end">
                            <p className="text-xs font-black text-[#04364A] uppercase tracking-widest leading-none">Price Range</p>
                            <span className="text-[10px] font-bold text-[#64CCC5]">${priceRange[0]} - ${priceRange[1]}</span>
                        </div>
                        <input 
                            type="range" 
                            min="0" 
                            max="100000" 
                            step="100"
                            value={priceRange[1]}
                            onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                            className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#64CCC5]"
                        />
                        <div className="flex justify-between text-[8px] font-black text-gray-300 uppercase tracking-widest">
                            <span>$0</span>
                            <span>$100k+</span>
                        </div>
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default ServiceSidebar;
