// Progress Tracking Service
// Saves and retrieves game progress for students

import { db, auth } from './firebase-config.js';
import {
    collection,
    doc,
    setDoc,
    getDoc,
    getDocs,
    deleteDoc,
    onSnapshot,
    query,
    where,
    orderBy,
    limit,
    serverTimestamp,
    increment
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

import { onAuthStateChanged, signInAnonymously } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';

// Global session timer
let sessionStartTime = Date.now();

// Export for standard script tags - DO THIS EARLY
window.saveGameProgress = saveGameProgress;
window.getGameProgress = getGameProgress;
window.getAllProgress = getAllProgress;
window.getUserStats = getUserStats;
window.saveSession = saveSession;
window.getRecentSessions = getRecentSessions;
window.trackMilestone = trackMilestone;
window.resetAllProgress = resetAllProgress;
window.listenToAllProgress = listenToAllProgress;
window.listenToRecentSessions = listenToRecentSessions;
window.listenToRecentSessions = listenToRecentSessions;

// Auto-Login for games
onAuthStateChanged(auth, (user) => {
    if (!user) {
        signInAnonymously(auth).catch(err => console.error("Auth Error:", err));
    } else {
        console.log("Cloud Progress Active:", user.uid);
        // Track the start of a session
        saveSession({ metadata: { event: 'session_start' } });
    }
});

/**
 * Helper to ensure auth is ready before operations
 */
async function ensureAuth() {
    if (auth.currentUser) return auth.currentUser;

    return new Promise((resolve, reject) => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            unsubscribe();
            if (user) resolve(user);
            else reject(new Error('Auth failed'));
        });
        // Timeout after 5 seconds to avoid hanging
        setTimeout(() => {
            unsubscribe();
            reject(new Error('Auth timeout'));
        }, 5000);
    });
}

/**
 * Save game progress
 * @param {string} gameId - Unique game identifier
 * @param {object} progressData - Game progress data
 */
