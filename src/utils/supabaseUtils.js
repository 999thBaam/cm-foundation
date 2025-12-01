import { supabase } from '../config/supabaseClient';
import curriculumData from '../data/curriculum.json';

// ============================================
// AUTHENTICATION
// ============================================

export async function signInWithGoogle() {
    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
    });
    if (error) throw error;
    return data;
}

export async function logout() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
}

export async function getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
}

export async function onAuthStateChange(callback) {
    return supabase.auth.onAuthStateChange((event, session) => {
        callback(session?.user || null);
    });
}

// ============================================
// CURRICULUM FETCHING
// ============================================

/**
 * Fetches all curriculum data from Supabase with proper joins
 */
export async function fetchCurriculum() {
    try {
        // Fetch all data in parallel
        const [subjectsRes, chaptersRes, topicsRes, subtopicsRes] = await Promise.all([
            supabase.from('subjects').select('*').order('created_at'),
            supabase.from('chapters').select('*').order('created_at'),
            supabase.from('topics').select('*').order('created_at'),
            supabase.from('subtopics').select('*').order('created_at')
        ]);

        if (subjectsRes.error) throw subjectsRes.error;
        if (chaptersRes.error) throw chaptersRes.error;
        if (topicsRes.error) throw topicsRes.error;
        if (subtopicsRes.error) throw subtopicsRes.error;

        const allSubjects = subjectsRes.data;
        const allChapters = chaptersRes.data;
        const allTopics = topicsRes.data;
        const allSubtopics = subtopicsRes.data;

        // Assemble hierarchy
        const subjects = allSubjects.map(subject => {
            const chapters = allChapters
                .filter(c => c.subject_id === subject.id)
                .map(chapter => {
                    const topics = allTopics
                        .filter(t => t.chapter_id === chapter.id)
                        .map(topic => {
                            const subtopics = allSubtopics
                                .filter(s => s.topic_id === topic.id);
                            return { ...topic, subtopics };
                        });
                    return { ...chapter, topics };
                });
            return { ...subject, chapters };
        });

        return { subjects };
    } catch (error) {
        console.error('Error fetching curriculum:', error);
        throw error;
    }
}

// ============================================
// SEEDING
// ============================================

/**
 * Seeds the Supabase database with curriculum data from curriculum.json
 */
export async function seedCurriculum() {
    try {
        console.log('🌱 Starting curriculum seed...');

        for (const subject of curriculumData.subjects) {
            // Insert subject
            const { data: subjectData, error: subjectError } = await supabase
                .from('subjects')
                .insert({ id: subject.id, title: subject.title })
                .select()
                .single();

            if (subjectError) throw subjectError;
            console.log(`✅ Seeded subject: ${subject.title}`);

            // Insert chapters
            for (const chapter of subject.chapters) {
                const { data: chapterData, error: chapterError } = await supabase
                    .from('chapters')
                    .insert({
                        id: chapter.id,
                        title: chapter.title,
                        subject_id: subject.id
                    })
                    .select()
                    .single();

                if (chapterError) throw chapterError;

                // Insert topics
                for (const topic of chapter.topics) {
                    const { data: topicData, error: topicError } = await supabase
                        .from('topics')
                        .insert({
                            id: topic.id,
                            title: topic.title,
                            chapter_id: chapter.id
                        })
                        .select()
                        .single();

                    if (topicError) throw topicError;

                    // Insert subtopics
                    for (const subtopic of topic.subtopics) {
                        const { error: subtopicError } = await supabase
                            .from('subtopics')
                            .insert({
                                id: subtopic.id,
                                title: subtopic.title,
                                topic_id: topic.id,
                                video_url: '',
                                summary: ''
                            });

                        if (subtopicError) throw subtopicError;
                    }
                }
            }
        }

        console.log('🎉 Curriculum seeding completed successfully!');
        return { success: true, message: 'Curriculum seeded successfully' };
    } catch (error) {
        console.error('❌ Error seeding curriculum:', error);
        return { success: false, error: error.message };
    }
}

