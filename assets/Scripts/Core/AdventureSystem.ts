/**
 * 冒险模式系统 - 管理PVE关卡和奖励
 */

import { CardData } from '../Core/CardData';
import { ElementType } from '../Core/Types';
import { GameConfig } from '../Config/GameConfig';
import { SaveManager, AdventureProgress, ChapterProgress } from '../Data/SaveManager';
import { CARD_CONFIGS, CardConfig } from '../Data/CardConfigs';

/** 关卡难度 */
export enum LevelDifficulty {
    Normal = 'normal',
    Elite = 'elite'
}

/** 关卡配置 */
export interface LevelConfig {
    levelId: number;
    name: string;
    enemyDeck: string[];  // 敌方套牌配置
    firstReward: {
        coins: number;
        card?: string;  // 首次通关奖励的卡牌ID
    };
    repeatReward: {
        fragments: number;  // 重复通关奖励碎片数量
        chance: number;      // 获得卡牌的概率
        cardPool?: string[]; // 卡牌池
    };
    stars: number[];  // 3星、2星、1星通关的条件
}

/** 章节配置 */
export interface ChapterConfig {
    chapterId: number;
    name: string;
    element: ElementType;
    description: string;
    levels: LevelConfig[];
    eliteLevelId: number;  // 精英关卡ID
}

/** 冒险模式系统 */
export class AdventureSystem {
    /** 单例实例 */
    private static instance: AdventureSystem;
    
    /** 存档管理器 */
    private saveManager: SaveManager;
    
    /** 章节配置 */
    private chapterConfigs: ChapterConfig[];
    
    /** 构造函数 */
    private constructor() {
        this.saveManager = SaveManager.getInstance();
        this.chapterConfigs = this.createChapterConfigs();
    }
    
    /** 获取单例 */
    public static getInstance(): AdventureSystem {
        if (!AdventureSystem.instance) {
            AdventureSystem.instance = new AdventureSystem();
        }
        return AdventureSystem.instance;
    }
    
    // ==================== 章节配置 ====================
    
    /** 创建章节配置 */
    private createChapterConfigs(): ChapterConfig[] {
        return [
            // 第一章：火焰试炼（火属性）
            {
                chapterId: 1,
                name: '火焰试炼',
                element: ElementType.Fire,
                description: '穿越火焰山脉，证明你的实力',
                eliteLevelId: 11,
                levels: this.createFireChapterLevels()
            },
            // 第二章：森林守护（木属性）
            {
                chapterId: 2,
                name: '森林守护',
                element: ElementType.Wood,
                description: '踏入神秘森林，与自然之力同行',
                eliteLevelId: 21,
                levels: this.createWoodChapterLevels()
            },
            // 第三章：海洋征途（水属性）
            {
                chapterId: 3,
                name: '海洋征途',
                element: ElementType.Water,
                description: '征服无尽海洋，成为海的王者',
                eliteLevelId: 31,
                levels: this.createWaterChapterLevels()
            }
        ];
    }
    
    /** 创建火焰章节关卡 */
    private createFireChapterLevels(): LevelConfig[] {
        const levels: LevelConfig[] = [];
        
        for (let i = 1; i <= 10; i++) {
            levels.push({
                levelId: i,
                name: `火焰关卡 ${i}`,
                enemyDeck: this.generateEnemyDeck(ElementType.Fire, i),
                firstReward: {
                    coins: 100 + i * 20,
                    card: i === 10 ? 'fire_mage_pyromancer' : undefined
                },
                repeatReward: {
                    fragments: 5 + i,
                    chance: 0.2,
                    cardPool: ['fire_assassin_sparkfox', 'fire_mage_flamefox', 'fire_warrior_inferno']
                },
                stars: this.calculateStars(i)
            });
        }
        
        return levels;
    }
    
