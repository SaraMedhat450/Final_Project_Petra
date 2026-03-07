import { useEffect, useState } from "react";
import { MdOutlineBookmarkAdded, MdCheckCircle, MdCancel } from "react-icons/md";
import { FaClipboardList } from "react-icons/fa";
import { serviceService } from "../../services";
import toast from "react-hot-toast";

export default function BookingList() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    try {
      const bookingsArr = await serviceService.getBookings();
      const userData = JSON.parse(localStorage.getItem("userData") || "{}");
      const myId = Number(userData.id);

      // Match booking against provider using any common field variant
      const myBookings = bookingsArr.filter(b => {
        const pid = Number(b.provider_id ?? b.providerId ?? b.Provider?.id ?? b.provider?.id ?? -1);
        return pid === myId;
      });
      setBookings(myBookings.sort((a, b) => b.id - a.id));
    } catch (err) {
      toast.error("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await serviceService.updateBookingStatus(id, newStatus);
      setBookings(prev => prev.map(b => b.id === id ? { ...b, status: newStatus } : b));
      toast.success(`Booking ${newStatus.toLowerCase()}ed`);
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  return (
    <div className="p-6 min-h-full flex flex-col space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex justify-between items-center">
        <h1 className="text-2xl font-black text-[#04364A]">Booking Management</h1>
        <div className="bg-sky-50 px-4 py-2 rounded-xl text-sky-700 text-xs font-black uppercase tracking-widest">
           {bookings.length} Total Bookings
        </div>
      </div>

      {loading ? (
        <div className="flex-1 flex items-center justify-center py-20">
           <div className="w-12 h-12 border-4 border-[#64CCC5] border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : bookings.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center bg-white rounded-3xl border border-gray-100 shadow-sm py-20 px-6 text-center">
          <div className="w-24 h-24 rounded-full bg-gray-50 flex items-center justify-center mb-6">
            <FaClipboardList className="text-4xl text-gray-300" />
          </div>
          <h2 className="text-2xl font-black text-[#04364A] mb-2">No active bookings</h2>
          <p className="text-gray-400 font-medium max-w-sm">
            You don't have any customer requests right now. New bookings will appear here.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-[#04364A] text-white text-[10px] font-black uppercase tracking-widest">
                  <th className="px-6 py-4">ID</th>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Service</th>
                  <th className="px-6 py-4">Requested For</th>
                  <th className="px-6 py-4">Total</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {bookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-xs font-bold text-gray-400">#{booking.id}</td>
                    <td className="px-6 py-4">
                       <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-teal-50 flex items-center justify-center text-teal-600 font-black text-[10px]">
                             {booking.Customer?.User?.name?.[0] || 'C'}
                          </div>
                          <span className="text-xs font-bold text-[#04364A]">{booking.Customer?.User?.name || "Customer"}</span>
                       </div>
                    </td>
                    <td className="px-6 py-4 text-xs font-bold text-[#04364A]">
                      {booking.Service?.Service_title?.name || "Service"}
                    </td>
                    <td className="px-6 py-4">
                       <div className="text-xs font-bold text-[#04364A]">
                          {booking.service_date ? new Date(booking.service_date).toLocaleDateString() : 'TBD'}
                       </div>
                       <div className="text-[10px] text-gray-400 uppercase font-black">
                          {booking.day_of_week}
                       </div>
                    </td>
                    <td className="px-6 py-4 text-xs font-black text-[#176B87]">
                      {booking.total_price} LE
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider
                        ${booking.status === 'Pending' ? 'bg-amber-50 text-amber-600' : 
                          booking.status === 'Accepted' || booking.status === 'Done' ? 'bg-green-50 text-green-600' : 
                          'bg-red-50 text-red-600'}`}>
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                       {booking.status === 'Pending' ? (
                          <div className="flex items-center justify-center gap-2">
                             <button 
                               onClick={() => handleStatusUpdate(booking.id, 'Accepted')}
                               className="w-8 h-8 rounded-lg bg-green-50 text-green-600 flex items-center justify-center hover:bg-green-600 hover:text-white transition-all shadow-sm"
                               title="Accept"
                             >
                                <MdCheckCircle size={18} />
                             </button>
                             <button 
                               onClick={() => handleStatusUpdate(booking.id, 'Rejected')}
                               className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center hover:bg-red-600 hover:text-white transition-all shadow-sm"
                               title="Reject"
                             >
                                <MdCancel size={18} />
                             </button>
                          </div>
                       ) : (
                          <div className="text-center text-[10px] font-black text-gray-300 uppercase italic">
                             Action Taken
                          </div>
                       )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
