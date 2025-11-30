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
export async function fetchCurriculum() {
    try {
        const subjects = [];

        // Fetch all subjects
        const subjectsSnapshot = await getDocs(collection(db, 'subjects'));

        for (const subjectDoc of subjectsSnapshot.docs) {
            const subjectData = subjectDoc.data();
            const chapters = [];

            // Fetch chapters for this subject
            const chaptersSnapshot = await getDocs(collection(db, 'chapters'));
            const subjectChapters = chaptersSnapshot.docs
                .map(doc => doc.data())
                .filter(chapter => chapter.subjectId === subjectData.id);

            for (const chapterData of subjectChapters) {
                const topics = [];

                // Fetch topics for this chapter
                const topicsSnapshot = await getDocs(collection(db, 'topics'));
                const chapterTopics = topicsSnapshot.docs
                    .map(doc => doc.data())
                    .filter(topic => topic.chapterId === chapterData.id);

                for (const topicData of chapterTopics) {
                    // Fetch subtopics for this topic
                    const subtopicsSnapshot = await getDocs(collection(db, 'subtopics'));
                    const topicSubtopics = subtopicsSnapshot.docs
                        .map(doc => doc.data())
                        .filter(subtopic => subtopic.topicId === topicData.id);

                    topics.push({
                        ...topicData,
                        subtopics: topicSubtopics
                    });
                }

                chapters.push({
                    ...chapterData,
                    topics
                });
            }

            subjects.push({
                ...subjectData,
                chapters
            });
        }

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
