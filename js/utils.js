/**
 * ==================== UTILITY FUNCTIONS ====================
 * Shared utilities for Cantonese Playground
 * Includes: Debounce, throttle, keyboard shortcuts, swipe detection
 * ================================================================
 */

// ==================== DEBOUNCE & THROTTLE ====================

/**
 * Creates a debounced version of a function
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
function debounce(func, wait = 300) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func.apply(this, args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Creates a throttled version of a function
 * @param {Function} func - Function to throttle
 * @param {number} limit - Minimum time between calls in milliseconds
 * @returns {Function} Throttled function
 */
function throttle(func, limit = 100) {
    let inThrottle;
    return function executedFunction(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// ==================== FEATURE DETECTION ====================

/**
 * Check if speech synthesis is available
 * @returns {boolean}
 */
function hasSpeechSynthesis() {
    return 'speechSynthesis' in window && window.speechSynthesis !== null;
}

/**
 * Check if localStorage is available
 * @returns {boolean}
 */
function hasLocalStorage() {
    try {
        const test = '__storage_test__';
        localStorage.setItem(test, test);
        localStorage.removeItem(test);
        return true;
    } catch (e) {
        return false;
    }
}

/**
 * Check localStorage quota and available space
 * @returns {Object} { available: boolean, usedBytes: number, message: string }
 */
function checkStorageQuota() {
    if (!hasLocalStorage()) {
        return { available: false, usedBytes: 0, message: 'localStorage not available' };
    }

    try {
        let usedBytes = 0;
        for (let key in localStorage) {
            if (localStorage.hasOwnProperty(key)) {
                usedBytes += localStorage[key].length * 2; // UTF-16 = 2 bytes per char
            }
        }

        // Most browsers allow 5MB
        const maxBytes = 5 * 1024 * 1024;
        const percentUsed = (usedBytes / maxBytes * 100).toFixed(1);

        return {
            available: true,
            usedBytes: usedBytes,
            maxBytes: maxBytes,
            percentUsed: parseFloat(percentUsed),
            message: `Using ${percentUsed}% of storage`
        };
    } catch (e) {
        return { available: false, usedBytes: 0, message: e.message };
    }
}

/**
 * Check if touch device
 * @returns {boolean}
 */
function isTouchDevice() {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
}

/**
 * Check if mobile device
 * @returns {boolean}
 */
function isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

// ==================== KEYBOARD SHORTCUTS ====================

const keyboardShortcuts = {
    handlers: new Map(),
    enabled: true,

    /**
     * Initialize keyboard shortcuts
     */
    init() {
        document.addEventListener('keydown', (e) => {
            if (!this.enabled) return;

            // Don't trigger shortcuts when typing in inputs
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
                // Allow Escape to blur inputs
                if (e.key === 'Escape') {
                    e.target.blur();
                }
                return;
            }

            const key = this.getKeyString(e);
            const handler = this.handlers.get(key);

            if (handler) {
                e.preventDefault();
                handler(e);
            }
        });
    },

    /**
     * Get normalized key string from event
     * @param {KeyboardEvent} e
     * @returns {string}
     */
    getKeyString(e) {
        const parts = [];
        if (e.ctrlKey) parts.push('ctrl');
        if (e.altKey) parts.push('alt');
        if (e.shiftKey) parts.push('shift');
        if (e.metaKey) parts.push('meta');
        parts.push(e.key.toLowerCase());
        return parts.join('+');
    },

    /**
     * Register a keyboard shortcut
     * @param {string} key - Key combination (e.g., 'ctrl+k', 'escape', '/')
     * @param {Function} handler - Handler function
     */
    register(key, handler) {
        this.handlers.set(key.toLowerCase(), handler);
    },

    /**
     * Unregister a keyboard shortcut
     * @param {string} key
     */
    unregister(key) {
        this.handlers.delete(key.toLowerCase());
    },

    /**
     * Enable all shortcuts
     */
    enable() {
        this.enabled = true;
    },

    /**
     * Disable all shortcuts
     */
    disable() {
        this.enabled = false;
    }
};

/**
 * Setup default keyboard shortcuts
 */
function setupDefaultKeyboardShortcuts() {
    // Spacebar: Play current audio
    keyboardShortcuts.register(' ', () => {
        const activeCard = document.querySelector('.card:hover .play-btn');
        if (activeCard) {
            activeCard.click();
        } else {
            // Try to find play button in current test question
            const playBtn = document.querySelector('.game-container:not([style*="display: none"]) .play-btn');
            if (playBtn) playBtn.click();
        }
    });

    // Escape: Close modals/menus
    keyboardShortcuts.register('escape', () => {
        // Close profile modal
        const profileModal = document.getElementById('profileModal');
        if (profileModal && profileModal.style.display !== 'none') {
            closeProfileModal();
            return;
        }

        // Close about modal
        const aboutModal = document.getElementById('aboutModal');
        if (aboutModal && aboutModal.style.display !== 'none') {
            closeAboutModal();
            return;
        }

        // Close main menu
        if (typeof closeMainMenu === 'function') {
            closeMainMenu();
        }

        // Close search results
        const searchResults = document.querySelector('.search-results.active');
        if (searchResults) {
            searchResults.classList.remove('active');
        }
    });

    // / or Ctrl+K: Focus search
    keyboardShortcuts.register('/', () => {
        const searchInput = document.getElementById('globalSearch');
        if (searchInput) {
            searchInput.focus();
        }
    });

    keyboardShortcuts.register('ctrl+k', () => {
        const searchInput = document.getElementById('globalSearch');
        if (searchInput) {
            searchInput.focus();
        }
    });

    // Arrow keys for navigation in tests
    keyboardShortcuts.register('arrowleft', () => {
        // Navigate to previous card or question
        const prevBtn = document.querySelector('.prev-btn:not([disabled])');
        if (prevBtn) prevBtn.click();
    });

    keyboardShortcuts.register('arrowright', () => {
        // Navigate to next card or question
        const nextBtn = document.querySelector('.next-btn:not([disabled])');
        if (nextBtn) nextBtn.click();
    });

    // Number keys 1-4 to select options in tests
    ['1', '2', '3', '4'].forEach((num, index) => {
        keyboardShortcuts.register(num, () => {
            const options = document.querySelectorAll('.game-container:not([style*="display: none"]) .option:not([disabled])');
            if (options[index]) {
                options[index].click();
            }
        });
    });

    // Enter to confirm answer
    keyboardShortcuts.register('enter', () => {
        const confirmBtn = document.querySelector('.game-container:not([style*="display: none"]) .next-btn:not([style*="display: none"])');
        if (confirmBtn) confirmBtn.click();
    });

    // D: Toggle dark mode
    keyboardShortcuts.register('d', () => {
        if (typeof toggleDarkMode === 'function') {
            toggleDarkMode();
        }
    });
}

// ==================== SWIPE DETECTION ====================

const swipeDetector = {
    touchStartX: 0,
    touchStartY: 0,
    touchEndX: 0,
    touchEndY: 0,
    minSwipeDistance: 50,
    maxVerticalDistance: 100,
    handlers: {
        left: null,
        right: null,
        up: null,
        down: null
    },

    /**
     * Initialize swipe detection on an element
     * @param {HTMLElement} element - Element to attach swipe detection to
     * @param {Object} handlers - { left: fn, right: fn, up: fn, down: fn }
     */
    init(element, handlers = {}) {
        this.handlers = { ...this.handlers, ...handlers };

        element.addEventListener('touchstart', (e) => {
            this.touchStartX = e.changedTouches[0].screenX;
            this.touchStartY = e.changedTouches[0].screenY;
        }, { passive: true });

        element.addEventListener('touchend', (e) => {
            this.touchEndX = e.changedTouches[0].screenX;
            this.touchEndY = e.changedTouches[0].screenY;
            this.handleSwipe();
        }, { passive: true });
    },

    /**
     * Handle swipe gesture
     */
    handleSwipe() {
        const deltaX = this.touchEndX - this.touchStartX;
        const deltaY = this.touchEndY - this.touchStartY;
        const absX = Math.abs(deltaX);
        const absY = Math.abs(deltaY);

        // Horizontal swipe
        if (absX > this.minSwipeDistance && absY < this.maxVerticalDistance) {
            if (deltaX > 0 && this.handlers.right) {
                this.handlers.right();
            } else if (deltaX < 0 && this.handlers.left) {
                this.handlers.left();
            }
        }

        // Vertical swipe
        if (absY > this.minSwipeDistance && absX < this.maxVerticalDistance) {
            if (deltaY > 0 && this.handlers.down) {
                this.handlers.down();
            } else if (deltaY < 0 && this.handlers.up) {
                this.handlers.up();
            }
        }
    },

    /**
     * Update swipe handlers
     * @param {Object} handlers
     */
    setHandlers(handlers) {
        this.handlers = { ...this.handlers, ...handlers };
    }
};

/**
 * Initialize swipe navigation for vocabulary cards
 */
function initSwipeNavigation() {
    const cardsContainers = document.querySelectorAll('.cards-grid');

    cardsContainers.forEach(container => {
        let currentCardIndex = 0;
        const cards = container.querySelectorAll('.card');

        if (cards.length === 0) return;

        swipeDetector.init(container, {
            left: () => {
                // Next card
                if (currentCardIndex < cards.length - 1) {
                    currentCardIndex++;
                    cards[currentCardIndex].scrollIntoView({ behavior: 'smooth', block: 'center' });
                    // Visual feedback
                    cards[currentCardIndex].style.transform = 'scale(1.02)';
                    setTimeout(() => {
                        cards[currentCardIndex].style.transform = '';
                    }, 200);
                }
            },
            right: () => {
                // Previous card
                if (currentCardIndex > 0) {
                    currentCardIndex--;
                    cards[currentCardIndex].scrollIntoView({ behavior: 'smooth', block: 'center' });
                    cards[currentCardIndex].style.transform = 'scale(1.02)';
                    setTimeout(() => {
                        cards[currentCardIndex].style.transform = '';
                    }, 200);
                }
            }
        });
    });
}

// ==================== PULL TO REFRESH ====================

const pullToRefresh = {
    startY: 0,
    pullDistance: 0,
    threshold: 80,
    isRefreshing: false,
    indicator: null,

    /**
     * Initialize pull to refresh
     */
    init() {
        // Create indicator element
        this.indicator = document.createElement('div');
        this.indicator.className = 'pull-refresh-indicator';
        this.indicator.innerHTML = '<span class="pull-refresh-icon">↓</span><span class="pull-refresh-text">Pull to refresh</span>';
        this.indicator.style.cssText = `
            position: fixed;
            top: -60px;
            left: 50%;
            transform: translateX(-50%);
            background: var(--card-bg, white);
            padding: 15px 25px;
            border-radius: 30px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.15);
            display: flex;
            align-items: center;
            gap: 10px;
            z-index: 9999;
            transition: top 0.3s ease;
        `;
        document.body.appendChild(this.indicator);

        document.addEventListener('touchstart', (e) => {
            if (window.scrollY === 0) {
                this.startY = e.touches[0].clientY;
            }
        }, { passive: true });

        document.addEventListener('touchmove', (e) => {
            if (this.startY === 0 || this.isRefreshing) return;

            this.pullDistance = e.touches[0].clientY - this.startY;

            if (this.pullDistance > 0 && window.scrollY === 0) {
                const progress = Math.min(this.pullDistance / this.threshold, 1);
                this.indicator.style.top = `${Math.min(this.pullDistance - 60, 20)}px`;

                if (progress >= 1) {
                    this.indicator.querySelector('.pull-refresh-text').textContent = 'Release to refresh';
                    this.indicator.querySelector('.pull-refresh-icon').textContent = '↻';
                } else {
                    this.indicator.querySelector('.pull-refresh-text').textContent = 'Pull to refresh';
                    this.indicator.querySelector('.pull-refresh-icon').textContent = '↓';
                }
            }
        }, { passive: true });

        document.addEventListener('touchend', () => {
            if (this.pullDistance >= this.threshold && !this.isRefreshing) {
                this.refresh();
            } else {
                this.reset();
            }
        }, { passive: true });
    },

    /**
     * Perform refresh
     */
    refresh() {
        this.isRefreshing = true;
        this.indicator.querySelector('.pull-refresh-text').textContent = 'Refreshing...';
        this.indicator.querySelector('.pull-refresh-icon').style.animation = 'spin 1s linear infinite';

        // Simulate refresh delay, then reload content
        setTimeout(() => {
            // Refresh current section content
            const activeContent = document.querySelector('.content.active');
            if (activeContent) {
                activeContent.style.opacity = '0';
                setTimeout(() => {
                    activeContent.style.opacity = '1';
                }, 100);
            }

            this.reset();
            this.isRefreshing = false;
        }, 1000);
    },

    /**
     * Reset indicator
     */
    reset() {
        this.startY = 0;
        this.pullDistance = 0;
        this.indicator.style.top = '-60px';
        this.indicator.querySelector('.pull-refresh-icon').style.animation = '';
    }
};

// ==================== FOCUS MANAGEMENT (Accessibility) ====================

const focusManager = {
    previousFocus: null,

    /**
     * Trap focus within an element (for modals)
     * @param {HTMLElement} element
     */
    trapFocus(element) {
        const focusableElements = element.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );

        const firstFocusable = focusableElements[0];
        const lastFocusable = focusableElements[focusableElements.length - 1];

        // Store the previously focused element
        this.previousFocus = document.activeElement;

        // Focus the first element
        if (firstFocusable) {
            firstFocusable.focus();
        }

        // Handle tab key
        element.addEventListener('keydown', (e) => {
            if (e.key !== 'Tab') return;

            if (e.shiftKey) {
                // Shift + Tab
                if (document.activeElement === firstFocusable) {
                    e.preventDefault();
                    lastFocusable.focus();
                }
            } else {
                // Tab
                if (document.activeElement === lastFocusable) {
                    e.preventDefault();
                    firstFocusable.focus();
                }
            }
        });
    },

    /**
     * Restore focus to previous element
     */
    restoreFocus() {
        if (this.previousFocus && typeof this.previousFocus.focus === 'function') {
            this.previousFocus.focus();
        }
    }
};

