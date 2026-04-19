/**
 * 游戏配置常量
 */

/** 游戏配置 */
export const GameConfig = {
    // ==================== 战斗配置 ====================
    
    /** 初始生命值 */
    INITIAL_HP: 20,
    
    /** 初始水晶上限 */
    INITIAL_MAX_MANA: 3,
    
    /** 每回合增加的水晶上限 */
    MANA_INCREMENT_PER_TURN: 1,
    
    /** 最大水晶上限 */
    MAX_MANA: 10,
    
    /** 能量上限 */
    MAX_ENERGY: 10,
    
    /** 未使用水晶转化为能量的比例 */
    MANA_TO_ENERGY_RATIO: 0.5,
    
    // ==================== 套牌配置 ====================
    
    /** 套牌最小卡牌数 */
    DECK_MIN_SIZE: 12,
    
    /** 套牌最大卡牌数 */
    DECK_MAX_SIZE: 16,
    
    /** 推荐套牌卡牌数 */
    DECK_RECOMMENDED_SIZE: 12,
    
    /** 最高水晶费用 */
    MAX_CARD_COST: 9,
    
    /** 低费卡牌（1-3费）最少数量 */
    MIN_LOW_COST_CARDS: 4,
    
    /** 套牌最大元素种类数 */
    MAX_ELEMENTS_IN_DECK: 2,
    
    // ==================== 手牌配置 ====================
    
    /** 最大手牌数 */
    MAX_HAND_SIZE: 10,
    
    /** 初始手牌数 */
    INITIAL_HAND_SIZE: 3,
    
    /** 每回合抽牌数 */
    CARDS_DRAW_PER_TURN: 1,
    
    // ==================== 战场配置 ====================
    
    /** 我方战场位置数 */
    PLAYER_FIELD_SIZE: 6,
    
    /** 前线位置索引（0-2） */
    FRONT_LINE_START: 0,
    FRONT_LINE_END: 2,
    
    /** 后线位置索引（3-5） */
    BACK_LINE_START: 3,
    BACK_LINE_END: 5,
    
    // ==================== 先手配置 ====================
    
    /** 先手方初始水晶 */
    FIRST_PLAYER_INITIAL_MANA: 1,
    
    /** 后手方初始水晶 */
    SECOND_PLAYER_INITIAL_MANA: 2,
    
    /** 后手方初始能量 */
    SECOND_PLAYER_INITIAL_ENERGY: 3,
    
    // ==================== 养成配置 ====================
    
    /** 每级属性提升百分比 */
    LEVEL_UP_BONUS_PERCENT: 0.05,
    
    /** 每次突破提升百分比 */
    BREAKTHROUGH_BONUS_PERCENT: 0.1,
    
    /** 最大突破次数 */
    MAX_BREAKTHROUGH: 5,
    
    /** 强化费用公式：baseCost * level */
    ENHANCE_BASE_COST: 10,
    
    // ==================== AI配置 ====================
    
    /** AI难度：入门 */
    AI_DIFFICULTY_BEGINNER: 0,
    
    /** AI难度：简单 */
    AI_DIFFICULTY_EASY: 1,
    
    /** AI难度：普通 */
    AI_DIFFICULTY_NORMAL: 2,
    
    /** AI难度：困难 */
    AI_DIFFICULTY_HARD: 3,
    
    /** AI难度：大师 */
    AI_DIFFICULTY_MASTER: 4,
    
    /** AI思考延迟基础时间（毫秒） */
    AI_THINK_DELAY_BASE: 500,
    
    /** AI思考延迟最大时间（毫秒） */
    AI_THINK_DELAY_MAX: 1500,
    
    // ==================== 天梯配置 ====================
    
    /** 胜利积分 */
    LEAGUE_WIN_POINTS: 30,
    
    /** 连胜额外积分 */
    LEAGUE_WIN_STREAK_BONUS: 5,
    
    /** 失败扣除积分 */
    LEAGUE_LOSE_POINTS: 15,
    
    /** 连败减免扣除 */
    LEAGUE_LOSE_STREAK_REDUCTION: 5,
    
    /** 每段位积分上限 */
    LEAGUE_POINTS_PER_RANK: 100,
    
    /** 晋级赛胜利场次 */
    PROMOTION_SERIES_WINS_NEEDED: 2,
    
    /** 保级赛失败场次 */
    DEMOTION_SERIES_LOSSES_ALLOWED: 1,
    
    // ==================== 冒险模式配置 ====================
    
    /** 冒险模式章节数 */
    ADVENTURE_CHAPTER_COUNT: 3,
    
    /** 每章节关卡数 */
    LEVELS_PER_CHAPTER: 10,
    
    /** 精英难度属性倍率 */
    ELITE_DIFFICULTY_MULTIPLIER: 1.5,
    
    // ==================== 掉落配置 ====================
    
    /** 普通卡牌掉落概率 */
    DROP_RATE_NORMAL: 0.50,
    
    /** 稀有卡牌掉落概率 */
    DROP_RATE_RARE: 0.30,
    
    /** 史诗卡牌掉落概率 */
    DROP_RATE_EPIC: 0.15,
    
    /** 传说卡牌掉落概率 */
    DROP_RATE_LEGEND: 0.05,
    
    /** 10连抽保底稀有 */
    DRAW_GUARANTEE_RARE: 10,
    
    /** 50连抽保底史诗 */
    DRAW_GUARANTEE_EPIC: 50,
    
    // ==================== 动画配置 ====================
    
    /** 卡牌出场动画时长（秒） */
    CARD_ENTRANCE_DURATION: 0.3,
    
    /** 卡牌攻击动画时长（秒） */
    CARD_ATTACK_DURATION: 0.2,
    
    /** 卡牌受击动画时长（秒） */
    CARD_DAMAGE_DURATION: 0.2,
    
    /** 卡牌死亡动画时长（秒） */
    CARD_DEATH_DURATION: 0.5,
    
    /** 水晶充能动画时长（秒） */
    MANA_CHARGE_DURATION: 0.3,
    
    /** 回合切换动画时长（秒） */
    TURN_TRANSITION_DURATION: 0.3,
    
    // ==================== 界面配置 ====================
    
    /** 手牌最大显示数量 */
    HAND_DISPLAY_MAX: 10,
    
    /** 手牌重叠比例 */
    HAND_OVERLAP_RATIO: 0.6,
    
    /** 战场格子大小 */
    FIELD_CELL_SIZE: 80,
    
    // ==================== 存储配置 ====================
    
    /** 存档键名 */
    SAVE_KEY: 'CUTE_CARD_BATTLE_SAVE',
    
    /** 存档版本 */
    SAVE_VERSION: 1,
};

/** 难度名称映射 */
export const DIFFICULTY_NAMES: Record<number, string> = {
    [GameConfig.AI_DIFFICULTY_BEGINNER]: '入门',
    [GameConfig.AI_DIFFICULTY_EASY]: '简单',
    [GameConfig.AI_DIFFICULTY_NORMAL]: '普通',
    [GameConfig.AI_DIFFICULTY_HARD]: '困难',
    [GameConfig.AI_DIFFICULTY_MASTER]: '大师',
};

/** 难度颜色映射 */
export const DIFFICULTY_COLORS: Record<number, string> = {
    [GameConfig.AI_DIFFICULTY_BEGINNER]: '#808080',
    [GameConfig.AI_DIFFICULTY_EASY]: '#4CAF50',
    [GameConfig.AI_DIFFICULTY_NORMAL]: '#2196F3',
    [GameConfig.AI_DIFFICULTY_HARD]: '#FF9800',
    [GameConfig.AI_DIFFICULTY_MASTER]: '#F44336',
};