// ============================================
// SUBJECT CRUD
// ============================================

export async function addSubject(data) {
    const { data: result, error } = await supabase
        .from('subjects')
        .insert({ title: data.title, id: data.id })
        .select()
        .single();

    if (error) throw error;
    return result;
}

export async function updateSubject(id, data) {
    const { error } = await supabase
        .from('subjects')
        .update({ title: data.title })
        .eq('id', id);

    if (error) throw error;
}

export async function deleteSubject(id) {
    const { error } = await supabase
        .from('subjects')
        .delete()
        .eq('id', id);

    if (error) throw error;
}

// ============================================
// CHAPTER CRUD
// ============================================

export async function addChapter(data) {
    const { data: result, error } = await supabase
        .from('chapters')
        .insert({
            title: data.title,
            id: data.id,
            subject_id: data.subjectId
        })
        .select()
        .single();

    if (error) throw error;
    return result;
}

export async function updateChapter(id, data) {
    const { error } = await supabase
        .from('chapters')
        .update({ title: data.title })
        .eq('id', id);

    if (error) throw error;
}

export async function deleteChapter(id) {
    const { error } = await supabase
        .from('chapters')
        .delete()
        .eq('id', id);

    if (error) throw error;
}

// ============================================
// TOPIC CRUD
// ============================================

export async function addTopic(data) {
    const { data: result, error } = await supabase
        .from('topics')
        .insert({
            title: data.title,
            id: data.id,
            chapter_id: data.chapterId
        })
        .select()
        .single();

    if (error) throw error;
    return result;
}

export async function updateTopic(id, data) {
    const { error } = await supabase
        .from('topics')
        .update({ title: data.title })
        .eq('id', id);

    if (error) throw error;
}

export async function deleteTopic(id) {
    const { error } = await supabase
        .from('topics')
        .delete()
        .eq('id', id);

    if (error) throw error;
}

// ============================================
// SUBTOPIC CRUD
// ============================================

export async function addSubtopic(data) {
    const { data: result, error } = await supabase
        .from('subtopics')
        .insert({
            title: data.title,
            id: data.id,
            topic_id: data.topicId,
            video_url: data.videoUrl || '',
            summary: data.summary || ''
        })
        .select()
        .single();

    if (error) throw error;
    return result;
}

export async function updateSubtopic(id, data) {
    const { error } = await supabase
        .from('subtopics')
        .update({
            title: data.title,
            video_url: data.videoUrl,
            summary: data.summary
        })
        .eq('id', id);

    if (error) throw error;
}

export async function deleteSubtopic(id) {
    const { error } = await supabase
        .from('subtopics')
        .delete()
        .eq('id', id);

    if (error) throw error;
}

// ============================================
// FLASHCARD CRUD
// ============================================

export async function fetchFlashcards(chapterId) {
    const { data, error } = await supabase
        .from('flashcards')
        .select('*')
        .eq('chapter_id', chapterId);

    if (error) throw error;
    return data;
}

export async function fetchAllFlashcards() {
    const { data, error } = await supabase
        .from('flashcards')
        .select('*');

    if (error) throw error;
    return data;
}

export async function addFlashcard(chapterId, flashcardData) {
    const { data, error } = await supabase
        .from('flashcards')
        .insert({
            chapter_id: chapterId,
            question: flashcardData.question,
            answer: flashcardData.answer,
            difficulty: flashcardData.difficulty || 'medium',
            tags: flashcardData.tags || []
        })
        .select()
        .single();

    if (error) throw error;
    return data;
}

export async function updateFlashcard(flashcardId, updates) {
    const { error } = await supabase
        .from('flashcards')
        .update({
            ...updates,
            updated_at: new Date().toISOString()
        })
        .eq('id', flashcardId);

    if (error) throw error;
}

export async function deleteFlashcard(flashcardId) {
    const { error } = await supabase
        .from('flashcards')
        .delete()
        .eq('id', flashcardId);

    if (error) throw error;
}
