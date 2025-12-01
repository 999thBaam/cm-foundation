import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Home, BookOpen, User, Settings, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
    return twMerge(clsx(inputs));
}

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();

    const navItems = [
        { name: 'Home', path: '/dashboard', icon: Home },
        { name: 'Subjects', path: '/subject/science', icon: BookOpen }, // Default to science for now
        { name: 'Profile', path: '/profile', icon: User },
        { name: 'Settings', path: '/settings', icon: Settings },
    ];

    return (
        <nav className="bg-white/80 backdrop-blur-md border-b border-slate-200/50 sticky top-0 z-50 shadow-sm">
            {/* Gradient Strip */}
            <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary-200 to-transparent opacity-50"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-20"> {/* Increased height */}
                    <div className="flex items-center">
                        <Link to="/dashboard" className="flex-shrink-0 flex items-center gap-3 group">
                            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center text-white font-bold text-2xl shadow-lg shadow-primary-500/30 group-hover:scale-105 transition-transform duration-200">
                                C
                            </div>
                            <span className="font-bold text-xl text-slate-900 tracking-tight group-hover:text-primary-600 transition-colors">CM Foundation</span>
                        </Link>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden sm:flex sm:items-center sm:gap-2">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = location.pathname === item.path;
                            return (
                                <Link
                                    key={item.name}
                                    to={item.path}
                                    className={cn(
                                        "px-4 py-2.5 rounded-full text-sm font-medium flex items-center gap-2 transition-all duration-200",
                                        isActive
                                            ? "bg-primary-50 text-primary-600 shadow-sm ring-1 ring-primary-100"
                                            : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                                    )}
                                >
                                    <Icon size={18} className={isActive ? "text-primary-500" : "text-slate-400 group-hover:text-slate-600"} />
                                    {item.name}
                                </Link>
                            );
                        })}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="flex items-center sm:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-50 focus:outline-none transition-colors"
                        >
                            {isOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="sm:hidden border-t border-slate-100 bg-white/95 backdrop-blur-xl absolute w-full left-0 shadow-lg rounded-b-2xl">
                    <div className="px-4 pt-2 pb-4 space-y-2">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = location.pathname === item.path;
                            return (
                                <Link
                                    key={item.name}
                                    to={item.path}
                                    onClick={() => setIsOpen(false)}
                                    className={cn(
                                        "block px-4 py-3 rounded-xl text-base font-medium flex items-center gap-3 transition-colors",
                                        isActive
                                            ? "bg-primary-50 text-primary-600"
                                            : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                                    )}
                                >
                                    <Icon size={20} />
                                    {item.name}
                                </Link>
                            );
                        })}
                    </div>
                </div>
            )}
        </nav>
    );
};

const Layout = () => {
    return (
        <div className="min-h-screen bg-surface flex flex-col">
            <Navbar />
            <main className="relative z-10 flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <Outlet />
            </main>
        </div>
    );
};

export default Layout;
