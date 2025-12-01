import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ChevronRight,
    Plus,
    Edit2,
    Trash2,
    Save,
    X,
    Folder,
    FileText,
    Layers,
    ArrowLeft,
    Book
} from 'lucide-react';
import {
    addSubject, updateSubject, deleteSubject,
    addChapter, updateChapter, deleteChapter,
    addTopic, updateTopic, deleteTopic,
    addSubtopic, updateSubtopic, deleteSubtopic,
    fetchCurriculum
} from '../../utils/supabaseUtils';

const ContentManager = () => {
    // Navigation State
    const [view, setView] = useState('subjects'); // subjects, chapters, topics, subtopics
    const [path, setPath] = useState([]); // [{id, title, type}, ...]

    // Data State
    const [data, setData] = useState({ subjects: [] });
    const [loading, setLoading] = useState(true);

    // Edit/Add State
    const [editingId, setEditingId] = useState(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({ title: '', id: '', videoUrl: '', summary: '' });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const result = await fetchCurriculum();
            setData(result);
        } catch (error) {
            console.error("Failed to load curriculum:", error);
            alert("Failed to load curriculum data");
        } finally {
            setLoading(false);
        }
    };

    // Navigation Helpers
    const navigateTo = (item, type) => {
        setPath([...path, { ...item, type }]);
        if (type === 'subject') setView('chapters');
        else if (type === 'chapter') setView('topics');
        else if (type === 'topic') setView('subtopics');
    };

    const navigateBack = () => {
        const newPath = [...path];
        newPath.pop();
        setPath(newPath);

        if (newPath.length === 0) setView('subjects');
        else {
            const lastItem = newPath[newPath.length - 1];
            if (lastItem.type === 'subject') setView('chapters');
            else if (lastItem.type === 'chapter') setView('topics');
        }
    };

    // Get current list based on view/path
    const getCurrentList = () => {
        if (view === 'subjects') return data.subjects || [];

        const subject = data.subjects.find(s => s.id === path[0].id);
        if (view === 'chapters') return subject?.chapters || [];

        const chapter = subject?.chapters.find(c => c.id === path[1].id);
        if (view === 'topics') return chapter?.topics || [];

        const topic = chapter?.topics.find(t => t.id === path[2].id);
        if (view === 'subtopics') return topic?.subtopics || [];

        return [];
    };

    // CRUD Handlers
    const handleSave = async () => {
        if (!formData.title.trim()) return alert("Title is required");

        setLoading(true);
        try {
            if (isEditing) {
                // Update existing item
                if (view === 'subjects') await updateSubject(formData.id, formData);
                else if (view === 'chapters') await updateChapter(formData.id, formData);
                else if (view === 'topics') await updateTopic(formData.id, formData);
                else if (view === 'subtopics') await updateSubtopic(formData.id, formData);
            } else {
                // Add new item
                if (view === 'subjects') {
                    await addSubject(formData);
                } else if (view === 'chapters') {
                    await addChapter({ ...formData, subjectId: path[0].id });
                } else if (view === 'topics') {
                    await addTopic({ ...formData, chapterId: path[1].id });
                } else if (view === 'subtopics') {
                    await addSubtopic({ ...formData, topicId: path[2].id });
                }
            }

            await loadData();
            setShowAddForm(false);
            setIsEditing(false);
            setFormData({ title: '', id: '', videoUrl: '', summary: '' });
        } catch (error) {
            console.error("Error saving item:", error);
            alert("Failed to save item");
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async (id) => {
        const item = getCurrentList().find(i => i.id === id);
        if (!item.title.trim()) return alert("Title is required");

        setLoading(true);
        try {
            if (view === 'subjects') await updateSubject(id, { title: item.title });
            else if (view === 'chapters') await updateChapter(id, { title: item.title });
            else if (view === 'topics') await updateTopic(id, { title: item.title });
            else if (view === 'subtopics') await updateSubtopic(id, { title: item.title });

            await loadData();
            setEditingId(null);
        } catch (error) {
            console.error("Error updating item:", error);
            alert("Failed to update item");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        // Use window.confirm for browser dialog
        if (!window.confirm("Are you sure? This action cannot be undone.")) return;

        setLoading(true);
        try {
            if (view === 'subjects') await deleteSubject(id);
            else if (view === 'chapters') await deleteChapter(id);
            else if (view === 'topics') await deleteTopic(id);
            else if (view === 'subtopics') await deleteSubtopic(id);

            await loadData();
        } catch (error) {
            console.error("Error deleting item:", error);
            alert("Failed to delete item");
        } finally {
            setLoading(false);
        }
    };

    // Helper to update local state for optimistic UI (or just controlled inputs)
    const updateLocalField = (id, field, value) => {
        // Deep clone to avoid direct mutation issues
        const newData = JSON.parse(JSON.stringify(data));

        // Traverse to find the list to update
        let list;
        if (view === 'subjects') {
            list = newData.subjects;
        } else {
            const subject = newData.subjects.find(s => s.id === path[0].id);
            if (view === 'chapters') {
                list = subject.chapters;
            } else {
                const chapter = subject.chapters.find(c => c.id === path[1].id);
                if (view === 'topics') {
                    list = chapter.topics;
                } else {
                    const topic = chapter.topics.find(t => t.id === path[2].id);
                    list = topic.subtopics;
                }
            }
        }

        const item = list.find(i => i.id === id);
        if (item) item[field] = value;

        setData(newData);
    };

    const getIcon = () => {
        if (view === 'subjects') return Book;
        if (view === 'chapters') return Folder;
        if (view === 'topics') return Layers;
        return FileText;
    };

    const Icon = getIcon();
    const currentList = getCurrentList();

    return (
        <div className="space-y-6">
            {/* Breadcrumb Navigation */}
            <div className="flex items-center gap-2 text-sm text-slate-500 mb-4 bg-slate-50 p-3 rounded-lg border border-slate-100">
                <button
                    onClick={() => { setPath([]); setView('subjects'); }}
                    className={`hover:text-primary-600 ${view === 'subjects' ? 'font-bold text-slate-900' : ''}`}
                >
                    Subjects
                </button>
                {path.map((item, index) => (
                    <React.Fragment key={item.id}>
                        <ChevronRight size={14} />
                        <button
                            onClick={() => {
                                // Navigate to this level
                                const newPath = path.slice(0, index + 1);
                                setPath(newPath);
                                if (item.type === 'subject') setView('chapters');
                                else if (item.type === 'chapter') setView('topics');
                                else if (item.type === 'topic') setView('subtopics');
                            }}
                            className={`hover:text-primary-600 ${index === path.length - 1 ? 'font-bold text-slate-900' : ''}`}
                        >
                            {item.title}
                        </button>
                    </React.Fragment>
                ))}
            </div>

            {/* Header & Actions */}
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                    {path.length > 0 && (
                        <button
                            onClick={navigateBack}
                            className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                        >
                            <ArrowLeft size={20} />
                        </button>
                    )}
                    <div>
                        <h2 className="text-xl font-bold text-slate-900 capitalize">
                            {view}
                        </h2>
                        <p className="text-sm text-slate-500">
                            Manage your {view} content
                        </p>
                    </div>
                </div>
                <button
                    onClick={() => {
                        setShowAddForm(!showAddForm);
                        setIsEditing(false);
                        setFormData({ title: '', id: '', videoUrl: '', summary: '' });
                    }}
                    className="btn btn-primary flex items-center gap-2"
                >
                    {showAddForm ? <X size={18} /> : <Plus size={18} />}
                    {showAddForm ? 'Cancel' : 'Add New'}
                </button>
            </div>

            {/* Add Form */}
            <AnimatePresence>
                {showAddForm && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="p-4 bg-slate-50 rounded-lg border border-slate-200"
                    >
                        <div className="flex flex-col gap-4">
                            <div className="flex gap-4 items-end">
                                <div className="flex-grow">
                                    <label className="block text-sm font-medium text-slate-700 mb-1">
                                        Title
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
                                        placeholder={`Enter ${view.slice(0, -1)} title...`}
                                    />
                                </div>
                                <div className="w-1/3">
                                    <label className="block text-sm font-medium text-slate-700 mb-1">
                                        ID (Optional)
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.id}
                                        onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                                        className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
                                        placeholder="Auto-generated if empty"
                                    />
                                </div>
                            </div>

                            {view === 'subtopics' && (
                                <>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">
                                            Video URL (YouTube/MP4)
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.videoUrl}
                                            onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                                            className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
                                            placeholder="https://..."
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">
                                            Summary / Content
                                        </label>
                                        <textarea
                                            value={formData.summary}
                                            onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                                            className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
                                            rows="3"
                                            placeholder="Enter summary or content..."
                                        />
                                    </div>
                                </>
                            )}

                            <div className="flex justify-end">
                                <button
                                    onClick={handleSave}
                                    disabled={loading}
                                    className="btn btn-primary flex items-center gap-2"
                                >
                                    <Save size={18} />
                                    {isEditing ? 'Update' : 'Save'}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Content List */}
            {loading && !data.subjects.length ? (
                <div className="flex justify-center py-12">
                    <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
                </div>
            ) : currentList.length === 0 ? (
                <div className="text-center py-12 text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                    <Icon size={48} className="mx-auto mb-3 opacity-20" />
                    <p>No items found. Add one to get started.</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {currentList.map((item) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white border border-slate-200 rounded-xl p-4 hover:shadow-sm transition-shadow flex items-center justify-between group"
                        >
                            {editingId === item.id ? (
                                <div className="flex-grow flex gap-3 items-center">
                                    <input
                                        type="text"
                                        value={item.title}
                                        onChange={(e) => updateLocalField(item.id, 'title', e.target.value)}
                                        className="flex-grow px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
                                    />
                                    <button
                                        onClick={() => handleUpdate(item.id)}
                                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                                    >
                                        <Save size={18} />
                                    </button>
                                    <button
                                        onClick={() => {
                                            setEditingId(null);
                                            loadData(); // Revert changes
                                        }}
                                        className="p-2 text-slate-400 hover:bg-slate-100 rounded-lg"
                                    >
                                        <X size={18} />
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <div
                                        className="flex items-center gap-4 flex-grow cursor-pointer"
                                        onClick={() => view !== 'subtopics' && navigateTo(item, view.slice(0, -1))}
                                    >
                                        <div className="w-10 h-10 bg-primary-50 text-primary-600 rounded-lg flex items-center justify-center">
                                            <Icon size={20} />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-slate-900">{item.title}</h3>
                                            <p className="text-xs text-slate-500 font-mono">{item.id}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => {
                                                if (view === 'subtopics') {
                                                    setFormData({
                                                        title: item.title,
                                                        id: item.id,
                                                        videoUrl: item.videoUrl || '',
                                                        summary: item.summary || ''
                                                    });
                                                    setIsEditing(true);
                                                    setShowAddForm(true);
                                                } else {
                                                    setEditingId(item.id);
                                                }
                                            }}
                                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                                        >
                                            <Edit2 size={18} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(item.id)}
                                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                        {view !== 'subtopics' && (
                                            <button
                                                onClick={() => navigateTo(item, view.slice(0, -1))}
                                                className="p-2 text-slate-400 hover:bg-slate-100 rounded-lg"
                                            >
                                                <ChevronRight size={18} />
                                            </button>
                                        )}
                                    </div>
                                </>
                            )}
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ContentManager;
