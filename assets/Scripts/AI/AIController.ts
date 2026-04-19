/**
 * AI控制器 - 实现AI对战逻辑
 */

import { CardData } from '../Core/CardData';
import { PlayerState } from '../Core/PlayerState';
import { BattleManager } from '../Core/BattleManager';
import { Difficulty, DIFFICULTY_PARAMS, RoleType, getElementMultiplier } from '../Core/Types';
import { GameConfig } from '../Config/GameConfig';

/** AI决策 */
interface AIDecision {
    type: 'play' | 'attack' | 'end';
    cardInstanceId?: string;
    position?: number;
    targetInstanceId?: string;
    score: number;
}

/** AI控制器 */
export class AIController {
    /** 难度等级 */
    private difficulty: Difficulty;
    
    /** AI控制的玩家状态 */
    private aiPlayer: PlayerState;
    
    /** 对手状态 */
    private opponent: PlayerState;
    
    /** 思考延迟（毫秒） */
    private thinkDelay: number;
    
    /** 套牌强度倍率 */
    private strengthMultiplier: number;
    
    /** 构造函数 */
    constructor(difficulty: Difficulty = Difficulty.Normal) {
        this.difficulty = difficulty;
        const params = DIFFICULTY_PARAMS[difficulty];
        this.thinkDelay = params.thinkDelay;
        this.strengthMultiplier = params.strength;
        this.aiPlayer = new PlayerState('AI');
        this.opponent = new PlayerState('对手');
    }
    
    /** 设置难度 */
    public setDifficulty(difficulty: Difficulty): void {
        this.difficulty = difficulty;
        const params = DIFFICULTY_PARAMS[difficulty];
        this.thinkDelay = params.thinkDelay;
        this.strengthMultiplier = params.strength;
    }
    
    /** 设置AI状态引用 */
    public setPlayerStates(aiPlayer: PlayerState, opponent: PlayerState): void {
        this.aiPlayer = aiPlayer;
        this.opponent = opponent;
    }
    
    /** 执行AI回合 */
    public async takeTurn(battleManager: BattleManager): Promise<void> {
        // 思考延迟
        await this.delay(this.thinkDelay * 1000);
        
        // 主要阶段：出牌
        await this.executePlayPhase(battleManager);
        
        // 等待出牌动画
        await this.delay(0.5);
        
        // 战斗阶段：攻击
        await this.executeAttackPhase(battleManager);
        
        // 等待攻击动画
        await this.delay(0.5);
        
        // 结束回合
        battleManager.endTurn();
    }
    
    /** 执行出牌阶段 */
    private async executePlayPhase(battleManager: BattleManager): Promise<void> {
        const maxPlays = this.difficulty === Difficulty.Beginner ? 1 : 3;
        let playCount = 0;
        
        while (playCount < maxPlays && battleManager.isPlayerTurn === false && !battleManager.battleEnded) {
            const decision = this.decidePlay();
            
            if (decision.type !== 'play' || !decision.cardInstanceId || decision.position === undefined) {
                break;
            }
            
            const result = battleManager.playCard(decision.cardInstanceId, decision.position, false);
            
            if (result.success) {
                playCount++;
                await this.delay(0.8);
            } else {
                break;
            }
        }
    }
    
    /** 执行攻击阶段 */
    private async executeAttackPhase(battleManager: BattleManager): Promise<void> {
        const attackers = this.aiPlayer.getAllFieldCards().filter(card => card.canAttack());
        
        for (const attacker of attackers) {
            if (battleManager.battleEnded) break;
            
            const targets = battleManager.getValidAttackTargets(attacker.instanceId);
            if (targets.length === 0) continue;
            
            const bestTarget = this.decideAttackTarget(attacker, targets, battleManager);
            if (bestTarget) {
                battleManager.attack(attacker.instanceId, bestTarget);
                await this.delay(0.6);
            }
        }
        
        // 攻击玩家主基地（如果战场没有可攻击目标）
        const remainingAttackers = this.aiPlayer.getAllFieldCards().filter(card => card.canAttack());
        for (const attacker of remainingAttackers) {
            if (battleManager.battleEnded) break;
            
            battleManager.attackPlayer(attacker.instanceId, false);
            await this.delay(0.4);
        }
    }
    
    /** 决定出牌 */
    private decidePlay(): AIDecision {
        // 获取所有可出的卡牌
        const playableCards = this.aiPlayer.hand
            .filter(card => card.canPlay(this.aiPlayer.mana))
            .map(card => ({
                card,
                score: this.evaluateCardValue(card)
            }))
            .sort((a, b) => b.score - a.score);
        
        if (playableCards.length === 0) {
            return { type: 'end', score: 0 };
        }
        
        // 入门难度随机出牌
        if (this.difficulty === Difficulty.Beginner) {
            const randomIndex = Math.floor(Math.random() * playableCards.length);
            const selected = playableCards[randomIndex];
            const position = this.findBestPosition(selected.card);
            
            return {
                type: 'play',
                cardInstanceId: selected.card.instanceId,
                position,
                score: selected.score
            };
        }
        
        // 其他难度出最优解（受难度影响）
        const selected = playableCards[0];
        const position = this.findBestPosition(selected.card);
        
        // 应用难度因素（低概率出错）
        if (this.difficulty === Difficulty.Easy && Math.random() > 0.8) {
            // 20%概率选择次优
            const alternatives = playableCards.slice(1);
            if (alternatives.length > 0) {
                const altIndex = Math.floor(Math.random() * alternatives.length);
                const alt = alternatives[altIndex];
                return {
                    type: 'play',
                    cardInstanceId: alt.card.instanceId,
                    position: this.findBestPosition(alt.card),
                    score: alt.score
                };
            }
        }
        
        return {
            type: 'play',
            cardInstanceId: selected.card.instanceId,
            position,
            score: selected.score
        };
    }
    
