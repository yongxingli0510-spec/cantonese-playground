/**
 * ==================== LEVELED TESTS MODULE ====================
 * Quiz engine for Beginning, Intermediate, and Advanced tests
 * Generates questions from vocabularyData for each unit topic
 * ================================================================
 */

// ==================== STATE ====================

var LeveledTest = {
    currentQuestionIndex: 0,
    questions: [],
    score: 0,
    selectedAnswer: null,
    isAnswered: false,
    userAnswers: [],
    currentQuestionData: null,
    currentTitle: '',
    // Which UI context: 'leveled', 'beginner', 'intermediate', 'advanced'
    uiContext: 'leveled'
};

// ==================== UI ID MAPS ====================

var uiPrefixes = {
    leveled: 'leveled',
    beginner: 'beginner',
    intermediate: 'intermediate',
    advanced: 'advanced'
};

var uiContainers = {
    leveled: { select: 'levelSelectArea', quiz: 'leveledTestQuiz' },
    beginner: { select: 'beginnerTestSelect', quiz: 'beginnerQuiz' },
    intermediate: { select: 'intermediateTestSelect', quiz: 'intermediateQuiz' },
    advanced: { select: 'advancedTestSelect', quiz: 'advancedQuiz' }
};

// ==================== UNIT-TO-CATEGORY MAPPING ====================

// Beginner test: maps [levelIndex][unitIndex] to vocabulary categories + title
var beginnerUnitMap = [
    // Level 1: Basic Words
    [
        { cats: ['manners'], title: '🌱 Greetings 問候' },
        { cats: ['numbers'], title: '🌱 Numbers 1-10 數字' },
        { cats: ['colors'], title: '🌱 Colors 顏色' },
        { cats: ['family'], title: '🌱 Family 家庭' },
        { cats: ['animals'], title: '🌱 Animals 動物' },
        { cats: ['foods'], title: '🌱 Food Basics 食物' }
    ],
    // Level 2: Simple Words
    [
        { cats: ['body'], title: '🌱 Body Parts 身體' },
        { cats: ['clothing'], title: '🌱 Clothing 衫褲' },
        { cats: ['weather'], title: '🌱 Weather 天氣' },
        { cats: ['places'], title: '🌱 Places 地方' },
        { cats: ['emotions'], title: '🌱 Emotions 情緒' },
        { cats: ['dailyactivities'], title: '🌱 Actions 動作' },
        { cats: ['nature'], title: '🌱 Objects 物件' }
    ],
    // Level 3: Common Phrases
    [
        { cats: ['manners'], title: '🌱 Polite Words 禮貌' },
        { cats: ['questions'], title: '🌱 Questions 疑問詞' },
        { cats: ['expresswords'], title: '🌱 Responses 回應' },
        { cats: ['dailyactivities', 'hobbies'], title: '🌱 Daily Phrases 日常' },
        { cats: ['numbers'], title: '🌱 Numbers 11-20 數字', slice: [10, 14] },
        { cats: ['quantitywords'], title: '🌱 Time Words 時間' },
        { cats: ['transport'], title: '🌱 Directions 方向' },
        { cats: ['manners', 'numbers', 'colors', 'family', 'animals', 'foods'], title: '🌱 Mixed Review 混合複習' }
    ]
];

