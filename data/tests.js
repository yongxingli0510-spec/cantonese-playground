/**
 * ==================== TESTS DATA ====================
 * Test questions and data for Cantonese Playground
 * Includes Test 1, Test 2, and Leveled Tests (Beginning, Intermediate, Advanced)
 * ================================================================
 */

// ==================== TEST 1 DATA (Learn Words) ====================

const testSections = [
    // SECTION 1: Manners & Greetings (10 questions)
    [
        { picture: "🙏", jyutping: "do1 ze6 nei5 bong1 ngo5!", chinese: "___你幫我!", answer: "多謝", options: ["多謝", "唔該", "對唔住", "請"] },
        { picture: "🙇", jyutping: "m4 goi1, bei2 dei6!", chinese: "___,畀啲!", answer: "唔該", options: ["唔該", "多謝", "請", "對唔住"] },
        { picture: "🌅", jyutping: "___, lou5 si1!", chinese: "___,老師!", answer: "早晨", options: ["早晨", "晚安", "你好", "再見"] },
        { picture: "🌙", jyutping: "___, baa1 baa1!", chinese: "___,爸爸!", answer: "晚安", options: ["晚安", "早晨", "你好", "再見"] },
        { picture: "😔", jyutping: "___, ngo5 m4 hai6 gou3 ji3 ge3", chinese: "___,我唔係故意嘅。", answer: "對唔住", options: ["對唔住", "多謝", "唔該", "請"] },
        { picture: "👐", jyutping: "___ zoi3 sik6 jat1 go3", chinese: "___再食一個。", answer: "請", options: ["請", "多謝", "唔該", "對唔住"] },
        { picture: "😅", jyutping: "___, daa2 jiu4 nei5", chinese: "___,打擾你。", answer: "唔好意思", options: ["唔好意思", "對唔住", "多謝", "唔該"] },
        { picture: "👋", jyutping: "___, tai1 jat6 gin3!", chinese: "___,聽日見!", answer: "拜拜", options: ["拜拜", "你好", "早晨", "晚安"] },
        { picture: "😄", jyutping: "nei5 hou2, ngo5 giu3 ___", chinese: "你好,我叫___。", answer: "小明", options: ["小明", "早晨", "多謝", "再見"] },
        { picture: "🤝", jyutping: "hou2 gou1 hing1 jing6 sik1 nei5", chinese: "好高興___你。", answer: "認識", options: ["認識", "多謝", "再見", "唔該"] }
    ],

    // SECTION 2: Numbers & Colors (10 questions)
    [
        { picture: "🍎", jyutping: "ngo5 jau5 ___ go3 ping4 gwo2", chinese: "我有___個蘋果。", answer: "一", options: ["一", "二", "三", "四"] },
        { picture: "🐕", jyutping: "ngo5 jau5 ___ zek3 gau2", chinese: "我有___隻狗。", answer: "兩", options: ["兩", "一", "三", "五"] },
        { picture: "📚", jyutping: "ngo5 jau5 ___ bun2 syu1", chinese: "我有___本書。", answer: "十", options: ["十", "五", "六", "七"] },
        { picture: "💵", jyutping: "ngo5 jau5 ___ man1", chinese: "我有___蚊。", answer: "一百", options: ["一百", "十", "一千", "五十"] },
        { picture: "🔴", jyutping: "ping4 gwo2 hai6 ___", chinese: "蘋果係___。", answer: "紅色", options: ["紅色", "藍色", "黃色", "綠色"] },
        { picture: "🔵", jyutping: "tin1 hung1 hai6 ___", chinese: "天空係___。", answer: "藍色", options: ["藍色", "紅色", "綠色", "黑色"] },
        { picture: "🟡", jyutping: "heong1 ziu1 hai6 ___", chinese: "香蕉係___。", answer: "黃色", options: ["黃色", "紅色", "橙色", "白色"] },
        { picture: "🟢", jyutping: "syu6 jip6 hai6 ___", chinese: "樹葉係___。", answer: "綠色", options: ["綠色", "藍色", "黃色", "紅色"] },
        { picture: "⚫", jyutping: "maan5 hak1 hai6 ___", chinese: "晚黑係___。", answer: "黑色", options: ["黑色", "白色", "藍色", "灰色"] },
        { picture: "⚪", jyutping: "syut3 hai6 ___", chinese: "雪係___。", answer: "白色", options: ["白色", "黑色", "藍色", "灰色"] }
    ],

    // SECTION 3: Animals (10 questions)
    [
        { picture: "🐱", jyutping: "ngo5 jau5 jat1 zek3 ___", chinese: "我有一隻___。", answer: "貓", options: ["貓", "狗", "魚", "雞"] },
        { picture: "🐶", jyutping: "zek3 ___ hou2 dak1 ji3!", chinese: "隻___好得意!", answer: "狗", options: ["狗", "貓", "豬", "牛"] },
        { picture: "🐟", jyutping: "ngo5 gin3 dou2 jat1 tiu4 ___", chinese: "我見到一條___。", answer: "魚", options: ["魚", "雞", "貓", "狗"] },
        { picture: "🐘", jyutping: "___ hou2 daai6!", chinese: "___好大!", answer: "大象", options: ["大象", "獅子", "老虎", "熊"] },
        { picture: "🦁", jyutping: "___ hai6 saam1 lam4 zi1 wong4", chinese: "___係森林之王。", answer: "獅子", options: ["獅子", "老虎", "熊", "大象"] },
        { picture: "🐰", jyutping: "___ tiu3 dak1 hou2 faai3", chinese: "___跳得好快。", answer: "兔仔", options: ["兔仔", "貓", "狗", "雞"] },
        { picture: "🐢", jyutping: "___ haang4 dak1 hou2 maan6", chinese: "___行得好慢。", answer: "龜", options: ["龜", "蛇", "魚", "兔仔"] },
        { picture: "🐧", jyutping: "___ zyu6 hai2 naam4 gik6", chinese: "___住喺南極。", answer: "企鵝", options: ["企鵝", "北極熊", "海豹", "海象"] },
        { picture: "🦒", jyutping: "___ jau5 hou2 coeng4 ge3 geng2", chinese: "___有好長嘅頸。", answer: "長頸鹿", options: ["長頸鹿", "大象", "斑馬", "獅子"] },
        { picture: "🐵", jyutping: "___ zung1 ji3 sik6 heong1 ziu1", chinese: "___鍾意食香蕉。", answer: "馬騮", options: ["馬騮", "熊", "兔仔", "貓"] }
    ],

    // SECTION 4: Foods & Drinks (10 questions)
    [
        { picture: "🍚", jyutping: "ngo5 sik6 ___", chinese: "我食___。", answer: "飯", options: ["飯", "麵", "麵包", "意粉"] },
        { picture: "🍜", jyutping: "ngo5 soeng2 sik6 ___", chinese: "我想食___。", answer: "麵", options: ["麵", "飯", "麵包", "薯條"] },
        { picture: "🥛", jyutping: "ngo5 jam2 ___", chinese: "我飲___。", answer: "奶", options: ["奶", "水", "茶", "汽水"] },
        { picture: "🍎", jyutping: "ngo5 zung1 ji3 sik6 ___", chinese: "我鍾意食___。", answer: "蘋果", options: ["蘋果", "橙", "香蕉", "西瓜"] },
        { picture: "🍌", jyutping: "___ hai6 wong4 sik1 ge3", chinese: "___係黃色嘅。", answer: "香蕉", options: ["香蕉", "蘋果", "橙", "提子"] },
        { picture: "🍗", jyutping: "ngo5 sik6 ___", chinese: "我食___。", answer: "雞肉", options: ["雞肉", "豬肉", "牛肉", "魚"] },
        { picture: "🍦", jyutping: "___ hou2 dung3!", chinese: "___好凍!", answer: "雪糕", options: ["雪糕", "蛋糕", "曲奇", "朱古力"] },
        { picture: "☕", jyutping: "baa4 baa1 jam2 ___", chinese: "爸爸飲___。", answer: "咖啡", options: ["咖啡", "茶", "奶", "水"] },
        { picture: "🧀", jyutping: "ni1 di1 ___ hou2 hou2 sik6", chinese: "呢啲___好好食。", answer: "芝士", options: ["芝士", "牛油", "雪糕", "奶"] },
        { picture: "🥤", jyutping: "ngo5 soeng2 jam2 ___", chinese: "我想飲___。", answer: "汽水", options: ["汽水", "水", "奶", "茶"] }
    ],

    // SECTION 5: Weather & Clothing (10 questions)
    [
        { picture: "☀️", jyutping: "gam1 jat6 hai6 ___", chinese: "今日係___。", answer: "晴天", options: ["晴天", "落雨", "多雲", "大風"] },
        { picture: "🌧️", jyutping: "ceot1 min6 ___!", chinese: "出面___!", answer: "落雨", options: ["落雨", "晴天", "落雪", "打雷"] },
        { picture: "❄️", jyutping: "gam1 jat6 ___!", chinese: "今日___!", answer: "落雪", options: ["落雪", "落雨", "晴天", "大風"] },
        { picture: "🧊", jyutping: "gam1 jat6 hou2 ___ aa3!", chinese: "今日好___呀!", answer: "凍", options: ["凍", "熱", "暖", "乾"] },
        { picture: "🔥", jyutping: "haa6 tin1 hou2 ___", chinese: "夏天好___。", answer: "熱", options: ["熱", "凍", "暖", "涼"] },
        { picture: "🧥", jyutping: "hou2 dung3, ngo5 zoek3 ___", chinese: "好凍,我著___。", answer: "褸", options: ["褸", "T恤", "裙", "短褲"] },
        { picture: "🧣", jyutping: "hou2 dung3, daai3 ___ laa1", chinese: "好凍,戴___啦。", answer: "頸巾", options: ["頸巾", "帽", "手套", "靴"] },
        { picture: "👕", jyutping: "haa6 tin1 zoek3 ___", chinese: "夏天著___。", answer: "T恤", options: ["T恤", "褸", "冷衫", "大褸"] },
        { picture: "🩳", jyutping: "tin1 hei3 hou2 jit6, zoek3 ___", chinese: "天氣好熱,著___。", answer: "短褲", options: ["短褲", "褸", "冷衫", "靴"] },
        { picture: "👟", jyutping: "ngo5 zoek3 ___ heoi3 paau2 bou6", chinese: "我著___去跑步。", answer: "波鞋", options: ["波鞋", "涼鞋", "靴", "拖鞋"] }
    ],

    // SECTION 6: Body Parts & Places (10 questions)
    [
        { picture: "👀", jyutping: "ngo5 ge3 ___ hou2 daai6", chinese: "我嘅___好大。", answer: "眼", options: ["眼", "耳", "鼻", "口"] },
        { picture: "👂", jyutping: "ngo5 jung6 ___ teng1 je5", chinese: "我用___聽嘢。", answer: "耳仔", options: ["耳仔", "眼", "口", "鼻"] },
        { picture: "👃", jyutping: "ngo5 jung6 ___ man4 je5", chinese: "我用___聞嘢。", answer: "鼻", options: ["鼻", "眼", "口", "耳仔"] },
        { picture: "✋", jyutping: "ngo5 jung6 ___ se2 zi6", chinese: "我用___寫字。", answer: "手", options: ["手", "腳", "頭", "眼"] },
        { picture: "🦶", jyutping: "ngo5 jung6 ___ haang4 lou6", chinese: "我用___行路。", answer: "腳", options: ["腳", "手", "頭", "眼"] },
        { picture: "🏫", jyutping: "ngo5 heoi3 ___", chinese: "我去___。", answer: "學校", options: ["學校", "醫院", "超市", "公園"] },
        { picture: "🏥", jyutping: "ngo5 beng6 zo2, heoi3 ___", chinese: "我病咗,去___。", answer: "醫院", options: ["醫院", "學校", "超市", "餐廳"] },
        { picture: "🛒", jyutping: "ngo5 heoi3 ___ maai5 je5", chinese: "我去___買嘢。", answer: "超市", options: ["超市", "學校", "醫院", "公園"] },
        { picture: "🌳", jyutping: "ngo5 heoi3 ___ waan2", chinese: "我去___玩。", answer: "公園", options: ["公園", "學校", "醫院", "超市"] },
        { picture: "📚", jyutping: "ngo5 heoi3 ___ tai2 syu1", chinese: "我去___睇書。", answer: "圖書館", options: ["圖書館", "超市", "公園", "餐廳"] }
    ],

    // SECTION 7: Daily Activities & Hobbies (10 questions)
    [
        { picture: "🌅", jyutping: "zou2 san4 ___ san1", chinese: "朝早___身。", answer: "起", options: ["起", "瞓", "食", "行"] },
        { picture: "🪥", jyutping: "ngo5 ___ ngaa4", chinese: "我___牙。", answer: "刷", options: ["刷", "洗", "食", "睇"] },
        { picture: "🚿", jyutping: "ngo5 ___ loeng4", chinese: "我___涼。", answer: "沖", options: ["沖", "洗", "飲", "食"] },
        { picture: "🏫", jyutping: "ngo5 ___ hok6", chinese: "我___學。", answer: "返", options: ["返", "去", "行", "跑"] },
        { picture: "📝", jyutping: "ngo5 zou6 ___", chinese: "我做___。", answer: "功課", options: ["功課", "嘢食", "遊戲", "運動"] },
        { picture: "😴", jyutping: "ngo5 ___ gaau3", chinese: "我___覺。", answer: "瞓", options: ["瞓", "起", "食", "行"] },
        { picture: "🎮", jyutping: "ngo5 zung1 ji3 ___ gei1", chinese: "我鍾意___機。", answer: "打", options: ["打", "睇", "食", "飲"] },
        { picture: "📖", jyutping: "ngo5 zung1 ji3 ___ syu1", chinese: "我鍾意___書。", answer: "睇", options: ["睇", "食", "飲", "寫"] },
        { picture: "🎵", jyutping: "ngo5 zung1 ji3 ___ jam1 ngok6", chinese: "我鍾意___音樂。", answer: "聽", options: ["聽", "睇", "食", "打"] },
        { picture: "🎨", jyutping: "ngo5 zung1 ji3 ___ waa2", chinese: "我鍾意___畫。", answer: "畫", options: ["畫", "寫", "睇", "食"] }
    ],

    // SECTION 8: Holidays & Festivals (10 questions)
    [
        { picture: "🧧", jyutping: "___ faai3 lok6!", chinese: "新年___!", answer: "快樂", options: ["快樂", "好", "多謝", "再見"] },
        { picture: "🧧", jyutping: "gung1 hei2 ___!", chinese: "恭喜___!", answer: "發財", options: ["發財", "快樂", "新年", "你好"] },
        { picture: "🧧", jyutping: "ngo5 sau1 dou2 hou2 do1 ___", chinese: "我收到好多___。", answer: "利是", options: ["利是", "禮物", "蛋糕", "糖果"] },
        { picture: "🥮", jyutping: "___ zit3 sik6 jyut6 beng2", chinese: "___節食月餅。", answer: "中秋", options: ["中秋", "新年", "端午", "聖誕"] },
        { picture: "🐉", jyutping: "___ zit3 tai2 lung4 zau1 bei2 coi3", chinese: "___節睇龍舟比賽。", answer: "端午", options: ["端午", "中秋", "新年", "聖誕"] },
        { picture: "🎄", jyutping: "___ faai3 lok6!", chinese: "聖誕___!", answer: "快樂", options: ["快樂", "好", "多謝", "再見"] },
        { picture: "🎅", jyutping: "sing3 daan3 ___ wui5 sung3 lai5 mat6", chinese: "聖誕___會送禮物。", answer: "老人", options: ["老人", "樹", "節", "快樂"] },
        { picture: "🎃", jyutping: "___ zit3 zoek3 faa3 zong1", chinese: "___節著化妝。", answer: "萬聖", options: ["萬聖", "聖誕", "中秋", "新年"] },
        { picture: "🦃", jyutping: "___ zit3 sik6 fo2 gai1", chinese: "___節食火雞。", answer: "感恩", options: ["感恩", "聖誕", "萬聖", "新年"] },
        { picture: "🐰", jyutping: "___ zit3 wan2 daan2", chinese: "___節搵蛋。", answer: "復活", options: ["復活", "聖誕", "萬聖", "新年"] }
    ],

    // Section 9: Emotions & Family
    [
        { picture: "😊", jyutping: "hoi1 ___", chinese: "開___。", answer: "心", options: ["心", "口", "門", "始"] },
        { picture: "😢", jyutping: "m4 hoi1 ___", chinese: "唔開___。", answer: "心", options: ["心", "口", "門", "始"] },
        { picture: "😨", jyutping: "hou2 ___", chinese: "好___。", answer: "驚", options: ["驚", "怕", "嬲", "悶"] },
        { picture: "😠", jyutping: "hou2 ___", chinese: "好___。", answer: "嬲", options: ["嬲", "驚", "攰", "悶"] },
        { picture: "😫", jyutping: "hou2 ___", chinese: "好___。", answer: "攰", options: ["攰", "驚", "嬲", "悶"] },
        { picture: "😑", jyutping: "hou2 ___", chinese: "好___。", answer: "悶", options: ["悶", "驚", "嬲", "攰"] },
        { picture: "🤩", jyutping: "hing1 ___", chinese: "興___。", answer: "奮", options: ["奮", "趣", "致", "起"] },
        { picture: "😰", jyutping: "gan2 ___", chinese: "緊___。", answer: "張", options: ["張", "急", "要", "密"] },
        { picture: "👨", jyutping: "baa4 ___", chinese: "爸___。", answer: "爸", options: ["爸", "媽", "公", "婆"] },
        { picture: "👩", jyutping: "maa4 ___", chinese: "媽___。", answer: "媽", options: ["媽", "爸", "公", "婆"] },
        { picture: "👴", jyutping: "je4 ___", chinese: "爺___。", answer: "爺", options: ["爺", "嫲", "公", "婆"] },
        { picture: "👵", jyutping: "maa4 ___", chinese: "嫲___。", answer: "嫲", options: ["嫲", "爺", "公", "婆"] },
        { picture: "👦", jyutping: "go4 ___", chinese: "哥___。", answer: "哥", options: ["哥", "弟", "姐", "妹"] },
        { picture: "👧", jyutping: "ze4 ___", chinese: "姐___。", answer: "姐", options: ["姐", "妹", "哥", "弟"] },
        { picture: "👶", jyutping: "dai4 ___", chinese: "弟___。", answer: "弟", options: ["弟", "哥", "姐", "妹"] }
    ],

    // Section 10: Transport & Nature
    [
        { picture: "🚌", jyutping: "baa1 ___", chinese: "巴___。", answer: "士", options: ["士", "車", "站", "路"] },
        { picture: "🚕", jyutping: "dik1 ___", chinese: "的___。", answer: "士", options: ["士", "車", "站", "路"] },
        { picture: "🚂", jyutping: "fo2 ___", chinese: "火___。", answer: "車", options: ["車", "士", "站", "機"] },
        { picture: "✈️", jyutping: "fei1 ___", chinese: "飛___。", answer: "機", options: ["機", "車", "船", "站"] },
        { picture: "🚲", jyutping: "daan1 ___", chinese: "單___。", answer: "車", options: ["車", "機", "士", "船"] },
        { picture: "🚢", jyutping: "syun4", chinese: "___。", answer: "船", options: ["船", "車", "機", "站"] },
        { picture: "🚏", jyutping: "ce1 ___", chinese: "車___。", answer: "站", options: ["站", "路", "門", "頭"] },
        { picture: "🛫", jyutping: "gei1 ___", chinese: "機___。", answer: "場", options: ["場", "站", "頭", "尾"] },
        { picture: "🌸", jyutping: "faa1", chinese: "___。", answer: "花", options: ["花", "草", "樹", "葉"] },
        { picture: "🌳", jyutping: "syu6", chinese: "___。", answer: "樹", options: ["樹", "花", "草", "山"] },
        { picture: "🌿", jyutping: "cou2", chinese: "___。", answer: "草", options: ["草", "花", "樹", "葉"] },
        { picture: "⛰️", jyutping: "saan1", chinese: "___。", answer: "山", options: ["山", "海", "河", "石"] },
        { picture: "🌊", jyutping: "hoi2", chinese: "___。", answer: "海", options: ["海", "山", "河", "湖"] },
        { picture: "🏞️", jyutping: "ho4", chinese: "___。", answer: "河", options: ["河", "海", "山", "湖"] },
        { picture: "🪨", jyutping: "sek6 ___", chinese: "石___。", answer: "頭", options: ["頭", "尾", "塊", "粒"] }
    ]
];

