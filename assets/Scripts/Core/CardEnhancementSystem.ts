/**
 * 卡牌养成系统 - 管理卡牌强化、突破和皮肤
 */

import { CardData } from './CardData';
import { Rarity, RARITY_MULTIPLIERS, GameConfig } from './Types';
import { SaveManager, OwnedCard } from '../Data/SaveManager';
import { CARD_CONFIGS, CardConfig } from '../Data/CardConfigs';

/** 养成结果 */
export interface EnhancementResult {
    success: boolean;
    newLevel?: number;
    newAttack?: number;
    newHealth?: number;
    coinsSpent?: number;
    message?: string;
}

/** 突破结果 */
export interface BreakthroughResult {
    success: boolean;
    newBreakthrough?: number;
    newSkill?: string;
    message?: string;
}

/** 皮肤配置 */
export interface SkinConfig {
    skinId: string;
    baseId: string;
    name: string;
    description: string;
    isDefault: boolean;
}

/** 卡牌养成系统 */
export class CardEnhancementSystem {
    /** 单例实例 */
    private static instance: CardEnhancementSystem;
    
    /** 存档管理器 */
    private saveManager: SaveManager;
    
    /** 皮肤配置 */
    private skinConfigs: Map<string, SkinConfig[]>;
    
    /** 构造函数 */
    private constructor() {
        this.saveManager = SaveManager.getInstance();
        this.skinConfigs = this.createSkinConfigs();
    }
    
    /** 获取单例 */
    public static getInstance(): CardEnhancementSystem {
        if (!CardEnhancementSystem.instance) {
            CardEnhancementSystem.instance = new CardEnhancementSystem();
        }
        return CardEnhancementSystem.instance;
    }
    
    // ==================== 皮肤配置 ====================
    
    /** 创建皮肤配置 */
    private createSkinConfigs(): Map<string, SkinConfig[]> {
        const configs = new Map<string, SkinConfig[]>();
        
        // 为每张传说卡牌创建皮肤
        const legendCards = CARD_CONFIGS.filter(c => c.rarity === Rarity.Legend);
        
        for (const card of legendCards) {
            configs.set(card.baseId, [
                {
                    skinId: `${card.baseId}_default`,
                    baseId: card.baseId,
                    name: '默认皮肤',
                    description: '默认立绘',
                    isDefault: true
                },
                {
                    skinId: `${card.baseId}_golden`,
                    baseId: card.baseId,
                    name: '金色皮肤',
                    description: '闪耀金色特效',
                    isDefault: false
                }
            ]);
        }
        
        // 为史诗卡牌创建皮肤
        const epicCards = CARD_CONFIGS.filter(c => c.rarity === Rarity.Epic);
        for (const card of epicCards) {
            configs.set(card.baseId, [
                {
                    skinId: `${card.baseId}_default`,
                    baseId: card.baseId,
                    name: '默认皮肤',
                    description: '默认立绘',
                    isDefault: true
                }
            ]);
        }
        
        return configs;
    }
    
    /** 获取卡牌皮肤列表 */
    public getCardSkins(baseId: string): SkinConfig[] {
        return this.skinConfigs.get(baseId) || [];
    }
    
    // ==================== 卡牌强化 ====================
    
