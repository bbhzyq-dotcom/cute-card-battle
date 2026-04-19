/**
 * 存档系统 - 游戏数据持久化
 */

import { CardData } from '../Core/CardData';
import { GameConfig } from '../Config/GameConfig';
import { CARD_CONFIGS, CardConfig, getCardConfig } from '../Data/CardConfigs';
import { Rarity } from '../Core/Types';

/** 拥有卡牌数据 */
export interface OwnedCard {
    baseId: string;
    count: number;
    level: number;
    breakthrough: number;
    skinId: string;
}

/** 套牌数据 */
export interface DeckData {
    id: string;
    name: string;
    cardIds: string[];  // 12张卡牌的baseId列表
}

/** 存档数据结构 */
export interface SaveData {
    version: number;
    playerLevel: number;
    playerExp: number;
    coins: number;
    ownedCards: OwnedCard[];
    decks: DeckData[];
    currentDeckId: string;
    leaguePoints: number;
    leagueRank: number;
    adventureProgress: AdventureProgress;
    settings: GameSettings;
    createTime: number;
    updateTime: number;
}

/** 冒险模式进度 */
export interface AdventureProgress {
    chapters: ChapterProgress[];
}

/** 章节进度 */
export interface ChapterProgress {
    chapterId: number;
    completedLevels: number[];
    eliteCompletedLevels: number[];
    stars: number[];
}

/** 游戏设置 */
export interface GameSettings {
    bgmVolume: number;
    sfxVolume: number;
    vibrationEnabled: boolean;
}

/** 存档管理器 */
export class SaveManager {
    /** 单例实例 */
    private static instance: SaveManager;
    
    /** 当前存档 */
    private currentSave: SaveData;
    
    /** 构造函数 */
    private constructor() {
        this.currentSave = this.createDefaultSave();
    }
    
    /** 获取单例 */
    public static getInstance(): SaveManager {
        if (!SaveManager.instance) {
            SaveManager.instance = new SaveManager();
        }
        return SaveManager.instance;
    }
    
    /** 创建默认存档 */
    private createDefaultSave(): SaveData {
        return {
            version: GameConfig.SAVE_VERSION,
            playerLevel: 1,
            playerExp: 0,
            coins: 1000,
            ownedCards: [],
            decks: [],
            currentDeckId: '',
            leaguePoints: 0,
            leagueRank: 0,
            adventureProgress: {
                chapters: [
                    { chapterId: 1, completedLevels: [], eliteCompletedLevels: [], stars: [] },
                    { chapterId: 2, completedLevels: [], eliteCompletedLevels: [], stars: [] },
                    { chapterId: 3, completedLevels: [], eliteCompletedLevels: [], stars: [] }
                ]
            },
            settings: {
                bgmVolume: 0.8,
                sfxVolume: 0.8,
                vibrationEnabled: true
            },
            createTime: Date.now(),
            updateTime: Date.now()
        };
    }
    
    /** 加载存档 */
    public loadGame(): boolean {
        try {
            const savedData = localStorage.getItem(GameConfig.SAVE_KEY);
            if (!savedData) {
                // 没有存档，创建新存档
                this.currentSave = this.createDefaultSave();
                this.initStarterDeck();
                return true;
            }
            
            const parsed = JSON.parse(savedData);
            
            // 数据版本检查
            if (parsed.version !== GameConfig.SAVE_VERSION) {
                // 版本不匹配，需要迁移（简化处理：重置）
                console.warn('存档版本不匹配，重置存档');
                this.currentSave = this.createDefaultSave();
                this.initStarterDeck();
                return true;
            }
            
            this.currentSave = parsed;
            return true;
        } catch (e) {
            console.error('加载存档失败:', e);
            this.currentSave = this.createDefaultSave();
            this.initStarterDeck();
            return false;
        }
    }
    
    /** 保存存档 */
    public saveGame(): boolean {
        try {
            this.currentSave.updateTime = Date.now();
            localStorage.setItem(GameConfig.SAVE_KEY, JSON.stringify(this.currentSave));
            return true;
        } catch (e) {
            console.error('保存存档失败:', e);
            return false;
        }
    }
    