// ==================== TEST 2 DATA (Connections & Sentences) ====================

const test2Sections = [
    // SECTION 1: Express Words (10 questions)
    [
        { picture: "💭", jyutping: "ngo5 ___ sik6 syut3 gou1", chinese: "我___食雪糕", answer: "想", options: ["想", "要", "愛", "可以"], english: "I want to eat ice cream" },
        { picture: "🤩", jyutping: "ngo5 ___ tung4 nei5 waan2", chinese: "我___同你玩", answer: "好想", options: ["好想", "想", "要", "鍾意"], english: "I really want to play with you" },
        { picture: "👉", jyutping: "ngo5 ___ jam2 seoi2", chinese: "我___飲水", answer: "要", options: ["要", "想", "愛", "好"], english: "I want to drink water" },
        { picture: "📋", jyutping: "ngo5 ___ jau1 sik1", chinese: "我___休息", answer: "需要", options: ["需要", "想", "要", "可以"], english: "I need to rest" },
        { picture: "❗", jyutping: "nei5 ___ sik6 je5", chinese: "你___食嘢", answer: "一定要", options: ["一定要", "想", "要", "可以"], english: "You must eat" },
        { picture: "❤️", jyutping: "ngo5 ___ nei5", chinese: "我___你", answer: "愛", options: ["愛", "想", "要", "好"], english: "I love you" },
        { picture: "💕", jyutping: "ngo5 ___ sik6 syut3 gou1", chinese: "我___食雪糕", answer: "鍾意", options: ["鍾意", "想", "愛", "要"], english: "I like eating ice cream" },
        { picture: "🙅", jyutping: "ngo5 ___ fan3 gaau3", chinese: "我___瞓覺", answer: "唔想", options: ["唔想", "想", "要", "愛"], english: "I don't want to sleep" },
        { picture: "✅", jyutping: "ngo5 ___ waan2 maa3", chinese: "我___玩嗎?", answer: "可以", options: ["可以", "想", "要", "愛"], english: "Can I play?" },
        { picture: "🚫", jyutping: "nei5 ___ sik6 tong4", chinese: "你___食糖", answer: "唔可以", options: ["唔可以", "可以", "唔想", "想"], english: "You cannot eat candy" }
    ],

    // SECTION 2: Questions (10 questions)
    [
        { picture: "❓", jyutping: "nei5 hou2 ___", chinese: "你好___?", answer: "嗎", options: ["嗎", "邊度", "點解", "幾時"], english: "How are you?" },
        { picture: "🕐", jyutping: "___ sik6 faan6", chinese: "___食飯?", answer: "幾時", options: ["幾時", "邊度", "點解", "邊個"], english: "When do we eat?" },
        { picture: "📍", jyutping: "ci3 so2 hai2 ___", chinese: "廁所喺___?", answer: "邊度", options: ["邊度", "幾時", "點解", "邊個"], english: "Where is the toilet?" },
        { picture: "👤", jyutping: "___ lai4 zo2", chinese: "___嚟咗?", answer: "邊個", options: ["邊個", "邊度", "幾時", "點解"], english: "Who came?" },
        { picture: "🤔", jyutping: "___ nei5 haam3", chinese: "___你喊?", answer: "點解", options: ["點解", "邊度", "幾時", "點樣"], english: "Why are you crying?" },
        { picture: "🛠️", jyutping: "___ zou6", chinese: "___做?", answer: "點樣", options: ["點樣", "點解", "邊度", "幾時"], english: "How to do it?" },
        { picture: "🔢", jyutping: "___ cin2", chinese: "___錢?", answer: "幾多", options: ["幾多", "幾時", "邊度", "點解"], english: "How much money?" },
        { picture: "❔", jyutping: "ni1 go3 hai6 ___", chinese: "呢個係___?", answer: "乜嘢", options: ["乜嘢", "邊個", "邊度", "幾時"], english: "What is this?" },
        { picture: "🎂", jyutping: "nei5 ___ seoi3", chinese: "你___歲?", answer: "幾多", options: ["幾多", "幾時", "邊度", "點解"], english: "How old are you?" },
        { picture: "🍽️", jyutping: "nei5 sik6 ___", chinese: "你食___?", answer: "乜嘢", options: ["乜嘢", "邊度", "幾時", "邊個"], english: "What are you eating?" }
    ],

    // SECTION 3: Linking Words (10 questions)
    [
        { picture: "➕", jyutping: "ngo5 ___ maa4 maa1 heoi3 gaai1", chinese: "我___媽媽去街", answer: "同埋", options: ["同埋", "或者", "因為", "所以"], english: "I go out with mom" },
        { picture: "↔️", jyutping: "nei5 jiu3 caa4 ___ seoi2", chinese: "你要茶___水?", answer: "或者", options: ["或者", "同埋", "因為", "所以"], english: "Do you want tea or water?" },
        { picture: "➕", jyutping: "ngo5 jiu3 syut3 gou1, ___ daan6 gou1", chinese: "我要雪糕,___蛋糕", answer: "仲有", options: ["仲有", "同埋", "或者", "所以"], english: "I want ice cream, and also cake" },
        { picture: "💡", jyutping: "___ ngo5 gui6", chinese: "___我攰", answer: "因為", options: ["因為", "所以", "但係", "如果"], english: "Because I'm tired" },
        { picture: "➡️", jyutping: "ngo5 tou5 ngo6, ___ ngo5 jiu3 sik6 je5", chinese: "我肚餓,___我要食嘢", answer: "所以", options: ["所以", "因為", "但係", "如果"], english: "I'm hungry, so I need to eat" },
        { picture: "🤔", jyutping: "___ lok6 jyu5, ngo5 dei6 lau4 hai2 uk1 kei2", chinese: "___落雨,我哋留喺屋企", answer: "如果", options: ["如果", "因為", "所以", "但係"], english: "If it rains, we stay home" },
        { picture: "↩️", jyutping: "ngo5 soeng2 heoi3, ___ ngo5 mou5 si4 gaan3", chinese: "我想去,___我冇時間", answer: "但係", options: ["但係", "所以", "因為", "如果"], english: "I want to go, but I don't have time" },
        { picture: "⏭️", jyutping: "sik6 faan6, ___ zou6 gung1 fo3", chinese: "食飯,___做功課", answer: "然後", options: ["然後", "所以", "因為", "但係"], english: "Eat, then do homework" },
        { picture: "💡", jyutping: "___ ngo5 zung1 ji3 nei5", chinese: "___我鍾意你", answer: "因為", options: ["因為", "所以", "但係", "如果"], english: "Because I like you" },
        { picture: "↩️", jyutping: "hou2 sik6, ___ hou2 gwai3", chinese: "好食,___好貴", answer: "但係", options: ["但係", "所以", "因為", "同埋"], english: "Delicious, but expensive" }
    ],

    // SECTION 4: Introduction (10 questions)
    [
        { picture: "❓", jyutping: "nei5 giu3 ___ meng2", chinese: "你叫___名?", answer: "咩", options: ["咩", "邊", "幾", "點"], english: "What's your name?" },
        { picture: "👤", jyutping: "ngo5 ___ siu2 ming4", chinese: "我___小明", answer: "叫", options: ["叫", "係", "住", "去"], english: "My name is Siu Ming" },
        { picture: "🎂", jyutping: "nei5 ___ seoi3", chinese: "你___歲?", answer: "幾", options: ["幾", "咩", "邊", "點"], english: "How old are you?" },
        { picture: "🏠", jyutping: "nei5 ___ hai2 bin1 dou6", chinese: "你___喺邊度?", answer: "住", options: ["住", "叫", "去", "食"], english: "Where do you live?" },
        { picture: "😊", jyutping: "nei5 hou2 ___", chinese: "你好___?", answer: "嗎", options: ["嗎", "咩", "邊", "點"], english: "How are you?" },
        { picture: "🤝", jyutping: "hou2 gou1 hing1 ___ sik1 nei5", chinese: "好高興___識你", answer: "認", options: ["認", "見", "叫", "住"], english: "Nice to meet you" },
        { picture: "❤️", jyutping: "nei5 ___ ji3 me1", chinese: "你___意咩?", answer: "鍾", options: ["鍾", "想", "要", "愛"], english: "What do you like?" },
        { picture: "👨‍👩‍👧‍👦", jyutping: "nei5 jau5 mou5 hing1 dai6 ___", chinese: "你有冇兄弟___?", answer: "姐妹", options: ["姐妹", "朋友", "同學", "老師"], english: "Do you have siblings?" },
        { picture: "👋", jyutping: "___ gin3", chinese: "___見", answer: "再", options: ["再", "你", "我", "佢"], english: "Goodbye" },
        { picture: "👍", jyutping: "ngo5 hou2 hou2, ___", chinese: "我好好,___", answer: "多謝", options: ["多謝", "唔該", "對唔住", "再見"], english: "I'm good, thank you" }
    ],

    // SECTION 5: At School (10 questions)
    [
        { picture: "👩‍🏫", jyutping: "zou2 san4 ___", chinese: "早晨___", answer: "老師", options: ["老師", "同學", "媽媽", "爸爸"], english: "Good morning, teacher" },
        { picture: "🚻", jyutping: "ngo5 ho2 ji5 heoi3 ___ maa3", chinese: "我可以去___嗎?", answer: "廁所", options: ["廁所", "學校", "公園", "屋企"], english: "May I go to the toilet?" },
        { picture: "🤔", jyutping: "ngo5 ___ ming4 baak6", chinese: "我___明白", answer: "唔", options: ["唔", "好", "都", "仲"], english: "I don't understand" },
        { picture: "🔁", jyutping: "ho2 ji5 ___ gong2 jat1 ci3 maa3", chinese: "可以___講一次嗎?", answer: "再", options: ["再", "唔", "好", "都"], english: "Can you say it again?" },
        { picture: "✅", jyutping: "ngo5 zou6 ___ gung1 fo3 laa3", chinese: "我做___功課喇", answer: "完", options: ["完", "緊", "咗", "過"], english: "I finished my homework" },
        { picture: "❓", jyutping: "ngo5 ___ sik1 zou6", chinese: "我___識做", answer: "唔", options: ["唔", "好", "都", "仲"], english: "I don't know how to do it" },
        { picture: "🤝", jyutping: "ngo5 dei6 ___ cai4 waan2", chinese: "我哋___齊玩", answer: "一", options: ["一", "同", "大", "好"], english: "Let's play together" },
        { picture: "⏰", jyutping: "deoi3 m4 zyu6, ngo5 ___ dou3", chinese: "對唔住,我___到", answer: "遲", options: ["遲", "早", "快", "慢"], english: "Sorry, I'm late" },
        { picture: "🏃", jyutping: "___ hok6 laa3", chinese: "___學喇", answer: "放", options: ["放", "返", "去", "嚟"], english: "School is over" },
        { picture: "👋", jyutping: "ting1 ___ gin3", chinese: "聽___見", answer: "日", options: ["日", "朝", "晚", "時"], english: "See you tomorrow" }
    ],

    // SECTION 6: At Restaurant (10 questions)
    [
        { picture: "👨‍👩‍👧‍👦", jyutping: "gei2 do1 ___", chinese: "幾多___?", answer: "位", options: ["位", "個", "碗", "杯"], english: "How many people?" },
        { picture: "📖", jyutping: "m4 goi1, tai2 haa5 caan1 ___", chinese: "唔該,睇吓餐___", answer: "牌", options: ["牌", "單", "紙", "書"], english: "Please, may I see the menu" },
        { picture: "👉", jyutping: "ngo5 jiu3 ___ go3", chinese: "我要___個", answer: "呢", options: ["呢", "嗰", "邊", "咩"], english: "I want this one" },
        { picture: "🍚", jyutping: "ngo5 jiu3 jat1 ___ faan6", chinese: "我要一___飯", answer: "碗", options: ["碗", "杯", "碟", "個"], english: "I want a bowl of rice" },
        { picture: "💧", jyutping: "ngo5 jiu3 jat1 ___ seoi2", chinese: "我要一___水", answer: "杯", options: ["杯", "碗", "碟", "個"], english: "I want a glass of water" },
        { picture: "😋", jyutping: "hou2 ___ hou2 sik6", chinese: "好___好食?", answer: "唔", options: ["唔", "都", "好", "幾"], english: "Is it delicious?" },
        { picture: "😊", jyutping: "ngo5 sik6 ___ laa3", chinese: "我食___喇", answer: "飽", options: ["飽", "完", "晒", "咗"], english: "I'm full" },
        { picture: "💰", jyutping: "m4 goi1, ___ daan1", chinese: "唔該,___單", answer: "埋", options: ["埋", "開", "俾", "攞"], english: "Please, the bill" },
        { picture: "💵", jyutping: "gei2 do1 ___", chinese: "幾多___?", answer: "錢", options: ["錢", "位", "個", "碗"], english: "How much?" },
        { picture: "📦", jyutping: "m4 goi1, daa2 ___", chinese: "唔該,打___", answer: "包", options: ["包", "開", "埋", "俾"], english: "Please, to go / takeaway" }
    ],

    // SECTION 7: Shopping (10 questions)
    [
        { picture: "💰", jyutping: "ni1 go3 gei2 do1 ___", chinese: "呢個幾多___?", answer: "錢", options: ["錢", "個", "位", "件"], english: "How much is this?" },
        { picture: "😱", jyutping: "taai3 ___ laa3", chinese: "太___喇", answer: "貴", options: ["貴", "平", "大", "細"], english: "Too expensive" },
        { picture: "🛍️", jyutping: "ngo5 jiu3 ___ ni1 go3", chinese: "我要___呢個", answer: "買", options: ["買", "賣", "睇", "攞"], english: "I want to buy this" },
        { picture: "🎨", jyutping: "jau5 mou5 kei4 taa1 ___", chinese: "有冇其他___?", answer: "顏色", options: ["顏色", "大細", "款式", "價錢"], english: "Do you have other colors?" },
        { picture: "👕", jyutping: "ho2 ji5 ___ haa5 maa3", chinese: "可以___吓嗎?", answer: "試", options: ["試", "睇", "買", "攞"], english: "Can I try it?" },
        { picture: "📏", jyutping: "jau5 mou5 ___ di1", chinese: "有冇___啲?", answer: "細", options: ["細", "大", "平", "貴"], english: "Do you have a smaller one?" },
        { picture: "👀", jyutping: "ngo5 zing6 hai6 ___ haa5", chinese: "我淨係___吓", answer: "睇", options: ["睇", "買", "試", "攞"], english: "I'm just looking" },
        { picture: "💳", jyutping: "ngo5 jiu3 ___ cin2", chinese: "我要___錢", answer: "俾", options: ["俾", "攞", "買", "賣"], english: "I want to pay" },
        { picture: "❤️", jyutping: "ngo5 ___ ji3 ni1 go3", chinese: "我___意呢個", answer: "鍾", options: ["鍾", "想", "要", "愛"], english: "I like this one" },
        { picture: "✨", jyutping: "hou2 ___ aa3", chinese: "好___呀", answer: "靚", options: ["靚", "大", "細", "貴"], english: "So beautiful" }
    ],

    // SECTION 8: At Home & Playground (10 questions)
    [
        { picture: "🏠", jyutping: "ngo5 ___ lai4 laa3", chinese: "我___嚟喇", answer: "返", options: ["返", "去", "嚟", "走"], english: "I'm home" },
        { picture: "🍽️", jyutping: "ngo5 tou5 ___", chinese: "我肚___", answer: "餓", options: ["餓", "飽", "痛", "凍"], english: "I'm hungry" },
        { picture: "😴", jyutping: "ngo5 hou2 ___", chinese: "我好___", answer: "攰", options: ["攰", "肚餓", "開心", "凍"], english: "I'm very tired" },
        { picture: "📺", jyutping: "ngo5 ho2 ji5 tai2 ___ maa3", chinese: "我可以睇___嗎?", answer: "電視", options: ["電視", "電話", "電腦", "書"], english: "Can I watch TV?" },
        { picture: "🍚", jyutping: "sik6 ___ laa3", chinese: "食___喇", answer: "飯", options: ["飯", "菜", "糖", "水"], english: "Time to eat" },
        { picture: "🧼", jyutping: "sai2 ___ sin1", chinese: "洗___先", answer: "手", options: ["手", "面", "腳", "頭"], english: "Wash hands first" },
        { picture: "🌙", jyutping: "___ on1", chinese: "___安", answer: "晚", options: ["晚", "早", "午", "夜"], english: "Good night" },
        { picture: "🎮", jyutping: "ngo5 dei6 heoi3 ___", chinese: "我哋去___", answer: "玩", options: ["玩", "食", "瞓", "返"], english: "Let's go play" },
        { picture: "👆", jyutping: "___ dou3 ngo5 laa3", chinese: "___到我喇", answer: "輪", options: ["輪", "到", "係", "俾"], english: "It's my turn" },
        { picture: "⚠️", jyutping: "siu2 ___ di1", chinese: "小___啲", answer: "心", options: ["心", "手", "腳", "頭"], english: "Be careful" }
    ],

    // Section 9: Story Sentences
    [
        { picture: "🐴🌊", jyutping: "jiu3 zi6 gei2 ___ haa5", chinese: "要自己___吓", answer: "試", options: ["試", "做", "行", "跑"], english: "Must try yourself" },
        { picture: "🐢💪", jyutping: "gin1 ci4 dou3 ___ zau6 sing4 gung1", chinese: "堅持到___就成功", answer: "底", options: ["底", "頂", "尾", "頭"], english: "Persevere to succeed" },
        { picture: "🐷🧱", jyutping: "zou6 je5 jiu3 jing6 ___", chinese: "做嘢要認___", answer: "真", options: ["真", "識", "得", "到"], english: "Work must be serious" },
        { picture: "🐺📢", jyutping: "gong2 daai6 ___ mou5 jan4 seon3", chinese: "講大___冇人信", answer: "話", options: ["話", "聲", "字", "嘢"], english: "Liars aren't believed" },
        { picture: "🥕👪", jyutping: "tyun4 ___ zau6 hai6 lik6 loeng6", chinese: "團___就係力量", answer: "結", options: ["結", "體", "隊", "合"], english: "Unity is strength" },
        { picture: "🧒🐺", jyutping: "m4 hou2 tung4 mak6 saang1 jan4 king1 ___", chinese: "唔好同陌生人傾___", answer: "偈", options: ["偈", "話", "嘢", "聲"], english: "Don't talk to strangers" },
        { picture: "🦢✨", jyutping: "mui5 go3 jan4 dou1 jau5 gaa3 ___", chinese: "每個人都有價___", answer: "值", options: ["值", "錢", "格", "位"], english: "Everyone has value" },
        { picture: "⛰️💪", jyutping: "jau5 hang4 ___ zou6 me1 dou1 dak1", chinese: "有恆___做咩都得", answer: "心", options: ["心", "意", "志", "力"], english: "With perseverance, anything is possible" },
        { picture: "🍐👦", jyutping: "jiu3 him1 joeng6 zyun1 zung6 zoeng2 ___", chinese: "要謙讓尊重長___", answer: "輩", options: ["輩", "大", "老", "者"], english: "Be humble and respect elders" },
        { picture: "🏺💡", jyutping: "jyu6 dou2 man6 tai4 jiu3 laang5 ___", chinese: "遇到問題要冷___", answer: "靜", options: ["靜", "定", "淡", "氣"], english: "Stay calm when facing problems" },
        { picture: "🐰🪵", jyutping: "m4 hou2 kaau3 wan6 ___", chinese: "唔好靠運___", answer: "氣", options: ["氣", "動", "數", "勢"], english: "Don't rely on luck" },
        { picture: "🐸🌊", jyutping: "jiu3 hoi1 fut3 ngaan5 ___", chinese: "要開闊眼___", answer: "界", options: ["界", "光", "見", "睛"], english: "Broaden your horizons" }
    ]
];

