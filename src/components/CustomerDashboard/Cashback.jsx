import React from 'react'
import { MdOutlineCurrencyExchange } from 'react-icons/md'
import { FiPercent } from 'react-icons/fi'

export default function Cashback() {
  // Simulate empty state (replace with real data check)
  const transactions = []

  return (
    <div className="p-6 min-h-full flex flex-col">
      {/* Header */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 mb-6 flex justify-between items-center">
        <h1 className="text-xl font-bold text-sky-900">Points Transaction History</h1>
        <span className="text-sm text-gray-500">Track all your cashback & rewards</span>
      </div>

      {/* Zero State */}
      {transactions.length === 0 && (
        <div className="flex-1 flex flex-col items-center justify-center bg-white rounded-2xl border border-gray-100 shadow-sm py-10 px-6 text-center">
          {/* Animated Icon */}
          <div className="relative mb-6">
            <div className="w-24 h-24 rounded-full bg-green-50 flex items-center justify-center">
              <MdOutlineCurrencyExchange className="text-5xl text-green-500" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <FiPercent className="text-green-600 text-sm" />
            </div>
          </div>

          <h2 className="text-2xl font-bold text-gray-800 mb-3">No Transactions Yet</h2>
          <p className="text-gray-500 max-w-sm leading-relaxed">
            Your cashback and points transaction history will appear here once you start making bookings.
          </p>
        </div>
      )}
    </div>
  )
}
