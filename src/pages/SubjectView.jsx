import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Book, ChevronRight, Star, Clock } from 'lucide-react';

const SubjectView = () => {
    const { subjectId } = useParams();
    const subjectName = subjectId ? subjectId.charAt(0).toUpperCase() + subjectId.slice(1) : 'Subject';

    // Mock Data
    const chapters = [
        { id: 1, title: 'Chemical Reactions', topics: 5, progress: 100, color: 'bg-blue-500' },
        { id: 2, title: 'Acids, Bases and Salts', topics: 8, progress: 60, color: 'bg-green-500' },
        { id: 3, title: 'Metals and Non-metals', topics: 6, progress: 30, color: 'bg-yellow-500' },
        { id: 4, title: 'Carbon and its Compounds', topics: 10, progress: 0, color: 'bg-purple-500' },
        { id: 5, title: 'Periodic Classification', topics: 4, progress: 0, color: 'bg-red-500' },
        { id: 6, title: 'Life Processes', topics: 12, progress: 0, color: 'bg-indigo-500' },
    ];

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.05
            }
        }
    };

    const item = {
        hidden: { opacity: 0, scale: 0.95 },
        show: { opacity: 1, scale: 1 }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-2 text-sm text-slate-500">
                <Link to="/" className="hover:text-slate-900">Home</Link>
                <ChevronRight size={16} />
                <span className="text-slate-900 font-medium">{subjectName}</span>
            </div>

            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">{subjectName}</h1>
                    <p className="text-slate-600 mt-1">Select a chapter to start learning.</p>
                </div>
            </div>

            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
            >
                {chapters.map((chapter) => (
                    <Link key={chapter.id} to={`/chapter/${chapter.id}`} className="group">
                        <motion.div
                            variants={item}
                            whileHover={{ y: -4 }}
                            className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-all h-full flex flex-col"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className={`w-10 h-10 rounded-lg ${chapter.color} bg-opacity-10 flex items-center justify-center text-${chapter.color.split('-')[1]}-600`}>
                                    <Book size={20} />
                                </div>
                                {chapter.progress > 0 && (
                                    <span className="text-xs font-bold px-2 py-1 bg-green-100 text-green-700 rounded-full">
                                        {chapter.progress}%
                                    </span>
                                )}
                            </div>

                            <h3 className="font-bold text-slate-900 text-lg mb-1 group-hover:text-primary-600 transition-colors">
                                {chapter.title}
                            </h3>
                            <p className="text-sm text-slate-500 mb-4">{chapter.topics} Topics</p>

                            <div className="mt-auto pt-4 border-t border-slate-50 flex items-center justify-between text-xs text-slate-400">
                                <span className="flex items-center gap-1"><Clock size={14} /> 2h 30m</span>
                                <span className="flex items-center gap-1"><Star size={14} /> 4.8</span>
                            </div>

                            {/* Progress Line */}
                            <div className="absolute bottom-0 left-0 w-full h-1 bg-slate-50">
                                <div
                                    className={`h-full ${chapter.color}`}
                                    style={{ width: `${chapter.progress}%` }}
                                ></div>
                            </div>
                        </motion.div>
                    </Link>
                ))}
            </motion.div>
        </div>
    );
};

export default SubjectView;
