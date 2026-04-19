/**
 * 玩家状态数据类
 */

import { CardData } from './CardData';

/** 玩家状态 */
export class PlayerState {
    /** 玩家名称 */
    public name: string;
    
    /** 当前生命值 */
    public hp: number;
    
    /** 最大生命值 */
    public maxHp: number;
    
    /** 当前水晶 */
    public mana: number;
    
    /** 水晶上限 */
    public maxMana: number;
    
    /** 当前能量 */
    public energy: number;
    
    /** 手牌 */
    public hand: CardData[];
    
    /** 战场卡牌（最多6个位置，0-2我方前线，3-5我方后线） */
    public field: (CardData | null)[];
    
    /** 牌堆 */
    public deck: CardData[];
    
    /** 墓地 */
    public graveyard: CardData[];
    
    /** 初始生命值 */
    public readonly INITIAL_HP: number = 20;
    
    /** 初始水晶 */
    public readonly INITIAL_MANA: number = 3;
    
    /** 最大手牌数 */
    public readonly MAX_HAND_SIZE: number = 10;
    
    /** 最大战场位置数 */
    public readonly MAX_FIELD_SIZE: number = 6;
    
    /** 能量上限 */
    public readonly MAX_ENERGY: number = 10;
    
    /** 构造函数 */
    constructor(name: string) {
        this.name = name;
        this.hp = this.INITIAL_HP;
        this.maxHp = this.INITIAL_HP;
        this.mana = this.INITIAL_MANA;
        this.maxMana = this.INITIAL_MANA;
        this.energy = 0;
        this.hand = [];
        this.field = new Array(this.MAX_FIELD_SIZE).fill(null);
        this.deck = [];
        this.graveyard = [];
    }
    
    /** 初始化套牌 */
    public initDeck(cards: CardData[]): void {
        this.deck = [...cards];
        this.shuffleDeck();
    }
    
    /** 洗牌 */
    public shuffleDeck(): void {
        for (let i = this.deck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.deck[i], this.deck[j]] = [this.deck[j], this.deck[i]];
        }
    }
    
    /** 抽牌 */
    public drawCards(count: number): CardData[] {
        const drawnCards: CardData[] = [];
        
        for (let i = 0; i < count; i++) {
            if (this.deck.length === 0) {
                // 牌堆为空，无法抽牌
                break;
            }
            
            if (this.hand.length >= this.MAX_HAND_SIZE) {
                // 手牌已满，无法抽牌
                break;
            }
            
            const card = this.deck.pop()!;
            this.hand.push(card);
            drawnCards.push(card);
        }
        
        return drawnCards;
    }
    
    /** 从手牌移除卡牌 */
    public removeCardFromHand(cardInstanceId: string): CardData | null {
        const index = this.hand.findIndex(card => card.instanceId === cardInstanceId);
        if (index !== -1) {
            return this.hand.splice(index, 1)[0];
        }
        return null;
    }
    
    /** 获取手牌中的卡牌 */
    public getHandCard(cardInstanceId: string): CardData | null {
        return this.hand.find(card => card.instanceId === cardInstanceId) || null;
    }
    
    /** 出牌到战场 */
    public playCardToField(cardInstanceId: string, position: number): CardData | null {
        // 验证位置有效性
        if (position < 0 || position >= this.MAX_FIELD_SIZE) {
            return null;
        }
        
        // 验证位置是否为空
        if (this.field[position] !== null) {
            return null;
        }
        
        // 从手牌移除
        const card = this.removeCardFromHand(cardInstanceId);
        if (!card) {
            return null;
        }
        
        // 放置到战场
        this.field[position] = card;
        return card;
    }
    
    /** 从战场移除卡牌（到墓地） */
    public removeCardFromField(position: number): CardData | null {
        if (position < 0 || position >= this.MAX_FIELD_SIZE) {
            return null;
        }
        
        const card = this.field[position];
        if (!card) {
            return null;
        }
        
        this.field[position] = null;
        this.graveyard.push(card);
        return card;
    }
    
    /** 获取战场上的卡牌 */
    public getFieldCard(position: number): CardData | null {
        if (position < 0 || position >= this.MAX_FIELD_SIZE) {
            return null;
        }
        return this.field[position];
    }
    
    /** 获取所有战场卡牌 */
    public getAllFieldCards(): CardData[] {
        return this.field.filter(card => card !== null) as CardData[];
    }
    
    /** 获取战场空位 */
    public getEmptyFieldPositions(): number[] {
        const positions: number[] = [];
        for (let i = 0; i < this.MAX_FIELD_SIZE; i++) {
            if (this.field[i] === null) {
                positions.push(i);
            }
        }
        return positions;
    }
    
    /** 添加护盾 */
    public addShield(cardInstanceId: string, amount: number): void {
        const card = this.field.find(c => c && c.instanceId === cardInstanceId);
        if (card) {
            card.addShield(amount);
        }
    }
    
    /** 造成伤害 */
    public takeDamage(damage: number): number {
        this.hp = Math.max(0, this.hp - damage);
        return damage;
    }
    
    /** 治疗 */
    public heal(amount: number): void {
        this.hp = Math.min(this.maxHp, this.hp + amount);
    }
    
    /** 重置回合状态（抽牌阶段） */
    public resetForNewTurn(): void {
        // 增加水晶上限
        if (this.maxMana < 10) {
            this.maxMana++;
        }
        
        // 恢复水晶
        this.mana = this.maxMana;
        
        // 重置战场卡牌的回合状态
        for (const card of this.field) {
            if (card) {
                card.resetTurnState();
            }
        }
    }
    
    /** 回合结束处理 */
    public endTurn(unusedMana: number): void {
        // 未使用的水晶转化为能量（50%）
        const energyGained = Math.floor(unusedMana * 0.5);
        this.energy = Math.min(this.MAX_ENERGY, this.energy + energyGained);
    }
    
    /** 检查是否死亡 */
    public isDead(): boolean {
        return this.hp <= 0;
    }
    
    /** 获取战场卡牌数量 */
    public getFieldCardCount(): number {
        return this.field.filter(card => card !== null).length;
    }
    
    /** 获取牌堆剩余数量 */
    public getDeckCount(): number {
        return this.deck.length;
    }
    
    /** 重置所有状态 */
    public reset(): void {
        this.hp = this.INITIAL_HP;
        this.maxHp = this.INITIAL_HP;
        this.mana = this.INITIAL_MANA;
        this.maxMana = this.INITIAL_MANA;
        this.energy = 0;
        this.hand = [];
        this.field = new Array(this.MAX_FIELD_SIZE).fill(null);
        this.deck = [];
        this.graveyard = [];
    }
    
    /** 复制状态（用于回放等） */
    public clone(): PlayerState {
        const cloned = new PlayerState(this.name);
        cloned.hp = this.hp;
        cloned.maxHp = this.maxHp;
        cloned.mana = this.mana;
        cloned.maxMana = this.maxMana;
        cloned.energy = this.energy;
        cloned.hand = this.hand.map(card => card.clone());
        cloned.field = this.field.map(card => card ? card.clone() : null);
        cloned.deck = this.deck.map(card => card.clone());
        cloned.graveyard = this.graveyard.map(card => card.clone());
        return cloned;
    }
}