    /** 强化卡牌 */
    public enhanceCard(baseId: string, targetLevel: number): EnhancementResult {
        const ownedCard = this.saveManager.getOwnedCards().find(c => c.baseId === baseId);
        if (!ownedCard) {
            return { success: false, message: '未拥有该卡牌' };
        }
        
        const config = CARD_CONFIGS.find(c => c.baseId === baseId);
        if (!config) {
            return { success: false, message: '卡牌配置不存在' };
        }
        
        // 检查目标等级是否有效
        const maxLevel = this.getMaxLevel(config.rarity);
        if (targetLevel <= ownedCard.level || targetLevel > maxLevel) {
            return { success: false, message: `目标等级无效（1-${maxLevel}）` };
        }
        
        // 计算所需金币
        let totalCost = 0;
        for (let lv = ownedCard.level + 1; lv <= targetLevel; lv++) {
            totalCost += this.calculateEnhanceCost(config.rarity, lv);
        }
        
        // 检查金币是否足够
        if (!this.saveManager.spendCoins(totalCost)) {
            return { success: false, message: '金币不足' };
        }
        
        // 升级卡牌
        const newLevel = targetLevel;
        const levelBonus = (newLevel - 1) * 0.05;
        const breakthroughBonus = 1 + (ownedCard.breakthrough * 0.1);
        const rarityMultiplier = RARITY_MULTIPLIERS[config.rarity];
        
        const newAttack = Math.floor(config.attack * (1 + levelBonus * rarityMultiplier * breakthroughBonus));
        const newHealth = Math.floor(config.health * (1 + levelBonus * rarityMultiplier * breakthroughBonus));
        
        // 更新存档
        ownedCard.level = newLevel;
        this.saveManager.saveGame();
        
        return {
            success: true,
            newLevel,
            newAttack,
            newHealth,
            coinsSpent: totalCost,
            message: `强化成功！卡牌升至${newLevel}级`
        };
    }
    
    /** 升一级 */
    public enhanceCardByOneLevel(baseId: string): EnhancementResult {
        const ownedCard = this.saveManager.getOwnedCards().find(c => c.baseId === baseId);
        if (!ownedCard) {
            return { success: false, message: '未拥有该卡牌' };
        }
        
        const config = CARD_CONFIGS.find(c => c.baseId === baseId);
        if (!config) {
            return { success: false, message: '卡牌配置不存在' };
        }
        
        const maxLevel = this.getMaxLevel(config.rarity);
        if (ownedCard.level >= maxLevel) {
            return { success: false, message: '已达到最大等级' };
        }
        
        const cost = this.calculateEnhanceCost(config.rarity, ownedCard.level + 1);
        
        if (!this.saveManager.spendCoins(cost)) {
            return { success: false, message: '金币不足' };
        }
        
        ownedCard.level++;
        const newLevel = ownedCard.level;
        
        const levelBonus = (newLevel - 1) * 0.05;
        const breakthroughBonus = 1 + (ownedCard.breakthrough * 0.1);
        const rarityMultiplier = RARITY_MULTIPLIERS[config.rarity];
        
        const newAttack = Math.floor(config.attack * (1 + levelBonus * rarityMultiplier * breakthroughBonus));
        const newHealth = Math.floor(config.health * (1 + levelBonus * rarityMultiplier * breakthroughBonus));
        
        this.saveManager.saveGame();
        
        return {
            success: true,
            newLevel,
            newAttack,
            newHealth,
            coinsSpent: cost,
            message: `强化成功！卡牌升至${newLevel}级`
        };
    }
    
    /** 计算强化费用 */
    public calculateEnhanceCost(rarity: Rarity, targetLevel: number): number {
        const baseCost = GameConfig.ENHANCE_BASE_COST;
        const rarityMultiplier = RARITY_MULTIPLIERS[rarity];
        return Math.floor(baseCost * targetLevel * rarityMultiplier);
    }
    
    /** 获取最大等级 */
    public getMaxLevel(rarity: Rarity): number {
        switch (rarity) {
            case Rarity.Normal: return 20;
            case Rarity.Rare: return 30;
            case Rarity.Epic: return 40;
            case Rarity.Legend: return 50;
            default: return 20;
        }
    }
    
    // ==================== 卡牌突破 ====================
    
