import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
    Search, ChevronRight, Menu, X, ExternalLink, ArrowRight
} from 'lucide-react';
import { documentationData } from '../data/documentationData';

// --- HELPER: Generate slug from heading ---
const slugify = (text) => {
    return text
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/--+/g, '-')
        .trim();
};

// --- MATH RENDERING HELPER ---
const renderMath = (latex) => {
    let text = latex;
    text = text.replace(/\\gamma/g, 'γ');
    text = text.replace(/\\beta/g, 'β');
    text = text.replace(/\\alpha/g, 'α');
    text = text.replace(/\\tau/g, 'τ');
    text = text.replace(/\\mu/g, 'μ');
    text = text.replace(/\\nu/g, 'ν');
    text = text.replace(/\\pi/g, 'π');
    text = text.replace(/\\cdot/g, '⋅');
    text = text.replace(/\\approx/g, '≈');
    text = text.replace(/\\le/g, '≤');
    text = text.replace(/\\ge/g, '≥');
    text = text.replace(/\\infty/g, '∞');
    text = text.replace(/\\Delta/g, 'Δ');
    text = text.replace(/\\lambda/g, 'λ');
    text = text.replace(/\\sigma/g, 'σ');
    text = text.replace(/\\rho/g, 'ρ');
    text = text.replace(/\\theta/g, 'θ');
    text = text.replace(/\\phi/g, 'φ');
    text = text.replace(/\\pm/g, '±');
    text = text.replace(/\\times/g, '×');
    text = text.replace(/\\^2/g, '²');
    text = text.replace(/\\^3/g, '³');
    text = text.replace(/_0/g, '₀');
    text = text.replace(/_1/g, '₁');
    text = text.replace(/_2/g, '₂');
    text = text.replace(/\\sqrt\{([^}]+)\}/g, '√($1)');
    text = text.replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, '($1 / $2)');
    text = text.replace(/e\^\{([^}]+)\}/g, 'e^($1)');
    return text;
};

