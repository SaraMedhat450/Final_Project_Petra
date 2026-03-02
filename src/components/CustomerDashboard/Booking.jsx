

import { useState } from "react";
import { TbCategoryFilled } from "react-icons/tb";
export default function Booking() {
  const [statusFilter, setStatusFilter] = useState("All");
  const [openMenuId, setOpenMenuId] = useState(null);

  const bookings = [
    { id: 1, service: "Cleaning", bookingDate: "10/2/2026 - 10:00", serviceDate: "12/2/2026 - 12:00", provider: "Ahmed", payment: "Cash", amount: "$200", status: "Pending" },
    { id: 2, service: "Plumbing", bookingDate: "11/2/2026 - 09:00", serviceDate: "13/2/2026 - 11:00", provider: "Mohamed", payment: "Visa", amount: "$350", status: "Done" },
    { id: 3, service: "Electricity", bookingDate: "12/2/2026 - 02:00", serviceDate: "14/2/2026 - 04:00", provider: "Ali", payment: "Cash", amount: "$150", status: "Canceled" },
    { id: 4, service: "Electricity", bookingDate: "12/2/2026 - 02:00", serviceDate: "14/2/2026 - 04:00", provider: "Ali", payment: "Cash", amount: "$150", status: "Canceled" },
    { id: 5, service: "Electricity", bookingDate: "12/2/2026 - 02:00", serviceDate: "14/2/2026 - 04:00", provider: "Ali", payment: "Cash", amount: "$150", status: "Canceled" },
    { id: 6, service: "Plumbing", bookingDate: "11/2/2026 - 09:00", serviceDate: "13/2/2026 - 11:00", provider: "Mohamed", payment: "Visa", amount: "$350", status: "Done" },
  ];

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
          {filteredBookings.map((item) => (

            <tr key={item.id} className="border border-x-0 border-gray-300 relative font-sm">
              <td className="px-6 py-3">{item.id}</td>
              <td className="px-6 py-3">{item.service}</td>
              <td className="px-6 py-3">{item.bookingDate}</td>
              <td className="px-6 py-3">{item.serviceDate}</td>
              <td className="px-6 py-3">{item.provider}</td>
              <td className="px-6 py-3">{item.payment}</td>
              <td className="px-6 py-3">{item.amount}</td>


              <td className="px-6 py-3">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium uppercase
                    ${item.status === "Pending" && "bg-yellow-100 text-yellow-700"}
                    ${item.status === "Done" && "bg-green-100 text-green-700"}
                    ${item.status === "Canceled" && "bg-red-100 text-red-700"}
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
                  className="text-gray-700 hover:text-sky-900/70 flex justify-center w-full"
                >
                  <TbCategoryFilled size={28} />
                </button>

                {openMenuId === item.id && (
                  <div className="absolute top-full mt-1 w-28 bg-white text-black rounded-md shadow-lg z-10 left-1/2 -translate-x-1/2">
                    <button className="block w-full text-center px-3 py-2 hover:bg-gray-200">
                      View
                    </button>
                    <button
                      onClick={() => setOpenMenuId(null)}
                      className="block w-full text-center px-3 py-2 hover:bg-gray-200"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </td>
            </tr>
          ))}

          {filteredBookings.length === 0 && (
            <tr>
              <td colSpan="9" className="text-center py-6">
                No data found
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
