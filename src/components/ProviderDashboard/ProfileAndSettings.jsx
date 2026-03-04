import { useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import { MdOutlineSettings } from "react-icons/md";

export default function ProfileAndSettings() {
  const [user, setUser] = useState(null);

  return (
    <div className="p-6 min-h-full flex flex-col">
      
      {/* Header */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 mb-6 flex justify-between items-center">
        <h1 className="text-xl font-bold text-sky-900">
          Profile & Settings
        </h1>
        <span className="text-sm text-gray-500">
          Manage your personal information and account settings
        </span>
      </div>

      {/* Zero State */}
      {!user && (
        <div className="flex-1 flex flex-col items-center justify-center bg-white rounded-2xl border border-gray-100 shadow-sm py-10 px-6 text-center">
          
          {/* Icon */}
          <div className="relative mb-6">
            <div className="w-24 h-24 rounded-full bg-sky-50 flex items-center justify-center">
              <FaUserCircle className="text-5xl text-sky-500" />
            </div>

            <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-sky-100 rounded-full flex items-center justify-center">
              <MdOutlineSettings className="text-sky-600 text-sm" />
            </div>
          </div>

          <h2 className="text-2xl font-bold text-gray-800 mb-3">
            Profile Not Available
          </h2>

          <p className="text-gray-500 max-w-sm leading-relaxed">
            Your profile information is not loaded yet. Once your account details are available, you will be able to view and update your settings here.
          </p>
        </div>
      )}
      
    </div>
  );
}