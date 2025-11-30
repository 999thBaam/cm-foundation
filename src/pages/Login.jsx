import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DottedSurface } from '../components/ui/dotted-surface';
import { useAuthStore } from '../store/useAuthStore';
import { LogIn, Code } from 'lucide-react';

const Login = () => {
    const { loginWithGoogle, loginAsDeveloper, user, isLoading, error } = useAuthStore();
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            navigate('/');
        }
    }, [user, navigate]);

    return (
        <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
            {/* Background */}
            <DottedSurface className="opacity-60" />

            {/* Content Card */}
            <div className="relative z-10 w-full max-w-md p-8 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-primary-500 rounded-xl flex items-center justify-center text-white font-bold text-3xl mx-auto mb-4 shadow-lg shadow-primary-500/30">
                        C
                    </div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                        Welcome Back
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2">
                        Sign in to access your dashboard
                    </p>
                </div>

                {error && (
                    <div className="mb-6 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
                        {error}
                    </div>
                )}

                <div className="space-y-4">
                    <button
                        onClick={loginWithGoogle}
                        disabled={isLoading}
                        className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-all duration-200 font-medium shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? (
                            <div className="w-5 h-5 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
                        ) : (
                            <>
                                <LogIn size={20} />
                                Sign in with Google
                            </>
                        )}
                    </button>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-slate-200 dark:border-slate-700"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white/0 text-slate-500">or</span>
                        </div>
                    </div>

                    <button
                        onClick={loginAsDeveloper}
                        disabled={isLoading}
                        className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl hover:bg-slate-800 dark:hover:bg-slate-100 transition-all duration-200 font-medium shadow-lg shadow-slate-900/20 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Code size={20} />
                        Developer Bypass
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Login;
