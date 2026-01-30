/**
 * ==================== PROFILE MODULE ====================
 * User management and localStorage handling for Cantonese Playground
 * Includes: Profile CRUD, progress tracking, data export/import
 * ================================================================
 */

// ==================== CONSTANTS ====================

const STORAGE_KEY = 'cantonesePlayground_userData';

const AVATARS = ['👧', '👦', '🧒', '👶', '🐰', '🐱', '🐶', '🐼', '🦊', '🐻', '🐨', '🐯'];

const defaultUserData = {
    name: '',
    avatar: '👧',
    createdAt: null,
    lastVisit: null,
    totalVisits: 0,
    sectionsVisited: {},
    wordsLearned: {},
    testScores: {
        test1: {},
        test2: {},
        beginner: {},
        intermediate: {},
        advanced: {}
    },
    favorites: [],
    streak: {
        current: 0,
        longest: 0,
        lastPracticeDate: null
    },
    wordDifficulty: {}, // For spaced repetition
    settings: {
        speechRate: 0.8,
        theme: 'light'
    }
};

// ==================== STORAGE FUNCTIONS ====================

/**
 * Check if localStorage is available
 * @returns {boolean}
 */
function hasStorage() {
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
 * Get user data from localStorage
 * @returns {Object|null}
 */
function getUserData() {
    if (!hasStorage()) return null;

    try {
        const data = localStorage.getItem(STORAGE_KEY);
        if (data) {
            const parsed = JSON.parse(data);
            // Merge with defaults to ensure all fields exist
            return { ...defaultUserData, ...parsed };
        }
        return null;
    } catch (e) {
        console.error('Error reading user data:', e);
        return null;
    }
}

/**
 * Save user data to localStorage
 * @param {Object} userData
 * @returns {boolean} Success status
 */
function saveUserData(userData) {
    if (!hasStorage()) {
        console.warn('localStorage not available');
        return false;
    }

    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
        updateProfileButton();
        return true;
    } catch (e) {
        if (e.name === 'QuotaExceededError') {
            console.warn('Storage quota exceeded');
            showStorageWarning();
        } else {
            console.error('Error saving user data:', e);
        }
        return false;
    }
}

/**
 * Show storage quota warning
 */
