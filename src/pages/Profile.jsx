import React from 'react';
import { motion } from 'framer-motion';
import { User, Award, Flame, TrendingUp, BookOpen, Target } from 'lucide-react';

const Profile = () => {
    const stats = [
        { label: 'Total Points', value: '2,450', icon: Award, color: 'blue' },
        { label: 'Current Streak', value: '12 Days', icon: Flame, color: 'orange' },
        { label: 'Chapters Completed', value: '8/27', icon: BookOpen, color: 'green' },
        { label: 'Average Score', value: '85%', icon: Target, color: 'purple' },
    ];

    const subjects = [
        { name: 'Science', progress: 45, chapters: 12, color: 'bg-blue-500' },
        { name: 'Mathematics', progress: 30, chapters: 15, color: 'bg-purple-500' },
    ];

    return (
        <div className="max-w-5xl mx-auto space-y-8">
            {/* Profile Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8"
            >
                <div className="flex flex-col sm:flex-row items-center gap-6">
                    <div className="w-24 h-24 bg-gradient-to-br from-primary-500 to-purple-500 rounded-full flex items-center justify-center text-white text-3xl font-bold">
                        S
                    </div>
                    <div className="text-center sm:text-left flex-grow">
                        <h1 className="text-3xl font-bold text-slate-900">Student Name</h1>
                        <p className="text-slate-600 mt-1">10th Grade • Science & Math</p>
                        <p className="text-sm text-slate-500 mt-2">Member since November 2025</p>
                    </div>
                    <button className="px-6 py-2 rounded-lg font-medium text-slate-600 hover:bg-slate-50 border border-slate-200 transition-colors">
                        Edit Profile
                    </button>
                </div>
            </motion.div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white rounded-xl border border-slate-100 shadow-sm p-6"
                        >
                            <div className={`w-10 h-10 bg-${stat.color}-100 rounded-lg flex items-center justify-center text-${stat.color}-600 mb-3`}>
                                <Icon size={20} />
                            </div>
                            <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                            <p className="text-sm text-slate-500 mt-1">{stat.label}</p>
                        </motion.div>
                    );
                })}
            </div>

            {/* Subject Progress */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8"
            >
                <h2 className="text-2xl font-bold text-slate-900 mb-6">Subject Progress</h2>
                <div className="space-y-6">
                    {subjects.map((subject) => (
                        <div key={subject.name}>
                            <div className="flex justify-between items-center mb-2">
                                <div>
                                    <h3 className="font-bold text-slate-900">{subject.name}</h3>
                                    <p className="text-sm text-slate-500">{subject.chapters} Chapters</p>
                                </div>
                                <span className="text-lg font-bold text-slate-900">{subject.progress}%</span>
                            </div>
                            <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                                <motion.div
                                    className={`h-full ${subject.color}`}
                                    initial={{ width: 0 }}
                                    animate={{ width: `${subject.progress}%` }}
                                    transition={{ duration: 1, delay: 0.5 }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </motion.div>

            {/* Recent Activity */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8"
            >
                <h2 className="text-2xl font-bold text-slate-900 mb-6">Recent Activity</h2>
                <div className="space-y-4">
                    {[
                        { action: 'Completed', item: 'Chemical Reactions Quiz', time: '2 hours ago', icon: Award, color: 'green' },
                        { action: 'Started', item: 'Acids, Bases and Salts', time: '1 day ago', icon: BookOpen, color: 'blue' },
                        { action: 'Achieved', item: '10-day streak milestone', time: '2 days ago', icon: Flame, color: 'orange' },
                    ].map((activity, index) => {
                        const Icon = activity.icon;
                        return (
                            <div key={index} className="flex items-center gap-4 p-4 rounded-lg hover:bg-slate-50 transition-colors">
                                <div className={`w-10 h-10 bg-${activity.color}-100 rounded-lg flex items-center justify-center text-${activity.color}-600 flex-shrink-0`}>
                                    <Icon size={20} />
                                </div>
                                <div className="flex-grow">
                                    <p className="text-slate-900">
                                        <span className="font-medium">{activity.action}</span> {activity.item}
                                    </p>
                                    <p className="text-sm text-slate-500">{activity.time}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </motion.div>
        </div>
    );
};

export default Profile;
