/**
 * ==================== STORIES DATA ====================
 * Story metadata and quiz data for Cantonese Playground
 * Contains 12 classic stories with comprehension quizzes
 * ================================================================
 */

// ==================== STORY METADATA ====================

const storiesData = {
    story1: {
        id: 'story1',
        title: '小馬過河',
        titleEnglish: 'Little Horse Crosses the River',
        icon: '🐴',
        moral: '要自己試吓 (Must try yourself)',
        moralEnglish: 'You must try things yourself to know the truth'
    },
    story2: {
        id: 'story2',
        title: '龜兔賽跑',
        titleEnglish: 'The Tortoise and the Hare',
        icon: '🐢',
        moral: '堅持到底就成功 (Persevere to succeed)',
        moralEnglish: 'Slow and steady wins the race'
    },
    story3: {
        id: 'story3',
        title: '三隻小豬',
        titleEnglish: 'The Three Little Pigs',
        icon: '🐷',
        moral: '做嘢要認真 (Work must be serious)',
        moralEnglish: 'Hard work and diligence pay off'
    },
    story4: {
        id: 'story4',
        title: '狼嚟喇',
        titleEnglish: 'The Boy Who Cried Wolf',
        icon: '🐺',
        moral: '講大話冇人信 (Liars aren\'t believed)',
        moralEnglish: 'Honesty is the best policy'
    },
    story5: {
        id: 'story5',
        title: '拔蘿蔔',
        titleEnglish: 'Pulling Up the Turnip',
        icon: '🥕',
        moral: '團結就係力量 (Unity is strength)',
        moralEnglish: 'Together we are stronger'
    },
    story6: {
        id: 'story6',
        title: '小紅帽',
        titleEnglish: 'Little Red Riding Hood',
        icon: '🧒',
        moral: '唔好同陌生人傾偈 (Don\'t talk to strangers)',
        moralEnglish: 'Be careful of strangers'
    },
    story7: {
        id: 'story7',
        title: '醜小鴨',
        titleEnglish: 'The Ugly Duckling',
        icon: '🦢',
        moral: '每個人都有價值 (Everyone has value)',
        moralEnglish: 'Don\'t judge by appearances'
    },
    story8: {
        id: 'story8',
        title: '愚公移山',
        titleEnglish: 'The Foolish Old Man Moves the Mountain',
        icon: '⛰️',
        moral: '有恆心做咩都得 (With perseverance, anything is possible)',
        moralEnglish: 'Determination overcomes all obstacles'
    },
    story9: {
        id: 'story9',
        title: '孔融讓梨',
        titleEnglish: 'Kong Rong Yields the Pears',
        icon: '🍐',
        moral: '要謙讓尊重長輩 (Be humble and respect elders)',
        moralEnglish: 'Respect your elders and be humble'
    },
    story10: {
        id: 'story10',
        title: '司馬光砸缸',
        titleEnglish: 'Sima Guang Breaks the Vat',
        icon: '🏺',
        moral: '遇到問題要冷靜 (Stay calm when facing problems)',
        moralEnglish: 'Quick thinking can save lives'
    },
    story11: {
        id: 'story11',
        title: '守株待兔',
        titleEnglish: 'Waiting by a Tree for Rabbits',
        icon: '🐰',
        moral: '唔好靠運氣 (Don\'t rely on luck)',
        moralEnglish: 'Don\'t rely on luck, work hard instead'
    },
    story12: {
        id: 'story12',
        title: '井底之蛙',
        titleEnglish: 'The Frog at the Bottom of the Well',
        icon: '🐸',
        moral: '要開闊眼界 (Broaden your horizons)',
        moralEnglish: 'Don\'t be narrow-minded'
    }
};

// ==================== STORY QUIZ DATA ====================

