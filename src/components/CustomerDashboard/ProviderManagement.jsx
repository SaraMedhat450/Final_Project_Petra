import React from 'react'
import { MdOutlineSpaceDashboard, MdOutlineTrendingUp, MdOutlineEventAvailable, MdOutlinePeople } from 'react-icons/md'
import { FaMoneyBillWave } from 'react-icons/fa'
import { BsGraphUp, BsStarFill } from 'react-icons/bs'
import { IoTimeOutline } from 'react-icons/io5'

export default function ProviderManagement() {
  // Simulate empty state (replace with real data check)
  const dashboardData = null

  return (
    <div className="p-6 min-h-full flex flex-col">
      {/* Header */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 mb-6 flex justify-between items-center">
        <h1 className="text-xl font-bold text-sky-900">Dashboard</h1>
        <span className="text-sm text-gray-500">Your activity overview</span>
      </div>

      {/* Zero State */}
      {!dashboardData && (
        <div className="flex-1 flex flex-col items-center justify-center bg-white rounded-2xl border border-gray-100 shadow-sm py-10 px-6 text-center">

          {/* Icon */}
          <div className="relative mb-6">
            <div className="w-24 h-24 rounded-full bg-cyan-50 flex items-center justify-center">
              <MdOutlineSpaceDashboard className="text-5xl text-cyan-500" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center">
              <BsGraphUp className="text-teal-600 text-sm" />
            </div>
          </div>

          <h2 className="text-2xl font-bold text-gray-800 mb-3">Welcome to Your Dashboard</h2>
          <p className="text-gray-500 max-w-md leading-relaxed">
            Your activity summary will appear here once you start using the platform. Book services or manage your providers to see real-time insights.
          </p>

        </div>
      )}
    </div>
  )
}
