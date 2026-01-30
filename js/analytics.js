/**
 * ==================== ANALYTICS MODULE ====================
 * Progress tracking and spaced repetition for Cantonese Playground
 * Includes: Learning analytics, word difficulty tracking, streak system
 * ================================================================
 */

// ==================== SPACED REPETITION ====================

/**
 * Calculate word difficulty based on performance
 * Uses a simplified SM-2 algorithm
 */
const spacedRepetition = {
    /**
     * Update word difficulty based on answer
     * @param {string} word - Chinese word
     * @param {boolean} correct - Whether answer was correct
     */
    updateDifficulty(word, correct) {
        const userData = typeof getUserData === 'function' ? getUserData() : null;
        if (!userData) return;

        if (!userData.wordDifficulty) {
            userData.wordDifficulty = {};
        }

        if (!userData.wordDifficulty[word]) {
            userData.wordDifficulty[word] = {
                easeFactor: 2.5,
                interval: 1,
                repetitions: 0,
                nextReview: new Date().toISOString(),
                history: []
            };
        }

        const wordData = userData.wordDifficulty[word];

        // Record history
        wordData.history.push({
            date: new Date().toISOString(),
            correct: correct
        });

        // Keep only last 20 attempts
        if (wordData.history.length > 20) {
            wordData.history = wordData.history.slice(-20);
        }

        if (correct) {
            // Correct answer - increase interval
            wordData.repetitions++;

            if (wordData.repetitions === 1) {
                wordData.interval = 1;
            } else if (wordData.repetitions === 2) {
                wordData.interval = 6;
            } else {
                wordData.interval = Math.round(wordData.interval * wordData.easeFactor);
            }

            // Increase ease factor
            wordData.easeFactor = Math.min(wordData.easeFactor + 0.1, 3.0);
        } else {
            // Incorrect answer - reset interval and decrease ease factor
            wordData.repetitions = 0;
            wordData.interval = 1;
            wordData.easeFactor = Math.max(wordData.easeFactor - 0.2, 1.3);
        }

        // Calculate next review date
        const nextReview = new Date();
        nextReview.setDate(nextReview.getDate() + wordData.interval);
        wordData.nextReview = nextReview.toISOString();

        if (typeof saveUserData === 'function') {
            saveUserData(userData);
        }
    },

    /**
     * Get words that need review
     * @returns {Array} Array of words due for review
     */
    getWordsToReview() {
        const userData = typeof getUserData === 'function' ? getUserData() : null;
        if (!userData || !userData.wordDifficulty) return [];

        const now = new Date();
        const wordsToReview = [];

        Object.entries(userData.wordDifficulty).forEach(([word, data]) => {
            const nextReview = new Date(data.nextReview);
            if (nextReview <= now) {
                wordsToReview.push({
                    word: word,
                    ...data,
                    daysOverdue: Math.floor((now - nextReview) / (1000 * 60 * 60 * 24))
                });
            }
        });

        // Sort by most overdue first
        wordsToReview.sort((a, b) => b.daysOverdue - a.daysOverdue);

        return wordsToReview;
    },

    /**
     * Get difficult words (low ease factor)
     * @param {number} limit - Maximum number to return
     * @returns {Array}
     */
    getDifficultWords(limit = 10) {
        const userData = typeof getUserData === 'function' ? getUserData() : null;
        if (!userData || !userData.wordDifficulty) return [];

        const words = Object.entries(userData.wordDifficulty)
            .map(([word, data]) => ({
                word: word,
                ...data,
                accuracy: this.calculateAccuracy(data.history)
            }))
            .filter(w => w.history.length >= 3) // Only words attempted at least 3 times
            .sort((a, b) => a.accuracy - b.accuracy);

        return words.slice(0, limit);
    },

    /**
     * Calculate accuracy percentage
     * @param {Array} history
     * @returns {number}
     */
    calculateAccuracy(history) {
        if (!history || history.length === 0) return 100;
        const correct = history.filter(h => h.correct).length;
        return Math.round((correct / history.length) * 100);
    }
};

// ==================== LEARNING ANALYTICS ====================

