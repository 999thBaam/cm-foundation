import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Book, ChevronRight, Star, Clock } from 'lucide-react';
import { useStore } from '../store/useStore';

const SubjectView = () => {
    const { subjectId } = useParams();
    const { getSubject } = useStore();
    const subject = getSubject(subjectId);

    if (!subject) return <div className="p-8">Subject not found</div>;

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
                <Link to="/dashboard" className="hover:text-slate-900">Home</Link>
                <ChevronRight size={16} />
                <span className="text-slate-900 font-medium">{subject.title}</span>
            </div>

            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">{subject.title}</h1>
                    <p className="text-slate-600 mt-1">Select a chapter to start learning.</p>
                </div>
            </div>

            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
            >
                {subject.chapters.map((chapter) => (
                    <Link key={chapter.id} to={`/chapter/${chapter.id}`} className="group">
                        <motion.div
                            variants={item}
                            whileHover={{ y: -4 }}
                            className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-all h-full flex flex-col"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className={`w-10 h-10 rounded-lg ${subjectId.includes('math') ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'
                                    } flex items-center justify-center`}>
                                    <Book size={20} />
                                </div>
                                {/* Progress placeholder */}
                                {/* <span className="text-xs font-bold px-2 py-1 bg-green-100 text-green-700 rounded-full">0%</span> */}
                            </div>

                            <h3 className="font-bold text-slate-900 text-lg mb-1 group-hover:text-primary-600 transition-colors">
                                {chapter.title}
                            </h3>
                            <p className="text-sm text-slate-500 mb-4">{chapter.topics.length} Topics</p>

                            <div className="mt-auto pt-4 border-t border-slate-50 flex items-center justify-between text-xs text-slate-400">
                                <span className="flex items-center gap-1"><Clock size={14} /> 2h 30m</span>
                                <span className="flex items-center gap-1"><Star size={14} /> 4.8</span>
                            </div>

                            {/* Progress Line */}
                            <div className="absolute bottom-0 left-0 w-full h-1 bg-slate-50">
                                <div
                                    className={`h-full ${subjectId.includes('math') ? 'bg-purple-500' : 'bg-blue-500'}`}
                                    style={{ width: '0%' }}
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
