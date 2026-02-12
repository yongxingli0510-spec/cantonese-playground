/**
 * ==================== SPEAKING PRACTICE MODULE ====================
 * Speech recognition and recording for Cantonese pronunciation practice
 * Uses Web Speech API (SpeechRecognition) and MediaRecorder
 * ================================================================
 */

// ==================== STATE ====================

const SpeakingPractice = {
    currentCategory: null,
    currentItems: [],
    currentIndex: 0,
    score: 0,
    totalAttempted: 0,
    mediaRecorder: null,
    audioChunks: [],
    recordedBlob: null,
    recordedUrl: null,
    recognition: null,
    mediaStream: null,
    isRecording: false,
    isTestMode: false,
    currentTestId: null,
    currentSectionId: null,
    autoStopTimer: null,
    micPermissionGranted: false,
    touchActive: false
};

// ==================== SPEECH RECOGNITION ====================

/**
 * Create a fresh SpeechRecognition instance for each recording session
 * @returns {SpeechRecognition|null}
 */
function createSpeechRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
        return null;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'yue-Hant-HK';
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.maxAlternatives = 3;

    recognition.onresult = function(event) {
        const results = event.results[0];
        let recognized = results[0].transcript.trim();

        // Check all alternatives for a match
        const expected = SpeakingPractice.currentItems[SpeakingPractice.currentIndex]?.chinese || '';
        let bestMatch = recognized;

        for (let i = 0; i < results.length; i++) {
            const alt = results[i].transcript.trim();
            if (alt === expected || expected.includes(alt) || alt.includes(expected)) {
                bestMatch = alt;
                break;
            }
        }

        stopRecordingInternal();
        showSpeakingResult(bestMatch, expected);
    };

    recognition.onerror = function(event) {
        console.warn('Speech recognition error:', event.error);
        stopRecordingInternal();

        if (event.error === 'no-speech') {
            showSpeakingError('No speech detected. Please try again.');
        } else if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
            showSpeakingError('Microphone access denied. Please allow microphone access and use HTTPS.');
        } else if (event.error === 'network') {
            showSpeakingError('Network error. Speech recognition requires internet access.');
        } else if (event.error === 'aborted') {
            // User-initiated abort, no error to show
        } else {
            showSpeakingError('Could not recognize speech. Please try again.');
        }
    };

    recognition.onend = function() {
        if (SpeakingPractice.isRecording) {
            // Recognition ended without result - force stop
            stopRecordingInternal();
            showSpeakingError('No speech detected. Please try again.');
        }
    };

    return recognition;
}

/**
 * Check if Speech Recognition API is available
 * @returns {boolean}
 */
function isSpeechRecognitionAvailable() {
    return !!(window.SpeechRecognition || window.webkitSpeechRecognition);
}

// ==================== MEDIA RECORDER ====================

/**
 * Request microphone permission and set up MediaRecorder
 * Reuses existing stream if still active
 * @returns {Promise<boolean>}
 */
async function ensureMicAccess() {
    // Reuse existing active stream
    if (SpeakingPractice.mediaStream && SpeakingPractice.mediaStream.active) {
        // Stream still active, just recreate MediaRecorder if needed
        if (!SpeakingPractice.mediaRecorder || SpeakingPractice.mediaRecorder.state === 'inactive') {
            setupMediaRecorder(SpeakingPractice.mediaStream);
        }
        return true;
    }

    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        SpeakingPractice.mediaStream = stream;
        SpeakingPractice.micPermissionGranted = true;
        setupMediaRecorder(stream);
        return true;
    } catch (err) {
        console.error('Microphone access error:', err);
        SpeakingPractice.micPermissionGranted = false;
        return false;
    }
}

/**
 * Create MediaRecorder from a stream
 * @param {MediaStream} stream
 */
function setupMediaRecorder(stream) {
    try {
        const mediaRecorder = new MediaRecorder(stream);
        SpeakingPractice.mediaRecorder = mediaRecorder;

        mediaRecorder.ondataavailable = function(event) {
            if (event.data.size > 0) {
                SpeakingPractice.audioChunks.push(event.data);
            }
        };

        mediaRecorder.onstop = function() {
            if (SpeakingPractice.audioChunks.length > 0) {
                SpeakingPractice.recordedBlob = new Blob(SpeakingPractice.audioChunks, { type: 'audio/webm' });
                if (SpeakingPractice.recordedUrl) {
                    URL.revokeObjectURL(SpeakingPractice.recordedUrl);
                }
                SpeakingPractice.recordedUrl = URL.createObjectURL(SpeakingPractice.recordedBlob);
            }
        };
    } catch (err) {
        console.warn('MediaRecorder setup error:', err);
    }
}