// Intermediate test: maps [levelIndex][unitIndex] to vocabulary categories
var intermediateUnitMap = [
    // Level 1: Compound Words
    [
        { cats: ['foods'], title: '🌿 Food Items 食物' },
        { cats: ['foods'], title: '🌿 Drinks 飲品', slice: [10, 20] },
        { cats: ['transport'], title: '🌿 Transport 交通' },
        { cats: ['nature'], title: '🌿 Nature 大自然' },
        { cats: ['hobbies'], title: '🌿 School Items 學校' },
        { cats: ['places', 'nature'], title: '🌿 Home Items 屋企' },
        { cats: ['hobbies', 'sports'], title: '🌿 Hobbies 興趣' }
    ],
    // Level 2: Sentences
    [
        { cats: ['introduction'], title: '🌿 Self Intro 自我介紹' },
        { cats: ['schoolsentences'], title: '🌿 At School 學校' },
        { cats: ['homesentences'], title: '🌿 At Home 屋企' },
        { cats: ['shoppingsentences'], title: '🌿 Shopping 購物' },
        { cats: ['restaurantsentences'], title: '🌿 Restaurant 餐廳' },
        { cats: ['playgroundsentences'], title: '🌿 Playground 公園' },
        { cats: ['verbs'], title: '🌿 Verbs 動詞' },
        { cats: ['adjectives'], title: '🌿 Adjectives 形容詞' }
    ],
    // Level 3: Conversations
    [
        { cats: ['manners', 'introduction'], title: '🌿 Meeting People 見面' },
        { cats: ['expresswords', 'linkingwords'], title: '🌿 Making Plans 計劃' },
        { cats: ['questions', 'expresswords'], title: '🌿 Asking Help 求助' },
        { cats: ['emotions'], title: '🌿 Feelings 感受' },
        { cats: ['lunarnewyear', 'easter', 'dragonboat', 'midautumn', 'christmas'], title: '🌿 Holidays 節日' },
        { cats: ['weather'], title: '🌿 Weather Talk 天氣' },
        { cats: ['dailyactivities'], title: '🌿 Daily Routines 日常' },
        { cats: ['manners', 'foods', 'transport', 'emotions', 'weather', 'clothing'], title: '🌿 Mixed Review 混合複習' }
    ]
];

// Advanced test: maps [levelIndex][unitIndex] to vocabulary categories
var advancedUnitMap = [
    // Level 1: Complex Vocabulary
    [
        { cats: ['occupations'], title: '🌳 Professions 職業' },
        { cats: ['places', 'transport'], title: '🌳 Countries 國家' },
        { cats: ['hobbies', 'sports'], title: '🌳 Subjects 科目' },
        { cats: ['sports'], title: '🌳 Sports 運動' },
        { cats: ['hobbies'], title: '🌳 Music & Art 音樂藝術' },
        { cats: ['occupations', 'places'], title: '🌳 Technology 科技' },
        { cats: ['body', 'emotions'], title: '🌳 Health 健康' }
    ],
    // Level 2: Story Vocabulary
    [
        { cats: ['verbs', 'adjectives', 'nature'], title: '🌳 小馬過河' },
        { cats: ['animals', 'verbs', 'adjectives'], title: '🌳 龜兔賽跑' },
        { cats: ['animals', 'adjectives'], title: '🌳 三隻小豬' },
        { cats: ['animals', 'verbs'], title: '🌳 狼嚟喇' },
        { cats: ['foods', 'family', 'verbs'], title: '🌳 拔蘿蔔' },
        { cats: ['animals', 'emotions', 'adjectives'], title: '🌳 醜小鴨' },
        { cats: ['nature', 'verbs', 'adjectives'], title: '🌳 愚公移山' },
        { cats: ['linkingwords', 'expresswords', 'verbs'], title: '🌳 More Stories 更多故事' }
    ],
    // Level 3: Idioms & Proverbs
    [
        { cats: ['linkingwords', 'expresswords'], title: '🌳 Common Idioms 常用成語' },
        { cats: ['adjectives', 'emotions'], title: '🌳 Moral Lessons 道德' },
        { cats: ['expresswords', 'questions'], title: '🌳 Expressions 用語' },
        { cats: ['verbs', 'adjectives'], title: '🌳 Slang 俚語' },
        { cats: ['linkingwords', 'adjectives'], title: '🌳 Proverbs 諺語' },
        { cats: ['lunarnewyear', 'midautumn', 'dragonboat'], title: '🌳 Culture 文化' },
        { cats: ['christmas', 'halloween', 'thanksgiving', 'easter', 'canadaday'], title: '🌳 Festivals 節日' },
        { cats: ['manners', 'foods', 'animals', 'colors', 'family', 'numbers', 'weather', 'clothing', 'sports', 'body', 'places', 'occupations', 'emotions'], title: '🌳 Final Review 總複習' }
    ]
];