    /** 重置存档 */
    public resetGame(): void {
        this.currentSave = this.createDefaultSave();
        this.initStarterDeck();
        this.saveGame();
    }
    
    /** 初始化新手套牌 */
    private initStarterDeck(): void {
        // 给予初始卡牌（每种定位给予几张）
        const starterCards = [
            'fire_assassin_sparkfox',
            'fire_mage_flamefox',
            'fire_warrior_inferno',
            'wood_support_sprout',
            'wood_tank_moss',
            'wood_mage_lunar',
            'water_support_tide',
            'water_tank_glacier',
            'water_warrior_tidal',
            'light_support_sparkle',
            'light_mage_holy',
            'light_warrior_angel'
        ];
        
        for (const baseId of starterCards) {
            this.addCard(baseId, 2);
        }
        
        // 创建默认套牌
        const defaultDeck: DeckData = {
            id: 'starter_deck',
            name: '新手套牌',
            cardIds: starterCards
        };
        
        this.currentSave.decks = [defaultDeck];
        this.currentSave.currentDeckId = defaultDeck.id;
    }
    
    /** 添加卡牌 */
    public addCard(baseId: string, count: number = 1): void {
        const existing = this.currentSave.ownedCards.find(c => c.baseId === baseId);
        if (existing) {
            existing.count += count;
        } else {
            this.currentSave.ownedCards.push({
                baseId,
                count,
                level: 1,
                breakthrough: 0,
                skinId: ''
            });
        }
    }
    
    /** 移除卡牌 */
    public removeCard(baseId: string, count: number = 1): boolean {
        const existing = this.currentSave.ownedCards.find(c => c.baseId === baseId);
        if (!existing || existing.count < count) {
            return false;
        }
        
        existing.count -= count;
        
        // 清理0数量的卡牌
        if (existing.count <= 0) {
            const index = this.currentSave.ownedCards.indexOf(existing);
            this.currentSave.ownedCards.splice(index, 1);
        }
        
        return true;
    }
    
    /** 获取卡牌数量 */
    public getCardCount(baseId: string): number {
        const card = this.currentSave.ownedCards.find(c => c.baseId === baseId);
        return card ? card.count : 0;
    }
    
    /** 检查是否有某张卡牌 */
    public hasCard(baseId: string): boolean {
        return this.getCardCount(baseId) > 0;
    }
    
    /** 检查是否可以合成卡牌 */
    public canCreateCard(baseId: string): boolean {
        const config = getCardConfig(baseId);
        if (!config) return false;
        
        // 计算需要的碎片数量
        const fragmentsNeeded = this.getFragmentsNeeded(config.rarity);
        return this.getCardCount(baseId) === 0; // 简化：没有拥有才能合成
    }
    
    /** 获取合成所需碎片数量 */
    private getFragmentsNeeded(rarity: Rarity): number {
        switch (rarity) {
            case Rarity.Normal: return 20;
            case Rarity.Rare: return 30;
            case Rarity.Epic: return 50;
            case Rarity.Legend: return 80;
            default: return 999;
        }
    }
    
    /** 获取玩家所有卡牌 */
    public getOwnedCards(): OwnedCard[] {
        return [...this.currentSave.ownedCards];
    }
    
    /** 获取当前套牌 */
    public getCurrentDeck(): DeckData | null {
        return this.currentSave.decks.find(d => d.id === this.currentSave.currentDeckId) || null;
    }
    
    /** 设置当前套牌 */
    public setCurrentDeck(deckId: string): void {
        if (this.currentSave.decks.some(d => d.id === deckId)) {
            this.currentSave.currentDeckId = deckId;
            this.saveGame();
        }
    }
    
    /** 创建新套牌 */
    public createDeck(name: string, cardIds: string[]): DeckData | null {
        if (cardIds.length !== GameConfig.DECK_RECOMMENDED_SIZE) {
            return null;
        }
        
        const id = `deck_${Date.now()}`;
        const deck: DeckData = {
            id,
            name,
            cardIds
        };
        
        this.currentSave.decks.push(deck);
        this.currentSave.currentDeckId = id;
        this.saveGame();
        
        return deck;
    }
    