    /** 评估卡牌价值 */
    private evaluateCardValue(card: CardData): number {
        let value = 0;
        
        // 基础价值：攻击+生命
        value += card.getDisplayAttack() * 1.5;
        value += card.health * 1.0;
        
        // 费用效率
        value += (card.getDisplayAttack() + card.health) / card.cost * 2;
        
        // 定位价值
        switch (card.role) {
            case RoleType.Assassin:
                value += card.getDisplayAttack() * 0.5; // 刺客高攻击价值更高
                break;
            case RoleType.Tank:
                value += card.health * 0.3; // 坦克生命价值更高
                break;
            case RoleType.Mage:
                value += 2; // 法师技能价值
                break;
            case RoleType.Support:
                value += 1.5; // 辅助价值
                break;
            case RoleType.Warrior:
                value += 1; // 战士均衡价值
                break;
        }
        
        // 对敌方属性的克制价值
        for (const enemyCard of this.opponent.getAllFieldCards()) {
            const multiplier = getElementMultiplier(card.element, enemyCard.element);
            if (multiplier > 1) {
                value += 3; // 克制加成
            }
        }
        
        // 根据套牌强度调整
        value *= this.strengthMultiplier;
        
        return value;
    }
    
    /** 找到最佳出牌位置 */
    private findBestPosition(card: CardData): number {
        const emptyPositions = this.aiPlayer.getEmptyFieldPositions();
        if (emptyPositions.length === 0) return -1;
        
        // 刺客放前线
        if (card.role === RoleType.Assassin) {
            const frontPositions = emptyPositions.filter(p => p <= 2);
            if (frontPositions.length > 0) {
                return frontPositions[Math.floor(Math.random() * frontPositions.length)];
            }
        }
        
        // 坦克放前线
        if (card.role === RoleType.Tank) {
            const frontPositions = emptyPositions.filter(p => p <= 2);
            if (frontPositions.length > 0) {
                return frontPositions[Math.floor(Math.random() * frontPositions.length)];
            }
        }
        
        // 辅助和法师放后线
        if (card.role === RoleType.Support || card.role === RoleType.Mage) {
            const backPositions = emptyPositions.filter(p => p >= 3);
            if (backPositions.length > 0) {
                return backPositions[Math.floor(Math.random() * backPositions.length)];
            }
        }
        
        // 随机选择
        return emptyPositions[Math.floor(Math.random() * emptyPositions.length)];
    }
    
    /** 决定攻击目标 */
    private decideAttackTarget(attacker: CardData, targets: string[], battleManager: BattleManager): string | null {
        if (targets.length === 0) return null;
        
        // 入门难度随机攻击
        if (this.difficulty === Difficulty.Beginner) {
            return targets[Math.floor(Math.random() * targets.length)];
        }
        
        // 评估每个目标
        const targetEvaluations = targets.map(targetId => {
            const target = battleManager.findCardOnField(targetId);
            if (!target) return { id: targetId, score: -1 };
            
            return {
                id: targetId,
                score: this.evaluateTarget(target, attacker)
            };
        }).filter(t => t.score >= 0)
          .sort((a, b) => b.score - a.score);
        
        if (targetEvaluations.length === 0) return null;
        
        // 大师难度会选择最优，其他难度有小概率选择差的
        if (this.difficulty === Difficulty.Master || 
            (this.difficulty >= Difficulty.Normal && Math.random() < 0.8)) {
            return targetEvaluations[0].id;
        }
        
        // 低概率随机
        const randomIndex = Math.floor(Math.random() * Math.min(2, targetEvaluations.length));
        return targetEvaluations[randomIndex].id;
    }
    
    /** 评估目标价值 */
    private evaluateTarget(target: CardData, attacker: CardData): number {
        let score = 0;
        
        // 优先攻击低血量目标（更容易击杀）
        score += (10 - target.health) * 2;
        
        // 优先攻击高威胁目标
        if (target.role === RoleType.Assassin) {
            score += 5; // 刺客威胁高
        }
        if (target.role === RoleType.Mage) {
            score += 3; // 法师技能强
        }
        
        // 优先攻击可克制的目标
        const multiplier = getElementMultiplier(attacker.element, target.element);
        if (multiplier > 1) {
            score += 8; // 克制加成
        } else if (multiplier < 1) {
            score -= 4; // 被克惩罚
        }
        
        // 优先攻击能击杀的目标
        if (attacker.getDisplayAttack() >= target.health + target.shield) {
            score += 10; // 击杀奖励
        }
        
        return score;
    }
    
    /** 延迟函数 */
    private delay(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    /** 获取当前难度 */
    public getDifficulty(): Difficulty {
        return this.difficulty;
    }
}
