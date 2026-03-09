import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Course, fetchUserCourses } from '../data/courses';
import CourseCard from '../components/CourseCard';

export default function UserCourses() {
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadUserCourses = async () => {
            try {
                const userCourses = await fetchUserCourses();
                setCourses(userCourses);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to load courses');
            } finally {
                setLoading(false);
            }
        };
        loadUserCourses();
    }, []);

    if (loading) {
        return (
            <main className="flex-1">
                <div className="container mx-auto px-4 md:px-6 py-12">
                    <div className="text-center">
                        <div className="text-lg text-brand-600">Loading your courses...</div>
                    </div>
                </div>
            </main>
        );
    }

    if (error) {
        return (
            <main className="flex-1">
                <div className="container mx-auto px-4 md:px-6 py-12">
                    <div className="text-center">
                        <div className="text-red-600 text-lg">{error}</div>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="flex-1">
            {/* Header Section */}
            <section className="py-12 bg-white border-b border-brand-200">
                <div className="container mx-auto px-4 md:px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <h1 className="text-3xl md:text-4xl font-serif font-bold text-brand-900 mb-4">
                            My Courses
                        </h1>
                        <p className="text-lg text-brand-600">
                            Access your purchased management courses and continue learning.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Courses Grid */}
            <section className="py-12 bg-brand-50">
                <div className="container mx-auto px-4 md:px-6">
                    {courses.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="text-xl text-brand-600 mb-4">No courses purchased yet</div>
                            <p className="text-brand-500">Browse our catalog to find courses that interest you.</p>
                        </div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
                        >
                            <AnimatePresence>
                                {courses.map((course) => (
                                    <motion.div
                                        key={course.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <CourseCard course={course} />
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </motion.div>
                    )}
                </div>
            </section>
        </main>
    );
}
