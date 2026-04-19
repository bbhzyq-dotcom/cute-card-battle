/**
 * 战斗管理器 - 核心战斗逻辑
 */

import { CardData } from './CardData';
import { PlayerState } from './PlayerState';
import { ElementType, TurnPhase, SkillTrigger, getElementMultiplier } from './Types';
import { SkillData, SkillTargetType } from './SkillData';
import { GameConfig } from '../Config/GameConfig';

/** 战斗事件类型 */
export enum BattleEventType {
    TurnStart = 'turnStart',
    TurnEnd = 'turnEnd',
    CardPlayed = 'cardPlayed',
    CardAttacked = 'cardAttacked',
    CardDamaged = 'cardDamaged',
    CardDied = 'cardDied',
    EnergyChanged = 'energyChanged',
    ManaChanged = 'manaChanged',
    PlayerDamaged = 'playerDamaged',
    PlayerHealed = 'playerHealed',
    SkillTriggered = 'skillTriggered',
    BattleEnd = 'battleEnd'
}

/** 战斗事件数据 */
export interface BattleEvent {
    type: BattleEventType;
    data: any;
    timestamp: number;
}

/** 战斗结果 */
export interface BattleResult {
    winner: 'player' | 'enemy' | 'draw';
    turns: number;
    playerHpRemaining: number;
    enemyHpRemaining: number;
}

/** 攻击结果 */
export interface AttackResult {
    damage: number;
    actualDamage: number;
    attackerKilled: boolean;
    defenderKilled: boolean;
    isCounterAttack: boolean;
    counterDamage: number;
    elementEffective: boolean;
}

/** 战斗管理器 */
export class BattleManager {
    /** 玩家状态 */
    public player: PlayerState;
    
    /** 敌方状态 */
    public enemy: PlayerState;
    
    /** 当前回合数 */
    public turn: number;
    
    /** 是否为玩家回合 */
    public isPlayerTurn: boolean;
    
    /** 当前回合阶段 */
    public turnPhase: TurnPhase;
    
    /** 是否先手（玩家先手为true） */
    public isPlayerFirst: boolean;
    
    /** 战斗是否结束 */
    public battleEnded: boolean;
    
    /** 战斗结果 */
    public result: BattleResult | null;
    
    /** 战斗日志 */
    public battleLog: BattleEvent[];
    
    /** 连胜记录 */
    public playerWinStreak: number;
    public enemyWinStreak: number;
    
    /** 构造函数 */
    constructor() {
        this.player = new PlayerState('玩家');
        this.enemy = new PlayerState('AI对手');
        this.turn = 0;
        this.isPlayerTurn = true;
        this.turnPhase = TurnPhase.DrawPhase;
        this.isPlayerFirst = true;
        this.battleEnded = false;
        this.result = null;
        this.battleLog = [];
        this.playerWinStreak = 0;
        this.enemyWinStreak = 0;
    }
    
    /** 初始化战斗 */
    public initBattle(playerDeck: CardData[], enemyDeck: CardData[]): void {
        // 重置状态
        this.player.reset();
        this.enemy.reset();
        this.turn = 0;
        this.battleEnded = false;
        this.result = null;
        this.battleLog = [];
        
        // 初始化套牌
        this.player.initDeck(playerDeck);
        this.enemy.initDeck(enemyDeck);
        
        // 随机决定先手
        this.isPlayerFirst = Math.random() < 0.5;
        this.isPlayerTurn = this.isPlayerFirst;
        
        // 设置初始水晶
        if (this.isPlayerFirst) {
            this.player.mana = GameConfig.FIRST_PLAYER_INITIAL_MANA;
            this.player.maxMana = GameConfig.FIRST_PLAYER_INITIAL_MANA;
            this.enemy.mana = GameConfig.SECOND_PLAYER_INITIAL_MANA;
            this.enemy.maxMana = GameConfig.SECOND_PLAYER_INITIAL_MANA;
            this.enemy.energy = GameConfig.SECOND_PLAYER_INITIAL_ENERGY;
        } else {
            this.enemy.mana = GameConfig.FIRST_PLAYER_INITIAL_MANA;
            this.enemy.maxMana = GameConfig.FIRST_PLAYER_INITIAL_MANA;
            this.player.mana = GameConfig.SECOND_PLAYER_INITIAL_MANA;
            this.player.maxMana = GameConfig.SECOND_PLAYER_INITIAL_MANA;
            this.player.energy = GameConfig.SECOND_PLAYER_INITIAL_ENERGY;
        }
        
        // 初始抽牌
        this.player.drawCards(GameConfig.INITIAL_HAND_SIZE);
        this.enemy.drawCards(GameConfig.INITIAL_HAND_SIZE);
        
        // 记录战斗开始
        this.logEvent(BattleEventType.TurnStart, { isPlayerTurn: this.isPlayerTurn, turn: this.turn });
    }
    