function showStorageWarning() {
    const warning = document.createElement('div');
    warning.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: #FF9800;
        color: white;
        padding: 15px 25px;
        border-radius: 10px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.2);
        z-index: 9999;
        font-size: 0.95rem;
        max-width: 90%;
        text-align: center;
    `;
    warning.innerHTML = '⚠️ Storage is almost full. Consider exporting and clearing old data.';
    document.body.appendChild(warning);

    setTimeout(() => {
        warning.style.opacity = '0';
        warning.style.transition = 'opacity 0.5s';
        setTimeout(() => warning.remove(), 500);
    }, 5000);
}

// ==================== PROFILE MODAL ====================

/**
 * Open profile modal
 */
function openProfileModal() {
    const modal = document.getElementById('profileModal');
    const content = document.getElementById('profileContent');

    if (!modal || !content) return;

    const userData = getUserData();

    if (userData && userData.name) {
        // Show profile dashboard
        content.innerHTML = renderProfileDashboard(userData);
    } else {
        // Show sign up / create profile form
        content.innerHTML = renderSignUpForm();
    }

    modal.style.display = 'flex';

    // Trap focus for accessibility
    if (typeof focusManager !== 'undefined') {
        focusManager.trapFocus(modal);
    }
}

/**
 * Close profile modal
 */
function closeProfileModal() {
    const modal = document.getElementById('profileModal');
    if (modal) {
        modal.style.display = 'none';
    }

    // Restore focus for accessibility
    if (typeof focusManager !== 'undefined') {
        focusManager.restoreFocus();
    }
}

/**
 * Render sign up form
 * @returns {string} HTML string
 */
function renderSignUpForm() {
    return `
        <div class="profile-header">
            <div class="profile-avatar-large">🎉</div>
            <h2 style="font-family: var(--font-display); color: var(--primary);">Welcome!</h2>
            <p style="color: var(--text);">Create your profile to track your learning progress</p>
        </div>

        <input type="text" id="signupName" class="profile-input" placeholder="Enter your name" maxlength="20" aria-label="Your name">

        <p style="text-align: center; margin: 15px 0 10px; font-weight: 600;">Choose your avatar:</p>
        <div class="avatar-picker" id="avatarPicker" role="radiogroup" aria-label="Choose avatar">
            ${AVATARS.map((avatar, i) => `
                <span class="avatar-option ${i === 0 ? 'selected' : ''}"
                      onclick="selectAvatar('${avatar}')"
                      data-avatar="${avatar}"
                      role="radio"
                      aria-checked="${i === 0}"
                      tabindex="${i === 0 ? 0 : -1}">${avatar}</span>
            `).join('')}
        </div>

        <button class="profile-btn profile-btn-primary" onclick="createProfile()">
            🚀 Start Learning!
        </button>
    `;
}

/**
 * Select avatar
 * @param {string} avatar - Emoji avatar
 */
function selectAvatar(avatar) {
    document.querySelectorAll('.avatar-option').forEach(el => {
        el.classList.remove('selected');
        el.setAttribute('aria-checked', 'false');
        el.setAttribute('tabindex', '-1');
        if (el.dataset.avatar === avatar) {
            el.classList.add('selected');
            el.setAttribute('aria-checked', 'true');
            el.setAttribute('tabindex', '0');
        }
    });
}

/**
 * Create new profile
 */
function createProfile() {
    const nameInput = document.getElementById('signupName');
    const name = nameInput ? nameInput.value.trim() : '';
    const selectedAvatar = document.querySelector('.avatar-option.selected');

    if (!name) {
        alert('Please enter your name!');
        if (nameInput) nameInput.focus();
        return;
    }

    const userData = {
        ...defaultUserData,
        name: name,
        avatar: selectedAvatar ? selectedAvatar.dataset.avatar : '👧',
        createdAt: new Date().toISOString(),
        lastVisit: new Date().toISOString(),
        totalVisits: 1
    };

    if (saveUserData(userData)) {
        if (typeof showCelebration === 'function') {
            showCelebration('🎉');
        }

        // Refresh modal to show dashboard
        setTimeout(() => {
            openProfileModal();
        }, 500);
    }
}

/**
 * Render profile dashboard
 * @param {Object} userData
 * @returns {string} HTML string
 */
function renderProfileDashboard(userData) {
    const totalSections = Object.keys(userData.sectionsVisited).length;
    const totalWords = Object.keys(userData.wordsLearned).length;
    const test1Scores = Object.values(userData.testScores.test1);
    const test2Scores = Object.values(userData.testScores.test2);
    const avgTest1 = test1Scores.length > 0 ? Math.round(test1Scores.reduce((a, b) => a + b, 0) / test1Scores.length) : 0;
    const avgTest2 = test2Scores.length > 0 ? Math.round(test2Scores.reduce((a, b) => a + b, 0) / test2Scores.length) : 0;

    // Calculate section progress
    const learnWordsSections = ['manners', 'numbers', 'animals', 'colors', 'foods', 'weather', 'clothing', 'sports', 'body', 'places', 'occupations', 'hobbies', 'dailyactivities', 'family', 'transport', 'emotions', 'nature'];
    const holidaySections = ['lunarnewyear', 'easter', 'dragonboat', 'canadaday', 'midautumn', 'thanksgiving', 'halloween', 'christmas'];
    const jyutpingSections = ['consonanttable', 'voweltable', 'tonetable', 'vowelcomparison'];
    const connectionsSections = ['quantitywords', 'pronouns', 'verbs', 'adjectives', 'expresswords', 'questions', 'linkingwords'];
    const sentencesSections = ['introduction', 'schoolsentences', 'restaurantsentences', 'shoppingsentences', 'homesentences', 'playgroundsentences', 'partysentences', 'travelsentences', 'craftingsentences'];

    const calcProgress = (sections) => {
        const visited = sections.filter(s => userData.sectionsVisited[s]).length;
        return Math.round((visited / sections.length) * 100);
    };

    // Streak display
    const streakHtml = userData.streak && userData.streak.current > 0 ? `
        <div class="streak-display">
            <span class="streak-fire">🔥</span>
            <span class="streak-count">${userData.streak.current} day streak!</span>
        </div>
    ` : '';

    return `
        <div class="profile-header">
            <div class="profile-avatar-large">${userData.avatar}</div>
            <h2 style="font-family: var(--font-display); color: var(--primary);">Hi, ${userData.name}! 👋</h2>
            <p style="color: var(--text); font-size: 0.9rem;">Learning since ${new Date(userData.createdAt).toLocaleDateString()}</p>
        </div>

        ${streakHtml}

        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-number">${userData.totalVisits}</div>
                <div class="stat-label">Total Visits</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">${totalSections}</div>
                <div class="stat-label">Sections Explored</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">${totalWords}</div>
                <div class="stat-label">Words Practiced</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">${avgTest1 || avgTest2 ? Math.round((avgTest1 + avgTest2) / 2) : 0}%</div>
                <div class="stat-label">Avg Test Score</div>
            </div>
        </div>

        <div class="section-title">📚 Learning Progress</div>
        <div class="progress-section">
            ${renderProgressBar('Learn Words', calcProgress(learnWordsSections))}
            ${renderProgressBar('Holidays', calcProgress(holidaySections))}
            ${renderProgressBar('Jyutping', calcProgress(jyutpingSections))}
            ${renderProgressBar('Connections', calcProgress(connectionsSections))}
            ${renderProgressBar('Sentences', calcProgress(sentencesSections))}
        </div>

        <div class="section-title">📝 Test Scores</div>
        <div class="progress-section">
            ${renderTestScores(userData.testScores.test1, 'Test 1', ['Manners', 'Numbers', 'Animals', 'Foods', 'Weather', 'Body', 'Activities', 'Holidays', 'Emotions', 'Family'])}
            ${renderTestScores(userData.testScores.test2, 'Test 2', ['Express', 'Questions', 'Linking', 'Intro', 'School', 'Restaurant', 'Shopping', 'Home'])}
        </div>

        <div class="section-title">⚙️ Data Management</div>
        <div style="display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 15px;">
            <button class="profile-btn profile-btn-secondary" onclick="exportProgressData()" style="flex: 1; min-width: 120px;">
                📤 Export Data
            </button>
            <button class="profile-btn profile-btn-secondary" onclick="showImportDialog()" style="flex: 1; min-width: 120px;">
                📥 Import Data
            </button>
        </div>

        <div style="margin-top: 20px;">
            <button class="profile-btn profile-btn-secondary" onclick="editProfile()">
                ✏️ Edit Profile
            </button>
            <button class="profile-btn profile-btn-danger" onclick="confirmResetProgress()">
                🗑️ Reset Progress
            </button>
        </div>
    `;
}

/**
 * Render a progress bar item
 * @param {string} label
 * @param {number} percent
 * @returns {string} HTML string
 */
function renderProgressBar(label, percent) {
    return `
        <div class="progress-item">
            <span class="progress-label">${label}</span>
            <div class="progress-bar-container">
                <div class="progress-bar-fill" style="width: ${percent}%"></div>
            </div>
            <span class="progress-percent">${percent}%</span>
        </div>
    `;
}

/**
 * Render test scores
 * @param {Object} scores
 * @param {string} testName
 * @param {Array} sectionNames
 * @returns {string} HTML string
 */
function renderTestScores(scores, testName, sectionNames) {
    if (!scores || Object.keys(scores).length === 0) {
        return `<p style="color: var(--text-muted); font-size: 0.9rem;">${testName}: No tests taken yet</p>`;
    }

    return Object.entries(scores).map(([section, score]) => `
        <div class="progress-item">
            <span class="progress-label">${sectionNames[parseInt(section)] || 'Section ' + (parseInt(section) + 1)}</span>
            <div class="progress-bar-container">
                <div class="progress-bar-fill" style="width: ${score}%; background: ${score >= 80 ? 'linear-gradient(90deg, #28a745, #20c997)' : score >= 60 ? 'linear-gradient(90deg, var(--secondary), var(--orange))' : 'linear-gradient(90deg, #dc3545, #c82333)'}"></div>
            </div>
            <span class="progress-percent" style="color: ${score >= 80 ? '#28a745' : score >= 60 ? 'var(--orange)' : '#dc3545'}">${score}%</span>
        </div>
    `).join('');
}

// ==================== EDIT PROFILE ====================

/**
 * Edit profile form
 */
function editProfile() {
    const userData = getUserData();
    if (!userData) return;

    const content = document.getElementById('profileContent');
    if (!content) return;

    content.innerHTML = `
        <div class="profile-header">
            <div class="profile-avatar-large">${userData.avatar}</div>
            <h2 style="font-family: var(--font-display); color: var(--primary);">Edit Profile</h2>
        </div>

        <input type="text" id="editName" class="profile-input" placeholder="Enter your name" value="${userData.name}" maxlength="20">

        <p style="text-align: center; margin: 15px 0 10px; font-weight: 600;">Choose your avatar:</p>
        <div class="avatar-picker" id="avatarPicker">
            ${AVATARS.map(avatar => `
                <span class="avatar-option ${avatar === userData.avatar ? 'selected' : ''}" onclick="selectAvatar('${avatar}')" data-avatar="${avatar}">${avatar}</span>
            `).join('')}
        </div>

        <button class="profile-btn profile-btn-primary" onclick="saveProfileChanges()">
            💾 Save Changes
        </button>
        <button class="profile-btn profile-btn-secondary" onclick="openProfileModal()">
            ← Back
        </button>
    `;
}

/**
 * Save profile changes
 */
function saveProfileChanges() {
    const userData = getUserData();
    if (!userData) return;

    const nameInput = document.getElementById('editName');
    const name = nameInput ? nameInput.value.trim() : '';
    const selectedAvatar = document.querySelector('.avatar-option.selected');

    if (!name) {
        alert('Please enter your name!');
        return;
    }

    userData.name = name;
    userData.avatar = selectedAvatar ? selectedAvatar.dataset.avatar : userData.avatar;

    if (saveUserData(userData)) {
        if (typeof showCelebration === 'function') {
            showCelebration('✅');
        }
        openProfileModal();
    }
}

/**
 * Confirm reset progress
 */
function confirmResetProgress() {
    if (confirm('Are you sure you want to reset all your progress? This cannot be undone!')) {
        localStorage.removeItem(STORAGE_KEY);
        updateProfileButton();
        closeProfileModal();
        if (typeof showCelebration === 'function') {
            showCelebration('🔄');
        }
    }
}

// ==================== TRACKING FUNCTIONS ====================

/**
 * Track section visit
 * @param {string} sectionName
 */
function trackSectionVisit(sectionName) {
    const userData = getUserData();
    if (userData) {
        userData.sectionsVisited[sectionName] = true;
        userData.lastVisit = new Date().toISOString();
        updateStreak(userData);
        saveUserData(userData);
    }
}

/**
 * Track word learned (when play button is clicked)
 * @param {string} word
 */
function trackWordLearned(word) {
    const userData = getUserData();
    if (userData) {
        if (!userData.wordsLearned[word]) {
            userData.wordsLearned[word] = 0;
        }
        userData.wordsLearned[word]++;
        saveUserData(userData);
    }
}

/**
 * Track test score
 * @param {string} testType - 'test1', 'test2', 'beginner', 'intermediate', 'advanced'
 * @param {number|string} sectionIndex
 * @param {number} score - Percentage score
 */
function trackTestScore(testType, sectionIndex, score) {
    const userData = getUserData();
    if (userData) {
        if (!userData.testScores[testType]) {
            userData.testScores[testType] = {};
        }
        userData.testScores[testType][sectionIndex] = score;
        saveUserData(userData);
    }
}

/**
 * Update visit count on page load
 */
function updateVisitCount() {
    const userData = getUserData();
    if (userData) {
        userData.totalVisits++;
        userData.lastVisit = new Date().toISOString();
        updateStreak(userData);
        saveUserData(userData);
    }
}

// ==================== STREAK TRACKING ====================

/**
 * Update user's practice streak
 * @param {Object} userData
 */
function updateStreak(userData) {
    if (!userData.streak) {
        userData.streak = { current: 0, longest: 0, lastPracticeDate: null };
    }

    const today = new Date().toDateString();
    const lastPractice = userData.streak.lastPracticeDate;

    if (lastPractice === today) {
        // Already practiced today
        return;
    }

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toDateString();

    if (lastPractice === yesterdayStr) {
        // Practiced yesterday, continue streak
        userData.streak.current++;
    } else if (!lastPractice) {
        // First time
        userData.streak.current = 1;
    } else {
        // Streak broken
        userData.streak.current = 1;
    }

    userData.streak.lastPracticeDate = today;

    // Update longest streak
    if (userData.streak.current > userData.streak.longest) {
        userData.streak.longest = userData.streak.current;

        // Celebrate milestone streaks
        if (userData.streak.current % 7 === 0) {
            setTimeout(() => {
                if (typeof showCelebration === 'function') {
                    showCelebration('🔥');
                }
            }, 1000);
        }
    }
}

// ==================== DATA EXPORT/IMPORT ====================

/**
 * Export user progress data as JSON file
 */
function exportProgressData() {
    const userData = getUserData();
    if (!userData) {
        alert('No data to export!');
        return;
    }

    const exportData = {
        version: '1.0',
        exportDate: new Date().toISOString(),
        data: userData
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `cantonese-playground-progress-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    if (typeof showCelebration === 'function') {
        showCelebration('📤');
    }
}

