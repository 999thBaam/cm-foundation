import { db } from '../config/firebase';
import { collection, addDoc } from 'firebase/firestore';

/**
 * Simple test to verify Firebase connection
 */
export async function testFirebaseConnection() {
    try {
        console.log('Testing Firebase connection...');
        const testRef = collection(db, 'test');
        const docRef = await addDoc(testRef, {
            message: 'Hello from CM Foundation!',
            timestamp: new Date().toISOString()
        });
        console.log('✅ Firebase connection successful! Document ID:', docRef.id);
        return { success: true, message: 'Firebase connected successfully', docId: docRef.id };
    } catch (error) {
        console.error('❌ Firebase connection failed:', error);
        return { success: false, error: error.message };
    }
}
