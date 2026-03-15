/**
 * ==================== QUESTION GENERATOR ====================
 * Dynamic question generation for Cantonese Playground
 * Generates 6 different question types from vocabulary data
 * ================================================================
 */

const QuestionGenerator = (function() {

    // ==================== UTILITY FUNCTIONS ====================

    /**
     * Shuffle an array (Fisher-Yates algorithm)
     * @param {Array} array - Array to shuffle
     * @returns {Array} Shuffled array
     */
    function shuffleArray(array) {
        const result = [...array];
        for (let i = result.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [result[i], result[j]] = [result[j], result[i]];
        }
        return result;
    }

    /**
     * Get random items from array
     * @param {Array} array - Source array
     * @param {number} count - Number of items to get
     * @param {Array} exclude - Items to exclude
     * @returns {Array} Random items
     */
    function getRandomItems(array, count, exclude = []) {
        const filtered = array.filter(item => !exclude.includes(item));
        const shuffled = shuffleArray(filtered);
        return shuffled.slice(0, count);
    }

    /**
     * Get vocabulary items from categories
     * @param {Array} categories - Category names
     * @param {Object} sliceConfig - Optional slice configuration
     * @returns {Array} Vocabulary items
     */
    function getVocabularyFromCategories(categories, sliceConfig = null) {
        if (typeof vocabularyData === 'undefined') {
            console.error('vocabularyData not loaded');
            return [];
        }

        let items = [];

        categories.forEach(category => {
            let categoryItems = vocabularyData[category] || [];

            // Apply slice if specified
            if (sliceConfig) {
                if (Array.isArray(sliceConfig)) {
                    categoryItems = categoryItems.slice(sliceConfig[0], sliceConfig[1]);
                } else if (sliceConfig[category]) {
                    const [start, end] = sliceConfig[category];
                    categoryItems = categoryItems.slice(start, end);
                }
            }

            // Add category info to each item
            categoryItems.forEach(item => {
                items.push({
                    ...item,
                    category: category
                });
            });
        });

        return items;
    }

    /**
     * Get distractors (wrong answers) for a vocabulary item
     * @param {Object} targetItem - The correct answer item
     * @param {Array} allItems - All available items
     * @param {string} field - Field to use for distractors (chinese, english, jyutping, icon)
     * @param {number} count - Number of distractors needed
     * @returns {Array} Distractor values
     */
    function getDistractors(targetItem, allItems, field, count = 3) {
        const distractors = [];
        const targetValue = targetItem[field];
        const targetLen = (targetValue || '').length;

        // Filter out the target and items with same value
        const candidates = allItems.filter(item =>
            item[field] !== targetValue &&
            item.chinese !== targetItem.chinese
        );

        // Prefer candidates with the same character length as the answer
        const sameLen = shuffleArray(candidates.filter(item => (item[field] || '').length === targetLen));
        const diffLen = shuffleArray(candidates.filter(item => (item[field] || '').length !== targetLen));

        // Take same-length first, then fall back to different-length
        const ordered = [...sameLen, ...diffLen];

        for (let i = 0; i < Math.min(count, ordered.length); i++) {
            distractors.push(ordered[i][field]);
        }

        // If not enough distractors, pad with generic options matching target length
        while (distractors.length < count) {
            const genericOptions = {
                chinese: ['係', '唔係', '有', '冇', '好嘅', '可以', '得'],
                english: ['Yes', 'No', 'Maybe', 'Unknown'],
                jyutping: ['hai6', 'm4 hai6', 'jau5', 'mou5'],
                icon: ['❓', '❔', '🔶', '🔷']
            };
            const options = genericOptions[field] || ['?'];
            // Prefer same-length generics too
            const unused = options
                .filter(opt => opt !== targetValue && !distractors.includes(opt))
                .sort((a, b) => Math.abs(a.length - targetLen) - Math.abs(b.length - targetLen));
            if (unused.length > 0) {
                distractors.push(unused[0]);
            } else {
                break;
            }
        }

        return distractors;
    }

    /**
     * Segment Chinese sentence into words
     * @param {string} sentence - Chinese sentence
     * @returns {Array} Array of word segments
     */
    function segmentSentence(sentence) {
        // Common word patterns in Cantonese
        const patterns = [
            // Common phrases (3+ characters)
            '唔好意思', '對唔住', '好高興', '認識你', '幾多錢', '幾多位',
            '可以去', '可以食', '可以飲', '可以睇', '可以玩',
            '食飽喇', '做完喇', '返嚟喇', '放學喇',
            '早晨老師', '聖誕快樂', '新年快樂', '生日快樂',
            '恭喜發財', '好高興認識你',
            // 2-character words
            '你好', '我哋', '你哋', '佢哋', '唔該', '多謝',
            '早晨', '晚安', '再見', '拜拜',
            '點解', '點樣', '邊度', '邊個', '幾時', '幾多',
            '乜嘢', '咩嘢', '呢個', '嗰個',
            '因為', '所以', '如果', '但係', '同埋', '或者', '然後', '仲有',
            '可以', '唔可以', '唔想', '好想', '鍾意', '唔鍾意',
            '老師', '同學', '朋友', '屋企', '學校', '餐廳', '廁所',
            '功課', '蛋糕', '雪糕', '禮物', '電視',
            '開心', '攰', '肚餓', '好靚',
            // Particles and common single characters
            '我', '你', '佢', '係', '有', '冇', '去', '嚟', '食', '飲',
            '睇', '聽', '講', '做', '玩', '瞓', '買', '賣', '俾', '攞',
            '想', '要', '愛', '好', '唔', '都', '又', '仲',
            '呀', '呢', '喇', '嘅', '咗', '緊', '過', '完'
        ];

        // Sort patterns by length (longest first)
        const sortedPatterns = [...patterns].sort((a, b) => b.length - a.length);

        const words = [];
        let remaining = sentence;

        while (remaining.length > 0) {
            let matched = false;

            // Try to match longest patterns first
            for (const pattern of sortedPatterns) {
                if (remaining.startsWith(pattern)) {
                    words.push(pattern);
                    remaining = remaining.slice(pattern.length);
                    matched = true;
                    break;
                }
            }

            // If no pattern matched, take single character
            if (!matched) {
                const char = remaining[0];
                // Skip punctuation and spaces
                if (!/[，。！？、\s]/.test(char)) {
                    words.push(char);
                }
                remaining = remaining.slice(1);
            }
        }

        return words;
    }

    // ==================== QUESTION GENERATORS ====================

    /**
     * Generate fill-in-Chinese question
     * @param {Object} item - Vocabulary item
     * @param {Array} allItems - All vocabulary items for distractors
     * @returns {Object} Question object
     */
    function generateFillChinese(item, allItems) {
        const chinese = item.chinese;
        const category = item.category || '';
        let sentence, blankPosition;

        // For single words, create a simple sentence based on category
        if (chinese.length <= 3) {
            // Category-specific templates that make semantic sense
            const categoryTemplates = {
                manners: [
                    // For greetings (早晨, 晚安): exclude apologies, thanks, requests, farewells
                    { template: '___，老師！', excludeWords: ['老', '師', '對唔住', '唔好意思', '多謝', '唔該', '請', '拜拜'] },
                    { template: '___，媽媽！', excludeWords: ['媽', '對唔住', '唔好意思', '多謝', '唔該', '請', '拜拜'] },
                    // For farewells (拜拜): exclude greetings, apologies, thanks, requests
                    { template: '___，聽日見！', excludeWords: ['聽', '日', '見', '早晨', '晚安', '對唔住', '唔好意思', '多謝', '唔該', '請'] },
                    // For thanks (多謝): exclude greetings, farewells, apologies, requests
                    { template: '___你幫我！', excludeWords: ['你', '幫', '我', '早晨', '晚安', '拜拜', '對唔住', '唔好意思', '唔該', '請'] },
                    // For requests (唔該 only): exclude greetings, farewells, apologies, thanks, and 請 (too formal)
                    { template: '___，可以幫我嗎？', excludeWords: ['可', '以', '幫', '我', '嗎', '早晨', '晚安', '拜拜', '對唔住', '唔好意思', '多謝', '請'] },
                    // For formal requests (請 only): exclude everything except 請
                    { template: '___坐低。', excludeWords: ['坐', '低', '早晨', '晚安', '拜拜', '對唔住', '唔好意思', '多謝', '唔該'] },
                    // For apologies (對唔住, 唔好意思): exclude greetings, farewells, thanks, requests
                    { template: '___，我遲到咗。', excludeWords: ['我', '遲', '到', '咗', '早晨', '晚安', '拜拜', '多謝', '唔該', '請'] },
                    { template: '___，我唔係故意。', excludeWords: ['我', '唔', '係', '故', '意', '早晨', '晚安', '拜拜', '多謝', '唔該', '請'] }
                ],
                numbers: [
                    // Exclude "二" from counting templates - use "兩" with classifiers in Cantonese
                    { template: '我有___個蘋果。', excludeWords: ['一', '個', '有', '二'] },
                    { template: '佢有___隻狗。', excludeWords: ['隻', '有', '二'] },
                    { template: '呢度有___個人。', excludeWords: ['個', '有', '二'] },
                    // Math context - "二" is OK here
                    { template: '___加一等於幾多？', excludeWords: ['一', '加', '等'] },
                    { template: '___乘二等於幾多？', excludeWords: ['乘', '二', '等'] }
                ],
                animals: [
                    // "I have a ___" - only pets/small animals a kid could have
                    { template: '我有一隻___。', excludeWords: ['一', '隻', '有', '蛇', '魚', '龍', '鯊魚', '鯨魚', '海豚', '海星', '蟹', '蝦', '大象', '獅子', '老虎', '熊', '馬騮', '企鵝', '長頸鹿', '斑馬', '豬', '牛', '羊', '馬'] },
                    // "This is a ___" - 隻 classifier, exclude animals that use 條
                    { template: '呢隻係___。', excludeWords: ['呢', '隻', '係', '蛇', '魚', '龍', '鯊魚', '鯨魚', '海豚', '海星'] },
                    { template: '我鍾意___。', excludeWords: ['鍾', '意'] },
                    // "The zoo has ___" - only zoo animals, exclude pets/farm/marine/insects
                    { template: '動物園有___。', excludeWords: ['有', '貓', '狗', '雞', '鴨', '豬', '牛', '羊', '馬', '魚', '龍', '鯊魚', '鯨魚', '海豚', '海星', '蟹', '蝦', '蝸牛', '蝴蝶', '蜜蜂', '螞蟻', '蜘蛛'] }
                ],
                foods: [
                    { template: '我想食___。', excludeWords: ['想', '食'] },
                    { template: '我鍾意食___。', excludeWords: ['鍾', '意', '食'] },
                    { template: '呢個係___。', excludeWords: ['呢', '個', '係'] },
                    { template: '我食緊___。', excludeWords: ['食', '緊'] }
                ],
                colors: [
                    { template: '蘋果係___。', excludeWords: ['係', '藍色', '紫色', '粉紅色', '黑色', '白色', '灰色', '啡色', '金色', '銀色'] },
                    { template: '天空係___。', excludeWords: ['係', '紅色', '黃色', '綠色', '橙色', '紫色', '粉紅色', '黑色', '白色', '灰色', '啡色', '金色', '銀色'] },
                    { template: '呢朵花係___。', excludeWords: ['呢', '朵', '花', '係', '灰色', '金色', '銀色'] },
                    { template: '我鍾意___。', excludeWords: ['鍾', '意'] },
                    { template: '呢個係___。', excludeWords: ['呢', '個', '係'] }
                ],
                weather: [
                    { template: '今日___。', excludeWords: ['今', '日'] },
                    { template: '出面___。', excludeWords: ['出', '面'] },
                    { template: '天氣好___。', excludeWords: ['天', '氣', '好'] }
                ],
                clothing: [
                    { template: '我著___。', excludeWords: ['著'] },
                    { template: '我戴緊___。', excludeWords: ['戴', '緊'] },
                    { template: '呢件係___。', excludeWords: ['呢', '件', '係'] }
                ],
                places: [
                    { template: '我去___。', excludeWords: ['去'] },
                    { template: '呢度係___。', excludeWords: ['呢', '度', '係'] },
                    { template: '我喺___。', excludeWords: ['喺'] }
                ],
                body: [
                    { template: '呢個係___。', excludeWords: ['呢', '個', '係'] },
                    { template: '我嘅___好大。', excludeWords: ['嘅', '好', '大'] }
                ],
                family: [
                    { template: '呢個係我___。', excludeWords: ['呢', '個', '係', '我'] },
                    { template: '我愛___。', excludeWords: ['愛'] }
                ],
                emotions: [
                    { template: '我好___。', excludeWords: ['好'] },
                    { template: '佢好___。', excludeWords: ['佢', '好'] }
                ],
                sports: [
                    { template: '我鍾意打___。', excludeWords: ['鍾', '意', '打'] },
                    { template: '我識玩___。', excludeWords: ['識', '玩'] }
                ],
                transport: [
                    { template: '我搭___。', excludeWords: ['搭'] },
                    // "架" classifier for vehicles, exclude boats (船, 渡輪) which use 條/艘
                    { template: '呢架係___。', excludeWords: ['呢', '架', '係', '船', '渡輪'] },
                    // Generic template for all transport
                    { template: '我坐___去。', excludeWords: ['坐', '去'] }
                ],
                nature: [
                    { template: '我見到___。', excludeWords: ['見', '到'] },
                    // Exclude sky objects from "park has" template
                    { template: '公園有___。', excludeWords: ['公', '園', '有', '太陽', '月亮', '星星', '雲'] }
                ],
                occupations: [
                    { template: '佢係___。', excludeWords: ['佢', '係'] },
                    { template: '我想做___。', excludeWords: ['我', '想', '做'] },
                    { template: '呢個___好叻。', excludeWords: ['呢', '個', '好', '叻'] }
                ],
                hobbies: [
                    { template: '我鍾意___。', excludeWords: ['鍾', '意'] },
                    { template: '佢識___。', excludeWords: ['佢', '識'] },
                    { template: '我哋一齊___。', excludeWords: ['我', '哋', '一', '齊'] }
                ],
                dailyactivities: [
                    { template: '我每日都___。', excludeWords: ['我', '每', '日', '都'] },
                    { template: '朝早要___。', excludeWords: ['朝', '早', '要'] },
                    { template: '我___喇。', excludeWords: ['我', '喇'] }
                ],
                adjectives: [
                    { template: '呢個好___。', excludeWords: ['呢', '個', '好'] },
                    { template: '佢好___。', excludeWords: ['佢', '好'] },
                    { template: '隻狗好___。', excludeWords: ['隻', '狗', '好'] }
                ],
                verbs: [
                    // Exclude stative verbs (係, 有, 冇) from progressive templates
                    { template: '我___緊。', excludeWords: ['我', '緊', '係', '有', '冇'] },
                    { template: '佢識___。', excludeWords: ['佢', '識'] },
                    { template: '我想___。', excludeWords: ['我', '想'] },
                    // Templates for stative verbs
                    { template: '佢___學生。', excludeWords: ['佢', '學', '生', '有', '冇', '食', '飲', '去', '嚟', '睇', '聽', '講', '寫', '讀', '做', '玩', '瞓', '買', '賣', '俾', '攞'] },
                    { template: '我___錢。', excludeWords: ['我', '錢', '係', '食', '飲', '去', '嚟', '睇', '聽', '講', '寫', '讀', '做', '玩', '瞓', '買', '賣', '俾', '攞'] }
                ],
                quantitywords: [
                    { template: '一___蘋果。', excludeWords: ['一', '蘋', '果'] },
                    { template: '兩___狗。', excludeWords: ['兩', '狗'] },
                    { template: '三___書。', excludeWords: ['三', '書'] },
                    { template: '幾___人？', excludeWords: ['幾', '人'] }
                ],
                pronouns: [
                    // For subject pronouns (我, 你, 佢, 我哋, 你哋, 佢哋)
                    { template: '___去學校。', excludeWords: ['去', '學', '校', '呢個', '嗰個', '邊個', '乜嘢'] },
                    { template: '___食飯。', excludeWords: ['食', '飯', '呢個', '嗰個', '邊個', '乜嘢'] },
                    // For demonstrative pronouns (呢個, 嗰個)
                    { template: '___好靚。', excludeWords: ['好', '靚', '我', '你', '佢', '我哋', '你哋', '佢哋', '邊個', '乜嘢'] },
                    { template: '我要___。', excludeWords: ['我', '要', '我哋', '你哋', '佢哋', '邊個', '乜嘢'] }
                ],
                expresswords: [
                    { template: '我___食雪糕。', excludeWords: ['我', '食', '雪', '糕'] },
                    { template: '佢___去公園。', excludeWords: ['佢', '去', '公', '園'] },
                    { template: '你___幫我嗎？', excludeWords: ['你', '幫', '我', '嗎'] },
                    { template: '我哋___一齊玩。', excludeWords: ['我', '哋', '一', '齊', '玩'] }
                ],
                questions: [
                    // Templates that work with question words
                    { template: '你住喺___？', excludeWords: ['你', '住', '喺', '嗎', '幾時', '點解', '點樣', '幾多', '乜嘢', '邊個'] },
                    { template: '___食飯？', excludeWords: ['食', '飯', '嗎', '邊度', '點解', '點樣', '幾多', '乜嘢'] },
                    { template: '你___去學校？', excludeWords: ['你', '去', '學', '校', '嗎', '邊度', '邊個', '點樣', '幾多', '乜嘢'] },
                    { template: '你食___？', excludeWords: ['你', '食', '嗎', '邊度', '幾時', '邊個', '點解', '點樣', '幾多'] },
                    // For quantity question (幾多)
                    { template: '你有___個蘋果？', excludeWords: ['你', '有', '個', '蘋', '果', '嗎', '邊度', '幾時', '邊個', '點解', '點樣', '乜嘢'] }
                ],
                linkingwords: [
                    // For cause-effect (因為, 所以)
                    { template: '___我攰，我要瞓覺。', excludeWords: ['我', '攰', '要', '瞓', '覺', '所以', '但係', '如果', '然後', '同埋', '或者', '仲有'] },
                    { template: '我肚餓，___食飯。', excludeWords: ['我', '肚', '餓', '食', '飯', '因為', '但係', '如果', '然後', '同埋', '或者', '仲有'] },
                    // For conditional (如果)
                    { template: '___落雨，我哋留喺屋企。', excludeWords: ['落', '雨', '我', '哋', '留', '喺', '屋', '企', '因為', '所以', '但係', '然後', '同埋', '或者', '仲有'] },
                    // For contrast (但係)
                    { template: '我想去，___我冇時間。', excludeWords: ['我', '想', '去', '冇', '時', '間', '因為', '所以', '如果', '然後', '同埋', '或者', '仲有'] },
                    // For sequence (然後)
                    { template: '我食飯，___去瞓覺。', excludeWords: ['我', '食', '飯', '去', '瞓', '覺', '因為', '所以', '如果', '但係', '同埋', '或者', '仲有'] },
                    // For addition (同埋)
                    { template: '我有書___筆。', excludeWords: ['我', '書', '筆', '因為', '所以', '如果', '但係', '然後', '或者', '仲有'] },
                    // For alternative (或者)
                    { template: '你想食飯___麵？', excludeWords: ['你', '想', '食', '飯', '麵', '因為', '所以', '如果', '但係', '然後', '同埋', '仲有'] },
                    // For additionally (仲有)
                    { template: '我有貓，___有狗。', excludeWords: ['我', '貓', '狗', '因為', '所以', '如果', '但係', '然後', '同埋', '或者'] }
                ],
                shapes: [
                    { template: '呢個係___。', excludeWords: ['呢', '個', '係'] },
                    { template: '我畫咗一個___。', excludeWords: ['我', '畫', '咗', '一', '個'] },
                    { template: '呢個形狀係___。', excludeWords: ['呢', '個', '形', '狀', '係'] }
                ],
                // Holiday categories
                lunarnewyear: [
                    { template: '新年有___。', excludeWords: ['新', '年', '有'] },
                    { template: '我收到___。', excludeWords: ['我', '收', '到'] },
                    { template: '新年我見到___。', excludeWords: ['新', '年', '我', '見', '到'] }
                ],
                easter: [
                    { template: '復活節有___。', excludeWords: ['復', '活', '節', '有'] },
                    { template: '我哋去___。', excludeWords: ['我', '哋', '去'] },
                    { template: '復活節我見到___。', excludeWords: ['復', '活', '節', '我', '見', '到'] }
                ],
                dragonboat: [
                    { template: '端午節食___。', excludeWords: ['端', '午', '節', '食'] },
                    { template: '我哋睇___。', excludeWords: ['我', '哋', '睇'] },
                    { template: '端午節有___。', excludeWords: ['端', '午', '節', '有'] }
                ],
                midautumn: [
                    { template: '中秋節食___。', excludeWords: ['中', '秋', '節', '食'] },
                    { template: '中秋節有___。', excludeWords: ['中', '秋', '節', '有'] },
                    { template: '我哋睇___。', excludeWords: ['我', '哋', '睇'] }
                ],
                canadaday: [
                    { template: '加拿大日有___。', excludeWords: ['加', '拿', '大', '日', '有'] },
                    { template: '我哋睇___。', excludeWords: ['我', '哋', '睇'] },
                    { template: '國慶有___。', excludeWords: ['國', '慶', '有'] }
                ],
                thanksgiving: [
                    { template: '感恩節食___。', excludeWords: ['感', '恩', '節', '食'] },
                    { template: '感恩節有___。', excludeWords: ['感', '恩', '節', '有'] },
                    { template: '我哋一齊___。', excludeWords: ['我', '哋', '一', '齊'] }
                ],
                halloween: [
                    { template: '萬聖節有___。', excludeWords: ['萬', '聖', '節', '有'] },
                    { template: '我哋去___。', excludeWords: ['我', '哋', '去'] },
                    { template: '萬聖節我見到___。', excludeWords: ['萬', '聖', '節', '我', '見', '到'] }
                ],
                christmas: [
                    { template: '聖誕節有___。', excludeWords: ['聖', '誕', '節', '有'] },
                    { template: '我收到___。', excludeWords: ['我', '收', '到'] },
                    { template: '聖誕節我見到___。', excludeWords: ['聖', '誕', '節', '我', '見', '到'] }
                ],
                // Sentence categories - for short sentences like 晚安, 再見, etc.
                introduction: [
                    { template: '我講___。', excludeWords: ['我', '講'] },
                    { template: '見到人要講___。', excludeWords: ['見', '到', '人', '要', '講'] }
                ],
                schoolsentences: [
                    { template: '喺學校講___。', excludeWords: ['喺', '學', '校', '講'] },
                    { template: '老師話___。', excludeWords: ['老', '師', '話'] }
                ],
                restaurantsentences: [
                    { template: '喺餐廳講___。', excludeWords: ['喺', '餐', '廳', '講'] },
                    { template: '食嘢時講___。', excludeWords: ['食', '嘢', '時', '講'] }
                ],
                shoppingsentences: [
                    { template: '買嘢時講___。', excludeWords: ['買', '嘢', '時', '講'] },
                    { template: '喺舖頭講___。', excludeWords: ['喺', '舖', '頭', '講'] }
                ],
                homesentences: [
                    { template: '喺屋企講___。', excludeWords: ['喺', '屋', '企', '講'] },
                    { template: '瞓覺前講___。', excludeWords: ['瞓', '覺', '前', '講'] }
                ],
                playgroundsentences: [
                    { template: '玩嘅時候講___。', excludeWords: ['玩', '嘅', '時', '候', '講'] },
                    { template: '同朋友講___。', excludeWords: ['同', '朋', '友', '講'] }
                ],
                partysentences: [
                    { template: '派對時講___。', excludeWords: ['派', '對', '時', '講'] },
                    { template: '開心時講___。', excludeWords: ['開', '心', '時', '講'] }
                ],
                travelsentences: [
                    { template: '去旅行時講___。', excludeWords: ['去', '旅', '行', '時', '講'] },
                    { template: '坐飛機講___。', excludeWords: ['坐', '飛', '機', '講'] }
                ],
                craftingsentences: [
                    { template: '做手工時講___。', excludeWords: ['做', '手', '工', '時', '講'] },
                    { template: '完成後講___。', excludeWords: ['完', '成', '後', '講'] }
                ]
            };

            // Default templates for unknown categories
            const defaultTemplates = [
                { template: '___係乜嘢？', excludeWords: ['係', '乜', '嘢'] },
                { template: '你識唔識___？', excludeWords: ['你', '識', '唔'] }
            ];

            // Get templates for this category, or use default
            let templates = categoryTemplates[category] || defaultTemplates;

            // Filter out templates that would create nonsensical sentences
            const validTemplates = templates.filter(tmpl => {
                // Check if the word appears in the template (would create repetition)
                if (tmpl.template.includes(chinese)) return false;
                // Check if word is in the exclude list
                if (tmpl.excludeWords && tmpl.excludeWords.some(w => chinese.includes(w) || w.includes(chinese))) return false;
                return true;
            });

            // Use a valid template, or fall back to a safe generic template
            const tmpl = validTemplates.length > 0
                ? validTemplates[Math.floor(Math.random() * validTemplates.length)]
                : { template: '___係咩？' };

            sentence = tmpl.template;
            blankPosition = 'end';
        } else {
            // For phrases, blank out part of the phrase
            const words = segmentSentence(chinese);
            if (words.length >= 2) {
                const blankIdx = Math.floor(Math.random() * words.length);
                const answer = words[blankIdx];
                sentence = words.map((w, i) => i === blankIdx ? '___' : w).join('');

                return {
                    type: 'fill_chinese',
                    picture: '📝',  // Use generic icon, not the answer's icon
                    jyutping: item.jyutping,
                    chinese: sentence,
                    answer: answer,
                    options: shuffleArray([answer, ...getDistractors({ ...item, chinese: answer }, allItems, 'chinese', 3)])
                };
            }
            sentence = '___係' + chinese.slice(1);
            blankPosition = 'start';
        }

        // Prefer same-category distractors so options make sense in the sentence context
        // e.g., Halloween question should have Halloween-related wrong answers, not "spring"
        const sameCategoryItems = allItems.filter(i => i.category === category);
        const distractorPool = sameCategoryItems.length >= 4 ? sameCategoryItems : allItems;
        const distractors = getDistractors(item, distractorPool, 'chinese', 3);

        // Use the whole word as the answer (not sliced) to keep jyutping consistent
        // Don't show picture for fill-in questions to avoid giving away the answer
        return {
            type: 'fill_chinese',
            picture: '📝',  // Use generic icon, not the answer's icon
            jyutping: item.jyutping,
            chinese: sentence,
            answer: chinese,  // Use whole word, not sliced
            options: shuffleArray([chinese, ...distractors])
        };
    }

    /**
     * Generate select-Jyutping question
     * @param {Object} item - Vocabulary item
     * @param {Array} allItems - All vocabulary items for distractors
     * @returns {Object} Question object
     */
    function generateSelectJyutping(item, allItems) {
        const distractors = getDistractors(item, allItems, 'jyutping', 3);

        return {
            type: 'select_jyutping',
            picture: item.icon || '🗣️',
            chinese: item.chinese,
            english: item.english,
            answer: item.jyutping,
            options: shuffleArray([item.jyutping, ...distractors])
        };
    }

    /**
     * Generate select-picture question
     * @param {Object} item - Vocabulary item
     * @param {Array} allItems - All vocabulary items for distractors
     * @returns {Object} Question object
     */
    function generateSelectPicture(item, allItems) {
        // Prefer same-category distractors for more meaningful choices
        const category = item.category || '';
        const sameCategoryItems = allItems.filter(i => i.category === category);
        const distractorPool = sameCategoryItems.length >= 4 ? sameCategoryItems : allItems;
        const distractors = getDistractors(item, distractorPool, 'icon', 3);

        return {
            type: 'select_picture',
            chinese: item.chinese,
            jyutping: item.jyutping,
            english: item.english,
            answer: item.icon || '❓',
            options: shuffleArray([item.icon || '❓', ...distractors])
        };
    }

    /**
     * Generate word-order question
     * @param {Object} item - Vocabulary item (sentence)
     * @param {Array} allItems - All vocabulary items (unused)
     * @returns {Object} Question object
     */
    function generateWordOrder(item, allItems) {
        const chinese = item.chinese.replace(/[？！。，]/g, ''); // Remove punctuation
        const words = segmentSentence(chinese);

        // Need at least 3 words for word order
        if (words.length < 3) {
            // Fall back to fill_chinese for short sentences
            return generateFillChinese(item, allItems);
        }

        const scrambled = shuffleArray([...words]);

        // Make sure scrambled is different from original
        let attempts = 0;
        while (scrambled.join('') === words.join('') && attempts < 10) {
            shuffleArray(scrambled);
            attempts++;
        }

        return {
            type: 'word_order',
            english: item.english,
            jyutping: item.jyutping,
            picture: item.icon || '🔀',
            answer: words,
            scrambled: scrambled
        };
    }

    /**
     * Generate match-translation question
     * @param {Object} item - Vocabulary item
     * @param {Array} allItems - All vocabulary items for distractors
     * @returns {Object} Question object
     */
    function generateMatchTranslation(item, allItems) {
        // Prefer same-category distractors for more meaningful choices
        const category = item.category || '';
        const sameCategoryItems = allItems.filter(i => i.category === category);
        const distractorPool = sameCategoryItems.length >= 4 ? sameCategoryItems : allItems;
        const distractors = getDistractors(item, distractorPool, 'english', 3);

        // Use generic icon to avoid giving away the answer (e.g., 9️⃣ for "Nine")
        return {
            type: 'match_translation',
            chinese: item.chinese,
            jyutping: item.jyutping,
            picture: '🔄',
            answer: item.english,
            options: shuffleArray([item.english, ...distractors])
        };
    }

    /**
     * Generate audio-identify question
     * @param {Object} item - Vocabulary item
     * @param {Array} allItems - All vocabulary items for distractors
     * @returns {Object} Question object
     */
    function generateAudioIdentify(item, allItems) {
        const distractors = getDistractors(item, allItems, 'chinese', 3);

        return {
            type: 'audio_identify',
            audio_text: item.chinese,
            jyutping: item.jyutping,
            picture: item.icon || '🔊',
            answer: item.chinese,
            options: shuffleArray([item.chinese, ...distractors])
        };
    }

    /**
     * Generate speaking question
     * @param {Object} item - Vocabulary item
     * @param {Array} allItems - All vocabulary items (unused)
     * @returns {Object} Question object
     */
    function generateSpeaking(item, allItems) {
        // Fall back to audio_identify if speech recognition is unavailable
        if (typeof isSpeechRecognitionAvailable === 'function' && !isSpeechRecognitionAvailable()) {
            return generateAudioIdentify(item, allItems);
        }

        return {
            type: 'speaking',
            chinese: item.chinese,
            jyutping: item.jyutping,
            english: item.english,
            picture: item.icon || '🎤',
            answer: item.chinese,
            speakingItem: item
        };
    }

    // ==================== MAIN GENERATOR ====================

    /**
     * Generate questions for a test section
     * @param {string} testId - Test ID
     * @param {string} sectionId - Section ID
     * @returns {Array} Array of question objects
     */
    function generateQuestionsForSection(testId, sectionId) {
        if (typeof testConfig === 'undefined') {
            console.error('testConfig not loaded');
            return [];
        }

        const test = testConfig[testId];
        if (!test) {
            console.error('Test not found:', testId);
            return [];
        }

        const section = test.sections.find(s => s.id === sectionId);
        if (!section) {
            console.error('Section not found:', sectionId);
            return [];
        }

        const questionsPerSection = test.questionsPerSection;
        const distribution = test.questionDistribution;

        // Get vocabulary for this section
        let vocabulary = [];

        if (section.categories) {
            vocabulary = getVocabularyFromCategories(
                section.categories,
                section.categorySlice || null
            );
        }

        // For Jyutping test, we use vocabulary filtered by focus
        if (testId === 'test3' && section.focus) {
            // Use vocabulary from all basic categories for Jyutping practice
            const jyutpingCategories = [
                'manners', 'numbers', 'animals', 'colors', 'foods',
                'weather', 'clothing', 'body', 'family'
            ];
            vocabulary = getVocabularyFromCategories(jyutpingCategories);

            // Filter based on focus
            if (section.focus === 'initials_basic' && section.initials) {
                vocabulary = vocabulary.filter(item => {
                    const firstChar = item.jyutping.split(' ')[0].replace(/[0-9]/g, '');
                    return section.initials.some(init => firstChar.startsWith(init));
                });
            } else if (section.focus === 'initials_advanced' && section.initials) {
                vocabulary = vocabulary.filter(item => {
                    const firstChar = item.jyutping.split(' ')[0].replace(/[0-9]/g, '');
                    return section.initials.some(init => firstChar.startsWith(init));
                });
            } else if (section.focus === 'tones' && section.tones) {
                vocabulary = vocabulary.filter(item => {
                    const tone = item.jyutping.match(/[1-6]/);
                    return tone && section.tones.includes(parseInt(tone[0]));
                });
            } else if (section.focus === 'vowels' && section.vowels) {
                // Filter by vowel sounds (aa, a, e, i, o, u, oe, eo, yu)
                vocabulary = vocabulary.filter(item => {
                    const syllable = item.jyutping.split(' ')[0].replace(/[0-9]/g, '');
                    return section.vowels.some(vowel => syllable.includes(vowel));
                });
            } else if (section.focus === 'endings' && section.endings) {
                // Filter by ending consonants (m, n, ng, p, t, k)
                vocabulary = vocabulary.filter(item => {
                    const syllable = item.jyutping.split(' ')[0].replace(/[0-9]/g, '');
                    return section.endings.some(ending => syllable.endsWith(ending));
                });
            } else if (section.focus === 'complex') {
                // Filter for multi-syllable words (more than one space in jyutping)
                vocabulary = vocabulary.filter(item => {
                    return item.jyutping.includes(' ');
                });
            } else if (section.focus === 'mixed' || section.isMixedReview) {
                // Mixed review - use all vocabulary, no filtering needed
                // Already have full vocabulary loaded
            }
        }

        // Shuffle vocabulary
        vocabulary = shuffleArray(vocabulary);

        // Generate questions based on distribution
        const questions = [];
        const usedItems = new Set(); // Track used vocabulary items by chinese text
        let vocabIndex = 0;
        let cycleCount = 0; // Track how many times we've cycled through vocabulary

        const getNextItem = () => {
            // Try to find an unused item
            let attempts = 0;
            const maxAttempts = vocabulary.length * 2;

            while (attempts < maxAttempts) {
                if (vocabIndex >= vocabulary.length) {
                    vocabIndex = 0;
                    cycleCount++;
                    vocabulary = shuffleArray(vocabulary);

                    // If we've cycled through once and still need more items,
                    // clear used items to allow reuse (better than no questions)
                    if (cycleCount > 0 && usedItems.size >= vocabulary.length) {
                        usedItems.clear();
                    }
                }

                const item = vocabulary[vocabIndex++];
                const itemKey = item.chinese;

                // If item hasn't been used, or we've exhausted all options, use it
                if (!usedItems.has(itemKey) || cycleCount > 0) {
                    usedItems.add(itemKey);
                    return item;
                }

                attempts++;
            }

            // Fallback: return any item if we couldn't find unused one
            return vocabulary[Math.floor(Math.random() * vocabulary.length)];
        };

        // Calculate total questions needed
        const totalQuestionsNeeded = Object.values(distribution).reduce((a, b) => a + b, 0);

        // If vocabulary is smaller than questions needed, log a warning
        if (vocabulary.length < totalQuestionsNeeded) {
            console.warn(`Section ${sectionId}: vocabulary (${vocabulary.length}) < questions needed (${totalQuestionsNeeded}). Some items may repeat.`);
        }

        // Generate each question type
        Object.entries(distribution).forEach(([type, count]) => {
            for (let i = 0; i < count; i++) {
                const item = getNextItem();
                if (!item) continue;

                let question;

                switch (type) {
                    case 'fill_chinese':
                        question = generateFillChinese(item, vocabulary);
                        break;
                    case 'select_jyutping':
                        question = generateSelectJyutping(item, vocabulary);
                        break;
                    case 'select_picture':
                        question = generateSelectPicture(item, vocabulary);
                        break;
                    case 'word_order':
                        question = generateWordOrder(item, vocabulary);
                        break;
                    case 'match_translation':
                        question = generateMatchTranslation(item, vocabulary);
                        break;
                    case 'audio_identify':
                        question = generateAudioIdentify(item, vocabulary);
                        break;
                    case 'speaking':
                        question = generateSpeaking(item, vocabulary);
                        break;
                    default:
                        console.warn('Unknown question type:', type);
                        continue;
                }

                if (question) {
                    questions.push(question);
                }
            }
        });

        // Shuffle all questions
        return shuffleArray(questions);
    }

    /**
     * Generate all questions for a test
     * @param {string} testId - Test ID
     * @returns {Object} Object with section IDs as keys and question arrays as values
     */
    function generateQuestionsForTest(testId) {
        if (typeof testConfig === 'undefined') {
            console.error('testConfig not loaded');
            return {};
        }

        const test = testConfig[testId];
        if (!test) {
            console.error('Test not found:', testId);
            return {};
        }

        const allQuestions = {};

        test.sections.forEach(section => {
            allQuestions[section.id] = generateQuestionsForSection(testId, section.id);
        });

        return allQuestions;
    }

    // ==================== PUBLIC API ====================

    return {
        shuffleArray,
        getRandomItems,
        getVocabularyFromCategories,
        getDistractors,
        segmentSentence,
        generateFillChinese,
        generateSelectJyutping,
        generateSelectPicture,
        generateWordOrder,
        generateMatchTranslation,
        generateAudioIdentify,
        generateSpeaking,
        generateQuestionsForSection,
        generateQuestionsForTest
    };
})();

// ==================== EXPORTS ====================

if (typeof window !== 'undefined') {
    window.QuestionGenerator = QuestionGenerator;
}
