/**
 * ==================== QUIZ MODULE ====================
 * Test and quiz logic for Cantonese Playground
 * Supports 5 tests with 6 question types
 * ================================================================
 */

// ==================== STORY QUIZ ====================

// Story quiz tracking
const storyQuizScores = {};
const storyQuizCurrentQuestion = {};

/**
 * Check story comprehension answer
 */
function checkStoryAnswer(storyId, questionIndex, selectedAnswer, correctAnswer) {
    if (!storyQuizScores[storyId]) {
        storyQuizScores[storyId] = 0;
        storyQuizCurrentQuestion[storyId] = 0;
    }

    const feedbackDiv = document.getElementById(storyId + '-feedback' + questionIndex);
    const optionButtons = document.querySelectorAll('#' + storyId + '-q' + questionIndex + ' .quiz-option');

    optionButtons.forEach((btn, idx) => {
        btn.disabled = true;
        btn.style.cursor = 'default';
        if (idx === correctAnswer) {
            btn.style.background = '#c8e6c9';
            btn.style.borderColor = '#4caf50';
            btn.style.color = '#2e7d32';
        } else if (idx === selectedAnswer && selectedAnswer !== correctAnswer) {
            btn.style.background = '#ffcdd2';
            btn.style.borderColor = '#f44336';
            btn.style.color = '#c62828';
        }
    });

    if (selectedAnswer === correctAnswer) {
        storyQuizScores[storyId]++;
        feedbackDiv.innerHTML = '✅ Correct! 正確！';
        feedbackDiv.style.background = '#c8e6c9';
        feedbackDiv.style.color = '#2e7d32';
    } else {
        feedbackDiv.innerHTML = '❌ Incorrect 錯誤';
        feedbackDiv.style.background = '#ffcdd2';
        feedbackDiv.style.color = '#c62828';
    }
    feedbackDiv.style.display = 'block';

    storyQuizCurrentQuestion[storyId]++;
    const totalQuestions = document.querySelectorAll('#' + storyId + '-quiz-container .quiz-question').length;

    setTimeout(() => {
        if (storyQuizCurrentQuestion[storyId] < totalQuestions) {
            const nextQuestion = document.getElementById(storyId + '-q' + storyQuizCurrentQuestion[storyId]);
            if (nextQuestion) {
                nextQuestion.style.display = 'block';
                nextQuestion.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        } else {
            const resultDiv = document.getElementById(storyId + '-quiz-result');
            const scoreText = document.getElementById(storyId + '-score');
            if (resultDiv && scoreText) {
                const score = storyQuizScores[storyId];
                const percentage = Math.round((score / totalQuestions) * 100);
                scoreText.textContent = `You got ${score}/${totalQuestions} correct! (${percentage}%)`;
                resultDiv.style.display = 'block';
                resultDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    }, 1000);
}

function resetStoryQuiz(storyId) {
    storyQuizScores[storyId] = 0;
    storyQuizCurrentQuestion[storyId] = 0;

    const resultDiv = document.getElementById(storyId + '-quiz-result');
    if (resultDiv) resultDiv.style.display = 'none';

    const questions = document.querySelectorAll('#' + storyId + '-quiz-container .quiz-question');
    questions.forEach((q, idx) => {
        q.style.display = idx === 0 ? 'block' : 'none';
        const feedback = q.querySelector('[id$="-feedback' + idx + '"]');
        if (feedback) {
            feedback.style.display = 'none';
            feedback.innerHTML = '';
        }
        const buttons = q.querySelectorAll('.quiz-option');
        buttons.forEach(btn => {
            btn.disabled = false;
            btn.style.cursor = 'pointer';
            btn.style.background = 'white';
            btn.style.borderColor = '#ddd';
            btn.style.color = '#333';
        });
    });
}

// ==================== UNIFIED TEST STATE ====================

const UnifiedTest = {
    currentTestId: null,
    currentSectionId: null,
    currentQuestionIndex: 0,
    questions: [],
    score: 0,
    userAnswers: [],
    selectedAnswer: null,
    isAnswered: false,
    wordOrderSelected: [] // For word order questions
};

// ==================== TEST INITIALIZATION ====================

/**
 * Initialize a unified test
 * @param {string} testId - Test ID (test1, test2, test3, test4, test5)
 */
function initUnifiedTest(testId) {
    if (typeof testConfig === 'undefined') {
        console.error('testConfig not loaded');
        return;
    }

    const test = testConfig[testId];
    if (!test) {
        console.error('Test not found:', testId);
        return;
    }

    const container = document.querySelector(`#${testId} .game-container`);
    if (!container) return;

    // Build section selection UI
    let sectionsHTML = test.sections.map((section, idx) => `
        <button class="next-btn section-btn" onclick="startUnifiedSection('${testId}', '${section.id}')">
            ${section.icon} ${section.name}
            <span style="display: block; font-size: 0.85rem; opacity: 0.8;">${section.chineseName}</span>
        </button>
    `).join('');

    container.innerHTML = `
        <div id="${testId}SectionSelect">
            <h2 class="game-title">${test.icon} ${test.name} ${test.chineseName}</h2>
            <p style="text-align: center; color: var(--text-muted); margin-bottom: 20px;">${test.description}</p>
            <div style="display: grid; gap: 12px; max-width: 700px; margin: 0 auto;">
                ${sectionsHTML}
            </div>
        </div>

        <div id="${testId}Quiz" style="display: none;">
            <h2 class="game-title" id="${testId}SectionTitle"></h2>
            <div class="score">Question: <span id="${testId}QuestionNum">1</span> / <span id="${testId}TotalQuestions">20</span></div>
            <div class="score">Score: <span id="${testId}Score">0</span> / <span id="${testId}TotalQuestions2">20</span></div>
            <div class="progress-bar">
                <div class="progress-fill" id="${testId}Progress" style="width: 0%"></div>
            </div>
            <div id="${testId}QuestionTypeIndicator" class="question-type-indicator"></div>
            <div id="${testId}QuestionContent"></div>
            <button class="next-btn" id="${testId}ConfirmBtn" style="display: none;" onclick="confirmUnifiedAnswer('${testId}')">Confirm Answer ✓</button>
        </div>
    `;
}

/**
 * Start a section of a unified test
 */
function startUnifiedSection(testId, sectionId) {
    if (typeof QuestionGenerator === 'undefined') {
        console.error('QuestionGenerator not loaded');
        return;
    }

    const test = testConfig[testId];
    const section = test.sections.find(s => s.id === sectionId);

    if (!section) {
        console.error('Section not found:', sectionId);
        return;
    }

    // Reset state
    UnifiedTest.currentTestId = testId;
    UnifiedTest.currentSectionId = sectionId;
    UnifiedTest.currentQuestionIndex = 0;
    UnifiedTest.score = 0;
    UnifiedTest.userAnswers = [];
    UnifiedTest.selectedAnswer = null;
    UnifiedTest.isAnswered = false;
    UnifiedTest.wordOrderSelected = [];

    // Generate questions
    UnifiedTest.questions = QuestionGenerator.generateQuestionsForSection(testId, sectionId);

    // Show quiz UI
    document.getElementById(`${testId}SectionSelect`).style.display = 'none';
    document.getElementById(`${testId}Quiz`).style.display = 'block';
    document.getElementById(`${testId}SectionTitle`).textContent = `${section.icon} ${section.name}`;
    document.getElementById(`${testId}TotalQuestions`).textContent = UnifiedTest.questions.length;
    document.getElementById(`${testId}TotalQuestions2`).textContent = UnifiedTest.questions.length;
    document.getElementById(`${testId}Score`).textContent = '0';
    document.getElementById(`${testId}Progress`).style.width = '0%';

    loadUnifiedQuestion(testId);
}

/**
 * Load current question
 */
function loadUnifiedQuestion(testId) {
    const question = UnifiedTest.questions[UnifiedTest.currentQuestionIndex];

    if (!question) {
        endUnifiedTest(testId);
        return;
    }

    UnifiedTest.isAnswered = false;
    UnifiedTest.selectedAnswer = null;
    UnifiedTest.wordOrderSelected = [];

    // Update question number
    document.getElementById(`${testId}QuestionNum`).textContent = UnifiedTest.currentQuestionIndex + 1;

    // Hide confirm button
    const confirmBtn = document.getElementById(`${testId}ConfirmBtn`);
    if (confirmBtn) {
        confirmBtn.style.display = 'none';
    }

    // Render question based on type
    renderQuestion(testId, question);
}

// ==================== QUESTION RENDERERS ====================

/**
 * Main question renderer - routes to specific type renderer
 */
function renderQuestion(testId, question) {
    const container = document.getElementById(`${testId}QuestionContent`);
    const typeIndicator = document.getElementById(`${testId}QuestionTypeIndicator`);

    // Show question type indicator
    const typeInfo = typeof questionTypes !== 'undefined' ? questionTypes[question.type] : null;
    if (typeInfo) {
        typeIndicator.innerHTML = `<span class="type-badge">${typeInfo.icon} ${typeInfo.name}</span>`;
    }

    switch (question.type) {
        case 'fill_chinese':
            renderFillChinese(container, question, testId);
            break;
        case 'select_jyutping':
            renderSelectJyutping(container, question, testId);
            break;
        case 'select_picture':
            renderSelectPicture(container, question, testId);
            break;
        case 'word_order':
            renderWordOrder(container, question, testId);
            break;
        case 'match_translation':
            renderMatchTranslation(container, question, testId);
            break;
        case 'audio_identify':
            renderAudioIdentify(container, question, testId);
            break;
        case 'speaking':
            renderSpeaking(container, question, testId);
            break;
        default:
            console.error('Unknown question type:', question.type);
            renderFillChinese(container, question, testId);
    }
}

/**
 * Render fill-in-Chinese question
 */
function renderFillChinese(container, question, testId) {
    container.innerHTML = `
        <div style="font-size: 4rem; text-align: center; margin: 20px 0;">${question.picture}</div>
        <div style="display: flex; align-items: center; justify-content: center; gap: 15px; margin-bottom: 15px;">
            <div style="font-size: 1.3rem; color: var(--accent); font-weight: 600;">${question.jyutping}</div>
            <button class="play-btn" onclick="playQuestionAudio('${escapeHtml(question.chinese.replace('___', question.answer))}')" style="width: 45px; height: 45px; font-size: 1.1rem;">🔊</button>
        </div>
        <div class="question" style="font-size: 2.2rem;">${question.chinese}</div>
        <div class="options" id="${testId}Options"></div>
    `;

    renderOptions(testId, question.options, question.answer);
}

/**
 * Render select-Jyutping question
 */
function renderSelectJyutping(container, question, testId) {
    container.innerHTML = `
        <div style="font-size: 4rem; text-align: center; margin: 20px 0;">${question.picture}</div>
        <div class="question" style="font-size: 2.5rem; color: var(--primary);">${question.chinese}</div>
        <p style="text-align: center; color: var(--text-muted); margin-bottom: 20px;">Select the correct Jyutping pronunciation:</p>
        <div class="options jyutping-options" id="${testId}Options"></div>
    `;

    renderOptions(testId, question.options, question.answer, 'jyutping');
}

/**
 * Render select-picture question
 */
function renderSelectPicture(container, question, testId) {
    container.innerHTML = `
        <div style="display: flex; align-items: center; justify-content: center; gap: 15px; margin-bottom: 20px;">
            <div style="font-size: 2.5rem; color: var(--primary); font-weight: 700;">${question.chinese}</div>
            <button class="play-btn" onclick="playQuestionAudio('${escapeHtml(question.chinese)}')" style="width: 45px; height: 45px; font-size: 1.1rem;">🔊</button>
        </div>
        <div style="font-size: 1.2rem; color: var(--accent); text-align: center; margin-bottom: 15px;">${question.jyutping}</div>
        <p style="text-align: center; color: var(--text-muted); margin-bottom: 20px;">Select the correct picture:</p>
        <div class="options picture-grid" id="${testId}Options"></div>
    `;

    renderPictureOptions(testId, question.options, question.answer);
}

/**
 * Render word-order question
 */
function renderWordOrder(container, question, testId) {
    UnifiedTest.wordOrderSelected = [];

    container.innerHTML = `
        <div style="font-size: 3rem; text-align: center; margin: 15px 0;">${question.picture}</div>
        <div style="font-size: 1.1rem; color: var(--accent); text-align: center; margin-bottom: 10px;">${question.jyutping || ''}</div>
        <div style="font-size: 1.2rem; text-align: center; color: var(--text); margin-bottom: 20px;">
            <strong>English:</strong> ${question.english}
        </div>
        <p style="text-align: center; color: var(--text-muted); margin-bottom: 15px;">Tap words in correct order:</p>

        <div class="word-order-answer" id="${testId}WordOrderAnswer">
            <span class="placeholder-text">Tap words below to build the sentence...</span>
        </div>

        <div class="word-order-options" id="${testId}WordOrderOptions"></div>

        <button class="next-btn word-order-reset" onclick="resetWordOrder('${testId}')" style="margin-top: 15px;">Reset 重置</button>
    `;

    renderWordOrderOptions(testId, question.scrambled);
}

/**
 * Render match-translation question
 */
function renderMatchTranslation(container, question, testId) {
    container.innerHTML = `
        <div style="font-size: 4rem; text-align: center; margin: 20px 0;">${question.picture}</div>
        <div class="question" style="font-size: 2.5rem; color: var(--primary);">${question.chinese}</div>
        <div style="font-size: 1.2rem; color: var(--accent); text-align: center; margin-bottom: 15px;">${question.jyutping}</div>
        <p style="text-align: center; color: var(--text-muted); margin-bottom: 20px;">Select the correct English translation:</p>
        <div class="options" id="${testId}Options"></div>
    `;

    renderOptions(testId, question.options, question.answer, 'english');
}

/**
 * Render audio-identify question
 */
function renderAudioIdentify(container, question, testId) {
    container.innerHTML = `
        <div class="audio-question-container">
            <div style="font-size: 4rem; text-align: center; margin: 20px 0;">🔊</div>
            <button class="play-btn audio-play-large" onclick="playQuestionAudio('${escapeHtml(question.audio_text)}')" style="width: 80px; height: 80px; font-size: 2rem; margin: 20px auto; display: block;">
                ▶
            </button>
            <p style="text-align: center; color: var(--text); font-size: 1.2rem; margin-bottom: 20px;">Listen and select the correct word:</p>
        </div>
        <div class="options" id="${testId}Options"></div>
    `;

    // Auto-play audio
    setTimeout(() => playQuestionAudio(question.audio_text), 500);

    renderOptions(testId, question.options, question.answer);
}

/**
 * Render speaking question
 */
function renderSpeaking(container, question, testId) {
    // Hide the confirm button — speaking auto-advances
    const confirmBtn = document.getElementById(`${testId}ConfirmBtn`);
    if (confirmBtn) confirmBtn.style.display = 'none';

    const escapedChinese = escapeHtml(question.chinese);

    container.innerHTML = `
        <div class="speaking-prompt-card" style="text-align: center; padding: 20px;">
            <div style="font-size: 4rem; margin-bottom: 10px;">${question.picture}</div>
            <div style="font-size: 2.5rem; font-weight: 700; color: var(--text); margin-bottom: 8px;">${question.chinese}</div>
            <div style="font-size: 1rem; color: var(--text-muted); margin-bottom: 5px;">${question.english}</div>
            <button class="jyutping-reveal" onclick="this.querySelector('.jyutping-text').style.display='inline'; this.querySelector('.jyutping-hint').style.display='none';">
                <span class="jyutping-hint">👁 Show Jyutping</span>
                <span class="jyutping-text" style="display: none;">${question.jyutping}</span>
            </button>
            <div style="margin-top: 15px;">
                <button class="next-btn" onclick="playQuestionAudio('${escapedChinese}')" style="padding: 10px 25px; font-size: 1rem; margin-bottom: 15px; background: linear-gradient(135deg, #48bb78, #38a169);">
                    🔊 Listen
                </button>
            </div>
            <div style="margin-top: 10px;">
                <div id="${testId}VizContainer" style="display: none; margin: 0 auto 12px; max-width: 300px;">
                    <div id="${testId}WaveformBars" style="display: flex; align-items: center; justify-content: center; height: 50px; gap: 3px;"></div>
                    <div style="margin-top: 8px; position: relative; height: 4px; background: rgba(229,62,62,0.15); border-radius: 2px; overflow: hidden;">
                        <div id="${testId}CountdownBar" style="height: 100%; width: 100%; background: linear-gradient(90deg, #f56565, #e53e3e); border-radius: 2px; transition: width 0.1s linear;"></div>
                    </div>
                    <p style="color: var(--text-muted); font-size: 0.75rem; margin-top: 4px;" id="${testId}CountdownText">8s</p>
                </div>
                <button class="mic-btn" id="${testId}MicBtn">
                    🎤
                </button>
                <p style="color: var(--text-muted); font-size: 0.85rem; margin-top: 8px;" id="${testId}MicHint">Tap to speak</p>
            </div>
            <div id="${testId}SpeakingResult" style="display: none; margin-top: 15px;"></div>
        </div>
    `;

    // Wire up mic button
    const micBtn = document.getElementById(`${testId}MicBtn`);
    if (micBtn) {
        micBtn.addEventListener('click', function(e) {
            e.preventDefault();
            if (UnifiedTest._quizRecording) {
                stopQuizRecording(testId);
            } else {
                startQuizSpeakingRecognition(testId);
            }
        });
    }
}

// ==================== QUIZ SPEAKING RECOGNITION ====================

/**
 * Start speech recognition for a quiz speaking question
 */
function startQuizSpeakingRecognition(testId) {
    if (UnifiedTest._quizRecording || UnifiedTest.isAnswered) return;

    UnifiedTest._quizRecording = true;
    UnifiedTest._quizGotResult = false;

    const micBtn = document.getElementById(`${testId}MicBtn`);
    if (micBtn) micBtn.classList.add('recording');
    const micHint = document.getElementById(`${testId}MicHint`);
    if (micHint) micHint.textContent = 'Listening... tap to stop';

    // Start visualizer with testId prefix
    startQuizAudioVisualizer(testId);

    // Create speech recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
        showQuizSpeakingError(testId, 'Speech recognition not supported.');
        return;
    }

    const useFallback = typeof SpeakingPractice !== 'undefined' && SpeakingPractice.useFallbackLang;
    const recognition = new SpeechRecognition();
    recognition.lang = useFallback ? 'zh-HK' : 'yue-Hant-HK';
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.maxAlternatives = 5;

    UnifiedTest._quizRecognition = recognition;

    recognition.onresult = function(event) {
        UnifiedTest._quizGotResult = true;
        const results = event.results[0];
        let recognized = results[0].transcript.trim();

        const question = UnifiedTest.questions[UnifiedTest.currentQuestionIndex];
        const item = question.speakingItem;

        // Check all alternatives
        for (let i = 0; i < results.length; i++) {
            const alt = results[i].transcript.trim();
            if (typeof matchesSpeakingItem === 'function' && matchesSpeakingItem(alt, item)) {
                recognized = alt;
                break;
            }
        }

        stopQuizRecordingInternal(testId);
        handleQuizSpeakingResult(testId, recognized);
    };

    recognition.onerror = function(event) {
        console.warn('Quiz speech recognition error:', event.error, 'lang:', recognition.lang);
        stopQuizRecordingInternal(testId);

        if ((event.error === 'network' || event.error === 'no-speech') && typeof SpeakingPractice !== 'undefined' && !SpeakingPractice.useFallbackLang) {
            // yue-Hant-HK not working on this device, fall back to zh-HK
            console.log('Falling back to zh-HK for quiz speech recognition');
            SpeakingPractice.useFallbackLang = true;
            showQuizSpeakingError(testId, 'Switching to compatible speech mode. Please try again.');
        } else if (event.error === 'no-speech') {
            showQuizSpeakingError(testId, 'No speech detected. Please try again.');
        } else if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
            showQuizSpeakingError(testId, 'Microphone access denied. Please allow microphone access.');
        } else if (event.error === 'network') {
            showQuizSpeakingError(testId, 'Network error. Speech recognition requires internet access.');
        } else if (event.error === 'aborted') {
            // User-initiated abort
        } else {
            showQuizSpeakingError(testId, 'Could not recognize speech. Please try again.');
        }
    };

    recognition.onend = function() {
        if (UnifiedTest._quizRecording && !UnifiedTest._quizGotResult) {
            stopQuizRecordingInternal(testId);

            // If using yue-Hant-HK and got no result, auto-fallback to zh-HK
            if (typeof SpeakingPractice !== 'undefined' && !SpeakingPractice.useFallbackLang) {
                console.log('No result with yue-Hant-HK, falling back to zh-HK');
                SpeakingPractice.useFallbackLang = true;
                showQuizSpeakingError(testId, 'Switching to compatible speech mode. Please try again.');
            } else {
                showQuizSpeakingError(testId, 'No speech detected. Please try again.');
            }
        }
    };

    try {
        recognition.start();
    } catch (e) {
        console.warn('Recognition start error:', e);
        stopQuizRecordingInternal(testId);
    }

    // Auto-stop after 8 seconds
    UnifiedTest._quizAutoStop = setTimeout(() => {
        stopQuizRecording(testId);
    }, 8000);
}

/**
 * Stop quiz recording (user-initiated)
 */
function stopQuizRecording(testId) {
    if (!UnifiedTest._quizRecording) return;

    if (UnifiedTest._quizAutoStop) {
        clearTimeout(UnifiedTest._quizAutoStop);
        UnifiedTest._quizAutoStop = null;
    }

    stopQuizAudioVisualizer(testId);

    const micBtn = document.getElementById(`${testId}MicBtn`);
    if (micBtn) micBtn.classList.remove('recording');
    const micHint = document.getElementById(`${testId}MicHint`);
    if (micHint) micHint.textContent = 'Tap to speak';

    if (UnifiedTest._quizRecognition) {
        try { UnifiedTest._quizRecognition.stop(); } catch (e) { UnifiedTest._quizRecording = false; }
    } else {
        UnifiedTest._quizRecording = false;
    }
}

/**
 * Internal stop (called from recognition callbacks)
 */
function stopQuizRecordingInternal(testId) {
    UnifiedTest._quizRecording = false;

    if (UnifiedTest._quizAutoStop) {
        clearTimeout(UnifiedTest._quizAutoStop);
        UnifiedTest._quizAutoStop = null;
    }

    stopQuizAudioVisualizer(testId);

    const micBtn = document.getElementById(`${testId}MicBtn`);
    if (micBtn) micBtn.classList.remove('recording');
    const micHint = document.getElementById(`${testId}MicHint`);
    if (micHint) micHint.textContent = 'Tap to speak';
}

/**
 * Handle quiz speaking result
 */
function handleQuizSpeakingResult(testId, recognized) {
    const question = UnifiedTest.questions[UnifiedTest.currentQuestionIndex];
    const item = question.speakingItem;
    const isCorrect = typeof matchesSpeakingItem === 'function' && matchesSpeakingItem(recognized, item);

    UnifiedTest.isAnswered = true;

    // Store answer
    UnifiedTest.userAnswers.push({
        questionNumber: UnifiedTest.currentQuestionIndex + 1,
        type: 'speaking',
        picture: question.picture || '🎤',
        chinese: question.chinese,
        correctAnswer: question.chinese,
        userAnswer: recognized || '(no speech)',
        isCorrect: isCorrect
    });

    // Update score
    if (isCorrect) {
        UnifiedTest.score++;
        document.getElementById(`${testId}Score`).textContent = UnifiedTest.score;
        if (typeof showCelebration === 'function') showCelebration('🎉');
    } else {
        if (typeof showCelebration === 'function') showCelebration('💪');
    }

    // Update progress
    const progress = ((UnifiedTest.currentQuestionIndex + 1) / UnifiedTest.questions.length) * 100;
    document.getElementById(`${testId}Progress`).style.width = progress + '%';

    // Show inline result
    const resultDiv = document.getElementById(`${testId}SpeakingResult`);
    if (resultDiv) {
        resultDiv.style.display = 'block';
        resultDiv.innerHTML = `
            <div style="font-size: 2rem; margin-bottom: 8px;">${isCorrect ? '✅' : '❌'}</div>
            <div style="color: ${isCorrect ? '#48bb78' : '#f56565'}; font-weight: 700; margin-bottom: 8px;">
                ${isCorrect ? 'Correct! 正確！' : 'Not quite 再試！'}
            </div>
            <div style="background: var(--bg); border-radius: 12px; padding: 12px; margin-bottom: 8px;">
                <div style="margin-bottom: 6px;">
                    <span style="color: var(--text-muted); font-size: 0.85rem;">You said:</span>
                    <span style="font-size: 1.1rem; font-weight: 600; color: var(--text); margin-left: 6px;">${recognized || '(nothing detected)'}</span>
                </div>
                <div>
                    <span style="color: var(--text-muted); font-size: 0.85rem;">Expected:</span>
                    <span style="font-size: 1.1rem; font-weight: 600; color: var(--text); margin-left: 6px;">${question.chinese}</span>
                </div>
            </div>
        `;
    }

    // Hide mic button
    const micBtn = document.getElementById(`${testId}MicBtn`);
    if (micBtn) micBtn.style.display = 'none';
    const micHint = document.getElementById(`${testId}MicHint`);
    if (micHint) micHint.style.display = 'none';

    // Auto-advance after 2 seconds
    setTimeout(() => {
        UnifiedTest.currentQuestionIndex++;
        if (UnifiedTest.currentQuestionIndex >= UnifiedTest.questions.length) {
            endUnifiedTest(testId);
        } else {
            loadUnifiedQuestion(testId);
        }
    }, 2000);
}

/**
 * Show speaking error toast for quiz
 */
function showQuizSpeakingError(testId, message) {
    const toast = document.createElement('div');
    toast.style.cssText = 'position: fixed; bottom: 20px; left: 50%; transform: translateX(-50%); background: #f56565; color: white; padding: 12px 24px; border-radius: 12px; font-size: 0.95rem; z-index: 3000; box-shadow: 0 4px 15px rgba(0,0,0,0.2);';
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

// ==================== QUIZ AUDIO VISUALIZER ====================

/**
 * Start audio visualizer for quiz speaking question (prefixed element IDs)
 */
function startQuizAudioVisualizer(testId) {
    const vizContainer = document.getElementById(`${testId}VizContainer`);
    const barsContainer = document.getElementById(`${testId}WaveformBars`);
    if (!vizContainer || !barsContainer) return;

    vizContainer.style.display = 'block';

    const BAR_COUNT = 20;
    barsContainer.innerHTML = '';
    for (let i = 0; i < BAR_COUNT; i++) {
        const bar = document.createElement('div');
        bar.style.cssText = 'width: 8px; min-height: 4px; height: 4px; background: linear-gradient(180deg, #f56565, #e53e3e); border-radius: 4px; transition: height 0.05s ease;';
        barsContainer.appendChild(bar);
    }

    // Audio analyser
    try {
        if (!UnifiedTest._quizAudioCtx) {
            UnifiedTest._quizAudioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (UnifiedTest._quizAudioCtx.state === 'suspended') {
            UnifiedTest._quizAudioCtx.resume();
        }

        const connectAnalyser = function(stream) {
            const analyser = UnifiedTest._quizAudioCtx.createAnalyser();
            analyser.fftSize = 64;
            analyser.smoothingTimeConstant = 0.6;
            const source = UnifiedTest._quizAudioCtx.createMediaStreamSource(stream);
            source.connect(analyser);
            UnifiedTest._quizAnalyser = analyser;
            UnifiedTest._quizVizSource = source;

            const dataArray = new Uint8Array(analyser.frequencyBinCount);
            const bars = barsContainer.children;
            function draw() {
                if (!UnifiedTest._quizRecording) return;
                UnifiedTest._quizVizRAF = requestAnimationFrame(draw);
                analyser.getByteFrequencyData(dataArray);
                const step = Math.floor(dataArray.length / BAR_COUNT) || 1;
                for (let i = 0; i < BAR_COUNT && i < bars.length; i++) {
                    const val = dataArray[i * step] || 0;
                    bars[i].style.height = Math.max(4, (val / 255) * 48) + 'px';
                }
            }
            UnifiedTest._quizVizRAF = requestAnimationFrame(draw);
        };

        if (typeof SpeakingPractice !== 'undefined' && SpeakingPractice.mediaStream && SpeakingPractice.mediaStream.active) {
            connectAnalyser(SpeakingPractice.mediaStream);
        } else {
            navigator.mediaDevices.getUserMedia({ audio: true }).then(function(stream) {
                if (typeof SpeakingPractice !== 'undefined') {
                    SpeakingPractice.mediaStream = stream;
                    SpeakingPractice.micPermissionGranted = true;
                }
                connectAnalyser(stream);
            }).catch(function() {
                // Fallback animation
                const bars = barsContainer.children;
                function draw() {
                    if (!UnifiedTest._quizRecording) return;
                    UnifiedTest._quizVizRAF = requestAnimationFrame(draw);
                    for (let i = 0; i < BAR_COUNT && i < bars.length; i++) {
                        const centerWeight = 1 - Math.abs(i - BAR_COUNT / 2) / (BAR_COUNT / 2);
                        bars[i].style.height = Math.max(4, (Math.random() * 30 + 10) * (0.5 + centerWeight * 0.5)) + 'px';
                    }
                }
                UnifiedTest._quizVizRAF = requestAnimationFrame(draw);
            });
        }
    } catch (e) {
        // Fallback
    }

    // Countdown timer
    UnifiedTest._quizCountdownStart = Date.now();
    const DURATION = 8000;
    UnifiedTest._quizCountdownInterval = setInterval(function() {
        const elapsed = Date.now() - UnifiedTest._quizCountdownStart;
        const remaining = Math.max(0, DURATION - elapsed);
        const pct = (remaining / DURATION) * 100;

        const bar = document.getElementById(`${testId}CountdownBar`);
        if (bar) bar.style.width = pct + '%';
        const text = document.getElementById(`${testId}CountdownText`);
        if (text) text.textContent = Math.ceil(remaining / 1000) + 's';

        if (remaining <= 0) {
            clearInterval(UnifiedTest._quizCountdownInterval);
            UnifiedTest._quizCountdownInterval = null;
        }
    }, 100);
}

/**
 * Stop quiz audio visualizer
 */
function stopQuizAudioVisualizer(testId) {
    if (UnifiedTest._quizVizRAF) {
        cancelAnimationFrame(UnifiedTest._quizVizRAF);
        UnifiedTest._quizVizRAF = null;
    }
    if (UnifiedTest._quizCountdownInterval) {
        clearInterval(UnifiedTest._quizCountdownInterval);
        UnifiedTest._quizCountdownInterval = null;
    }
    if (UnifiedTest._quizVizSource) {
        try { UnifiedTest._quizVizSource.disconnect(); } catch (e) { /* ignore */ }
        UnifiedTest._quizVizSource = null;
    }
    UnifiedTest._quizAnalyser = null;

    const vizContainer = document.getElementById(`${testId}VizContainer`);
    if (vizContainer) vizContainer.style.display = 'none';
}

// ==================== OPTION RENDERERS ====================

/**
 * Render standard text options
 */
function renderOptions(testId, options, answer, optionType = 'chinese') {
    const optionsContainer = document.getElementById(`${testId}Options`);
    optionsContainer.innerHTML = '';

    options.forEach((option, idx) => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        if (optionType === 'jyutping') {
            btn.classList.add('jyutping-option');
        }
        btn.textContent = option;
        btn.dataset.answer = option;
        btn.onclick = () => selectUnifiedAnswer(testId, option, btn);
        optionsContainer.appendChild(btn);
    });
}

/**
 * Render picture options
 */
function renderPictureOptions(testId, options, answer) {
    const optionsContainer = document.getElementById(`${testId}Options`);
    optionsContainer.innerHTML = '';

    options.forEach((option, idx) => {
        const btn = document.createElement('button');
        btn.className = 'option-btn picture-option';
        btn.innerHTML = `<span style="font-size: 3rem;">${option}</span>`;
        btn.dataset.answer = option;
        btn.onclick = () => selectUnifiedAnswer(testId, option, btn);
        optionsContainer.appendChild(btn);
    });
}

/**
 * Render word order options
 */
function renderWordOrderOptions(testId, words) {
    const optionsContainer = document.getElementById(`${testId}WordOrderOptions`);
    optionsContainer.innerHTML = '';

    words.forEach((word, idx) => {
        const btn = document.createElement('button');
        btn.className = 'word-order-word';
        btn.textContent = word;
        btn.dataset.word = word;
        btn.dataset.index = idx;
        btn.onclick = () => selectWordOrderWord(testId, word, idx, btn);
        optionsContainer.appendChild(btn);
    });
}

/**
 * Handle word order word selection
 */
function selectWordOrderWord(testId, word, idx, btn) {
    if (UnifiedTest.isAnswered) return;

    // Add word to selected
    UnifiedTest.wordOrderSelected.push({ word, idx });
    btn.classList.add('used');
    btn.disabled = true;

    // Update answer display
    updateWordOrderAnswer(testId);

    // Check if all words selected
    const question = UnifiedTest.questions[UnifiedTest.currentQuestionIndex];
    if (UnifiedTest.wordOrderSelected.length === question.answer.length) {
        document.getElementById(`${testId}ConfirmBtn`).style.display = 'block';
    }
}

/**
 * Update word order answer display
 */
function updateWordOrderAnswer(testId) {
    const answerContainer = document.getElementById(`${testId}WordOrderAnswer`);

    if (UnifiedTest.wordOrderSelected.length === 0) {
        answerContainer.innerHTML = '<span class="placeholder-text">Tap words below to build the sentence...</span>';
    } else {
        answerContainer.innerHTML = UnifiedTest.wordOrderSelected.map((item, idx) => `
            <span class="word-order-selected" onclick="removeWordOrderWord('${testId}', ${idx})">${item.word}</span>
        `).join('');
    }
}

/**
 * Remove word from word order selection
 */
function removeWordOrderWord(testId, selectedIdx) {
    if (UnifiedTest.isAnswered) return;

    const removed = UnifiedTest.wordOrderSelected.splice(selectedIdx, 1)[0];

    // Re-enable the word button
    const wordButtons = document.querySelectorAll(`#${testId}WordOrderOptions .word-order-word`);
    wordButtons.forEach(btn => {
        if (btn.dataset.index == removed.idx) {
            btn.classList.remove('used');
            btn.disabled = false;
        }
    });

    // Hide confirm button
    document.getElementById(`${testId}ConfirmBtn`).style.display = 'none';

    updateWordOrderAnswer(testId);
}

/**
 * Reset word order selection
 */
function resetWordOrder(testId) {
    if (UnifiedTest.isAnswered) return;

    UnifiedTest.wordOrderSelected = [];

    // Re-enable all word buttons
    const wordButtons = document.querySelectorAll(`#${testId}WordOrderOptions .word-order-word`);
    wordButtons.forEach(btn => {
        btn.classList.remove('used');
        btn.disabled = false;
    });

    // Hide confirm button
    document.getElementById(`${testId}ConfirmBtn`).style.display = 'none';

    updateWordOrderAnswer(testId);
}

// ==================== ANSWER HANDLING ====================

/**
 * Select an answer (for non-word-order questions)
 */
function selectUnifiedAnswer(testId, answer, btn) {
    if (UnifiedTest.isAnswered) return;

    // Remove previous selection
    const allButtons = document.querySelectorAll(`#${testId}Options .option-btn`);
    allButtons.forEach(b => {
        b.classList.remove('selected');
    });

    // Highlight selected
    btn.classList.add('selected');
    UnifiedTest.selectedAnswer = answer;

    // Show confirm button
    document.getElementById(`${testId}ConfirmBtn`).style.display = 'block';
}

/**
 * Confirm the selected answer
 */
function confirmUnifiedAnswer(testId) {
    if (UnifiedTest.isAnswered) return;

    const question = UnifiedTest.questions[UnifiedTest.currentQuestionIndex];
    let isCorrect = false;
    let userAnswer = '';

    if (question.type === 'word_order') {
        userAnswer = UnifiedTest.wordOrderSelected.map(item => item.word).join('');
        const correctAnswer = question.answer.join('');
        isCorrect = userAnswer === correctAnswer;
    } else {
        userAnswer = UnifiedTest.selectedAnswer;
        isCorrect = userAnswer === question.answer;
    }

    UnifiedTest.isAnswered = true;

    // Store answer for review
    UnifiedTest.userAnswers.push({
        questionNumber: UnifiedTest.currentQuestionIndex + 1,
        type: question.type,
        picture: question.picture || '',
        chinese: question.chinese || question.audio_text || '',
        correctAnswer: Array.isArray(question.answer) ? question.answer.join('') : question.answer,
        userAnswer: userAnswer,
        isCorrect: isCorrect
    });

    // Update score
    if (isCorrect) {
        UnifiedTest.score++;
        document.getElementById(`${testId}Score`).textContent = UnifiedTest.score;
        if (typeof showCelebration === 'function') showCelebration('🎉');
    } else {
        if (typeof showCelebration === 'function') showCelebration('💪');
    }

    // Show feedback
    showAnswerFeedback(testId, question, isCorrect);

    // Update progress
    const progress = ((UnifiedTest.currentQuestionIndex + 1) / UnifiedTest.questions.length) * 100;
    document.getElementById(`${testId}Progress`).style.width = progress + '%';

    // Hide confirm button
    document.getElementById(`${testId}ConfirmBtn`).style.display = 'none';

    // Next question after delay
    setTimeout(() => {
        UnifiedTest.currentQuestionIndex++;
        if (UnifiedTest.currentQuestionIndex >= UnifiedTest.questions.length) {
            endUnifiedTest(testId);
        } else {
            loadUnifiedQuestion(testId);
        }
    }, 1500);
}

/**
 * Show feedback for answer
 */
function showAnswerFeedback(testId, question, isCorrect) {
    if (question.type === 'word_order') {
        const answerContainer = document.getElementById(`${testId}WordOrderAnswer`);
        answerContainer.classList.add(isCorrect ? 'correct' : 'incorrect');

        if (!isCorrect) {
            // Show correct answer below
            const correctHtml = `<div class="correct-answer-display">✓ ${question.answer.join('')}</div>`;
            answerContainer.insertAdjacentHTML('afterend', correctHtml);
        }
    } else {
        const allButtons = document.querySelectorAll(`#${testId}Options .option-btn`);
        allButtons.forEach(btn => {
            btn.disabled = true;
            if (btn.dataset.answer === question.answer) {
                btn.classList.add('correct');
            } else if (btn.dataset.answer === UnifiedTest.selectedAnswer && !isCorrect) {
                btn.classList.add('incorrect');
            }
        });
    }
}

// ==================== TEST COMPLETION ====================

/**
 * End test and show results
 */
function endUnifiedTest(testId) {
    const totalQuestions = UnifiedTest.questions.length;
    const percentage = Math.round((UnifiedTest.score / totalQuestions) * 100);

    // Track score
    if (typeof trackTestScore === 'function') {
        trackTestScore(testId, UnifiedTest.currentSectionId, percentage);
    }

    let emoji = percentage >= 90 ? '🏆' : percentage >= 75 ? '🌟' : percentage >= 60 ? '⭐' : '📚';
    let message = percentage >= 90 ? "Outstanding! You're a Cantonese master!" :
                  percentage >= 75 ? "Great job! You're doing excellent!" :
                  percentage >= 60 ? "Good work! Keep practicing!" :
                  "Keep learning! You're getting better!";

    // Build review HTML
    let reviewHTML = '<div class="answer-review"><div class="answer-review-title">📊 Your Answers:</div>';
    reviewHTML += '<div style="max-height: 400px; overflow-y: auto;">';

    UnifiedTest.userAnswers.forEach((ans) => {
        const typeIcon = getQuestionTypeIcon(ans.type);
        reviewHTML += `
            <div class="review-item ${ans.isCorrect ? 'correct' : 'incorrect'}">
                <div class="review-question">
                    <span style="font-size: 1.3rem;">${ans.isCorrect ? '✅' : '❌'} ${ans.picture || typeIcon}</span>
                    Q${ans.questionNumber}: ${ans.chinese}
                </div>
                <div class="review-answer">
                    <span class="review-correct-answer">✓ ${ans.correctAnswer}</span>
                    ${!ans.isCorrect ? `<span class="review-your-answer">✗ ${ans.userAnswer}</span>` : ''}
                </div>
            </div>
        `;
    });

    reviewHTML += '</div></div>';

    const container = document.getElementById(`${testId}Quiz`);
    container.innerHTML = `
        <h2 class="game-title">🎊 Section Complete! 🎊</h2>
        <div style="text-align: center; font-size: 4rem; margin: 20px 0;">${emoji}</div>
        <div style="text-align: center; font-size: 2rem; font-weight: 700; color: var(--primary); margin-bottom: 10px;">
            You scored ${UnifiedTest.score} out of ${totalQuestions}!
        </div>
        <div style="text-align: center; font-size: 1.5rem; font-weight: 700; color: var(--purple); margin-bottom: 20px;">
            ${percentage}% Correct
        </div>
        <div style="text-align: center; font-size: 1.2rem; color: var(--text); margin-bottom: 25px;">
            ${message}
        </div>
        ${reviewHTML}
        <div style="display: flex; gap: 15px; justify-content: center; flex-wrap: wrap; margin-top: 25px;">
            <button class="next-btn" onclick="startUnifiedSection('${testId}', '${UnifiedTest.currentSectionId}')">Retake Section 🔄</button>
            <button class="next-btn" onclick="initUnifiedTest('${testId}')">Choose Section 📚</button>
        </div>
    `;
}

function getQuestionTypeIcon(type) {
    const icons = {
        fill_chinese: '✏️',
        select_jyutping: '🗣️',
        select_picture: '🖼️',
        word_order: '🔀',
        match_translation: '🔄',
        audio_identify: '🔊',
        speaking: '🎤'
    };
    return icons[type] || '❓';
}

// ==================== AUDIO PLAYBACK ====================

function playQuestionAudio(text) {
    if (typeof safeSpeechSynthesis === 'function') {
        safeSpeechSynthesis(text);
    } else if (typeof playSound === 'function') {
        playSound(text, '');
    }
}

// ==================== UTILITY FUNCTIONS ====================

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML.replace(/'/g, "\\'").replace(/"/g, '\\"');
}

// ==================== LEGACY TEST SUPPORT ====================
// Keep these for backward compatibility with old test system

let currentTestSection = 0;
let currentTestQuestion = 0;
let testScore = 0;
let testAnswered = false;
let selectedAnswer = null;
let userAnswers = [];
let currentTestQuestionData = null;

function playTestQuestion() {
    if (currentTestQuestionData) {
        const fullSentence = currentTestQuestionData.chinese.replace('___', currentTestQuestionData.answer);
        playQuestionAudio(fullSentence);
    }
}

function startTestSection(sectionIndex) {
    // Redirect to new unified test system
    startUnifiedSection('test1', testConfig.test1.sections[sectionIndex].id);
}

function initTest() {
    initUnifiedTest('test1');
}

function initTest2() {
    initUnifiedTest('test2');
}

function initTest3() {
    initUnifiedTest('test3');
}

function initTest4() {
    initUnifiedTest('test4');
}

function initTest5() {
    initUnifiedTest('test5');
}

// ==================== INITIALIZATION ====================

function initQuiz() {
    // Export functions globally
    window.checkStoryAnswer = checkStoryAnswer;
    window.resetStoryQuiz = resetStoryQuiz;
    window.playTestQuestion = playTestQuestion;
    window.startTestSection = startTestSection;
    window.initTest = initTest;
    window.initTest2 = initTest2;
    window.initTest3 = initTest3;
    window.initTest4 = initTest4;
    window.initTest5 = initTest5;
    window.initUnifiedTest = initUnifiedTest;
    window.startUnifiedSection = startUnifiedSection;
    window.selectUnifiedAnswer = selectUnifiedAnswer;
    window.confirmUnifiedAnswer = confirmUnifiedAnswer;
    window.selectWordOrderWord = selectWordOrderWord;
    window.removeWordOrderWord = removeWordOrderWord;
    window.resetWordOrder = resetWordOrder;
    window.playQuestionAudio = playQuestionAudio;
    window.startQuizSpeakingRecognition = startQuizSpeakingRecognition;
    window.stopQuizRecording = stopQuizRecording;
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initQuiz);
} else {
    initQuiz();
}

// Export module
window.CantoneseQuiz = {
    checkStoryAnswer,
    resetStoryQuiz,
    initTest,
    initTest2,
    initTest3,
    initTest4,
    initTest5,
    initUnifiedTest,
    startUnifiedSection
};
