import { MdOutlineBookmarkAdded } from "react-icons/md";
import { FaClipboardList } from "react-icons/fa";

export default function BookingList() {
  // Simulate empty state (replace with real data check)
  const events = []

  return (
    <div className="p-6 min-h-full flex flex-col">
      {/* Header */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 mb-6 flex justify-between items-center">
        <h1 className="text-xl font-bold text-sky-900">Booking List</h1>
        <span className="text-sm text-gray-500">View and manage your service bookings</span>
      </div>

      {/* Zero State */}
      {events.length === 0 && (
        <div className="flex-1 flex flex-col items-center justify-center bg-white rounded-2xl border border-gray-100 shadow-sm py-10 px-6 text-center">
          {/* Icon */}
          <div className="relative mb-6">
            <div className="w-24 h-24 rounded-full bg-indigo-50 flex items-center justify-center">
              <FaClipboardList className="text-5xl text-indigo-500" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
              <MdOutlineBookmarkAdded className="text-indigo-600 text-sm" />
            </div>
          </div>

          <h2 className="text-2xl font-bold text-gray-800 mb-3">No Bookings Found</h2>
          <p className="text-gray-500 max-w-sm leading-relaxed">
            You haven’t made any bookings yet. Start by booking a service and it will show up here.
          </p>
        </div>
      )}
    </div>
  )
}
