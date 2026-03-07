import React, { useState, useEffect } from 'react'
import { FaMoneyBillWave } from 'react-icons/fa'
import { MdOutlinePayments } from 'react-icons/md'
import { BsShieldCheck } from 'react-icons/bs'
import { serviceService } from "../../services";

export default function Payout() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const bookingsArr = await serviceService.getBookings();
        const userData = JSON.parse(localStorage.getItem("userData") || "{}");
        const myId = Number(userData.id);

        const history = bookingsArr.filter(b => {
          const cid = Number(b.customer_id ?? b.customerId ?? b.Customer?.id ?? b.customer?.id ?? -1);
          const status = (b.status || '').toLowerCase();
          return cid === myId && (status === 'done' || status === 'accepted' || status === 'completed');
        });
        setPayments(history.sort((a, b) => b.id - a.id));
      } catch (err) {
        console.error("Payout error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPayments();
  }, []);

  return (
    <div className="p-6 min-h-full flex flex-col space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex justify-between items-center">
        <h1 className="text-2xl font-black text-[#04364A]">Transaction History</h1>
        <div className="bg-blue-50 px-4 py-2 rounded-xl text-blue-700 text-xs font-black uppercase tracking-widest">
           Secure Payments
        </div>
      </div>

      {loading ? (
        <div className="flex-1 flex items-center justify-center py-20">
           <div className="w-12 h-12 border-4 border-[#64CCC5] border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : payments.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center bg-white rounded-3xl border border-gray-100 shadow-sm py-20 px-6 text-center">
          <div className="w-24 h-24 rounded-full bg-gray-50 flex items-center justify-center mb-6">
            <FaMoneyBillWave className="text-4xl text-gray-300" />
          </div>
          <h2 className="text-2xl font-black text-[#04364A] mb-2">No Transactions</h2>
          <p className="text-gray-400 font-medium max-w-sm leading-relaxed">
            Your payment history is empty. Once you complete your first booking, the details will appear here.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[#04364A] text-white text-[10px] font-black uppercase tracking-widest">
                <th className="px-6 py-4">Transaction ID</th>
                <th className="px-6 py-4">Service</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {payments.map((pay) => (
                <tr key={pay.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-xs font-bold text-gray-400">#TRX-{pay.id}</td>
                  <td className="px-6 py-4 text-xs font-bold text-[#04364A]">
                    {pay.Service?.Service_title?.name}
                  </td>
                  <td className="px-6 py-4 text-xs font-bold text-gray-500">
                    {new Date(pay.created_at || pay.booking_date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-xs font-black text-indigo-600">
                    {pay.total_price} LE
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5 text-green-600 text-[9px] font-black uppercase tracking-wider bg-green-50 px-2 py-1 rounded-full w-fit">
                       <BsShieldCheck size={10} /> Verified
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
