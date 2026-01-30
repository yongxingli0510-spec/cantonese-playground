/**
 * ==================== FAVORITES MODULE ====================
 * Bookmarks/Favorites system for Cantonese Playground
 * Allows users to save and quickly access favorite words
 * ================================================================
 */

// ==================== STATE ====================

const FAVORITES_KEY = 'cantonesePlayground_favorites';

// ==================== STORAGE FUNCTIONS ====================

/**
 * Get favorites from localStorage
 * @returns {Array} Array of favorite items
 */
function getFavorites() {
    try {
        const data = localStorage.getItem(FAVORITES_KEY);
        return data ? JSON.parse(data) : [];
    } catch (e) {
        console.error('Error reading favorites:', e);
        return [];
    }
}

/**
 * Save favorites to localStorage
 * @param {Array} favorites
 * @returns {boolean} Success status
 */
function saveFavorites(favorites) {
    try {
        localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
        return true;
    } catch (e) {
        console.error('Error saving favorites:', e);
        return false;
    }
}

/**
 * Check if a word is favorited
 * @param {string} chinese - Chinese text
 * @returns {boolean}
 */
function isFavorite(chinese) {
    const favorites = getFavorites();
    return favorites.some(fav => fav.chinese === chinese);
}

/**
 * Add a word to favorites
 * @param {Object} wordData - { chinese, jyutping, english, icon, category }
 * @returns {boolean} Success status
 */
function addFavorite(wordData) {
    const favorites = getFavorites();

    // Check if already exists
    if (favorites.some(fav => fav.chinese === wordData.chinese)) {
        return false;
    }

    favorites.push({
        ...wordData,
        addedAt: new Date().toISOString()
    });

    if (saveFavorites(favorites)) {
        updateFavoriteCount();
        return true;
    }
    return false;
}

/**
 * Remove a word from favorites
 * @param {string} chinese - Chinese text
 * @returns {boolean} Success status
 */
function removeFavorite(chinese) {
    const favorites = getFavorites();
    const filtered = favorites.filter(fav => fav.chinese !== chinese);

    if (filtered.length !== favorites.length) {
        if (saveFavorites(filtered)) {
            updateFavoriteCount();
            return true;
        }
    }
    return false;
}

/**
 * Toggle favorite status
 * @param {string} chinese - Chinese text
 * @param {Object} wordData - Word data if adding
 * @returns {boolean} New favorite status (true = favorited)
 */
function toggleFavorite(chinese, wordData = null) {
    if (isFavorite(chinese)) {
        removeFavorite(chinese);
        return false;
    } else if (wordData) {
        addFavorite(wordData);
        return true;
    }
    return false;
}

// ==================== UI FUNCTIONS ====================

/**
 * Add favorite buttons to all cards
 */
function addFavoriteButtons() {
    const cards = document.querySelectorAll('.card');

    cards.forEach(card => {
        // Skip if already has favorite button
        if (card.querySelector('.favorite-btn')) return;

        // Get word data from card
        const chinese = card.querySelector('.card-chinese')?.textContent?.trim();
        const jyutping = card.querySelector('.card-pinyin')?.textContent?.trim();
        const english = card.querySelector('.card-english')?.textContent?.trim();
        const icon = card.querySelector('.card-icon')?.textContent?.trim();

        if (!chinese) return;

        // Find category from parent content section
        const contentSection = card.closest('.content');
        const category = contentSection ? contentSection.id : '';

        // Create favorite button
        const favBtn = document.createElement('button');
        favBtn.className = 'favorite-btn';
        favBtn.setAttribute('aria-label', 'Add to favorites');
        favBtn.innerHTML = isFavorite(chinese) ? '❤️' : '🤍';

        if (isFavorite(chinese)) {
            favBtn.classList.add('active');
        }

        // Handle click
        favBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // Don't trigger card click

            const wordData = { chinese, jyutping, english, icon, category };
            const nowFavorited = toggleFavorite(chinese, wordData);

            // Update button
            favBtn.innerHTML = nowFavorited ? '❤️' : '🤍';
            favBtn.classList.toggle('active', nowFavorited);

            // Show feedback
            if (nowFavorited) {
                showFavoriteFeedback(card, 'Added to favorites!');
            } else {
                showFavoriteFeedback(card, 'Removed from favorites');
            }
        });

        card.appendChild(favBtn);
    });
}

/**
 * Show feedback when favoriting
 * @param {HTMLElement} card
 * @param {string} message
 */