const learningAnalytics = {
    /**
     * Get overall learning statistics
     * @returns {Object}
     */
    getStats() {
        const userData = typeof getUserData === 'function' ? getUserData() : null;
        if (!userData) return null;

        const wordsLearned = Object.keys(userData.wordsLearned || {}).length;
        const totalPractices = Object.values(userData.wordsLearned || {}).reduce((a, b) => a + b, 0);
        const sectionsVisited = Object.keys(userData.sectionsVisited || {}).length;

        // Calculate test performance
        const allTestScores = [
            ...Object.values(userData.testScores?.test1 || {}),
            ...Object.values(userData.testScores?.test2 || {}),
            ...Object.values(userData.testScores?.beginner || {}),
            ...Object.values(userData.testScores?.intermediate || {}),
            ...Object.values(userData.testScores?.advanced || {})
        ];

        const avgTestScore = allTestScores.length > 0
            ? Math.round(allTestScores.reduce((a, b) => a + b, 0) / allTestScores.length)
            : 0;

        // Words to review
        const wordsToReview = spacedRepetition.getWordsToReview().length;

        return {
            wordsLearned,
            totalPractices,
            sectionsVisited,
            totalTests: allTestScores.length,
            avgTestScore,
            wordsToReview,
            streak: userData.streak?.current || 0,
            longestStreak: userData.streak?.longest || 0,
            daysSinceStart: this.getDaysSinceStart(userData)
        };
    },

    /**
     * Get days since user started
     * @param {Object} userData
     * @returns {number}
     */
    getDaysSinceStart(userData) {
        if (!userData.createdAt) return 0;
        const start = new Date(userData.createdAt);
        const now = new Date();
        return Math.floor((now - start) / (1000 * 60 * 60 * 24));
    },

    /**
     * Get category progress
     * @returns {Object} Progress by category
     */
    getCategoryProgress() {
        const userData = typeof getUserData === 'function' ? getUserData() : null;
        if (!userData) return {};

        const categories = {
            'Learn Words': {
                sections: ['manners', 'numbers', 'animals', 'colors', 'foods', 'weather', 'clothing', 'sports', 'body', 'places', 'occupations', 'hobbies', 'dailyactivities', 'family', 'transport', 'emotions', 'nature'],
                color: '#FF6B9D'
            },
            'Holidays': {
                sections: ['lunarnewyear', 'easter', 'dragonboat', 'canadaday', 'midautumn', 'thanksgiving', 'halloween', 'christmas'],
                color: '#FEC857'
            },
            'Jyutping': {
                sections: ['consonanttable', 'voweltable', 'tonetable', 'vowelcomparison'],
                color: '#4ECDC4'
            },
            'Connections': {
                sections: ['quantitywords', 'pronouns', 'verbs', 'adjectives', 'expresswords', 'questions', 'linkingwords'],
                color: '#C44DFF'
            },
            'Sentences': {
                sections: ['introduction', 'schoolsentences', 'restaurantsentences', 'shoppingsentences', 'homesentences', 'playgroundsentences', 'partysentences', 'travelsentences', 'craftingsentences'],
                color: '#4A90E2'
            },
            'Stories': {
                sections: ['story1', 'story2', 'story3', 'story4', 'story5', 'story6', 'story7', 'story8', 'story9', 'story10', 'story11', 'story12'],
                color: '#FF8A5B'
            }
        };

        const progress = {};

        Object.entries(categories).forEach(([name, data]) => {
            const visited = data.sections.filter(s => userData.sectionsVisited?.[s]).length;
            progress[name] = {
                visited,
                total: data.sections.length,
                percent: Math.round((visited / data.sections.length) * 100),
                color: data.color
            };
        });

        return progress;
    },

    /**
     * Get most practiced words
     * @param {number} limit
     * @returns {Array}
     */
    getMostPracticedWords(limit = 10) {
        const userData = typeof getUserData === 'function' ? getUserData() : null;
        if (!userData || !userData.wordsLearned) return [];

        return Object.entries(userData.wordsLearned)
            .map(([word, count]) => ({ word, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, limit);
    },

    /**
     * Get learning activity by day
     * @returns {Object} Activity counts by day
     */
    getActivityByDay() {
        const userData = typeof getUserData === 'function' ? getUserData() : null;
        if (!userData || !userData.wordDifficulty) return {};

        const activity = {};
        const today = new Date();

        // Last 7 days
        for (let i = 6; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().slice(0, 10);
            activity[dateStr] = 0;
        }

        // Count activities
        Object.values(userData.wordDifficulty).forEach(data => {
            if (data.history) {
                data.history.forEach(h => {
                    const dateStr = h.date.slice(0, 10);
                    if (activity.hasOwnProperty(dateStr)) {
                        activity[dateStr]++;
                    }
                });
            }
        });

        return activity;
    }
};

// ==================== ANALYTICS DASHBOARD UI ====================

/**
 * Render analytics dashboard
 * @returns {string} HTML string
 */
function renderAnalyticsDashboard() {
    const stats = learningAnalytics.getStats();
    const categoryProgress = learningAnalytics.getCategoryProgress();
    const mostPracticed = learningAnalytics.getMostPracticedWords(5);
    const difficultWords = spacedRepetition.getDifficultWords(5);
    const wordsToReview = spacedRepetition.getWordsToReview();
    const activityByDay = learningAnalytics.getActivityByDay();

    if (!stats) {
        return '<p style="text-align: center; color: var(--text-muted);">No analytics data available yet. Start learning to see your progress!</p>';
    }

    // Activity chart
    const maxActivity = Math.max(...Object.values(activityByDay), 1);
    const activityChartHtml = `
        <div class="analytics-chart">
            <h4 style="margin-bottom: 10px; color: var(--text);">This Week's Activity</h4>
            <div class="bar-chart">
                ${Object.entries(activityByDay).map(([date, count]) => `
                    <div class="bar" style="height: ${(count / maxActivity) * 100}%">
                        <span class="bar-value">${count}</span>
                        <span class="bar-label">${new Date(date).toLocaleDateString('en', { weekday: 'short' })}</span>
                    </div>
                `).join('')}
            </div>
        </div>
    `;

    // Category progress bars
    const categoryProgressHtml = Object.entries(categoryProgress).map(([name, data]) => `
        <div class="category-progress">
            <div class="category-progress-label">
                <span>${name}</span>
                <span style="color: var(--text-muted);">${data.visited}/${data.total}</span>
            </div>
            <div class="category-progress-bar">
                <div class="category-progress-fill" style="width: ${data.percent}%; background: ${data.color};"></div>
            </div>
        </div>
    `).join('');

    // Words to review section
    const reviewHtml = wordsToReview.length > 0 ? `
        <div class="section-title">📚 Words to Review (${wordsToReview.length})</div>
        <div style="display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 20px;">
            ${wordsToReview.slice(0, 10).map(w => `
                <span style="background: rgba(255, 107, 157, 0.15); color: var(--primary); padding: 5px 12px; border-radius: 15px; font-size: 0.9rem;">
                    ${w.word} ${w.daysOverdue > 0 ? `<small>(${w.daysOverdue}d overdue)</small>` : ''}
                </span>
            `).join('')}
            ${wordsToReview.length > 10 ? `<span style="color: var(--text-muted);">+${wordsToReview.length - 10} more</span>` : ''}
        </div>
    ` : '';

    // Difficult words section
    const difficultHtml = difficultWords.length > 0 ? `
        <div class="section-title">💪 Practice These Words</div>
        <div style="display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 20px;">
            ${difficultWords.map(w => `
                <span style="background: rgba(245, 101, 101, 0.15); color: #dc3545; padding: 5px 12px; border-radius: 15px; font-size: 0.9rem;">
                    ${w.word} <small>(${w.accuracy}%)</small>
                </span>
            `).join('')}
        </div>
    ` : '';

    return `
        <div class="section-title">📊 Learning Overview</div>
        <div class="stats-grid" style="margin-bottom: 20px;">
            <div class="stat-card">
                <div class="stat-number">${stats.wordsLearned}</div>
                <div class="stat-label">Words Learned</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">${stats.totalPractices}</div>
                <div class="stat-label">Total Practices</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">${stats.avgTestScore}%</div>
                <div class="stat-label">Avg Test Score</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">${stats.daysSinceStart}</div>
                <div class="stat-label">Days Learning</div>
            </div>
        </div>

        ${activityChartHtml}

        <div class="section-title">📈 Category Progress</div>
        ${categoryProgressHtml}

        ${reviewHtml}
        ${difficultHtml}

        ${mostPracticed.length > 0 ? `
            <div class="section-title">⭐ Most Practiced Words</div>
            <div style="display: flex; flex-wrap: wrap; gap: 8px;">
                ${mostPracticed.map((w, i) => `
                    <span style="background: rgba(78, 205, 196, 0.15); color: var(--accent); padding: 5px 12px; border-radius: 15px; font-size: 0.9rem;">
                        ${i + 1}. ${w.word} <small>(${w.count}x)</small>
                    </span>
                `).join('')}
            </div>
        ` : ''}
    `;
}

// ==================== ADAPTIVE DIFFICULTY ====================

const adaptiveDifficulty = {
    /**
     * Get questions prioritized by difficulty
     * @param {Array} questions - Original questions array
     * @param {number} priorityRatio - Ratio of difficult questions (0-1)
     * @returns {Array} Reordered questions
     */
    prioritizeQuestions(questions, priorityRatio = 0.3) {
        const userData = typeof getUserData === 'function' ? getUserData() : null;
        if (!userData || !userData.wordDifficulty) return questions;

        // Score each question based on user's history
        const scoredQuestions = questions.map(q => {
            const wordData = userData.wordDifficulty[q.answer];
            let difficultyScore = 50; // Default middle difficulty

            if (wordData) {
                // Lower ease factor = harder for user
                difficultyScore = 100 - (wordData.easeFactor - 1.3) * 50;
                // Also consider accuracy
                const accuracy = spacedRepetition.calculateAccuracy(wordData.history);
                difficultyScore = (difficultyScore + (100 - accuracy)) / 2;
            }

            return { ...q, difficultyScore };
        });

        // Sort by difficulty (harder first)
        scoredQuestions.sort((a, b) => b.difficultyScore - a.difficultyScore);

        // Take priorityRatio of difficult questions
        const numPriority = Math.floor(questions.length * priorityRatio);
        const priorityQuestions = scoredQuestions.slice(0, numPriority);
        const otherQuestions = scoredQuestions.slice(numPriority);

        // Shuffle the other questions
        for (let i = otherQuestions.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [otherQuestions[i], otherQuestions[j]] = [otherQuestions[j], otherQuestions[i]];
        }

        // Interleave priority questions
        const result = [];
        let pIdx = 0, oIdx = 0;

        for (let i = 0; i < questions.length; i++) {
            // Insert a priority question every few questions
            if (pIdx < priorityQuestions.length && (i % 3 === 0 || oIdx >= otherQuestions.length)) {
                result.push(priorityQuestions[pIdx++]);
            } else if (oIdx < otherQuestions.length) {
                result.push(otherQuestions[oIdx++]);
            }
        }

        return result;
    },

    /**
     * Adjust test difficulty based on performance
     * @param {number} score - Current score percentage
     * @returns {string} Difficulty level: 'easier', 'same', 'harder'
     */
    getAdjustment(score) {
        if (score >= 90) return 'harder';
        if (score <= 50) return 'easier';
        return 'same';
    }
};

// ==================== INITIALIZATION ====================

/**
 * Initialize analytics module
 */
function initAnalytics() {
    // Export functions globally
    window.spacedRepetition = spacedRepetition;
    window.learningAnalytics = learningAnalytics;
    window.adaptiveDifficulty = adaptiveDifficulty;
    window.renderAnalyticsDashboard = renderAnalyticsDashboard;
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAnalytics);
} else {
    initAnalytics();
}

// Export for use in other modules
window.CantoneseAnalytics = {
    spacedRepetition,
    learningAnalytics,
    adaptiveDifficulty,
    renderAnalyticsDashboard
};