// ==================== LEVELED TEST DATA ====================

const leveledTestData = {
    beginning: {
        1: { // Beginning Level 1 - Basic Greetings & Self-Introduction
            title: "Beginning 1: Greetings & Introduction 🌱",
            questions: [
                { picture: "👋", jyutping: "nei5 hou2", chinese: "你好", english: "Hello", answer: "Hello", options: ["Hello", "Goodbye", "Thank you", "Sorry"] },
                { picture: "🙏", jyutping: "do1 ze6", chinese: "多謝", english: "Thank you", answer: "Thank you", options: ["Thank you", "Sorry", "Hello", "Goodbye"] },
                { picture: "👋", jyutping: "zoi3 gin3", chinese: "再見", english: "Goodbye", answer: "Goodbye", options: ["Goodbye", "Hello", "Sorry", "Please"] },
                { picture: "🙇", jyutping: "deoi3 m4 zyu6", chinese: "對唔住", english: "Sorry", answer: "Sorry", options: ["Sorry", "Thank you", "Hello", "Please"] },
                { picture: "🙏", jyutping: "m4 goi1", chinese: "唔該", english: "Please / Excuse me", answer: "Please / Excuse me", options: ["Please / Excuse me", "Thank you", "Sorry", "Hello"] },
                { picture: "👤", jyutping: "ngo5 giu3...", chinese: "我叫...", english: "My name is...", answer: "My name is...", options: ["My name is...", "I am...", "You are...", "He is..."] },
                { picture: "❓", jyutping: "nei5 giu3 me1 meng2", chinese: "你叫咩名?", english: "What's your name?", answer: "What's your name?", options: ["What's your name?", "How old are you?", "Where are you from?", "How are you?"] },
                { picture: "🎂", jyutping: "nei5 gei2 seoi3", chinese: "你幾歲?", english: "How old are you?", answer: "How old are you?", options: ["How old are you?", "What's your name?", "Where are you?", "How are you?"] },
                { picture: "😊", jyutping: "nei5 hou2 maa3", chinese: "你好嗎?", english: "How are you?", answer: "How are you?", options: ["How are you?", "What's your name?", "Where are you?", "How old are you?"] },
                { picture: "👍", jyutping: "ngo5 hou2 hou2", chinese: "我好好", english: "I'm very good", answer: "I'm very good", options: ["I'm very good", "I'm not good", "I'm hungry", "I'm tired"] }
            ]
        },
        2: { // Beginning Level 2 - Numbers & Colors
            title: "Beginning 2: Numbers & Colors 🔢🎨",
            questions: [
                { picture: "🔢", jyutping: "jat1", chinese: "一", english: "One", answer: "一", options: ["一", "二", "三", "四"] },
                { picture: "🔢", jyutping: "ng5", chinese: "五", english: "Five", answer: "五", options: ["五", "六", "七", "八"] },
                { picture: "🔢", jyutping: "sap6", chinese: "十", english: "Ten", answer: "十", options: ["十", "九", "八", "七"] },
                { picture: "❤️", jyutping: "hung4 sik1", chinese: "紅色", english: "Red", answer: "紅色", options: ["紅色", "藍色", "綠色", "黃色"] },
                { picture: "💙", jyutping: "laam4 sik1", chinese: "藍色", english: "Blue", answer: "藍色", options: ["藍色", "紅色", "綠色", "白色"] },
                { picture: "💛", jyutping: "wong4 sik1", chinese: "黃色", english: "Yellow", answer: "黃色", options: ["黃色", "橙色", "紫色", "粉紅色"] },
                { picture: "💚", jyutping: "luk6 sik1", chinese: "綠色", english: "Green", answer: "綠色", options: ["綠色", "藍色", "黃色", "黑色"] },
                { picture: "⬛", jyutping: "hak1 sik1", chinese: "黑色", english: "Black", answer: "黑色", options: ["黑色", "白色", "灰色", "紅色"] },
                { picture: "⬜", jyutping: "baak6 sik1", chinese: "白色", english: "White", answer: "白色", options: ["白色", "黑色", "灰色", "藍色"] },
                { picture: "🔢", jyutping: "gei2 do1", chinese: "幾多?", english: "How many?", answer: "幾多?", options: ["幾多?", "幾時?", "邊度?", "邊個?"] }
            ]
        },
        3: { // Beginning Level 3 - Food, Drinks & Family
            title: "Beginning 3: Food, Drinks & Family 🍽️👨‍👩‍👧‍👦",
            questions: [
                { picture: "🍚", jyutping: "sik6 faan6", chinese: "食飯", english: "Eat rice/meal", answer: "食飯", options: ["食飯", "飲水", "瞓覺", "返學"] },
                { picture: "💧", jyutping: "jam2 seoi2", chinese: "飲水", english: "Drink water", answer: "飲水", options: ["飲水", "食飯", "飲茶", "食菜"] },
                { picture: "🍵", jyutping: "jam2 caa4", chinese: "飲茶", english: "Drink tea / Dim sum", answer: "飲茶", options: ["飲茶", "飲水", "食飯", "飲奶"] },
                { picture: "👨", jyutping: "baa4 baa1", chinese: "爸爸", english: "Dad", answer: "爸爸", options: ["爸爸", "媽媽", "哥哥", "弟弟"] },
                { picture: "👩", jyutping: "maa4 maa1", chinese: "媽媽", english: "Mom", answer: "媽媽", options: ["媽媽", "爸爸", "姐姐", "妹妹"] },
                { picture: "👦", jyutping: "go1 go1", chinese: "哥哥", english: "Older brother", answer: "哥哥", options: ["哥哥", "弟弟", "爸爸", "公公"] },
                { picture: "👧", jyutping: "ze4 ze2", chinese: "姐姐", english: "Older sister", answer: "姐姐", options: ["姐姐", "妹妹", "媽媽", "婆婆"] },
                { picture: "👴", jyutping: "gung1 gung1", chinese: "公公", english: "Grandpa (maternal)", answer: "公公", options: ["公公", "婆婆", "爺爺", "嫲嫲"] },
                { picture: "👵", jyutping: "po4 po2", chinese: "婆婆", english: "Grandma (maternal)", answer: "婆婆", options: ["婆婆", "公公", "嫲嫲", "爺爺"] },
                { picture: "🏠", jyutping: "uk1 kei2", chinese: "屋企", english: "Home", answer: "屋企", options: ["屋企", "學校", "公園", "餐廳"] }
            ]
        }
    },
    intermediate: {
        1: { // Intermediate Level 1 - Express Words & Basic Sentences
            title: "Intermediate 1: Express Words 💭",
            questions: [
                { picture: "💭", jyutping: "ngo5 soeng2...", chinese: "我想...", english: "I want to...", answer: "想", options: ["想", "要", "愛", "可以"] },
                { picture: "👉", jyutping: "ngo5 jiu3...", chinese: "我要...", english: "I need...", answer: "要", options: ["要", "想", "愛", "可以"] },
                { picture: "✅", jyutping: "ngo5 ho2 ji5...", chinese: "我可以...", english: "I can...", answer: "可以", options: ["可以", "想", "要", "鍾意"] },
                { picture: "❤️", jyutping: "ngo5 oi3...", chinese: "我愛...", english: "I love...", answer: "愛", options: ["愛", "想", "要", "鍾意"] },
                { picture: "💕", jyutping: "ngo5 zung1 ji3...", chinese: "我鍾意...", english: "I like...", answer: "鍾意", options: ["鍾意", "愛", "想", "要"] },
                { picture: "🙅", jyutping: "ngo5 m4 soeng2...", chinese: "我唔想...", english: "I don't want to...", answer: "唔想", options: ["唔想", "想", "唔要", "唔可以"] },
                { picture: "🚫", jyutping: "m4 ho2 ji5", chinese: "唔可以", english: "Cannot", answer: "唔可以", options: ["唔可以", "可以", "唔想", "唔要"] },
                { picture: "📋", jyutping: "ngo5 seoi1 jiu3...", chinese: "我需要...", english: "I need...", answer: "需要", options: ["需要", "想", "要", "可以"] },
                { picture: "🤩", jyutping: "ngo5 hou2 soeng2...", chinese: "我好想...", english: "I really want to...", answer: "好想", options: ["好想", "想", "要", "鍾意"] },
                { picture: "❗", jyutping: "jat1 ding6 jiu3", chinese: "一定要", english: "Must", answer: "一定要", options: ["一定要", "需要", "想", "可以"] }
            ]
        },
        2: { // Intermediate Level 2 - Questions & Sentence Structures
            title: "Intermediate 2: Questions & Structures ❓",
            questions: [
                { picture: "❓", jyutping: "...maa3", chinese: "...嗎?", english: "Question particle", answer: "嗎", options: ["嗎", "呢", "啊", "喇"] },
                { picture: "📍", jyutping: "bin1 dou6", chinese: "邊度?", english: "Where?", answer: "邊度", options: ["邊度", "幾時", "點解", "邊個"] },
                { picture: "🕐", jyutping: "gei2 si4", chinese: "幾時?", english: "When?", answer: "幾時", options: ["幾時", "邊度", "點解", "幾多"] },
                { picture: "👤", jyutping: "bin1 go3", chinese: "邊個?", english: "Who?", answer: "邊個", options: ["邊個", "邊度", "幾時", "乜嘢"] },
                { picture: "🤔", jyutping: "dim2 gaai2", chinese: "點解?", english: "Why?", answer: "點解", options: ["點解", "點樣", "邊度", "幾時"] },
                { picture: "🛠️", jyutping: "dim2 joeng2", chinese: "點樣?", english: "How?", answer: "點樣", options: ["點樣", "點解", "邊度", "乜嘢"] },
                { picture: "❔", jyutping: "mat1 je5", chinese: "乜嘢?", english: "What?", answer: "乜嘢", options: ["乜嘢", "邊個", "邊度", "幾時"] },
                { picture: "🔢", jyutping: "gei2 do1", chinese: "幾多?", english: "How many/much?", answer: "幾多", options: ["幾多", "幾時", "邊度", "點解"] },
                { picture: "🏫", jyutping: "heoi3 hok6 haau6", chinese: "去學校", english: "Go to school", answer: "去", options: ["去", "嚟", "返", "走"] },
                { picture: "🏠", jyutping: "faan1 uk1 kei2", chinese: "返屋企", english: "Go home", answer: "返", options: ["返", "去", "嚟", "走"] }
            ]
        },
        3: { // Intermediate Level 3 - Linking Words & Complex Sentences
            title: "Intermediate 3: Linking Words 🔗",
            questions: [
                { picture: "➕", jyutping: "tung4 maai4", chinese: "同埋", english: "And / Together with", answer: "同埋", options: ["同埋", "或者", "因為", "所以"] },
                { picture: "↔️", jyutping: "waak6 ze2", chinese: "或者", english: "Or", answer: "或者", options: ["或者", "同埋", "仲有", "但係"] },
                { picture: "➕", jyutping: "zung6 jau5", chinese: "仲有", english: "Also / And also", answer: "仲有", options: ["仲有", "同埋", "或者", "所以"] },
                { picture: "💡", jyutping: "jan1 wai6", chinese: "因為", english: "Because", answer: "因為", options: ["因為", "所以", "但係", "如果"] },
                { picture: "➡️", jyutping: "so2 ji5", chinese: "所以", english: "So / Therefore", answer: "所以", options: ["所以", "因為", "但係", "如果"] },
                { picture: "🤔", jyutping: "jyu4 gwo2", chinese: "如果", english: "If", answer: "如果", options: ["如果", "因為", "所以", "但係"] },
                { picture: "↩️", jyutping: "daan6 hai6", chinese: "但係", english: "But", answer: "但係", options: ["但係", "所以", "因為", "如果"] },
                { picture: "⏭️", jyutping: "jin4 hau6", chinese: "然後", english: "Then / After that", answer: "然後", options: ["然後", "所以", "因為", "但係"] },
                { picture: "🔄", jyutping: "jan1 wai6...so2 ji5", chinese: "因為...所以", english: "Because...so", answer: "因為...所以", options: ["因為...所以", "如果...就", "雖然...但係", "同埋...仲有"] },
                { picture: "❓", jyutping: "jyu4 gwo2...zau6", chinese: "如果...就", english: "If...then", answer: "如果...就", options: ["如果...就", "因為...所以", "雖然...但係", "同埋...仲有"] }
            ]
        }
    },
    advanced: {
        1: { // Advanced Level 1 - School & Restaurant Scenarios
            title: "Advanced 1: School & Restaurant 🏫🍽️",
            questions: [
                { picture: "👩‍🏫", jyutping: "zou2 san4 lou5 si1", chinese: "早晨老師", english: "Good morning, teacher", answer: "老師", options: ["老師", "同學", "媽媽", "朋友"] },
                { picture: "🚻", jyutping: "ngo5 ho2 ji5 heoi3 ci3 so2 maa3", chinese: "我可以去廁所嗎?", english: "May I go to the toilet?", answer: "廁所", options: ["廁所", "學校", "公園", "屋企"] },
                { picture: "🔁", jyutping: "ho2 ji5 zoi3 gong2 jat1 ci3 maa3", chinese: "可以再講一次嗎?", english: "Can you say it again?", answer: "再", options: ["再", "唔", "好", "都"] },
                { picture: "✅", jyutping: "ngo5 zou6 jyun4 gung1 fo3 laa3", chinese: "我做完功課喇", english: "I finished my homework", answer: "完", options: ["完", "緊", "咗", "過"] },
                { picture: "👨‍👩‍👧‍👦", jyutping: "gei2 do1 wai2", chinese: "幾多位?", english: "How many people?", answer: "位", options: ["位", "個", "碗", "杯"] },
                { picture: "📖", jyutping: "caan1 paai2", chinese: "餐牌", english: "Menu", answer: "餐牌", options: ["餐牌", "餐單", "菜單", "價單"] },
                { picture: "🍚", jyutping: "jat1 wun2 faan6", chinese: "一碗飯", english: "One bowl of rice", answer: "碗", options: ["碗", "杯", "碟", "個"] },
                { picture: "💰", jyutping: "maai4 daan1", chinese: "埋單", english: "The bill please", answer: "埋單", options: ["埋單", "開單", "俾錢", "找錢"] },
                { picture: "📦", jyutping: "daa2 baau1", chinese: "打包", english: "To go / Takeaway", answer: "打包", options: ["打包", "外賣", "帶走", "包裝"] },
                { picture: "😊", jyutping: "sik6 baau2 laa3", chinese: "食飽喇", english: "I'm full", answer: "飽", options: ["飽", "完", "晒", "咗"] }
            ]
        },
        2: { // Advanced Level 2 - Shopping & Daily Life
            title: "Advanced 2: Shopping & Daily Life 🛒🏠",
            questions: [
                { picture: "💰", jyutping: "ni1 go3 gei2 do1 cin2", chinese: "呢個幾多錢?", english: "How much is this?", answer: "幾多錢", options: ["幾多錢", "幾時", "邊度", "點解"] },
                { picture: "😱", jyutping: "taai3 gwai3 laa3", chinese: "太貴喇", english: "Too expensive", answer: "太貴", options: ["太貴", "太平", "太大", "太細"] },
                { picture: "🛍️", jyutping: "ngo5 jiu3 maai5 ni1 go3", chinese: "我要買呢個", english: "I want to buy this", answer: "買", options: ["買", "賣", "睇", "攞"] },
                { picture: "🏠", jyutping: "ngo5 faan1 lai4 laa3", chinese: "我返嚟喇", english: "I'm home", answer: "返嚟", options: ["返嚟", "去咗", "出去", "入嚟"] },
                { picture: "🍽️", jyutping: "ngo5 tou5 ngo6", chinese: "我肚餓", english: "I'm hungry", answer: "肚餓", options: ["肚餓", "肚飽", "口渴", "攰"] },
                { picture: "😴", jyutping: "ngo5 hou2 gui6", chinese: "我好攰", english: "I'm very tired", answer: "好攰", options: ["好攰", "好凍", "好熱", "好肚餓"] },
                { picture: "📺", jyutping: "ngo5 ho2 ji5 tai2 din6 si6 maa3", chinese: "我可以睇電視嗎?", english: "Can I watch TV?", answer: "睇電視", options: ["睇電視", "睇書", "打機", "瞓覺"] },
                { picture: "🧼", jyutping: "sai2 sau2 sin1", chinese: "洗手先", english: "Wash hands first", answer: "洗手", options: ["洗手", "洗面", "洗腳", "沖涼"] },
                { picture: "🌙", jyutping: "maan5 on1", chinese: "晚安", english: "Good night", answer: "晚安", options: ["晚安", "早晨", "你好", "再見"] },
                { picture: "❤️", jyutping: "ngo5 oi3 nei5", chinese: "我愛你", english: "I love you", answer: "愛", options: ["愛", "鍾意", "想", "要"] }
            ]
        },
        3: { // Advanced Level 3 - Story Comprehension
            title: "Advanced 3: Story Morals 📖",
            questions: [
                { picture: "🐴🌊", jyutping: "jiu3 zi6 gei2 si3 haa5", chinese: "要自己試吓", english: "Must try yourself", answer: "試", options: ["試", "做", "行", "跑"] },
                { picture: "🐢💪", jyutping: "gin1 ci4 dou3 dai2 zau6 sing4 gung1", chinese: "堅持到底就成功", english: "Persevere to succeed", answer: "堅持", options: ["堅持", "放棄", "停止", "等待"] },
                { picture: "🐷🧱", jyutping: "zou6 je5 jiu3 jing6 zan1", chinese: "做嘢要認真", english: "Work must be serious", answer: "認真", options: ["認真", "馬虎", "快速", "簡單"] },
                { picture: "🐺📢", jyutping: "gong2 daai6 waa6 mou5 jan4 seon3", chinese: "講大話冇人信", english: "Liars aren't believed", answer: "大話", options: ["大話", "真話", "好話", "笑話"] },
                { picture: "🥕👪", jyutping: "tyun4 git3 zau6 hai6 lik6 loeng6", chinese: "團結就係力量", english: "Unity is strength", answer: "團結", options: ["團結", "分離", "獨立", "競爭"] },
                { picture: "🧒🐺", jyutping: "m4 hou2 tung4 mak6 saang1 jan4 king1 gai2", chinese: "唔好同陌生人傾偈", english: "Don't talk to strangers", answer: "陌生人", options: ["陌生人", "朋友", "家人", "老師"] },
                { picture: "🦢✨", jyutping: "mui5 go3 jan4 dou1 jau5 gaa3 zik6", chinese: "每個人都有價值", english: "Everyone has value", answer: "價值", options: ["價值", "錢財", "地位", "能力"] },
                { picture: "⛰️💪", jyutping: "jau5 hang4 sam1 zou6 me1 dou1 dak1", chinese: "有恆心做咩都得", english: "With perseverance, anything is possible", answer: "恆心", options: ["恆心", "運氣", "聰明", "力量"] },
                { picture: "🍐👦", jyutping: "jiu3 him1 joeng6 zyun1 zung6 zoeng2 bui3", chinese: "要謙讓尊重長輩", english: "Be humble and respect elders", answer: "謙讓", options: ["謙讓", "爭奪", "搶奪", "搶先"] },
                { picture: "🏺💡", jyutping: "jyu6 dou2 man6 tai4 jiu3 laang5 zing6", chinese: "遇到問題要冷靜", english: "Stay calm when facing problems", answer: "冷靜", options: ["冷靜", "驚慌", "緊張", "生氣"] }
            ]
        }
    }
};

