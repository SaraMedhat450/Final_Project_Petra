import { useEffect, useState } from "react";
import { serviceService, categoryService } from "../../services";
import "flowbite";
import { initFlowbite } from "flowbite";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

export default function ProviderServiceList() {
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [modalOpen, setModalOpen] = useState(null);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  const [serviceTitles, setServiceTitles] = useState([]);
  const [entriesPerPage, setEntriesPerPage] = useState(5);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("desc"); // 'newest' by default

  useEffect(() => {
    initFlowbite();

    const handleClickOutside = () => setOpenDropdownId(null);
    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchProviderData = async () => {
      try {
        // Use Promise.all but handle individual catch blocks to prevent one 403 from crashing the whole page
        const [servicesRes, catRes, titleRes] = await Promise.all([
          serviceService.getAllServices().catch(err => {
            console.error("Error fetching services:", err);
            return { data: [] };
          }),
          categoryService.getAllCategories().catch(err => {
            console.error("Error fetching categories:", err);
            return { data: [] };
          }),
          categoryService.getServiceTitles().catch(err => {
            console.error("Error fetching titles:", err);
            return { data: [] };
          })
        ]);

        const allServices = Array.isArray(servicesRes.data) ? servicesRes.data : (Array.isArray(servicesRes) ? servicesRes : []);
        const userData = JSON.parse(localStorage.getItem("userData") || "{}");
        
        // Filter services belonging to the current provider
        const myServices = allServices.filter(service => service.userid === userData.id);
        
        setServices(myServices);
        
        const catList = Array.isArray(catRes.data) ? catRes.data : (Array.isArray(catRes) ? catRes : []);
        setCategories(catList);
        
        const titleList = Array.isArray(titleRes.data) ? titleRes.data : (Array.isArray(titleRes) ? titleRes : []);
        setServiceTitles(titleList);
        
        setLoading(false);
      } catch (err) {
        console.error("General error in fetchProviderData:", err);
        setError("Failed to load your services");
        setLoading(false);
      }
    };

    fetchProviderData();
  }, []);

  const handleDelete = async (id) => {
    try {
      await serviceService.deleteService(id);
      setServices((prev) => prev.filter((service) => service.id !== id));
      toast.success("Service deleted successfully");
      setModalOpen(null);
    } catch (err) {
      console.error("Delete error details:", err.response?.data || err.message);
      toast.error("Failed to delete service: " + (err.response?.data?.message || "Server Error"));
    }
  };

  const [currentPage, setCurrentPage] = useState(1);

  const filteredServices = services.filter((service) => {
    const title = serviceTitles.find(t => t.id === service.service_title_id);
    const serviceName = title ? (title.service_title || title.name) : String(service.service_title_id);
    
    const cat = categories.find(c => c.id === service.categoryId);
    const categoryName = cat ? (cat.category_name || cat.name) : String(service.categoryId);

    const query = searchQuery.toLowerCase();
    return (
      serviceName.toLowerCase().includes(query) ||
      categoryName.toLowerCase().includes(query) ||
      service.price_Type.toLowerCase().includes(query)
    );
  }).sort((a, b) => {
    if (sortOrder === "desc") {
      return b.id - a.id;
    } else {
      return a.id - b.id;
    }
  });

  // Pagination Logic
  const totalEntries = filteredServices.length;
  const entriesCount = parseInt(entriesPerPage) || 5;
  const totalPages = Math.ceil(totalEntries / entriesCount) || 1;
  
  // Ensure current page is within bounds
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(1);
    }
  }, [totalPages, currentPage]);

  const handleStatusToggle = async (service) => {
    const isCurrentlyActive = service.state === 'active' || service.state === 'available';
    const newState = isCurrentlyActive ? 'inactive' : 'active';
    try {
      // Sending a plain object instead of FormData as we don't need multipart for a status toggle
      // This is often more reliable for PUT requests
      const updateData = {
        state: newState,
        categoryId: parseInt(service.categoryId),
        subcategoryId: parseInt(service.subcategoryId),
        service_title_id: parseInt(service.service_title_id),
        price: parseFloat(service.price),
        max_price: parseFloat(service.max_price || (parseFloat(service.price || 0) + 50)),
        day_of_week: service.day_of_week || "Saturday", 
        start_time: service.start_time || "00:00",
        end_time: service.end_time || "23:59",
        availability_status: service.availability_status || "available",
        userid: parseInt(service.userid),
        price_Type: service.price_Type || "Hourly",
        description: service.description || "",
        commission_fee: parseFloat(service.commission_fee || 0)
      };

      await serviceService.updateService(service.id, updateData);
      
      setServices(prev => prev.map(s => 
        s.id === service.id ? { ...s, state: newState } : s
      ));
      toast.success(`Service is now ${newState === 'active' ? 'Active' : 'Inactive'}`);
    } catch (err) {
      console.error("Failed to update status. Server response:", err.response?.data || err.message);
      const errorMsg = err.response?.data?.message || "Failed to update status";
      toast.error(errorMsg);
    }
  };

  const startIndex = (currentPage - 1) * entriesCount;
  const currentEntries = filteredServices.slice(startIndex, startIndex + entriesCount);

  return (
    <div className="p-6 bg-[#f8f9fa] min-h-screen">
      {/* Header Card */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 mb-6 flex justify-between items-center">
        <h1 className="text-xl font-bold text-sky-900">Services Management</h1>
        <Link
          to="/provider/addService"
          className="bg-sky-900 text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-sky-900/90 transition-colors"
        >
          <i className="fa-solid fa-plus"></i>
          Add New Service
        </Link>
      </div>

      {/* Controls Bar */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
        <div className="flex items-center gap-2 text-medium text-gray-600">
          <span>Show</span>
          <input 
            type="number"
            min="1"
            value={entriesPerPage}
            onChange={(e) => setEntriesPerPage(e.target.value)}
            className="w-16 border border-gray-300 rounded px-2 py-1 focus:ring-1 focus:ring-sky-900 outline-none text-center"
          />
          <span>Entries</span>
        </div>

        <div className="flex items-stretch w-full md:w-auto gap-2">
          <button 
            onClick={() => setSortOrder(sortOrder === "desc" ? "asc" : "desc")}
            className="flex items-center justify-center px-4 bg-white border border-gray-300 rounded-md text-gray-600 hover:bg-gray-50 transition-colors shadow-sm"
            title={sortOrder === "desc" ? "Sort: Newest First" : "Sort: Oldest First"}
          >
            <i className={`fa-solid ${sortOrder === "desc" ? "fa-arrow-down-short-wide" : "fa-arrow-up-wide-short"}`}></i>
          </button>

          <div className="flex items-stretch">
            <div className="relative w-full md:w-64">
              <input
                type="text"
                placeholder="Search services..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-full border border-gray-300 rounded-l px-3 py-2 focus:ring-0 focus:border-gray-300 outline-none text-sm"
              />
            </div>
            <button className="bg-sky-900 text-white px-4 flex items-center justify-center rounded-r hover:bg-sky-900/70 transition-colors border-y border-r border-[#0c4a6e]">
              <i className="fa-solid fa-magnifying-glass"></i>
            </button>
          </div>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm mt-8">
        {loading ? (
          <div className="text-center py-20 text-gray-500">Loading services...</div>
        ) : error ? (
          <div className="text-center py-20 text-red-500">{error}</div>
        ) : (
          <div className="">
            <table className="w-full text-center text-body">
              <thead className="bg-[#04364A] text-white font-medium text-medium">
                <tr>
                  <th className="px-2 py-3 font-semibold text-center">Service Name</th>
                  <th className="px-2 py-3 font-semibold text-center">Category</th>
                  <th className="px-2 py-3 font-semibold text-center">Pricing</th>
                  <th className="px-2 py-3 font-semibold text-center">Price Type</th>
                  <th className="px-2 py-3 font-semibold text-center">Status</th>
                  <th className="px-2 py-3 font-semibold text-center w-24">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 font-sm">
                {currentEntries.map((service, index) => (
                  <tr key={service.id} className="hover:bg-gray-50 transition-colors ">
                    <td className="px-2 py-3 text-center">
                      {service.Service_title.name}
                    </td>
                    <td className="px-2 py-3 text-center">
                      {(() => {
                        const cat = categories.find(c => c.id === service.categoryId);
                        return cat ? (cat.category_name || cat.name) : service.categoryId;
                      })()}
                    </td>
                    <td className="px-2 py-3 text-center">
                      {service.price_Type === "Hourly" && `${service.price} L.E / Hour`}
                      {service.price_Type === "Fixed" && `${service.price} L.E`}
                      {service.price_Type === "Free" && "Free"}
                    </td>
                    <td className="px-2 py-3 text-center">{service.price_Type}</td>
                    <td className="px-2 py-3 text-center">
                      <label className="inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="sr-only peer" 
                          checked={service.state === 'active' || service.state === 'available'} 
                          onChange={() => handleStatusToggle(service)}
                        />
                        <div className="relative w-8 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-3.5 after:transition-all peer-checked:bg-green-700"></div>
                      </label>
                    </td>
                    <td className="px-2 py-3 text-center relative">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenDropdownId(openDropdownId === service.id ? null : service.id);
                        }}
                        className="text-gray-400 hover:text-sky-900 transition-colors"
                      >
                        <i className="fa-solid fa-gear text-lg"></i>
                      </button>

                      {/* Dropdown */}
                      {openDropdownId === service.id && (
                        <div className={`absolute right-0 z-[100] bg-white rounded-md shadow-2xl w-36 border border-gray-100 py-1 font-normal ${
                          index >= currentEntries.length - 3 && currentEntries.length > 3 
                          ? 'bottom-full mb-2' 
                          : 'top-full mt-1'
                        }`}>
                          <Link
                            to={`/provider/editService/${service.id}`}
                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-sky-900 hover:text-white transition-colors text-left"
                          >
                            <i className="fa-regular fa-pen-to-square mr-2 w-4 text-center"></i>
                            Edit
                          </Link>
                          <button
                            onClick={() => {
                              setModalOpen(service.id);
                              setOpenDropdownId(null);
                            }}
                            className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-500 hover:text-white transition-colors text-left"
                          >
                            <i className="fa-solid fa-trash-can mr-2 w-4 text-center"></i>
                            Delete
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
                {filteredServices.length === 0 && (
                  <tr>
                    <td colSpan="6" className="px-6 py-10 text-center text-gray-500 font-normal">
                      No services found matching your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination Footer */}
      <div className="mt-4 flex flex-col md:flex-row justify-between items-center gap-4 text-medium text-gray-600">
        <div>
          Showing {totalEntries > 0 ? startIndex + 1 : 0} to {Math.min(startIndex + entriesCount, totalEntries)} of {totalEntries} entries
          {filteredServices.length !== services.length && ` (filtered from ${services.length} total entries)`}
        </div>

        <div className="flex items-center gap-1">
          <button 
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            className="p-2 text-gray-400 hover:text-sky-900/70 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <i className="fa-solid fa-chevron-left text-xs"></i>
          </button>
          
          {(() => {
            const pageNumbers = [];
            let startPage = Math.max(1, currentPage - 1);
            let endPage = Math.min(totalPages, startPage + 2);
            
            // Adjust if we are at the end
            if (endPage - startPage < 2 && totalPages > 2) {
              startPage = Math.max(1, endPage - 2);
            }

            for (let i = startPage; i <= endPage; i++) {
              pageNumbers.push(
                <button
                  key={i}
                  onClick={() => setCurrentPage(i)}
                  className={`w-8 h-8 rounded border transition-colors ${
                    currentPage === i 
                    ? 'bg-sky-900 text-white border-sky-900' 
                    : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  {i}
                </button>
              );
            }
            return pageNumbers;
          })()}

          <button 
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            className="p-2 text-gray-400 hover:text-sky-900/70 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <i className="fa-solid fa-chevron-right text-xs"></i>
          </button>
        </div>
      </div>

      {/* Delete Modal */}
      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-[100] p-4 font-normal">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setModalOpen(null)}></div>
          <div className="bg-white rounded-[2rem] shadow-2xl max-w-sm w-full relative z-[110] p-8 text-center">
            <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <i className="fa-solid fa-trash-can text-3xl"></i>
            </div>
            
            <h3 className="text-2xl font-bold text-sky-900 mb-3">Delete</h3>
            
            <p className="text-gray-500 mb-8 leading-relaxed">
              You are about to permanently delete <span className="font-semibold text-gray-900 text-sm">@{(() => {
                const s = services.find(x => x.id === modalOpen);
                const title = serviceTitles.find(t => t.id === s?.service_title_id);
                return title ? (title.service_title || title.name) : 'this service';
              })()}</span>. <br />
              Are you absolutely certain?
            </p>

            <div className="flex gap-4">
              <button
                onClick={() => setModalOpen(null)}
                className="flex-1 px-4 py-3 bg-[#f1f3f5] text-gray-700 font-bold rounded-2xl hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(modalOpen)}
                className="flex-1 px-4 py-3 bg-red-600 text-white font-bold rounded-2xl hover:bg-red-700 shadow-lg shadow-red-200 transition-all"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


