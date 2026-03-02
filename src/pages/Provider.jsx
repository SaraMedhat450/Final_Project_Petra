import { useState, useEffect } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { IoHome } from "react-icons/io5";
import { FaCoins, FaList, FaMoneyBillWave } from "react-icons/fa6";
import { FaUsersCog } from "react-icons/fa";
import { BiCategoryAlt } from "react-icons/bi";
import { GrServices } from "react-icons/gr";
import { MdOutlineEventAvailable, MdManageAccounts, MdAdminPanelSettings } from "react-icons/md";
import { GiTakeMyMoney } from "react-icons/gi";
import { HiMenuAlt2, HiX } from "react-icons/hi";

export default function Provider() {
  const [openMenu, setOpenMenu] = useState(null);
  const [userData, setUserData] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("userData");
    if (storedUser) setUserData(JSON.parse(storedUser));
  }, []);

  const toggleMenu = (menu) => {
    setOpenMenu(openMenu === menu ? null : menu);
  };

  const handleLogout = () => {
    localStorage.clear();
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
              <div>
                <p className="text-sm truncate">{userData.email}</p>
                <span className="text-xs text-brand-secondary px-2 py-0.5 bg-brand-primary/20 rounded mt-1 capitalize">
                  {localStorage.getItem("userRole") || "provider"}
                </span>
              </div>
            </div>
          )}

          {/* Menu */}
          <ul className="flex-1 overflow-y-auto px-3 py-4 space-y-2 text-sm">

            <li className="flex items-center justify-between px-3 py-2 rounded hover:bg-brand-primary  focus:bg-brand-primary/80">
              <div className="flex items-center gap-2">
                <FaList className="text-lg"/>
                <span>Points</span>
              </div>
              <span className="bg-red-500 px-2 py-0.5 rounded-full text-xs">
                545 LE
              </span>
            </li>

            <SidebarLink to="/" icon={<IoHome className="text-lg"/>} text="Home" />

            <SidebarLink
              to="/provider/categoryManagement"
              icon={<BiCategoryAlt className="text-lg font-lg"/>}
              text="Category Management"
            />

            {/* Service Management */}
            <li>
              <button
                onClick={() => toggleMenu("service")}
                className="flex items-center w-full px-3 py-2 rounded hover:bg-brand-primary  focus:bg-brand-primary/80"
              >
                <GrServices className=" text-lg font-lg"/>
                <span className="ms-3 flex-1 text-left">Service Management</span>
              </button>

              {openMenu === "service" && (
                <ul className="ms-8 mt-1 space-y-1 text-sm">
                  <li>
                    <Link to="/provider/serviceList" className="block hover:text-brand-secondary hover:bg-brand-primary focus:bg-brand-primary/80">
                      • Services List
                    </Link>
                  </li>
                  <li>
                    <Link to="/provider/addService" className="block hover:text-brand-secondary hover:bg-brand-primary focus:bg-brand-primary/80">
                      • Add Service
                    </Link>
                  </li>
                </ul>
              )}
            </li>

            <SidebarLink
              to="/provider/bookingManagement"
              icon={<MdOutlineEventAvailable className="text-lg font-lg"/>}
              text="Booking Management"
            />

            <SidebarLink
              to="/provider/providersManagement"
              icon={<FaUsersCog className="text-lg font-lg"/>}
              text="Providers Management"
            />

            <SidebarLink
              to="/provider/payout"
              icon={<FaMoneyBillWave className="text-lg font-lg"/>}
              text="Payout"
            />

            <SidebarLink
              to="/provider/customerManagement"
              icon={<MdManageAccounts className="text-lg font-lg"/>}
              text="Customer Management"
            />

            <SidebarLink
              to="/provider/systemUsers"
              icon={<MdAdminPanelSettings className="text-lg font-lg"/>}
              text="System Users"
            />

            <SidebarLink
              to="/provider/cashbackManagement"
              icon={<FaCoins className="text-lg font-lg"/>}
              text="Points & Cashback"
            />
          </ul>

          {/* Logout */}
          <div className="p-4 border-t border-white/10">
            <button
              onClick={handleLogout}
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
    </div>
  );
}

/* ===== Reusable Link Component ===== */
function SidebarLink({ to, icon, text }) {
  return (
    <li>
      <Link
        to={to}
        className="flex items-center px-3 py-2 rounded hover:bg-brand-primary  focus:bg-brand-primary/80"
      >
        {icon}
        <span className="ms-3">{text}</span>
      </Link>
    </li>
  );
}
