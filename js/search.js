/**
 * ==================== SEARCH MODULE ====================
 * Global search functionality for Cantonese Playground
 * Search across all 618+ vocabulary words
 * ================================================================
 */

// ==================== STATE ====================

let searchIndex = [];
let searchResultsVisible = false;

// ==================== SEARCH INDEX BUILDING ====================

/**
 * Build search index from vocabulary data
 * Called after vocabulary.js is loaded
 */
function buildSearchIndex() {
    searchIndex = [];

    // Check if vocabularyData is available
    if (typeof vocabularyData === 'undefined') {
        console.warn('vocabularyData not available for search index');
        return;
    }

    // Iterate through all categories and words
    Object.entries(vocabularyData).forEach(([category, words]) => {
        words.forEach(word => {
            searchIndex.push({
                chinese: word.chinese,
                jyutping: word.jyutping,
                english: word.english,
                icon: word.icon || '📝',
                category: category,
                categoryDisplay: getCategoryDisplayName(category)
            });
        });
    });

    console.log(`Search index built with ${searchIndex.length} words`);
}

/**
 * Get display name for a category
 * @param {string} category - Category key
 * @returns {string} Display name
 */
function getCategoryDisplayName(category) {
    const categoryNames = {
        manners: 'Manners 禮貌',
        numbers: 'Numbers 數字',
        animals: 'Animals 動物',
        colors: 'Colors 顏色',
        foods: 'Foods 食物',
        weather: 'Weather 天氣',
        clothing: 'Clothing 衫褲',
        sports: 'Sports 運動',
        body: 'Body 身體',
        places: 'Places 地方',
        occupations: 'Occupations 職業',
        hobbies: 'Hobbies 興趣',
        dailyactivities: 'Daily Activities 日常',
        family: 'Family 家人',
        transport: 'Transport 交通',
        emotions: 'Emotions 情緒',
        nature: 'Nature 自然',
        lunarnewyear: 'Lunar New Year 農曆新年',
        easter: 'Easter 復活節',
        dragonboat: 'Dragon Boat 端午節',
        canadaday: 'Canada Day 加拿大日',
        midautumn: 'Mid-Autumn 中秋節',
        thanksgiving: 'Thanksgiving 感恩節',
        halloween: 'Halloween 萬聖節',
        christmas: 'Christmas 聖誕節',
        quantitywords: 'Quantity Words 量詞',
        pronouns: 'Pronouns 代詞',
        verbs: 'Verbs 動詞',
        adjectives: 'Adjectives 形容詞',
        expresswords: 'Express Words 語氣詞',
        questions: 'Questions 疑問詞',
        linkingwords: 'Linking Words 連接詞',
        introduction: 'Introduction 自我介紹',
        schoolsentences: 'School 學校',
        restaurantsentences: 'Restaurant 餐廳',
        shoppingsentences: 'Shopping 購物',
        homesentences: 'Home 屋企',
        playgroundsentences: 'Playground 公園',
        partysentences: 'Party 派對',
        travelsentences: 'Travel 旅行',
        craftingsentences: 'Crafting 做手工'
    };

    return categoryNames[category] || category;
}

// ==================== SEARCH FUNCTIONS ====================

/**
 * Perform search with query
 * @param {string} query - Search query
 * @returns {Array} Search results
 */
function search(query) {
    if (!query || query.length < 1) {
        return [];
    }

    const normalizedQuery = query.toLowerCase().trim();

    // Search in Chinese, Jyutping, and English
    const results = searchIndex.filter(item => {
        return (
            item.chinese.includes(query) ||
            item.jyutping.toLowerCase().includes(normalizedQuery) ||
            item.english.toLowerCase().includes(normalizedQuery)
        );
    });

    // Sort by relevance
    results.sort((a, b) => {
        // Exact Chinese match first
        if (a.chinese === query && b.chinese !== query) return -1;
        if (b.chinese === query && a.chinese !== query) return 1;

        // Chinese starts with query
        if (a.chinese.startsWith(query) && !b.chinese.startsWith(query)) return -1;
        if (b.chinese.startsWith(query) && !a.chinese.startsWith(query)) return 1;

        // English starts with query
        if (a.english.toLowerCase().startsWith(normalizedQuery) && !b.english.toLowerCase().startsWith(normalizedQuery)) return -1;
        if (b.english.toLowerCase().startsWith(normalizedQuery) && !a.english.toLowerCase().startsWith(normalizedQuery)) return 1;

        return 0;
    });

    // Limit results
    return results.slice(0, 20);
}