    /** 检查是否可以突破 */
    public canBreakthrough(baseId: string): { available: boolean; message: string; cost?: number } {
        const ownedCard = this.saveManager.getOwnedCards().find(c => c.baseId === baseId);
        if (!ownedCard) {
            return { available: false, message: '未拥有该卡牌' };
        }
        
        if (ownedCard.breakthrough >= GameConfig.MAX_BREAKTHROUGH) {
            return { available: false, message: '已达到最大突破次数' };
        }
        
        const config = CARD_CONFIGS.find(c => c.baseId === baseId);
        if (!config) {
            return { available: false, message: '卡牌配置不存在' };
        }
        
        // 检查是否达到满级
        if (ownedCard.level < this.getMaxLevel(config.rarity)) {
            return { available: false, message: '需要达到满级才能突破' };
        }
        
        // 突破需要同名卡牌
        if (ownedCard.count < 2) {
            return { available: false, message: '需要拥有2张同名卡牌才能突破' };
        }
        
        const cost = this.calculateBreakthroughCost(ownedCard.breakthrough);
        return { available: true, message: '可以突破', cost };
    }
    
    /** 突破卡牌 */
    public breakthroughCard(baseId: string): BreakthroughResult {
        const check = this.canBreakthrough(baseId);
        if (!check.available) {
            return { success: false, message: check.message };
        }
        
        const ownedCard = this.saveManager.getOwnedCards().find(c => c.baseId === baseId);
        if (!ownedCard) {
            return { success: false, message: '未拥有该卡牌' };
        }
        
        // 消耗同名卡牌
        ownedCard.count -= 1;
        
        // 消耗金币
        if (check.cost && !this.saveManager.spendCoins(check.cost)) {
            ownedCard.count += 1; // 回滚
            return { success: false, message: '金币不足' };
        }
        
        // 执行突破
        ownedCard.breakthrough++;
        
        // 突破满级解锁新技能（简化实现）
        let newSkill: string | undefined;
        if (ownedCard.breakthrough === 5) {
            const config = CARD_CONFIGS.find(c => c.baseId === baseId);
            if (config) {
                // 解锁大招
                newSkill = config.skillId;
            }
        }
        
        this.saveManager.saveGame();
        
        return {
            success: true,
            newBreakthrough: ownedCard.breakthrough,
            newSkill,
            message: `突破成功！突破等级：${ownedCard.breakthrough}`
        };
    }
    
    /** 计算突破费用 */
    public calculateBreakthroughCost(currentBreakthrough: number): number {
        return Math.floor(500 * Math.pow(2, currentBreakthrough));
    }
    
    /** 获取突破加成 */
    public getBreakthroughBonus(breakthrough: number): number {
        return 1 + (breakthrough * GameConfig.BREAKTHROUGH_BONUS_PERCENT);
    }
    
    // ==================== 皮肤系统 ====================
    
    /** 装备皮肤 */
    public equipSkin(baseId: string, skinId: string): { success: boolean; message: string } {
        const skins = this.getCardSkins(baseId);
        const skin = skins.find(s => s.skinId === skinId);
        
        if (!skin) {
            return { success: false, message: '皮肤不存在' };
        }
        
        const ownedCard = this.saveManager.getOwnedCards().find(c => c.baseId === baseId);
        if (!ownedCard) {
            return { success: false, message: '未拥有该卡牌' };
        }
        
        // 检查是否解锁该皮肤
        if (!skin.isDefault && ownedCard.breakthrough < 5) {
            return { success: false, message: '需要5次突破才能解锁此皮肤' };
        }
        
        ownedCard.skinId = skinId;
        this.saveManager.saveGame();
        
        return { success: true, message: `已装备皮肤：${skin.name}` };
    }
    
    /** 获取当前装备的皮肤 */
    public getEquippedSkin(baseId: string): SkinConfig | null {
        const ownedCard = this.saveManager.getOwnedCards().find(c => c.baseId === baseId);
        if (!ownedCard) return null;
        
        const skins = this.getCardSkins(baseId);
        return skins.find(s => s.skinId === ownedCard.skinId) || skins[0] || null;
    }
    
    // ==================== 卡牌分解 ====================
    