// Leveled test (testLevels page) maps level name + number to categories
var leveledTestMap = {
    beginning: [
        null, // index 0 unused
        { cats: ['manners', 'numbers', 'colors'], title: '🌱 Beginning Level 1' },
        { cats: ['family', 'animals', 'foods'], title: '🌱 Beginning Level 2' },
        { cats: ['body', 'clothing', 'weather', 'places'], title: '🌱 Beginning Level 3' }
    ],
    intermediate: [
        null,
        { cats: ['expresswords', 'questions', 'linkingwords'], title: '🌿 Intermediate Level 1' },
        { cats: ['introduction', 'schoolsentences', 'restaurantsentences'], title: '🌿 Intermediate Level 2' },
        { cats: ['shoppingsentences', 'homesentences', 'verbs', 'adjectives'], title: '🌿 Intermediate Level 3' }
    ],
    advanced: [
        null,
        { cats: ['occupations', 'sports', 'hobbies', 'transport'], title: '🌳 Advanced Level 1' },
        { cats: ['linkingwords', 'expresswords', 'verbs', 'adjectives'], title: '🌳 Advanced Level 2' },
        { cats: ['lunarnewyear', 'midautumn', 'dragonboat', 'christmas', 'halloween', 'emotions', 'nature'], title: '🌳 Advanced Level 3' }
    ]
};

// ==================== QUESTION GENERATION ====================

/**
 * Generate quiz questions from vocabulary categories
 * @param {string[]} categories - vocabulary category keys
 * @param {number} count - number of questions to generate
 * @param {number[]} [slice] - optional [start, end] to slice category items
 * @returns {Array} questions
 */
function generateVocabQuestions(categories, count, slice) {
    if (typeof vocabularyData === 'undefined') return [];

    // Gather all items from specified categories
    var allItems = [];
    categories.forEach(function(cat) {
        var items = vocabularyData[cat];
        if (items && items.length > 0) {
            var catItems = slice ? items.slice(slice[0], slice[1]) : items;
            allItems = allItems.concat(catItems);
        }
    });

    if (allItems.length < 4) return [];

    // Shuffle and pick up to count items
    allItems = shuffleLeveledArray(allItems);
    var selected = allItems.slice(0, Math.min(count, allItems.length));

    // Generate questions
    var questions = [];
    selected.forEach(function(item) {
        // Randomly choose question type
        var qType = Math.random();
        var q;

        if (qType < 0.5) {
            // Type 1: Show Chinese + icon, ask for English meaning
            q = makeChineseToEnglishQ(item, allItems);
        } else {
            // Type 2: Show English + icon, ask for Chinese word
            q = makeEnglishToChineseQ(item, allItems);
        }

        if (q) questions.push(q);
    });

    return questions;
}

/**
 * Make a "What does X mean?" question (Chinese -> English)
 */
function makeChineseToEnglishQ(item, pool) {
    var wrongOptions = getDistractors(item, pool, 'english', 3);
    if (wrongOptions.length < 3) return null;

    var options = shuffleLeveledArray([item.english].concat(wrongOptions));
    return {
        picture: item.icon || '❓',
        jyutping: item.jyutping || '',
        chinese: item.chinese,
        english: 'What does this mean?',
        answer: item.english,
        options: options
    };
}

/**
 * Make a "How do you say X?" question (English -> Chinese)
 */
function makeEnglishToChineseQ(item, pool) {
    var wrongOptions = getDistractors(item, pool, 'chinese', 3);
    if (wrongOptions.length < 3) return null;

    var options = shuffleLeveledArray([item.chinese].concat(wrongOptions));
    return {
        picture: item.icon || '❓',
        jyutping: '',
        chinese: item.english,
        english: 'Select the correct Chinese word:',
        answer: item.chinese,
        options: options
    };
}

/**
 * Get distractor options from pool
 * @param {Object} correctItem - the correct vocabulary item
 * @param {Array} pool - all available items
 * @param {string} field - 'english' or 'chinese'
 * @param {number} count - number of distractors needed
 * @returns {string[]}
 */
function getDistractors(correctItem, pool, field, count) {
    var distractors = [];
    var used = {};
    used[correctItem[field]] = true;

    // Shuffle pool to randomize distractors
    var shuffled = shuffleLeveledArray(pool.slice());
    for (var i = 0; i < shuffled.length && distractors.length < count; i++) {
        var val = shuffled[i][field];
        if (val && !used[val]) {
            used[val] = true;
            distractors.push(val);
        }
    }

    return distractors;
}