/**
 * Highlight matching text in result
 * @param {string} text - Original text
 * @param {string} query - Search query
 * @returns {string} HTML with highlighted matches
 */
function highlightMatch(text, query) {
    if (!query) return text;

    const regex = new RegExp(`(${escapeRegex(query)})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
}

/**
 * Escape special regex characters
 * @param {string} string
 * @returns {string}
 */
function escapeRegex(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// ==================== UI FUNCTIONS ====================

/**
 * Initialize search UI
 */
function initSearchUI() {
    const searchContainer = document.querySelector('.search-container');
    const searchInput = document.getElementById('globalSearch');
    const searchResults = document.querySelector('.search-results');

    if (!searchInput || !searchResults) {
        console.warn('Search elements not found');
        return;
    }

    // Debounced search handler
    let searchTimeout;
    searchInput.addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            const query = e.target.value.trim();
            if (query.length >= 1) {
                showSearchResults(query);
            } else {
                hideSearchResults();
            }
        }, 200);
    });

    // Focus event
    searchInput.addEventListener('focus', () => {
        const query = searchInput.value.trim();
        if (query.length >= 1) {
            showSearchResults(query);
        }
    });

    // Hide results on blur (with delay to allow clicks)
    searchInput.addEventListener('blur', () => {
        setTimeout(hideSearchResults, 200);
    });

    // Keyboard navigation
    searchInput.addEventListener('keydown', (e) => {
        if (!searchResultsVisible) return;

        const items = searchResults.querySelectorAll('.search-result-item');
        const currentIndex = Array.from(items).findIndex(item => item.classList.contains('focused'));

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                if (currentIndex < items.length - 1) {
                    items[currentIndex]?.classList.remove('focused');
                    items[currentIndex + 1]?.classList.add('focused');
                    items[currentIndex + 1]?.scrollIntoView({ block: 'nearest' });
                } else if (currentIndex === -1 && items.length > 0) {
                    items[0].classList.add('focused');
                }
                break;

            case 'ArrowUp':
                e.preventDefault();
                if (currentIndex > 0) {
                    items[currentIndex].classList.remove('focused');
                    items[currentIndex - 1].classList.add('focused');
                    items[currentIndex - 1].scrollIntoView({ block: 'nearest' });
                }
                break;

            case 'Enter':
                e.preventDefault();
                const focused = searchResults.querySelector('.search-result-item.focused');
                if (focused) {
                    focused.click();
                } else if (items.length > 0) {
                    items[0].click();
                }
                break;

            case 'Escape':
                hideSearchResults();
                searchInput.blur();
                break;
        }
    });
}

/**
 * Show search results
 * @param {string} query
 */
function showSearchResults(query) {
    const searchResults = document.querySelector('.search-results');
    if (!searchResults) return;

    const results = search(query);

    if (results.length === 0) {
        searchResults.innerHTML = `
            <div class="search-no-results">
                <p>No results found for "${query}"</p>
                <p style="font-size: 0.8rem; margin-top: 5px;">Try searching in Chinese, Jyutping, or English</p>
            </div>
        `;
    } else {
        searchResults.innerHTML = results.map(item => `
            <div class="search-result-item" onclick="selectSearchResult('${item.category}', '${item.chinese}')" data-category="${item.category}">
                <div class="search-result-icon">${item.icon}</div>
                <div class="search-result-text">
                    <div class="search-result-chinese">${highlightMatch(item.chinese, query)}</div>
                    <div class="search-result-jyutping">${highlightMatch(item.jyutping, query)}</div>
                    <div class="search-result-english">${highlightMatch(item.english, query)}</div>
                </div>
                <div class="search-result-category">${item.categoryDisplay.split(' ')[0]}</div>
            </div>
        `).join('');
    }

    searchResults.classList.add('active');
    searchResultsVisible = true;
}

/**
 * Hide search results
 */
function hideSearchResults() {
    const searchResults = document.querySelector('.search-results');
    if (searchResults) {
        searchResults.classList.remove('active');
        searchResultsVisible = false;
    }
}

/**
 * Select a search result
 * @param {string} category - Category to navigate to
 * @param {string} chinese - Chinese text for reference
 */
function selectSearchResult(category, chinese) {
    // Clear search
    const searchInput = document.getElementById('globalSearch');
    if (searchInput) {
        searchInput.value = '';
    }
    hideSearchResults();

    // Navigate to category
    if (typeof switchTab === 'function') {
        switchTab(category);
    }

    // Try to find and highlight the specific card
    setTimeout(() => {
        const cards = document.querySelectorAll(`#${category} .card`);
        cards.forEach(card => {
            const cardChinese = card.querySelector('.card-chinese');
            if (cardChinese && cardChinese.textContent.trim() === chinese) {
                // Scroll to card
                card.scrollIntoView({ behavior: 'smooth', block: 'center' });

                // Highlight temporarily
                card.style.transform = 'scale(1.05)';
                card.style.boxShadow = '0 8px 30px rgba(78, 205, 196, 0.6)';
                card.style.border = '3px solid var(--accent)';

                setTimeout(() => {
                    card.style.transform = '';
                    card.style.boxShadow = '';
                    card.style.border = '';
                }, 2000);

                // Play the audio
                if (typeof playSound === 'function') {
                    const jyutping = card.querySelector('.card-pinyin')?.textContent || '';
                    playSound(chinese, jyutping);
                }
            }
        });
    }, 300);
}