    /** 开始回合 */
    public startTurn(): void {
        this.turn++;
        this.isPlayerTurn = !this.isPlayerTurn;
        this.turnPhase = TurnPhase.DrawPhase;
        
        const currentPlayer = this.isPlayerTurn ? this.player : this.enemy;
        
        // 重置玩家状态
        currentPlayer.resetForNewTurn();
        
        // 抽牌
        currentPlayer.drawCards(GameConfig.CARDS_DRAW_PER_TURN);
        
        // 触发回合开始技能
        this.triggerSkillsForCondition(SkillTrigger.OnTurnStart, currentPlayer);
        
        this.logEvent(BattleEventType.TurnStart, { 
            isPlayerTurn: this.isPlayerTurn, 
            turn: this.turn,
            mana: currentPlayer.mana,
            energy: currentPlayer.energy
        });
        
        this.turnPhase = TurnPhase.MainPhase;
    }
    
    /** 出牌 */
    public playCard(cardInstanceId: string, position: number, isPlayer: boolean): { success: boolean; message: string } {
        const currentPlayer = isPlayer ? this.player : this.enemy;
        const opponent = isPlayer ? this.enemy : this.player;
        
        // 验证出牌阶段
        if (this.turnPhase !== TurnPhase.MainPhase) {
            return { success: false, message: '当前不能出牌' };
        }
        
        // 获取手牌
        const card = currentPlayer.getHandCard(cardInstanceId);
        if (!card) {
            return { success: false, message: '手牌中没有这张卡' };
        }
        
        // 检查水晶是否足够
        if (currentPlayer.mana < card.cost) {
            return { success: false, message: `水晶不足，需要${card.cost}点` };
        }
        
        // 检查位置是否有效
        if (position < 0 || position >= GameConfig.PLAYER_FIELD_SIZE) {
            return { success: false, message: '位置无效' };
        }
        
        // 检查位置是否为空
        if (currentPlayer.field[position] !== null) {
            return { success: false, message: '该位置已有卡牌' };
        }
        
        // 扣除水晶
        currentPlayer.mana -= card.cost;
        
        // 出牌到战场
        currentPlayer.playCardToField(cardInstanceId, position);
        
        // 触发登场技能
        this.triggerSkill(card, SkillTrigger.OnPlay, currentPlayer, opponent);
        
        this.logEvent(BattleEventType.CardPlayed, {
            card: card,
            position: position,
            isPlayer: isPlayer,
            remainingMana: currentPlayer.mana
        });
        
        return { success: true, message: '出牌成功' };
    }
    
    /** 执行攻击 */
    public attack(attackerInstanceId: string, defenderInstanceId: string): AttackResult {
        // 查找攻击者和防御者
        const attacker = this.findCardOnField(attackerInstanceId);
        const defender = this.findCardOnField(defenderInstanceId);
        
        if (!attacker || !defender) {
            return {
                damage: 0,
                actualDamage: 0,
                attackerKilled: false,
                defenderKilled: false,
                isCounterAttack: false,
                counterDamage: 0,
                elementEffective: false
            };
        }
        
        // 验证攻击条件
        if (!attacker.canAttack()) {
            return {
                damage: 0,
                actualDamage: 0,
                attackerKilled: false,
                defenderKilled: false,
                isCounterAttack: false,
                counterDamage: 0,
                elementEffective: false
            };
        }
        
        // 计算属性克制
        const elementMultiplier = getElementMultiplier(attacker.element, defender.element);
        const isElementEffective = elementMultiplier > 1.0;
        
        // 计算伤害
        let damage = attacker.getDisplayAttack();
        let actualDamage = Math.floor(damage * elementMultiplier);
        
        // 应用防御方护盾
        let remainingDamage = actualDamage;
        if (defender.shield > 0) {
            const shieldDamage = Math.min(defender.shield, remainingDamage);
            defender.shield -= shieldDamage;
            remainingDamage -= shieldDamage;
        }
        
        // 扣血
        defender.health -= remainingDamage;
        const defenderKilled = defender.health <= 0;
        
        // 标记攻击者已攻击
        attacker.hasAttacked = true;
        
        // 检查攻击者是否被反伤致死
        let attackerKilled = false;
        let counterDamage = 0;
        let isCounterAttack = false;
        
        // 触发攻击时技能（攻击者）
        this.triggerSkill(attacker, SkillTrigger.OnAttack, 
            this.isCardOwnedByPlayer(attacker) ? this.player : this.enemy,
            this.isCardOwnedByPlayer(defender) ? this.player : this.enemy);
        
        this.logEvent(BattleEventType.CardAttacked, {
            attacker: attacker,
            defender: defender,
            damage: actualDamage,
            elementEffective: isElementEffective
        });
        
        // 如果防御者死亡，移至墓地
        if (defenderKilled) {
            this.removeCardToGraveyard(defender);
        }
        
        return {
            damage: actualDamage,
            actualDamage: actualDamage,
            attackerKilled: attackerKilled,
            defenderKilled: defenderKilled,
            isCounterAttack: isCounterAttack,
            counterDamage: counterDamage,
            elementEffective: isElementEffective
        };
    }
    