// ==================== ENTRY POINTS ====================

/**
 * Start a leveled test from the testLevels page
 */
function startLeveledTest(level, levelNum) {
    LeveledTest.uiContext = 'leveled';
    var mapping = leveledTestMap[level] && leveledTestMap[level][levelNum];
    if (mapping) {
        startQuizFromMapping(mapping);
    }
}

/**
 * Start a beginner unit test
 */
function startBeginnerUnit(levelIndex, unitIndex) {
    LeveledTest.uiContext = 'beginner';
    var mapping = beginnerUnitMap[levelIndex] && beginnerUnitMap[levelIndex][unitIndex];
    if (mapping) {
        startQuizFromMapping(mapping);
    }
}

/**
 * Start an intermediate unit test
 */
function startIntermediateUnit(levelIndex, unitIndex) {
    LeveledTest.uiContext = 'intermediate';
    var mapping = intermediateUnitMap[levelIndex] && intermediateUnitMap[levelIndex][unitIndex];
    if (mapping) {
        startQuizFromMapping(mapping);
    }
}

/**
 * Start an advanced unit test
 */
function startAdvancedUnit(levelIndex, unitIndex) {
    LeveledTest.uiContext = 'advanced';
    var mapping = advancedUnitMap[levelIndex] && advancedUnitMap[levelIndex][unitIndex];
    if (mapping) {
        startQuizFromMapping(mapping);
    }
}

// ==================== CORE ENGINE ====================

/**
 * Start a quiz from a unit mapping
 * @param {Object} mapping - { cats: string[], title: string, slice?: number[] }
 */
function startQuizFromMapping(mapping) {
    // Generate questions from vocabulary
    var questions = generateVocabQuestions(mapping.cats, 10, mapping.slice);

    if (questions.length < 4) {
        // Not enough vocabulary, show error
        alert('Not enough vocabulary data for this unit. Please try another.');
        return;
    }

    // Reset state
    LeveledTest.currentQuestionIndex = 0;
    LeveledTest.score = 0;
    LeveledTest.selectedAnswer = null;
    LeveledTest.isAnswered = false;
    LeveledTest.userAnswers = [];
    LeveledTest.currentTitle = mapping.title;
    LeveledTest.questions = questions;

    // Switch UI
    var ctx = LeveledTest.uiContext;
    var containers = uiContainers[ctx];
    var prefix = uiPrefixes[ctx];

    var selectEl = document.getElementById(containers.select);
    var quizEl = document.getElementById(containers.quiz);
    if (selectEl) selectEl.style.display = 'none';
    if (!quizEl) return;
    quizEl.style.display = 'block';

    // Restore quiz HTML structure — endLeveledTest() replaces it with results,
    // so we always rebuild it fresh before starting a new section.
    var ctxFunc = ctx.charAt(0).toUpperCase() + ctx.slice(1);
    quizEl.innerHTML =
        '<h2 class="game-title" id="' + prefix + 'Title"></h2>' +
        '<div class="score">Question: <span id="' + prefix + 'Question">1</span> / <span id="' + prefix + 'Total">' + questions.length + '</span></div>' +
        '<div class="score">Score: <span id="' + prefix + 'Score">0</span> / <span id="' + prefix + 'Total2">' + questions.length + '</span></div>' +
        '<div class="progress-bar"><div class="progress-fill" id="' + prefix + 'Progress" style="width: 0%"></div></div>' +
        '<div style="font-size: 5rem; text-align: center; margin: 20px 0;" id="' + prefix + 'Picture"></div>' +
        '<div style="display: flex; align-items: center; justify-content: center; gap: 15px; margin-bottom: 15px;">' +
            '<div style="font-size: 1.5rem; color: var(--accent); font-weight: 600;" id="' + prefix + 'Jyutping"></div>' +
            '<button class="play-btn" onclick="play' + ctxFunc + 'Question()" style="width: 50px; height: 50px; font-size: 1.2rem;">🔊</button>' +
        '</div>' +
        '<div class="question" id="' + prefix + 'QuestionText" style="font-size: 2.5rem;"></div>' +
        '<div class="options" id="' + prefix + 'Options"></div>' +
        '<button class="next-btn" id="' + prefix + 'ConfirmBtn" style="display: none;" onclick="confirm' + ctxFunc + 'Answer()">Confirm Answer ✓</button>';

    // Update title
    var titleEl = document.getElementById(prefix + 'Title');
    if (titleEl) titleEl.textContent = mapping.title;

    loadLeveledQuestion();
}