/**
 * Show import dialog
 */
function showImportDialog() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';

    input.onchange = (e) => {
        const file = e.target.files[0];
        if (file) {
            importProgressData(file);
        }
    };

    input.click();
}

/**
 * Import progress data from JSON file
 * @param {File} file
 */
function importProgressData(file) {
    const reader = new FileReader();

    reader.onload = (e) => {
        try {
            const importData = JSON.parse(e.target.result);

            // Validate structure
            if (!importData.data || !importData.data.name) {
                alert('Invalid data file format!');
                return;
            }

            // Confirm before overwriting
            const currentData = getUserData();
            if (currentData && currentData.name) {
                if (!confirm(`This will replace your current progress for "${currentData.name}" with data for "${importData.data.name}". Continue?`)) {
                    return;
                }
            }

            // Merge with defaults and save
            const mergedData = { ...defaultUserData, ...importData.data };
            mergedData.lastVisit = new Date().toISOString();

            if (saveUserData(mergedData)) {
                if (typeof showCelebration === 'function') {
                    showCelebration('📥');
                }
                openProfileModal();
            }

        } catch (err) {
            console.error('Import error:', err);
            alert('Error reading file. Please ensure it is a valid JSON export file.');
        }
    };

    reader.readAsText(file);
}

// ==================== UI UPDATES ====================

