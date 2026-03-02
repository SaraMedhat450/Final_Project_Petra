import React from 'react';
import Header from './Header';
import Footer from './Footer';
import { useLocation } from "react-router-dom";

const Layout = ({ children }) => {
    const location = useLocation();

    const hideLayout = 
    location.pathname.startsWith("/profile") ||
    location.pathname.startsWith("/login") ||
    location.pathname.startsWith("/signup") ||
    location.pathname.startsWith("/customer") ||
    location.pathname.startsWith("/provider");

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