    /** 创建森林章节关卡 */
    private createWoodChapterLevels(): LevelConfig[] {
        const levels: LevelConfig[] = [];
        
        for (let i = 1; i <= 10; i++) {
            levels.push({
                levelId: 10 + i,
                name: `森林关卡 ${i}`,
                enemyDeck: this.generateEnemyDeck(ElementType.Wood, i),
                firstReward: {
                    coins: 100 + i * 20,
                    card: i === 10 ? 'wood_tank_ancient' : undefined
                },
                repeatReward: {
                    fragments: 5 + i,
                    chance: 0.2,
                    cardPool: ['wood_support_sprout', 'wood_tank_moss', 'wood_mage_lunar']
                },
                stars: this.calculateStars(i)
            });
        }
        
        return levels;
    }
    
    /** 创建海洋章节关卡 */
    private createWaterChapterLevels(): LevelConfig[] {
        const levels: LevelConfig[] = [];
        
        for (let i = 1; i <= 10; i++) {
            levels.push({
                levelId: 20 + i,
                name: `海洋关卡 ${i}`,
                enemyDeck: this.generateEnemyDeck(ElementType.Water, i),
                firstReward: {
                    coins: 100 + i * 20,
                    card: i === 10 ? 'water_mage_abyss' : undefined
                },
                repeatReward: {
                    fragments: 5 + i,
                    chance: 0.2,
                    cardPool: ['water_support_tide', 'water_tank_glacier', 'water_warrior_tidal']
                },
                stars: this.calculateStars(i)
            });
        }
        
        return levels;
    }
    
    /** 生成敌方套牌 */
    private generateEnemyDeck(element: ElementType, level: number): string[] {
        const cards = CARD_CONFIGS.filter(c => c.element === element);
        const deck: string[] = [];
        
        // 根据难度选择卡牌
        const availableCards = cards.filter(c => {
            if (level <= 3) return c.rarity === 'normal';
            if (level <= 6) return c.rarity === 'normal' || c.rarity === 'rare';
            return true;
        });
        
        // 选择12张卡牌
        for (let i = 0; i < 12 && availableCards.length > 0; i++) {
            const index = Math.floor(Math.random() * availableCards.length);
            deck.push(availableCards[index].baseId);
        }
        
        return deck;
    }
    
    /** 计算星级条件 */
    private calculateStars(level: number): number[] {
        // 简化：3星=剩余血量>=50%，2星=剩余血量>=25%，1星=通关
        return [5 + level * 2, 3 + level, 1];
    }
    
    // ==================== 关卡信息 ====================
    
    /** 获取所有章节 */
    public getAllChapters(): ChapterConfig[] {
        return this.chapterConfigs;
    }
    
    /** 获取章节 */
    public getChapter(chapterId: number): ChapterConfig | null {
        return this.chapterConfigs.find(c => c.chapterId === chapterId) || null;
    }
    
    /** 获取关卡 */
    public getLevel(levelId: number): LevelConfig | null {
        for (const chapter of this.chapterConfigs) {
            const level = chapter.levels.find(l => l.levelId === levelId);
            if (level) return level;
        }
        return null;
    }
    
    /** 获取精英关卡 */
    public getEliteLevel(chapterId: number): LevelConfig | null {
        const chapter = this.getChapter(chapterId);
        if (!chapter) return null;
        return chapter.levels.find(l => l.levelId === chapter.eliteLevelId) || null;
    }
    
    // ==================== 关卡进度 ====================
    
    /** 检查关卡是否已通关 */
    public isLevelCompleted(chapterId: number, levelId: number): boolean {
        const progress = this.saveManager.getAdventureProgress();
        const chapter = progress.chapters.find(c => c.chapterId === chapterId);
        if (!chapter) return false;
        return chapter.completedLevels.includes(levelId);
    }
    
    /** 获取关卡星级 */
    public getLevelStars(chapterId: number, levelId: number): number {
        const progress = this.saveManager.getAdventureProgress();
        const chapter = progress.chapters.find(c => c.chapterId === chapterId);
        if (!chapter) return 0;
        
        const index = chapter.levels.findIndex(l => l === levelId);
        return index >= 0 ? (chapter.stars[index] || 0) : 0;
    }
    
