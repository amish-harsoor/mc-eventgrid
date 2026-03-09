import React, { useState, useMemo, useEffect } from 'react';
import { Search, ChevronRight, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CATEGORIES, Course, fetchCourses } from '../data/courses';
import { cn } from '../lib/utils';
import CourseCard from '../components/CourseCard';

export default function Home() {
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [courses, setCourses] = useState<Course[]>([]);

    useEffect(() => {
        fetchCourses().then(setCourses).catch(console.error);
    }, []);

    const filteredCourses = useMemo(() => {
        return courses.filter(course => {
            const matchesCategory = selectedCategory === 'All' || course.category === selectedCategory;
            const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                course.description.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesCategory && matchesSearch;
        });
    }, [selectedCategory, searchQuery, courses]);

    return (
        <main className="flex-1">
            {/* Hero Section */}
            <section className="relative overflow-hidden bg-brand-900 py-20 text-white md:py-32">
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute -left-20 -top-20 h-96 w-96 rounded-full bg-brand-400 blur-[120px]" />
                    <div className="absolute -right-20 -bottom-20 h-96 w-96 rounded-full bg-brand-600 blur-[120px]" />
                </div>

                <div className="container relative mx-auto px-4 md:px-6">
                    <div className="max-w-3xl">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <span className="mb-4 inline-block rounded-full bg-white/10 px-4 py-1 text-sm font-medium backdrop-blur-sm">
                                The Gold Standard in Management Education
                            </span>
                            <h1 className="mb-6 font-serif text-5xl font-bold leading-tight md:text-7xl">
                                Master the Art of <span className="italic text-brand-300">Leadership</span> and Strategy.
                            </h1>
                            <p className="mb-10 text-lg text-brand-200 md:text-xl">
                                Join 50,000+ professionals learning from world-class industry experts.
                                Curated courses designed for the next generation of global leaders.
                            </p>
                            <div className="flex flex-wrap gap-4">
                                <button className="flex h-14 items-center justify-center rounded-full bg-white px-8 text-lg font-bold text-brand-900 hover:bg-brand-100 transition-all">
                                    Explore Courses
                                </button>
                                <button className="flex h-14 items-center justify-center rounded-full border border-white/30 bg-white/5 px-8 text-lg font-bold text-white backdrop-blur-sm hover:bg-white/10 transition-all">
                                    For Enterprise
                                </button>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Categories Section */}
            <section className="py-12 bg-white border-b border-brand-200">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-2xl font-bold text-brand-900">Browse by Category</h2>
                        <div className="flex items-center gap-2 text-sm font-medium text-brand-500 cursor-pointer hover:text-brand-900">
                            View All <ChevronRight size={16} />
                        </div>
                    </div>
                    <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar">
                        {CATEGORIES.map((category) => (
                            <button
                                key={category}
                                onClick={() => setSelectedCategory(category)}
                                className={cn(
                                    "whitespace-nowrap rounded-full px-6 py-2.5 text-sm font-semibold transition-all",
                                    selectedCategory === category
                                        ? "bg-brand-900 text-white shadow-lg shadow-brand-900/20"
                                        : "bg-brand-100 text-brand-600 hover:bg-brand-200"
                                )}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Search & Filter Bar (Mobile) */}
            <section className="md:hidden py-4 px-4 bg-brand-50">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-400" />
                    <input
                        type="text"
                        placeholder="Search courses..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="h-11 w-full rounded-xl border border-brand-200 bg-white pl-10 pr-4 text-sm outline-none focus:border-brand-400"
                    />
                </div>
            </section>

            {/* Courses Grid */}
            <section className="py-16 md:py-24">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div>
                            <h2 className="text-3xl font-bold text-brand-900 mb-2">
                                {selectedCategory === 'All' ? 'Featured Courses' : `${selectedCategory} Courses`}
                            </h2>
                            <p className="text-brand-500">
                                Showing {filteredCourses.length} courses that match your criteria.
                            </p>
                        </div>
                        <div className="hidden md:flex items-center gap-4">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-400" />
                                <input
                                    type="text"
                                    placeholder="Search courses..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="h-10 w-64 rounded-lg border border-brand-200 bg-white pl-10 pr-4 text-sm outline-none focus:border-brand-400"
                                />
                            </div>
                            <button className="flex h-10 items-center gap-2 rounded-lg border border-brand-200 bg-white px-4 text-sm font-medium text-brand-600 hover:bg-brand-50">
                                <Filter size={16} /> Filter
                            </button>
                        </div>
                    </div>

                    {filteredCourses.length > 0 ? (
                        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                            <AnimatePresence mode="popLayout">
                                {filteredCourses.map((course: Course) => (
                                    <CourseCard key={course.id} course={course} />
                                ))}
                            </AnimatePresence>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-20 text-center">
                            <div className="mb-4 rounded-full bg-brand-100 p-6 text-brand-400">
                                <Search size={48} />
                            </div>
                            <h3 className="text-xl font-bold text-brand-900">No courses found</h3>
                            <p className="text-brand-500">Try adjusting your search or category filters.</p>
                            <button
                                onClick={() => { setSelectedCategory('All'); setSearchQuery(''); }}
                                className="mt-6 text-sm font-bold text-brand-900 underline underline-offset-4"
                            >
                                Clear all filters
                            </button>
                        </div>
                    )}
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-brand-100">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="rounded-3xl bg-brand-900 p-8 md:p-16 text-white overflow-hidden relative">
                        <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-brand-800/50 to-transparent" />
                        <div className="relative z-10 max-w-2xl">
                            <h2 className="text-3xl md:text-4xl font-bold mb-6">Transform your organization with Management Concepts</h2>
                            <p className="text-brand-200 text-lg mb-8">
                                Empower your team with the skills they need to lead in the 21st century.
                                Get unlimited access to 500+ courses for your entire company.
                            </p>
                            <div className="flex flex-wrap gap-4">
                                <button className="h-12 rounded-full bg-white px-8 font-bold text-brand-900 hover:bg-brand-100 transition-all">
                                    Contact Sales
                                </button>
                                <button className="h-12 rounded-full border border-white/30 px-8 font-bold text-white hover:bg-white/10 transition-all">
                                    Learn More
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
