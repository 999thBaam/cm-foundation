import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight, PlayCircle, FileText, HelpCircle, CheckCircle, Layers } from 'lucide-react';
import { clsx } from 'clsx';
import { useStore } from '../store/useStore';
import { fetchFlashcards } from '../utils/firebaseUtils';
import FlashcardViewer from '../components/FlashcardViewer';

const ChapterView = () => {
    const { chapterId } = useParams();
    const { findChapter } = useStore();
    const chapter = findChapter(chapterId);
    const [flashcards, setFlashcards] = useState([]);
    const [loadingFlashcards, setLoadingFlashcards] = useState(true);
    const [showFlashcards, setShowFlashcards] = useState(false);

    useEffect(() => {
        if (chapterId) {
            loadFlashcards();
        }
    }, [chapterId]);

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

    if (!chapter) return <div className="p-8">Chapter not found</div>;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-[calc(100vh-8rem)]">
            {/* Left Panel: Topic List */}
            <div className="lg:col-span-1 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col h-full">
                <div className="p-4 border-b border-slate-100 bg-slate-50">
                    <h2 className="font-bold text-slate-900">Chapter Content</h2>
                    <p className="text-xs text-slate-500 mt-1">{chapter.topics.length} Topics</p>
                </div>
                <div className="overflow-y-auto flex-grow p-2 space-y-4">
                    {chapter.topics.map((topic, index) => (
                        <div key={topic.id} className="space-y-1">
                            <div className="px-3 py-2 text-sm font-bold text-slate-900 bg-slate-50 rounded-lg">
                                {index + 1}. {topic.title}
                            </div>
                            <div className="pl-2 space-y-1">
                                {topic.subtopics.map((subtopic, sIndex) => (
                                    <Link
                                        key={subtopic.id}
                                        to={`/topic/${subtopic.id}`}
                                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 transition-colors group"
                                    >
                                        <div className="w-1.5 h-1.5 rounded-full bg-slate-300 group-hover:bg-primary-500 transition-colors"></div>
                                        <div className="flex-grow min-w-0">
                                            <h3 className="text-sm text-slate-600 group-hover:text-primary-600 transition-colors truncate">
                                                {subtopic.title}
                                            </h3>
                                        </div>
                                        <ChevronRight size={14} className="text-slate-300 group-hover:text-slate-500" />
                                    </Link>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Right Panel: Overview */}
            <div className="lg:col-span-2 flex flex-col gap-6 overflow-y-auto">
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8">
                    <div className="flex items-center gap-2 text-sm text-slate-500 mb-4">
                        <Link to={`/subject/${chapter.subjectId}`} className="hover:text-slate-900">{chapter.subjectTitle}</Link>
                        <ChevronRight size={16} />
                        <span className="text-slate-900 font-medium">{chapter.title}</span>
                    </div>

                    <h1 className="text-4xl font-bold text-slate-900 mb-4">{chapter.title}</h1>
                    <p className="text-lg text-slate-600 leading-relaxed mb-8">
                        Master the concepts of {chapter.title}. Select a topic from the left to begin learning.
                    </p>

                    <div className="flex gap-4">
                        {chapter.topics.length > 0 && chapter.topics[0].subtopics.length > 0 && (
                            <Link to={`/topic/${chapter.topics[0].subtopics[0].id}`} className="btn btn-primary px-8 py-3 rounded-xl shadow-lg shadow-primary-500/20">
                                Start Learning
                            </Link>
                        )}
                        {!loadingFlashcards && flashcards.length > 0 && (
                            <button
                                onClick={() => setShowFlashcards(!showFlashcards)}
                                className="px-8 py-3 rounded-xl font-medium border-2 border-primary-500 text-primary-600 hover:bg-primary-50 transition-colors flex items-center gap-2"
                            >
                                <Layers size={20} />
                                {showFlashcards ? 'Hide' : 'View'} Flashcards ({flashcards.length})
                            </button>
                        )}
                    </div>
                </div>

                {/* Flashcards Section */}
                {showFlashcards && flashcards.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8"
                    >
                        <FlashcardViewer flashcards={flashcards} />
                    </motion.div>
                )}

                {/* Loading State */}
                {loadingFlashcards && (
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8">
                        <div className="flex items-center justify-center py-8 text-slate-400">
                            <div className="w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full animate-spin mr-3"></div>
                            Loading flashcards...
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChapterView;

