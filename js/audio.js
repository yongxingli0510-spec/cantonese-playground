/**
 * ==================== AUDIO MODULE ====================
 * Speech synthesis functions for Cantonese Playground
 * Includes: Voice detection, playback, debouncing, rate control
 * ================================================================
 */

// ==================== CONFIGURATION ====================

const AudioConfig = {
    defaultRate: 0.8,
    defaultPitch: 1.1,
    wordRate: 0.7, // Slower for individual words
    minRate: 0.5,
    maxRate: 1.5,
    debounceTime: 300 // ms
};

// Current speech rate (can be modified by user)
let currentSpeechRate = AudioConfig.defaultRate;

// Track last played to prevent rapid-fire
let lastPlayedTime = 0;
let isPlaying = false;

// ==================== SPEECH RATE CONTROL ====================

/**
 * Get current speech rate
 * @returns {number}
 */
function getSpeechRate() {
    return currentSpeechRate;
}

/**
 * Set speech rate
 * @param {number} rate - Rate between 0.5 and 1.5
 */
function setSpeechRate(rate) {
    currentSpeechRate = Math.max(AudioConfig.minRate, Math.min(AudioConfig.maxRate, rate));

    // Save preference
    if (typeof localStorage !== 'undefined') {
        try {
            localStorage.setItem('cantonesePlayground_speechRate', currentSpeechRate.toString());
        } catch (e) {
            console.warn('Could not save speech rate preference');
        }
    }

    return currentSpeechRate;
}

/**
 * Load saved speech rate preference
 */
function loadSpeechRatePreference() {
    try {
        const saved = localStorage.getItem('cantonesePlayground_speechRate');
        if (saved) {
            currentSpeechRate = parseFloat(saved);
        }
    } catch (e) {
        // Use default
    }
}

// ==================== VOICE DETECTION ====================

// Cache the Cantonese voice
let cachedCantoneseVoice = null;
let voicesLoaded = false;

/**
 * Get the best Cantonese voice available
 * @returns {SpeechSynthesisVoice|null}
 */
function getCantoneseVoice() {
    if (cachedCantoneseVoice && voicesLoaded) {
        return cachedCantoneseVoice;
    }

    const voices = window.speechSynthesis.getVoices();

    if (voices.length === 0) {
        return null;
    }

    // Priority 1: Look for voices with "Cantonese" or "廣東話" or "粵語" in name
    let cantoneseVoice = voices.find(voice =>
        voice.name.toLowerCase().includes('cantonese') ||
        voice.name.includes('廣東話') ||
        voice.name.includes('粵語') ||
        voice.name.includes('广东话') ||
        voice.name.includes('粤语')
    );
    if (cantoneseVoice) {
        cachedCantoneseVoice = cantoneseVoice;
        voicesLoaded = true;
        return cantoneseVoice;
    }

    // Priority 2: Look for 'yue' language code (standard Cantonese code)
    cantoneseVoice = voices.find(voice =>
        voice.lang.startsWith('yue') ||
        voice.lang.includes('yue')
    );
    if (cantoneseVoice) {
        cachedCantoneseVoice = cantoneseVoice;
        voicesLoaded = true;
        return cantoneseVoice;
    }

    // Priority 3: Look for zh-HK voices that are likely Cantonese
    // Check if the voice name suggests it's Cantonese, not Mandarin
    cantoneseVoice = voices.find(voice =>
        voice.lang === 'zh-HK' &&
        !voice.name.toLowerCase().includes('mandarin') &&
        !voice.name.includes('普通話') &&
        !voice.name.includes('普通话')
    );
    if (cantoneseVoice) {
        cachedCantoneseVoice = cantoneseVoice;
        voicesLoaded = true;
        return cantoneseVoice;
    }

    // Priority 4: Any zh-HK voice as fallback
    cantoneseVoice = voices.find(voice => voice.lang === 'zh-HK');
    if (cantoneseVoice) {
        cachedCantoneseVoice = cantoneseVoice;
        voicesLoaded = true;
        return cantoneseVoice;
    }

    // Priority 5: Any Chinese voice (last resort - may be Mandarin)
    cantoneseVoice = voices.find(voice => voice.lang.startsWith('zh'));
    cachedCantoneseVoice = cantoneseVoice || null;
    voicesLoaded = true;
    return cachedCantoneseVoice;
}

/**
 * Check for Cantonese voice availability and show warning if needed
 * @returns {boolean} Whether Cantonese voice is available
 */
