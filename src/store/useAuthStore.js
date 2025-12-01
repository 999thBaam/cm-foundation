import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '../config/supabaseClient';

export const useAuthStore = create(
    persist(
        (set) => ({
            user: null,
            isLoading: false,
            error: null,

            setUser: (user) => set({ user }),

            loginWithGoogle: async () => {
                set({ isLoading: true, error: null });
                try {
                    const { error } = await supabase.auth.signInWithOAuth({
                        provider: 'google',
                    });
                    if (error) throw error;
                    // Supabase will redirect, so we don't set user here
                    set({ isLoading: false });
                } catch (error) {
                    set({ error: error.message, isLoading: false });
                }
            },

            loginAsDeveloper: () => {
                set({
                    user: {
                        uid: 'dev-bypass',
                        displayName: 'Developer',
                        email: 'dev@example.com',
                        photoURL: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Developer'
                    },
                    isLoading: false
                });
            },

            logout: async () => {
                set({ isLoading: true });
                try {
                    await supabase.auth.signOut();
                    set({ user: null, isLoading: false });
                } catch (error) {
                    set({ error: error.message, isLoading: false });
                }
            },
        }),
        {
            name: 'auth-storage',
            partialize: (state) => ({ user: state.user }),
        }
    )
);
