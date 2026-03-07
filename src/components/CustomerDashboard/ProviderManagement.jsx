import React, { useState, useEffect } from 'react'
import { MdOutlineSpaceDashboard, MdOutlineTrendingUp, MdOutlineEventAvailable, MdOutlineFavorite } from 'react-icons/md'
import { FaCoins } from 'react-icons/fa'
import { BsGraphUp, BsCalendarCheck } from 'react-icons/bs'
import { IoTimeOutline } from 'react-icons/io5'
import { serviceService } from "../../services";
import api from "../../services/api";
import { API_ENDPOINTS } from "../../config/api";

export default function ProviderManagement() {
  const [stats, setStats] = useState({
    bookings: 0,
    activeBookings: 0,
    points: 0,
    pendingBookings: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const userData = JSON.parse(localStorage.getItem("userData") || "{}");
        const myId = Number(userData.id);

        const [bookingsArr, pointsRes] = await Promise.all([
          serviceService.getBookings(),
          api.get(API_ENDPOINTS.CUSTOMER_POINTS).catch(() => ({ data: { points: 0 } }))
        ]);

        // Match booking against customer using any common field variant
        const myBookings = bookingsArr.filter(b => {
          const cid = Number(b.customer_id ?? b.customerId ?? b.Customer?.id ?? b.customer?.id ?? -1);
          return cid === myId;
        });

        const done    = myBookings.filter(b => b.status === 'Done'    || b.status === 'done').length;
        const pending = myBookings.filter(b => b.status === 'Pending' || b.status === 'pending').length;

        setStats({
          bookings:       myBookings.length,
          activeBookings: done,
          points:         Number(pointsRes.data?.points ?? pointsRes.data?.data?.points ?? 0),
          pendingBookings: pending,
        });
      } catch (err) {
        console.error("Dashboard stats error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const statCards = [
    { label: 'Total Bookings', value: stats.bookings, icon: <BsCalendarCheck />, color: 'text-sky-600', bg: 'bg-sky-50' },
    { label: 'Pending Requests', value: stats.pendingBookings, icon: <IoTimeOutline />, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Completed', value: stats.activeBookings, icon: <MdOutlineEventAvailable />, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Loyalty Points', value: `${stats.points} pts`, icon: <FaCoins />, color: 'text-purple-600', bg: 'bg-purple-50' },
  ];

  return (
    <div className="p-6 min-h-full flex flex-col space-y-8">
      {/* Header */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 flex justify-between items-center">
        <div className="space-y-1">
          <h1 className="text-3xl font-black text-[#04364A]">Dashboard</h1>
          <p className="text-xs font-black uppercase tracking-widest text-[#64CCC5]">Your Activity Hub</p>
        </div>
        <div className="hidden sm:flex items-center gap-3 bg-gray-50 px-4 py-2 rounded-2xl border border-gray-100">
           <span className="text-xs font-bold text-[#04364A]">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</span>
        </div>
      </div>

      {loading ? (
        <div className="flex-1 flex items-center justify-center py-20">
           <div className="w-12 h-12 border-4 border-[#64CCC5] border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <>
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {statCards.map((card, idx) => (
              <div key={idx} className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-md transition-all group">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 ${card.bg} ${card.color} rounded-2xl flex items-center justify-center text-2xl transition-transform group-hover:scale-110`}>
                    {card.icon}
                  </div>
                  <MdOutlineTrendingUp className="text-gray-200 text-xl" />
                </div>
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">{card.label}</p>
                <h3 className="text-2xl font-black text-[#04364A]">{card.value}</h3>
              </div>
            ))}
          </div>

          {/* Welcome Section */}
          <div className="flex-1 bg-white rounded-[2.5rem] border border-gray-100 shadow-sm p-10 flex flex-col items-center justify-center text-center">
             <div className="w-24 h-24 bg-[#DAFFFB] rounded-full flex items-center justify-center mb-6">
                <MdOutlineFavorite className="text-4xl text-[#176B87]" animate-pulse />
             </div>
             <h3 className="text-2xl font-black text-[#04364A] mb-2">Ready for your next service?</h3>
             <p className="text-gray-400 font-medium max-w-sm leading-relaxed mb-8">
               Manage your bookings, track your points and find the best professionals for your home needs.
             </p>
             <div className="flex gap-4">
               <button className="px-8 py-3 bg-[#04364A] text-white font-black uppercase tracking-widest text-[10px] rounded-2xl shadow-lg shadow-[#04364A]/20 hover:-translate-y-1 transition-all">
                  Book A Service
               </button>
               <button className="px-8 py-3 bg-gray-50 text-[#04364A] font-black uppercase tracking-widest text-[10px] rounded-2xl border border-gray-100 hover:bg-gray-100 transition-all">
                  See History
               </button>
             </div>
          </div>
        </>
      )}
    </div>
  )
}
