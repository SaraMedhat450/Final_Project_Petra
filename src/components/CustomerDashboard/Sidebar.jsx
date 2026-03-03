import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  FaCoins,
  FaList,
  FaMoneyBillWave,
  FaUsersCog,
} from "react-icons/fa";
import { MdAdminPanelSettings, MdManageAccounts, MdOutlineEventAvailable } from "react-icons/md";
import { IoChevronDown, IoChevronUp, IoHome } from "react-icons/io5";
import { FiMenu } from "react-icons/fi";
import toast from 'react-hot-toast';
import { AlertCircle } from "lucide-react";

export default function Sidebar() {
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const handleLogout = () => {
    localStorage.clear();
    toast.success('Logged out successfully');
    navigate("/login");
  };

  const [userData, setUserData] = useState(null);
  const [openBooking, setOpenBooking] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("userData");
    if (storedUser) setUserData(JSON.parse(storedUser));
  }, []);

  return (
    <>
      {/* Toggle Button for Mobile */}
      <button
        className="sm:hidden fixed top-4 left-4 z-50 bg-[#04364A] p-2 rounded text-white"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        <FiMenu size={24} />
      </button>

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-40 h-full w-60 bg-[#04364A] text-white flex flex-col transform
          transition-transform duration-300
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          sm:translate-x-0 sm:static sm:h-auto
        `}
      >
        {/* User Info */}
        {userData && (
          <div className="p-4 border-b border-white/10 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-brand-light flex items-center justify-center">
              <span className="font-bold text-brand-primary">
                {userData.name?.[0]?.toUpperCase() || "U"}
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm break-all">{userData.email}</p>
              <span className="text-xs text-brand-secondary px-2 py-0.5 bg-brand-primary/20 rounded mt-1 capitalize">
                {localStorage.getItem("userRole") || "customer"}
              </span>
            </div>
          </div>
        )}

        {/* Menu */}
        <div className="flex-1 overflow-y-auto px-3 py-4 no-scrollbar space-y-2 text-sm">
          {/* Points */}
          <div className="flex items-center justify-between px-4 py-2 rounded-base hover:bg-brand-primary hover:text-white transition-colors">
            <div className="flex items-center gap-3">
              <FaList className="text-lg" />
              <span className="text-sm font-sm">Points</span>
            </div>
            <span className="bg-red-500 text-white text-sm px-2 py-0.5 rounded-full font-sm">
              545 LE
            </span>
          </div>

          {/* Main */}
          <Link
            to="/"
            className="flex items-center px-4 py-2 rounded-base hover:bg-brand-primary hover:text-white transition-colors"
          >
            <IoHome className="text-lg" />
            <span className="flex-1 ms-3 whitespace-nowrap text-sm font-sm">Home</span>
          </Link>

          {/* Booking Management */}
          <div>
            <button
              onClick={() => setOpenBooking(!openBooking)}
              className="flex items-center w-full px-4 py-2 rounded-base hover:bg-brand-primary hover:text-white transition-colors"
            >
              <MdOutlineEventAvailable className="text-lg" />
              <span className="flex-1 ms-3 text-sm font-sm text-left">Booking Management</span>
              {openBooking ? <IoChevronUp size={20} /> : <IoChevronDown size={20} />}
            </button>

            {openBooking && (
              <ul className="mt-1 ms-6 space-y-1 text-sm">
                <li>
                  <Link
                    to="/customer/booking"
                    className="block px-2 py-1 rounded hover:bg-brand-primary/80 focus:bg-brand-primary/80 transition-colors"
                  >
                    • Booking List
                  </Link>
                </li>
              </ul>
            )}
          </div>

          {/* Other Links */}
          {[
            { to: "/customer/provider", icon: <FaUsersCog className="text-lg" />, text: "Provider Management" },
            { to: "/customer/payout", icon: <FaMoneyBillWave className="text-lg" />, text: "Payout" },
            { to: "/customer/customersm", icon: <MdManageAccounts className="text-lg" />, text: "Customer Management" },
            { to: "/customer/system", icon: <MdAdminPanelSettings className="text-lg" />, text: "System Users" },
            { to: "/customer/cashback", icon: <FaCoins className="text-lg" />, text: "Points & Cashback Management" },
          ].map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="flex items-center px-4 py-2 rounded-base hover:bg-brand-primary hover:text-white transition-colors"
            >
              {link.icon}
              <span className="flex-1 ms-3 text-sm font-sm">{link.text}</span>
            </Link>
          ))}
        </div>

        {/* Logout */}
        <div className="p-4 border-t border-white/10">
            <button
              onClick={() => setShowLogoutModal(true)}
              className="w-full py-2 text-center rounded hover:bg-red-500/20 text-white hover:text-red-500"
            >
              Logout 
              <i className="fa-solid fa-arrow-right-from-bracket group-hover:text-red-400 ms-5"></i>
            </button>
          </div>
      </aside>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowLogoutModal(false)}></div>
          <div className="bg-white rounded-[2rem] shadow-2xl max-w-sm w-full relative z-[110] p-8 text-center animate-in zoom-in duration-300">
            <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle size={40} className="text-red-500" />
            </div>
            <h3 className="text-2xl font-black text-sky-900 mb-3">Sign Out?</h3>
            <p className="text-gray-500 mb-8 font-medium leading-relaxed">
              Are you sure you want to log out of your customer dashboard?
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 px-4 py-3 bg-gray-100 text-sky-900 font-bold rounded-2xl hover:bg-gray-200 transition-colors uppercase tracking-widest text-[11px]"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 px-4 py-3 bg-[#04364A] text-white font-bold rounded-2xl hover:bg-[#04364A]/90 shadow-lg shadow-[#04364A]/20 transition-all uppercase tracking-widest text-[11px]"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