function checkCantoneseVoice() {
    const voices = window.speechSynthesis.getVoices();
    const hasCantoneseVoice = voices.some(voice =>
        voice.name.toLowerCase().includes('cantonese') ||
        voice.name.includes('廣東話') ||
        voice.name.includes('粵語') ||
        voice.lang.startsWith('yue')
    );

    if (!hasCantoneseVoice && voices.length > 0) {
        console.warn('No dedicated Cantonese voice found. Speech may use Mandarin pronunciation.');
        window.cantoneseVoiceWarningShown = true;
        return false;
    }

    return true;
}

/**
 * Check if speech synthesis is available
 * @returns {boolean}
 */
function isSpeechAvailable() {
    return 'speechSynthesis' in window && window.speechSynthesis !== null;
}

/**
 * Show user-friendly message if speech is not available
 */
function showSpeechUnavailableMessage() {
    // Only show once per session
    if (window.speechUnavailableMessageShown) return;
    window.speechUnavailableMessageShown = true;

    const message = document.createElement('div');
    message.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: #FF6B6B;
        color: white;
        padding: 15px 25px;
        border-radius: 10px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.2);
        z-index: 9999;
        font-size: 0.95rem;
        max-width: 90%;
        text-align: center;
    `;
    message.innerHTML = '🔇 Speech is not available on your device. You can still learn by reading!';
    document.body.appendChild(message);

    setTimeout(() => {
        message.style.opacity = '0';
        message.style.transition = 'opacity 0.5s';
        setTimeout(() => message.remove(), 500);
    }, 5000);
}

// ==================== DEBOUNCED SPEECH ====================

/**
 * Check if enough time has passed since last play
 * @returns {boolean}
 */
function canPlay() {
    const now = Date.now();
    if (now - lastPlayedTime < AudioConfig.debounceTime) {
        return false;
    }
    if (isPlaying) {
        return false;
    }
    return true;
}

/**
 * Safe speech synthesis wrapper with debouncing
 * @param {string} text - Text to speak
 * @param {Object} options - { rate, pitch }
 * @returns {boolean} Whether speech was triggered
 */
function safeSpeechSynthesis(text, options = {}) {
    // Check if we can play
    if (!canPlay()) {
        return false;
    }

    // Check availability
    if (!isSpeechAvailable()) {
        showSpeechUnavailableMessage();
        return false;
    }

    try {
        // Cancel any ongoing speech
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        const voice = getCantoneseVoice();

        if (voice) {
            utterance.voice = voice;
            utterance.lang = voice.lang;
        } else {
            utterance.lang = 'zh-HK';
        }

        utterance.rate = options.rate || currentSpeechRate;
        utterance.pitch = options.pitch || AudioConfig.defaultPitch;

        // Track playing state
        isPlaying = true;
        lastPlayedTime = Date.now();

        utterance.onend = () => {
            isPlaying = false;
        };

        utterance.onerror = (e) => {
            isPlaying = false;
            console.warn('Speech synthesis error:', e);
        };

        window.speechSynthesis.speak(utterance);
        return true;
    } catch (e) {
        isPlaying = false;
        console.warn('Speech synthesis not available:', e);
        return false;
    }
}

// ==================== MAIN PLAY FUNCTIONS ====================

/**
 * Play sound for a vocabulary card
 * @param {string} chineseText - Chinese text to speak
 * @param {string} romanization - Jyutping romanization (for reference)
 */
function playSound(chineseText, romanization) {
    try {
        // Track word learned (if analytics is available)
        if (typeof trackWordLearned === 'function') {
            trackWordLearned(chineseText);
        }

        // Create visual feedback
        if (event && event.currentTarget) {
            const card = event.currentTarget;
            card.style.transform = 'scale(1.05)';
            card.style.boxShadow = '0 8px 30px rgba(78, 205, 196, 0.6)';
            setTimeout(() => {
                card.style.transform = '';
                card.style.boxShadow = '';
            }, 300);
        }

        // Play audio
        safeSpeechSynthesis(chineseText);

    } catch (e) {
        console.error('playSound error:', e);
    }
}

/**
 * Play individual word audio (for story word clicks)
 * @param {string} chineseText - Chinese text
 * @param {string} jyutping - Jyutping romanization
 * @param {HTMLElement} element - Clicked element
 */
function playWord(chineseText, jyutping, element) {
    try {
        // Get the English meaning from the title attribute
        const meaning = element ? (element.getAttribute('title') || '') : '';

        // Get word type from class
        let wordTypeLabel = '';
        if (element) {
            if (element.classList.contains('noun')) wordTypeLabel = 'Noun 名詞';
            else if (element.classList.contains('verb')) wordTypeLabel = 'Verb 動詞';
            else if (element.classList.contains('adj')) wordTypeLabel = 'Adj 形容詞';
            else if (element.classList.contains('adv')) wordTypeLabel = 'Adv 副詞';
            else if (element.classList.contains('pron')) wordTypeLabel = 'Pron 代詞';
            else if (element.classList.contains('num')) wordTypeLabel = 'Num 數詞';
            else if (element.classList.contains('prep')) wordTypeLabel = 'Particle 助詞';
            else if (element.classList.contains('conj')) wordTypeLabel = 'Conj 連詞';
        }

        // Find the story card container and update the word info display
        if (element) {
            const storyCard = element.closest('.story-card');
            if (storyCard) {
                const wordInfo = storyCard.querySelector('.word-info');
                if (wordInfo) {
                    wordInfo.innerHTML = `
                        <div style="display: flex; align-items: center; justify-content: center; gap: 12px; flex-wrap: wrap;">
                            <span style="font-size: 1.8rem; color: var(--primary); font-weight: 600;">${chineseText}</span>
                            <span style="color: var(--accent); font-size: 1.1rem;">${jyutping}</span>
                            <span style="color: #555; font-size: 1rem;">${meaning}</span>
                            ${wordTypeLabel ? `<span style="font-size: 0.75rem; padding: 2px 8px; border-radius: 10px; background: rgba(0,0,0,0.06); color: #777;">${wordTypeLabel}</span>` : ''}
                        </div>
                    `;
                    wordInfo.style.display = 'block';
                }
            }

            // Visual feedback
            element.style.transform = 'scale(1.15)';
            element.style.boxShadow = '0 4px 15px rgba(0,0,0,0.3)';
            setTimeout(() => {
                element.style.transform = '';
                element.style.boxShadow = '';
            }, 400);
        }

        // Play audio at slower rate for individual words
        safeSpeechSynthesis(chineseText, { rate: AudioConfig.wordRate });

    } catch (e) {
        console.error('playWord error:', e);
    }
}

/**
 * Play character audio (for writing practice)
 * @param {string} character - Single Chinese character
 */
function playCharAudio(character) {
    try {
        safeSpeechSynthesis(character, { rate: AudioConfig.wordRate });
    } catch (e) {
        console.error('playCharAudio error:', e);
    }
}

/**
 * Play test question audio
 * @param {string} text - Full text with answer filled in
 */
function playTestAudio(text) {
    safeSpeechSynthesis(text);
}

// ==================== INITIALIZATION ====================

/**
 * Initialize audio module
 */
function initAudio() {
    // Load saved speech rate preference
    loadSpeechRatePreference();

    // Load voices when available
    if (isSpeechAvailable()) {
        // Some browsers load voices asynchronously
        window.speechSynthesis.onvoiceschanged = () => {
            window.speechSynthesis.getVoices();
            checkCantoneseVoice();
        };

        // Also check immediately in case voices are already loaded
        if (window.speechSynthesis.getVoices().length > 0) {
            checkCantoneseVoice();
        }
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAudio);
} else {
    initAudio();
}

// ==================== UI SETUP ====================

/**
 * Setup speech rate slider
 */
function setupSpeechRateControl() {
    const slider = document.getElementById('speechRateSlider');
    const valueDisplay = document.getElementById('speechRateValue');

    if (slider) {
        // Set initial value
        slider.value = currentSpeechRate;
        if (valueDisplay) {
            valueDisplay.textContent = currentSpeechRate.toFixed(1) + 'x';
        }

        // Handle changes
        slider.addEventListener('input', (e) => {
            const rate = parseFloat(e.target.value);
            setSpeechRate(rate);
            if (valueDisplay) {
                valueDisplay.textContent = rate.toFixed(1) + 'x';
            }
        });
    }
}

// Export for use in other modules
window.CantoneseAudio = {
    playSound,
    playWord,
    playCharAudio,
    playTestAudio,
    safeSpeechSynthesis,
    getCantoneseVoice,
    checkCantoneseVoice,
    isSpeechAvailable,
    getSpeechRate,
    setSpeechRate,
    setupSpeechRateControl,
    AudioConfig
};

// Also export individual functions for backward compatibility
window.playSound = playSound;
window.playWord = playWord;
window.playCharAudio = playCharAudio;
window.safeSpeechSynthesis = safeSpeechSynthesis;
window.getCantoneseVoice = getCantoneseVoice;
window.checkCantoneseVoice = checkCantoneseVoice;