/**
 * Update profile button in header
 */
function updateProfileButton() {
    const avatarEl = document.getElementById('profileAvatar');
    const nameEl = document.getElementById('profileName');
    const userData = getUserData();

    if (avatarEl && nameEl) {
        if (userData && userData.name) {
            avatarEl.textContent = userData.avatar;
            nameEl.textContent = userData.name;
        } else {
            avatarEl.textContent = '👤';
            nameEl.textContent = 'Sign In';
        }
    }
}

// ==================== ABOUT MODAL ====================

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

// ==================== INITIALIZATION ====================

/**
 * Initialize profile module
 */
function initProfile() {
    updateProfileButton();
    updateVisitCount();

    // Close modal when clicking outside
    document.addEventListener('click', (e) => {
        const profileModal = document.getElementById('profileModal');
        if (e.target === profileModal) {
            closeProfileModal();
        }

        const aboutModal = document.getElementById('aboutModal');
        if (e.target === aboutModal) {
            closeAboutModal();
        }
    });
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initProfile);
} else {
    initProfile();
}

// Export for use in other modules
window.CantoneseProfile = {
    getUserData,
    saveUserData,
    openProfileModal,
    closeProfileModal,
    createProfile,
    editProfile,
    trackSectionVisit,
    trackWordLearned,
    trackTestScore,
    updateVisitCount,
    exportProgressData,
    importProgressData,
    updateProfileButton,
    AVATARS,
    defaultUserData
};

// Also export individual functions for backward compatibility
window.getUserData = getUserData;
window.saveUserData = saveUserData;
window.openProfileModal = openProfileModal;
window.closeProfileModal = closeProfileModal;
window.createProfile = createProfile;
window.selectAvatar = selectAvatar;
window.editProfile = editProfile;
window.saveProfileChanges = saveProfileChanges;
window.confirmResetProgress = confirmResetProgress;
window.trackSectionVisit = trackSectionVisit;
window.trackWordLearned = trackWordLearned;
window.trackTestScore = trackTestScore;
window.updateVisitCount = updateVisitCount;
window.openAboutModal = openAboutModal;
window.closeAboutModal = closeAboutModal;
window.exportProgressData = exportProgressData;
window.showImportDialog = showImportDialog;
