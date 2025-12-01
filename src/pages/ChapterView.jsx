import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronDown, PlayCircle, FileText, HelpCircle, Lightbulb, Calculator, Rocket, Layers, Lock, Play } from 'lucide-react';
import { clsx } from 'clsx';
import { useStore } from '../store/useStore';
import { fetchFlashcards } from '../utils/firebaseUtils';
import FlashcardViewer from '../components/FlashcardViewer';

// Icon mapping for topic types
const getTopicIcon = (title) => {
    const lower = title.toLowerCase();
    if (lower.includes('concept') || lower.includes('definition')) return Lightbulb;
    if (lower.includes('formula') || lower.includes('equation')) return Calculator;
    if (lower.includes('application') || lower.includes('example')) return Rocket;
    return Layers;
};

const ChapterView = () => {
    const { chapterId } = useParams();
    const { findChapter } = useStore();
    const chapter = findChapter(chapterId);
    const [flashcards, setFlashcards] = useState([]);
    const [loadingFlashcards, setLoadingFlashcards] = useState(true);
    const [showFlashcards, setShowFlashcards] = useState(false);
    const [expandedSections, setExpandedSections] = useState({});

    useEffect(() => {
        if (chapterId) {
            loadFlashcards();
        }
    }, [chapterId]);

    useEffect(() => {
        // Expand all sections by default
        if (chapter) {
            const expanded = {};
            chapter.topics.forEach((topic) => {
                expanded[topic.id] = true;
            });
            setExpandedSections(expanded);
        }
    }, [chapter?.id]);

    const loadFlashcards = async () => {
        setLoadingFlashcards(true);
        try {
            const cards = await fetchFlashcards(chapterId);
            setFlashcards(cards);
        } catch (error) {
            console.error('Error loading flashcards:', error);
        } finally {
            setLoadingFlashcards(false);
        }
    };

    const toggleSection = (topicId) => {
        setExpandedSections(prev => ({
            ...prev,
            [topicId]: !prev[topicId]
        }));
    };

    if (!chapter) return <div className="p-8">Chapter not found</div>;

    // Extract chapter number from title if it exists
    const chapterNumber = chapter.title.match(/\d+/)?.[0] || '1';

    return (
        <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6 h-[calc(100vh-8rem)]">
            {/* Left Sidebar - Navigation Panel */}
            <div className="bg-gradient-to-br from-slate-50 to-white rounded-3xl border border-slate-200/60 shadow-lg shadow-slate-200/40 overflow-hidden flex flex-col h-full">
                <div className="p-5 border-b border-slate-200/60 bg-white/80 backdrop-blur-sm">
                    <h2 className="font-bold text-slate-900 text-lg">Chapter Content</h2>
                    <p className="text-xs text-slate-500 mt-1">{chapter.topics.length} Topics</p>
                </div>

                <div className="overflow-y-auto flex-grow p-3 space-y-3">
                    {chapter.topics.map((topic, index) => {
                        const Icon = getTopicIcon(topic.title);
                        const isExpanded = expandedSections[topic.id];

                        return (
                            <motion.div
                                key={topic.id}
                                className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                            >
                                {/* Section Header */}
                                <button
                                    onClick={() => toggleSection(topic.id)}
                                    className="w-full px-4 py-3 flex items-center gap-3 hover:bg-slate-50 transition-colors group"
                                >
                                    <div className="w-8 h-8 bg-primary-50 rounded-lg flex items-center justify-center text-primary-600 group-hover:bg-primary-100 transition-colors">
                                        <Icon size={16} />
                                    </div>
                                    <div className="flex-grow text-left">
                                        <h3 className="text-sm font-bold text-slate-900">
                                            {index + 1}. {topic.title}
                                        </h3>
                                        <p className="text-xs text-slate-500">{topic.subtopics.length} items</p>
                                    </div>
                                    <motion.div
                                        animate={{ rotate: isExpanded ? 180 : 0 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <ChevronDown size={18} className="text-slate-400" />
                                    </motion.div>
                                </button>

                                {/* Subtopics List */}
                                <AnimatePresence>
                                    {isExpanded && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.2 }}
                                            className="border-t border-slate-100"
                                        >
                                            <div className="p-2 space-y-1 bg-slate-50/50">
                                                {topic.subtopics.map((subtopic) => (
                                                    <Link
                                                        key={subtopic.id}
                                                        to={`/topic/${subtopic.id}`}
                                                        className="group relative flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white hover:shadow-sm transition-all hover:translate-x-1"
                                                    >
                                                        {/* Active indicator */}
                                                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-0 bg-primary-500 rounded-r-full group-hover:h-8 transition-all" />

                                                        <div className="w-1.5 h-1.5 rounded-full bg-slate-300 group-hover:bg-primary-500 group-hover:scale-125 transition-all" />

                                                        <div className="flex-grow min-w-0">
                                                            <h4 className="text-sm text-slate-600 group-hover:text-primary-600 group-hover:font-medium transition-all truncate">
                                                                {subtopic.title}
                                                            </h4>
                                                        </div>

                                                        <ChevronRight size={14} className="text-slate-300 group-hover:text-primary-500 opacity-0 group-hover:opacity-100 transition-all" />
                                                    </Link>
                                                ))}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        );
                    })}
                </div>
            </div>

            {/* Right Panel: Hero Header + Content */}
            <div className="flex flex-col gap-6 overflow-y-auto pr-2">
                {/* Hero Header Container */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-br from-white via-slate-50/30 to-white rounded-3xl border border-white shadow-xl shadow-slate-200/50 p-8 relative overflow-hidden"
                >
                    {/* Decorative background */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary-50 rounded-full blur-3xl opacity-30 -mr-32 -mt-32" />

                    <div className="relative z-10">
                        {/* Breadcrumb */}
                        <div className="flex items-center gap-2 text-sm text-slate-500 mb-4">
                            <Link to={`/subject/${chapter.subjectId}`} className="hover:text-primary-600 transition-colors font-medium">
                                {chapter.subjectTitle}
                            </Link>
                            <ChevronRight size={14} className="text-slate-300" />
                            <span className="text-slate-900 font-semibold">{chapter.title}</span>
                        </div>

                        {/* Chapter Badge */}
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary-50 text-primary-700 rounded-full text-xs font-bold uppercase tracking-wider mb-4 border border-primary-100">
                            <Layers size={12} />
                            Chapter {chapterNumber}
                        </div>

                        {/* Title */}
                        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-3 tracking-tight leading-tight">
                            {chapter.title}
                        </h1>

                        {/* Colored underline */}
                        <div className="w-24 h-1.5 bg-gradient-to-r from-primary-500 to-purple-500 rounded-full mb-6" />

                        <p className="text-lg text-slate-600 leading-relaxed mb-8 max-w-2xl">
                            Master the concepts of {chapter.title}. Select a topic from the left to begin learning.
                        </p>

                        {/* Action Buttons */}
                        <div className="flex flex-wrap gap-4">
                            {chapter.topics.length > 0 && chapter.topics[0].subtopics.length > 0 && (
                                <Link
                                    to={`/topic/${chapter.topics[0].subtopics[0].id}`}
                                    className="group px-8 py-4 bg-primary-600 hover:bg-primary-700 text-white rounded-2xl font-bold shadow-lg shadow-primary-500/30 hover:shadow-primary-500/40 hover:-translate-y-0.5 transition-all flex items-center gap-3"
                                >
                                    <Play size={20} fill="currentColor" />
                                    <span>Start Learning</span>
                                </Link>
                            )}
                            {!loadingFlashcards && flashcards.length > 0 && (
                                <button
                                    onClick={() => setShowFlashcards(!showFlashcards)}
                                    className="px-8 py-4 rounded-2xl font-bold border-2 border-primary-200 text-primary-700 hover:bg-primary-50 hover:border-primary-300 transition-all flex items-center gap-3"
                                >
                                    <Layers size={20} />
                                    {showFlashcards ? 'Hide' : 'View'} Flashcards ({flashcards.length})
                                </button>
                            )}
                        </div>
                    </div>
                </motion.div>

                {/* Placeholder Content Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Video Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm relative overflow-hidden group hover:shadow-md transition-all"
                    >
                        <div className="absolute top-0 right-0 p-16 bg-purple-50 rounded-full -mr-8 -mt-8 opacity-40" />
                        <div className="relative z-10">
                            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600 mb-4">
                                <PlayCircle size={24} />
                            </div>
                            <h3 className="font-bold text-slate-900 mb-2">Video Lessons</h3>
                            <p className="text-sm text-slate-500 mb-4">Watch detailed explanations</p>
                            <div className="flex items-center gap-2 text-xs text-purple-600 font-semibold">
                                <Lock size={12} />
                                <span>Coming soon</span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Notes Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm relative overflow-hidden group hover:shadow-md transition-all"
                    >
                        <div className="absolute top-0 right-0 p-16 bg-blue-50 rounded-full -mr-8 -mt-8 opacity-40" />
                        <div className="relative z-10">
                            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 mb-4">
                                <FileText size={24} />
                            </div>
                            <h3 className="font-bold text-slate-900 mb-2">Study Notes</h3>
                            <p className="text-sm text-slate-500 mb-4">Quick revision materials</p>
                            <div className="flex items-center gap-2 text-xs text-blue-600 font-semibold">
                                <Lock size={12} />
                                <span>Coming soon</span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Quiz Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm relative overflow-hidden group hover:shadow-md transition-all"
                    >
                        <div className="absolute top-0 right-0 p-16 bg-orange-50 rounded-full -mr-8 -mt-8 opacity-40" />
                        <div className="relative z-10">
                            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center text-orange-600 mb-4">
                                <HelpCircle size={24} />
                            </div>
                            <h3 className="font-bold text-slate-900 mb-2">Practice Quiz</h3>
                            <p className="text-sm text-slate-500 mb-4">Test your knowledge</p>
                            <div className="flex items-center gap-2 text-xs text-orange-600 font-semibold">
                                <Lock size={12} />
                                <span>Coming soon</span>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Flashcards Section */}
                {showFlashcards && flashcards.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-3xl border border-slate-100 shadow-lg p-8"
                    >
                        <FlashcardViewer flashcards={flashcards} />
                    </motion.div>
                )}

                {/* Loading State */}
                {loadingFlashcards && (
                    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8">
                        <div className="flex items-center justify-center py-8 text-slate-400">
                            <div className="w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full animate-spin mr-3" />
                            Loading flashcards...
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChapterView;