/**
 * Load the current question
 */
function loadLeveledQuestion() {
    var q = LeveledTest.questions[LeveledTest.currentQuestionIndex];
    if (!q) {
        endLeveledTest();
        return;
    }

    LeveledTest.currentQuestionData = q;
    LeveledTest.isAnswered = false;
    LeveledTest.selectedAnswer = null;

    var prefix = uiPrefixes[LeveledTest.uiContext];

    // Update question number
    var qNumEl = document.getElementById(prefix + 'Question');
    if (qNumEl) qNumEl.textContent = LeveledTest.currentQuestionIndex + 1;

    // Update picture
    var picEl = document.getElementById(prefix + 'Picture');
    if (picEl) picEl.textContent = q.picture || '';

    // Update jyutping
    var jpEl = document.getElementById(prefix + 'Jyutping');
    if (jpEl) jpEl.textContent = q.jyutping || '';

    // Update chinese/question text
    var chEl = document.getElementById(prefix + 'Chinese') || document.getElementById(prefix + 'QuestionText');
    if (chEl) chEl.textContent = q.chinese || '';

    // Update instruction if exists
    var instrEl = document.getElementById(prefix + 'Instruction');
    if (instrEl) {
        instrEl.textContent = q.english || '';
    }

    // Hide confirm button
    var confirmBtn = document.getElementById(prefix + 'ConfirmBtn');
    if (confirmBtn) confirmBtn.style.display = 'none';

    // Render options
    renderLeveledOptions(q);
}

/**
 * Render answer options
 */
function renderLeveledOptions(q) {
    var prefix = uiPrefixes[LeveledTest.uiContext];
    var optionsContainer = document.getElementById(prefix + 'Options');
    if (!optionsContainer) return;

    optionsContainer.innerHTML = '';

    q.options.forEach(function(option) {
        var btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.textContent = option;
        btn.dataset.answer = option;
        btn.onclick = function() {
            selectLeveledAnswer(option, btn);
        };
        optionsContainer.appendChild(btn);
    });
}

/**
 * Select an answer
 */
function selectLeveledAnswer(answer, btn) {
    if (LeveledTest.isAnswered) return;

    var prefix = uiPrefixes[LeveledTest.uiContext];

    // Remove previous selection
    var allButtons = document.querySelectorAll('#' + prefix + 'Options .option-btn');
    allButtons.forEach(function(b) {
        b.classList.remove('selected');
    });

    // Highlight selected
    btn.classList.add('selected');
    LeveledTest.selectedAnswer = answer;

    // Show confirm button
    var confirmBtn = document.getElementById(prefix + 'ConfirmBtn');
    if (confirmBtn) confirmBtn.style.display = 'block';
}

// ==================== CONFIRM & FEEDBACK ====================

