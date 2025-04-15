import { database } from './config.js';
import { ref, get, set, push, query, orderByChild, limitToLast } from "https://www.gstatic.com/firebasejs/9.6.0/firebase-database.js";

// Get all games
export async function getGames() {
    try {
        const gamesRef = ref(database, 'games');
        const snapshot = await get(gamesRef);
        if (snapshot.exists()) {
            return Object.values(snapshot.val());
        }
        // If no games exist, initialize with sample data
        await initializeSampleData();
        const newSnapshot = await get(gamesRef);
        return Object.values(newSnapshot.val());
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

// Initialize sample data
async function initializeSampleData() {
    try {
        const gamesRef = ref(database, 'games');
        const sampleGames = [
            {
                id: 'game1',
                title: 'Space Invaders',
                description: 'Classic arcade game where you defend Earth from alien invasion',
                thumbnail: 'assets/images/default-thumbnail.jpg',
                category: 'Arcade',
                featured: true
            },
            {
                id: 'game2',
                title: 'Snake Adventure',
                description: 'Guide the snake to collect food and grow while avoiding obstacles',
                thumbnail: 'assets/images/default-thumbnail.jpg',
                category: 'Casual',
                featured: true
            },
            {
                id: 'game3',
                title: 'Puzzle Master',
                description: 'Challenge your mind with increasingly difficult puzzles',
                thumbnail: 'assets/images/default-thumbnail.jpg',
                category: 'Puzzle',
                featured: false
            }
        ];

        // Add sample games
        await set(gamesRef, sampleGames);

        // Add some sample scores
        const scoresRef = ref(database, 'scores/game1');
        const sampleScores = {
            score1: {
                userId: 'user1',
                username: 'PlayerOne',
                score: 1000,
                timestamp: Date.now()
            },
            score2: {
                userId: 'user2',
                username: 'PlayerTwo',
                score: 850,
                timestamp: Date.now()
            }
        };
        await set(scoresRef, sampleScores);
        
        console.log("Sample data initialized successfully");
        return true;
    } catch (error) {
        console.error("Error initializing sample data:", error);
        return false;
    }
} 