import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, Save, X, BookOpen, AlertCircle } from 'lucide-react';
import { fetchAllFlashcards, addFlashcard, updateFlashcard, deleteFlashcard } from '../../utils/supabaseUtils';
import { useStore } from '../../store/useStore';

const FlashcardManager = () => {
    const { curriculum } = useStore();
    const [selectedChapterId, setSelectedChapterId] = useState('');
    const [flashcards, setFlashcards] = useState([]);
    const [loading, setLoading] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [formData, setFormData] = useState({
        question: '',
        answer: '',
        difficulty: 'medium'
    });

    // Get all chapters from curriculum
    const allChapters = curriculum.subjects.flatMap(subject =>
        subject.chapters.map(chapter => ({
            ...chapter,
            subjectTitle: subject.title
        }))
    );

    // Load flashcards when component mounts or chapter changes
    useEffect(() => {
        loadFlashcards();
    }, [selectedChapterId]);

    const loadFlashcards = async () => {
        if (!selectedChapterId) {
            setFlashcards([]);
            return;
        }

        setLoading(true);
        try {
            const allFlashcards = await fetchAllFlashcards();
            const chapterFlashcards = allFlashcards.filter(f => f.chapterId === selectedChapterId);
            setFlashcards(chapterFlashcards);
        } catch (error) {
            console.error('Error loading flashcards:', error);
            alert('Failed to load flashcards');
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = async () => {
        if (!formData.question.trim() || !formData.answer.trim()) {
            alert('Please fill in both question and answer');
            return;
        }

        setLoading(true);
        try {
            await addFlashcard(selectedChapterId, formData);
            setFormData({ question: '', answer: '', difficulty: 'medium' });
            setShowAddForm(false);
            await loadFlashcards();
        } catch (error) {
            console.error('Error adding flashcard:', error);
            alert('Failed to add flashcard');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async (flashcardId) => {
        const flashcard = flashcards.find(f => f.id === flashcardId);
        if (!flashcard.question.trim() || !flashcard.answer.trim()) {
            alert('Please fill in both question and answer');
            return;
        }

        setLoading(true);
        try {
            await updateFlashcard(flashcardId, {
                question: flashcard.question,
                answer: flashcard.answer,
                difficulty: flashcard.difficulty
            });
            setEditingId(null);
            await loadFlashcards();
        } catch (error) {
            console.error('Error updating flashcard:', error);
            alert('Failed to update flashcard');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (flashcardId) => {
        if (!confirm('Are you sure you want to delete this flashcard?')) return;

        setLoading(true);
        try {
            await deleteFlashcard(flashcardId);
            await loadFlashcards();
        } catch (error) {
            console.error('Error deleting flashcard:', error);
            alert('Failed to delete flashcard');
        } finally {
            setLoading(false);
        }
    };

    const updateFlashcardField = (id, field, value) => {
        setFlashcards(flashcards.map(f =>
            f.id === id ? { ...f, [field]: value } : f
        ));
    };

    return (
        <div className="space-y-6">
            {/* Chapter Selector */}
            <div className="bg-white rounded-xl border border-slate-100 p-6">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                    Select Chapter
                </label>
                <select
                    value={selectedChapterId}
                    onChange={(e) => setSelectedChapterId(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                    <option value="">-- Choose a chapter --</option>
                    {allChapters.map(chapter => (
                        <option key={chapter.id} value={chapter.id}>
                            {chapter.subjectTitle} → {chapter.title}
                        </option>
                    ))}
                </select>
            </div>

            {/* Flashcards List */}
            {selectedChapterId && (
                <div className="bg-white rounded-xl border border-slate-100 p-6">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h3 className="text-lg font-bold text-slate-900">
                                Flashcards ({flashcards.length})
                            </h3>
                            <p className="text-sm text-slate-500">
                                Manage flashcards for this chapter
                            </p>
                        </div>
                        <button
                            onClick={() => setShowAddForm(!showAddForm)}
                            className="btn btn-primary flex items-center gap-2"
                            disabled={loading}
                        >
                            {showAddForm ? <X size={18} /> : <Plus size={18} />}
                            {showAddForm ? 'Cancel' : 'Add Flashcard'}
                        </button>
                    </div>

                    {/* Add Form */}
                    <AnimatePresence>
                        {showAddForm && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="mb-6 p-4 bg-slate-50 rounded-lg border border-slate-200"
                            >
                                <div className="space-y-3">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">
                                            Question (Front)
                                        </label>
                                        <textarea
                                            value={formData.question}
                                            onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                                            className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
                                            rows="2"
                                            placeholder="Enter the question..."
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">
                                            Answer (Back)
                                        </label>
                                        <textarea
                                            value={formData.answer}
                                            onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                                            className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
                                            rows="3"
                                            placeholder="Enter the answer..."
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">
                                            Difficulty
                                        </label>
                                        <select
                                            value={formData.difficulty}
                                            onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                                            className="px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
                                        >
                                            <option value="easy">Easy</option>
                                            <option value="medium">Medium</option>
                                            <option value="hard">Hard</option>
                                        </select>
                                    </div>
                                    <button
                                        onClick={handleAdd}
                                        disabled={loading}
                                        className="btn btn-primary flex items-center gap-2"
                                    >
                                        <Save size={18} />
                                        Save Flashcard
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Flashcards List */}
                    {loading && flashcards.length === 0 ? (
                        <div className="flex items-center justify-center py-12 text-slate-400">
                            <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin mr-3"></div>
                            Loading flashcards...
                        </div>
                    ) : flashcards.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                            <BookOpen size={48} className="mb-4 opacity-20" />
                            <p>No flashcards yet. Add your first one!</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {flashcards.map((flashcard, index) => (
                                <motion.div
                                    key={flashcard.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="p-4 border border-slate-200 rounded-lg hover:border-slate-300 transition-colors"
                                >
                                    {editingId === flashcard.id ? (
                                        // Edit Mode
                                        <div className="space-y-3">
                                            <div>
                                                <label className="block text-xs font-medium text-slate-600 mb-1">
                                                    Question
                                                </label>
                                                <textarea
                                                    value={flashcard.question}
                                                    onChange={(e) => updateFlashcardField(flashcard.id, 'question', e.target.value)}
                                                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                                                    rows="2"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-medium text-slate-600 mb-1">
                                                    Answer
                                                </label>
                                                <textarea
                                                    value={flashcard.answer}
                                                    onChange={(e) => updateFlashcardField(flashcard.id, 'answer', e.target.value)}
                                                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                                                    rows="3"
                                                />
                                            </div>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleUpdate(flashcard.id)}
                                                    disabled={loading}
                                                    className="px-3 py-1.5 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors flex items-center gap-1"
                                                >
                                                    <Save size={14} />
                                                    Save
                                                </button>
                                                <button
                                                    onClick={() => setEditingId(null)}
                                                    className="px-3 py-1.5 bg-slate-200 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-300 transition-colors flex items-center gap-1"
                                                >
                                                    <X size={14} />
                                                    Cancel
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        // View Mode
                                        <div>
                                            <div className="flex justify-between items-start mb-2">
                                                <div className="flex-grow">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className="text-xs font-medium text-slate-500">
                                                            #{index + 1}
                                                        </span>
                                                        <span className={`text-xs px-2 py-0.5 rounded ${flashcard.difficulty === 'easy' ? 'bg-green-100 text-green-700' :
                                                            flashcard.difficulty === 'hard' ? 'bg-red-100 text-red-700' :
                                                                'bg-yellow-100 text-yellow-700'
                                                            }`}>
                                                            {flashcard.difficulty}
                                                        </span>
                                                    </div>
                                                    <p className="font-medium text-slate-900 mb-2">
                                                        Q: {flashcard.question}
                                                    </p>
                                                    <p className="text-sm text-slate-600">
                                                        A: {flashcard.answer}
                                                    </p>
                                                </div>
                                                <div className="flex gap-2 ml-4">
                                                    <button
                                                        onClick={() => setEditingId(flashcard.id)}
                                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                        title="Edit"
                                                    >
                                                        <Edit2 size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(flashcard.id)}
                                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                        title="Delete"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {!selectedChapterId && (
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 flex items-start gap-3">
                    <AlertCircle className="text-blue-600 flex-shrink-0 mt-0.5" size={20} />
                    <div>
                        <h4 className="font-medium text-blue-900 mb-1">Select a Chapter</h4>
                        <p className="text-sm text-blue-700">
                            Choose a chapter from the dropdown above to view and manage its flashcards.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FlashcardManager;
