import React, { useState } from 'react';
import { 
    Mail, Phone, MapPin, Send, 
    MessageSquare, Clock, Globe, 
    CheckCircle2, Loader2, ArrowRight
} from 'lucide-react';
import toast from 'react-hot-toast';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        // Simulating API call
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        toast.success('Message sent! We\'ll get back to you soon.', {
             style: {
                borderRadius: '1.5rem',
                background: '#04364A',
                color: '#fff',
                fontWeight: '900',
                textTransform: 'uppercase',
                fontSize: '10px',
                letterSpacing: '0.1em'
            },
            iconTheme: {
                primary: '#64CCC5',
                secondary: '#04364A',
            },
        });
        
        setFormData({ name: '', email: '', subject: '', message: '' });
        setIsSubmitting(false);
    };

    const contactChannels = [
        {
            icon: <Phone size={24} />,
            title: "Direct Call",
            detail: "+20 155 055 4308",
            desc: "Mon-Fri | 9AM-6PM",
            color: "bg-blue-50 text-blue-600",
            hover: "hover:bg-blue-600 hover:text-white"
        },
        {
            icon: <Mail size={24} />,
            title: "Email Support",
            detail: "support@servio.com",
            desc: "24/7 Response Time",
            color: "bg-teal-50 text-[#64CCC5]",
            hover: "hover:bg-[#64CCC5] hover:text-[#04364A]"
        },
        {
            icon: <MapPin size={24} />,
            title: "HQ Office",
            detail: "Assiut, Egypt",
            desc: "Assiut University, Main Campus",
            color: "bg-sky-50 text-sky-600",
            hover: "hover:bg-sky-600 hover:text-white"
        }
    ];

    return (
        <div className="bg-[#f8f9fa] min-h-screen">
            {/* ── Hero Section ────────────────────────────────────────── */}
            <div className="bg-[#04364A] pt-32 pb-48 px-6 relative overflow-hidden">
                <div className="absolute inset-0">
                    <img 
                        src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=2000&q=80" 
                        alt="background" 
                        className="w-full h-full object-cover opacity-10" 
                    />
                    <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-[#64CCC5]/10 rounded-full blur-[120px]"></div>
                    <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-[#176B87]/10 rounded-full blur-[120px]"></div>
                </div>
                
                <div className="max-w-7xl mx-auto relative z-10 text-center space-y-8">
                    <div className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-xl px-6 py-2 rounded-full border border-white/10">
                        <span className="w-2 h-2 bg-[#64CCC5] rounded-full animate-pulse"></span>
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#64CCC5]">Get In Touch</span>
                    </div>
                    
                    <h1 className="text-5xl md:text-8xl font-black text-white tracking-tighter leading-none">
                        How Can We <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#64CCC5] to-[#DAFFFB]">Help You?</span>
                    </h1>
                    
                    <p className="text-[#DAFFFB]/60 text-lg max-w-2xl mx-auto font-medium leading-relaxed">
                        Whether you're a professional looking to join our network or a homeowner in need of expert assistance, our team is here to support you.
                    </p>
                </div>
            </div>

            {/* ── Main Content Area ───────────────────────────────────── */}
            <div className="max-w-7xl mx-auto px-6 -mt-24 relative z-20 pb-24">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    
                    {/* Sidebar: Channels */}
                    <div className="lg:col-span-4 space-y-6">
                        {contactChannels.map((c, i) => (
                            <div key={i} className={`group bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-[#04364A]/5 transition-all duration-500 hover:-translate-y-2 cursor-pointer`}>
                                <div className={`w-14 h-14 ${c.color} rounded-2xl flex items-center justify-center mb-6 transition-all duration-500 group-hover:scale-110 group-hover:shadow-2xl shadow-blue-500/10`}>
                                    {c.icon}
                                </div>
                                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#04364A]/40 mb-2">{c.title}</h3>
                                <p className="text-xl font-black text-[#04364A] mb-1">{c.detail}</p>
                                <p className="text-xs font-bold text-gray-400">{c.desc}</p>
                            </div>
                        ))}

                        {/* Social Sneak Peek */}
                        <div className="bg-gradient-to-br from-[#176B87] to-[#04364A] p-10 rounded-[2.5rem] text-white overflow-hidden relative group">
                            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-150 transition-transform duration-700">
                                <Globe size={120} />
                            </div>
                            <h3 className="text-2xl font-black mb-4 relative z-10">Follow Our <br /> Journey</h3>
                            <div className="flex gap-4 relative z-10">
                                {['FB', 'IG', 'LN', 'TW'].map(s => (
                                    <div key={s} className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center text-[10px] font-black hover:bg-[#64CCC5] hover:text-[#04364A] transition-all cursor-pointer">
                                        {s}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="lg:col-span-8">
                        <div className="bg-white rounded-[3rem] p-10 md:p-16 border border-gray-100 shadow-2xl shadow-[#04364A]/10">
                            <div className="mb-12">
                                <h2 className="text-3xl font-black text-[#04364A] tracking-tight mb-4">Send a Message</h2>
                                <p className="text-gray-400 font-bold text-xs uppercase tracking-widest leading-none">Responses usually arrives within 2 hours</p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-[#04364A] uppercase tracking-widest ml-1">Full Name</label>
                                        <input 
                                            required
                                            type="text" 
                                            placeholder="Ex: Mazen Mohamed"
                                            value={formData.name}
                                            onChange={e => setFormData({...formData, name: e.target.value})}
                                            className="w-full px-8 py-5 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-[#64CCC5]/20 focus:bg-white outline-none font-bold text-[#04364A] placeholder:text-gray-300 transition-all"
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-[#04364A] uppercase tracking-widest ml-1">Email Address</label>
                                        <input 
                                            required
                                            type="email" 
                                            placeholder="mazen@example.com"
                                            value={formData.email}
                                            onChange={e => setFormData({...formData, email: e.target.value})}
                                            className="w-full px-8 py-5 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-[#64CCC5]/20 focus:bg-white outline-none font-bold text-[#04364A] placeholder:text-gray-300 transition-all"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-[#04364A] uppercase tracking-widest ml-1">Subject</label>
                                    <select 
                                        required
                                        value={formData.subject}
                                        onChange={e => setFormData({...formData, subject: e.target.value})}
                                        className="w-full px-8 py-5 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-[#64CCC5]/20 focus:bg-white outline-none font-bold text-[#04364A] appearance-none cursor-pointer hover:bg-gray-100 transition-all"
                                    >
                                        <option value="">Choose inquiry type</option>
                                        <option value="General">General Inquiry</option>
                                        <option value="Partnership">Partnership Opportunities</option>
                                        <option value="Support">Technical Support</option>
                                        <option value="Billing">Billing & Payouts</option>
                                    </select>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-[#04364A] uppercase tracking-widest ml-1">Message Detail</label>
                                    <textarea 
                                        required
                                        rows="6" 
                                        placeholder="How can we help you today?"
                                        value={formData.message}
                                        onChange={e => setFormData({...formData, message: e.target.value})}
                                        className="w-full px-8 py-6 bg-gray-50 rounded-[2rem] border-2 border-transparent focus:border-[#64CCC5]/20 focus:bg-white outline-none font-bold text-[#04364A] placeholder:text-gray-300 transition-all resize-none"
                                    ></textarea>
                                </div>

                                <button 
                                    disabled={isSubmitting}
                                    type="submit"
                                    className="group w-full md:w-auto px-12 py-5 bg-[#04364A] text-white rounded-2xl flex items-center justify-center gap-4 hover:bg-[#176B87] transition-all shadow-2xl shadow-[#04364A]/20 active:scale-95 disabled:opacity-50"
                                >
                                    <span className="text-[10px] font-black uppercase tracking-[0.3em]">
                                        {isSubmitting ? 'Sending Signal...' : 'Launch Message'}
                                    </span>
                                    {isSubmitting ? (
                                        <Loader2 size={20} className="animate-spin text-[#64CCC5]" />
                                    ) : (
                                        <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>

                {/* ── FAQ Sneak Peek ───────────────────────────────────────── */}
                <div className="mt-24 bg-white p-12 md:p-20 rounded-[4rem] border border-gray-100 shadow-sm overflow-hidden relative">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div className="space-y-8">
                            <h2 className="text-4xl md:text-5xl font-black text-[#04364A] tracking-tighter">Frequently Asked <br /> Questions.</h2>
                            <p className="text-gray-400 font-medium text-lg leading-relaxed">
                                Maybe your answer is already waiting for you in our knowledge base? Check out common queries from our community.
                            </p>
                            <button className="group flex items-center gap-4 text-[#176B87] font-black text-[12px] uppercase tracking-widest">
                                EXPLORE FAQ HUB <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
                            </button>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {[
                                { q: 'How do I join as a provider?', a: 'Sign up through the provider portal and complete verification.' },
                                { q: 'How are payouts handled?', a: 'Payouts are processed weekly via bank transfer or wallet.' },
                                { q: 'Is there a booking fee?', a: 'We charge a small platform maintenance fee per successful job.' },
                                { q: 'Are services insured?', a: 'Most of our top-tier professionals provide basic work insurance.' },
                            ].map((f, i) => (
                                <div key={i} className="p-8 bg-gray-50 rounded-3xl border border-transparent hover:border-[#64CCC5]/20 hover:bg-white transition-all">
                                    <h4 className="text-sm font-black text-[#176B87] mb-3">{f.q}</h4>
                                    <p className="text-xs font-medium text-gray-400 leading-relaxed">{f.a}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;