    /** 攻击玩家主基地 */
    public attackPlayer(attackerInstanceId: string, isPlayerAttacking: boolean): number {
        const attacker = this.findCardOnField(attackerInstanceId);
        if (!attacker || !attacker.canAttack()) {
            return 0;
        }
        
        const targetPlayer = isPlayerAttacking ? this.enemy : this.player;
        const damage = attacker.getDisplayAttack();
        
        targetPlayer.takeDamage(damage);
        attacker.hasAttacked = true;
        
        this.logEvent(BattleEventType.PlayerDamaged, {
            attacker: attacker,
            damage: damage,
            isPlayerAttacking: isPlayerAttacking,
            targetHpRemaining: targetPlayer.hp
        });
        
        // 检查胜负
        this.checkWinCondition();
        
        return damage;
    }
    
    /** 结束回合 */
    public endTurn(): void {
        if (this.turnPhase !== TurnPhase.MainPhase && this.turnPhase !== TurnPhase.BattlePhase) {
            return;
        }
        
        const currentPlayer = this.isPlayerTurn ? this.player : this.enemy;
        const opponent = this.isPlayerTurn ? this.enemy : this.player;
        
        // 触发回合结束技能
        this.triggerSkillsForCondition(SkillTrigger.OnTurnEnd, currentPlayer);
        
        // 未使用的水晶转化为能量
        const unusedMana = currentPlayer.mana;
        currentPlayer.endTurn(unusedMana);
        
        this.logEvent(BattleEventType.TurnEnd, {
            isPlayerTurn: this.isPlayerTurn,
            unusedMana: unusedMana,
            energyGained: Math.floor(unusedMana * 0.5),
            totalEnergy: currentPlayer.energy
        });
        
        this.turnPhase = TurnPhase.EndPhase;
        
        // 检查胜负
        if (this.checkWinCondition()) {
            return;
        }
        
        // 开始下一回合
        this.startTurn();
    }
    
    /** 检查胜负条件 */
    public checkWinCondition(): boolean {
        if (this.battleEnded) {
            return true;
        }
        
        if (this.player.hp <= 0) {
            this.battleEnded = true;
            this.result = {
                winner: 'enemy',
                turns: this.turn,
                playerHpRemaining: Math.max(0, this.player.hp),
                enemyHpRemaining: this.enemy.hp
            };
            this.enemyWinStreak++;
            this.playerWinStreak = 0;
            this.logEvent(BattleEventType.BattleEnd, { winner: 'enemy', result: this.result });
            return true;
        }
        
        if (this.enemy.hp <= 0) {
            this.battleEnded = true;
            this.result = {
                winner: 'player',
                turns: this.turn,
                playerHpRemaining: this.player.hp,
                enemyHpRemaining: Math.max(0, this.enemy.hp)
            };
            this.playerWinStreak++;
            this.enemyWinStreak = 0;
            this.logEvent(BattleEventType.BattleEnd, { winner: 'player', result: this.result });
            return true;
        }
        
        return false;
    }
    
