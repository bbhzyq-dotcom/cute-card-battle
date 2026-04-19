/**
 * 游戏主入口 - 初始化和管理游戏核心
 */

import { BattleManager } from '../Core/BattleManager';
import { CardData } from '../Core/CardData';
import { PlayerState } from '../Core/PlayerState';
import { AIController } from '../AI/AIController';
import { ComboSystem } from '../Utils/ComboSystem';
import { SaveManager, DeckData } from '../Data/SaveManager';
import { CARD_CONFIGS, CardConfig } from '../Data/CardConfigs';
import { Difficulty } from '../Core/Types';
import { GameConfig } from '../Config/GameConfig';

/** 事件类型 */
export enum GameEventType {
    BattleStart = 'battleStart',
    BattleEnd = 'battleEnd',
    TurnChanged = 'turnChanged',
    CardPlayed = 'cardPlayed',
    CardAttacked = 'cardAttacked',
    PlayerDamaged = 'playerDamaged',
    PlayerHealed = 'playerHealed',
    ManaChanged = 'manaChanged',
    EnergyChanged = 'energyChanged',
    DeckChanged = 'deckChanged',
    CardCollected = 'cardCollected'
}

/** 游戏事件回调 */
export type GameEventCallback = (event: GameEvent) => void;

/** 游戏事件 */
export interface GameEvent {
    type: GameEventType;
    data: any;
}

/** 游戏主类 */
export class Game {
    /** 单例实例 */
    private static instance: Game;
    
    /** 存档管理器 */
    public saveManager: SaveManager;
    
    /** 战斗管理器 */
    public battleManager: BattleManager;
    
    /** AI控制器 */
    public aiController: AIController;
    
    /** 连携系统 */
    public comboSystem: ComboSystem;
    
    /** 事件监听器 */
    private eventListeners: Map<GameEventType, GameEventCallback[]>;
    
    /** 构造函数 */
    private constructor() {
        this.saveManager = SaveManager.getInstance();
        this.battleManager = new BattleManager();
        this.aiController = new AIController(Difficulty.Normal);
        this.comboSystem = new ComboSystem();
        this.eventListeners = new Map();
    }
    
    /** 获取单例 */
    public static getInstance(): Game {
        if (!Game.instance) {
            Game.instance = new Game();
        }
        return Game.instance;
    }
    
    /** 初始化游戏 */
    public init(): void {
        // 加载存档
        this.saveManager.loadGame();
        
        console.log('游戏初始化完成');
        console.log(`玩家等级: ${this.saveManager.getPlayerLevel()}`);
        console.log(`金币: ${this.saveManager.getCoins()}`);
        console.log(`拥有卡牌: ${this.saveManager.getOwnedCards().length}`);
    }
    
    // ==================== 事件系统 ====================
    
    /** 注册事件监听 */
    public on(event: GameEventType, callback: GameEventCallback): void {
        const listeners = this.eventListeners.get(event) || [];
        listeners.push(callback);
        this.eventListeners.set(event, listeners);
    }
    
    /** 移除事件监听 */
    public off(event: GameEventType, callback: GameEventCallback): void {
        const listeners = this.eventListeners.get(event) || [];
        const index = listeners.indexOf(callback);
        if (index !== -1) {
            listeners.splice(index, 1);
        }
    }
    
    /** 触发事件 */
    private emit(event: GameEventType, data?: any): void {
        const listeners = this.eventListeners.get(event) || [];
        const gameEvent: GameEvent = { type: event, data };
        listeners.forEach(callback => callback(gameEvent));
    }
    
    // ==================== 战斗系统 ====================
    
    /** 开始战斗 */
    public startBattle(enemyDifficulty: Difficulty = Difficulty.Normal): void {
        // 获取当前套牌
        const currentDeck = this.saveManager.getCurrentDeck();
        if (!currentDeck) {
            console.error('没有选择套牌');
            return;
        }
        
        // 构建玩家卡牌实例
        const playerCards = this.buildDeckFromDeckData(currentDeck);
        const enemyCards = this.buildEnemyDeck(enemyDifficulty);
        
        // 初始化战斗
        this.battleManager.initBattle(playerCards, enemyCards);
        
        // 设置AI状态引用
        this.aiController.setPlayerStates(this.battleManager.enemy, this.battleManager.player);
        this.aiController.setDifficulty(enemyDifficulty);
        
        // 检测连携
        this.comboSystem.checkActiveCombos(playerCards);
        
        this.emit(GameEventType.BattleStart, {
            difficulty: enemyDifficulty,
            deck: currentDeck
        });
    }
    
