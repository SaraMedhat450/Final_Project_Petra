import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { FaCoins } from "react-icons/fa";
import {
  MdOutlineSpaceDashboard,
  MdOutlineEventNote,
  MdOutlineCalendarMonth,
  MdOutlinePayments,
  MdOutlineHistory,
  MdOutlineHome,
} from "react-icons/md";
import { BsAward } from "react-icons/bs";
import { IoChevronDown, IoChevronUp } from "react-icons/io5";
import { FiMenu } from "react-icons/fi";
import api from "../../services/api";
import { API_ENDPOINTS } from "../../config/api";
import toast from 'react-hot-toast';
import { AlertCircle } from "lucide-react";

const ACTIVE_BG = "bg-[#64ccc5]/50 text-white";
const IDLE     = "hover:bg-[#64ccc5]/20 hover:text-white transition-colors";

export default function Sidebar() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const pathname  = location.pathname;



  const [userData,    setUserData]    = useState(null);
  const [openBooking, setOpenBooking] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [points,      setPoints]      = useState(0);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("userData");
    if (storedUser) setUserData(JSON.parse(storedUser));
  }, []);

  // Auto-open Booking accordion if user is on a booking sub-page
  useEffect(() => {
    if (pathname.startsWith("/customer/booking")) setOpenBooking(true);
  }, [pathname]);

  // Fetch customer points from API
  useEffect(() => {
    const fetchPoints = async () => {
      try {
        const response = await api.get(API_ENDPOINTS.CUSTOMER_POINTS);
        const value =
          response.data?.points ??
          response.data?.data?.points ??
          response.data?.total_points ??
          0;
        setPoints(value);
      } catch (error) {
        console.error("Failed to fetch points:", error);
        setPoints(0);
      }
    };
    fetchPoints();
  }, []);

  // Helper: returns active or idle classes
  const linkClass = (to, exact = false) => {
    const isActive = exact ? pathname === to : pathname.startsWith(to);
    return `flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
      isActive ? ACTIVE_BG : IDLE
    }`;
  };

   const handleLogout = () => {
    localStorage.clear();
    toast.success('Logged out successfully');
    navigate("/login");
  };

  // Other nav links array
  const navLinks = [
    { to: "/customer/customersm", icon: <MdOutlineCalendarMonth className="w-5 h-5 flex-shrink-0" />, text: "Customer Calender" },
    { to: "/customer/payout",     icon: <MdOutlinePayments      className="w-5 h-5 flex-shrink-0" />, text: "Payments" },

  ];

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
          <Link 
            to="/customer/booking" 
            className="p-4 border-b border-white/10 flex items-center gap-3 hover:bg-white/5 transition-colors cursor-pointer"
          >
            <div className="w-10 h-10 rounded-full bg-brand-light flex items-center justify-center flex-shrink-0">
              <span className="font-bold text-brand-primary">
                {userData.name?.[0]?.toUpperCase() || "U"}
              </span>
            </div>
            <div className="min-w-0">
              <p className="text-sm truncate font-medium">{userData.name}</p>
              <p className="text-sm text-white-400 truncate">{userData.email}</p>
              <span className="text-[10px] text-brand-secondary px-2 py-0.5 bg-brand-primary/10 rounded mt-1 capitalize inline-block">
                customer
              </span>
            </div>
          </Link>
        )}

        {/* Menu */}
        <div className="flex-1 overflow-y-auto px-3 py-4 no-scrollbar space-y-1 text-sm">



          {/* Home */}
          <Link to="/" className={linkClass("/", true)}>
            <MdOutlineHome className="w-5 h-5 flex-shrink-0" />
            <span className="text-sm">Home</span>
          </Link>

          {/* Dashboard */}
          <Link to="/customer/provider" className={linkClass("/customer/provider")}>
            <MdOutlineSpaceDashboard className="w-5 h-5 flex-shrink-0" />
            <span className="text-sm">Dashboard</span>
          </Link>

          {/* Booking Management */}
          <div>
            <button
              onClick={() => setOpenBooking(!openBooking)}
              className={`flex items-center gap-3 w-full px-4 py-2 rounded-lg transition-colors ${
                pathname.startsWith("/customer/booking") ? ACTIVE_BG : IDLE
              }`}
            >
              <MdOutlineEventNote className="w-5 h-5 flex-shrink-0" />
              <span className="flex-1 text-sm text-left">Booking Management</span>
              {openBooking
                ? <IoChevronUp className="w-4 h-4 flex-shrink-0" />
                : <IoChevronDown className="w-4 h-4 flex-shrink-0" />}
            </button>

            {openBooking && (
              <ul className="mt-1 ms-8 space-y-1 text-sm">
                <li>
                  <Link
                    to="/customer/booking"
                    className={`block px-2 py-1 rounded transition-colors ${
                      pathname === "/customer/booking"
                        ? "bg-[#64ccc5]/30 text-white font-medium"
                        : "hover:bg-[#64ccc5]/20"
                    }`}
                  >
                    • Booking List
                  </Link>
                </li>
              </ul>
            )}
          </div>

          {/* Other Links */}
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={linkClass(link.to)}
            >
              {link.icon}
              <span className="text-sm">{link.text}</span>
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
              Are you sure you want to log out of your provider dashboard?
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