// Analytics Service
// Track learning patterns and generate insights

import { db, auth, analytics } from './firebase-config.js';
import {
    collection,
    doc,
    setDoc,
    getDocs,
    query,
    where,
    orderBy,
    limit,
    serverTimestamp,
    Timestamp
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';
import { logEvent } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-analytics.js';

/**
 * Track game start
 */
export function trackGameStart(gameId, gameName) {
    try {
        logEvent(analytics, 'game_start', {
            game_id: gameId,
            game_name: gameName,
            timestamp: new Date().toISOString()
        });

        console.log('Game start tracked:', gameId);
    } catch (error) {
        console.error('Error tracking game start:', error);
    }
}

/**
 * Track game completion
 */
export function trackGameComplete(gameId, gameName, score, duration) {
    try {
        logEvent(analytics, 'game_complete', {
            game_id: gameId,
            game_name: gameName,
            score: score,
            duration: duration,
            timestamp: new Date().toISOString()
        });

        console.log('Game completion tracked:', gameId, score);
    } catch (error) {
        console.error('Error tracking game completion:', error);
    }
}

/**
 * Track learning event
 */
export function trackLearningEvent(eventType, eventData) {
    try {
        logEvent(analytics, eventType, {
            ...eventData,
            timestamp: new Date().toISOString()
        });

        console.log('Learning event tracked:', eventType);
    } catch (error) {
        console.error('Error tracking learning event:', error);
    }
}

/**
 * Save detailed analytics data
 */
export async function saveAnalyticsData(analyticsData) {
    try {
        const user = auth.currentUser;
        if (!user) {
            throw new Error('User not authenticated');
        }

        const analyticsRef = doc(collection(db, 'analytics', user.uid, 'events'));

        await setDoc(analyticsRef, {
            userId: user.uid,
            eventType: analyticsData.eventType,
            gameId: analyticsData.gameId,
            data: analyticsData.data,
            timestamp: serverTimestamp(),
            sessionId: analyticsData.sessionId || null
        });

        return { success: true };
    } catch (error) {
        console.error('Error saving analytics:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Get learning patterns for a user
 */
export async function getLearningPatterns(userId, days = 30) {
    try {
        const user = auth.currentUser;
        const targetUserId = userId || user?.uid;

        if (!targetUserId) {
            throw new Error('User ID required');
        }

        // Get sessions from last N days
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - days);

        const sessionsRef = collection(db, 'users', targetUserId, 'sessions');
        const q = query(
            sessionsRef,
            where('endTime', '>=', Timestamp.fromDate(cutoffDate)),
            orderBy('endTime', 'desc')
        );

        const snapshot = await getDocs(q);
        const sessions = [];
        snapshot.forEach(doc => {
            sessions.push(doc.data());
        });

        // Analyze patterns
        const patterns = analyzePatterns(sessions);

        return { success: true, patterns };
    } catch (error) {
        console.error('Error getting learning patterns:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Analyze learning patterns from session data
 */
function analyzePatterns(sessions) {
    const patterns = {
        totalSessions: sessions.length,
        totalTimeSpent: 0,
        averageSessionDuration: 0,
        gamesPlayed: {},
        preferredTimeOfDay: {},
        learningStreak: 0,
        strongSubjects: [],
        needsImprovement: []
    };

    if (sessions.length === 0) return patterns;

    // Calculate totals
    sessions.forEach(session => {
        patterns.totalTimeSpent += session.duration || 0;

        // Track games played
        if (session.gamesPlayed) {
            session.gamesPlayed.forEach(game => {
                patterns.gamesPlayed[game] = (patterns.gamesPlayed[game] || 0) + 1;
            });
        }

        // Track time of day
        if (session.endTime) {
            const hour = session.endTime.toDate().getHours();
            const timeSlot = getTimeSlot(hour);
            patterns.preferredTimeOfDay[timeSlot] = (patterns.preferredTimeOfDay[timeSlot] || 0) + 1;
        }
    });

    patterns.averageSessionDuration = patterns.totalTimeSpent / sessions.length;

    return patterns;
}

/**
 * Get time slot from hour
 */
function getTimeSlot(hour) {
    if (hour >= 6 && hour < 12) return 'morning';
    if (hour >= 12 && hour < 17) return 'afternoon';
    if (hour >= 17 && hour < 21) return 'evening';
    return 'night';
}

/**
 * Get performance insights
 */
export async function getPerformanceInsights(userId) {
    try {
        const user = auth.currentUser;
        const targetUserId = userId || user?.uid;

        if (!targetUserId) {
            throw new Error('User ID required');
        }

        // Get all progress
        const progressRef = collection(db, 'users', targetUserId, 'progress');
        const snapshot = await getDocs(progressRef);

        const insights = {
            totalGamesPlayed: 0,
            completionRate: 0,
            averageScore: 0,
            strongAreas: [],
            improvementAreas: [],
            recommendations: []
        };

        let totalScore = 0;
        let completedGames = 0;
        const gameScores = {};

        snapshot.forEach(doc => {
            const data = doc.data();
            insights.totalGamesPlayed++;

            if (data.completed) completedGames++;
            if (data.score) {
                totalScore += data.score;
                gameScores[doc.id] = data.score;
            }
        });

        if (insights.totalGamesPlayed > 0) {
            insights.completionRate = (completedGames / insights.totalGamesPlayed) * 100;
            insights.averageScore = totalScore / insights.totalGamesPlayed;
        }

        // Identify strong and weak areas
        const sortedGames = Object.entries(gameScores).sort((a, b) => b[1] - a[1]);
        insights.strongAreas = sortedGames.slice(0, 3).map(([game]) => game);
        insights.improvementAreas = sortedGames.slice(-3).map(([game]) => game);

        // Generate recommendations
        insights.recommendations = generateRecommendations(insights);

        return { success: true, insights };
    } catch (error) {
        console.error('Error getting insights:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Generate personalized recommendations
 */
function generateRecommendations(insights) {
    const recommendations = [];

    if (insights.completionRate < 50) {
        recommendations.push({
            type: 'completion',
            message: 'Try to complete more games to improve learning retention',
            priority: 'high'
        });
    }

    if (insights.averageScore < 60) {
        recommendations.push({
            type: 'practice',
            message: 'Practice more to improve scores',
            priority: 'medium'
        });
    }

    if (insights.improvementAreas.length > 0) {
        recommendations.push({
            type: 'focus',
            message: `Focus on: ${insights.improvementAreas.join(', ')}`,
            priority: 'medium'
        });
    }

    return recommendations;
}

/**
 * Track skill progress
 */
export async function trackSkillProgress(skillData) {
    try {
        const user = auth.currentUser;
        if (!user) {
            throw new Error('User not authenticated');
        }

        const skillRef = doc(db, 'users', user.uid, 'skills', skillData.skillName);

        await setDoc(skillRef, {
            skillName: skillData.skillName,
            level: skillData.level || 1,
            experience: skillData.experience || 0,
            lastPracticed: serverTimestamp(),
            gamesContributing: skillData.games || [],
            proficiency: skillData.proficiency || 'beginner'
        }, { merge: true });

        return { success: true };
    } catch (error) {
        console.error('Error tracking skill:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Get skill breakdown
 */
export async function getSkillBreakdown() {
    try {
        const user = auth.currentUser;
        if (!user) {
            throw new Error('User not authenticated');
        }

        const skillsRef = collection(db, 'users', user.uid, 'skills');
        const snapshot = await getDocs(skillsRef);

        const skills = {};
        snapshot.forEach(doc => {
            skills[doc.id] = doc.data();
        });

        return { success: true, skills };
    } catch (error) {
        console.error('Error getting skills:', error);
        return { success: false, error: error.message };
    }
}
