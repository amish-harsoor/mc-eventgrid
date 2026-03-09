import React from 'react';
import { Star, Clock, BarChart } from 'lucide-react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Course } from '../data/courses';

interface CourseCardProps {
    course: Course;
    key?: React.Key;
}

const CourseCard = ({ course }: CourseCardProps) => {
    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="group flex flex-col overflow-hidden rounded-2xl border border-brand-200 bg-white transition-all hover:shadow-xl hover:shadow-brand-900/5"
        >
            <Link to={`/course/${course.id}`} className="relative aspect-video overflow-hidden">
                <img
                    src={course.image}
                    alt={course.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                />
                <div className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-brand-900 backdrop-blur-sm">
                    {course.category}
                </div>
            </Link>
            <div className="flex flex-1 flex-col p-5">
                <div className="mb-2 flex items-center gap-1 text-xs font-medium text-brand-500">
                    <span className="flex items-center gap-0.5 text-amber-500">
                        <Star size={12} fill="currentColor" />
                        {course.rating}
                    </span>
                    <span>({course.reviews.toLocaleString()} reviews)</span>
                </div>
                <Link to={`/course/${course.id}`}>
                    <h3 className="mb-2 text-lg font-bold leading-tight text-brand-900 group-hover:text-brand-600 transition-colors">
                        {course.title}
                    </h3>
                </Link>
                <p className="mb-4 text-sm text-brand-500 line-clamp-2">
                    {course.description}
                </p>
                <div className="mt-auto flex items-center justify-between">
                    <div className="flex flex-col">
                        <span className="text-xs text-brand-400">Instructor</span>
                        <span className="text-sm font-medium text-brand-700">{course.instructor}</span>
                    </div>
                    <div className="text-right">
                        <span className="text-xl font-bold text-brand-900">${course.price}</span>
                    </div>
                </div>
                <div className="mt-4 flex items-center gap-4 border-t border-brand-100 pt-4 text-[11px] font-medium text-brand-400 uppercase tracking-wider">
                    <span className="flex items-center gap-1">
                        <Clock size={12} />
                        {course.duration}
                    </span>
                    <span className="flex items-center gap-1">
                        <BarChart size={12} />
                        {course.level}
                    </span>
                </div>
            </div>
        </motion.div>
    );
};

export default CourseCard;
