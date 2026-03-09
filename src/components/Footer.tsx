import React from 'react';
import { BookOpen } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-white border-t border-brand-200 pt-16 pb-8">
            <div className="container mx-auto px-4 md:px-6">
                <div className="grid gap-12 md:grid-cols-4 mb-16">
                    <div className="col-span-1 md:col-span-1">
                        <div className="flex items-center gap-2 mb-6">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-900 text-white">
                                < BookOpen size={18} />
                            </div>
                            <span className="text-xl font-bold tracking-tight text-brand-900">
                                Management<span className="text-brand-500 font-normal">Concepts</span>
                            </span>
                        </div>
                        <p className="text-brand-500 text-sm leading-relaxed">
                            The world's leading platform for management education.
                            We empower professionals to become exceptional leaders.
                        </p>
                    </div>
                    <div>
                        <h4 className="font-bold text-brand-900 mb-6">Platform</h4>
                        <ul className="space-y-4 text-sm text-brand-500">
                            <li><a href="#" className="hover:text-brand-900">Browse Courses</a></li>
                            <li><a href="#" className="hover:text-brand-900">Certifications</a></li>
                            <li><a href="#" className="hover:text-brand-900">For Business</a></li>
                            <li><a href="#" className="hover:text-brand-900">For Universities</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold text-brand-900 mb-6">Company</h4>
                        <ul className="space-y-4 text-sm text-brand-500">
                            <li><a href="#" className="hover:text-brand-900">About Us</a></li>
                            <li><a href="#" className="hover:text-brand-900">Careers</a></li>
                            <li><a href="#" className="hover:text-brand-900">Press</a></li>
                            <li><a href="#" className="hover:text-brand-900">Contact</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold text-brand-900 mb-6">Newsletter</h4>
                        <p className="text-sm text-brand-500 mb-4">Get the latest insights on management and leadership.</p>
                        <div className="flex gap-2">
                            <input
                                type="email"
                                placeholder="Email address"
                                className="h-10 flex-1 rounded-lg border border-brand-200 px-4 text-sm outline-none focus:border-brand-400"
                            />
                            <button className="h-10 rounded-lg bg-brand-900 px-4 text-sm font-bold text-white">
                                Join
                            </button>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-brand-100 gap-4">
                    <p className="text-xs text-brand-400">© 2026 Management Concepts Inc. All rights reserved.</p>
                    <div className="flex gap-6 text-xs text-brand-400">
                        <a href="#" className="hover:text-brand-900">Privacy Policy</a>
                        <a href="#" className="hover:text-brand-900">Terms of Service</a>
                        <a href="#" className="hover:text-brand-900">Cookie Settings</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
