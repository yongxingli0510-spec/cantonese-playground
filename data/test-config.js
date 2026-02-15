/**
 * ==================== TEST CONFIGURATION ====================
 * Test structure configuration for Cantonese Playground
 * 5 Tests with 32 total sections
 * Categories combined to ensure 20+ vocabulary items per section
 * ================================================================
 */

const testConfig = {
    // ==================== TEST 1: LEARN WORDS ====================
    test1: {
        id: 'test1',
        name: 'Learn Words',
        chineseName: '學詞語',
        icon: '📚',
        description: 'Basic vocabulary practice',
        questionsPerSection: 20,
        sections: [
            {
                id: '1.1',
                name: 'Manners & Numbers',
                chineseName: '禮貌與數字',
                icon: '🙏',
                categories: ['manners', 'numbers']
            },
            {
                id: '1.2',
                name: 'Colors & Family',
                chineseName: '顏色與家人',
                icon: '🎨',
                categories: ['colors', 'family']
            },
            {
                id: '1.3',
                name: 'Animals Part 1',
                chineseName: '動物 (上)',
                icon: '🦁',
                categories: ['animals'],
                categorySlice: [0, 18]
            },
            {
                id: '1.4',
                name: 'Animals Part 2',
                chineseName: '動物 (下)',
                icon: '🐠',
                categories: ['animals'],
                categorySlice: [18, 35]
            },
            {
                id: '1.5',
                name: 'Foods Part 1',
                chineseName: '食物 (上)',
                icon: '🍎',
                categories: ['foods'],
                categorySlice: [0, 15]
            },
            {
                id: '1.6',
                name: 'Foods Part 2 & Weather',
                chineseName: '食物與天氣',
                icon: '🌤️',
                categories: ['foods', 'weather'],
                categorySlice: { foods: [15, 28] }
            },
            {
                id: '1.7',
                name: 'Clothing & Sports',
                chineseName: '衫褲與運動',
                icon: '👕',
                categories: ['clothing', 'sports']
            },
            {
                id: '1.8',
                name: 'Body & Places',
                chineseName: '身體與地方',
                icon: '📍',
                categories: ['body', 'places']
            },
            {
                id: '1.9',
                name: 'Occupations & Hobbies',
                chineseName: '職業與興趣',
                icon: '💼',
                categories: ['occupations', 'hobbies']
            },
            {
                id: '1.10',
                name: 'Transport & Emotions',
                chineseName: '交通與情緒',
                icon: '🚌',
                categories: ['transport', 'emotions']
            },
            {
                id: '1.11',
                name: 'Nature & Shapes',
                chineseName: '自然與形狀',
                icon: '🌿',
                categories: ['nature', 'shapes']
            },
            {
                id: '1.12',
                name: 'Daily Life Review',
                chineseName: '日常生活複習',
                icon: '🌅',
                categories: ['dailyactivities', 'family', 'transport', 'emotions', 'nature', 'shapes'],
                isMixedReview: true
            }
        ],
        questionDistribution: {
            fill_chinese: 6,      // 30%
            select_picture: 5,     // 25%
            match_translation: 5,  // 25%
            audio_identify: 2,     // 10%
            speaking: 2            // 10%
        }
    },

    // ==================== TEST 2: HOLIDAYS ====================
    test2: {
        id: 'test2',
        name: 'Holidays',
        chineseName: '節日',
        icon: '🎉',
        description: 'Festival vocabulary practice',
        questionsPerSection: 20,
        sections: [
            {
                id: '2.1',
                name: 'Chinese Festivals',
                chineseName: '中國節日',
                icon: '🧧',
                categories: ['lunarnewyear', 'dragonboat', 'midautumn']
            },
            {
                id: '2.2',
                name: 'Western Holidays',
                chineseName: '西方節日',
                icon: '🎃',
                categories: ['easter', 'halloween', 'christmas']
            },
            {
                id: '2.3',
                name: 'Canadian Celebrations',
                chineseName: '加拿大節日',
                icon: '🍁',
                categories: ['canadaday', 'thanksgiving', 'lunarnewyear']
            },
            {
                id: '2.4',
                name: 'Holiday Review',
                chineseName: '節日複習',
                icon: '🎊',
                categories: ['lunarnewyear', 'easter', 'dragonboat', 'midautumn', 'canadaday', 'thanksgiving', 'halloween', 'christmas'],
                isMixedReview: true
            }
        ],
        questionDistribution: {
            fill_chinese: 6,       // 30%
            select_picture: 5,      // 25%
            match_translation: 5,   // 25%
            audio_identify: 2,      // 10%
            speaking: 2             // 10%
        }
    },

    // ==================== TEST 3: JYUTPING ====================
    test3: {
        id: 'test3',
        name: 'Jyutping',
        chineseName: '粵拼',
        icon: '🗣️',
        description: 'Pronunciation practice',
        questionsPerSection: 20,
        sections: [
            {
                id: '3.1',
                name: 'Basic Initials',
                chineseName: '基本聲母',
                icon: '🔤',
                focus: 'initials_basic',
                initials: ['b', 'p', 'm', 'f', 'd', 't', 'n', 'l']
            },
            {
                id: '3.2',
                name: 'Advanced Initials',
                chineseName: '進階聲母',
                icon: '🔠',
                focus: 'initials_advanced',
                initials: ['g', 'k', 'ng', 'h', 'gw', 'kw', 'w', 'j']
            },
            {
                id: '3.3',
                name: 'Vowels',
                chineseName: '韻母',
                icon: '📢',
                focus: 'vowels',
                vowels: ['aa', 'a', 'e', 'i', 'o', 'u', 'oe', 'eo', 'yu']
            },
            {
                id: '3.4',
                name: 'Nasals & Stops',
                chineseName: '鼻音與入聲',
                icon: '🔊',
                focus: 'endings',
                endings: ['m', 'n', 'ng', 'p', 't', 'k']
            },
            {
                id: '3.5',
                name: 'Tones',
                chineseName: '聲調',
                icon: '📈',
                focus: 'tones',
                tones: [1, 2, 3, 4, 5, 6]
            },
            {
                id: '3.6',
                name: 'Complex Syllables',
                chineseName: '複雜音節',
                icon: '🎯',
                focus: 'complex',
                description: 'Multi-syllable words'
            },
            {
                id: '3.7',
                name: 'Jyutping Review',
                chineseName: '粵拼複習',
                icon: '📝',
                focus: 'mixed',
                isMixedReview: true
            }
        ],
        questionDistribution: {
            fill_chinese: 4,       // 20%
            select_jyutping: 10,   // 50%
            audio_identify: 6      // 30%
        }
    },

    // ==================== TEST 4: CONNECTIONS ====================
    test4: {
        id: 'test4',
        name: 'Connections',
        chineseName: '連接詞',
        icon: '🔗',
        description: 'Grammar practice',
        questionsPerSection: 20,
        sections: [
            {
                id: '4.1',
                name: 'Classifiers & Pronouns',
                chineseName: '量詞與代詞',
                icon: '🔢',
                categories: ['quantitywords', 'pronouns']
            },
            {
                id: '4.2',
                name: 'Verbs',
                chineseName: '動詞',
                icon: '🏃',
                categories: ['verbs']
            },
            {
                id: '4.3',
                name: 'Adjectives & Express Words',
                chineseName: '形容詞與語氣詞',
                icon: '✨',
                categories: ['adjectives', 'expresswords']
            },
            {
                id: '4.4',
                name: 'Question & Linking Words',
                chineseName: '疑問詞與連接詞',
                icon: '❓',
                categories: ['questions', 'linkingwords', 'pronouns']
            },
            {
                id: '4.5',
                name: 'Grammar Review',
                chineseName: '語法複習',
                icon: '📝',
                categories: ['quantitywords', 'pronouns', 'verbs', 'adjectives', 'expresswords', 'questions', 'linkingwords'],
                isMixedReview: true
            }
        ],
        questionDistribution: {
            fill_chinese: 8,       // 40%
            match_translation: 6,  // 30%
            audio_identify: 6      // 30%
        }
    },

    // ==================== TEST 5: SENTENCES ====================
    test5: {
        id: 'test5',
        name: 'Sentences',
        chineseName: '句子',
        icon: '💬',
        description: 'Sentence construction practice',
        questionsPerSection: 20,
        sections: [
            {
                id: '5.1',
                name: 'Daily Communication',
                chineseName: '日常交流',
                icon: '👋',
                categories: ['introduction', 'schoolsentences', 'restaurantsentences']
            },
            {
                id: '5.2',
                name: 'Activities & Home',
                chineseName: '活動與屋企',
                icon: '🏠',
                categories: ['shoppingsentences', 'homesentences', 'playgroundsentences']
            },
            {
                id: '5.3',
                name: 'Special Occasions',
                chineseName: '特別場合',
                icon: '🎉',
                categories: ['partysentences', 'travelsentences', 'craftingsentences', 'introduction']
            },
            {
                id: '5.4',
                name: 'Sentence Review',
                chineseName: '句子複習',
                icon: '📝',
                categories: ['introduction', 'schoolsentences', 'restaurantsentences', 'shoppingsentences', 'homesentences', 'playgroundsentences', 'partysentences', 'travelsentences', 'craftingsentences'],
                isMixedReview: true
            }
        ],
        questionDistribution: {
            fill_chinese: 7,       // 35%
            word_order: 7,         // 35%
            audio_identify: 4,     // 20%
            speaking: 2            // 10%
        }
    }
};