    /** 从套牌数据构建卡牌实例 */
    private buildDeckFromDeckData(deckData: DeckData): CardData[] {
        const cards: CardData[] = [];
        
        for (const baseId of deckData.cardIds) {
            const config = CARD_CONFIGS.find(c => c.baseId === baseId);
            if (config) {
                const ownedCard = this.saveManager.getOwnedCards().find(c => c.baseId === baseId);
                const card = this.createCardFromConfig(config, ownedCard?.level || 1, ownedCard?.breakthrough || 0);
                cards.push(card);
            }
        }
        
        return cards;
    }
    
    /** 构建AI套牌 */
    private buildEnemyDeck(difficulty: Difficulty): CardData[] {
        const cards: CardData[] = [];
        
        // 根据难度选择卡牌池
        const availableCards = CARD_CONFIGS.filter(c => {
            if (difficulty <= Difficulty.Easy) {
                return c.rarity === 'normal' || c.rarity === 'rare';
            } else if (difficulty <= Difficulty.Hard) {
                return c.rarity !== 'legend';
            } else {
                return true;
            }
        });
        
        // 随机选择12张卡牌
        const shuffled = [...availableCards].sort(() => Math.random() - 0.5);
        const selected = shuffled.slice(0, GameConfig.DECK_RECOMMENDED_SIZE);
        
        for (const config of selected) {
            const card = this.createCardFromConfig(config, 1, 0);
            cards.push(card);
        }
        
        return cards;
    }
    
    /** 从配置创建卡牌实例 */
    private createCardFromConfig(config: CardConfig, level: number, breakthrough: number): CardData {
        return new CardData(
            config.baseId,
            config.name,
            config.element,
            config.role,
            config.rarity,
            config.cost,
            config.attack,
            config.health,
            config.skillId,
            level,
            breakthrough
        );
    }
    
    /** 玩家出牌 */
    public playerPlayCard(cardInstanceId: string, position: number): { success: boolean; message: string } {
        const result = this.battleManager.playCard(cardInstanceId, position, true);
        
        if (result.success) {
            this.emit(GameEventType.CardPlayed, {
                cardInstanceId,
                position,
                isPlayer: true
            });
        }
        
        return result;
    }
    
    /** 玩家攻击 */
    public playerAttack(attackerInstanceId: string, defenderInstanceId: string): void {
        const result = this.battleManager.attack(attackerInstanceId, defenderInstanceId);
        
        this.emit(GameEventType.CardAttacked, {
            attackerId: attackerInstanceId,
            defenderId: defenderInstanceId,
            result
        });
    }
    
    /** 玩家攻击敌方玩家主基地 */
    public playerAttackEnemyBase(attackerInstanceId: string): void {
        const damage = this.battleManager.attackPlayer(attackerInstanceId, true);
        
        if (damage > 0) {
            this.emit(GameEventType.PlayerDamaged, {
                isPlayer: false,
                damage
            });
        }
    }
    
    /** 玩家结束回合 */
    public playerEndTurn(): void {
        this.battleManager.endTurn();
        
        this.emit(GameEventType.TurnChanged, {
            isPlayerTurn: this.battleManager.isPlayerTurn,
            turn: this.battleManager.turn
        });
    }
    
    /** AI执行回合 */
    public async executeAITurn(): Promise<void> {
        await this.aiController.takeTurn(this.battleManager);
        
        this.emit(GameEventType.TurnChanged, {
            isPlayerTurn: this.battleManager.isPlayerTurn,
            turn: this.battleManager.turn
        });
        
        // 检查战斗是否结束
        if (this.battleManager.battleEnded) {
            this.onBattleEnd();
        }
    }
    
