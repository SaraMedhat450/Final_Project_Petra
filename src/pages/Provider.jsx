import { useState, useEffect } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { GrServices } from "react-icons/gr";
import { MdOutlineEventAvailable, MdManageAccounts, MdOutlineHome, MdOutlineSpaceDashboard, MdOutlineCalendarMonth } from "react-icons/md";
import { HiMenuAlt2, HiX } from "react-icons/hi";
import { serviceService } from "../services";
import toast from 'react-hot-toast';
import { AlertCircle } from "lucide-react";
import { BsAward } from "react-icons/bs";

export default function Provider() {
  const [openMenu, setOpenMenu] = useState(null);
  const [userData, setUserData] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [points, setPoints] = useState(0);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("userData");
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      setUserData(parsed);
      
      const fetchPoints = async () => {
        try {
          const data = await serviceService.getProviderData();
          if (data && data.points !== undefined) {
             setPoints(data.points);
          }
        } catch (error) {
          console.error("Error fetching provider points:", error);
        }
      };
      
      fetchPoints();
    }
  }, []);

  const toggleMenu = (menu) => {
    setOpenMenu(openMenu === menu ? null : menu);
  };

  const handleLogout = () => {
    localStorage.clear();
    toast.success('Logged out successfully');
    navigate("/login");
  };

  return (
    <div className="flex relative min-h-screen">

      {/* ===== Mobile Menu Button ===== */}
      <button
        onClick={() => setIsSidebarOpen(true)}
        className="sm:hidden fixed top-4 left-4 z-50 text-white bg-brand-primary p-2 rounded-md"
      >
        <HiMenuAlt2 size={22} />
      </button>

      {/* ===== Overlay (Mobile) ===== */}
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 bg-black/50 z-30 sm:hidden"
        />
      )}

      {/* ===== Sidebar ===== */}
      <aside
        className={`
          fixed top-0 left-0 z-40 h-screen w-60
          bg-[#04364A] text-white
          transition-transform duration-300
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
          sm:translate-x-0
        `}
      >
        <div className="flex flex-col h-full">

          {/* Close button (mobile) */}
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="sm:hidden absolute top-4 right-4 text-white"
          >
            <HiX size={22} />
          </button>

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
                  {localStorage.getItem("userRole") || "provider"}
                </span>
              </div>
            </div>
          )}

          {/* Menu */}
          <ul className="flex-1 overflow-y-auto px-3 py-4 space-y-2 text-sm">

            <li className="flex items-center justify-between px-3 py-2 rounded hover:bg-[#64ccc5]/20  focus:bg-[#64ccc5]/50">
              <div className="flex items-center gap-2">
                <BsAward className="w-5 h-5 flex-shrink-0" />
                <span>Points</span>
              </div>
              <span className="bg-red-500 px-2 py-0.5 rounded-full text-xs">
                {points} LE
              </span>
            </li>

            <SidebarLink to="/"icon={<MdOutlineHome className="w-5 h-5 flex-shrink-0" />} text="Home" />

            <SidebarLink
              to="/provider/dashboard"
              icon={<MdOutlineSpaceDashboard className="w-5 h-5 flex-shrink-0" />}
              text="Dashboard"
            />

            <SidebarLink
              to="/provider/providerCalender"
              icon={<MdOutlineCalendarMonth className="w-5 h-5 flex-shrink-0" />}
              text="Provider Calender"
            />

            {/* Service Management */}
            <li>
              <button
                onClick={() => toggleMenu("service")}
                className="flex items-center w-full px-3 py-2 rounded hover:bg-[#64ccc5]/20  focus:bg-[#64ccc5]/50"
              >
                <GrServices className=" text-lg font-lg"/>
                <span className="ms-3 flex-1 text-left">Service Management</span>
              </button>

              {openMenu === "service" && (
                <ul className="ms-8 mt-1 space-y-1 text-sm">
                  <li>
                    <Link to="/provider/serviceList" className="block hover:bg-[#64ccc5]/20 focus:bg-[#64ccc5]/50">
                      • My Services
                    </Link>
                  </li>
                  <li>
                    <Link to="/provider/addService" className="block hover:bg-[#64ccc5]/20 focus:bg-[#64ccc5]/50">
                      • Service Requests
                    </Link>
                  </li>
                </ul>
              )}
            </li>

            {/* Booking Management */}
            <li>
              <button
                onClick={() => toggleMenu("booking")}
                className="flex items-center w-full px-3 py-2 rounded hover:bg-[#64ccc5]/20  focus:bg-[#64ccc5]/50"
              >
                <MdOutlineEventAvailable className="text-lg font-lg"/>
                <span className="ms-3 flex-1 text-left">Booking Management</span>
              </button>

              {openMenu === "booking" && (
                <ul className="ms-8 mt-1 space-y-1 text-sm">
                  <li>
                    <Link to="/provider/bookingList" className="block hover:bg-[#64ccc5]/20 focus:bg-[#64ccc5]/50">
                      • Booking List
                    </Link>
                  </li>
                  <li>
                    <Link to="/provider/payout" className="block hover:bg-[#64ccc5]/20 focus:bg-[#64ccc5]/50">
                      • Payments List
                    </Link>
                  </li>
                </ul>
              )}
            </li>


            <SidebarLink
              to="/provider/profileAndSettings"
              icon={<MdManageAccounts className="text-lg font-lg"/>}
              text="Profile & Settings"
            />

          </ul>

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
        </div>
      </aside>

      {/* ===== Main Content ===== */}
      <main className="flex-1 sm:ml-60 p-4">
        <Outlet />
      </main>

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
    </div>
  );
}

/* ===== Reusable Link Component ===== */
function SidebarLink({ to, icon, text }) {
  return (
    <li>
      <Link
        to={to}
        className="flex items-center px-3 py-2 rounded hover:bg-[#64ccc5]/20  focus:bg-[#64ccc5]/50"
      >
        {icon}
        <span className="ms-3">{text}</span>
      </Link>
    </li>
  );
}
