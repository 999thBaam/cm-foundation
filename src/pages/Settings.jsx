import React from 'react';
import { motion } from 'framer-motion';
import { User, Bell, Moon, Trash2, LogOut, Shield } from 'lucide-react';
import { useStore } from '../store/useStore';

const Settings = () => {
    const { theme, toggleTheme } = useStore();

    const settingsSections = [
        {
            title: 'Account',
            icon: User,
            items: [
                { label: 'Edit Profile', description: 'Update your name and avatar', action: 'edit' },
                { label: 'Change Password', description: 'Update your password', action: 'password' },
            ]
        },
        {
            title: 'Preferences',
            icon: Bell,
            items: [
                { label: 'Notifications', description: 'Manage notification settings', action: 'notifications', toggle: true },
                { label: 'Dark Mode', description: 'Toggle dark mode', action: 'theme', toggle: true, value: theme === 'dark' },
            ]
        },
        {
            title: 'Data',
            icon: Shield,
            items: [
                { label: 'Clear Progress', description: 'Reset all learning progress', action: 'clear', danger: true },
                { label: 'Export Data', description: 'Download your learning data', action: 'export' },
            ]
        }
    ];

    return (
        <div className="max-w-3xl mx-auto">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
            >
                <h1 className="text-3xl font-bold text-slate-900">Settings</h1>
                <p className="text-slate-600 mt-1">Manage your account and preferences</p>
            </motion.div>

            <div className="space-y-6">
                {settingsSections.map((section, sectionIndex) => {
                    const SectionIcon = section.icon;
                    return (
                        <motion.div
                            key={section.title}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: sectionIndex * 0.1 }}
                            className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden"
                        >
                            <div className="p-6 border-b border-slate-100 flex items-center gap-3">
                                <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center text-slate-600">
                                    <SectionIcon size={18} />
                                </div>
                                <h2 className="text-lg font-bold text-slate-900">{section.title}</h2>
                            </div>
                            <div className="divide-y divide-slate-50">
                                {section.items.map((item, itemIndex) => (
                                    <div key={itemIndex} className="p-6 flex items-center justify-between hover:bg-slate-50 transition-colors">
                                        <div className="flex-grow">
                                            <h3 className={`font-medium ${item.danger ? 'text-red-600' : 'text-slate-900'}`}>
                                                {item.label}
                                            </h3>
                                            <p className="text-sm text-slate-500 mt-0.5">{item.description}</p>
                                        </div>
                                        {item.toggle ? (
                                            <button
                                                onClick={item.action === 'theme' ? toggleTheme : undefined}
                                                className={`relative w-12 h-6 rounded-full transition-colors ${item.value ? 'bg-primary-500' : 'bg-slate-200'
                                                    }`}
                                            >
                                                <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${item.value ? 'translate-x-6' : 'translate-x-0'
                                                    }`} />
                                            </button>
                                        ) : (
                                            <button className={`px-4 py-2 rounded-lg font-medium transition-colors ${item.danger
                                                    ? 'text-red-600 hover:bg-red-50'
                                                    : 'text-slate-600 hover:bg-slate-100'
                                                }`}>
                                                {item.danger ? 'Clear' : 'Edit'}
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    );
                })}

                {/* Logout Button */}
                <motion.button
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="w-full bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex items-center justify-center gap-3 text-red-600 hover:bg-red-50 transition-colors font-medium"
                >
                    <LogOut size={20} />
                    Logout
                </motion.button>
            </div>
        </div>
    );
};

export default Settings;