// ==================== ALTERNATIVE INDEX BUILDING ====================

/**
 * Build search index from DOM if vocabulary data isn't available
 * This scrapes the existing cards from the page
 */
function buildSearchIndexFromDOM() {
    searchIndex = [];

    const contents = document.querySelectorAll('.content');

    contents.forEach(content => {
        const category = content.id;
        const cards = content.querySelectorAll('.card');

        cards.forEach(card => {
            const chinese = card.querySelector('.card-chinese')?.textContent?.trim();
            const jyutping = card.querySelector('.card-pinyin')?.textContent?.trim();
            const english = card.querySelector('.card-english')?.textContent?.trim();
            const icon = card.querySelector('.card-icon')?.textContent?.trim();

            if (chinese && jyutping && english) {
                searchIndex.push({
                    chinese: chinese,
                    jyutping: jyutping,
                    english: english,
                    icon: icon || '📝',
                    category: category,
                    categoryDisplay: getCategoryDisplayName(category)
                });
            }
        });
    });

    console.log(`Search index built from DOM with ${searchIndex.length} words`);
}

// ==================== INITIALIZATION ====================

/**
 * Initialize search module
 */
function initSearch() {
    // Build search index
    if (typeof vocabularyData !== 'undefined') {
        buildSearchIndex();
    } else {
        // Wait for DOM to be fully loaded, then scrape
        setTimeout(buildSearchIndexFromDOM, 500);
    }

    // Initialize UI
    initSearchUI();
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSearch);
} else {
    initSearch();
}

// Export for use in other modules
window.CantoneseSearch = {
    search,
    buildSearchIndex,
    buildSearchIndexFromDOM,
    showSearchResults,
    hideSearchResults,
    selectSearchResult,
    searchIndex
};

// Also export individual functions
window.search = search;
window.selectSearchResult = selectSearchResult;
