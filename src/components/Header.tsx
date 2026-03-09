import React, { useState } from 'react';
import { BookOpen, Search, ShoppingBag, X, Menu, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { useAuth } from '../lib/AuthContext';

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { user, logout } = useAuth();

    return (
        <header className="sticky top-0 z-50 w-full border-b border-brand-200 bg-white/80 backdrop-blur-md">
            <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
                <Link to="/" className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-900 text-white">
                        <BookOpen size={18} />
                    </div>
                    <span className="text-xl font-bold tracking-tight text-brand-900">
                        Management<span className="text-brand-500 font-normal">Concepts</span>
                    </span>
                </Link>

                <nav className="hidden md:flex items-center gap-8">
                    <Link to="/" className="text-sm font-medium text-brand-600 hover:text-brand-900 transition-colors">Courses</Link>
                    {user && <Link to="/user/courses" className="text-sm font-medium text-brand-600 hover:text-brand-900 transition-colors">My Courses</Link>}
                    <a href="#" className="text-sm font-medium text-brand-600 hover:text-brand-900 transition-colors">Enterprise</a>
                    <a href="#" className="text-sm font-medium text-brand-600 hover:text-brand-900 transition-colors">Instructors</a>
                    <a href="#" className="text-sm font-medium text-brand-600 hover:text-brand-900 transition-colors">About</a>
                </nav>

                <div className="flex items-center gap-4">
                    <div className="relative hidden sm:block">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-400" />
                        <input
                            type="text"
                            placeholder="Search courses..."
                            className="h-9 w-64 rounded-full border border-brand-200 bg-brand-50 pl-10 pr-4 text-sm outline-none focus:border-brand-400 focus:ring-1 focus:ring-brand-400 transition-all"
                        />
                    </div>
                    <button className="p-2 text-brand-600 hover:text-brand-900">
                        <ShoppingBag size={20} />
                    </button>
                    {user ? (
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-brand-600">Hello, {user.name}</span>
                            <button
                                onClick={logout}
                                className="hidden sm:flex h-9 items-center justify-center rounded-full bg-brand-900 px-5 text-sm font-medium text-white hover:bg-brand-800 transition-colors"
                            >
                                <LogOut size={16} className="mr-2" />
                                Logout
                            </button>
                        </div>
                    ) : (
                        <Link to="/login" className="hidden sm:flex h-9 items-center justify-center rounded-full bg-brand-900 px-5 text-sm font-medium text-white hover:bg-brand-800 transition-colors">
                            Log In
                        </Link>
                    )}
                    <button
                        className="md:hidden p-2 text-brand-600"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden border-t border-brand-200 bg-white"
                    >
                        <div className="flex flex-col gap-4 p-4">
                            <Link to="/" className="text-base font-medium text-brand-600">Courses</Link>
                            <a href="#" className="text-base font-medium text-brand-600">Enterprise</a>
                            <a href="#" className="text-base font-medium text-brand-600">Instructors</a>
                            <a href="#" className="text-base font-medium text-brand-600">About</a>
                            <hr className="border-brand-100" />
                            {user ? (
                                <div className="flex flex-col gap-2">
                                    <span className="text-base font-medium text-brand-600">Hello, {user.name}</span>
                                    <button
                                        onClick={logout}
                                        className="flex h-11 items-center justify-center rounded-lg bg-brand-900 text-white font-medium"
                                    >
                                        <LogOut size={16} className="mr-2" />
                                        Logout
                                    </button>
                                </div>
                            ) : (
                                <Link to="/login" className="flex h-11 items-center justify-center rounded-lg bg-brand-900 text-white font-medium">
                                    Log In
                                </Link>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
};

export default Header;
