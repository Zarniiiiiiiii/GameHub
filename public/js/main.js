import db from './firebase/database.js';
import { auth } from './firebase/config.js';

// DOM Elements
const featuredGamesContainer = document.getElementById('featuredGames');
const allGamesContainer = document.getElementById('allGames');
const leaderboardContainer = document.getElementById('leaderboard');
const searchInput = document.querySelector('.search-bar input');
const loginBtn = document.getElementById('loginBtn');
const signupBtn = document.getElementById('signupBtn');

// Game data structure
const games = [
    {
        id: 'game1',
        title: 'Game 1',
        description: 'Description of Game 1',
        thumbnail: 'assets/images/thumbnail1.jpg',
        category: 'Action',
        featured: true
    },
    // Add more games here
];

// Initialize the game hub
async function initGameHub() {
    try {
        // Load games from Firebase
        const firebaseGames = await db.getGames();
        if (firebaseGames) {
            games.push(...firebaseGames);
        }
    } catch (error) {
        console.warn('Could not load games from Firebase:', error);
        // Continue with default games if Firebase is unavailable
    }

    // Display games
    displayGames();
    
    try {
        await displayLeaderboard();
    } catch (error) {
        console.warn('Could not load leaderboard:', error);
        leaderboardContainer.innerHTML = '<p>Leaderboard temporarily unavailable</p>';
    }

    // Set up authentication state listener
    auth.onAuthStateChanged((user) => {
        if (user) {
            // User is signed in
            loginBtn.textContent = 'Logout';
            signupBtn.style.display = 'none';
        } else {
            // User is signed out
            loginBtn.textContent = 'Login';
            signupBtn.style.display = 'block';
        }
    });
}

// Display games in the grid
function displayGames() {
    const featuredGames = games.filter(game => game.featured);
    const allGames = games;

    featuredGamesContainer.innerHTML = featuredGames.map(createGameCard).join('');
    allGamesContainer.innerHTML = allGames.map(createGameCard).join('');
}

// Create game card HTML
function createGameCard(game) {
    const defaultThumbnail = 'assets/images/default-thumbnail.jpg';
    return `
        <div class="game-card" data-game-id="${game.id}">
            <img src="${game.thumbnail || defaultThumbnail}" 
                 alt="${game.title}" 
                 onerror="this.onerror=null; this.src='${defaultThumbnail}'">
            <div class="game-card-content">
                <h3>${game.title}</h3>
                <p>${game.description}</p>
                <button onclick="loadGame('${game.id}')">Play Now</button>
            </div>
        </div>
    `;
}

// Display leaderboard
async function displayLeaderboard() {
    try {
        const topScores = await db.getTopScores('game1'); // Example for game1
        if (topScores) {
            const scoresHTML = Object.entries(topScores)
                .map(([userId, data]) => `
                    <div class="score-entry">
                        <span class="username">${data.username}</span>
                        <span class="score">${data.score}</span>
                    </div>
                `)
                .join('');
            leaderboardContainer.innerHTML = scoresHTML;
        } else {
            leaderboardContainer.innerHTML = '<p>No scores yet</p>';
        }
    } catch (error) {
        throw error; // Re-throw to be handled by the caller
    }
}

// Load a specific game
function loadGame(gameId) {
    // This will be implemented based on how you want to load your games
    window.location.href = `games/${gameId}/index.html`;
}

// Search functionality
searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const filteredGames = games.filter(game => 
        game.title.toLowerCase().includes(searchTerm) ||
        game.description.toLowerCase().includes(searchTerm)
    );
    allGamesContainer.innerHTML = filteredGames.map(createGameCard).join('');
});

// Authentication handlers
loginBtn.addEventListener('click', async () => {
    if (auth.currentUser) {
        // User is logged in, log them out
        await auth.signOut();
    } else {
        // Show login modal or redirect to login page
        // This will be implemented later
        console.log('Show login modal');
    }
});

signupBtn.addEventListener('click', () => {
    // Show signup modal or redirect to signup page
    // This will be implemented later
    console.log('Show signup modal');
});

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initGameHub); 