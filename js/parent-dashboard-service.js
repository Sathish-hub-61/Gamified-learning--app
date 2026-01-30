// Parent Dashboard Service
// View and manage child's learning progress

import { db, auth } from './firebase-config.js';
import {
    collection,
    doc,
    getDoc,
    getDocs,
    query,
    where,
    orderBy,
    limit,
    Timestamp
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

/**
 * Get child's complete progress summary
 */
export async function getChildProgress(childUserId) {
    try {
        const user = auth.currentUser;
        if (!user) {
            throw new Error('Parent not authenticated');
        }

        // Get all progress
        const progressRef = collection(db, 'users', childUserId, 'progress');
        const progressSnap = await getDocs(progressRef);

        const summary = {
            totalGamesPlayed: 0,
            gamesCompleted: 0,
            totalScore: 0,
            totalTimeSpent: 0,
            averageScore: 0,
            completionRate: 0,
            gameProgress: [],
            recentActivity: []
        };

        progressSnap.forEach(doc => {
            const data = doc.data();
            summary.totalGamesPlayed++;
            summary.totalScore += data.score || 0;
            summary.totalTimeSpent += data.timeSpent || 0;

            if (data.completed) {
                summary.gamesCompleted++;
            }

            summary.gameProgress.push({
                gameId: doc.id,
                ...data
            });
        });

        if (summary.totalGamesPlayed > 0) {
            summary.averageScore = Math.round(summary.totalScore / summary.totalGamesPlayed);
            summary.completionRate = Math.round((summary.gamesCompleted / summary.totalGamesPlayed) * 100);
        }

        // Get recent sessions
        const sessionsRef = collection(db, 'users', childUserId, 'sessions');
        const sessionsQuery = query(sessionsRef, orderBy('endTime', 'desc'), limit(10));
        const sessionsSnap = await getDocs(sessionsQuery);

        sessionsSnap.forEach(doc => {
            summary.recentActivity.push(doc.data());
        });

        return { success: true, summary };
    } catch (error) {
        console.error('Error getting child progress:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Get child's learning insights
 */
export async function getChildInsights(childUserId, days = 30) {
    try {
        const user = auth.currentUser;
        if (!user) {
            throw new Error('Parent not authenticated');
        }

        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - days);

        // Get sessions from last N days
        const sessionsRef = collection(db, 'users', childUserId, 'sessions');
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

        // Calculate insights
        const insights = {
            totalSessions: sessions.length,
            totalPlayTime: 0,
            averageSessionDuration: 0,
            mostPlayedGames: {},
            preferredPlayTime: {},
            learningStreak: 0,
            dailyActivity: {},
            weeklyProgress: []
        };

        sessions.forEach(session => {
            insights.totalPlayTime += session.duration || 0;

            // Track games
            if (session.gamesPlayed) {
                session.gamesPlayed.forEach(game => {
                    insights.mostPlayedGames[game] = (insights.mostPlayedGames[game] || 0) + 1;
                });
            }

            // Track time of day
            if (session.endTime) {
                const hour = session.endTime.toDate().getHours();
                const timeSlot = getTimeSlot(hour);
                insights.preferredPlayTime[timeSlot] = (insights.preferredPlayTime[timeSlot] || 0) + 1;

                // Track daily activity
                const date = session.endTime.toDate().toDateString();
                insights.dailyActivity[date] = (insights.dailyActivity[date] || 0) + 1;
            }
        });

        if (insights.totalSessions > 0) {
            insights.averageSessionDuration = Math.round(insights.totalPlayTime / insights.totalSessions);
        }

        // Calculate learning streak
        insights.learningStreak = calculateStreak(insights.dailyActivity);

        return { success: true, insights };
    } catch (error) {
        console.error('Error getting insights:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Get time slot from hour
 */
function getTimeSlot(hour) {
    if (hour >= 6 && hour < 12) return 'Morning (6AM-12PM)';
    if (hour >= 12 && hour < 17) return 'Afternoon (12PM-5PM)';
    if (hour >= 17 && hour < 21) return 'Evening (5PM-9PM)';
    return 'Night (9PM-6AM)';
}

/**
 * Calculate learning streak
 */
function calculateStreak(dailyActivity) {
    const dates = Object.keys(dailyActivity).sort().reverse();
    let streak = 0;
    const today = new Date().toDateString();

    for (let i = 0; i < dates.length; i++) {
        const expectedDate = new Date();
        expectedDate.setDate(expectedDate.getDate() - i);

        if (dates[i] === expectedDate.toDateString()) {
            streak++;
        } else {
            break;
        }
    }

    return streak;
}

/**
 * Get child's milestones
 */
export async function getChildMilestones(childUserId) {
    try {
        const user = auth.currentUser;
        if (!user) {
            throw new Error('Parent not authenticated');
        }

        const milestonesRef = collection(db, 'users', childUserId, 'milestones');
        const q = query(milestonesRef, orderBy('timestamp', 'desc'), limit(20));
        const snapshot = await getDocs(q);

        const milestones = [];
        snapshot.forEach(doc => {
            milestones.push({ id: doc.id, ...doc.data() });
        });

        return { success: true, milestones };
    } catch (error) {
        console.error('Error getting milestones:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Get child's skill levels
 */
export async function getChildSkills(childUserId) {
    try {
        const user = auth.currentUser;
        if (!user) {
            throw new Error('Parent not authenticated');
        }

        const skillsRef = collection(db, 'users', childUserId, 'skills');
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

/**
 * Get weekly progress report
 */
export async function getWeeklyReport(childUserId) {
    try {
        const user = auth.currentUser;
        if (!user) {
            throw new Error('Parent not authenticated');
        }

        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

        // Get sessions from last week
        const sessionsRef = collection(db, 'users', childUserId, 'sessions');
        const q = query(
            sessionsRef,
            where('endTime', '>=', Timestamp.fromDate(oneWeekAgo)),
            orderBy('endTime', 'desc')
        );

        const snapshot = await getDocs(q);

        const report = {
            weekStart: oneWeekAgo.toLocaleDateString(),
            weekEnd: new Date().toLocaleDateString(),
            totalSessions: 0,
            totalPlayTime: 0,
            gamesPlayed: {},
            dailyBreakdown: {},
            achievements: []
        };

        snapshot.forEach(doc => {
            const data = doc.data();
            report.totalSessions++;
            report.totalPlayTime += data.duration || 0;

            if (data.gamesPlayed) {
                data.gamesPlayed.forEach(game => {
                    report.gamesPlayed[game] = (report.gamesPlayed[game] || 0) + 1;
                });
            }

            if (data.endTime) {
                const date = data.endTime.toDate().toLocaleDateString();
                if (!report.dailyBreakdown[date]) {
                    report.dailyBreakdown[date] = {
                        sessions: 0,
                        playTime: 0,
                        games: []
                    };
                }
                report.dailyBreakdown[date].sessions++;
                report.dailyBreakdown[date].playTime += data.duration || 0;
                if (data.gamesPlayed) {
                    report.dailyBreakdown[date].games.push(...data.gamesPlayed);
                }
            }
        });

        // Get milestones from last week
        const milestonesRef = collection(db, 'users', childUserId, 'milestones');
        const milestonesQuery = query(
            milestonesRef,
            where('timestamp', '>=', Timestamp.fromDate(oneWeekAgo)),
            orderBy('timestamp', 'desc')
        );
        const milestonesSnap = await getDocs(milestonesQuery);

        milestonesSnap.forEach(doc => {
            report.achievements.push(doc.data());
        });

        return { success: true, report };
    } catch (error) {
        console.error('Error getting weekly report:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Get performance comparison (vs age group average)
 */
export async function getPerformanceComparison(childUserId, ageGroup) {
    try {
        const user = auth.currentUser;
        if (!user) {
            throw new Error('Parent not authenticated');
        }

        // Get child's stats
        const childStatsRef = doc(db, 'users', childUserId, 'stats', 'overall');
        const childStatsSnap = await getDoc(childStatsRef);
        const childStats = childStatsSnap.exists() ? childStatsSnap.data() : {};

        // Get age group averages (this would be pre-calculated)
        const ageGroupRef = doc(db, 'analytics', 'ageGroups', ageGroup);
        const ageGroupSnap = await getDoc(ageGroupRef);
        const ageGroupStats = ageGroupSnap.exists() ? ageGroupSnap.data() : {};

        const comparison = {
            child: {
                totalScore: childStats.totalScore || 0,
                gamesPlayed: childStats.totalGamesPlayed || 0,
                timeSpent: childStats.totalTimeSpent || 0
            },
            ageGroupAverage: {
                totalScore: ageGroupStats.averageScore || 0,
                gamesPlayed: ageGroupStats.averageGamesPlayed || 0,
                timeSpent: ageGroupStats.averageTimeSpent || 0
            },
            percentile: 0
        };

        // Calculate percentile (simplified)
        if (ageGroupStats.averageScore > 0) {
            comparison.percentile = Math.round(
                (comparison.child.totalScore / ageGroupStats.averageScore) * 50
            );
        }

        return { success: true, comparison };
    } catch (error) {
        console.error('Error getting performance comparison:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Export progress report as PDF data
 */
export function generateReportData(summary, insights, milestones) {
    return {
        generatedAt: new Date().toISOString(),
        reportType: 'Parent Dashboard Report',
        summary: {
            totalGamesPlayed: summary.totalGamesPlayed,
            gamesCompleted: summary.gamesCompleted,
            averageScore: summary.averageScore,
            completionRate: summary.completionRate,
            totalTimeSpent: formatTime(summary.totalTimeSpent)
        },
        insights: {
            totalSessions: insights.totalSessions,
            averageSessionDuration: formatTime(insights.averageSessionDuration),
            learningStreak: insights.learningStreak,
            preferredPlayTime: insights.preferredPlayTime,
            mostPlayedGames: insights.mostPlayedGames
        },
        milestones: milestones.map(m => ({
            type: m.type,
            achievement: m.achievement,
            date: m.timestamp?.toDate().toLocaleDateString()
        })),
        recommendations: generateParentRecommendations(summary, insights)
    };
}

/**
 * Generate recommendations for parents
 */
function generateParentRecommendations(summary, insights) {
    const recommendations = [];

    if (insights.learningStreak < 3) {
        recommendations.push({
            title: 'Build Consistency',
            message: 'Encourage daily play sessions to build a learning habit',
            priority: 'high'
        });
    }

    if (summary.completionRate < 50) {
        recommendations.push({
            title: 'Focus on Completion',
            message: 'Help your child finish games to reinforce learning',
            priority: 'medium'
        });
    }

    if (insights.averageSessionDuration < 600) { // Less than 10 minutes
        recommendations.push({
            title: 'Extend Play Time',
            message: 'Longer sessions lead to better learning outcomes',
            priority: 'low'
        });
    }

    return recommendations;
}

/**
 * Format time in seconds to readable format
 */
function formatTime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    if (hours > 0) {
        return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
}