// ==================== QUESTION TYPES ====================

const questionTypes = {
    fill_chinese: {
        id: 'fill_chinese',
        name: 'Fill in Chinese',
        chineseName: '填中文',
        description: 'Select the correct Chinese character(s) to complete a sentence',
        icon: '✏️'
    },
    select_jyutping: {
        id: 'select_jyutping',
        name: 'Select Jyutping',
        chineseName: '選粵拼',
        description: 'Given Chinese, select correct romanization',
        icon: '🗣️'
    },
    select_picture: {
        id: 'select_picture',
        name: 'Select Picture',
        chineseName: '選圖片',
        description: 'Given word, select correct emoji/picture',
        icon: '🖼️'
    },
    word_order: {
        id: 'word_order',
        name: 'Word Order',
        chineseName: '排序',
        description: 'Arrange scrambled words into correct sentence',
        icon: '🔀'
    },
    match_translation: {
        id: 'match_translation',
        name: 'Match Translation',
        chineseName: '配對翻譯',
        description: 'Match Chinese to English translation',
        icon: '🔄'
    },
    audio_identify: {
        id: 'audio_identify',
        name: 'Audio Identify',
        chineseName: '聽音辨字',
        description: 'Listen to audio and identify the word',
        icon: '🔊'
    },
    speaking: {
        id: 'speaking',
        name: 'Speaking',
        chineseName: '說話',
        description: 'Say the word in Cantonese',
        icon: '🎤'
    }
};

