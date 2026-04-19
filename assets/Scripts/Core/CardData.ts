/**
 * 卡牌数据类
 */

import { ElementType, RoleType, Rarity, RARITY_MULTIPLIERS, ELEMENT_COUNTER } from './Types';
import { SkillData, SKILL_LIBRARY } from './SkillData';

/** 卡牌实例ID生成器 */
let cardInstanceId = 0;
function generateCardId(): string {
    return `card_${++cardInstanceId}_${Date.now()}`;
}

/** 卡牌实例数据 */
export class CardData {
    /** 实例ID（唯一） */
    public readonly instanceId: string;
    
    /** 基础配置ID */
    public readonly baseId: string;
    
    /** 卡牌名称 */
    public name: string;
    
    /** 元素属性 */
    public element: ElementType;
    
    /** 定位 */
    public role: RoleType;
    
    /** 稀有度 */
    public rarity: Rarity;
    
    /** 水晶费用 */
    public cost: number;
    
    /** 基础攻击力 */
    public baseAttack: number;
    
    /** 基础生命值 */
    public baseHealth: number;
    
    /** 当前攻击力（养成后） */
    public attack: number;
    
    /** 当前生命值（养成后） */
    public health: number;
    
    /** 最大生命值 */
    public maxHealth: number;
    
    /** 当前等级 */
    public currentLevel: number;
    
    /** 最大等级 */
    public maxLevel: number;
    
    /** 突破次数 */
    public breakthrough: number;
    
    /** 技能ID */
    public skillId: string;
    
    /** 皮肤ID */
    public skinId: string;
    
    /** 护盾值 */
    public shield: number;
    
    /** 是否已在本回合攻击过 */
    public hasAttacked: boolean;
    
    /** 是否处于休眠状态 */
    public isSleeping: boolean;
    
    /** 休眠剩余回合数 */
    public sleepTurns: number;
    
    /** 攻击力降低效果 */
    public attackReduction: number;
    
    /** 构造函数 */
    constructor(
        baseId: string,
        name: string,
        element: ElementType,
        role: RoleType,
        rarity: Rarity,
        cost: number,
        attack: number,
        health: number,
        skillId: string,
        currentLevel: number = 1,
        breakthrough: number = 0,
        skinId: string = ''
    ) {
        this.instanceId = generateCardId();
        this.baseId = baseId;
        this.name = name;
        this.element = element;
        this.role = role;
        this.rarity = rarity;
        this.cost = cost;
        this.baseAttack = attack;
        this.baseHealth = health;
        this.attack = attack;
        this.health = health;
        this.maxHealth = health;
        this.currentLevel = currentLevel;
        this.maxLevel = this.getMaxLevelByRarity();
        this.breakthrough = breakthrough;
        this.skillId = skillId;
        this.skinId = skinId;
        this.shield = 0;
        this.hasAttacked = false;
        this.isSleeping = false;
        this.sleepTurns = 0;
        this.attackReduction = 0;
        
        // 计算养成后的属性
        this.recalculateStats();
    }
    
    /** 根据稀有度获取最大等级 */
    private getMaxLevelByRarity(): number {
        switch (this.rarity) {
            case Rarity.Normal: return 20;
            case Rarity.Rare: return 30;
            case Rarity.Epic: return 40;
            case Rarity.Legend: return 50;
            default: return 20;
        }
    }
    
    /** 重新计算养成后的属性 */
    public recalculateStats(): void {
        const rarityMultiplier = RARITY_MULTIPLIERS[this.rarity];
        const levelBonus = (this.currentLevel - 1) * 0.05;
        const breakthroughBonus = 1 + (this.breakthrough * 0.1);
        
        // 计算攻击力
        this.attack = Math.floor(this.baseAttack * (1 + levelBonus * rarityMultiplier * breakthroughBonus));
        
        // 计算生命值
        this.maxHealth = Math.floor(this.baseHealth * (1 + levelBonus * rarityMultiplier * breakthroughBonus));
        
        // 如果当前生命超过最大生命，修正
        if (this.health > this.maxHealth) {
            this.health = this.maxHealth;
        }
    }
    
    /** 获取实际攻击力（考虑debuff） */
    public getDisplayAttack(): number {
        return Math.max(1, this.attack - this.attackReduction);
    }
    
    /** 获取实际生命值 */
    public getDisplayHealth(): number {
        return this.health;
    }
    
    /** 检查是否可出牌（水晶是否足够） */
    public canPlay(currentMana: number): boolean {
        return currentMana >= this.cost;
    }
    
    /** 检查是否可攻击 */
    public canAttack(): boolean {
        return !this.hasAttacked && !this.isSleeping && this.health > 0;
    }
    
    /** 获取技能数据 */
    public getSkill(): SkillData | null {
        return SKILL_LIBRARY[this.skillId] || null;
    }
    
    /** 受到伤害 */
    public takeDamage(damage: number): number {
        let remainingDamage = damage;
        
        // 先破盾
        if (this.shield > 0) {
            const shieldDamage = Math.min(this.shield, remainingDamage);
            this.shield -= shieldDamage;
            remainingDamage -= shieldDamage;
        }
        
        // 剩余伤害扣血
        if (remainingDamage > 0) {
            this.health -= remainingDamage;
        }
        
        return remainingDamage;
    }
    
    /** 治疗 */
    public heal(amount: number): void {
        this.health = Math.min(this.maxHealth, this.health + amount);
    }
    
    /** 添加护盾 */
    public addShield(amount: number): void {
        this.shield += amount;
    }
    
    /** 重置回合状态 */
    public resetTurnState(): void {
        this.hasAttacked = false;
        
        // 处理休眠状态
        if (this.isSleeping && this.sleepTurns > 0) {
            this.sleepTurns--;
            if (this.sleepTurns <= 0) {
                this.isSleeping = false;
            }
        }
    }
    
    /** 设置休眠 */
    public setSleep(turns: number): void {
        this.isSleeping = true;
        this.sleepTurns = turns;
    }
    
    /** 移除所有debuff */
    public cleanse(): void {
        this.attackReduction = 0;
        this.isSleeping = false;
        this.sleepTurns = 0;
    }
    
    /** 克隆卡牌 */
    public clone(): CardData {
        const card = new CardData(
            this.baseId,
            this.name,
            this.element,
            this.role,
            this.rarity,
            this.cost,
            this.baseAttack,
            this.baseHealth,
            this.skillId,
            this.currentLevel,
            this.breakthrough,
            this.skinId
        );
        return card;
    }
    
    /** 转换为JSON对象 */
    public toJSON(): object {
        return {
            instanceId: this.instanceId,
            baseId: this.baseId,
            name: this.name,
            element: this.element,
            role: this.role,
            rarity: this.rarity,
            cost: this.cost,
            baseAttack: this.baseAttack,
            baseHealth: this.baseHealth,
            currentLevel: this.currentLevel,
            maxLevel: this.maxLevel,
            breakthrough: this.breakthrough,
            skillId: this.skillId,
            skinId: this.skinId
        };
    }
    
    /** 从JSON创建卡牌 */
    public static fromJSON(json: any): CardData {
        const card = new CardData(
            json.baseId,
            json.name,
            json.element,
            json.role,
            json.rarity,
            json.cost,
            json.baseAttack,
            json.baseHealth,
            json.skillId,
            json.currentLevel,
            json.breakthrough,
            json.skinId
        );
        return card;
    }
}
