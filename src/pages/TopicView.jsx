import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight, BookOpen, Video, FileText, ArrowRight } from 'lucide-react';

const TopicView = () => {
    const { topicId } = useParams();

    return (
        <div className="max-w-4xl mx-auto">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-slate-500 mb-6">
                <Link to="/" className="hover:text-slate-900">Home</Link>
                <ChevronRight size={16} />
                <Link to="/subject/science" className="hover:text-slate-900">Science</Link>
                <ChevronRight size={16} />
                <Link to="/chapter/1" className="hover:text-slate-900">Chapter 1</Link>
                <ChevronRight size={16} />
                <span className="text-slate-900 font-medium">Topic {topicId}</span>
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
                        <span className="text-sm font-medium text-blue-600">Topic 1 of 5</span>
                    </div>

                    <h1 className="text-4xl font-bold text-slate-900 mb-6">Introduction to Chemical Reactions</h1>

                    <div className="prose prose-slate max-w-none">
                        <p className="text-lg text-slate-600 leading-relaxed mb-6">
                            A chemical reaction is a process in which one or more substances are converted into new substances with different properties. Let's explore the fundamental concepts that govern these transformations.
                        </p>

                        <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">What is a Chemical Reaction?</h2>
                        <p className="text-slate-700 leading-relaxed mb-4">
                            When substances interact and their molecular structure changes, we observe a chemical reaction. Unlike physical changes (like melting ice), chemical reactions create entirely new substances.
                        </p>

                        <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-lg my-6">
                            <h3 className="font-bold text-blue-900 mb-2">Key Concept</h3>
                            <p className="text-blue-800">
                                In a chemical reaction, the atoms are rearranged to form new molecules, but the total number of atoms remains constant (Law of Conservation of Mass).
                            </p>
                        </div>

                        <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Signs of Chemical Reactions</h2>
                        <ul className="space-y-3 text-slate-700">
                            <li className="flex items-start gap-3">
                                <span className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">1</span>
                                <span><strong>Color Change:</strong> Formation of new substances often results in color changes</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">2</span>
                                <span><strong>Gas Evolution:</strong> Bubbles or fizzing indicate gas formation</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">3</span>
                                <span><strong>Temperature Change:</strong> Reactions can release or absorb heat</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">4</span>
                                <span><strong>Precipitate Formation:</strong> Solid particles may form in a solution</span>
                            </li>
                        </ul>

                        <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Example</h2>
                        <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 font-mono text-sm">
                            <p className="text-slate-700">2H₂ + O₂ → 2H₂O</p>
                            <p className="text-slate-500 mt-2 font-sans">Hydrogen gas reacts with oxygen gas to form water</p>
                        </div>
                    </div>
                </div>

                {/* Bottom Navigation */}
                <div className="border-t border-slate-100 p-6 bg-slate-50 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <Link to="/chapter/1" className="text-slate-600 hover:text-slate-900 font-medium flex items-center gap-2">
                        <ChevronRight size={20} className="rotate-180" />
                        Back to Chapter
                    </Link>
                    <div className="flex gap-3">
                        <Link to="/practice" className="px-6 py-2 rounded-lg font-medium text-slate-600 hover:bg-white border border-slate-200 transition-colors">
                            Practice Quiz
                        </Link>
                        <Link to="/topic/2" className="btn btn-primary flex items-center gap-2">
                            Next Topic
                            <ArrowRight size={18} />
                        </Link>
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