    /** 战斗结束处理 */
    private onBattleEnd(): void {
        const result = this.battleManager.result;
        
        if (result) {
            // 发放奖励
            if (result.winner === 'player') {
                // 胜利奖励
                this.saveManager.addCoins(GameConfig.LEAGUE_WIN_POINTS + 
                    (this.battleManager.playerWinStreak > 1 ? GameConfig.LEAGUE_WIN_STREAK_BONUS : 0));
                this.saveManager.addLeaguePoints(GameConfig.LEAGUE_WIN_POINTS);
                this.saveManager.addExp(50);
            } else {
                // 失败奖励
                this.saveManager.removeLeaguePoints(GameConfig.LEAGUE_LOSE_POINTS);
                this.saveManager.addExp(10);
            }
            
            // 随机掉落卡牌
            if (Math.random() < 0.5) {
                const randomCard = this.getRandomDropCard();
                if (randomCard) {
                    this.saveManager.addCard(randomCard.baseId, 1);
                    this.emit(GameEventType.CardCollected, { card: randomCard });
                }
            }
        }
        
        this.emit(GameEventType.BattleEnd, { result });
    }
    
    /** 获取随机掉落卡牌 */
    private getRandomDropCard(): CardConfig | null {
        const rand = Math.random();
        let rarity: string = 'normal';
        
        if (rand < 0.05) rarity = 'legend';
        else if (rand < 0.20) rarity = 'epic';
        else if (rand < 0.50) rarity = 'rare';
        
        const cardsOfRarity = CARD_CONFIGS.filter(c => c.rarity === rarity);
        if (cardsOfRarity.length === 0) return null;
        
        return cardsOfRarity[Math.floor(Math.random() * cardsOfRarity.length)];
    }
    
    // ==================== 套牌管理 ====================
    
    /** 验证套牌是否有效 */
    public validateDeck(cardIds: string[]): { valid: boolean; errors: string[] } {
        const errors: string[] = [];
        
        // 检查数量
        if (cardIds.length !== GameConfig.DECK_RECOMMENDED_SIZE) {
            errors.push(`套牌需要${GameConfig.DECK_RECOMMENDED_SIZE}张卡牌`);
        }
        
        // 检查水晶费用曲线
        const costs = cardIds.map(id => {
            const config = CARD_CONFIGS.find(c => c.baseId === id);
            return config ? config.cost : 0;
        });
        
        const lowCostCount = costs.filter(c => c <= 3).length;
        if (lowCostCount < GameConfig.MIN_LOW_COST_CARDS) {
            errors.push(`低费卡牌（1-3费）至少需要${GameConfig.MIN_LOW_COST_CARDS}张`);
        }
        
        const maxCost = Math.max(...costs);
        if (maxCost > GameConfig.MAX_CARD_COST) {
            errors.push(`最高费用不能超过${GameConfig.MAX_CARD_COST}费`);
        }
        
        // 检查玩家是否拥有这些卡牌
        for (const baseId of cardIds) {
            if (!this.saveManager.hasCard(baseId)) {
                errors.push(`没有拥有卡牌: ${baseId}`);
            }
        }
        
        return {
            valid: errors.length === 0,
            errors
        };
    }
    
    /** 获取当前战斗状态 */
    public getBattleState(): any {
        return this.battleManager.getBattleState();
    }
    
    /** 获取玩家状态 */
    public getPlayerState(): any {
        return {
            hp: this.battleManager.player.hp,
            mana: this.battleManager.player.mana,
            maxMana: this.battleManager.player.maxMana,
            energy: this.battleManager.player.energy,
            hand: this.battleManager.player.hand.map(c => c.instanceId),
            field: this.battleManager.player.field.map(c => c?.instanceId || null)
        };
    }
    
    /** 获取敌方状态 */
    public getEnemyState(): any {
        return {
            hp: this.battleManager.enemy.hp,
            mana: this.battleManager.enemy.mana,
            maxMana: this.battleManager.enemy.maxMana,
            energy: this.battleManager.enemy.energy,
            handCount: this.battleManager.enemy.hand.length,
            field: this.battleManager.enemy.field.map(c => c?.instanceId || null)
        };
    }
}

// 导出游戏实例获取函数
export function getGame(): Game {
    return Game.getInstance();
}
