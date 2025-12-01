

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import curriculumData from '../data/curriculum.json';

export const useStore = create(
    persist(
        (set, get) => ({
            user: null,
            setUser: (user) => set({ user }),
            theme: 'light',
            toggleTheme: () => set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),

            // Curriculum Data
            curriculum: { subjects: [] }, // Start empty, fetch from DB
            isLoading: false,
            error: null,

            fetchCurriculum: async () => {
                set({ isLoading: true });
                try {
                    const { fetchCurriculum } = await import('../utils/supabaseUtils');
                    const data = await fetchCurriculum();
                    set({ curriculum: data, isLoading: false });
                } catch (error) {
                    console.error('Failed to fetch curriculum:', error);
                    // Fallback to static data if fetch fails
                    set({ curriculum: curriculumData, isLoading: false, error: error.message });
                }
            },

            // Helpers
            getSubject: (subjectId) => get().curriculum.subjects.find(s => s.id === subjectId),

            // Helper to find a chapter by ID across all subjects
            findChapter: (chapterId) => {
                for (const subject of get().curriculum.subjects) {
                    const chapter = subject.chapters.find(c => c.id === chapterId);
                    if (chapter) return { ...chapter, subjectId: subject.id, subjectTitle: subject.title };
                }
                return null;
            },

            // Helper to find a topic by ID across all chapters
            findTopic: (topicId) => {
                for (const subject of get().curriculum.subjects) {
                    for (const chapter of subject.chapters) {
                        const topic = chapter.topics.find(t => t.id === topicId);
                        if (topic) return { ...topic, chapterId: chapter.id, chapterTitle: chapter.title, subjectId: subject.id, subjectTitle: subject.title };
                    }
                }
                return null;
            },

            // Helper to find a subtopic by ID across all topics
            findSubtopic: (subtopicId) => {
                for (const subject of get().curriculum.subjects) {
                    for (const chapter of subject.chapters) {
                        for (const topic of chapter.topics) {
                            const subtopic = topic.subtopics.find(s => s.id === subtopicId);
                            if (subtopic) return {
                                ...subtopic,
                                topicId: topic.id,
                                topicTitle: topic.title,
                                chapterId: chapter.id,
                                chapterTitle: chapter.title,
                                subjectId: subject.id,
                                subjectTitle: subject.title
                            };
                        }
                    }
                }
                return null;
            },

            progress: {},
            updateProgress: (chapterId, data) => set((state) => ({
                progress: { ...state.progress, [chapterId]: { ...state.progress[chapterId], ...data } }
            })),
        }),
        {
            name: 'cm-foundation-storage',
            partialize: (state) => ({
                user: state.user,
                theme: state.theme,
                progress: state.progress
            }), // Don't persist static curriculum data
        }
    )
);