// ==================== ENTRY POINTS ====================

/**
 * Start speaking practice from a vocabulary category page
 * @param {string} category - Vocabulary category key
 */
async function startSpeakingPractice(category) {
    if (typeof vocabularyData === 'undefined' || !vocabularyData[category]) {
        console.error('Vocabulary data not found for category:', category);
        return;
    }

    // Check Speech Recognition support first (no permission needed)
    if (!isSpeechRecognitionAvailable()) {
        showSpeakingModal(`
            <div style="text-align: center; padding: 30px;">
                <div style="font-size: 3rem; margin-bottom: 15px;">🗣️</div>
                <h3 style="color: var(--text); margin-bottom: 10px;">Speech Recognition Not Supported</h3>
                <p style="color: var(--text-muted); margin-bottom: 20px;">Please use Google Chrome for the best experience with speaking practice.</p>
                <button class="next-btn" onclick="closeSpeakingPractice()">Close</button>
            </div>
        `);
        return;
    }

    SpeakingPractice.isTestMode = false;
    SpeakingPractice.currentCategory = category;
    SpeakingPractice.currentItems = shuffleArray([...vocabularyData[category]]);
    SpeakingPractice.currentIndex = 0;
    SpeakingPractice.score = 0;
    SpeakingPractice.totalAttempted = 0;

    showSpeakingModal('');
    renderSpeakingPrompt();
}

/**
 * Show the speaking modal with content
 * @param {string} html
 */
function showSpeakingModal(html) {
    const modal = document.getElementById('speakingModal');
    if (modal) {
        modal.style.display = 'flex';
    }
    const content = document.getElementById('speakingContent');
    if (content) {
        content.innerHTML = html;
    }
}

/**
 * Start speaking test from Test 6 section
 * @param {string} sectionId - Section ID from test config
 */
async function startSpeakingTest(sectionId) {
    const test = testConfig && testConfig.test6;
    if (!test) {
        console.error('Test 6 config not found');
        return;
    }

    const section = test.sections.find(s => s.id === sectionId);
    if (!section) {
        console.error('Section not found:', sectionId);
        return;
    }

    if (!isSpeechRecognitionAvailable()) {
        document.getElementById('test6Quiz').style.display = 'block';
        document.getElementById('test6SectionSelect').style.display = 'none';
        document.getElementById('test6Content').innerHTML = `
            <div style="text-align: center; padding: 30px;">
                <div style="font-size: 3rem; margin-bottom: 15px;">🗣️</div>
                <h3 style="color: var(--text); margin-bottom: 10px;">Speech Recognition Not Supported</h3>
                <p style="color: var(--text-muted); margin-bottom: 20px;">Please use Google Chrome for the best experience.</p>
                <button class="next-btn" onclick="backToTest6Sections()">Back</button>
            </div>
        `;
        return;
    }

    SpeakingPractice.isTestMode = true;
    SpeakingPractice.currentTestId = 'test6';
    SpeakingPractice.currentSectionId = sectionId;
    SpeakingPractice.score = 0;
    SpeakingPractice.totalAttempted = 0;

    // Gather vocabulary from section categories
    let items = [];
    section.categories.forEach(cat => {
        if (vocabularyData[cat]) {
            items = items.concat(vocabularyData[cat]);
        }
    });

    SpeakingPractice.currentItems = shuffleArray(items).slice(0, section.questionCount || 10);
    SpeakingPractice.currentIndex = 0;

    // Show test quiz area
    document.getElementById('test6SectionSelect').style.display = 'none';
    const quizArea = document.getElementById('test6Quiz');
    quizArea.style.display = 'block';

    renderSpeakingPrompt();
}

// ==================== UI RENDERING ====================

/**
 * Render the speaking prompt card
 */
