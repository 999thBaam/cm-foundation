import { db } from '../config/firebase';
import { collection, addDoc, getDocs, doc, setDoc } from 'firebase/firestore';
import curriculumData from '../data/curriculum.json';

/**
 * Seeds the Firestore database with curriculum data from curriculum.json
 * Uses batch writes for better performance
 */
export async function seedCurriculum() {
    try {
        console.log('🌱 Starting curriculum seed...');

        const { writeBatch } = await import('firebase/firestore');
        let batch = writeBatch(db);
        let operationCount = 0;
        const BATCH_LIMIT = 500; // Firestore batch limit

        // Helper to commit batch if needed
        const commitIfNeeded = async () => {
            if (operationCount >= BATCH_LIMIT) {
                await batch.commit();
                console.log(`✅ Committed batch of ${operationCount} operations`);
                batch = writeBatch(db);
                operationCount = 0;
            }
        };

        // Seed subjects
        for (const subject of curriculumData.subjects) {
            const subjectRef = doc(db, 'subjects', subject.id);
            batch.set(subjectRef, {
                id: subject.id,
                title: subject.title
            });
            operationCount++;
            await commitIfNeeded();

            // Seed chapters for this subject
            for (const chapter of subject.chapters) {
                const chapterRef = doc(db, 'chapters', chapter.id);
                batch.set(chapterRef, {
                    id: chapter.id,
                    title: chapter.title,
                    subjectId: subject.id
                });
                operationCount++;
                await commitIfNeeded();

                // Seed topics for this chapter
                for (const topic of chapter.topics) {
                    const topicRef = doc(db, 'topics', topic.id);
                    batch.set(topicRef, {
                        id: topic.id,
                        title: topic.title,
                        chapterId: chapter.id
                    });
                    operationCount++;
                    await commitIfNeeded();

                    // Seed subtopics for this topic
                    for (const subtopic of topic.subtopics) {
                        const subtopicRef = doc(db, 'subtopics', subtopic.id);
                        batch.set(subtopicRef, {
                            id: subtopic.id,
                            title: subtopic.title,
                            topicId: topic.id,
                            content: '' // Placeholder for future content
                        });
                        operationCount++;
                        await commitIfNeeded();
                    }
                }
            }
            console.log(`✅ Seeded subject: ${subject.title}`);
        }

        // Commit any remaining operations
        if (operationCount > 0) {
            await batch.commit();
            console.log(`✅ Committed final batch of ${operationCount} operations`);
        }

        console.log('🎉 Curriculum seeding completed successfully!');
        return { success: true, message: 'Curriculum seeded successfully' };
    } catch (error) {
        console.error('❌ Error seeding curriculum:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Fetches all curriculum data from Firestore
 */
/**
 * Fetches all curriculum data from Firestore
 * Optimized to fetch all collections once and assemble in memory
 */
export async function fetchCurriculum() {
    try {
        // Fetch all collections in parallel
        const [subjectsSnap, chaptersSnap, topicsSnap, subtopicsSnap] = await Promise.all([
            getDocs(collection(db, 'subjects')),
            getDocs(collection(db, 'chapters')),
            getDocs(collection(db, 'topics')),
            getDocs(collection(db, 'subtopics'))
        ]);

        // Convert to arrays
        const allSubjects = subjectsSnap.docs.map(d => d.data());
        const allChapters = chaptersSnap.docs.map(d => d.data());
        const allTopics = topicsSnap.docs.map(d => d.data());
        const allSubtopics = subtopicsSnap.docs.map(d => d.data());

        // Assemble hierarchy
        const subjects = allSubjects.map(subject => {
            const chapters = allChapters
                .filter(c => c.subjectId === subject.id)
                .map(chapter => {
                    const topics = allTopics
                        .filter(t => t.chapterId === chapter.id)
                        .map(topic => {
                            const subtopics = allSubtopics
                                .filter(s => s.topicId === topic.id);
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

/**
 * Fetches all flashcards for a specific chapter
 * @param {string} chapterId - The ID of the chapter
 * @returns {Promise<Array>} Array of flashcard objects
 */
export async function fetchFlashcards(chapterId) {
    try {
        const flashcardsSnapshot = await getDocs(collection(db, 'flashcards'));
        const flashcards = flashcardsSnapshot.docs
            .map(doc => ({ id: doc.id, ...doc.data() }))
            .filter(flashcard => flashcard.chapterId === chapterId);

        return flashcards;
    } catch (error) {
        console.error('Error fetching flashcards:', error);
        throw error;
    }
}

/**
 * Fetches all flashcards across all chapters
 * @returns {Promise<Array>} Array of all flashcard objects
 */
export async function fetchAllFlashcards() {
    try {
        const flashcardsSnapshot = await getDocs(collection(db, 'flashcards'));
        const flashcards = flashcardsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        return flashcards;
    } catch (error) {
        console.error('Error fetching all flashcards:', error);
        throw error;
    }
}

/**
 * Adds a new flashcard to Firestore
 * @param {string} chapterId - The ID of the chapter
 * @param {Object} flashcardData - The flashcard data (question, answer, etc.)
 * @returns {Promise<Object>} The created flashcard with ID
 */
export async function addFlashcard(chapterId, flashcardData) {
    try {
        const flashcardRef = await addDoc(collection(db, 'flashcards'), {
            chapterId,
            question: flashcardData.question,
            answer: flashcardData.answer,
            difficulty: flashcardData.difficulty || 'medium',
            tags: flashcardData.tags || [],
            createdAt: new Date().toISOString()
        });

        return { id: flashcardRef.id, chapterId, ...flashcardData };
    } catch (error) {
        console.error('Error adding flashcard:', error);
        throw error;
    }
}

/**
 * Updates an existing flashcard
 * @param {string} flashcardId - The ID of the flashcard to update
 * @param {Object} updates - The fields to update
 * @returns {Promise<void>}
 */
export async function updateFlashcard(flashcardId, updates) {
    try {
        const flashcardRef = doc(db, 'flashcards', flashcardId);
        await setDoc(flashcardRef, {
            ...updates,
            updatedAt: new Date().toISOString()
        }, { merge: true });
    } catch (error) {
        console.error('Error updating flashcard:', error);
        throw error;
    }
}

/**
 * Deletes a flashcard from Firestore
 * @param {string} flashcardId - The ID of the flashcard to delete
 * @returns {Promise<void>}
 */
export async function deleteFlashcard(flashcardId) {
    try {
        const { deleteDoc } = await import('firebase/firestore');
        const flashcardRef = doc(db, 'flashcards', flashcardId);
        await deleteDoc(flashcardRef);
    } catch (error) {
        console.error('Error deleting flashcard:', error);
        throw error;
    }
}

// --- Subject CRUD ---

export async function addSubject(data) {
    try {
        // Use custom ID if provided, otherwise auto-generate
        const id = data.id || doc(collection(db, 'subjects')).id;
        await setDoc(doc(db, 'subjects', id), { ...data, id });
        return { ...data, id };
    } catch (error) {
        console.error('Error adding subject:', error);
        throw error;
    }
}

export async function updateSubject(id, data) {
    try {
        await setDoc(doc(db, 'subjects', id), data, { merge: true });
    } catch (error) {
        console.error('Error updating subject:', error);
        throw error;
    }
}

export async function deleteSubject(id) {
    try {
        const { deleteDoc } = await import('firebase/firestore');
        await deleteDoc(doc(db, 'subjects', id));
    } catch (error) {
        console.error('Error deleting subject:', error);
        throw error;
    }
}

// --- Chapter CRUD ---

export async function addChapter(data) {
    try {
        const id = data.id || doc(collection(db, 'chapters')).id;
        await setDoc(doc(db, 'chapters', id), { ...data, id });
        return { ...data, id };
    } catch (error) {
        console.error('Error adding chapter:', error);
        throw error;
    }
}

export async function updateChapter(id, data) {
    try {
        await setDoc(doc(db, 'chapters', id), data, { merge: true });
    } catch (error) {
        console.error('Error updating chapter:', error);
        throw error;
    }
}

export async function deleteChapter(id) {
    try {
        const { deleteDoc } = await import('firebase/firestore');
        await deleteDoc(doc(db, 'chapters', id));
    } catch (error) {
        console.error('Error deleting chapter:', error);
        throw error;
    }
}

// --- Topic CRUD ---

export async function addTopic(data) {
    try {
        const id = data.id || doc(collection(db, 'topics')).id;
        await setDoc(doc(db, 'topics', id), { ...data, id });
        return { ...data, id };
    } catch (error) {
        console.error('Error adding topic:', error);
        throw error;
    }
}

export async function updateTopic(id, data) {
    try {
        await setDoc(doc(db, 'topics', id), data, { merge: true });
    } catch (error) {
        console.error('Error updating topic:', error);
        throw error;
    }
}

export async function deleteTopic(id) {
    try {
        const { deleteDoc } = await import('firebase/firestore');
        await deleteDoc(doc(db, 'topics', id));
    } catch (error) {
        console.error('Error deleting topic:', error);
        throw error;
    }
}

// --- Subtopic CRUD ---

export async function addSubtopic(data) {
    try {
        const id = data.id || doc(collection(db, 'subtopics')).id;
        await setDoc(doc(db, 'subtopics', id), { ...data, id });
        return { ...data, id };
    } catch (error) {
        console.error('Error adding subtopic:', error);
        throw error;
    }
}

export async function updateSubtopic(id, data) {
    try {
        await setDoc(doc(db, 'subtopics', id), data, { merge: true });
    } catch (error) {
        console.error('Error updating subtopic:', error);
        throw error;
    }
}

export async function deleteSubtopic(id) {
    try {
        const { deleteDoc } = await import('firebase/firestore');
        await deleteDoc(doc(db, 'subtopics', id));
    } catch (error) {
        console.error('Error deleting subtopic:', error);
        throw error;
    }
}