// ==================== HELPER FUNCTIONS ====================

/**
 * Get test by ID
 * @param {string} testId - Test ID (e.g., 'test1', 'test2')
 * @returns {Object|null} Test configuration
 */
function getTestById(testId) {
    return testConfig[testId] || null;
}

/**
 * Get section by ID
 * @param {string} testId - Test ID
 * @param {string} sectionId - Section ID
 * @returns {Object|null} Section configuration
 */
function getSectionById(testId, sectionId) {
    const test = getTestById(testId);
    if (!test) return null;
    return test.sections.find(s => s.id === sectionId) || null;
}

/**
 * Get all tests as array
 * @returns {Array} Array of test configurations
 */
function getAllTests() {
    return Object.values(testConfig);
}

/**
 * Get total question count for a test
 * @param {string} testId - Test ID
 * @returns {number} Total questions
 */
function getTestTotalQuestions(testId) {
    const test = getTestById(testId);
    if (!test) return 0;
    return test.sections.length * test.questionsPerSection;
}

/**
 * Get question distribution for a test section
 * @param {string} testId - Test ID
 * @returns {Object} Question type distribution
 */
function getQuestionDistribution(testId) {
    const test = getTestById(testId);
    if (!test) return {};
    return test.questionDistribution;
}

// ==================== EXPORTS ====================

if (typeof window !== 'undefined') {
    window.testConfig = testConfig;
    window.questionTypes = questionTypes;
    window.getTestById = getTestById;
    window.getSectionById = getSectionById;
    window.getAllTests = getAllTests;
    window.getTestTotalQuestions = getTestTotalQuestions;
    window.getQuestionDistribution = getQuestionDistribution;
}