function renderSpeakingPrompt() {
    const item = SpeakingPractice.currentItems[SpeakingPractice.currentIndex];
    if (!item) {
        showSpeakingComplete();
        return;
    }

    const total = SpeakingPractice.currentItems.length;
    const current = SpeakingPractice.currentIndex + 1;
    const container = SpeakingPractice.isTestMode
        ? document.getElementById('test6Content')
        : document.getElementById('speakingContent');

    if (!container) return;

    const progressHTML = `
        <div class="speaking-progress">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                <span style="font-size: 0.9rem; color: var(--text-muted);">Question ${current} / ${total}</span>
                <span style="font-size: 0.9rem; color: var(--text-muted);">Score: ${SpeakingPractice.score} / ${SpeakingPractice.totalAttempted}</span>
            </div>
            <div class="progress-bar">
                <div class="progress-fill" style="width: ${(current / total) * 100}%"></div>
            </div>
        </div>
    `;

    // Escape single quotes for onclick
    const escapedChinese = item.chinese.replace(/'/g, "\\'");

    container.innerHTML = `
        ${progressHTML}
        <div class="speaking-prompt-card">
            <div style="font-size: 4rem; margin-bottom: 10px;">${item.icon || ''}</div>
            <div style="font-size: 2.5rem; font-weight: 700; color: var(--text); margin-bottom: 8px;">${item.chinese}</div>
            <div style="font-size: 1rem; color: var(--text-muted); margin-bottom: 5px;">${item.english}</div>
            <button class="jyutping-reveal" onclick="this.querySelector('.jyutping-text').style.display='inline'; this.querySelector('.jyutping-hint').style.display='none';">
                <span class="jyutping-hint">👁 Show Jyutping</span>
                <span class="jyutping-text" style="display: none;">${item.jyutping}</span>
            </button>
            <div style="margin-top: 15px;">
                <button class="next-btn" onclick="playSpeakingReference('${escapedChinese}')" style="padding: 10px 25px; font-size: 1rem; margin-bottom: 15px; background: linear-gradient(135deg, #48bb78, #38a169);">
                    🔊 Listen
                </button>
            </div>
            <div style="margin-top: 10px;">
                <button class="mic-btn" id="micBtn">
                    🎤
                </button>
                <p style="color: var(--text-muted); font-size: 0.85rem; margin-top: 8px;" id="micHint">Tap to speak</p>
            </div>
        </div>
    `;

    // Tap-to-toggle: tap once to start, tap again to stop
    const micBtn = document.getElementById('micBtn');
    if (micBtn) {
        micBtn.addEventListener('click', function(e) {
            e.preventDefault();
            if (SpeakingPractice.isRecording) {
                stopRecording();
            } else {
                startRecording();
            }
        });
    }
}

/**
 * Show the result after speech recognition
 * @param {string} recognized - What was recognized
 * @param {string} expected - What was expected
 */
function showSpeakingResult(recognized, expected) {
    SpeakingPractice.totalAttempted++;

    // Check for match (exact, contains, or partial)
    const isCorrect = recognized === expected ||
        recognized.includes(expected) ||
        expected.includes(recognized) ||
        normalized(recognized) === normalized(expected);

    if (isCorrect) {
        SpeakingPractice.score++;
        if (typeof showCelebration === 'function') {
            showCelebration('🎉');
        }
    }

    const container = SpeakingPractice.isTestMode
        ? document.getElementById('test6Content')
        : document.getElementById('speakingContent');

    if (!container) return;

    const item = SpeakingPractice.currentItems[SpeakingPractice.currentIndex];
    const total = SpeakingPractice.currentItems.length;
    const current = SpeakingPractice.currentIndex + 1;
    const hasNext = SpeakingPractice.currentIndex < SpeakingPractice.currentItems.length - 1;
    const escapedChinese = item.chinese.replace(/'/g, "\\'");

    const progressHTML = `
        <div class="speaking-progress">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                <span style="font-size: 0.9rem; color: var(--text-muted);">Question ${current} / ${total}</span>
                <span style="font-size: 0.9rem; color: var(--text-muted);">Score: ${SpeakingPractice.score} / ${SpeakingPractice.totalAttempted}</span>
            </div>
            <div class="progress-bar">
                <div class="progress-fill" style="width: ${(current / total) * 100}%"></div>
            </div>
        </div>
    `;

    container.innerHTML = `
        ${progressHTML}
        <div class="speaking-result">
            <div style="font-size: 3rem; margin-bottom: 10px;">${isCorrect ? '✅' : '❌'}</div>
            <h3 style="color: ${isCorrect ? '#48bb78' : '#f56565'}; margin-bottom: 15px;">
                ${isCorrect ? 'Correct! 正確！' : 'Try again! 再試！'}
            </h3>
            <div style="background: var(--bg); border-radius: 15px; padding: 15px; margin-bottom: 15px;">
                <div style="margin-bottom: 8px;">
                    <span style="color: var(--text-muted); font-size: 0.9rem;">You said:</span>
                    <span style="font-size: 1.3rem; font-weight: 600; color: var(--text); margin-left: 8px;">${recognized || '(nothing detected)'}</span>
                </div>
                <div>
                    <span style="color: var(--text-muted); font-size: 0.9rem;">Expected:</span>
                    <span style="font-size: 1.3rem; font-weight: 600; color: var(--text); margin-left: 8px;">${expected}</span>
                </div>
            </div>
            <div style="display: flex; gap: 10px; justify-content: center; flex-wrap: wrap; margin-bottom: 15px;">
                <button class="next-btn" onclick="playSpeakingReference('${escapedChinese}')" style="padding: 10px 20px; font-size: 0.95rem; background: linear-gradient(135deg, #48bb78, #38a169);">
                    🔊 Reference
                </button>
            </div>
            <div style="display: flex; gap: 10px; justify-content: center; flex-wrap: wrap;">
                <button class="next-btn" onclick="retrySpeakingPrompt()" style="padding: 12px 30px; font-size: 1rem; background: linear-gradient(135deg, #ed8936, #dd6b20);">
                    🔄 Try Again
                </button>
                ${hasNext ? `
                    <button class="next-btn" onclick="nextSpeakingPrompt()" style="padding: 12px 30px; font-size: 1rem;">
                        ➡️ Next
                    </button>
                ` : `
                    <button class="next-btn" onclick="showSpeakingComplete()" style="padding: 12px 30px; font-size: 1rem;">
                        🏁 Finish
                    </button>
                `}
            </div>
        </div>
    `;
}

/**
 * Show error message in speaking UI
 * @param {string} message
 */
function showSpeakingError(message) {
    // Re-render prompt so user can try again
    renderSpeakingPrompt();

    // Add error toast
    const toast = document.createElement('div');
    toast.style.cssText = 'position: fixed; bottom: 20px; left: 50%; transform: translateX(-50%); background: #f56565; color: white; padding: 12px 24px; border-radius: 12px; font-size: 0.95rem; z-index: 3000; box-shadow: 0 4px 15px rgba(0,0,0,0.2);';
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

/**
 * Show completion screen
 */
function showSpeakingComplete() {
    const container = SpeakingPractice.isTestMode
        ? document.getElementById('test6Content')
        : document.getElementById('speakingContent');

    if (!container) return;

    const score = SpeakingPractice.score;
    const total = SpeakingPractice.totalAttempted;
    const percentage = total > 0 ? Math.round((score / total) * 100) : 0;

    let emoji = '🌟';
    let message = 'Great effort!';
    if (percentage >= 90) { emoji = '🏆'; message = 'Amazing! 太好了！'; }
    else if (percentage >= 70) { emoji = '🌟'; message = 'Well done! 做得好！'; }
    else if (percentage >= 50) { emoji = '👍'; message = 'Good try! 加油！'; }
    else { emoji = '💪'; message = 'Keep practicing! 繼續努力！'; }

    if (typeof showCelebration === 'function' && percentage >= 70) {
        showCelebration('🎉');
    }

    if (typeof trackTestScore === 'function' && SpeakingPractice.isTestMode) {
        trackTestScore('speaking', score, total);
    }

    container.innerHTML = `
        <div style="text-align: center; padding: 20px;">
            <div style="font-size: 4rem; margin-bottom: 15px;">${emoji}</div>
            <h2 style="color: var(--text); margin-bottom: 10px;">${message}</h2>
            <div style="font-size: 1.5rem; font-weight: 700; color: var(--primary); margin-bottom: 5px;">
                ${score} / ${total}
            </div>
            <div style="font-size: 1.1rem; color: var(--text-muted); margin-bottom: 25px;">
                ${percentage}% correct
            </div>
            <div style="display: flex; gap: 10px; justify-content: center; flex-wrap: wrap;">
                ${SpeakingPractice.isTestMode ? `
                    <button class="next-btn" onclick="backToTest6Sections()" style="padding: 12px 30px;">
                        📋 Back to Sections
                    </button>
                ` : `
                    <button class="next-btn" onclick="restartSpeakingPractice()" style="padding: 12px 30px; background: linear-gradient(135deg, #ed8936, #dd6b20);">
                        🔄 Try Again
                    </button>
                    <button class="next-btn" onclick="closeSpeakingPractice()" style="padding: 12px 30px;">
                        ✅ Done
                    </button>
                `}
            </div>
        </div>
    `;
}

// ==================== RECORDING CONTROLS ====================

/**
 * Start recording audio and speech recognition
 */
function startRecording() {
    if (SpeakingPractice.isRecording) return;

    SpeakingPractice.isRecording = true;
    SpeakingPractice.audioChunks = [];

    // Visual feedback
    const micBtn = document.getElementById('micBtn');
    if (micBtn) {
        micBtn.classList.add('recording');
    }
    const micHint = document.getElementById('micHint');
    if (micHint) {
        micHint.textContent = 'Listening... tap to stop';
    }

    // Reuse existing SpeechRecognition instance to avoid repeated permission prompts.
    if (!SpeakingPractice.recognition) {
        SpeakingPractice.recognition = createSpeechRecognition();
    }
    if (SpeakingPractice.recognition) {
        try {
            SpeakingPractice.recognition.start();
        } catch (e) {
            console.warn('Recognition start error:', e);
            // If start fails (e.g., instance in bad state), recreate as fallback
            SpeakingPractice.recognition = createSpeechRecognition();
            if (SpeakingPractice.recognition) {
                try {
                    SpeakingPractice.recognition.start();
                } catch (e2) {
                    console.warn('Recognition retry error:', e2);
                }
            }
        }
    }

    // Auto-stop after 8 seconds (longer to allow time for permission prompt on first use)
    SpeakingPractice.autoStopTimer = setTimeout(() => {
        stopRecording();
    }, 8000);
}

/**
 * Stop recording (user-initiated)
 */
function stopRecording() {
    if (!SpeakingPractice.isRecording) return;

    // Clear auto-stop timer
    if (SpeakingPractice.autoStopTimer) {
        clearTimeout(SpeakingPractice.autoStopTimer);
        SpeakingPractice.autoStopTimer = null;
    }

    // Visual feedback
    const micBtn = document.getElementById('micBtn');
    if (micBtn) {
        micBtn.classList.remove('recording');
    }
    const micHint = document.getElementById('micHint');
    if (micHint) {
        micHint.textContent = 'Tap to speak';
    }

    // Stop recognition - this will trigger onresult or onerror/onend
    if (SpeakingPractice.recognition) {
        try {
            SpeakingPractice.recognition.stop();
        } catch (e) {
            // Already stopped or not started
            SpeakingPractice.isRecording = false;
        }
    } else {
        SpeakingPractice.isRecording = false;
    }
}

/**
 * Internal stop recording helper (called from recognition callbacks)
 */
function stopRecordingInternal() {
    SpeakingPractice.isRecording = false;

    if (SpeakingPractice.autoStopTimer) {
        clearTimeout(SpeakingPractice.autoStopTimer);
        SpeakingPractice.autoStopTimer = null;
    }

    // Visual feedback
    const micBtn = document.getElementById('micBtn');
    if (micBtn) {
        micBtn.classList.remove('recording');
    }
    const micHint = document.getElementById('micHint');
    if (micHint) {
        micHint.textContent = 'Tap to speak';
    }
}

// ==================== AUDIO PLAYBACK ====================

/**
 * Play TTS reference for the given text
 * @param {string} text - Chinese text to speak
 */
function playSpeakingReference(text) {
    if (typeof safeSpeechSynthesis === 'function') {
        safeSpeechSynthesis(text);
    } else if (typeof playSound === 'function') {
        playSound(text, '');
    }
}

/**
 * Play back the recorded audio
 */
function playRecording() {
    if (SpeakingPractice.recordedUrl) {
        const audio = new Audio(SpeakingPractice.recordedUrl);
        audio.play().catch(e => console.warn('Playback error:', e));
    }
}

// ==================== NAVIGATION ====================

/**
 * Move to next speaking prompt
 */
function nextSpeakingPrompt() {
    SpeakingPractice.currentIndex++;
    SpeakingPractice.recordedBlob = null;
    if (SpeakingPractice.recordedUrl) {
        URL.revokeObjectURL(SpeakingPractice.recordedUrl);
        SpeakingPractice.recordedUrl = null;
    }
    renderSpeakingPrompt();
}

/**
 * Retry the current speaking prompt
 */
function retrySpeakingPrompt() {
    SpeakingPractice.recordedBlob = null;
    if (SpeakingPractice.recordedUrl) {
        URL.revokeObjectURL(SpeakingPractice.recordedUrl);
        SpeakingPractice.recordedUrl = null;
    }
    renderSpeakingPrompt();
}

/**
 * Restart speaking practice with same category
 */
function restartSpeakingPractice() {
    if (SpeakingPractice.currentCategory) {
        startSpeakingPractice(SpeakingPractice.currentCategory);
    }
}

/**
 * Close the speaking practice modal
 */
function closeSpeakingPractice() {
    const modal = document.getElementById('speakingModal');
    if (modal) {
        modal.style.display = 'none';
    }
    cleanupSpeaking();
}

/**
 * Go back to Test 6 section selection
 */
function backToTest6Sections() {
    cleanupSpeaking();
    document.getElementById('test6Quiz').style.display = 'none';
    document.getElementById('test6SectionSelect').style.display = 'block';
}

/**
 * Clean up recording resources
 */
function cleanupSpeaking() {
    SpeakingPractice.isRecording = false;
    SpeakingPractice.touchActive = false;

    if (SpeakingPractice.autoStopTimer) {
        clearTimeout(SpeakingPractice.autoStopTimer);
        SpeakingPractice.autoStopTimer = null;
    }

    if (SpeakingPractice.recognition) {
        try { SpeakingPractice.recognition.abort(); } catch (e) { /* ignore */ }
        SpeakingPractice.recognition = null;
    }

    if (SpeakingPractice.mediaRecorder && SpeakingPractice.mediaRecorder.state !== 'inactive') {
        try { SpeakingPractice.mediaRecorder.stop(); } catch (e) { /* ignore */ }
    }
    SpeakingPractice.mediaRecorder = null;

    // Stop mic stream tracks to release the microphone
    if (SpeakingPractice.mediaStream) {
        SpeakingPractice.mediaStream.getTracks().forEach(track => track.stop());
        SpeakingPractice.mediaStream = null;
    }

    if (SpeakingPractice.recordedUrl) {
        URL.revokeObjectURL(SpeakingPractice.recordedUrl);
        SpeakingPractice.recordedUrl = null;
    }

    SpeakingPractice.recordedBlob = null;
    SpeakingPractice.audioChunks = [];
}

// ==================== TEST 6 INITIALIZATION ====================

/**
 * Initialize Test 6 section selection UI
 */
function initSpeakingTest() {
    const test = testConfig && testConfig.test6;
    if (!test) return;

    const sectionsContainer = document.getElementById('test6Sections');
    if (!sectionsContainer) return;

    sectionsContainer.innerHTML = test.sections.map(section => `
        <button class="next-btn section-btn" onclick="startSpeakingTest('${section.id}')" style="text-align: left;">
            ${section.icon} ${section.name}
            <span style="display: block; font-size: 0.85rem; opacity: 0.8;">${section.chineseName}</span>
        </button>
    `).join('');
}

// ==================== HELPERS ====================

/**
 * Normalize text for comparison (remove punctuation, whitespace)
 * @param {string} text
 * @returns {string}
 */
function normalized(text) {
    return text.replace(/[，。！？、\s]/g, '');
}

/**
 * Shuffle array (Fisher-Yates)
 * @param {Array} array
 * @returns {Array}
 */
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// ==================== TEST 6 CONFIG ====================

// Add test6 to testConfig when this script loads
if (typeof testConfig !== 'undefined') {
    testConfig.test6 = {
        id: 'test6',
        name: 'Speaking',
        chineseName: '說話',
        icon: '🎤',
        description: 'Practice your Cantonese pronunciation!',
        sections: [
            {
                id: '6.1',
                name: 'Greetings & Manners',
                chineseName: '禮貌與問候',
                icon: '🙏',
                categories: ['manners'],
                questionCount: 8
            },
            {
                id: '6.2',
                name: 'Numbers',
                chineseName: '數字',
                icon: '🔢',
                categories: ['numbers'],
                questionCount: 10
            },
            {
                id: '6.3',
                name: 'Animals',
                chineseName: '動物',
                icon: '🐾',
                categories: ['animals'],
                questionCount: 10
            },
            {
                id: '6.4',
                name: 'Colors',
                chineseName: '顏色',
                icon: '🌈',
                categories: ['colors'],
                questionCount: 10
            },
            {
                id: '6.5',
                name: 'Food & Drink',
                chineseName: '食物',
                icon: '🍜',
                categories: ['foods'],
                questionCount: 10
            },
            {
                id: '6.6',
                name: 'Family',
                chineseName: '家庭',
                icon: '👨‍👩‍👧‍👦',
                categories: ['family'],
                questionCount: 10
            },
            {
                id: '6.7',
                name: 'Weather',
                chineseName: '天氣',
                icon: '🌤️',
                categories: ['weather'],
                questionCount: 10
            },
            {
                id: '6.8',
                name: 'Clothing',
                chineseName: '衫褲',
                icon: '👕',
                categories: ['clothing'],
                questionCount: 10
            },
            {
                id: '6.9',
                name: 'Sports',
                chineseName: '運動',
                icon: '⚽',
                categories: ['sports'],
                questionCount: 10
            },
            {
                id: '6.10',
                name: 'Body Parts',
                chineseName: '身體',
                icon: '👤',
                categories: ['body'],
                questionCount: 10
            },
            {
                id: '6.11',
                name: 'Places',
                chineseName: '地方',
                icon: '📍',
                categories: ['places'],
                questionCount: 10
            },
            {
                id: '6.12',
                name: 'Occupations',
                chineseName: '職業',
                icon: '💼',
                categories: ['occupations'],
                questionCount: 10
            },
            {
                id: '6.13',
                name: 'Hobbies',
                chineseName: '興趣',
                icon: '🎭',
                categories: ['hobbies'],
                questionCount: 10
            },
            {
                id: '6.14',
                name: 'Daily Activities',
                chineseName: '日常',
                icon: '🌅',
                categories: ['dailyactivities'],
                questionCount: 10
            },
            {
                id: '6.15',
                name: 'Transport',
                chineseName: '交通',
                icon: '🚌',
                categories: ['transport'],
                questionCount: 10
            },
            {
                id: '6.16',
                name: 'Emotions',
                chineseName: '情緒',
                icon: '😊',
                categories: ['emotions'],
                questionCount: 10
            },
            {
                id: '6.17',
                name: 'Nature',
                chineseName: '大自然',
                icon: '🌿',
                categories: ['nature'],
                questionCount: 10
            },
            {
                id: '6.18',
                name: 'Holidays',
                chineseName: '節日',
                icon: '🎉',
                categories: ['lunarnewyear', 'easter', 'dragonboat', 'canadaday', 'midautumn', 'thanksgiving', 'halloween', 'christmas'],
                questionCount: 10
            }
        ]
    };
}

// ==================== EXPORTS ====================

window.SpeakingPractice = SpeakingPractice;
window.startSpeakingPractice = startSpeakingPractice;
window.startSpeakingTest = startSpeakingTest;
window.closeSpeakingPractice = closeSpeakingPractice;
window.startRecording = startRecording;
window.stopRecording = stopRecording;
window.playSpeakingReference = playSpeakingReference;
window.playRecording = playRecording;
window.nextSpeakingPrompt = nextSpeakingPrompt;
window.retrySpeakingPrompt = retrySpeakingPrompt;
window.restartSpeakingPractice = restartSpeakingPractice;
window.backToTest6Sections = backToTest6Sections;
window.initSpeakingTest = initSpeakingTest;
