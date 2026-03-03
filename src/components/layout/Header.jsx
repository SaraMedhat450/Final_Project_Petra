import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { User, LogOut, Menu, X, Search, Bell, ChevronDown, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { API_ENDPOINTS, UPLOAD_URL } from '@/config/api';
import { logout as logoutAction } from '@/store/slices/authSlice';

const UserAvatar = ({ user }) => {
    let src = null;

    if (user?.image) {
        if (user.image.startsWith('http')) {
            src = user.image;
        } else {
            const clean = user.image.replace(/^["']|["']$/g, '').replace(/\\"/g, '"').trim();
            src = `${UPLOAD_URL}/${clean}`;
        }
    }

    if (!src) return <User size={20} />;

    return (
        <img
            src={src}
            alt="avatar"
            className="w-full h-full object-cover"
            onError={(e) => {
                e.target.onerror = null;
                e.target.style.display = 'none';
                e.target.parentNode.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-user px-1"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>';
            }}
        />
    );
};

const Header = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isSignUpDropdownOpen, setIsSignUpDropdownOpen] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const { isAuthenticated, user } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const getDashboardPath = () => {
        if (!isAuthenticated || !user) return '/login';
        // Check role from user object or localStorage as fallback
        const role = user.role || localStorage.getItem('userRole');
        if (role === 'provider') return '/provider/serviceList';
        if (role === 'customer') return '/customer/main';
        return '/profile';
    };

    const navLinks = [
        { name: 'HOME', path: '/' },
        { name: 'CATEGORY', path: '/categories' },
        { name: 'SERVICE', path: '/services' },
        { name: 'PROVIDERS', path: '/providers' },
        { name: 'CONTACT US', path: '/contact' },
    ];

    const handleLogout = () => {
        dispatch(logoutAction());
        toast.success("Logged out successfully");
        setShowLogoutModal(false);
        navigate('/login');
    };

    return (
        <header className="fixed top-0 w-full z-50 transition-all duration-300 bg-white border-b border-gray-100 py-4 shadow-sm">
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex justify-between items-center gap-8">

                    {/* Brand */}
                    <Link to="/" className="flex items-center gap-2 group shrink-0">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[#04364A]">
                            <span className="text-[#64CCC5] font-black text-xl">P</span>
                        </div>
                        <span className="text-xl font-black tracking-tighter text-[#04364A]">
                            PLAT<span className="text-[#64CCC5]">FORM</span>
                        </span>
                    </Link>

                    {/* Middle: Nav Links (Moved from right to middle as per design) */}
                    <nav className="hidden lg:flex items-center gap-10">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                to={link.path}
                                className="text-[11px] font-black uppercase tracking-[0.2em] text-[#04364A] hover:text-[#64CCC5] transition-colors"
                            >
                                {link.name}
                            </Link>
                        ))}
                    </nav>

                    {/* Right: Actions */}
                    <div className="flex items-center gap-6 shrink-0">
                        {/* Search Icon only on right as per design */}
                        <button className="text-[#04364A]/60 hover:text-[#04364A] transition-all">
                            <Search size={20} />
                        </button>

                        <div className="h-4 w-px bg-gray-100"></div>

                        {isAuthenticated ? (
                            <div className="flex items-center gap-6">
                                <Link to={getDashboardPath()} className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-xl bg-[#DAFFFB] flex items-center justify-center text-[#04364A] shadow-lg shadow-[#64CCC5]/10 border border-white overflow-hidden">
                                        <UserAvatar user={user} />
                                    </div>
                                    <div className="hidden lg:block">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-[#04364A]">{user?.name?.split(' ')[0]}</p>
                                    </div>
                                </Link>
                                <button onClick={() => setShowLogoutModal(true)} className="text-[#04364A]/60 hover:text-red-500 transition-colors">
                                    <LogOut size={18} />
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-6">
                                <div
                                    className="relative group/signup"
                                    onMouseEnter={() => setIsSignUpDropdownOpen(true)}
                                    onMouseLeave={() => setIsSignUpDropdownOpen(false)}
                                >
                                    <button className="flex items-center gap-1 text-[11px] font-black uppercase tracking-[0.2em] text-[#04364A] group-hover/signup:text-[#64CCC5] transition-all">
                                        SIGN UP
                                        <ChevronDown size={12} className={`transition-transform duration-300 ${isSignUpDropdownOpen ? 'rotate-180' : ''}`} />
                                    </button>

                                    {/* Dropdown Menu */}
                                    <div className={`absolute top-full left-0 w-48 mt-2 bg-white rounded-xl shadow-2xl border border-gray-50 py-2 transition-all duration-300 transform origin-top ${isSignUpDropdownOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
                                        }`}>
                                        <Link
                                            to="/signup"
                                            className="block px-6 py-3 text-[10px] font-black uppercase tracking-widest text-[#04364A] hover:bg-gray-50 hover:text-[#64CCC5] transition-all"
                                            onClick={() => setIsSignUpDropdownOpen(false)}
                                        >
                                            As Customer
                                        </Link>
                                        <Link
                                            to="/provider/signup"
                                            className="block px-6 py-3 text-[10px] font-black uppercase tracking-widest text-[#04364A] hover:bg-gray-50 hover:text-[#64CCC5] transition-all border-t border-gray-50"
                                            onClick={() => setIsSignUpDropdownOpen(false)}
                                        >
                                            As Provider
                                        </Link>
                                    </div>
                                </div>
                                <Link
                                    to="/login"
                                    className="px-6 py-2.5 bg-[#04364A] text-white rounded text-[11px] font-black uppercase tracking-[0.2em] hover:bg-[#64CCC5] transition-all shadow-lg"
                                >
                                    LOGIN
                                </Link>
                            </div>
                        )}

                        {/* Mobile Toggle */}
                        <button
                            className="lg:hidden p-2 rounded-xl text-[#04364A] bg-gray-50"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        >
                            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="fixed inset-0 top-[73px] bg-white z-[60] p-8 flex flex-col gap-8 animate-in slide-in-from-right duration-500">
                    <div className="flex flex-col gap-2">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                to={link.path}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="text-xl font-black text-[#04364A] py-5 border-b border-gray-100 flex justify-between items-center"
                            >
                                {link.name}
                                <span className="text-gray-200">→</span>
                            </Link>
                        ))}
                    </div>

                    <div className="mt-auto space-y-4">
                        {!isAuthenticated ? (
                            <>
                                <div className="border-2 border-gray-100 rounded overflow-hidden">
                                    <div className="bg-gray-50 px-4 py-2 text-[8px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">Sign Up Options</div>
                                    <Link to="/signup" onClick={() => setIsMobileMenuOpen(false)} className="block w-full text-center py-5 font-black text-[#04364A] border-b border-gray-100 hover:text-[#64CCC5] uppercase tracking-widest text-[10px]">AS CUSTOMER</Link>
                                    <Link to="/provider/signup" onClick={() => setIsMobileMenuOpen(false)} className="block w-full text-center py-5 font-black text-[#04364A] hover:text-[#64CCC5] uppercase tracking-widest text-[10px]">AS PROVIDER</Link>
                                </div>
                                <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="block w-full text-center py-5 bg-[#04364A] text-white font-black rounded uppercase tracking-widest text-[10px]">LOG IN</Link>
                            </>
                        ) : (
                            <button onClick={handleLogout} className="w-full text-center py-5 text-red-500 font-black border-2 border-red-50 rounded uppercase tracking-widest text-[10px]">LOGOUT</button>
                        )}
                    </div>
                </div>
            )}
            {/* Logout Confirmation Modal */}
            {showLogoutModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowLogoutModal(false)}></div>
                    <div className="bg-white rounded-[2rem] shadow-2xl max-w-sm w-full relative z-[110] p-8 text-center animate-in zoom-in duration-300">
                        <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                            <AlertCircle size={40} />
                        </div>
                        <h3 className="text-2xl font-black text-[#04364A] mb-3">Sign Out?</h3>
                        <p className="text-gray-500 mb-8 font-medium leading-relaxed">
                            Are you sure you want to log out of your account?
                        </p>
                        <div className="flex gap-4">
                            <button
                                onClick={() => setShowLogoutModal(false)}
                                className="flex-1 px-4 py-3 bg-gray-100 text-[#04364A] font-bold rounded-2xl hover:bg-gray-200 transition-colors uppercase tracking-widest text-[10px]"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleLogout}
                                className="flex-1 px-4 py-3 bg-[#04364A] text-white font-bold rounded-2xl hover:bg-[#04364A]/90 shadow-lg shadow-[#04364A]/20 transition-all uppercase tracking-widest text-[10px]"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
};

export default Header;
