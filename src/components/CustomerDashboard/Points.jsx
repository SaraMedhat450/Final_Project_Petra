import React from 'react'
import { FaCoins } from 'react-icons/fa'

export default function Points() {
  // Simulate empty state (replace with real data check)
  const points = []

  return (
    <div className="p-6 min-h-full flex flex-col">
      {/* Header */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 mb-6 flex justify-between items-center">
        <h1 className="text-xl font-bold text-sky-900">My Points</h1>
        <span className="text-sm text-gray-500">Earn points with every booking!</span>
      </div>

      {/* Zero State */}
      {points.length === 0 && (
        <div className="flex-1 flex flex-col items-center justify-center bg-white rounded-2xl border border-gray-100 shadow-sm py-10 px-6 text-center">
          {/* Animated Icon */}
          <div className="relative mb-6">
            <div className="w-24 h-24 rounded-full bg-amber-50 flex items-center justify-center animate-pulse">
              <FaCoins className="text-5xl text-amber-400" />
            </div>
            <span className="absolute -top-1 -right-1 w-6 h-6 bg-amber-400 rounded-full flex items-center justify-center text-white text-xs font-bold">0</span>
          </div>

          <h2 className="text-2xl font-bold text-gray-800 mb-3">No Points Yet</h2>
          <p className="text-gray-500 max-w-sm leading-relaxed">
            You haven't earned any points yet. Start booking services and collect points to unlock exclusive rewards!
          </p>

          Stats row
          <div className="mt-8 grid grid-cols-3 gap-4 w-full max-w-sm">
            {[
              { label: 'Total Points', value: '0' },
              { label: 'Redeemed', value: '0' },
              { label: 'Available', value: '0' },
            ].map((stat) => (
              <div key={stat.label} className="bg-amber-50 rounded-xl p-3 text-center">
                <p className="text-xl font-bold text-amber-500">{stat.value}</p>
                <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>

          <button className="mt-8 px-6 py-3 bg-[#04364A] text-white rounded-xl font-medium hover:bg-[#065a76] transition-colors duration-200 shadow-md">
            Book a Service Now
          </button>
        </div>
      )}
    </div>
  )
}