    /** 获取章节完成度 */
    public getChapterProgress(chapterId: number): { completed: number; total: number; stars: number } {
        const chapter = this.getChapter(chapterId);
        if (!chapter) return { completed: 0, total: 0, stars: 0 };
        
        const progress = this.saveManager.getAdventureProgress();
        const chapterProgress = progress.chapters.find(c => c.chapterId === chapterId);
        
        const completedCount = chapterProgress?.completedLevels.length || 0;
        const totalCount = chapter.levels.length;
        
        let totalStars = 0;
        if (chapterProgress) {
            totalStars = chapterProgress.stars.reduce((sum, s) => sum + s, 0);
        }
        
        return {
            completed: completedCount,
            total: totalCount,
            stars: totalStars
        };
    }
    
    // ==================== 关卡挑战 ====================
    
    /** 开始关卡战斗 */
    public startLevelBattle(levelId: number, difficulty: LevelDifficulty): {
        success: boolean;
        message: string;
        levelConfig?: LevelConfig;
        enemyDeck?: CardData[];
    } {
        const level = this.getLevel(levelId);
        if (!level) {
            return { success: false, message: '关卡不存在' };
        }
        
        // 检查前置关卡是否通关
        const chapter = this.getChapterByLevelId(levelId);
        if (chapter) {
            const levelIndex = chapter.levels.findIndex(l => l.levelId === levelId);
            
            // 检查精英关卡需要通关普通关卡
            if (levelId === chapter.eliteLevelId) {
                const normalLevelsCompleted = chapter.levels
                    .filter(l => l.levelId !== chapter.eliteLevelId)
                    .every(l => this.isLevelCompleted(chapter.chapterId, l.levelId));
                
                if (!normalLevelsCompleted) {
                    return { success: false, message: '需要通关所有普通关卡才能挑战精英关卡' };
                }
            } else if (levelIndex > 0) {
                // 检查前一关是否通关
                const prevLevel = chapter.levels[levelIndex - 1];
                if (!this.isLevelCompleted(chapter.chapterId, prevLevel.levelId)) {
                    return { success: false, message: '需要先通关前一关' };
                }
            }
        }
        
        // 构建敌方套牌
        const enemyDeck: CardData[] = [];
        for (const baseId of level.enemyDeck) {
            const config = CARD_CONFIGS.find(c => c.baseId === baseId);
            if (config) {
                const card = new CardData(
                    config.baseId,
                    config.name,
                    config.element,
                    config.role,
                    config.rarity,
                    config.cost,
                    config.attack,
                    config.health,
                    config.skillId,
                    1,
                    0
                );
                
                // 精英难度属性提升50%
                if (difficulty === LevelDifficulty.Elite) {
                    card.baseAttack = Math.floor(card.baseAttack * GameConfig.ELITE_DIFFICULTY_MULTIPLIER);
                    card.baseHealth = Math.floor(card.baseHealth * GameConfig.ELITE_DIFFICULTY_MULTIPLIER);
                    card.recalculateStats();
                }
                
                enemyDeck.push(card);
            }
        }
        
        return {
            success: true,
            message: '关卡开始',
            levelConfig: level,
            enemyDeck
        };
    }
    
    /** 获取章节通过关卡ID */
    private getChapterByLevelId(levelId: number): ChapterConfig | null {
        for (const chapter of this.chapterConfigs) {
            if (chapter.levels.some(l => l.levelId === levelId)) {
                return chapter;
            }
        }
        return null;
    }
    
    // ==================== 奖励结算 ====================
    
