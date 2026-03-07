

import { useEffect, useState } from "react";
import { TbCategoryFilled } from "react-icons/tb";
import { serviceService } from "../../services";
import toast from "react-hot-toast";

export default function Booking() {
  const [statusFilter, setStatusFilter] = useState("All");
  const [openMenuId, setOpenMenuId] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const bookingsArr = await serviceService.getBookings();
        const userData = JSON.parse(localStorage.getItem("userData") || "{}");
        const myId = Number(userData.id);

        // Match booking against customer using any common field variant
        const myBookings = bookingsArr.filter(b => {
          const cid = Number(b.customer_id ?? b.customerId ?? b.Customer?.id ?? b.customer?.id ?? -1);
          return cid === myId;
        });
        setBookings(myBookings);
      } catch (err) {
        toast.error("Failed to load bookings");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  const handleCancel = async (id) => {
    try {
      await serviceService.updateBookingStatus(id, "Canceled");
      setBookings(prev => prev.map(b => b.id === id ? { ...b, status: "Canceled" } : b));
      toast.success("Booking canceled");
      setOpenMenuId(null);
    } catch (err) {
      toast.error("Failed to cancel booking");
    }
  };

  const filteredBookings =
    statusFilter === "All"
      ? bookings
      : bookings.filter((item) => item.status === statusFilter);

  return (
    <div className="px-6 pb-6 font-medium">
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 mb-8 flex justify-between items-center">
        <h1 className="text-xl font-bold text-sky-900">Booking List</h1>
      </div>


      <div className="border border-gray-300">
        <div className="m-5">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border px-4 py-1 rounded-md"
        >
          <option value="All">All</option>
          <option value="Pending">Pending</option>
          <option value="Done">Done</option>
          <option value="Canceled">Canceled</option>
        </select>
      </div>
   



      <table className="w-full text-sm text-left border-gray-300">
        <thead>
          <tr className="text-white" style={{ backgroundColor: "#04364A" }}>
            <th className="px-6 py-3">ID</th>
            <th className="px-6 py-3">Service</th>
            <th className="px-6 py-3">Booking Date</th>
            <th className="px-6 py-3">Service Date</th>
            <th className="px-6 py-3">Provider</th>
            <th className="px-6 py-3">Payment</th>
            <th className="px-6 py-3">Amount</th>
            <th className="px-6 py-3">Status</th>
            <th className="px-6 py-3 text-center">Action</th>
          </tr>
        </thead>

        <tbody>
          {loading ? (
             <tr><td colSpan="9" className="text-center py-10">Loading your bookings...</td></tr>
          ) : filteredBookings.map((item) => (
            <tr key={item.id} className="border border-x-0 border-gray-300 relative font-sm">
              <td className="px-6 py-3">{item.id}</td>
              <td className="px-6 py-3">{item.Service?.Service_title?.name || "Service"}</td>
              <td className="px-6 py-3">{item.booking_date ? new Date(item.booking_date).toLocaleString() : 'N/A'}</td>
              <td className="px-6 py-3">{item.service_date ? new Date(item.service_date).toLocaleString() : 'N/A'}</td>
              <td className="px-6 py-3">{item.Provider?.User?.name || item.Provider?.name || "Provider"}</td>
              <td className="px-6 py-3">Cash</td>
              <td className="px-6 py-3">{item.total_price || item.price || 0} LE</td>


              <td className="px-6 py-3">
                <span
                  className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest
                    ${item.status === "Pending" && "bg-yellow-50 text-yellow-600"}
                    ${item.status === "Done" && "bg-green-50 text-green-600"}
                    ${item.status === "Canceled" && "bg-red-50 text-red-600"}
                  `}
                >
                  {item.status}
                </span>
              </td>

              <td className="px-6 py-4 text-center relative">
                <button
                  onClick={() =>
                    setOpenMenuId(openMenuId === item.id ? null : item.id)
                  }
                  className="text-gray-400 hover:text-sky-900 transition-colors flex justify-center w-full"
                >
                  <TbCategoryFilled size={24} />
                </button>

                {openMenuId === item.id && (
                  <div className="absolute top-full mt-1 w-28 bg-white text-black rounded-xl shadow-2xl z-50 left-1/2 -translate-x-1/2 border border-gray-100 overflow-hidden py-1">
                    <button className="block w-full text-center px-4 py-2 text-xs font-bold hover:bg-gray-50 transition-colors">
                      View
                    </button>
                    {item.status === 'Pending' && (
                      <button
                        onClick={() => handleCancel(item.id)}
                        className="block w-full text-center px-4 py-2 text-xs font-bold text-red-600 hover:bg-red-50 transition-colors"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                )}
              </td>
            </tr>
          ))}

          {!loading && filteredBookings.length === 0 && (
            <tr>
              <td colSpan="9" className="text-center py-10 text-gray-400 italic">
                No bookings found
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <div className="flex justify-between items-center px-5 py-4 text-xs font-medium text-body">
          <div className="flex items-center gap-2">
            <span>Show</span>
            <input 
              type="number" 
              defaultValue="10" 
              className="border border-gray-300 rounded-md px-1 py-1 bg-white w-12 text-center focus:outline-none focus:ring-1 focus:ring-brand-primary"
            />
            <span>Entries</span>
          </div>
          
          <div className="flex items-center gap-1">
            <button className="p-2 text-gray-400 hover:text-black transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
              </svg>
            </button>
            <div className="bg-sky-900 text-white w-8 h-8 rounded flex items-center justify-center">1</div>
            <button className="p-2 text-gray-400 hover:text-black transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}