function confirmLeveledAnswerGeneric() {
    if (LeveledTest.isAnswered || !LeveledTest.selectedAnswer) return;

    LeveledTest.isAnswered = true;
    var q = LeveledTest.currentQuestionData;
    var isCorrect = LeveledTest.selectedAnswer === q.answer;

    // Store answer
    LeveledTest.userAnswers.push({
        questionNumber: LeveledTest.currentQuestionIndex + 1,
        picture: q.picture || '',
        chinese: q.chinese || '',
        english: q.english || '',
        correctAnswer: q.answer,
        userAnswer: LeveledTest.selectedAnswer,
        isCorrect: isCorrect
    });

    if (isCorrect) {
        LeveledTest.score++;
        if (typeof showCelebration === 'function') showCelebration('🎉');
    } else {
        if (typeof showCelebration === 'function') showCelebration('💪');
    }

    var prefix = uiPrefixes[LeveledTest.uiContext];

    // Update score
    var scoreEl = document.getElementById(prefix + 'Score');
    if (scoreEl) scoreEl.textContent = LeveledTest.score;

    // Update progress
    var progress = ((LeveledTest.currentQuestionIndex + 1) / LeveledTest.questions.length) * 100;
    var progressEl = document.getElementById(prefix + 'Progress');
    if (progressEl) progressEl.style.width = progress + '%';

    // Show feedback on buttons
    var allButtons = document.querySelectorAll('#' + prefix + 'Options .option-btn');
    allButtons.forEach(function(btn) {
        btn.disabled = true;
        if (btn.dataset.answer === q.answer) {
            btn.classList.add('correct');
        } else if (btn.dataset.answer === LeveledTest.selectedAnswer && !isCorrect) {
            btn.classList.add('incorrect');
        }
    });

    // Hide confirm button
    var confirmBtn = document.getElementById(prefix + 'ConfirmBtn');
    if (confirmBtn) confirmBtn.style.display = 'none';

    // Next question after delay
    setTimeout(function() {
        LeveledTest.currentQuestionIndex++;
        if (LeveledTest.currentQuestionIndex >= LeveledTest.questions.length) {
            endLeveledTest();
        } else {
            loadLeveledQuestion();
        }
    }, 1500);
}

// Named confirm functions called from HTML onclick
function confirmLeveledAnswer() { confirmLeveledAnswerGeneric(); }
function confirmBeginnerAnswer() { confirmLeveledAnswerGeneric(); }
function confirmIntermediateAnswer() { confirmLeveledAnswerGeneric(); }
function confirmAdvancedAnswer() { confirmLeveledAnswerGeneric(); }

// ==================== AUDIO ====================

function playLeveledQuestionGeneric() {
    var q = LeveledTest.currentQuestionData;
    if (!q) return;
    var text = q.chinese;
    if (typeof safeSpeechSynthesis === 'function') {
        safeSpeechSynthesis(text);
    } else if (typeof playSound === 'function') {
        playSound(text, '');
    }
}

function playLeveledQuestion() { playLeveledQuestionGeneric(); }
function playBeginnerQuestion() { playLeveledQuestionGeneric(); }
function playIntermediateQuestion() { playLeveledQuestionGeneric(); }
function playAdvancedQuestion() { playLeveledQuestionGeneric(); }

// ==================== TEST COMPLETION ====================

function endLeveledTest() {
    var totalQuestions = LeveledTest.questions.length;
    var percentage = totalQuestions > 0 ? Math.round((LeveledTest.score / totalQuestions) * 100) : 0;

    var emoji = percentage >= 90 ? '🏆' : percentage >= 75 ? '🌟' : percentage >= 60 ? '⭐' : '📚';
    var message = percentage >= 90 ? "Outstanding! You're a Cantonese master!" :
                  percentage >= 75 ? "Great job! You're doing excellent!" :
                  percentage >= 60 ? "Good work! Keep practicing!" :
                  "Keep learning! You're getting better!";

    if (typeof showCelebration === 'function' && percentage >= 70) {
        showCelebration('🎉');
    }

    if (typeof trackTestScore === 'function') {
        trackTestScore('leveled', LeveledTest.score, totalQuestions);
    }

    // Build review HTML
    var reviewHTML = '<div class="answer-review"><div class="answer-review-title">📊 Your Answers:</div>';
    reviewHTML += '<div style="max-height: 400px; overflow-y: auto;">';

    LeveledTest.userAnswers.forEach(function(ans) {
        reviewHTML += '<div class="review-item ' + (ans.isCorrect ? 'correct' : 'incorrect') + '">' +
            '<div class="review-question">' +
                '<span style="font-size: 1.3rem;">' + (ans.isCorrect ? '✅' : '❌') + ' ' + ans.picture + '</span> ' +
                'Q' + ans.questionNumber + ': ' + ans.chinese +
            '</div>' +
            '<div class="review-answer">' +
                '<span class="review-correct-answer">✓ ' + ans.correctAnswer + '</span>' +
                (!ans.isCorrect ? '<span class="review-your-answer">✗ ' + ans.userAnswer + '</span>' : '') +
            '</div>' +
        '</div>';
    });
    reviewHTML += '</div></div>';

    var ctx = LeveledTest.uiContext;
    var containers = uiContainers[ctx];
    var quizEl = document.getElementById(containers.quiz);
    if (!quizEl) return;

    // Build back button based on context
    var backFn = ctx === 'leveled' ? 'backToLevelSelect' :
                 ctx === 'beginner' ? 'backToBeginnerSelect' :
                 ctx === 'intermediate' ? 'backToIntermediateSelect' :
                 'backToAdvancedSelect';

    quizEl.innerHTML =
        '<h2 class="game-title">🎊 Test Complete! 🎊</h2>' +
        '<div style="text-align: center; font-size: 4rem; margin: 20px 0;">' + emoji + '</div>' +
        '<div style="text-align: center; font-size: 2rem; font-weight: 700; color: var(--primary); margin-bottom: 10px;">' +
            'You scored ' + LeveledTest.score + ' out of ' + totalQuestions + '!' +
        '</div>' +
        '<div style="text-align: center; font-size: 1.5rem; font-weight: 700; color: var(--purple); margin-bottom: 20px;">' +
            percentage + '% Correct' +
        '</div>' +
        '<div style="text-align: center; font-size: 1.2rem; color: var(--text); margin-bottom: 25px;">' +
            message +
        '</div>' +
        reviewHTML +
        '<div style="display: flex; gap: 15px; justify-content: center; flex-wrap: wrap; margin-top: 25px;">' +
            '<button class="next-btn" onclick="' + backFn + '()">Back to Sections 📚</button>' +
        '</div>';
}