    /** 结算关卡奖励 */
    public settleLevelReward(
        levelId: number,
        difficulty: LevelDifficulty,
        playerHpRemaining: number,
        playerMaxHp: number
    ): {
        isFirstComplete: boolean;
        isEliteFirstComplete: boolean;
        stars: number;
        rewards: {
            coins: number;
            fragments: number;
            card?: CardConfig;
        };
    } {
        const level = this.getLevel(levelId);
        if (!level) {
            return {
                isFirstComplete: false,
                isEliteFirstComplete: false,
                stars: 0,
                rewards: { coins: 0, fragments: 0 }
            };
        }
        
        const chapter = this.getChapterByLevelId(levelId);
        if (!chapter) {
            return {
                isFirstComplete: false,
                isEliteFirstComplete: false,
                stars: 0,
                rewards: { coins: 0, fragments: 0 }
            };
        }
        
        const isFirstComplete = difficulty === LevelDifficulty.Normal && 
            !this.isLevelCompleted(chapter.chapterId, levelId);
        
        const isEliteFirstComplete = difficulty === LevelDifficulty.Elite && 
            !this.isLevelCompleted(chapter.chapterId, levelId);
        
        // 计算星级
        const hpPercent = playerMaxHp > 0 ? playerHpRemaining / playerMaxHp : 0;
        let stars = 1;
        if (hpPercent >= 0.5) stars = 3;
        else if (hpPercent >= 0.25) stars = 2;
        
        // 计算奖励
        let rewards = {
            coins: 0,
            fragments: 0,
            card: undefined as CardConfig | undefined
        };
        
        if (isFirstComplete && level.firstReward.card) {
            // 首次通关奖励
            rewards.coins = level.firstReward.coins;
            const cardConfig = CARD_CONFIGS.find(c => c.baseId === level.firstReward.card);
            if (cardConfig) {
                rewards.card = cardConfig;
            }
        } else {
            // 重复通关奖励
            rewards.coins = Math.floor(level.firstReward.coins * 0.3);
            rewards.fragments = level.repeatReward.fragments;
            
            // 概率获得卡牌
            if (level.repeatReward.chance > 0 && level.repeatReward.cardPool) {
                if (Math.random() < level.repeatReward.chance) {
                    const cardId = level.repeatReward.cardPool[
                        Math.floor(Math.random() * level.repeatReward.cardPool.length)
                    ];
                    rewards.card = CARD_CONFIGS.find(c => c.baseId === cardId);
                }
            }
        }
        
        // 精英难度奖励翻倍
        if (difficulty === LevelDifficulty.Elite) {
            rewards.coins *= 2;
            rewards.fragments *= 2;
        }
        
        // 更新存档
        this.saveManager.updateAdventureProgress(chapter.chapterId, levelId, stars);
        
        // 发放奖励
        if (rewards.coins > 0) {
            this.saveManager.addCoins(rewards.coins);
        }
        if (rewards.card) {
            this.saveManager.addCard(rewards.card.baseId, 1);
        }
        
        return {
            isFirstComplete,
            isEliteFirstComplete,
            stars,
            rewards
        };
    }
    
    // ==================== 章节解锁 ====================
    
    /** 检查章节是否解锁 */
    public isChapterUnlocked(chapterId: number): boolean {
        if (chapterId === 1) return true;
        
        // 检查上一章节是否通关
        const prevChapterId = chapterId - 1;
        const prevProgress = this.getChapterProgress(prevChapterId);
        
        // 需要通关上一章节所有普通关卡
        return prevProgress.completed >= 10;
    }
    
    /** 检查是否已通关章节所有关卡 */
    public isChapterCompleted(chapterId: number): boolean {
        const progress = this.getChapterProgress(chapterId);
        return progress.completed >= 10;
    }
    
    /** 获取章节的隐藏奖励 */
    public getChapterHiddenReward(chapterId: number): {
        unlocked: boolean;
        reward?: {
            coins: number;
            card: CardConfig;
        };
    } {
        if (!this.isChapterCompleted(chapterId)) {
            return { unlocked: false };
        }
        
        const chapter = this.getChapter(chapterId);
        if (!chapter) return { unlocked: false };
        
        // 每章节通关后解锁对应元素的传说卡牌
        const legendCards = CARD_CONFIGS.filter(c => c.rarity === 'legend' && c.element === chapter.element);
        if (legendCards.length === 0) return { unlocked: false };
        
        return {
            unlocked: true,
            reward: {
                coins: 1000,
                card: legendCards[0]
            }
        };
    }
}