    /** 释放能量技能 */
    public releaseEnergySkill(cardInstanceId: string): { success: boolean; message: string } {
        const currentPlayer = this.isPlayerTurn ? this.player : this.enemy;
        const opponent = this.isPlayerTurn ? this.enemy : this.player;
        
        const card = currentPlayer.getHandCard(cardInstanceId);
        if (!card) {
            return { success: false, message: '手牌中没有这张卡' };
        }
        
        const skill = card.getSkill();
        if (!skill || !skill.isActive) {
            return { success: false, message: '这张卡没有能量技能' };
        }
        
        if (currentPlayer.energy < skill.energyCost) {
            return { success: false, message: `能量不足，需要${skill.energyCost}点` };
        }
        
        // 消耗能量
        currentPlayer.energy -= skill.energyCost;
        
        // 执行技能效果
        this.executeSkillEffect(skill, card, currentPlayer, opponent);
        
        // 从手牌移除并进入墓地（消耗）
        currentPlayer.removeCardFromHand(cardInstanceId);
        currentPlayer.graveyard.push(card);
        
        this.logEvent(BattleEventType.SkillTriggered, {
            card: card,
            skill: skill,
            isPlayer: this.isPlayerTurn
        });
        
        return { success: true, message: '技能释放成功' };
    }
    
    /** 执行技能效果 */
    private executeSkillEffect(skill: SkillData, card: CardData, owner: PlayerState, opponent: PlayerState): void {
        switch (skill.type) {
            case 'damage':
                this.executeDamageSkill(skill, card, owner, opponent);
                break;
            case 'heal':
                this.executeHealSkill(skill, card, owner);
                break;
            case 'shield':
                this.executeShieldSkill(skill, card, owner);
                break;
            case 'buff':
                this.executeBuffSkill(skill, card, owner);
                break;
            case 'debuff':
                this.executeDebuffSkill(skill, card, opponent);
                break;
        }
    }
    
    /** 执行伤害技能 */
    private executeDamageSkill(skill: SkillData, card: CardData, owner: PlayerState, opponent: PlayerState): void {
        let targets: CardData[] = [];
        
        switch (skill.target) {
            case SkillTargetType.SingleEnemy:
                // 优先选择低血量目标
                targets = opponent.getAllFieldCards().sort((a, b) => a.health - b.health).slice(0, 1);
                break;
            case SkillTargetType.AllEnemies:
                targets = opponent.getAllFieldCards();
                break;
            case SkillTargetType.HighestAttackEnemy:
                targets = opponent.getAllFieldCards().sort((a, b) => b.attack - a.attack).slice(0, 1);
                break;
        }
        
        for (const target of targets) {
            const elementMultiplier = getElementMultiplier(card.element, target.element);
            const damage = Math.floor(skill.value * elementMultiplier);
            target.takeDamage(damage);
            
            if (target.health <= 0) {
                this.removeCardToGraveyard(target);
            }
        }
    }
    
    /** 执行治疗技能 */
    private executeHealSkill(skill: SkillData, card: CardData, owner: PlayerState): void {
        let targets: CardData[] = [];
        
        switch (skill.target) {
            case SkillTargetType.LowestHpAlly:
                targets = owner.getAllFieldCards().sort((a, b) => a.health - b.health).slice(0, 1);
                break;
            case SkillTargetType.AllAllies:
                targets = owner.getAllFieldCards();
                break;
            case SkillTargetType.Self:
                targets = [card];
                break;
        }
        
        for (const target of targets) {
            target.heal(skill.value);
        }
    }
    
    /** 执行护盾技能 */
    private executeShieldSkill(skill: SkillData, card: CardData, owner: PlayerState): void {
        let targets: CardData[] = [];
        
        switch (skill.target) {
            case SkillTargetType.LowestHpAlly:
                targets = owner.getAllFieldCards().sort((a, b) => a.health - b.health).slice(0, 1);
                break;
            case SkillTargetType.AllAllies:
                targets = owner.getAllFieldCards();
                break;
            case SkillTargetType.Self:
                targets = [card];
                break;
        }
        
        for (const target of targets) {
            target.addShield(skill.value);
        }
    }
    
    /** 执行增益技能 */
    private executeBuffSkill(skill: SkillData, card: CardData, owner: PlayerState): void {
        const targets = owner.getAllFieldCards();
        for (const target of targets) {
            target.attack += skill.value;
        }
    }
    