// ==================== DARK MODE ====================

/**
 * Initialize dark mode based on system preference and localStorage
 */
function initDarkMode() {
    // Check localStorage first
    const savedTheme = localStorage.getItem('cantonesePlayground_theme');

    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        // Use system preference
        document.documentElement.setAttribute('data-theme', 'dark');
    }

    // Listen for system theme changes
    if (window.matchMedia) {
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (!localStorage.getItem('cantonesePlayground_theme')) {
                document.documentElement.setAttribute('data-theme', e.matches ? 'dark' : 'light');
            }
        });
    }
}

/**
 * Toggle dark mode
 */
function toggleDarkMode() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('cantonesePlayground_theme', newTheme);

    // Update toggle button icon
    const icon = document.getElementById('darkModeIcon');
    if (icon) {
        icon.textContent = newTheme === 'dark' ? '☀️' : '🌙';
    }

    // Update toggle button style
    const toggleBtn = document.getElementById('darkModeToggle');
    if (toggleBtn) {
        if (newTheme === 'dark') {
            toggleBtn.style.background = 'linear-gradient(135deg, #FEC857, #FF8A5B)';
        } else {
            toggleBtn.style.background = 'linear-gradient(135deg, #2D3748, #4A5568)';
        }
    }

    return newTheme;
}

