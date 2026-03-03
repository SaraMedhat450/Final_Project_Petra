import React from 'react'
import { FaMoneyBillWave } from 'react-icons/fa'
import { MdOutlinePayments } from 'react-icons/md'
import { BsShieldCheck } from 'react-icons/bs'

export default function Payout() {
  // Simulate empty state (replace with real data check)
  const payments = []

  return (
    <div className="p-6 min-h-full flex flex-col">
      {/* Header */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 mb-6 flex justify-between items-center">
        <h1 className="text-xl font-bold text-sky-900">Payments</h1>
        <span className="text-sm text-gray-500">Manage your payment history</span>
      </div>

      {/* Zero State */}
      {payments.length === 0 && (
        <div className="flex-1 flex flex-col items-center justify-center bg-white rounded-2xl border border-gray-100 shadow-sm py-10 px-6 text-center">
          {/* Animated Icon */}
          <div className="relative mb-6">
            <div className="w-24 h-24 rounded-full bg-blue-50 flex items-center justify-center">
              <FaMoneyBillWave className="text-5xl text-blue-400" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <BsShieldCheck className="text-green-600 text-sm" />
            </div>
          </div>

          <h2 className="text-2xl font-bold text-gray-800 mb-3">No Payments Yet</h2>
          <p className="text-gray-500 max-w-sm leading-relaxed">
            Your payment history will appear here. Once you complete a booking, your transactions will be tracked securely.
          </p>

        </div>
      )}
    </div>
  )
}
