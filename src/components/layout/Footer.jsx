import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, Instagram, Twitter, Facebook, ArrowUpRight } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-[#04364A] border-t border-[#64CCC5]/20 pt-20 pb-12">
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-16">
                    {/* Brand Section */}
                    <div className="space-y-6 max-w-sm">
                        <Link to="/" className="flex items-center gap-2 group">
                            <div className="w-10 h-10 bg-white/10 rounded-2xl flex items-center justify-center transition-transform group-hover:rotate-6 border border-white/5">
                                <span className="text-[#64CCC5] font-black text-xl">P</span>
                            </div>
                            <span className="text-2xl font-black tracking-tighter text-white">
                                PLAT<span className="text-[#64CCC5]">FORM</span>
                            </span>
                        </Link>
                        <p className="text-gray-400 text-sm font-medium leading-relaxed">
                            A network connecting you with verified local experts for any task. 
                            Reliable, safe, and simplified services for your home and business.
                        </p>
                    </div>

                    {/* Links Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-12">
                        <div className="space-y-4">
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-[#64CCC5]">Product</h4>
                            <ul className="space-y-3 text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                                <li><Link to="/services" className="hover:text-white transition-colors">Services</Link></li>
                                <li><Link to="/categories" className="hover:text-white transition-colors">Categories</Link></li>
                                <li><Link to="/providers" className="hover:text-white transition-colors">Our Providers</Link></li>
                                <li><Link to="/provider/signup" className="hover:text-white transition-colors">Join as Provider</Link></li>
                            </ul>
                        </div>
                        <div className="space-y-4">
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-[#64CCC5]">Contact</h4>
                            <ul className="space-y-3 text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                                <li className="hover:text-white cursor-pointer transition-colors">Support</li>
                                <li className="hover:text-white cursor-pointer transition-colors">Live Chat</li>
                                <li className="hover:text-white cursor-pointer transition-colors">Contact Us</li>
                            </ul>
                        </div>
                        <div className="space-y-4 hidden sm:block">
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-[#64CCC5]">Social</h4>
                            <div className="flex gap-4 text-gray-400">
                                <Twitter size={18} className="hover:text-[#64CCC5] cursor-pointer transition-colors" />
                                <Instagram size={18} className="hover:text-[#64CCC5] cursor-pointer transition-colors" />
                                <Facebook size={18} className="hover:text-[#64CCC5] cursor-pointer transition-colors" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-[#64CCC5]/10 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">
                        © 2026 Platform
                    </p>
                    <div className="flex gap-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">
                        <Link to="/privacy" className="hover:text-[#64CCC5] transition-colors">Privacy</Link>
                        <Link to="/terms" className="hover:text-[#64CCC5] transition-colors">Terms</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
