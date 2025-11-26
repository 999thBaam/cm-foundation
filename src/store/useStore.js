import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useStore = create(
    persist(
        (set) => ({
            user: null,
            setUser: (user) => set({ user }),
            theme: 'light',
            toggleTheme: () => set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),
            progress: {},
            updateProgress: (chapterId, data) => set((state) => ({
                progress: { ...state.progress, [chapterId]: { ...state.progress[chapterId], ...data } }
            })),
        }),
        {
            name: 'cm-foundation-storage',
        }
    )
);
