import { database } from './config.js';
import { ref, get, set, push, query, orderByChild, limitToLast } from "https://www.gstatic.com/firebasejs/9.6.0/firebase-database.js";

// Get all games
export async function getGames() {
    try {
        const gamesRef = ref(database, 'games');
        const snapshot = await get(gamesRef);
        if (snapshot.exists()) {
            return snapshot.val();
        }
        return null;
    } catch (error) {
        console.error("Error getting games:", error);
        return null;
    }
}

// Get top scores for a game
export async function getTopScores(gameId, limit = 10) {
    try {
        const scoresRef = ref(database, `scores/${gameId}`);
        const scoresQuery = query(scoresRef, orderByChild('score'), limitToLast(limit));
        const snapshot = await get(scoresQuery);
        if (snapshot.exists()) {
            return snapshot.val();
        }
        return null;
    } catch (error) {
        console.error("Error getting top scores:", error);
        return null;
    }
}

// Save a new score
export async function saveScore(gameId, userId, score, username) {
    try {
        const scoresRef = ref(database, `scores/${gameId}`);
        const newScoreRef = push(scoresRef);
        await set(newScoreRef, {
            userId,
            score,
            username,
            timestamp: Date.now()
        });
        return true;
    } catch (error) {
        console.error("Error saving score:", error);
        return false;
    }
}

// Add a new game
export async function addGame(gameData) {
    try {
        const gamesRef = ref(database, 'games');
        const newGameRef = push(gamesRef);
        await set(newGameRef, gameData);
        return newGameRef.key;
    } catch (error) {
        console.error("Error adding game:", error);
        return null;
    }
} 