import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight, BookOpen, Video, FileText, ArrowRight, Home, Layers, Info, Play, Download } from 'lucide-react';
import { useStore } from '../store/useStore';

const TopicView = () => {
    const { topicId } = useParams();
    const { findSubtopic } = useStore();
    const subtopic = findSubtopic(topicId);

    if (!subtopic) return <div className="p-8">Topic not found</div>;

    return (
        <div className="max-w-4xl mx-auto pb-24"> {/* Added padding bottom for sticky bar */}

            {/* Breadcrumb - Capsule Style */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/60 backdrop-blur-sm border border-slate-200/60 rounded-full text-sm text-slate-500 mb-8 shadow-sm">
                <Link to="/dashboard" className="hover:text-primary-600 transition-colors flex items-center gap-1.5">
                    <Home size={14} />
                    <span>Home</span>
                </Link>
                <ChevronRight size={14} className="text-slate-300" />
                <Link to={`/subject/${subtopic.subjectId}`} className="hover:text-primary-600 transition-colors flex items-center gap-1.5">
                    <BookOpen size={14} />
                    <span>{subtopic.subjectTitle}</span>
                </Link>
                <ChevronRight size={14} className="text-slate-300" />
                <Link to={`/chapter/${subtopic.chapterId}`} className="hover:text-primary-600 transition-colors flex items-center gap-1.5">
                    <Layers size={14} />
                    <span>{subtopic.chapterTitle}</span>
                </Link>
                <ChevronRight size={14} className="text-slate-300" />
                <span className="text-slate-900 font-medium flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary-500"></div>
                    {subtopic.title}
                </span>
            </div>

            {/* Main Hero Card */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-br from-white to-slate-50 rounded-3xl border border-white shadow-xl shadow-slate-200/50 overflow-hidden relative"
            >
                {/* Decorative top accent */}
                <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary-400 via-purple-400 to-orange-400"></div>

                <div className="p-8 lg:p-12">
                    {/* Header Section */}
                    <div className="mb-8">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-xs font-bold uppercase tracking-wider mb-4 border border-blue-100">
                            <BookOpen size={12} />
                            Concept
                        </div>

                        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-3 tracking-tight">
                            {subtopic.title}
                        </h1>
                        <p className="text-lg text-slate-500 font-medium">
                            Master the core concepts of {subtopic.topicTitle}
                        </p>

                        {/* Divider */}
                        <div className="w-20 h-1 bg-primary-500 rounded-full mt-6"></div>
                    </div>

                    {/* Content Area */}
                    <div className="prose prose-slate prose-lg max-w-none">
                        <p className="text-slate-600 leading-relaxed mb-8">
                            Content for <strong>{subtopic.title}</strong> will be available here. This section is designed to be easy to read with comfortable spacing and clear typography.
                        </p>

                        {/* Context Box - Soft Info Card */}
                        <div className="bg-blue-50/50 rounded-2xl p-6 flex gap-4 items-start border border-blue-100/50">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 flex-shrink-0 shadow-sm">
                                <Info size={20} />
                            </div>
                            <div>
                                <h3 className="font-bold text-blue-900 text-lg mb-1">Context</h3>
                                <p className="text-blue-800/80 leading-relaxed">
                                    This concept is a fundamental part of <strong>{subtopic.topicTitle}</strong> in the <strong>{subtopic.chapterTitle}</strong> chapter. Understanding this is key to solving advanced problems.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Resources Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                {/* Video Card - Larger & Prominent */}
                <motion.div
                    whileHover={{ y: -4, shadow: "0 10px 30px -10px rgba(147, 51, 234, 0.2)" }}
                    className="md:col-span-2 bg-white rounded-2xl p-6 border border-slate-100 shadow-sm group cursor-pointer relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 p-20 bg-purple-50 rounded-full -mr-10 -mt-10 opacity-50 group-hover:scale-110 transition-transform duration-500"></div>

                    <div className="relative z-10 flex items-start gap-4">
                        <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600 shadow-sm group-hover:bg-purple-600 group-hover:text-white transition-colors duration-300">
                            <Video size={24} />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-slate-900 mb-1 group-hover:text-purple-700 transition-colors">Video Explanation</h3>
                            <p className="text-slate-500 mb-4">Watch a detailed breakdown of this concept.</p>
                            <div className="inline-flex items-center gap-2 text-sm font-bold text-purple-600 bg-purple-50 px-3 py-1.5 rounded-lg">
                                <Play size={14} fill="currentColor" />
                                5 min watch
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Notes Card */}
                <motion.div
                    whileHover={{ y: -4, shadow: "0 10px 30px -10px rgba(249, 115, 22, 0.2)" }}
                    className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm group cursor-pointer relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 p-16 bg-orange-50 rounded-full -mr-8 -mt-8 opacity-50 group-hover:scale-110 transition-transform duration-500"></div>

                    <div className="relative z-10">
                        <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center text-orange-600 shadow-sm mb-4 group-hover:bg-orange-500 group-hover:text-white transition-colors duration-300">
                            <FileText size={24} />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-1 group-hover:text-orange-700 transition-colors">Summary Notes</h3>
                        <p className="text-slate-500 mb-4 text-sm">Quick revision cheat sheet.</p>
                        <button className="text-orange-600 font-bold text-sm flex items-center gap-2 group-hover:translate-x-1 transition-transform">
                            Download PDF <ArrowRight size={16} />
                        </button>
                    </div>
                </motion.div>
            </div>

            {/* Sticky Bottom Action Bar */}
            <div className="fixed bottom-6 left-0 right-0 z-40 px-4 pointer-events-none">
                <div className="max-w-4xl mx-auto flex justify-between items-center bg-white/90 backdrop-blur-xl p-2 rounded-2xl shadow-2xl border border-white/20 pointer-events-auto ring-1 ring-slate-900/5">
                    <Link
                        to={`/chapter/${subtopic.chapterId}`}
                        className="px-6 py-3 rounded-xl font-bold text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors flex items-center gap-2"
                    >
                        <ChevronRight size={20} className="rotate-180" />
                        Back to Chapter
                    </Link>

                    <Link
                        to="/practice"
                        className="px-8 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold shadow-lg shadow-orange-500/30 hover:shadow-orange-500/40 hover:-translate-y-0.5 transition-all flex items-center gap-2"
                    >
                        <span>Start Practice Quiz</span>
                        <ArrowRight size={20} />
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default TopicView;
