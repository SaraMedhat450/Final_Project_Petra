import React, { useState, useEffect } from 'react'
import { MdOutlineSpaceDashboard, MdOutlineTrendingUp, MdOutlineEventAvailable, MdOutlinePeople } from 'react-icons/md'
import { FaMoneyBillWave } from 'react-icons/fa'
import { BsGraphUp, BsStarFill } from 'react-icons/bs'
import { IoTimeOutline } from 'react-icons/io5'
import { serviceService } from "../../services";

export default function Dashboard() {
  const [stats, setStats] = useState({
    services: 0,
    bookings: 0,
    points: 0,
    rating: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const userData = JSON.parse(localStorage.getItem("userData") || "{}");
        const myId = Number(userData.id);

        const [servicesRes, providerRes, bookingsArr] = await Promise.all([
          serviceService.getAllServices().catch(() => ({ data: [] })),
          serviceService.getProviderData().catch(() => null),
          serviceService.getBookings()
        ]);

        const services = Array.isArray(servicesRes) ? servicesRes : (servicesRes?.data || []);
        const myServices = services.filter(s => Number(s.userid) === myId || Number(s.user_id) === myId);

        // Match booking against provider using any common field variant
        const myBookings = bookingsArr.filter(b => {
          const pid = Number(b.provider_id ?? b.providerId ?? b.Provider?.id ?? b.provider?.id ?? -1);
          return pid === myId;
        });

        setStats({
          services: myServices.length,
          bookings: myBookings.length,
          points:   Number(providerRes?.points ?? providerRes?.data?.points ?? 0),
          rating:   Number(providerRes?.rating ?? providerRes?.data?.rating ?? 0),
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
    { label: 'Total Services', value: stats.services, icon: <MdOutlineSpaceDashboard />, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Active Bookings', value: stats.bookings, icon: <MdOutlineEventAvailable />, color: 'text-teal-600', bg: 'bg-teal-50' },
    { label: 'Total Earnings', value: `${stats.points} LE`, icon: <FaMoneyBillWave />, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Profile Rating', value: stats.rating || '0.0', icon: <BsStarFill />, color: 'text-purple-600', bg: 'bg-purple-50' },
  ];

  return (
    <div className="p-6 min-h-full flex flex-col space-y-8">
      {/* Header */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 flex justify-between items-center">
        <div className="space-y-1">
          <h1 className="text-3xl font-black text-[#04364A]">Dashboard</h1>
          <p className="text-xs font-black uppercase tracking-widest text-[#64CCC5]">Performance Overview</p>
        </div>
        <div className="flex items-center gap-3 bg-gray-50 px-4 py-2 rounded-2xl border border-gray-100">
           <IoTimeOutline className="text-[#176B87]" />
           <span className="text-xs font-bold text-[#04364A]">{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}</span>
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

          {/* Activity Section */}
          <div className="flex-1 bg-white rounded-[2.5rem] border border-gray-100 shadow-sm p-10 flex flex-col items-center justify-center text-center">
             <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                <BsGraphUp className="text-4xl text-[#64CCC5]" />
             </div>
             <h3 className="text-2xl font-black text-[#04364A] mb-2">Welcome Back!</h3>
             <p className="text-gray-400 font-medium max-w-sm leading-relaxed mb-8">
               Your business is growing. Keep your services updated and respond to bookings quickly to boost your rating.
             </p>
             <button className="px-8 py-3 bg-[#04364A] text-white font-black uppercase tracking-widest text-[10px] rounded-2xl shadow-lg shadow-[#04364A]/20 hover:-translate-y-1 transition-all">
                View Reports
             </button>
          </div>
        </>
      )}
    </div>
  )
}
