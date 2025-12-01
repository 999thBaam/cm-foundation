import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    LayoutDashboard,
    Book,
    FileText,
    List,
    Settings,
    Plus,
    Save,
    Trash2,
    ChevronRight,
    AlertCircle,
    Layers
} from 'lucide-react';
import FlashcardManager from '../components/admin/FlashcardManager';
import ContentManager from '../components/admin/ContentManager';
import { clsx } from 'clsx';
import { supabase } from '../config/supabaseClient';

const Admin = () => {
    const [activeTab, setActiveTab] = useState('dashboard');

    // Check if Supabase is configured
    const isSupabaseConfigured = import.meta.env.VITE_SUPABASE_URL &&
        import.meta.env.VITE_SUPABASE_ANON_KEY;

    if (!isSupabaseConfigured) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-8">
                <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-4">
                    <AlertCircle size={32} />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Supabase Not Configured</h2>
                <p className="text-slate-600 max-w-md mb-6">
                    Please configure your Supabase credentials in the <code>.env</code> file to access the Admin Panel.
                </p>
                <div className="bg-slate-900 text-white px-6 py-4 rounded-lg text-left font-mono text-sm overflow-x-auto max-w-2xl w-full">
                    <p className="text-slate-400 mb-2"># .env</p>
                    <p>VITE_SUPABASE_URL=...</p>
                    <p>VITE_SUPABASE_ANON_KEY=...</p>
                </div>
            </div>
        );
    }

    const tabs = [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'curriculum', label: 'Curriculum', icon: Book },
        { id: 'flashcards', label: 'Flashcards', icon: Layers },
        { id: 'settings', label: 'Settings', icon: Settings },
    ];

    return (
        <div className="flex h-[calc(100vh-4rem)] -m-8">
            {/* Sidebar */}
            <div className="w-64 bg-white border-r border-slate-100 flex flex-col">
                <div className="p-6 border-b border-slate-100">
                    <h2 className="font-bold text-slate-900 flex items-center gap-2">
                        <Settings className="text-primary-500" />
                        Admin Panel
                    </h2>
                </div>
                <nav className="flex-grow p-4 space-y-1">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={clsx(
                                    "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                                    activeTab === tab.id
                                        ? "bg-primary-50 text-primary-600"
                                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                                )}
                            >
                                <Icon size={18} />
                                {tab.label}
                            </button>
                        );
                    })}
                </nav>
            </div>

            {/* Main Content */}
            <div className="flex-grow bg-slate-50 overflow-y-auto p-8">
                <header className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 capitalize">{activeTab}</h1>
                        <p className="text-slate-500 text-sm">Manage your {activeTab} content</p>
                    </div>
                </header>

                {/* Content Area */}
                <div className="bg-white rounded-xl border border-slate-100 shadow-sm min-h-[400px] p-6">
                    {activeTab === 'dashboard' && (
                        <DashboardContent />
                    )}

                    {activeTab === 'curriculum' && (
                        <ContentManager />
                    )}

                    {activeTab === 'flashcards' && (
                        <FlashcardManager />
                    )}

                    {activeTab === 'settings' && (
                        <div className="flex flex-col items-center justify-center h-64 text-slate-400">
                            <Settings size={48} className="mb-4 opacity-20" />
                            <p>Settings coming soon.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// Dashboard Content Component
const DashboardContent = () => {
    const [seeding, setSeeding] = useState(false);
    const [seedStatus, setSeedStatus] = useState(null);

    const handleSeed = async () => {
        setSeeding(true);
        setSeedStatus(null);

        try {
            const { seedCurriculum } = await import('../utils/supabaseUtils');
            const result = await seedCurriculum();
            setSeedStatus(result);
        } catch (error) {
            setSeedStatus({ success: false, error: error.message });
        } finally {
            setSeeding(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 bg-blue-50 rounded-xl border border-blue-100">
                    <h3 className="text-blue-900 font-medium mb-1">Total Subjects</h3>
                    <p className="text-3xl font-bold text-blue-600">4</p>
                </div>
                <div className="p-6 bg-purple-50 rounded-xl border border-purple-100">
                    <h3 className="text-purple-900 font-medium mb-1">Total Chapters</h3>
                    <p className="text-3xl font-bold text-purple-600">20</p>
                </div>
                <div className="p-6 bg-green-50 rounded-xl border border-green-100">
                    <h3 className="text-green-900 font-medium mb-1">Total Topics</h3>
                    <p className="text-3xl font-bold text-green-600">50+</p>
                </div>
            </div>

            {/* Seed Database Section */}
            <div className="border-t border-slate-100 pt-6">
                <h3 className="text-lg font-bold text-slate-900 mb-2">Database Management</h3>
                <p className="text-slate-600 mb-4">Test Firebase connection and seed the database</p>

                <div className="flex gap-3 mb-4">
                    <button
                        onClick={async () => {
                            try {
                                const { testFirebaseConnection } = await import('../utils/testFirebase');
                                const result = await testFirebaseConnection();
                                alert(result.success ? `✅ ${result.message}` : `❌ ${result.error}`);
                            } catch (error) {
                                alert(`❌ Error: ${error.message}`);
                            }
                        }}
                        className="px-4 py-2 bg-slate-600 text-white rounded-lg font-medium hover:bg-slate-700 transition-colors"
                    >
                        Test Firebase Connection
                    </button>

                    <button
                        onClick={handleSeed}
                        disabled={seeding}
                        className="btn btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {seeding ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                Seeding Database...
                            </>
                        ) : (
                            <>
                                <Plus size={18} />
                                Seed Database
                            </>
                        )}
                    </button>
                </div>

                {seedStatus && (
                    <div className={`mt-4 p-4 rounded-lg ${seedStatus.success
                        ? 'bg-green-50 border border-green-200 text-green-800'
                        : 'bg-red-50 border border-red-200 text-red-800'
                        }`}>
                        <p className="font-medium">
                            {seedStatus.success ? '✅ ' + seedStatus.message : '❌ Error: ' + seedStatus.error}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Admin;
