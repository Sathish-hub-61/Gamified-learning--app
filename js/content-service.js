// Content Management Service
// Add, edit, and manage games dynamically

import { db, auth } from './firebase-config.js';
import {
    collection,
    doc,
    setDoc,
    getDoc,
    getDocs,
    updateDoc,
    deleteDoc,
    query,
    where,
    orderBy,
    serverTimestamp
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

/**
 * Add a new game to the system
 */
export async function addGame(gameData) {
    try {
        const user = auth.currentUser;
        if (!user) {
            throw new Error('User not authenticated');
        }

        const gameRef = doc(collection(db, 'games'));

        const game = {
            id: gameRef.id,
            title: gameData.title,
            description: gameData.description,
            ageGroup: gameData.ageGroup, // '3-5', '6-9', '10-12'
            category: gameData.category, // 'math', 'science', 'language', etc.
            difficulty: gameData.difficulty, // 'easy', 'medium', 'hard'
            icon: gameData.icon || '🎮',
            url: gameData.url,
            levels: gameData.levels || 1,
            estimatedTime: gameData.estimatedTime || 10, // minutes
            skills: gameData.skills || [], // ['addition', 'subtraction']
            isActive: true,
            createdBy: user.uid,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
            metadata: gameData.metadata || {}
        };

        await setDoc(gameRef, game);

        console.log('Game added successfully:', game.id);
        return { success: true, gameId: game.id, game };
    } catch (error) {
        console.error('Error adding game:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Update existing game
 */
export async function updateGame(gameId, updates) {
    try {
        const user = auth.currentUser;
        if (!user) {
            throw new Error('User not authenticated');
        }

        const gameRef = doc(db, 'games', gameId);

        await updateDoc(gameRef, {
            ...updates,
            updatedAt: serverTimestamp(),
            updatedBy: user.uid
        });

        console.log('Game updated successfully:', gameId);
        return { success: true };
    } catch (error) {
        console.error('Error updating game:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Get game by ID
 */
export async function getGame(gameId) {
    try {
        const gameRef = doc(db, 'games', gameId);
        const gameSnap = await getDoc(gameRef);

        if (gameSnap.exists()) {
            return { success: true, game: { id: gameSnap.id, ...gameSnap.data() } };
        } else {
            return { success: false, error: 'Game not found' };
        }
    } catch (error) {
        console.error('Error getting game:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Get all games
 */
export async function getAllGames(filters = {}) {
    try {
        let gamesQuery = collection(db, 'games');

        // Apply filters
        if (filters.ageGroup) {
            gamesQuery = query(gamesQuery, where('ageGroup', '==', filters.ageGroup));
        }
        if (filters.category) {
            gamesQuery = query(gamesQuery, where('category', '==', filters.category));
        }
        if (filters.isActive !== undefined) {
            gamesQuery = query(gamesQuery, where('isActive', '==', filters.isActive));
        }

        const snapshot = await getDocs(gamesQuery);
        const games = [];

        snapshot.forEach(doc => {
            games.push({ id: doc.id, ...doc.data() });
        });

        return { success: true, games };
    } catch (error) {
        console.error('Error getting games:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Get games by age group
 */
export async function getGamesByAgeGroup(ageGroup) {
    return await getAllGames({ ageGroup, isActive: true });
}

/**
 * Delete game (soft delete - mark as inactive)
 */
export async function deleteGame(gameId) {
    try {
        const user = auth.currentUser;
        if (!user) {
            throw new Error('User not authenticated');
        }

        const gameRef = doc(db, 'games', gameId);

        await updateDoc(gameRef, {
            isActive: false,
            deletedAt: serverTimestamp(),
            deletedBy: user.uid
        });

        console.log('Game deleted successfully:', gameId);
        return { success: true };
    } catch (error) {
        console.error('Error deleting game:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Add game content (levels, questions, etc.)
 */
export async function addGameContent(gameId, contentData) {
    try {
        const user = auth.currentUser;
        if (!user) {
            throw new Error('User not authenticated');
        }

        const contentRef = doc(collection(db, 'games', gameId, 'content'));

        const content = {
            id: contentRef.id,
            gameId,
            type: contentData.type, // 'level', 'question', 'challenge'
            level: contentData.level || 1,
            data: contentData.data,
            difficulty: contentData.difficulty,
            isActive: true,
            createdBy: user.uid,
            createdAt: serverTimestamp()
        };

        await setDoc(contentRef, content);

        console.log('Game content added:', content.id);
        return { success: true, contentId: content.id };
    } catch (error) {
        console.error('Error adding game content:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Get game content
 */
export async function getGameContent(gameId, filters = {}) {
    try {
        let contentQuery = collection(db, 'games', gameId, 'content');

        if (filters.level) {
            contentQuery = query(contentQuery, where('level', '==', filters.level));
        }
        if (filters.type) {
            contentQuery = query(contentQuery, where('type', '==', filters.type));
        }

        const snapshot = await getDocs(contentQuery);
        const content = [];

        snapshot.forEach(doc => {
            content.push({ id: doc.id, ...doc.data() });
        });

        return { success: true, content };
    } catch (error) {
        console.error('Error getting game content:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Update game content
 */
export async function updateGameContent(gameId, contentId, updates) {
    try {
        const user = auth.currentUser;
        if (!user) {
            throw new Error('User not authenticated');
        }

        const contentRef = doc(db, 'games', gameId, 'content', contentId);

        await updateDoc(contentRef, {
            ...updates,
            updatedAt: serverTimestamp(),
            updatedBy: user.uid
        });

        console.log('Game content updated:', contentId);
        return { success: true };
    } catch (error) {
        console.error('Error updating game content:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Add game category
 */
export async function addCategory(categoryData) {
    try {
        const user = auth.currentUser;
        if (!user) {
            throw new Error('User not authenticated');
        }

        const categoryRef = doc(collection(db, 'categories'));

        const category = {
            id: categoryRef.id,
            name: categoryData.name,
            description: categoryData.description,
            icon: categoryData.icon || '📚',
            color: categoryData.color || '#667eea',
            isActive: true,
            createdAt: serverTimestamp()
        };

        await setDoc(categoryRef, category);

        console.log('Category added:', category.id);
        return { success: true, categoryId: category.id };
    } catch (error) {
        console.error('Error adding category:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Get all categories
 */
export async function getCategories() {
    try {
        const categoriesRef = collection(db, 'categories');
        const q = query(categoriesRef, where('isActive', '==', true));
        const snapshot = await getDocs(q);

        const categories = [];
        snapshot.forEach(doc => {
            categories.push({ id: doc.id, ...doc.data() });
        });

        return { success: true, categories };
    } catch (error) {
        console.error('Error getting categories:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Get game statistics
 */
export async function getGameStatistics(gameId) {
    try {
        // Get all users who played this game
        const statsRef = collection(db, 'gameStats', gameId, 'players');
        const snapshot = await getDocs(statsRef);

        const stats = {
            totalPlayers: 0,
            totalPlays: 0,
            averageScore: 0,
            completionRate: 0,
            averageTime: 0
        };

        let totalScore = 0;
        let totalTime = 0;
        let completedCount = 0;

        snapshot.forEach(doc => {
            const data = doc.data();
            stats.totalPlayers++;
            stats.totalPlays += data.plays || 0;
            totalScore += data.bestScore || 0;
            totalTime += data.totalTime || 0;
            if (data.completed) completedCount++;
        });

        if (stats.totalPlayers > 0) {
            stats.averageScore = totalScore / stats.totalPlayers;
            stats.averageTime = totalTime / stats.totalPlayers;
            stats.completionRate = (completedCount / stats.totalPlayers) * 100;
        }

        return { success: true, stats };
    } catch (error) {
        console.error('Error getting game statistics:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Bulk import games
 */
export async function bulkImportGames(gamesArray) {
    try {
        const results = {
            success: 0,
            failed: 0,
            errors: []
        };

        for (const gameData of gamesArray) {
            const result = await addGame(gameData);
            if (result.success) {
                results.success++;
            } else {
                results.failed++;
                results.errors.push({ game: gameData.title, error: result.error });
            }
        }

        return { success: true, results };
    } catch (error) {
        console.error('Error bulk importing games:', error);
        return { success: false, error: error.message };
    }
}
