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

const ACTIVE_BG = "bg-[#64ccc5] text-white";
const IDLE     = "hover:bg-[#64ccc5]/20 hover:text-white transition-colors";

export default function Sidebar() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const pathname  = location.pathname;

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const [userData,    setUserData]    = useState(null);
  const [openBooking, setOpenBooking] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [points,      setPoints]      = useState(0);

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

  // Other nav links array
  const navLinks = [
    { to: "/customer/customersm", icon: <MdOutlineCalendarMonth className="w-5 h-5 flex-shrink-0" />, text: "Customer Calender" },
    { to: "/customer/payout",     icon: <MdOutlinePayments      className="w-5 h-5 flex-shrink-0" />, text: "Payments" },
    { to: "/customer/cashback",   icon: <MdOutlineHistory       className="w-5 h-5 flex-shrink-0" />, text: "Points Transation History" },
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

          {/* Points — no active state (not a link) */}
          <div className="flex items-center justify-between px-4 py-2 rounded-lg">
            <div className="flex items-center gap-3">
              <BsAward className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm">Points</span>
            </div>
            <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
              {points} LE
            </span>
          </div>

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
            onClick={handleLogout}
            className="w-full py-2 text-center rounded-lg hover:bg-red-500/20 text-white hover:text-red-500 transition-colors"
          >
            Logout{" "}
            <i className="fa-solid fa-arrow-right-from-bracket ms-5"></i>
          </button>
        </div>
      </aside>
    </>
  );
}
