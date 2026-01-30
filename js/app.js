/**
 * ==================== MAIN APPLICATION ====================
 * Main initialization and coordination for Cantonese Playground
 * ================================================================
 */

// ==================== GLOBAL STATE ====================

let isInitialized = false;
let loadingComplete = false;

// ==================== INITIALIZATION ====================

/**
 * Main initialization function
 * Called when DOM is ready
 */
function initApp() {
    if (isInitialized) return;
    isInitialized = true;

    console.log('🎉 Initializing Cantonese Playground...');

    // Show loading indicator
    showLoadingIndicator();

    // Initialize modules in order
    try {
        // 1. Initialize utilities (keyboard shortcuts, dark mode, etc.)
        if (typeof initUtils === 'function') {
            initUtils();
            console.log('✅ Utils initialized');
        }

        // 2. Initialize audio system
        if (typeof initAudio === 'function') {
            initAudio();
            console.log('✅ Audio initialized');
        }

        // 3. Initialize navigation
        if (typeof initNavigation === 'function') {
            initNavigation();
            console.log('✅ Navigation initialized');
        }

        // 4. Initialize profile system
        if (typeof initProfile === 'function') {
            initProfile();
            console.log('✅ Profile initialized');
        }

        // 5. Initialize search
        if (typeof initSearch === 'function') {
            initSearch();
            console.log('✅ Search initialized');
        }

        // 6. Initialize favorites
        if (typeof initFavorites === 'function') {
            initFavorites();
            console.log('✅ Favorites initialized');
        }

        // 7. Initialize analytics
        if (typeof initAnalytics === 'function') {
            initAnalytics();
            console.log('✅ Analytics initialized');
        }

        // 8. Initialize quiz system
        if (typeof initQuiz === 'function') {
            initQuiz();
            console.log('✅ Quiz initialized');
        }

        // 9. Load saved preferences
        loadPreferences();

        // 10. Set up global event listeners
        setupGlobalEventListeners();

        console.log('🎉 Cantonese Playground initialized successfully!');

    } catch (error) {
        console.error('Error during initialization:', error);
    }

    // Hide loading indicator
    hideLoadingIndicator();
    loadingComplete = true;
}

// ==================== LOADING INDICATOR ====================

/**
 * Show loading indicator
 */
function showLoadingIndicator() {
    const loader = document.getElementById('loadingOverlay');
    if (loader) {
        loader.style.display = 'flex';
    }
}

/**
 * Hide loading indicator
 */
function hideLoadingIndicator() {
    const loader = document.getElementById('loadingOverlay');
    if (loader) {
        loader.style.opacity = '0';
        setTimeout(() => {
            loader.style.display = 'none';
            loader.style.opacity = '1';
        }, 300);
    }
}

// ==================== PREFERENCES ====================

/**
 * Load saved user preferences
 */
function loadPreferences() {
    // Load dark mode preference
    const darkMode = localStorage.getItem('darkMode');
    if (darkMode === 'true') {
        document.body.classList.add('dark-mode');
        const toggle = document.getElementById('darkModeToggle');
        if (toggle) toggle.checked = true;
    }

    // Load Chinese mode preference (Traditional/Simplified)
    const chineseMode = localStorage.getItem('chineseMode');
    if (chineseMode === 'simplified') {
        if (typeof toggleChineseMode === 'function') {
            // This will toggle from default Traditional to Simplified
            toggleChineseMode();
        }
    }

    // Load speech rate preference
    const speechRate = localStorage.getItem('speechRate');
    if (speechRate && typeof setSpeechRate === 'function') {
        setSpeechRate(parseFloat(speechRate));
        const slider = document.getElementById('speechRateSlider');
        if (slider) slider.value = speechRate;
    }
}

// ==================== GLOBAL EVENT LISTENERS ====================

/**
 * Set up global event listeners
 */
function setupGlobalEventListeners() {
    // Handle visibility change (pause audio when tab is hidden)
    document.addEventListener('visibilitychange', () => {
        if (document.hidden && 'speechSynthesis' in window) {
            window.speechSynthesis.cancel();
        }
    });

    // Handle before unload (save state)
    window.addEventListener('beforeunload', () => {
        // Save any pending state
        if (typeof saveUserData === 'function') {
            const userData = getUserData();
            if (userData) {
                saveUserData(userData);
            }
        }
    });

    // Handle errors gracefully
    window.onerror = function(msg, url, lineNo, columnNo, error) {
        console.error('Error: ' + msg + ' at line ' + lineNo);
        return false;
    };

    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', function(event) {
        console.error('Unhandled promise rejection:', event.reason);
    });
}

// ==================== UTILITY FUNCTIONS ====================

/**
 * Show celebration animation
 * @param {string} emoji - Emoji to display
 */
function showCelebration(emoji) {
    const celebration = document.createElement('div');
    celebration.className = 'celebration-popup';
    celebration.textContent = emoji;
    celebration.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: 5rem;
        z-index: 10000;
        animation: celebrationPop 0.8s ease forwards;
        pointer-events: none;
    `;

    // Add animation style if not exists
    if (!document.getElementById('celebration-style')) {
        const style = document.createElement('style');
        style.id = 'celebration-style';
        style.textContent = `
            @keyframes celebrationPop {
                0% { transform: translate(-50%, -50%) scale(0); opacity: 0; }
                50% { transform: translate(-50%, -50%) scale(1.3); opacity: 1; }
                100% { transform: translate(-50%, -50%) scale(1); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }

    document.body.appendChild(celebration);
    setTimeout(() => celebration.remove(), 800);
}

/**
 * Track test score
 * @param {string} testType - Type of test
 * @param {number} section - Section number
 * @param {number} percentage - Score percentage
 */
function trackTestScore(testType, section, percentage) {
    if (typeof CantoneseProfile !== 'undefined' && CantoneseProfile.trackTestScore) {
        CantoneseProfile.trackTestScore(testType, section, percentage);
    }
}

/**
 * Open about modal
 */
function openAboutModal() {
    const modal = document.getElementById('aboutModal');
    if (modal) {
        modal.style.display = 'flex';
    }
}

/**
 * Close about modal
 */
function closeAboutModal() {
    const modal = document.getElementById('aboutModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// ==================== SERVICE WORKER ====================

/**
 * Register service worker for PWA support
 */
function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('ServiceWorker registered:', registration);
            })
            .catch(error => {
                console.log('ServiceWorker registration failed:', error);
            });
    }
}

// ==================== INITIALIZATION TRIGGER ====================

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    // DOM is already ready
    initApp();
}

// Also handle window load for any remaining tasks
window.addEventListener('load', () => {
    // Register service worker after full load
    // registerServiceWorker(); // Uncomment when SW is ready

    // Update any time-based UI elements
    if (typeof updateStreak === 'function') {
        updateStreak();
    }
});

// ==================== EXPORTS ====================

// Export functions for global use
window.showCelebration = showCelebration;
window.trackTestScore = trackTestScore;
window.openAboutModal = openAboutModal;
window.closeAboutModal = closeAboutModal;
window.showLoadingIndicator = showLoadingIndicator;
window.hideLoadingIndicator = hideLoadingIndicator;
