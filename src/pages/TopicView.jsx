import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight, BookOpen, Video, FileText, ArrowRight } from 'lucide-react';
import { useStore } from '../store/useStore';

const TopicView = () => {
    const { topicId } = useParams();
    const { findSubtopic } = useStore();
    const subtopic = findSubtopic(topicId);

    if (!subtopic) return <div className="p-8">Topic not found</div>;

    return (
        <div className="max-w-4xl mx-auto">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-slate-500 mb-6">
                <Link to="/dashboard" className="hover:text-slate-900">Home</Link>
                <ChevronRight size={16} />
                <Link to={`/subject/${subtopic.subjectId}`} className="hover:text-slate-900">{subtopic.subjectTitle}</Link>
                <ChevronRight size={16} />
                <Link to={`/chapter/${subtopic.chapterId}`} className="hover:text-slate-900">{subtopic.chapterTitle}</Link>
                <ChevronRight size={16} />
                <span className="text-slate-500">{subtopic.topicTitle}</span>
                <ChevronRight size={16} />
                <span className="text-slate-900 font-medium">{subtopic.title}</span>
            </div>

            {/* Main Content */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden"
            >
                <div className="p-8 lg:p-12">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                            <BookOpen size={20} />
                        </div>
                        <span className="text-sm font-medium text-blue-600">Concept</span>
                    </div>

                    <h1 className="text-4xl font-bold text-slate-900 mb-6">{subtopic.title}</h1>

                    <div className="prose prose-slate max-w-none">
                        <p className="text-lg text-slate-600 leading-relaxed mb-6">
                            Content for <strong>{subtopic.title}</strong> will be available here.
                        </p>

                        <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-lg my-6">
                            <h3 className="font-bold text-blue-900 mb-2">Context</h3>
                            <p className="text-blue-800">
                                This concept is part of <strong>{subtopic.topicTitle}</strong> in the <strong>{subtopic.chapterTitle}</strong> chapter.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Bottom Navigation */}
                <div className="border-t border-slate-100 p-6 bg-slate-50 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <Link to={`/chapter/${subtopic.chapterId}`} className="text-slate-600 hover:text-slate-900 font-medium flex items-center gap-2">
                        <ChevronRight size={20} className="rotate-180" />
                        Back to Chapter
                    </Link>
                    <div className="flex gap-3">
                        <Link to="/practice" className="px-6 py-2 rounded-lg font-medium text-slate-600 hover:bg-white border border-slate-200 transition-colors">
                            Practice Quiz
                        </Link>
                        {/* Next Topic Logic could be added here */}
                    </div>
                </div>
            </motion.div>

            {/* Sidebar Cards (Optional - shown below on mobile) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                <div className="bg-purple-50 rounded-xl p-5 border border-purple-100">
                    <div className="flex items-center gap-3 mb-3">
                        <Video size={20} className="text-purple-600" />
                        <h3 className="font-bold text-purple-900">Video Explanation</h3>
                    </div>
                    <p className="text-sm text-purple-800 mb-4">Watch a detailed video on this topic</p>
                    <button className="text-sm font-medium text-purple-600 hover:text-purple-700">Watch Now →</button>
                </div>

                <div className="bg-orange-50 rounded-xl p-5 border border-orange-100">
                    <div className="flex items-center gap-3 mb-3">
                        <FileText size={20} className="text-orange-600" />
                        <h3 className="font-bold text-orange-900">Summary Notes</h3>
                    </div>
                    <p className="text-sm text-orange-800 mb-4">Quick revision notes for this topic</p>
                    <button className="text-sm font-medium text-orange-600 hover:text-orange-700">Download →</button>
                </div>
            </div>
        </div>
    );
};

export default TopicView;
