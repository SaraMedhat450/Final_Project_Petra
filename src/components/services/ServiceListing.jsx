import React from 'react';
import { Grid, List, ChevronDown, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import ServiceCard from '@/components/home/ServiceCard';

const ServiceListing = ({ 
    filteredServices, 
    totalResults,
    loading, 
    viewMode, 
    setViewMode, 
    sortBy, 
    setSortBy, 
    selectedCategory, 
    providers, 
    auth,
    resetFilters,
    currentPage,
    totalPages,
    setCurrentPage
}) => {
    const listingRef = React.useRef(null);

    const handlePageChange = (page) => {
        if (listingRef.current) {
            // Scroll to the top of the listings, but respect the fixed header 
            // (assuming ~100px header)
            const yOffset = -120; 
            const y = listingRef.current.getBoundingClientRect().top + window.pageYOffset + yOffset;
            window.scrollTo({ top: y, behavior: 'smooth' });
        }
        setCurrentPage(page);
    };

    return (
        <div className="flex-1" ref={listingRef}>
            <div className="flex flex-col sm:flex-row items-center justify-between mb-12 gap-6">
                <p className="text-sm font-medium text-gray-400">
                    Showing <span className="text-[#04364A] font-black">{totalResults}</span> results 
                    {selectedCategory !== 'All' && <span> in <span className="text-[#64CCC5] font-black">{selectedCategory}</span></span>}
                </p>
                
                <div className="flex items-center gap-4">
                    <div className="flex items-center bg-white p-1 rounded-xl border border-gray-100">
                        <button 
                            onClick={() => setViewMode('grid')}
                            className={`p-2.5 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-[#04364A] text-white' : 'text-gray-300 hover:text-[#04364A]'}`}
                        >
                            <Grid size={16} />
                        </button>
                        <button 
                            onClick={() => setViewMode('list')}
                            className={`p-2.5 rounded-lg transition-all ${viewMode === 'list' ? 'bg-[#04364A] text-white' : 'text-gray-300 hover:text-[#04364A]'}`}
                        >
                            <List size={16} />
                        </button>
                    </div>
                    <div className="relative">
                        <select 
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="appearance-none pl-6 pr-10 py-3 bg-white border border-gray-100 rounded-xl text-[10px] font-black uppercase tracking-widest text-[#04364A] outline-none"
                        >
                            <option value="Newest">Newest</option>
                            <option value="Price: Low to High">Price: Low to High</option>
                            <option value="Price: High to Low">Price: High to Low</option>
                            <option value="Top Rated">Top Rated</option>
                        </select>
                        <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>
                </div>
            </div>

            {loading ? (
                <div className={`grid gap-8 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'}`}>
                    {[1, 2, 3, 4, 5, 6].map(i => (
                        <div key={i} className={`bg-white animate-pulse rounded-[2.5rem] border border-gray-100 ${viewMode === 'grid' ? 'h-96' : 'h-48'}`}></div>
                    ))}
                </div>
            ) : filteredServices.length > 0 ? (
                <>
                    <div className={`grid gap-8 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'}`}>
                        {filteredServices.map(service => (
                            <ServiceCard 
                                key={service.id} 
                                service={service} 
                                providers={providers}
                                auth={auth} 
                                viewMode={viewMode} 
                            />
                        ))}
                    </div>

                    {/* Pagination Controls */}
                    {totalPages > 1 && (
                        <div className="mt-20 flex items-center justify-center gap-2">
                            <button 
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="p-4 rounded-2xl bg-white border border-gray-100 text-[#04364A] hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                            >
                                <ChevronLeft size={20} />
                            </button>

                            <div className="flex items-center gap-2 px-2">
                                {[...Array(totalPages)].map((_, idx) => {
                                    const pageNum = idx + 1;
                                    return (
                                        <button 
                                            key={pageNum}
                                            onClick={() => handlePageChange(pageNum)}
                                            className={`w-12 h-12 rounded-2xl text-xs font-black transition-all ${
                                                currentPage === pageNum 
                                                ? 'bg-[#04364A] text-white shadow-xl shadow-[#04364A]/20' 
                                                : 'bg-white text-gray-400 border border-gray-100 hover:border-[#176B87] hover:text-[#176B87]'
                                            }`}
                                        >
                                            {pageNum}
                                        </button>
                                    );
                                })}
                            </div>

                            <button 
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className="p-4 rounded-2xl bg-white border border-gray-100 text-[#04364A] hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                            >
                                <ChevronRight size={20} />
                            </button>
                        </div>
                    )}
                </>
            ) : (
                <div className="text-center py-32 bg-white rounded-[3rem] border-4 border-dashed border-gray-50">
                    <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300">
                        <Search size={32} />
                    </div>
                    <h3 className="text-[#04364A] font-black text-xl tracking-tight uppercase">No matching services</h3>
                    <p className="text-gray-400 mt-2 font-medium">Try adjusting your filters or search terms.</p>
                    <button 
                        onClick={resetFilters}
                        className="mt-8 px-8 py-4 bg-[#04364A] text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-[#176B87] transition-all"
                    >Reset Filters</button>
                </div>
            )}
        </div>
    );
};

export default ServiceListing;
