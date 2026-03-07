import React, { useState, useEffect } from 'react'
import { FaCoins } from 'react-icons/fa'
import api from "../../services/api";
import { API_ENDPOINTS } from "../../config/api";

export default function Points() {
  const [points, setPoints] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPoints = async () => {
      try {
        const response = await api.get(API_ENDPOINTS.CUSTOMER_POINTS);
        const value = response.data?.points ?? response.data?.data?.points ?? 0;
        setPoints(value);
      } catch (error) {
        console.error("Failed to fetch points:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPoints();
  }, []);

  return (
    <div className="p-6 min-h-full flex flex-col space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex justify-between items-center">
        <h1 className="text-2xl font-black text-[#04364A]">My Rewards</h1>
        <div className="bg-amber-50 px-4 py-2 rounded-xl text-amber-700 text-xs font-black uppercase tracking-widest flex items-center gap-2">
           <FaCoins size={14} /> {points} Total Points
        </div>
      </div>

      {loading ? (
        <div className="flex-1 flex items-center justify-center py-20">
           <div className="w-12 h-12 border-4 border-[#64CCC5] border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center bg-white rounded-[2.5rem] border border-gray-100 shadow-sm py-20 px-6 text-center">
          {/* Animated Icon */}
          <div className="relative mb-10">
            <div className="w-32 h-32 rounded-full bg-amber-50 flex items-center justify-center animate-bounce duration-[2000ms]">
              <FaCoins className="text-7xl text-amber-400" />
            </div>
            <span className="absolute -top-2 -right-2 w-10 h-10 bg-[#04364A] rounded-full flex items-center justify-center text-white text-sm font-black border-4 border-white">
              {points}
            </span>
          </div>

          <h2 className="text-3xl font-black text-[#04364A] mb-3">
            {points > 0 ? "You're a Star!" : "Start Your Journey"}
          </h2>
          <p className="text-gray-400 font-medium max-w-sm leading-relaxed mb-10">
            {points > 0 
              ? `You have earned ${points} loyalty points. Use them to get discounts on your future home services!` 
              : "You haven't earned any points yet. Book your first service today to start collecting rewards!"}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-2xl mb-12">
            {[
              { label: 'Available Points', value: points, color: 'text-amber-500', bg: 'bg-amber-50' },
              { label: 'Redeemed', value: '0', color: 'text-gray-400', bg: 'bg-gray-50' },
              { label: 'Member Level', value: points > 1000 ? 'Gold' : 'Silver', color: 'text-[#64CCC5]', bg: 'bg-[#DAFFFB]' },
            ].map((stat, idx) => (
              <div key={idx} className={`${stat.bg} rounded-[2rem] p-6 text-center border border-gray-50`}>
                <p className={`text-2xl font-black ${stat.color}`}>{stat.value}</p>
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>

          <button className="px-10 py-4 bg-[#04364A] text-white font-black uppercase tracking-widest text-xs rounded-2xl shadow-xl shadow-[#04364A]/20 hover:-translate-y-1 transition-all">
            Book a Service Now
          </button>
        </div>
      )}
    </div>
  )
}
