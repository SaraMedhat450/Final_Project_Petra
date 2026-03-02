
import Sidebar from "../components/CustomerDashboard/Sidebar";
import { Outlet } from "react-router-dom";

export default function Customer() {
  return (
    <div className="flex flex-col h-screen">
      
      {/* <Navbar /> */}

      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 bg-gray-100 p-6 overflow-auto">
          <Outlet />  
        </main>
      </div>
    </div>
  );
}