function showFavoriteFeedback(card, message) {
    const feedback = document.createElement('div');
    feedback.style.cssText = `
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 10px 20px;
        border-radius: 20px;
        font-size: 0.9rem;
        z-index: 100;
        pointer-events: none;
        animation: fadeInOut 1.5s ease forwards;
    `;
    feedback.textContent = message;

    // Add animation style if not exists
    if (!document.getElementById('favorite-feedback-style')) {
        const style = document.createElement('style');
        style.id = 'favorite-feedback-style';
        style.textContent = `
            @keyframes fadeInOut {
                0% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
                20% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
                80% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
                100% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
            }
        `;
        document.head.appendChild(style);
    }

    card.style.position = 'relative';
    card.appendChild(feedback);

    setTimeout(() => feedback.remove(), 1500);
}

/**
 * Update favorite count badge
 */
function updateFavoriteCount() {
    const favorites = getFavorites();
    const countBadge = document.getElementById('favoritesCount');

    if (countBadge) {
        countBadge.textContent = favorites.length;
        countBadge.style.display = favorites.length > 0 ? 'inline-block' : 'none';
    }
}

// ==================== FAVORITES VIEW ====================

/**
 * Render the favorites view
 */
function renderFavoritesView() {
    const favoritesContent = document.getElementById('favorites');
    if (!favoritesContent) return;

    const favorites = getFavorites();

    if (favorites.length === 0) {
        favoritesContent.innerHTML = `
            <div class="favorites-empty">
                <div class="favorites-empty-icon">💝</div>
                <h2 style="color: var(--primary); margin-bottom: 10px;">No Favorites Yet</h2>
                <p>Tap the heart icon on any word card to add it to your favorites!</p>
            </div>
        `;
        return;
    }

    // Sort by most recently added
    const sortedFavorites = [...favorites].sort((a, b) =>
        new Date(b.addedAt) - new Date(a.addedAt)
    );

    favoritesContent.innerHTML = `
        <div class="favorites-header">
            <h2 style="font-family: var(--font-display); font-size: 2rem; color: var(--primary);">💝 My Favorites</h2>
            <p style="color: var(--text-muted);">${favorites.length} word${favorites.length !== 1 ? 's' : ''} saved</p>
        </div>

        <div style="margin-bottom: 20px; display: flex; gap: 10px; justify-content: center; flex-wrap: wrap;">
            <button class="next-btn" style="padding: 10px 20px; font-size: 0.95rem;" onclick="playAllFavorites()">
                🔊 Play All
            </button>
            <button class="next-btn" style="padding: 10px 20px; font-size: 0.95rem; background: linear-gradient(135deg, var(--accent), var(--blue));" onclick="shuffleFavorites()">
                🔀 Shuffle
            </button>
            <button class="next-btn" style="padding: 10px 20px; font-size: 0.95rem; background: linear-gradient(135deg, #FF6B6B, #ee5a5a);" onclick="confirmClearFavorites()">
                🗑️ Clear All
            </button>
        </div>

        <div class="cards-grid">
            ${sortedFavorites.map(fav => `
                <div class="card" onclick="playSound('${fav.chinese}', '${fav.jyutping}')" data-chinese="${fav.chinese}">
                    <div class="card-icon">${fav.icon || '📝'}</div>
                    <div class="card-chinese">${fav.chinese}</div>
                    <div class="card-pinyin">${fav.jyutping}</div>
                    <div class="card-english">${fav.english}</div>
                    <button class="play-btn">▶</button>
                    <button class="favorite-btn active" onclick="removeFavoriteFromView('${fav.chinese}', event)" aria-label="Remove from favorites">❤️</button>
                    <div style="margin-top: 10px; font-size: 0.75rem; color: var(--text-muted);">
                        From: ${getCategoryDisplayName(fav.category)}
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

/**
 * Get category display name
 * @param {string} category
 * @returns {string}
 */
function getCategoryDisplayName(category) {
    const names = {
        manners: 'Manners',
        numbers: 'Numbers',
        animals: 'Animals',
        colors: 'Colors',
        foods: 'Foods',
        weather: 'Weather',
        clothing: 'Clothing',
        sports: 'Sports',
        body: 'Body',
        places: 'Places',
        occupations: 'Occupations',
        hobbies: 'Hobbies',
        dailyactivities: 'Daily Activities',
        family: 'Family',
        transport: 'Transport',
        emotions: 'Emotions',
        nature: 'Nature'
    };
    return names[category] || category;
}

/**
 * Remove favorite from the favorites view
 * @param {string} chinese
 * @param {Event} event
 */
function removeFavoriteFromView(chinese, event) {
    event.stopPropagation();

    removeFavorite(chinese);

    // Remove card with animation
    const card = event.target.closest('.card');
    if (card) {
        card.style.transform = 'scale(0.8)';
        card.style.opacity = '0';
        card.style.transition = 'all 0.3s ease';

        setTimeout(() => {
            renderFavoritesView();
        }, 300);
    }
}

/**
 * Play all favorites in sequence
 */
function playAllFavorites() {
    const favorites = getFavorites();
    if (favorites.length === 0) return;

    let index = 0;

    function playNext() {
        if (index >= favorites.length) return;

        const fav = favorites[index];

        // Highlight current card
        const cards = document.querySelectorAll('#favorites .card');
        cards.forEach((card, i) => {
            if (i === index) {
                card.style.transform = 'scale(1.05)';
                card.style.boxShadow = '0 8px 30px rgba(78, 205, 196, 0.6)';
            } else {
                card.style.transform = '';
                card.style.boxShadow = '';
            }
        });

        // Play audio
        if (typeof safeSpeechSynthesis === 'function') {
            safeSpeechSynthesis(fav.chinese);
        } else if (typeof playSound === 'function') {
            playSound(fav.chinese, fav.jyutping);
        }

        index++;

        // Play next after delay
        setTimeout(playNext, 2000);
    }

    playNext();
}

/**
 * Shuffle and re-render favorites
 */
function shuffleFavorites() {
    const favorites = getFavorites();
    if (favorites.length <= 1) return;

    // Fisher-Yates shuffle
    for (let i = favorites.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [favorites[i], favorites[j]] = [favorites[j], favorites[i]];
    }

    saveFavorites(favorites);
    renderFavoritesView();
}

/**
 * Confirm and clear all favorites
 */
function confirmClearFavorites() {
    if (confirm('Are you sure you want to remove all favorites? This cannot be undone.')) {
        saveFavorites([]);
        renderFavoritesView();
        updateFavoriteCount();
    }
}

// ==================== MENU INTEGRATION ====================

/**
 * Add favorites section to menu if not exists
 */
function addFavoritesToMenu() {
    // This should be done in HTML, but can be added dynamically if needed
    const menu = document.getElementById('mainMenu');
    if (!menu) return;

    // Check if favorites menu item exists
    if (menu.querySelector('[onclick*="favorites"]')) return;

    // Find a good place to insert (before About)
    const aboutItem = menu.querySelector('[onclick*="openAboutModal"]');
    if (!aboutItem) return;

    const favoritesItem = document.createElement('div');
    favoritesItem.className = 'menu-item-container';
    favoritesItem.innerHTML = `
        <div class="menu-item" onclick="switchTab('favorites'); closeMainMenu();"
             style="padding: 12px 16px; cursor: pointer; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #eee; background: linear-gradient(135deg, #fff0f5, #ffe0e0);">
            <span>💝 My Favorites</span>
            <span id="favoritesCount" style="background: var(--primary); color: white; padding: 2px 8px; border-radius: 10px; font-size: 0.8rem;">0</span>
        </div>
    `;

    aboutItem.closest('.menu-item-container').before(favoritesItem);
    updateFavoriteCount();
}

// ==================== INITIALIZATION ====================

/**
 * Initialize favorites module
 */
function initFavorites() {
    // Add favorite buttons to existing cards
    addFavoriteButtons();

    // Re-add buttons when switching tabs (for dynamically loaded content)
    const originalSwitchTab = window.switchTab;
    if (originalSwitchTab) {
        window.switchTab = function(tabName) {
            originalSwitchTab(tabName);
            setTimeout(addFavoriteButtons, 100);

            // Render favorites view if switching to favorites
            if (tabName === 'favorites') {
                renderFavoritesView();
            }
        };
    }

    // Add favorites to menu
    addFavoritesToMenu();

    // Update count
    updateFavoriteCount();
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFavorites);
} else {
    initFavorites();
}

// Export for use in other modules
window.CantoneseFavorites = {
    getFavorites,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    isFavorite,
    renderFavoritesView,
    addFavoriteButtons,
    updateFavoriteCount
};

// Also export individual functions
window.getFavorites = getFavorites;
window.addFavorite = addFavorite;
window.removeFavorite = removeFavorite;
window.toggleFavorite = toggleFavorite;
window.isFavorite = isFavorite;
window.renderFavoritesView = renderFavoritesView;
window.removeFavoriteFromView = removeFavoriteFromView;
window.playAllFavorites = playAllFavorites;
window.shuffleFavorites = shuffleFavorites;
window.confirmClearFavorites = confirmClearFavorites;
