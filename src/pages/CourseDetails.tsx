import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
    Star,
    Clock,
    BarChart,
    Users,
    CheckCircle2,
    PlayCircle,
    ShieldCheck,
    Calendar,
    ChevronRight,
    ArrowLeft
} from 'lucide-react';
import { motion } from 'motion/react';
import { fetchCourses, Course } from '../data/courses';

export default function CourseDetails() {
    const { id } = useParams<{ id: string }>();
    const [course, setCourse] = useState<Course | null>(null);
    const [courses, setCourses] = useState<Course[]>([]);
    const [isPurchasing, setIsPurchasing] = useState(false);
    const [isPurchased, setIsPurchased] = useState(false);

    useEffect(() => {
        fetchCourses().then(setCourses).catch(console.error);
    }, []);

    useEffect(() => {
        const foundCourse = courses.find(c => c.id === id);
        if (foundCourse) {
            setCourse(foundCourse);
        }
    }, [id, courses]);

    if (!course) {
        return (
            <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
                <h2 className="text-2xl font-bold text-brand-900">Course not found</h2>
                <Link to="/" className="mt-4 text-brand-600 hover:text-brand-900 font-medium">
                    Back to all courses
                </Link>
            </div>
        );
    }

    const handlePurchase = async () => {
        if (!id) return;

        setIsPurchasing(true);
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No authentication token found');
            }

            const response = await fetch('http://localhost:8000/purchases', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ course_id: id }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || 'Purchase failed');
            }

            setIsPurchased(true);
        } catch (error) {
            console.error('Purchase error:', error);
            alert('Purchase failed. Please try again.');
        } finally {
            setIsPurchasing(false);
        }
    };

    return (
        <div className="min-h-screen bg-brand-50 pb-20">
            {/* Course Header / Hero */}
            <section className="bg-brand-900 pt-12 pb-24 text-white">
                <div className="container mx-auto px-4 md:px-6">
                    <Link to="/" className="mb-8 flex items-center gap-2 text-sm font-medium text-brand-300 hover:text-white transition-colors">
                        <ArrowLeft size={16} /> Back to Courses
                    </Link>

                    <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                        >
                            <div className="mb-4 inline-block rounded-full bg-brand-500/20 px-4 py-1 text-sm font-bold text-brand-300 backdrop-blur-sm">
                                {course.category}
                            </div>
                            <h1 className="mb-6 font-serif text-4xl font-bold leading-tight md:text-5xl">
                                {course.title}
                            </h1>
                            <p className="mb-8 text-lg text-brand-200 md:text-xl">
                                {course.description}
                            </p>

                            <div className="flex flex-wrap gap-6 text-sm font-medium">
                                <div className="flex items-center gap-2">
                                    <span className="flex items-center gap-1 text-amber-400">
                                        <Star size={18} fill="currentColor" />
                                        {course.rating}
                                    </span>
                                    <span className="text-brand-300">({course.reviews.toLocaleString()} reviews)</span>
                                </div>
                                <div className="flex items-center gap-2 text-brand-300">
                                    <Users size={18} />
                                    <span>15,420 students enrolled</span>
                                </div>
                                <div className="flex items-center gap-2 text-brand-300">
                                    <Calendar size={18} />
                                    <span>Last updated Oct 2025</span>
                                </div>
                            </div>

                            <div className="mt-8 flex items-center gap-3">
                                <div className="h-10 w-10 overflow-hidden rounded-full bg-brand-700">
                                    <img src={`https://i.pravatar.cc/150?u=${course.instructor}`} alt={course.instructor} />
                                </div>
                                <div>
                                    <p className="text-xs text-brand-400">Created by</p>
                                    <p className="text-sm font-bold text-white">{course.instructor}</p>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="relative hidden lg:block"
                        >
                            <div className="aspect-video overflow-hidden rounded-2xl shadow-2xl ring-1 ring-white/10">
                                <img src={course.image} alt={course.title} className="h-full w-full object-cover" />
                                <div className="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/40 transition-colors cursor-pointer group">
                                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/90 text-brand-900 shadow-xl transition-transform group-hover:scale-110">
                                        <PlayCircle size={40} fill="currentColor" className="ml-1" />
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Course Content / Purchase Sidebar */}
            <div className="container mx-auto -mt-16 px-4 md:px-6">
                <div className="grid gap-8 lg:grid-cols-3">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="rounded-2xl border border-brand-200 bg-white p-8 shadow-sm">
                            <h2 className="mb-6 text-2xl font-bold text-brand-900">What you'll learn</h2>
                            <div className="grid gap-4 sm:grid-cols-2">
                                {[
                                    'Advanced frameworks for decision making',
                                    'Building resilient and motivated teams',
                                    'Strategic planning in volatile markets',
                                    'Effective communication for global leaders',
                                    'Managing organizational change successfully',
                                    'Ethical leadership practices'
                                ].map((item, idx) => (
                                    <div key={idx} className="flex items-start gap-3">
                                        <CheckCircle2 size={20} className="mt-0.5 shrink-0 text-emerald-500" />
                                        <span className="text-sm text-brand-600">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="rounded-2xl border border-brand-200 bg-white p-8 shadow-sm">
                            <h2 className="mb-6 text-2xl font-bold text-brand-900">Course Content</h2>
                            <div className="space-y-4">
                                {[
                                    { title: 'Module 1: Foundations of Excellence', duration: '2h 15m' },
                                    { title: 'Module 2: Strategic Vision & Execution', duration: '3h 45m' },
                                    { title: 'Module 3: Leading Through Influence', duration: '2h 30m' },
                                    { title: 'Module 4: Global Market Dynamics', duration: '4h 10m' }
                                ].map((mod, idx) => (
                                    <div key={idx} className="flex items-center justify-between rounded-xl border border-brand-100 bg-brand-50/50 p-4 transition-colors hover:bg-brand-50">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-brand-500 shadow-sm">
                                                <PlayCircle size={18} />
                                            </div>
                                            <span className="font-semibold text-brand-900">{mod.title}</span>
                                        </div>
                                        <span className="text-sm font-medium text-brand-500">{mod.duration}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Purchase Sidebar */}
                    <div className="lg:relative">
                        <div className="sticky top-24 rounded-2xl border border-brand-200 bg-white p-8 shadow-xl shadow-brand-900/5">
                            <div className="mb-6 flex items-baseline gap-2">
                                <span className="text-4xl font-black text-brand-900">${course.price}</span>
                                <span className="text-sm text-brand-400 line-through">$199.99</span>
                                <span className="text-sm font-bold text-emerald-500">55% OFF</span>
                            </div>

                            {!isPurchased ? (
                                <button
                                    onClick={handlePurchase}
                                    disabled={isPurchasing}
                                    className="mb-4 flex w-full items-center justify-center gap-2 rounded-xl bg-brand-900 py-4 text-lg font-bold text-white transition-all hover:bg-brand-800 disabled:opacity-70"
                                >
                                    {isPurchasing ? (
                                        <span className="flex items-center gap-2">
                                            <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                            Processing...
                                        </span>
                                    ) : (
                                        'Purchase Content'
                                    )}
                                </button>
                            ) : (
                                <div className="mb-4 rounded-xl bg-emerald-50 p-4 text-center">
                                    <div className="mb-2 flex justify-center text-emerald-500">
                                        <ShieldCheck size={48} />
                                    </div>
                                    <h3 className="font-bold text-emerald-900">Successfully Purchased!</h3>
                                    <p className="text-sm text-emerald-700">You now have lifetime access to this course.</p>
                                    <button className="mt-4 w-full rounded-lg bg-emerald-600 py-2 font-bold text-white hover:bg-emerald-700">
                                        Start Learning
                                    </button>
                                </div>
                            )}

                            <p className="mb-6 text-center text-xs text-brand-500">
                                30-Day Money-Back Guarantee. Full Lifetime Access.
                            </p>

                            <div className="space-y-4 border-t border-brand-100 pt-6">
                                <h4 className="font-bold text-brand-900">This course includes:</h4>
                                <div className="flex items-center gap-3 text-sm text-brand-600">
                                    <Clock size={16} className="text-brand-400" />
                                    <span>{course.duration} on-demand video</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-brand-600">
                                    <BarChart size={16} className="text-brand-400" />
                                    <span>{course.level} Level</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-brand-600">
                                    <CheckCircle2 size={16} className="text-brand-400" />
                                    <span>Full lifetime access</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-brand-600">
                                    <ShieldCheck size={16} className="text-brand-400" />
                                    <span>Certificate of completion</span>
                                </div>
                            </div>

                            <div className="mt-8 flex items-center justify-center gap-4 border-t border-brand-100 pt-6">
                                <button className="text-sm font-bold text-brand-900 underline underline-offset-4">Apply Coupon</button>
                                <button className="text-sm font-bold text-brand-900 underline underline-offset-4">Share</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