// ==================== NAVIGATION ====================

function backToLevelSelect() {
    var c = uiContainers.leveled;
    var s = document.getElementById(c.select);
    var q = document.getElementById(c.quiz);
    if (s) s.style.display = 'block';
    if (q) q.style.display = 'none';
}

function backToBeginnerSelect() {
    var c = uiContainers.beginner;
    var s = document.getElementById(c.select);
    var q = document.getElementById(c.quiz);
    if (s) s.style.display = 'block';
    if (q) q.style.display = 'none';
}

function backToIntermediateSelect() {
    var c = uiContainers.intermediate;
    var s = document.getElementById(c.select);
    var q = document.getElementById(c.quiz);
    if (s) s.style.display = 'block';
    if (q) q.style.display = 'none';
}

function backToAdvancedSelect() {
    var c = uiContainers.advanced;
    var s = document.getElementById(c.select);
    var q = document.getElementById(c.quiz);
    if (s) s.style.display = 'block';
    if (q) q.style.display = 'none';
}

// ==================== INIT FUNCTIONS ====================

function initBeginnerTest() {
    backToBeginnerSelect();
}

function initIntermediateTest() {
    backToIntermediateSelect();
}

function initAdvancedTest() {
    backToAdvancedSelect();
}

// ==================== UTILITY ====================

function shuffleLeveledArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}

// ==================== EXPORTS ====================

window.initBeginnerTest = initBeginnerTest;
window.initIntermediateTest = initIntermediateTest;
window.initAdvancedTest = initAdvancedTest;
window.startLeveledTest = startLeveledTest;
window.startBeginnerUnit = startBeginnerUnit;
window.startIntermediateUnit = startIntermediateUnit;
window.startAdvancedUnit = startAdvancedUnit;
window.confirmLeveledAnswer = confirmLeveledAnswer;
window.confirmBeginnerAnswer = confirmBeginnerAnswer;
window.confirmIntermediateAnswer = confirmIntermediateAnswer;
window.confirmAdvancedAnswer = confirmAdvancedAnswer;
window.playLeveledQuestion = playLeveledQuestion;
window.playBeginnerQuestion = playBeginnerQuestion;
window.playIntermediateQuestion = playIntermediateQuestion;
window.playAdvancedQuestion = playAdvancedQuestion;
window.backToLevelSelect = backToLevelSelect;
window.backToBeginnerSelect = backToBeginnerSelect;
window.backToIntermediateSelect = backToIntermediateSelect;
window.backToAdvancedSelect = backToAdvancedSelect;
window.selectLeveledAnswer = selectLeveledAnswer;