const storyQuizData = {
    story1: [
        {
            question: '小馬要過河做咩？',
            questionEnglish: 'Why did the little horse want to cross the river?',
            options: ['送麥子俾磨坊', '去玩', '搵朋友', '飲水'],
            correctAnswer: 0
        },
        {
            question: '牛伯伯話河水深唔深？',
            questionEnglish: 'Did Uncle Cow say the river was deep?',
            options: ['唔深', '好深', '唔知', '冇講'],
            correctAnswer: 0
        },
        {
            question: '松鼠話河水深唔深？',
            questionEnglish: 'Did the squirrel say the river was deep?',
            options: ['好深', '唔深', '唔知', '冇講'],
            correctAnswer: 0
        },
        {
            question: '最後小馬點樣做？',
            questionEnglish: 'What did the little horse do in the end?',
            options: ['自己試', '唔過河', '游水', '等媽媽'],
            correctAnswer: 0
        },
        {
            question: '呢個故事話俾我哋知咩道理？',
            questionEnglish: 'What is the moral of the story?',
            options: ['要自己試吓', '聽大人話', '唔好過河', '水好危險'],
            correctAnswer: 0
        }
    ],
    story2: [
        {
            question: '兔仔同龜比賽咩？',
            questionEnglish: 'What did the rabbit and tortoise compete in?',
            options: ['跑步', '游水', '跳高', '食嘢'],
            correctAnswer: 0
        },
        {
            question: '兔仔喺比賽中做咗咩？',
            questionEnglish: 'What did the rabbit do during the race?',
            options: ['瞓覺', '食嘢', '玩', '睇風景'],
            correctAnswer: 0
        },
        {
            question: '邊個贏咗比賽？',
            questionEnglish: 'Who won the race?',
            options: ['烏龜', '兔仔', '兩個都冇', '一齊到'],
            correctAnswer: 0
        },
        {
            question: '烏龜點解會贏？',
            questionEnglish: 'Why did the tortoise win?',
            options: ['堅持到底', '跑得快', '兔仔俾佢', '條路短'],
            correctAnswer: 0
        },
        {
            question: '呢個故事話俾我哋知咩道理？',
            questionEnglish: 'What is the moral of the story?',
            options: ['堅持就會成功', '跑快啲', '要瞓覺', '要食嘢'],
            correctAnswer: 0
        }
    ],
    story3: [
        {
            question: '有幾多隻小豬？',
            questionEnglish: 'How many little pigs were there?',
            options: ['三隻', '兩隻', '四隻', '五隻'],
            correctAnswer: 0
        },
        {
            question: '第一隻小豬用咩起屋？',
            questionEnglish: 'What did the first pig use to build the house?',
            options: ['稻草', '木頭', '磚頭', '石頭'],
            correctAnswer: 0
        },
        {
            question: '邊個嚟吹屋？',
            questionEnglish: 'Who came to blow down the houses?',
            options: ['大灰狼', '大熊', '老虎', '獅子'],
            correctAnswer: 0
        },
        {
            question: '邊間屋最堅固？',
            questionEnglish: 'Which house was the strongest?',
            options: ['磚屋', '草屋', '木屋', '紙屋'],
            correctAnswer: 0
        },
        {
            question: '呢個故事話俾我哋知咩道理？',
            questionEnglish: 'What is the moral of the story?',
            options: ['做嘢要認真', '快啲做', '用稻草', '唔使努力'],
            correctAnswer: 0
        }
    ],
    story4: [
        {
            question: '牧童嘅工作係咩？',
            questionEnglish: 'What was the shepherd boy\'s job?',
            options: ['睇羊', '種田', '打獵', '煮飯'],
            correctAnswer: 0
        },
        {
            question: '牧童講咗幾多次大話？',
            questionEnglish: 'How many times did the boy lie?',
            options: ['兩次', '一次', '三次', '四次'],
            correctAnswer: 0
        },
        {
            question: '村民點解唔救佢？',
            questionEnglish: 'Why didn\'t the villagers help him?',
            options: ['佢講咗太多大話', '太遠', '太夜', '太攰'],
            correctAnswer: 0
        },
        {
            question: '最後發生咩事？',
            questionEnglish: 'What happened in the end?',
            options: ['狼真係嚟咗', '冇事發生', '牧童走咗', '村民嚟咗'],
            correctAnswer: 0
        },
        {
            question: '呢個故事話俾我哋知咩道理？',
            questionEnglish: 'What is the moral of the story?',
            options: ['唔好講大話', '狼好危險', '要大聲叫', '要跑快啲'],
            correctAnswer: 0
        }
    ],
    story5: [
        {
            question: '老公公喺田度種咗咩？',
            questionEnglish: 'What did the old man plant?',
            options: ['蘿蔔', '蘋果', '西瓜', '薯仔'],
            correctAnswer: 0
        },
        {
            question: '蘿蔔有咩特別？',
            questionEnglish: 'What was special about the turnip?',
            options: ['好大', '好甜', '好靚', '好香'],
            correctAnswer: 0
        },
        {
            question: '邊個幫老公公拔蘿蔔？',
            questionEnglish: 'Who helped pull the turnip?',
            options: ['好多人同動物', '得老公公', '得老婆婆', '冇人'],
            correctAnswer: 0
        },
        {
            question: '最後點樣先拔到蘿蔔？',
            questionEnglish: 'How did they finally pull out the turnip?',
            options: ['大家一齊拔', '用機器', '等佢自己跌', '斬開佢'],
            correctAnswer: 0
        },
        {
            question: '呢個故事話俾我哋知咩道理？',
            questionEnglish: 'What is the moral of the story?',
            options: ['團結就係力量', '蘿蔔好重', '要種嘢', '一個人做'],
            correctAnswer: 0
        }
    ],
    story6: [
        {
            question: '小紅帽要去邊度？',
            questionEnglish: 'Where did Little Red Riding Hood want to go?',
            options: ['婆婆屋企', '學校', '超市', '公園'],
            correctAnswer: 0
        },
        {
            question: '媽媽叫小紅帽帶咩俾婆婆？',
            questionEnglish: 'What did mom tell Little Red to bring to grandma?',
            options: ['食物同藥', '玩具', '衫', '書'],
            correctAnswer: 0
        },
        {
            question: '小紅帽喺森林遇到邊個？',
            questionEnglish: 'Who did Little Red meet in the forest?',
            options: ['大灰狼', '熊', '獅子', '老虎'],
            correctAnswer: 0
        },
        {
            question: '邊個救咗小紅帽同婆婆？',
            questionEnglish: 'Who saved Little Red and grandma?',
            options: ['獵人', '爸爸', '警察', '媽媽'],
            correctAnswer: 0
        },
        {
            question: '呢個故事話俾我哋知咩道理？',
            questionEnglish: 'What is the moral of the story?',
            options: ['唔好同陌生人傾偈', '要食嘢', '要去森林', '要跑快啲'],
            correctAnswer: 0
        }
    ],
    story7: [
        {
            question: '醜小鴨係咩動物？',
            questionEnglish: 'What kind of animal was the ugly duckling?',
            options: ['天鵝', '鴨', '雞', '鵝'],
            correctAnswer: 0
        },
        {
            question: '點解大家唔鍾意佢？',
            questionEnglish: 'Why didn\'t everyone like him?',
            options: ['佢同其他鴨仔唔同', '佢曳', '佢食得多', '佢唔聽話'],
            correctAnswer: 0
        },
        {
            question: '醜小鴨最後變成咩？',
            questionEnglish: 'What did the ugly duckling become?',
            options: ['靚天鵝', '大鴨', '雞', '鵝'],
            correctAnswer: 0
        },
        {
            question: '呢個故事話俾我哋知咩道理？',
            questionEnglish: 'What is the moral of the story?',
            options: ['每個人都有價值', '要靚', '要大', '要強'],
            correctAnswer: 0
        }
    ],
    story8: [
        {
            question: '愚公想做咩？',
            questionEnglish: 'What did the foolish old man want to do?',
            options: ['移走座山', '建屋', '種樹', '起路'],
            correctAnswer: 0
        },
        {
            question: '邊個笑愚公？',
            questionEnglish: 'Who laughed at the old man?',
            options: ['智叟', '神仙', '鄰居', '兒子'],
            correctAnswer: 0
        },
        {
            question: '愚公點樣回應？',
            questionEnglish: 'How did the old man respond?',
            options: ['子子孫孫會繼續做', '放棄', '換方法', '唔做'],
            correctAnswer: 0
        },
        {
            question: '最後發生咩事？',
            questionEnglish: 'What happened in the end?',
            options: ['神仙幫佢移走座山', '佢放棄', '佢搬走', '冇事'],
            correctAnswer: 0
        },
        {
            question: '呢個故事話俾我哋知咩道理？',
            questionEnglish: 'What is the moral of the story?',
            options: ['有恆心做咩都得', '要聽人講', '唔使努力', '要聰明'],
            correctAnswer: 0
        }
    ],
    story9: [
        {
            question: '孔融幾多歲？',
            questionEnglish: 'How old was Kong Rong?',
            options: ['四歲', '五歲', '六歲', '七歲'],
            correctAnswer: 0
        },
        {
            question: '孔融揀咗咩梨？',
            questionEnglish: 'Which pear did Kong Rong choose?',
            options: ['最細嗰個', '最大嗰個', '中間嗰個', '冇揀'],
            correctAnswer: 0
        },
        {
            question: '點解孔融揀細嘅梨？',
            questionEnglish: 'Why did Kong Rong choose the small pear?',
            options: ['俾大嘅俾哥哥弟弟', '佢唔鍾意食梨', '佢唔餓', '爸爸叫佢'],
            correctAnswer: 0
        },
        {
            question: '呢個故事話俾我哋知咩道理？',
            questionEnglish: 'What is the moral of the story?',
            options: ['要謙讓尊重長輩', '梨好食', '要食大嘅', '唔好食梨'],
            correctAnswer: 0
        }
    ],
    story10: [
        {
            question: '司馬光嗰陣幾多歲？',
            questionEnglish: 'How old was Sima Guang?',
            options: ['七歲', '五歲', '十歲', '三歲'],
            correctAnswer: 0
        },
        {
            question: '發生咩事？',
            questionEnglish: 'What happened?',
            options: ['小朋友跌落大水缸', '有火', '有蛇', '落雨'],
            correctAnswer: 0
        },
        {
            question: '司馬光點樣做？',
            questionEnglish: 'What did Sima Guang do?',
            options: ['用石頭砸爛水缸', '叫大人', '跳落去救', '跑走'],
            correctAnswer: 0
        },
        {
            question: '呢個故事話俾我哋知咩道理？',
            questionEnglish: 'What is the moral of the story?',
            options: ['遇到問題要冷靜', '要叫大人', '唔好玩水', '要跑'],
            correctAnswer: 0
        }
    ],
    story11: [
        {
            question: '農夫做緊咩嘢？',
            questionEnglish: 'What was the farmer doing?',
            options: ['耕田', '瞓覺', '食嘢', '玩'],
            correctAnswer: 0
        },
        {
            question: '點解兔仔會撞樹？',
            questionEnglish: 'Why did the rabbit hit the tree?',
            options: ['跑得太快', '睇唔到', '故意', '俾人推'],
            correctAnswer: 0
        },
        {
            question: '農夫之後做咩？',
            questionEnglish: 'What did the farmer do afterwards?',
            options: ['每日等兔仔', '繼續耕田', '走咗', '種樹'],
            correctAnswer: 0
        },
        {
            question: '最後發生咩事？',
            questionEnglish: 'What happened in the end?',
            options: ['田荒廢咗', '捉到好多兔仔', '變有錢', '冇事'],
            correctAnswer: 0
        },
        {
            question: '呢個故事話俾我哋知咩道理？',
            questionEnglish: 'What is the moral of the story?',
            options: ['唔好靠運氣', '要等', '兔仔好笨', '樹好危險'],
            correctAnswer: 0
        }
    ],
    story12: [
        {
            question: '青蛙住喺邊度？',
            questionEnglish: 'Where did the frog live?',
            options: ['井底', '河邊', '山上', '樹上'],
            correctAnswer: 0
        },
        {
            question: '青蛙覺得天有幾大？',
            questionEnglish: 'How big did the frog think the sky was?',
            options: ['好細', '好大', '唔知', '冇睇過'],
            correctAnswer: 0
        },
        {
            question: '邊個話俾青蛙聽外面嘅世界？',
            questionEnglish: 'Who told the frog about the outside world?',
            options: ['海龜', '魚', '鳥', '蛇'],
            correctAnswer: 0
        },
        {
            question: '呢個故事話俾我哋知咩道理？',
            questionEnglish: 'What is the moral of the story?',
            options: ['要開闊眼界', '井好舒服', '唔好出去', '天好細'],
            correctAnswer: 0
        }
    ]
};

// ==================== STORY LIST (for menu) ====================

const storyList = [
    { id: 'story1', title: '小馬過河', icon: '🐴' },
    { id: 'story2', title: '龜兔賽跑', icon: '🐢' },
    { id: 'story3', title: '三隻小豬', icon: '🐷' },
    { id: 'story4', title: '狼嚟喇', icon: '🐺' },
    { id: 'story5', title: '拔蘿蔔', icon: '🥕' },
    { id: 'story6', title: '小紅帽', icon: '🧒' },
    { id: 'story7', title: '醜小鴨', icon: '🦢' },
    { id: 'story8', title: '愚公移山', icon: '⛰️' },
    { id: 'story9', title: '孔融讓梨', icon: '🍐' },
    { id: 'story10', title: '司馬光砸缸', icon: '🏺' },
    { id: 'story11', title: '守株待兔', icon: '🐰' },
    { id: 'story12', title: '井底之蛙', icon: '🐸' }
];

// ==================== EXPORTS ====================

// Export for use in other modules
if (typeof window !== 'undefined') {
    window.storiesData = storiesData;
    window.storyQuizData = storyQuizData;
    window.storyList = storyList;
}
