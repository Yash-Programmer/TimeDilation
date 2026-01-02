import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Twitter, Github, Linkedin } from 'lucide-react';

const Footer = () => (
    <footer className="bg-[#111111] text-white py-24 border-t border-[#333]">
        <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-24">
                {/* Brand Column */}
                <div className="col-span-1 md:col-span-1 space-y-8">
                    <h5 className="font-bold text-2xl tracking-tighter">TimeDilation.org</h5>
                    <p className="text-gray-400 text-sm leading-relaxed">
                        A CERN Beamline for Schools project dedicated to visualizing relativistic particle physics through high-fidelity Monte Carlo simulations.
                    </p>
                    <div className="flex items-center gap-2 text-xs font-mono text-green-400 border border-green-900/30 bg-green-900/10 px-3 py-1.5 rounded-full w-fit">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                        ALL SYSTEMS OPERATIONAL
                    </div>
                </div>

                {/* Platform Column */}
                <div>
                    <h6 className="font-bold text-sm uppercase tracking-widest text-gray-500 mb-6">Platform</h6>
                    <ul className="space-y-4 text-sm text-gray-300">
                        <li><Link to="/simulator" className="hover:text-white transition-colors">Launch Simulator</Link></li>
                        <li><Link to="/learn" className="hover:text-white transition-colors">Documentation</Link></li>
                        <li><a href="#" className="hover:text-white transition-colors">Physics Engine Specs</a></li>
                        <li><a href="#" className="hover:text-white transition-colors">Source Code</a></li>
                        <li><a href="#" className="hover:text-white transition-colors flex items-center gap-2">Changelog <span className="text-[10px] bg-[#333] px-1.5 py-0.5 rounded text-white">v2.4</span></a></li>
                    </ul>
                </div>

                {/* Resources Column */}
                <div>
                    <h6 className="font-bold text-sm uppercase tracking-widest text-gray-500 mb-6">Resources</h6>
                    <ul className="space-y-4 text-sm text-gray-300">
                        <li><a href="#" className="hover:text-white transition-colors">CERN Data Exports</a></li>
                        <li><a href="#" className="hover:text-white transition-colors">PDG Particle Data</a></li>
                        <li><a href="#" className="hover:text-white transition-colors">Educational Guides</a></li>
                        <li><a href="#" className="hover:text-white transition-colors">Research Papers</a></li>
                        <li><a href="#" className="hover:text-white transition-colors">FAQ & Support</a></li>
                    </ul>
                </div>

                {/* Connect Column */}
                <div>
                    <h6 className="font-bold text-sm uppercase tracking-widest text-gray-500 mb-6">Stay Updated</h6>
                    <div className="flex gap-2 mb-6">
                        <input
                            type="email"
                            placeholder="Enter your email"
                            className="bg-[#222] border border-[#333] rounded-lg px-4 py-2 text-sm w-full focus:outline-none focus:border-white transition-colors"
                        />
                        <button className="bg-white text-black font-bold px-4 py-2 rounded-lg text-sm hover:bg-gray-200 transition-colors">
                            <ArrowRight size={16} />
                        </button>
                    </div>
                    <div className="flex gap-4">
                        <a href="#" className="text-gray-400 hover:text-white transition-colors"><Twitter size={20} /></a>
                        <a href="#" className="text-gray-400 hover:text-white transition-colors"><Github size={20} /></a>
                        <a href="#" className="text-gray-400 hover:text-white transition-colors"><Linkedin size={20} /></a>
                    </div>
                </div>
            </div>

            <div className="border-t border-[#333] pt-12 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500">
                <p>&copy; 2024 Time Dilation Project. All rights reserved.</p>
                <div className="flex gap-6 mt-4 md:mt-0">
                    <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                    <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                    <a href="#" className="hover:text-white transition-colors">Cookies</a>
                </div>
            </div>
        </div>
    </footer>
);

export default Footer;