    /** 执行减益技能 */
    private executeDebuffSkill(skill: SkillData, card: CardData, opponent: PlayerState): void {
        let targets: CardData[] = [];
        
        switch (skill.target) {
            case SkillTargetType.SingleEnemy:
                targets = opponent.getAllFieldCards().sort((a, b) => a.health - b.health).slice(0, 1);
                break;
            case SkillTargetType.AllEnemies:
                targets = opponent.getAllFieldCards();
                break;
        }
        
        for (const target of targets) {
            if (skill.value > 0) {
                target.attackReduction += skill.value;
            }
            if (skill.trigger === SkillTrigger.OnAttack) {
                target.setSleep(skill.value);
            }
        }
    }
    
    /** 触发条件技能 */
    private triggerSkillsForCondition(trigger: SkillTrigger, player: PlayerState): void {
        for (const card of player.getAllFieldCards()) {
            const skill = card.getSkill();
            if (skill && skill.trigger === trigger) {
                const opponent = (player === this.player) ? this.enemy : this.player;
                this.triggerSkill(card, trigger, player, opponent);
            }
        }
    }
    
    /** 触发单个技能 */
    private triggerSkill(card: CardData, trigger: SkillTrigger, owner: PlayerState, opponent: PlayerState): void {
        const skill = card.getSkill();
        if (!skill || skill.trigger !== trigger) {
            return;
        }
        
        // 非能量技能在满足条件时自动触发
        if (!skill.isActive) {
            this.executeSkillEffect(skill, card, owner, opponent);
        }
    }
    
    /** 获取可攻击目标 */
    public getValidAttackTargets(attackerInstanceId: string): string[] {
        const attacker = this.findCardOnField(attackerInstanceId);
        if (!attacker || !attacker.canAttack()) {
            return [];
        }
        
        const opponent = this.isCardOwnedByPlayer(attacker) ? this.enemy : this.player;
        return opponent.getAllFieldCards()
            .filter(card => card !== null)
            .map(card => card.instanceId);
    }
    
    /** 获取可放置位置 */
    public getValidPlayPositions(isPlayer: boolean): number[] {
        const player = isPlayer ? this.player : this.enemy;
        return player.getEmptyFieldPositions();
    }
    
    /** 查找战场上的卡牌 */
    public findCardOnField(instanceId: string): CardData | null {
        // 先在玩家战场查找
        for (const card of this.player.field) {
            if (card && card.instanceId === instanceId) {
                return card;
            }
        }
        
        // 在敌方战场查找
        for (const card of this.enemy.field) {
            if (card && card.instanceId === instanceId) {
                return card;
            }
        }
        
        return null;
    }
    
    /** 检查卡牌是否属于玩家 */
    public isCardOwnedByPlayer(card: CardData): boolean {
        return this.player.field.some(c => c && c.instanceId === card.instanceId);
    }
    
    /** 移除卡牌到墓地 */
    private removeCardToGraveyard(card: CardData): void {
        // 从玩家战场移除
        for (let i = 0; i < this.player.field.length; i++) {
            if (this.player.field[i] && this.player.field[i].instanceId === card.instanceId) {
                this.player.field[i] = null;
                this.player.graveyard.push(card);
                return;
            }
        }
        
        // 从敌方战场移除
        for (let i = 0; i < this.enemy.field.length; i++) {
            if (this.enemy.field[i] && this.enemy.field[i].instanceId === card.instanceId) {
                this.enemy.field[i] = null;
                this.enemy.graveyard.push(card);
                return;
            }
        }
    }
    
    /** 记录战斗日志 */
    private logEvent(type: BattleEventType, data: any): void {
        this.battleLog.push({
            type,
            data,
            timestamp: Date.now()
        });
    }
    
    /** 获取当前战斗状态快照 */
    public getBattleState(): any {
        return {
            turn: this.turn,
            isPlayerTurn: this.isPlayerTurn,
            turnPhase: this.turnPhase,
            player: {
                hp: this.player.hp,
                mana: this.player.mana,
                maxMana: this.player.maxMana,
                energy: this.player.energy,
                handCount: this.player.hand.length,
                fieldCount: this.player.getFieldCardCount(),
                deckCount: this.player.getDeckCount()
            },
            enemy: {
                hp: this.enemy.hp,
                mana: this.enemy.mana,
                maxMana: this.enemy.maxMana,
                energy: this.enemy.energy,
                handCount: this.enemy.hand.length,
                fieldCount: this.enemy.getFieldCardCount(),
                deckCount: this.enemy.getDeckCount()
            },
            battleEnded: this.battleEnded,
            result: this.result
        };
    }
}