    /** 分解卡牌 */
    public decomposeCard(baseId: string, count: number = 1): { 
        success: boolean; 
        fragments?: number; 
        message?: string 
    } {
        const ownedCard = this.saveManager.getOwnedCards().find(c => c.baseId === baseId);
        if (!ownedCard) {
            return { success: false, message: '未拥有该卡牌' };
        }
        
        if (ownedCard.count < count) {
            return { success: false, message: '卡牌数量不足' };
        }
        
        const config = CARD_CONFIGS.find(c => c.baseId === baseId);
        if (!config) {
            return { success: false, message: '卡牌配置不存在' };
        }
        
        // 计算返还碎片数量
        const fragmentsPerCard = this.calculateDecomposeFragments(config.rarity);
        const totalFragments = fragmentsPerCard * count;
        
        // 消耗卡牌
        ownedCard.count -= count;
        
        // 如果卡牌数量为0，移除记录
        if (ownedCard.count <= 0) {
            const cards = this.saveManager.getOwnedCards();
            const index = cards.indexOf(ownedCard);
            if (index !== -1) {
                cards.splice(index, 1);
            }
        }
        
        // 发放碎片（简化：直接给完整卡牌）
        this.saveManager.addCard(baseId, count);
        
        this.saveManager.saveGame();
        
        return {
            success: true,
            fragments: count, // 简化：返还完整卡牌
            message: `分解成功，获得${count}张同名卡牌`
        };
    }
    
    /** 计算分解返还碎片 */
    public calculateDecomposeFragments(rarity: Rarity): number {
        switch (rarity) {
            case Rarity.Normal: return 5;
            case Rarity.Rare: return 15;
            case Rarity.Epic: return 30;
            case Rarity.Legend: return 60;
            default: return 0;
        }
    }
    
    // ==================== 养成计算 ====================
    
    /** 计算卡牌属性 */
    public calculateCardStats(baseId: string, level: number, breakthrough: number): {
        attack: number;
        health: number;
    } {
        const config = CARD_CONFIGS.find(c => c.baseId === baseId);
        if (!config) {
            return { attack: 0, health: 0 };
        }
        
        const levelBonus = (level - 1) * 0.05;
        const breakthroughBonus = 1 + (breakthrough * GameConfig.BREAKTHROUGH_BONUS_PERCENT);
        const rarityMultiplier = RARITY_MULTIPLIERS[config.rarity];
        
        return {
            attack: Math.floor(config.attack * (1 + levelBonus * rarityMultiplier * breakthroughBonus)),
            health: Math.floor(config.health * (1 + levelBonus * rarityMultiplier * breakthroughBonus))
        };
    }
    
    /** 获取养成信息 */
    public getEnhancementInfo(baseId: string): {
        currentLevel: number;
        maxLevel: number;
        currentBreakthrough: number;
        maxBreakthrough: number;
        nextLevelCost: number;
        canBreakthrough: boolean;
        breakthroughCost: number;
        skins: SkinConfig[];
        equippedSkin: SkinConfig | null;
    } | null {
        const ownedCard = this.saveManager.getOwnedCards().find(c => c.baseId === baseId);
        if (!ownedCard) return null;
        
        const config = CARD_CONFIGS.find(c => c.baseId === baseId);
        if (!config) return null;
        
        const maxLevel = this.getMaxLevel(config.rarity);
        const nextLevelCost = ownedCard.level < maxLevel ? 
            this.calculateEnhanceCost(config.rarity, ownedCard.level + 1) : 0;
        
        const btCheck = this.canBreakthrough(baseId);
        
        return {
            currentLevel: ownedCard.level,
            maxLevel,
            currentBreakthrough: ownedCard.breakthrough,
            maxBreakthrough: GameConfig.MAX_BREAKTHROUGH,
            nextLevelCost,
            canBreakthrough: btCheck.available,
            breakthroughCost: btCheck.cost || 0,
            skins: this.getCardSkins(baseId),
            equippedSkin: this.getEquippedSkin(baseId)
        };
    }
}
