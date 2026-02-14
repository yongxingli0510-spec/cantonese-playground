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
    autoStopTimer: null,
    micPermissionGranted: false,
    touchActive: false,
    // Cantonese language fallback chain (never Mandarin)
    cantoneseLangs: ['yue-Hant-HK', 'yue-HK', 'zh-yue'],
    currentLangIndex: 0,
    // Audio visualizer state
    audioContext: null,
    analyser: null,
    visualizerRAF: null,
    countdownInterval: null,
    recordingStartTime: 0
};

// ==================== SPEECH RECOGNITION ====================

// ==================== DEBUG LOGGING ====================

SpeakingPractice._debugLog = [];

function speakingDebug(msg) {
    const ts = new Date().toLocaleTimeString();
    const entry = '[' + ts + '] ' + msg;
    SpeakingPractice._debugLog.push(entry);
    console.log('[SpeechDebug]', msg);
    // Keep last 30 entries
    if (SpeakingPractice._debugLog.length > 30) {
        SpeakingPractice._debugLog.shift();
    }
}

/**
 * Show error with debug log panel in the speaking modal
 */
function showSpeakingErrorDebug(message) {
    // Re-render prompt so user can try again
    renderSpeakingPrompt();

    // Add debug panel to the speaking content
    const container = document.getElementById('speakingContent');
    if (container) {
        const logHtml = SpeakingPractice._debugLog.map(function(l) { return '<div>' + l + '</div>'; }).join('');
        const debugDiv = document.createElement('div');
        debugDiv.innerHTML = `
            <div style="margin: 10px auto; max-width: 400px; text-align: center;">
                <div style="color: #f56565; font-weight: 700; margin-bottom: 8px;">${message}</div>
                <div style="background: #1a202c; color: #68d391; border-radius: 8px; padding: 10px; font-family: monospace; font-size: 0.65rem; text-align: left; max-height: 180px; overflow-y: auto; word-break: break-all;">
                    <div style="color: #fbd38d; margin-bottom: 4px; font-weight: 700;">Debug Log:</div>
                    ${logHtml}
                </div>
            </div>
        `;
        container.appendChild(debugDiv);
    }

    // Also show toast
    const toast = document.createElement('div');
    toast.style.cssText = 'position: fixed; bottom: 20px; left: 50%; transform: translateX(-50%); background: #f56565; color: white; padding: 12px 24px; border-radius: 12px; font-size: 0.95rem; z-index: 3000; box-shadow: 0 4px 15px rgba(0,0,0,0.2);';
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(function() { toast.remove(); }, 3000);
}

// ==================== SPEECH RECOGNITION ====================

/**
 * Create a fresh SpeechRecognition instance for each recording session
 * @returns {SpeechRecognition|null}
 */
function createSpeechRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
        speakingDebug('API not found: SpeechRecognition=' + !!window.SpeechRecognition + ' webkit=' + !!window.webkitSpeechRecognition);
        return null;
    }

    const langCode = SpeakingPractice.cantoneseLangs[SpeakingPractice.currentLangIndex] || 'yue-Hant-HK';
    speakingDebug('Creating recognition, lang=' + langCode + ' (index ' + SpeakingPractice.currentLangIndex + '/' + (SpeakingPractice.cantoneseLangs.length - 1) + ')');
    speakingDebug('API: ' + (window.SpeechRecognition ? 'native' : 'webkit'));

    const recognition = new SpeechRecognition();
    recognition.lang = langCode;
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.maxAlternatives = 5;

    SpeakingPractice._gotResult = false;

    recognition.onaudiostart = function() { speakingDebug('audiostart (mic capturing)'); };
    recognition.onsoundstart = function() { speakingDebug('soundstart (sound detected)'); };
    recognition.onspeechstart = function() { speakingDebug('speechstart (speech detected)'); };
    recognition.onspeechend = function() { speakingDebug('speechend'); };
    recognition.onsoundend = function() { speakingDebug('soundend'); };
    recognition.onaudioend = function() { speakingDebug('audioend'); };

    recognition.onresult = function(event) {
        SpeakingPractice._gotResult = true;
        const results = event.results[0];
        let recognized = results[0].transcript.trim();

        speakingDebug('result: "' + recognized + '" conf=' + results[0].confidence.toFixed(2));
        for (let i = 1; i < results.length; i++) {
            speakingDebug('  alt[' + i + ']: "' + results[i].transcript.trim() + '"');
        }

        // Get expected item data
        const item = SpeakingPractice.currentItems[SpeakingPractice.currentIndex];
        const expected = item?.chinese || '';
        let bestMatch = recognized;

        // Check all alternatives for a match against chinese text, jyutping, or english
        for (let i = 0; i < results.length; i++) {
            const alt = results[i].transcript.trim();
            if (matchesSpeakingItem(alt, item)) {
                bestMatch = alt;
                speakingDebug('matched alt[' + i + ']: "' + alt + '"');
                break;
            }
        }

        stopRecordingInternal();
        showSpeakingResult(bestMatch, expected);
    };

    recognition.onerror = function(event) {
        speakingDebug('error: type="' + event.error + '" msg="' + (event.message || '') + '"');
        stopRecordingInternal();

        // On network error, try next Cantonese language code
        if (event.error === 'network' && SpeakingPractice.currentLangIndex < SpeakingPractice.cantoneseLangs.length - 1) {
            SpeakingPractice.currentLangIndex++;
            SpeakingPractice.recognition = null;
            const nextLang = SpeakingPractice.cantoneseLangs[SpeakingPractice.currentLangIndex];
            speakingDebug('Network error → trying ' + nextLang);
            showSpeakingErrorDebug('Trying ' + nextLang + '... Tap mic again.');
        } else if (event.error === 'no-speech') {
            showSpeakingErrorDebug('No speech detected. Please try again.');
        } else if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
            showSpeakingErrorDebug('Mic access denied. Allow microphone and use HTTPS.');
        } else if (event.error === 'network') {
            showSpeakingErrorDebug('Network error. All Cantonese codes failed.');
        } else if (event.error === 'aborted') {
            speakingDebug('aborted (user-initiated)');
        } else {
            showSpeakingErrorDebug('Error: ' + event.error);
        }
    };

    recognition.onend = function() {
        speakingDebug('end (gotResult=' + SpeakingPractice._gotResult + ' recording=' + SpeakingPractice.isRecording + ')');

        if (SpeakingPractice.isRecording && !SpeakingPractice._gotResult) {
            stopRecordingInternal();

            // On no result, try next Cantonese language code
            if (SpeakingPractice.currentLangIndex < SpeakingPractice.cantoneseLangs.length - 1) {
                SpeakingPractice.currentLangIndex++;
                SpeakingPractice.recognition = null;
                const nextLang = SpeakingPractice.cantoneseLangs[SpeakingPractice.currentLangIndex];
                speakingDebug('No result → trying ' + nextLang);
                showSpeakingErrorDebug('Trying ' + nextLang + '... Tap mic again.');
            } else {
                showSpeakingErrorDebug('No speech detected. Please try again.');
            }
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
    const container = document.getElementById('speakingContent');
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
                <div id="vizContainer" style="display: none; margin: 0 auto 12px; max-width: 300px;">
                    <div id="waveformBars" style="display: flex; align-items: center; justify-content: center; height: 50px; gap: 3px;"></div>
                    <div style="margin-top: 8px; position: relative; height: 4px; background: rgba(229,62,62,0.15); border-radius: 2px; overflow: hidden;">
                        <div id="countdownBar" style="height: 100%; width: 100%; background: linear-gradient(90deg, #f56565, #e53e3e); border-radius: 2px; transition: width 0.1s linear;"></div>
                    </div>
                    <p style="color: var(--text-muted); font-size: 0.75rem; margin-top: 4px;" id="countdownText">8s</p>
                </div>
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

    // Check for match using comprehensive matching
    const item = SpeakingPractice.currentItems[SpeakingPractice.currentIndex];
    const isCorrect = matchesSpeakingItem(recognized, item);

    if (isCorrect) {
        SpeakingPractice.score++;
        if (typeof showCelebration === 'function') {
            showCelebration('🎉');
        }
    }

    const container = document.getElementById('speakingContent');
    if (!container) return;

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
    const container = document.getElementById('speakingContent');
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
                <button class="next-btn" onclick="restartSpeakingPractice()" style="padding: 12px 30px; background: linear-gradient(135deg, #ed8936, #dd6b20);">
                    🔄 Try Again
                </button>
                <button class="next-btn" onclick="closeSpeakingPractice()" style="padding: 12px 30px;">
                    ✅ Done
                </button>
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
    SpeakingPractice._gotResult = false;
    SpeakingPractice._debugLog = [];

    speakingDebug('startRecording called');
    speakingDebug('Browser: ' + navigator.userAgent.slice(0, 80));
    speakingDebug('Protocol: ' + location.protocol);
    speakingDebug('lang: yue-Hant-HK (Cantonese only)');

    // Visual feedback
    const micBtn = document.getElementById('micBtn');
    if (micBtn) {
        micBtn.classList.add('recording');
    }
    const micHint = document.getElementById('micHint');
    if (micHint) {
        micHint.textContent = 'Listening... tap to stop';
    }

    // Start animated visualizer (no getUserMedia — avoids mic conflict with SpeechRecognition)
    startAnimatedVisualizer();

    // Create a fresh instance if needed (e.g., after language fallback)
    if (!SpeakingPractice.recognition) {
        SpeakingPractice.recognition = createSpeechRecognition();
    }
    if (SpeakingPractice.recognition) {
        try {
            SpeakingPractice.recognition.start();
            speakingDebug('recognition.start() OK');
        } catch (e) {
            speakingDebug('recognition.start() THREW: ' + e.message + ' — recreating');
            // If start fails (e.g., instance in bad state), recreate as fallback
            SpeakingPractice.recognition = createSpeechRecognition();
            if (SpeakingPractice.recognition) {
                try {
                    SpeakingPractice.recognition.start();
                    speakingDebug('recognition.start() retry OK');
                } catch (e2) {
                    speakingDebug('recognition.start() retry THREW: ' + e2.message);
                }
            }
        }
    } else {
        speakingDebug('recognition is null — API not available');
    }

    // Auto-stop after 8 seconds
    SpeakingPractice.autoStopTimer = setTimeout(() => {
        speakingDebug('Auto-stop at 8s');
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

    // Stop visualizer
    stopAudioVisualizer();

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

    // Stop visualizer
    stopAudioVisualizer();

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

// ==================== AUDIO VISUALIZER ====================

/**
 * Start animated visualizer bars WITHOUT getUserMedia (avoids mic conflict with SpeechRecognition)
 * Used by vocabulary page speaking practice
 */
function startAnimatedVisualizer() {
    const vizContainer = document.getElementById('vizContainer');
    const barsContainer = document.getElementById('waveformBars');
    if (!vizContainer || !barsContainer) return;

    // Show visualizer
    vizContainer.style.display = 'block';

    // Create waveform bars
    const BAR_COUNT = 20;
    barsContainer.innerHTML = '';
    for (let i = 0; i < BAR_COUNT; i++) {
        const bar = document.createElement('div');
        bar.style.cssText = 'width: 8px; min-height: 4px; height: 4px; background: linear-gradient(180deg, #f56565, #e53e3e); border-radius: 4px; transition: height 0.05s ease;';
        bar.dataset.index = i;
        barsContainer.appendChild(bar);
    }

    // Use fallback animation (no getUserMedia)
    animateWaveformFallback(barsContainer, BAR_COUNT);

    // Start countdown timer
    SpeakingPractice.recordingStartTime = Date.now();
    const DURATION = 8000;
    SpeakingPractice.countdownInterval = setInterval(function() {
        const elapsed = Date.now() - SpeakingPractice.recordingStartTime;
        const remaining = Math.max(0, DURATION - elapsed);
        const pct = (remaining / DURATION) * 100;

        const bar = document.getElementById('countdownBar');
        if (bar) bar.style.width = pct + '%';

        const text = document.getElementById('countdownText');
        if (text) text.textContent = Math.ceil(remaining / 1000) + 's';

        if (remaining <= 0) {
            clearInterval(SpeakingPractice.countdownInterval);
            SpeakingPractice.countdownInterval = null;
        }
    }, 100);
}

/**
 * Start the real-time audio waveform visualizer and countdown timer
 */
function startAudioVisualizer() {
    const vizContainer = document.getElementById('vizContainer');
    const barsContainer = document.getElementById('waveformBars');
    if (!vizContainer || !barsContainer) return;

    // Show visualizer
    vizContainer.style.display = 'block';

    // Create waveform bars
    const BAR_COUNT = 20;
    barsContainer.innerHTML = '';
    for (let i = 0; i < BAR_COUNT; i++) {
        const bar = document.createElement('div');
        bar.style.cssText = 'width: 8px; min-height: 4px; height: 4px; background: linear-gradient(180deg, #f56565, #e53e3e); border-radius: 4px; transition: height 0.05s ease;';
        bar.dataset.index = i;
        barsContainer.appendChild(bar);
    }

    // Set up Web Audio API analyser
    try {
        if (!SpeakingPractice.audioContext) {
            SpeakingPractice.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
        // Resume if suspended (browser autoplay policy)
        if (SpeakingPractice.audioContext.state === 'suspended') {
            SpeakingPractice.audioContext.resume();
        }

        // Get mic stream - request if we don't have one
        const connectAnalyser = function(stream) {
            const analyser = SpeakingPractice.audioContext.createAnalyser();
            analyser.fftSize = 64;
            analyser.smoothingTimeConstant = 0.6;

            const source = SpeakingPractice.audioContext.createMediaStreamSource(stream);
            source.connect(analyser);
            SpeakingPractice.analyser = analyser;
            SpeakingPractice._vizSource = source;

            // Start animation loop
            animateWaveform(barsContainer, analyser, BAR_COUNT);
        };

        if (SpeakingPractice.mediaStream && SpeakingPractice.mediaStream.active) {
            connectAnalyser(SpeakingPractice.mediaStream);
        } else {
            navigator.mediaDevices.getUserMedia({ audio: true }).then(function(stream) {
                SpeakingPractice.mediaStream = stream;
                SpeakingPractice.micPermissionGranted = true;
                connectAnalyser(stream);
            }).catch(function() {
                // Fallback: animate with random values
                animateWaveformFallback(barsContainer, BAR_COUNT);
            });
        }
    } catch (e) {
        // Web Audio API not supported, use fallback animation
        animateWaveformFallback(barsContainer, BAR_COUNT);
    }

    // Start countdown timer
    SpeakingPractice.recordingStartTime = Date.now();
    const DURATION = 8000;
    SpeakingPractice.countdownInterval = setInterval(function() {
        const elapsed = Date.now() - SpeakingPractice.recordingStartTime;
        const remaining = Math.max(0, DURATION - elapsed);
        const pct = (remaining / DURATION) * 100;

        const bar = document.getElementById('countdownBar');
        if (bar) bar.style.width = pct + '%';

        const text = document.getElementById('countdownText');
        if (text) text.textContent = Math.ceil(remaining / 1000) + 's';

        if (remaining <= 0) {
            clearInterval(SpeakingPractice.countdownInterval);
            SpeakingPractice.countdownInterval = null;
        }
    }, 100);
}

/**
 * Animate waveform bars using real microphone data
 */
function animateWaveform(container, analyser, barCount) {
    const dataArray = new Uint8Array(analyser.frequencyBinCount);
    const bars = container.children;

    function draw() {
        if (!SpeakingPractice.isRecording) return;

        SpeakingPractice.visualizerRAF = requestAnimationFrame(draw);
        analyser.getByteFrequencyData(dataArray);

        // Map frequency data to bars
        const step = Math.floor(dataArray.length / barCount) || 1;
        for (let i = 0; i < barCount && i < bars.length; i++) {
            const val = dataArray[i * step] || 0;
            // Scale: min 4px, max 48px
            const height = Math.max(4, (val / 255) * 48);
            bars[i].style.height = height + 'px';
            // Color intensity based on volume
            const intensity = Math.round(100 + (val / 255) * 155);
            bars[i].style.background = 'linear-gradient(180deg, rgb(245,' + (100 - val/5) + ',' + (100 - val/5) + '), rgb(229,' + (62 - val/10) + ',' + (62 - val/10) + '))';
        }
    }

    SpeakingPractice.visualizerRAF = requestAnimationFrame(draw);
}

/**
 * Fallback waveform animation when Web Audio API is unavailable
 */
function animateWaveformFallback(container, barCount) {
    const bars = container.children;

    function draw() {
        if (!SpeakingPractice.isRecording) return;

        SpeakingPractice.visualizerRAF = requestAnimationFrame(draw);

        for (let i = 0; i < barCount && i < bars.length; i++) {
            // Generate smooth random heights with center emphasis
            const centerWeight = 1 - Math.abs(i - barCount / 2) / (barCount / 2);
            const height = Math.max(4, (Math.random() * 30 + 10) * (0.5 + centerWeight * 0.5));
            bars[i].style.height = height + 'px';
        }
    }

    SpeakingPractice.visualizerRAF = requestAnimationFrame(draw);
}

/**
 * Stop the audio visualizer and countdown
 */
function stopAudioVisualizer() {
    // Stop animation
    if (SpeakingPractice.visualizerRAF) {
        cancelAnimationFrame(SpeakingPractice.visualizerRAF);
        SpeakingPractice.visualizerRAF = null;
    }

    // Stop countdown
    if (SpeakingPractice.countdownInterval) {
        clearInterval(SpeakingPractice.countdownInterval);
        SpeakingPractice.countdownInterval = null;
    }

    // Disconnect analyser source
    if (SpeakingPractice._vizSource) {
        try { SpeakingPractice._vizSource.disconnect(); } catch (e) { /* ignore */ }
        SpeakingPractice._vizSource = null;
    }
    SpeakingPractice.analyser = null;

    // Hide visualizer
    const vizContainer = document.getElementById('vizContainer');
    if (vizContainer) vizContainer.style.display = 'none';
}

// ==================== CLEANUP ====================

/**
 * Clean up recording resources
 */
function cleanupSpeaking() {
    SpeakingPractice.isRecording = false;
    SpeakingPractice.touchActive = false;

    // Stop visualizer
    stopAudioVisualizer();

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
 * Strip tone numbers from jyutping (e.g., "luk6" -> "luk")
 * @param {string} jyutping
 * @returns {string}
 */
function stripTones(jyutping) {
    return jyutping.replace(/[0-9]/g, '').toLowerCase().trim();
}

// ==================== CHARACTER → JYUTPING MAP ====================

let _charJyutpingMap = null;

/**
 * Build a character→jyutping map from all vocabulary items.
 * Maps each Chinese character to its jyutping syllable (without tones).
 * Cached after first build.
 * @returns {Object} Map of character → jyutping syllable
 */
function getCharJyutpingMap() {
    if (_charJyutpingMap) return _charJyutpingMap;

    const map = {};
    if (typeof vocabularyData === 'undefined') return map;

    // Extract character→jyutping from vocabulary items
    for (const category of Object.values(vocabularyData)) {
        for (const item of category) {
            const chars = (item.chinese || '').replace(/[，。！？、\s]/g, '');
            const syllables = (item.jyutping || '').trim().split(/\s+/);

            // Only map when character count matches syllable count
            if (chars.length === syllables.length) {
                for (let i = 0; i < chars.length; i++) {
                    if (!map[chars[i]]) {
                        map[chars[i]] = stripTones(syllables[i]);
                    }
                }
            }
        }
    }

    // Supplementary: common characters that speech recognition returns
    // but may not be in our vocabulary (Cantonese jyutping, no tones)
    const extras = {
        '哈': 'haa', '嗨': 'haai', '蛤': 'haa', '瞎': 'hat',
        '红': 'hung', '弘': 'wang', '虹': 'hung',
        '吗': 'maa', '妈': 'maa', '嘛': 'maa', '麻': 'maa', '马': 'maa',
        '他': 'taa', '她': 'taa', '它': 'taa', '塔': 'taap',
        '的': 'dik', '得': 'dak', '地': 'dei',
        '了': 'liu', '料': 'liu',
        '和': 'wo', '河': 'ho', '何': 'ho',
        '不': 'bat', '布': 'bou',
        '会': 'wui', '回': 'wui', '惠': 'wai',
        '把': 'baa', '吧': 'baa', '爸': 'baa',
        '个': 'go', '哥': 'go', '歌': 'go',
        '们': 'mun', '门': 'mun', '闷': 'mun',
        '吃': 'hek', '迟': 'ci',
        '喝': 'hot', '合': 'hap', '盒': 'hap',
        '看': 'hon', '刊': 'hon',
        '说': 'syut', '雪': 'syut',
        '来': 'loi', '赖': 'laai', '莱': 'loi',
        '走': 'zau', '奏': 'zau',
        '给': 'kap', '急': 'gap',
        '怎': 'zam', '斩': 'zaam',
        '为': 'wai', '位': 'wai', '围': 'wai',
        '很': 'han', '恨': 'han', '痕': 'han',
        '过': 'gwo', '锅': 'wo',
        '着': 'zoek', '著': 'zoek',
        '对': 'deoi', '队': 'deoi',
        '让': 'joeng', '酿': 'joeng',
        '就': 'zau', '九': 'gau', '旧': 'gau',
        '还': 'waan', '环': 'waan',
        '从': 'cung', '丛': 'cung',
        '被': 'bei', '杯': 'bui', '背': 'bui',
        '啊': 'aa', '阿': 'aa', '呀': 'aa',
        '哦': 'o', '噢': 'o',
        '嗯': 'ng', '唔': 'ng',
        '那': 'naa', '拿': 'naa', '哪': 'naa',
        '这': 'ze', '遮': 'ze',
        '真': 'zan', '珍': 'zan',
        '长': 'coeng', '场': 'coeng', '常': 'soeng',
        '没': 'mut', '每': 'mui',
        '只': 'zi', '指': 'zi', '纸': 'zi',
        '最': 'zeoi', '嘴': 'zeoi',
        '但': 'daan', '蛋': 'daan', '单': 'daan',
        '因': 'jan', '音': 'jam', '饮': 'jam',
        '所': 'so', '锁': 'so',
        '能': 'nang', '农': 'nung',
        '也': 'jaa', '夜': 'je', '爷': 'je',
        '些': 'se', '写': 'se',
        '像': 'zoeng', '象': 'zoeng',
    };

    for (const [char, jyut] of Object.entries(extras)) {
        if (!map[char]) {
            map[char] = jyut;
        }
    }

    _charJyutpingMap = map;
    return map;
}

/**
 * Convert Chinese text to jyutping syllables using the character map
 * @param {string} text - Chinese text
 * @returns {Array} Array of jyutping syllables (unknown chars kept as-is)
 */
function textToJyutping(text) {
    const map = getCharJyutpingMap();
    const chars = normalized(text);
    const syllables = [];
    for (const char of chars) {
        syllables.push(map[char] || char);
    }
    return syllables;
}

/**
 * Calculate similarity between two jyutping syllable arrays (0-1)
 * @param {Array} a - First syllable array
 * @param {Array} b - Second syllable array
 * @returns {number} Similarity score 0-1
 */
function jyutpingSimilarity(a, b) {
    const maxLen = Math.max(a.length, b.length);
    if (maxLen === 0) return 0;

    let matches = 0;
    const minLen = Math.min(a.length, b.length);
    for (let i = 0; i < minLen; i++) {
        if (a[i] === b[i]) {
            matches++;
        }
    }
    return matches / maxLen;
}

// ==================== SPEECH MATCHING ====================

/**
 * Check if recognized speech matches a vocabulary item.
 * Uses multiple strategies: exact match, jyutping match, homophone
 * lookup, and fuzzy pronunciation comparison (>=80% threshold).
 * @param {string} recognized - What was recognized
 * @param {Object} item - Vocabulary item { chinese, jyutping, english }
 * @returns {boolean}
 */
function matchesSpeakingItem(recognized, item) {
    if (!recognized || !item) return false;

    const r = normalized(recognized);
    const chinese = normalized(item.chinese || '');
    const jyutping = (item.jyutping || '').toLowerCase().trim();
    const jyutpingNoTones = stripTones(jyutping);
    const english = (item.english || '').toLowerCase().trim();
    const rLower = recognized.toLowerCase().trim();

    // Exact match on Chinese characters
    if (r === chinese) return true;
    // Chinese contains/included
    if (r && chinese && (r.includes(chinese) || chinese.includes(r))) return true;

    // Match against jyutping (with tones)
    if (rLower === jyutping) return true;
    // Match against jyutping (without tones)
    if (rLower === jyutpingNoTones) return true;

    // Match against jyutping syllables for multi-syllable words
    const rNoTones = stripTones(rLower);
    const jyutpingSyllables = jyutpingNoTones.replace(/\s+/g, '');
    const rSyllables = rNoTones.replace(/\s+/g, '');
    if (rSyllables && jyutpingSyllables && rSyllables === jyutpingSyllables) return true;

    // Phonetic similarity: recognized English-like text matches jyutping sounds
    if (rLower && jyutpingNoTones && phoneticMatch(rLower, jyutpingNoTones)) return true;

    // Fuzzy pronunciation comparison via character→jyutping map
    // Converts recognized characters to jyutping and compares with expected
    // Accepts >=80% syllable match (handles homophones like 蝦/哈, 熊/紅)
    if (r && jyutpingNoTones) {
        const recognizedJyutping = textToJyutping(recognized);
        const expectedJyutping = jyutpingNoTones.split(/\s+/);
        const similarity = jyutpingSimilarity(recognizedJyutping, expectedJyutping);
        if (similarity >= 0.8) return true;
    }

    // Match against English meaning (if recognition fell back to English)
    if (rLower === english) return true;
    if (rLower && english && (rLower.includes(english) || english.includes(rLower))) return true;

    return false;
}

/**
 * Check if an English-recognized word sounds like the Cantonese jyutping
 * Handles cases where speech recognition falls back to English
 * @param {string} englishText - Recognized English text (lowercase)
 * @param {string} jyutpingNoTones - Jyutping without tone numbers (lowercase)
 * @returns {boolean}
 */
function phoneticMatch(englishText, jyutpingNoTones) {
    // Remove spaces and compare
    const e = englishText.replace(/\s+/g, '');
    const j = jyutpingNoTones.replace(/\s+/g, '');

    // Direct match after cleanup
    if (e === j) return true;

    // Common English-to-Cantonese phonetic mappings
    // e.g., "look" -> "luk", "see" -> "si", "my" -> "mai"
    const phoneticMap = {
        'look': 'luk', 'luck': 'luk',
        'see': 'si', 'sea': 'si',
        'my': 'mai', 'mine': 'main',
        'ye': 'je', 'yeah': 'je',
        'knee': 'nei', 'nay': 'nei',
        'go': 'gou', 'goal': 'gou',
        'high': 'hai', 'hi': 'hai',
        'boy': 'boi',
        'toy': 'toi',
        'joy': 'zoi',
        'sue': 'syu', 'shoe': 'syu',
        'you': 'jau',
        'may': 'mei',
        'say': 'sei', 'say': 'sai',
        'die': 'dai', 'dye': 'dai',
        'guy': 'gai',
        'song': 'soeng', 'sung': 'sung',
        'gung': 'gung', 'kung': 'gung',
        'hung': 'hung',
        'done': 'daan',
        'one': 'jat', 'won': 'jat',
        'two': 'ji',
        'three': 'saam',
        'four': 'sei',
        'five': 'ng',
        'six': 'luk',
        'seven': 'cat',
        'eight': 'baat',
        'nine': 'gau',
        'ten': 'sap',
    };

    // Check if recognized word maps to the expected jyutping
    const mapped = phoneticMap[e];
    if (mapped && mapped === j) return true;

    // Check each word in multi-word recognition
    const words = englishText.split(/\s+/);
    const jSyllables = jyutpingNoTones.split(/\s+/);

    if (words.length === jSyllables.length) {
        let allMatch = true;
        for (let i = 0; i < words.length; i++) {
            const wordMapped = phoneticMap[words[i]];
            if (wordMapped !== jSyllables[i] && words[i] !== jSyllables[i]) {
                allMatch = false;
                break;
            }
        }
        if (allMatch) return true;
    }

    return false;
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

// ==================== EXPORTS ====================

window.SpeakingPractice = SpeakingPractice;
window.startSpeakingPractice = startSpeakingPractice;
window.closeSpeakingPractice = closeSpeakingPractice;
window.startRecording = startRecording;
window.stopRecording = stopRecording;
window.playSpeakingReference = playSpeakingReference;
window.playRecording = playRecording;
window.nextSpeakingPrompt = nextSpeakingPrompt;
window.retrySpeakingPrompt = retrySpeakingPrompt;
window.restartSpeakingPractice = restartSpeakingPractice;
window.isSpeechRecognitionAvailable = isSpeechRecognitionAvailable;
window.matchesSpeakingItem = matchesSpeakingItem;