// --- CONTENT BLOCK COMPONENTS ---
const ContentBlock = ({ item }) => {
    const headingId = item.heading ? slugify(item.heading) : null;

    switch (item.type) {
        case 'text':
            return (
                <div className="mb-8" id={headingId}>
                    {item.heading && <h3 className="text-2xl font-bold text-slate-900 mb-4 scroll-mt-24">{item.heading}</h3>}
                    <p className="text-lg text-slate-600 leading-relaxed">{item.body}</p>
                </div>
            );
        case 'alert':
            return (
                <div className={`p-5 rounded-xl border mb-8 flex gap-4 ${item.variant === 'warning' ? 'bg-amber-50 border-amber-200 text-amber-900' :
                        item.variant === 'error' ? 'bg-red-50 border-red-200 text-red-900' :
                            item.variant === 'tip' ? 'bg-emerald-50 border-emerald-200 text-emerald-900' :
                                'bg-blue-50 border-blue-200 text-blue-900'
                    }`}>
                    <div className="shrink-0 mt-0.5 text-2xl">
                        {item.variant === 'warning' ? '⚠️' : item.variant === 'error' ? '🚫' : item.variant === 'tip' ? '💡' : 'ℹ️'}
                    </div>
                    <div>
                        <h4 className="font-bold mb-1 text-lg">{item.title}</h4>
                        <p className="text-sm opacity-90 leading-relaxed">{item.body}</p>
                    </div>
                </div>
            );
        case 'math':
            return (
                <div className="mb-8 bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl overflow-hidden border border-slate-200 p-10 text-center shadow-inner" id={headingId}>
                    {item.heading && <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">{item.heading}</div>}
                    <div className="font-serif text-4xl md:text-5xl text-slate-800 italic tracking-tight">
                        {renderMath(item.code)}
                    </div>
                    <div className="mt-6 text-xs font-mono text-slate-400 select-all bg-white/50 inline-block px-4 py-2 rounded-lg">
                        LaTeX: {item.code}
                    </div>
                </div>
            );
        case 'code':
            return (
                <div className="mb-8 bg-slate-900 rounded-2xl overflow-hidden shadow-xl border border-slate-700" id={headingId}>
                    <div className="px-5 py-3 bg-slate-800 border-b border-slate-700 text-xs font-mono text-slate-400 uppercase flex items-center gap-2">
                        <span className="w-3 h-3 bg-red-500 rounded-full" />
                        <span className="w-3 h-3 bg-yellow-500 rounded-full" />
                        <span className="w-3 h-3 bg-green-500 rounded-full" />
                        <span className="ml-4">{item.language}</span>
                    </div>
                    <div className="p-6 font-mono text-sm text-green-400 overflow-x-auto whitespace-pre leading-relaxed">
                        {item.code}
                    </div>
                </div>
            );
        case 'steps':
            return (
                <div className="mb-10 space-y-6" id={headingId}>
                    {item.heading && <h3 className="text-2xl font-bold text-slate-900 mb-8 scroll-mt-24">{item.heading}</h3>}
                    {item.items.map((step, i) => (
                        <div key={i} className="flex gap-5 bg-slate-50 p-5 rounded-xl border border-slate-100 hover:border-blue-200 transition-colors">
                            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white font-bold shrink-0 shadow-md text-lg">
                                {i + 1}
                            </div>
                            <div className="pt-1">
                                <h4 className="font-bold text-slate-900 text-lg mb-2">{step.title}</h4>
                                <p className="text-slate-600 leading-relaxed">{step.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            );
        case 'table':
            return (
                <div className="mb-10 overflow-hidden rounded-2xl border border-slate-200 shadow-lg" id={headingId}>
                    {item.heading && <div className="p-5 bg-slate-50 border-b border-slate-200 font-bold text-slate-800 text-lg">{item.heading}</div>}
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-white text-slate-500 font-semibold border-b border-slate-100">
                                <tr>
                                    {item.columns.map((col, i) => <th key={i} className="px-6 py-4 whitespace-nowrap">{col}</th>)}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 bg-white">
                                {item.rows.map((row, i) => (
                                    <tr key={i} className="hover:bg-blue-50/50 transition-colors">
                                        {row.map((cell, j) => <td key={j} className="px-6 py-4 text-slate-700 whitespace-nowrap">{cell}</td>)}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            );
        case 'grid':
            return (
                <div className="mb-10" id={headingId}>
                    {item.heading && <h3 className="text-2xl font-bold text-slate-900 mb-6 scroll-mt-24">{item.heading}</h3>}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {item.items.map((gridItem, i) => (
                            <div key={i} className="p-5 bg-white rounded-xl border border-slate-200 hover:border-blue-300 hover:shadow-lg transition-all shadow-sm group">
                                <div className="flex items-center gap-3 mb-3 font-bold text-slate-900 group-hover:text-blue-600 transition-colors text-lg">
                                    {gridItem.icon && <gridItem.icon size={22} className="text-blue-500" />}
                                    {gridItem.title}
                                </div>
                                <p className="text-slate-600">{gridItem.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            );
        case 'list':
            return (
                <div className="mb-10" id={headingId}>
                    <ul className="space-y-4">
                        {item.items.map((listItem, i) => (
                            <li key={i} className="flex gap-4 text-slate-700 bg-slate-50 p-5 rounded-xl border border-slate-100 hover:border-blue-200 transition-colors">
                                <div className="w-2 h-2 rounded-full bg-blue-500 mt-2.5 shrink-0" />
                                <div>
                                    <strong className="text-slate-900">{listItem.term}:</strong>
                                    <span className="ml-2">{listItem.desc}</span>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            );
        default:
            return null;
    }
};

const Help = () => {
    const [activeSection, setActiveSection] = useState('getting-started');
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    // Scroll to top on section change
    useEffect(() => {
        const mainContent = document.getElementById('main-content');
        if (mainContent) mainContent.scrollTo(0, 0);
    }, [activeSection]);

    // Scroll to heading when "On This Page" clicked
    const scrollToHeading = useCallback((heading) => {
        const slug = slugify(heading);
        const element = document.getElementById(slug);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }, []);

    // --- SEARCH LOGIC ---
    const searchResults = useMemo(() => {
        if (!searchQuery.trim()) return null;
        const results = [];
        const lowerQuery = searchQuery.toLowerCase();

        Object.entries(documentationData).forEach(([key, section]) => {
            if (section.title.toLowerCase().includes(lowerQuery)) {
                results.push({ key, type: 'Section', text: section.title, preview: '' });
            }
            section.content.forEach(item => {
                if (item.type === 'text' && item.body.toLowerCase().includes(lowerQuery)) {
                    results.push({ key, type: 'Content', text: item.heading || 'Text Match', preview: item.body.substring(0, 80) + '...' });
                }
                if (item.heading && item.heading.toLowerCase().includes(lowerQuery)) {
                    results.push({ key, type: 'Heading', text: item.heading, preview: '' });
                }
                if (item.type === 'grid' || item.type === 'list') {
                    item.items.forEach(subItem => {
                        const matchText = subItem.title || subItem.term || subItem.desc;
                        if (matchText && matchText.toLowerCase().includes(lowerQuery)) {
                            results.push({ key, type: 'Item', text: subItem.title || subItem.term || 'List Item', preview: subItem.desc?.substring(0, 60) || '' });
                        }
                    });
                }
            });
        });
        return results;
    }, [searchQuery]);

    const activeItem = documentationData[activeSection];

    return (
        <div className="min-h-screen bg-white flex flex-col font-sans">

            {/* Header */}
            <div className="border-b border-slate-200 bg-white sticky top-0 z-30 shadow-sm">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg">
                            <Menu size={20} />
                        </button>
                        <div className="font-bold text-slate-900 text-xl tracking-tight hidden sm:flex items-center gap-2">
                            <div className="w-8 h-8 bg-blue-600 text-white rounded-lg flex items-center justify-center font-serif italic">γ</div>
                            <span>Documentation</span>
                        </div>
                    </div>

                    <div className="relative w-full max-w-xl mx-4">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search documentation..."
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-12 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        {searchQuery && (
                            <button onClick={() => setSearchQuery('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                                <X size={16} />
                            </button>
                        )}
                    </div>

                    <div className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900 cursor-pointer transition-colors">
                        v2.0 <ExternalLink size={14} />
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 flex flex-1 overflow-hidden relative">

                {/* Sidebar Navigation */}
                <aside className={`fixed inset-y-0 left-0 z-40 w-72 bg-slate-50 border-r border-slate-200 transform transition-transform duration-300 lg:translate-x-0 lg:static lg:h-[calc(100vh-64px)] overflow-y-auto ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                    <div className="p-4 lg:hidden flex justify-between items-center border-b border-slate-200">
                        <span className="font-bold text-slate-900">Menu</span>
                        <button onClick={() => setMobileMenuOpen(false)}><X size={20} /></button>
                    </div>

                    <nav className="p-4 space-y-1">
                        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 px-3">Topics</div>
                        {Object.entries(documentationData).map(([key, section]) => {
                            const Icon = section.icon;
                            const isActive = activeSection === key && !searchQuery;
                            return (
                                <button
                                    key={key}
                                    onClick={() => { setActiveSection(key); setSearchQuery(''); setMobileMenuOpen(false); }}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${isActive
                                            ? 'bg-white text-blue-600 shadow-md border border-slate-200'
                                            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                                        }`}
                                >
                                    <Icon size={18} className={isActive ? 'text-blue-500' : 'text-slate-400'} />
                                    {section.title}
                                </button>
                            );
                        })}
                    </nav>

                    <div className="p-4 mt-auto">
                        <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-6 text-white shadow-xl">
                            <h4 className="font-bold mb-2 text-lg">Ready to Simulate?</h4>
                            <p className="text-sm text-blue-100 mb-4 opacity-90">Put this documentation into practice with the interactive simulator.</p>
                            <a href="/simulator" className="inline-flex items-center gap-2 text-sm font-bold bg-white/20 px-4 py-2 rounded-lg hover:bg-white/30 transition-colors">
                                Launch Simulator <ArrowRight size={14} />
                            </a>
                        </div>
                    </div>
                </aside>

                {/* Main Content Area */}
                <main id="main-content" className="flex-1 min-w-0 py-10 lg:px-16 h-[calc(100vh-64px)] overflow-y-auto scroll-smooth">
                    <div className="max-w-4xl mx-auto pb-40">

                        {/* SEARCH RESULTS VIEW */}
                        {searchQuery ? (
                            <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
                                <h2 className="text-3xl font-bold text-slate-900 mb-8">Search Results for "{searchQuery}"</h2>
                                {searchResults.length === 0 ? (
                                    <div className="text-slate-500 italic text-lg">No matches found. Try different keywords.</div>
                                ) : (
                                    <div className="space-y-4">
                                        {searchResults.map((result, i) => (
                                            <div
                                                key={i}
                                                onClick={() => { setActiveSection(result.key); setSearchQuery(''); }}
                                                className="p-5 bg-white rounded-xl border border-slate-200 hover:border-blue-300 hover:shadow-lg cursor-pointer transition-all"
                                            >
                                                <div className="flex items-center gap-2 text-xs font-bold text-blue-600 uppercase mb-2">
                                                    {result.type} • {documentationData[result.key].title}
                                                </div>
                                                <div className="font-bold text-slate-900 text-xl mb-1">{result.text}</div>
                                                {result.preview && <div className="text-slate-500 line-clamp-2">{result.preview}</div>}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ) : (
                            /* NORMAL CONTENT VIEW */
                            <motion.div
                                key={activeSection}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                {/* Breadcrumbs */}
                                <div className="flex items-center gap-2 text-sm text-slate-500 mb-8">
                                    <span className="hover:text-slate-900 cursor-pointer">Docs</span>
                                    <ChevronRight size={14} />
                                    <span className="font-medium text-slate-900">{activeItem.title}</span>
                                </div>

                                {/* Heading Section */}
                                <div className="mb-12 border-b border-slate-200 pb-10">
                                    <h1 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tight mb-5">
                                        {activeItem.title}
                                    </h1>
                                    <p className="text-xl text-slate-600">
                                        Comprehensive documentation and reference guide for this topic.
                                    </p>
                                </div>

                                {/* Featured Image */}
                                {activeItem.image && (
                                    <div className="mb-14 rounded-3xl overflow-hidden border border-slate-200 shadow-2xl bg-slate-100">
                                        <img
                                            src={activeItem.image}
                                            alt={activeItem.title}
                                            className="w-full h-auto max-h-[550px] object-cover object-top"
                                        />
                                    </div>
                                )}

                                {/* Content Body */}
                                <div className="prose prose-slate prose-lg max-w-none prose-headings:font-bold prose-headings:text-slate-900 prose-p:text-slate-600 prose-a:text-blue-600 prose-code:bg-slate-100 prose-code:text-pink-600 prose-code:px-1 prose-code:rounded prose-code:before:content-none prose-code:after:content-none">
                                    {activeItem.content.map((item, index) => (
                                        <ContentBlock key={index} item={item} />
                                    ))}
                                </div>
                            </motion.div>
                        )}

                    </div>
                </main>

                {/* Right Sidebar (On This Page) - Hidden on Mobile - NOW WITH WORKING LINKS */}
                {!searchQuery && (
                    <aside className="hidden xl:block w-72 shrink-0 py-10 px-6 border-l border-slate-200 sticky top-16 h-[calc(100vh-64px)] overflow-y-auto">
                        <h5 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-6">On This Page</h5>
                        <ul className="space-y-2 text-sm text-slate-500 border-l-2 border-slate-100 pl-4">
                            {activeItem.content.filter(i => i.heading).map((item, i) => (
                                <li
                                    key={i}
                                    onClick={() => scrollToHeading(item.heading)}
                                    className="cursor-pointer py-1.5 px-2 rounded-r-lg hover:text-blue-600 hover:bg-blue-50 hover:border-l-2 hover:border-blue-600 -ml-[18px] pl-[16px] transition-all"
                                >
                                    {item.heading}
                                </li>
                            ))}
                        </ul>
                    </aside>
                )}

            </div>
        </div>
    );
};

export default Help;