/**
 * Update dark mode button on page load
 */
function updateDarkModeButton() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const icon = document.getElementById('darkModeIcon');
    const toggleBtn = document.getElementById('darkModeToggle');

    if (icon) {
        icon.textContent = currentTheme === 'dark' ? '☀️' : '🌙';
    }
    if (toggleBtn && currentTheme === 'dark') {
        toggleBtn.style.background = 'linear-gradient(135deg, #FEC857, #FF8A5B)';
    }
}

// ==================== CELEBRATION ANIMATION ====================

/**
 * Show celebration animation
 * @param {string} emoji - Emoji to display
 */
function showCelebration(emoji = '🎉') {
    const celebration = document.createElement('div');
    celebration.className = 'celebration';
    celebration.textContent = emoji;
    document.body.appendChild(celebration);

    // Remove after animation
    setTimeout(() => {
        celebration.remove();
    }, 1000);
}

// ==================== SAFE TRY-CATCH WRAPPER ====================

/**
 * Safely execute a function with error handling
 * @param {Function} fn - Function to execute
 * @param {*} fallback - Fallback value on error
 * @param {string} context - Context for error logging
 * @returns {*}
 */
function safeExecute(fn, fallback = null, context = '') {
    try {
        return fn();
    } catch (error) {
        console.error(`Error${context ? ' in ' + context : ''}:`, error);
        return fallback;
    }
}

// ==================== INITIALIZATION ====================

/**
 * Initialize all utility functions
 */
function initUtils() {
    // Initialize keyboard shortcuts
    keyboardShortcuts.init();
    setupDefaultKeyboardShortcuts();

    // Initialize dark mode
    initDarkMode();

    // Update dark mode button after DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', updateDarkModeButton);
    } else {
        updateDarkModeButton();
    }

    // Initialize swipe navigation on mobile
    if (isTouchDevice()) {
        document.addEventListener('DOMContentLoaded', () => {
            initSwipeNavigation();
            pullToRefresh.init();
        });
    }

    // Log storage status
    const storageStatus = checkStorageQuota();
    if (storageStatus.percentUsed > 80) {
        console.warn('Storage usage high:', storageStatus.message);
    }
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initUtils);
} else {
    initUtils();
}

// Export for use in other modules
window.CantoneseUtils = {
    debounce,
    throttle,
    hasSpeechSynthesis,
    hasLocalStorage,
    checkStorageQuota,
    isTouchDevice,
    isMobile,
    keyboardShortcuts,
    swipeDetector,
    pullToRefresh,
    focusManager,
    initDarkMode,
    toggleDarkMode,
    showCelebration,
    safeExecute
};