export async function saveGameProgress(gameId, progressData) {
    try {
        const user = await ensureAuth();
        if (!user) {
            throw new Error('User not authenticated');
        }

        const progressRef = doc(db, 'users', user.uid, 'progress', gameId);

        const data = {
            gameId,
            userId: user.uid,
            score: progressData.score || 0,
            level: progressData.level || 1,
            completed: progressData.completed || false,
            attempts: progressData.attempts || 0,
            correctAnswers: progressData.correctAnswers || 0,
            wrongAnswers: progressData.wrongAnswers || 0,
            timeSpent: progressData.timeSpent || Math.floor((Date.now() - sessionStartTime) / 1000),
            lastPlayed: serverTimestamp(),
            updatedAt: serverTimestamp(),
            metadata: progressData.metadata || {}
        };

        await setDoc(progressRef, data, { merge: true });

        // Update user stats
        await updateUserStats(user.uid, gameId, progressData);

        console.log('Progress saved successfully:', gameId);
        return { success: true, data };
    } catch (error) {
        console.error('Error saving progress:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Update aggregate user stats
 */
async function updateUserStats(userId, gameId, progressData) {
    const statsRef = doc(db, 'users', userId, 'stats', 'overall');
    const updateData = {
        totalScore: increment(progressData.score || 0),
        totalGamesPlayed: increment(progressData.completed ? 1 : 0),
        totalAttempts: increment(progressData.attempts || 0),
        totalCorrectAnswers: increment(progressData.correctAnswers || 0),
        totalTimeSpent: increment(progressData.timeSpent || 0),
        lastPlayed: serverTimestamp()
    };
    await setDoc(statsRef, updateData, { merge: true });
}

/**
 * Get aggregate user stats
 */
export async function getUserStats() {
    try {
        const user = auth.currentUser;
        if (!user) throw new Error('User not authenticated');
        const statsRef = doc(db, 'users', user.uid, 'stats', 'overall');
        const snap = await getDoc(statsRef);
        return { success: true, stats: snap.exists() ? snap.data() : null };
    } catch (error) {
        console.error('Error getting stats:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Save a play session (multiple games)
 */
export async function saveSession(sessionData = {}) {
    try {
        const user = await ensureAuth();
        if (!user) throw new Error('User not authenticated');
        const sessionRef = doc(collection(db, 'users', user.uid, 'sessions'));
        const data = {
            userId: user.uid,
            startTime: sessionData.startTime || serverTimestamp(),
            endTime: serverTimestamp(),
            duration: sessionData.duration || 0,
            gamesPlayed: sessionData.gamesPlayed || [],
            totalScore: sessionData.totalScore || 0,
            metadata: sessionData.metadata || {}
        };
        await setDoc(sessionRef, data);
        return { success: true, id: sessionRef.id };
    } catch (error) {
        console.error('Error saving session:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Get recent sessions
 */
export async function getRecentSessions(count = 10) {
    try {
        const user = auth.currentUser;
        if (!user) throw new Error('User not authenticated');
        const sessionsRef = collection(db, 'users', user.uid, 'sessions');
        const q = query(sessionsRef, orderBy('endTime', 'desc'), limit(count));
        const snap = await getDocs(q);
        const sessions = [];
        snap.forEach(d => sessions.push({ id: d.id, ...d.data() }));
        return { success: true, sessions };
    } catch (error) {
        console.error('Error getting recent sessions:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Get user's progress for a specific game
 */
export async function getGameProgress(gameId) {
    try {
        const user = auth.currentUser;
        if (!user) {
            throw new Error('User not authenticated');
        }

        const progressRef = doc(db, 'users', user.uid, 'progress', gameId);
        const progressSnap = await getDoc(progressRef);

        if (progressSnap.exists()) {
            return { success: true, progress: progressSnap.data() };
        } else {
            return { success: true, progress: null };
        }
    } catch (error) {
        console.error('Error getting progress:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Get all progress for current user
 */
export async function getAllProgress() {
    try {
        const user = auth.currentUser;
        if (!user) {
            throw new Error('User not authenticated');
        }

        const progressRef = collection(db, 'users', user.uid, 'progress');
        const snapshot = await getDocs(progressRef);

        const allProgress = {};
        snapshot.forEach(doc => {
            allProgress[doc.id] = doc.data();
        });

        return { success: true, progress: allProgress };
    } catch (error) {
        console.error('Error getting all progress:', error);
        return { success: false, error: error.message };
    }
}


/**
 * Listen to all progress for current user (Real-time)
 */
// listenToAllProgress logic below

/**
 * Listen to all progress for current user (Real-time)
 * Robustly waits for Auth state to be ready
 */
export function listenToAllProgress(callback) {
    let unsubscribeFirestore = null;

    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
        if (user) {
            const progressRef = collection(db, 'users', user.uid, 'progress');
            unsubscribeFirestore = onSnapshot(progressRef, (snapshot) => {
                const allProgress = {};
                snapshot.forEach(doc => {
                    allProgress[doc.id] = doc.data();
                });
                callback({ success: true, progress: allProgress });
            }, (error) => {
                console.error('Error listening to progress:', error);
                callback({ success: false, error: error.message });
            });
        } else {
            // Handle logged out state if needed, or wait
            if (unsubscribeFirestore) {
                unsubscribeFirestore();
                unsubscribeFirestore = null;
            }
        }
    });

    // Return a function that unsubscribes primarily from auth, 
    // and also cleans up firestore if it was active
    return () => {
        unsubscribeAuth();
        if (unsubscribeFirestore) unsubscribeFirestore();
    };
}

/**
 * Listen to recent sessions for current user (Real-time)
 * Robustly waits for Auth state to be ready
 */
export function listenToRecentSessions(callback, count = 10) {
    let unsubscribeFirestore = null;

    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
        if (user) {
            const sessionsRef = collection(db, 'users', user.uid, 'sessions');
            const q = query(sessionsRef, orderBy('endTime', 'desc'), limit(count));

            unsubscribeFirestore = onSnapshot(q, (snapshot) => {
                const sessions = [];
                snapshot.forEach(doc => {
                    sessions.push({ id: doc.id, ...doc.data() });
                });
                callback({ success: true, sessions });
            }, (error) => {
                console.error('Error listening to sessions:', error);
                callback({ success: false, error: error.message });
            });
        } else {
            if (unsubscribeFirestore) {
                unsubscribeFirestore();
                unsubscribeFirestore = null;
            }
        }
    });

    return () => {
        unsubscribeAuth();
        if (unsubscribeFirestore) unsubscribeFirestore();
    };
}

/**
 * Track learning milestone
 */
export async function trackMilestone(milestoneData) {
    try {
        const user = auth.currentUser;
        if (!user) {
            throw new Error('User not authenticated');
        }

        const milestoneRef = doc(collection(db, 'users', user.uid, 'milestones'));

        await setDoc(milestoneRef, {
            userId: user.uid,
            type: milestoneData.type,
            gameId: milestoneData.gameId,
            achievement: milestoneData.achievement,
            timestamp: serverTimestamp(),
            metadata: milestoneData.metadata || {}
        });

        return { success: true };
    } catch (error) {
        console.error('Error tracking milestone:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Reset all user progress and stats
 */
export async function resetAllProgress() {
    try {
        const user = auth.currentUser;
        if (!user) throw new Error('User not authenticated');

        const collections = ['progress', 'sessions', 'milestones'];
        const deletePromises = [];

        for (const col of collections) {
            const colRef = collection(db, 'users', user.uid, col);
            const snap = await getDocs(colRef);
            snap.forEach(d => deletePromises.push(deleteDoc(d.ref)));
        }

        const statsRef = doc(db, 'users', user.uid, 'stats', 'overall');
        deletePromises.push(deleteDoc(statsRef));

        await Promise.all(deletePromises);
        return { success: true };
    } catch (error) {
        console.error('Error resetting progress:', error);
        return { success: false, error: error.message };
    }
}