// ==================== TEST SECTION TITLES ====================

const testSectionTitles = [
    "📝 Section 1: Manners & Greetings",
    "📝 Section 2: Numbers & Colors",
    "📝 Section 3: Animals",
    "📝 Section 4: Foods & Drinks",
    "📝 Section 5: Weather & Clothing",
    "📝 Section 6: Body Parts & Places",
    "📝 Section 7: Daily Activities & Hobbies",
    "📝 Section 8: Holidays & Festivals",
    "📝 Section 9: Emotions & Family",
    "📝 Section 10: Transport & Nature"
];

const test2SectionTitles = [
    "Express Words 💭",
    "Questions ❓",
    "Linking Words 🔗",
    "Introduction 👋",
    "At School 🏫",
    "At Restaurant 🍽️",
    "Shopping 🛒",
    "At Home & Playground 🏠🎡",
    "Story Sentences 📖"
];

// ==================== EXPORTS ====================

// Export for use in other modules
if (typeof window !== 'undefined') {
    window.testSections = testSections;
    window.test2Sections = test2Sections;
    window.leveledTestData = leveledTestData;
    window.testSectionTitles = testSectionTitles;
    window.test2SectionTitles = test2SectionTitles;

    // Alias for backward compatibility
    window.beginnerTestData = leveledTestData.beginning;
    window.intermediateTestData = leveledTestData.intermediate;
    window.advancedTestData = leveledTestData.advanced;
}
