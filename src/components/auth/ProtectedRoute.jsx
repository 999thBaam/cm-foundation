import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { supabase } from '../../config/supabaseClient';

const ProtectedRoute = ({ children }) => {
    const { user, setUser } = useAuthStore();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // If user already exists in store (e.g., developer bypass), skip Supabase check
        if (user) {
            setLoading(false);
            return;
        }

        // Check for existing Supabase session
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session?.user) {
                setUser({
                    uid: session.user.id,
                    email: session.user.email,
                    displayName: session.user.user_metadata?.full_name || session.user.email,
                    photoURL: session.user.user_metadata?.avatar_url
                });
            }
            setLoading(false);
        });

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            if (session?.user) {
                setUser({
                    uid: session.user.id,
                    email: session.user.email,
                    displayName: session.user.user_metadata?.full_name || session.user.email,
                    photoURL: session.user.user_metadata?.avatar_url
                });
            } else {
                // Only clear user if it's not a developer bypass
                if (user?.uid !== 'dev-bypass') {
                    setUser(null);
                }
            }
        });

        return () => subscription.unsubscribe();
    }, [setUser, user]);

    if (loading) {
        return <div className="flex items-center justify-center h-screen">Loading...</div>;
    }

    if (!user) {
        return <Navigate to="/" replace />;
    }

    return children ? children : <Outlet />;
};

export default ProtectedRoute;
