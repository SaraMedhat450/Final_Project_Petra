import React from 'react';
import Header from './Header';
import Footer from './Footer';
import { useLocation } from "react-router-dom";

const Layout = ({ children }) => {
    const location = useLocation();

    const segments = location.pathname.split('/');
    const dashboardSubPaths = ["main", "points", "serviceList", "providerCalender", "dashboard", "bookingList", "payout", "profileAndSettings", "addService", "editService", "signup"];

    const hideLayout = 
    location.pathname.startsWith("/profile") ||
    location.pathname.startsWith("/login") ||
    location.pathname.startsWith("/signup") ||
    location.pathname.startsWith("/customer") ||
    (segments[1] === "provider" && (!segments[2] || dashboardSubPaths.includes(segments[2])));

    return (
        <div className="flex flex-col min-h-screen bg-gradient-to-br from-[#DAFFFB]/30 via-white to-[#DAFFFB]/20">
            {!hideLayout && <Header />}
            
            <main className={`flex-grow ${!hideLayout ? 'pt-20' : ''}`}>
                {children}
            </main>

            {!hideLayout && <Footer />}
        </div>
    );
};

export default Layout;