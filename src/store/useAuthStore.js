import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { auth } from '../lib/firebase';
import { GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';

export const useAuthStore = create(
    persist(
        (set) => ({
            user: null,
            isLoading: false,
            error: null,

            loginWithGoogle: async () => {
                set({ isLoading: true, error: null });
                try {
                    const provider = new GoogleAuthProvider();
                    const result = await signInWithPopup(auth, provider);
                    set({ user: result.user, isLoading: false });
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
                    await signOut(auth);
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