    /** 更新套牌 */
    public updateDeck(deckId: string, cardIds: string[]): boolean {
        const deck = this.currentSave.decks.find(d => d.id === deckId);
        if (!deck) return false;
        
        deck.cardIds = cardIds;
        this.saveGame();
        return true;
    }
    
    /** 删除套牌 */
    public deleteDeck(deckId: string): boolean {
        const index = this.currentSave.decks.findIndex(d => d.id === deckId);
        if (index === -1) return false;
        
        this.currentSave.decks.splice(index, 1);
        
        // 如果删除的是当前套牌，切换到第一个
        if (this.currentSave.currentDeckId === deckId) {
            this.currentSave.currentDeckId = this.currentSave.decks[0]?.id || '';
        }
        
        this.saveGame();
        return true;
    }
    
    /** 获取所有套牌 */
    public getAllDecks(): DeckData[] {
        return [...this.currentSave.decks];
    }
    
    /** 获取金币 */
    public getCoins(): number {
        return this.currentSave.coins;
    }
    
    /** 添加金币 */
    public addCoins(amount: number): void {
        this.currentSave.coins += amount;
        this.saveGame();
    }
    
    /** 消耗金币 */
    public spendCoins(amount: number): boolean {
        if (this.currentSave.coins < amount) {
            return false;
        }
        this.currentSave.coins -= amount;
        this.saveGame();
        return true;
    }
    
    /** 获取玩家等级 */
    public getPlayerLevel(): number {
        return this.currentSave.playerLevel;
    }
    
    /** 添加经验 */
    public addExp(amount: number): void {
        this.currentSave.playerExp += amount;
        // 升级逻辑：每100经验升一级
        while (this.currentSave.playerExp >= 100) {
            this.currentSave.playerExp -= 100;
            this.currentSave.playerLevel++;
        }
        this.saveGame();
    }
    
    /** 获取天梯积分 */
    public getLeaguePoints(): number {
        return this.currentSave.leaguePoints;
    }
    
    /** 添加天梯积分 */
    public addLeaguePoints(points: number): void {
        this.currentSave.leaguePoints += points;
        this.saveGame();
    }
    
    /** 扣除天梯积分 */
    public removeLeaguePoints(points: number): void {
        this.currentSave.leaguePoints = Math.max(0, this.currentSave.leaguePoints - points);
        this.saveGame();
    }
    
    /** 获取天梯段位 */
    public getLeagueRank(): number {
        return this.currentSave.leagueRank;
    }
    
    /** 设置天梯段位 */
    public setLeagueRank(rank: number): void {
        this.currentSave.leagueRank = rank;
        this.saveGame();
    }
    
    /** 获取游戏设置 */
    public getSettings(): GameSettings {
        return { ...this.currentSave.settings };
    }
    
    /** 更新游戏设置 */
    public updateSettings(settings: Partial<GameSettings>): void {
        this.currentSave.settings = { ...this.currentSave.settings, ...settings };
        this.saveGame();
    }
    
    /** 获取冒险进度 */
    public getAdventureProgress(): AdventureProgress {
        return this.currentSave.adventureProgress;
    }
    
    /** 更新冒险进度 */
    public updateAdventureProgress(chapterId: number, levelId: number, stars: number = 3): void {
        const chapter = this.currentSave.adventureProgress.chapters.find(c => c.chapterId === chapterId);
        if (!chapter) return;
        
        if (!chapter.completedLevels.includes(levelId)) {
            chapter.completedLevels.push(levelId);
        }
        
        if (stars > (chapter.stars[levelId] || 0)) {
            chapter.stars[levelId] = stars;
        }
        
        this.saveGame();
    }
    
    /** 导出存档数据 */
    public exportSave(): string {
        return JSON.stringify(this.currentSave);
    }
    
    /** 导入存档数据 */
    public importSave(data: string): boolean {
        try {
            const parsed = JSON.parse(data);
            if (parsed.version) {
                this.currentSave = parsed;
                this.saveGame();
                return true;
            }
            return false;
        } catch (e) {
            console.error('导入存档失败:', e);
            return false;
        }
    }
}
