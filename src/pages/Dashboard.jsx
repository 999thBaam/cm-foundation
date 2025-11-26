import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Atom, Calculator, Flame, Zap, TrendingUp, Award } from 'lucide-react';

const Dashboard = () => {
    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <div className="space-y-8">
            {/* Hero Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
            >
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Welcome back, Student! 👋</h1>
                    <p className="text-slate-600 mt-1">Ready to continue your learning journey?</p>
                </div>
                <div className="flex gap-4">
                    <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm flex items-center gap-3">
                        <div className="p-2 bg-orange-100 rounded-lg text-orange-600">
                            <Flame size={20} />
                        </div>
                        <div>
                            <p className="text-xs text-slate-500 font-medium">Streak</p>
                            <p className="text-lg font-bold text-slate-900">12 Days</p>
                        </div>
                    </div>
                    <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                            <Award size={20} />
                        </div>
                        <div>
                            <p className="text-xs text-slate-500 font-medium">Points</p>
                            <p className="text-lg font-bold text-slate-900">2,450</p>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Subject Cards */}
            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
                <Link to="/subject/science" className="group">
                    <motion.div
                        variants={item}
                        whileHover={{ y: -5 }}
                        className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-all h-full relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 p-32 bg-blue-50 rounded-full -mr-16 -mt-16 opacity-50 group-hover:scale-110 transition-transform duration-500"></div>
                        <div className="relative z-10">
                            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 mb-4">
                                <Atom size={28} />
                            </div>
                            <h2 className="text-2xl font-bold text-slate-900 mb-2">Science</h2>
                            <p className="text-slate-600 mb-6">Physics, Chemistry, and Biology concepts explained simply.</p>

                            <div className="flex items-center gap-4 text-sm text-slate-500">
                                <span className="flex items-center gap-1"><Zap size={16} /> 12 Chapters</span>
                                <span className="flex items-center gap-1"><TrendingUp size={16} /> 45% Complete</span>
                            </div>

                            <div className="mt-6 w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                                <div className="bg-blue-500 h-full rounded-full" style={{ width: '45%' }}></div>
                            </div>
                        </div>
                    </motion.div>
                </Link>

                <Link to="/subject/math" className="group">
                    <motion.div
                        variants={item}
                        whileHover={{ y: -5 }}
                        className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-all h-full relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 p-32 bg-purple-50 rounded-full -mr-16 -mt-16 opacity-50 group-hover:scale-110 transition-transform duration-500"></div>
                        <div className="relative z-10">
                            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600 mb-4">
                                <Calculator size={28} />
                            </div>
                            <h2 className="text-2xl font-bold text-slate-900 mb-2">Mathematics</h2>
                            <p className="text-slate-600 mb-6">Algebra, Geometry, and Trigonometry mastered easily.</p>

                            <div className="flex items-center gap-4 text-sm text-slate-500">
                                <span className="flex items-center gap-1"><Zap size={16} /> 15 Chapters</span>
                                <span className="flex items-center gap-1"><TrendingUp size={16} /> 30% Complete</span>
                            </div>

                            <div className="mt-6 w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                                <div className="bg-purple-500 h-full rounded-full" style={{ width: '30%' }}></div>
                            </div>
                        </div>
                    </motion.div>
                </Link>
            </motion.div>

            {/* Recent Activity / Continue Learning */}
            <motion.div
                variants={item}
                initial="hidden"
                animate="show"
                className="mt-8"
            >
                <h3 className="text-xl font-bold text-slate-900 mb-4">Continue Learning</h3>
                <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4 flex flex-col sm:flex-row items-center gap-4">
                    <div className="w-full sm:w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center text-green-600 flex-shrink-0">
                        <Atom size={32} />
                    </div>
                    <div className="flex-grow text-center sm:text-left">
                        <h4 className="font-bold text-slate-900">Light - Reflection and Refraction</h4>
                        <p className="text-sm text-slate-500">Science • Chapter 10</p>
                    </div>
                    <button className="w-full sm:w-auto px-6 py-2 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 transition-colors">
                        Resume
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

export default Dashboard;
