import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight, PlayCircle, FileText, HelpCircle, CheckCircle } from 'lucide-react';
import { clsx } from 'clsx';

const ChapterView = () => {
    const { chapterId } = useParams();
    const [activeTab, setActiveTab] = useState('overview');

    // Mock Data
    const topics = [
        { id: 1, title: 'Introduction to Chemical Reactions', type: 'video', duration: '10m', completed: true },
        { id: 2, title: 'Balancing Chemical Equations', type: 'article', duration: '15m', completed: true },
        { id: 3, title: 'Types of Chemical Reactions', type: 'video', duration: '20m', completed: false },
        { id: 4, title: 'Corrosion and Rancidity', type: 'article', duration: '10m', completed: false },
        { id: 5, title: 'Chapter Quiz', type: 'quiz', duration: '30m', completed: false },
    ];

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-[calc(100vh-8rem)]">
            {/* Left Panel: Topic List */}
            <div className="lg:col-span-1 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col h-full">
                <div className="p-4 border-b border-slate-100 bg-slate-50">
                    <h2 className="font-bold text-slate-900">Chapter Content</h2>
                    <p className="text-xs text-slate-500 mt-1">5 Topics • 1h 25m Total</p>
                </div>
                <div className="overflow-y-auto flex-grow p-2 space-y-1">
                    {topics.map((topic, index) => (
                        <Link
                            key={topic.id}
                            to={`/topic/${topic.id}`}
                            className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors group"
                        >
                            <div className={clsx(
                                "w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0",
                                topic.completed ? "bg-green-100 text-green-600" : "bg-slate-100 text-slate-500"
                            )}>
                                {topic.completed ? <CheckCircle size={16} /> : index + 1}
                            </div>
                            <div className="flex-grow min-w-0">
                                <h3 className="text-sm font-medium text-slate-900 truncate group-hover:text-primary-600 transition-colors">
                                    {topic.title}
                                </h3>
                                <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                                    {topic.type === 'video' && <PlayCircle size={12} />}
                                    {topic.type === 'article' && <FileText size={12} />}
                                    {topic.type === 'quiz' && <HelpCircle size={12} />}
                                    <span className="capitalize">{topic.type}</span>
                                    <span>•</span>
                                    <span>{topic.duration}</span>
                                </div>
                            </div>
                            <ChevronRight size={16} className="text-slate-300 group-hover:text-slate-500" />
                        </Link>
                    ))}
                </div>
            </div>

            {/* Right Panel: Overview */}
            <div className="lg:col-span-2 flex flex-col gap-6 overflow-y-auto">
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8">
                    <div className="flex items-center gap-2 text-sm text-slate-500 mb-4">
                        <Link to="/subject/science" className="hover:text-slate-900">Science</Link>
                        <ChevronRight size={16} />
                        <span className="text-slate-900 font-medium">Chapter {chapterId}</span>
                    </div>

                    <h1 className="text-4xl font-bold text-slate-900 mb-4">Chemical Reactions and Equations</h1>
                    <p className="text-lg text-slate-600 leading-relaxed mb-8">
                        Learn how substances interact to form new compounds. Master the art of balancing equations and understanding different types of reactions that occur around us every day.
                    </p>

                    <div className="flex gap-4">
                        <Link to="/topic/1" className="btn btn-primary px-8 py-3 rounded-xl shadow-lg shadow-primary-500/20">
                            Continue Learning
                        </Link>
                        <button className="px-6 py-3 rounded-xl font-medium text-slate-600 hover:bg-slate-50 border border-slate-200 transition-colors">
                            View Syllabus
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
                        <h3 className="font-bold text-blue-900 mb-2">Learning Goals</h3>
                        <ul className="space-y-2 text-sm text-blue-800">
                            <li className="flex items-start gap-2">
                                <span className="mt-1">•</span>
                                <span>Identify chemical changes vs physical changes</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="mt-1">•</span>
                                <span>Balance complex chemical equations</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="mt-1">•</span>
                                <span>Classify reactions (Combination, Decomposition, etc.)</span>
                            </li>
                        </ul>
                    </div>

                    <div className="bg-orange-50 rounded-xl p-6 border border-orange-100">
                        <h3 className="font-bold text-orange-900 mb-2">Prerequisites</h3>
                        <ul className="space-y-2 text-sm text-orange-800">
                            <li className="flex items-start gap-2">
                                <span className="mt-1">•</span>
                                <span>Basic knowledge of elements and symbols</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="mt-1">•</span>
                                <span>Understanding of atoms and molecules</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChapterView;
