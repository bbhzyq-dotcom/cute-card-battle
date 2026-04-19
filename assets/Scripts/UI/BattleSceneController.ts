/**
 * 战斗场景控制器 - 管理战斗流程和UI协调
 */

import { Game, getGame } from '../Core/Game';
import { BattleManager, BattleEventType } from '../Core/BattleManager';
import { CardData } from '../Core/CardData';
import { Difficulty } from '../Core/Types';
import { HandView } from './HandView';
import { BattleFieldView } from './BattleFieldView';
import { BattleUIView } from './BattleUIView';
import { EffectManager } from '../Utils/EffectManager';

/** 战斗场景控制器 */
export class BattleSceneController {
    /** 单例实例 */
    private static instance: BattleSceneController;
    
    /** 游戏实例 */
    private game: Game | null = null;
    
    /** 战斗管理器 */
    private battleManager: BattleManager | null = null;
    
    /** 手牌视图 */
    private handView: HandView | null = null;
    
    /** 战场视图 */
    private battleFieldView: BattleFieldView | null = null;
    
    /** 战斗UI视图 */
    private battleUIView: BattleUIView | null = null;
    
    /** 特效管理器 */
    private effectManager: EffectManager | null = null;
    
    /** 是否是玩家回合 */
    private isPlayerTurn: boolean = false;
    
    /** 当前选中的卡牌 */
    private selectedCard: CardData | null = null;
    
    /** 选中的战场位置 */
    private selectedPosition: number = -1;
    
    /** 构造函数 */
    private constructor() {}
    
    /** 获取单例 */
    public static getInstance(): BattleSceneController {
        if (!BattleSceneController.instance) {
            BattleSceneController.instance = new BattleSceneController();
        }
        return BattleSceneController.instance;
    }
    
    /** 初始化 */
    public init(
        handView: HandView,
        battleFieldView: BattleFieldView,
        battleUIView: BattleUIView
    ): void {
        this.game = getGame();
        this.battleManager = this.game.battleManager;
        this.handView = handView;
        this.battleFieldView = battleFieldView;
        this.battleUIView = battleUIView;
        this.effectManager = EffectManager.getInstance();
        
        this.setupEventListeners();
        this.setupUICallbacks();
    }
    
    /** 设置事件监听 */
    private setupEventListeners(): void {
        if (!this.game) return;
        
        this.game.on(BattleEventType.TurnStart, (event) => {
            this.isPlayerTurn = event.data.isPlayerTurn;
            this.onTurnStart(event.data);
        });
        
        this.game.on(BattleEventType.CardPlayed, (event) => {
            this.onCardPlayed(event.data);
        });
        
        this.game.on(BattleEventType.CardAttacked, (event) => {
            this.onCardAttacked(event.data);
        });
        
        this.game.on(BattleEventType.BattleEnd, (event) => {
            this.onBattleEnd(event.data);
        });
    }
    
    /** 设置UI回调 */
    private setupUICallbacks(): void {
        // 手牌选卡回调
        if (this.handView) {
            this.handView.onCardSelected((card) => {
                this.onHandCardSelected(card);
            });
            
            this.handView.onCardPlayed((card, position) => {
                this.onHandCardPlayed(card, position);
            });
        }
        
        // 战场怪物点击回调
        if (this.battleFieldView) {
            this.battleFieldView.onMonsterClicked((card, position, isPlayer) => {
                this.onMonsterClicked(card, position, isPlayer);
            });
            
            this.battleFieldView.onCellClicked((position, isPlayer) => {
                this.onCellClicked(position, isPlayer);
            });
        }
        
        // 战斗UI回调
        if (this.battleUIView) {
            this.battleUIView.onEndTurn(() => {
                this.onEndTurnClicked();
            });
            
            this.battleUIView.onCancel(() => {
                this.onCancelClicked();
            });
        }
    }
    
    // ==================== 战斗流程 ====================
    
    /** 开始战斗 */
    public startBattle(difficulty: Difficulty): void {
        if (!this.game) return;
        
        this.game.startBattle(difficulty);
        
        // 初始化手牌显示
        this.updateHandDisplay();
        
        // 更新战场显示
        this.updateFieldDisplay();
        
        // 更新UI
        this.updateUI();
        
        // 如果是先手，直接开始玩家回合
        if (this.battleManager?.isPlayerFirst) {
            this.startPlayerTurn();
        } else {
            this.startEnemyTurn();
        }
    }
    
    /** 开始玩家回合 */
    public startPlayerTurn(): void {
        if (!this.game || !this.battleManager) return;
        
        this.isPlayerTurn = true;
        this.game.battleManager.startTurn();
        
        // 更新手牌显示
        this.updateHandDisplay();
        
        // 更新UI
        this.updateUI();
        
        // 播放回合切换特效
        if (this.effectManager) {
            this.effectManager.playTurnChange(true);
        }
    }
    
    /** 开始敌方回合 */
    public async startEnemyTurn(): Promise<void> {
        if (!this.game) return;
        
        this.isPlayerTurn = false;
        
        // 隐藏手牌区域
        if (this.handView) {
            this.handView.setSelectable(false);
        }
        
        // 更新UI
        this.updateUI();
        
        // 播放回合切换特效
        if (this.effectManager) {
            this.effectManager.playTurnChange(false);
        }
        
        // AI回合
        await this.game.executeAITurn();
    }
    
    /** 结束回合 */
    public endTurn(): void {
        if (!this.game) return;
        
        // 取消所有选中
        this.clearSelection();
        
        // 玩家结束回合
        this.game.playerEndTurn();
    }
    
    // ==================== UI事件处理 ====================
    
    /** 手牌选中 */
    private onHandCardSelected(card: CardData | null): void {
        if (!card) {
            // 取消选中
            this.clearSelection();
            return;
        }
        
        // 检查是否可以出牌
        if (!this.battleManager) return;
        
        const currentMana = this.battleManager.player.mana;
        if (!card.canPlay(currentMana)) {
            if (this.battleUIView) {
                this.battleUIView.showTip('水晶不足');
            }
            return;
        }
        
        this.selectedCard = card;
        
        // 高亮可放置位置
        if (this.battleFieldView) {
            const positions = this.game?.battleManager.getValidPlayPositions(true) || [];
            // 可以在这里显示放置预览
        }
        
        // 显示取消按钮
        if (this.battleUIView) {
            this.battleUIView.showCancelButton(true);
        }
    }
    
    /** 手牌出牌 */
    private onHandCardPlayed(card: CardData, worldPosition: cc.Vec2): void {
        if (!this.battleFieldView || !this.game) return;
        
        // 检查是否放置在有效的战场位置
        const fieldPosition = this.convertToFieldPosition(worldPosition, true);
        if (fieldPosition < 0) return;
        
        // 检查位置是否为空
        const existingCard = this.battleFieldView.getMonsterAt(fieldPosition, true);
        if (existingCard) {
            if (this.battleUIView) {
                this.battleUIView.showTip('位置已有卡牌');
            }
            return;
        }
        
        // 出牌
        const result = this.game.playerPlayCard(card.instanceId, fieldPosition);
        
        if (result.success) {
            // 更新显示
            this.battleFieldView.addMonster(card, fieldPosition, true, true);
            this.handView?.removeCard(card.instanceId, true);
            
            // 播放特效
            if (this.effectManager) {
                const node = this.battleFieldView.node;
                this.effectManager.playCardEntrance({ x: node.x, y: node.y });
            }
        } else {
            if (this.battleUIView) {
                this.battleUIView.showTip(result.message);
            }
        }
        
        this.clearSelection();
    }
    
    /** 怪物点击 */
    private onMonsterClicked(card: CardData, position: number, isPlayer: boolean): void {
        if (!this.isPlayerTurn || !this.game || !this.battleFieldView) return;
        
        if (isPlayer) {
            // 点击我方怪物，选中它
            this.battleFieldView.selectMonster(position);
            this.selectedPosition = position;
            
            // 高亮可攻击目标
            const targets = this.game.battleManager.getValidAttackTargets(card.instanceId);
            this.battleFieldView.highlightAttackableTargets(
                targets.map(id => {
                    // 查找目标位置
                    for (let i = 0; i < 6; i++) {
                        const c = this.battleFieldView!.getMonsterAt(i, false);
                        if (c && c.instanceId === id) return i;
                    }
                    return -1;
                }).filter(i => i >= 0)
            );
        } else {
            // 点击敌方怪物，执行攻击
            if (this.selectedPosition < 0) return;
            
            const attackerCard = this.battleFieldView.getMonsterAt(this.selectedPosition, true);
            if (!attackerCard) return;
            
            // 执行攻击
            this.game.playerAttack(attackerCard.instanceId, card.instanceId);
        }
    }
    
    /** 格子点击 */
    private onCellClicked(position: number, isPlayer: boolean): void {
        if (!this.isPlayerTurn || !this.handView) return;
        
        if (isPlayer && this.selectedCard) {
            // 检查位置是否为空
            if (this.battleFieldView) {
                const existingCard = this.battleFieldView.getMonsterAt(position, true);
                if (existingCard) {
                    if (this.battleUIView) {
                        this.battleUIView.showTip('位置已有卡牌');
                    }
                    return;
                }
            }
            
            // 出牌到该位置
            const result = this.game?.playerPlayCard(this.selectedCard.instanceId, position);
            if (result?.success) {
                if (this.handView) {
                    this.handView.removeCard(this.selectedCard.instanceId, true);
                }
                if (this.battleFieldView && this.selectedCard) {
                    this.battleFieldView.addMonster(this.selectedCard, position, true, true);
                }
            }
            
            this.clearSelection();
        }
    }
    
    /** 结束回合按钮点击 */
    private onEndTurnClicked(): void {
        if (!this.isPlayerTurn) return;
        this.endTurn();
    }
    
    /** 取消按钮点击 */
    private onCancelClicked(): void {
        this.clearSelection();
    }
    
    // ==================== 事件处理 ====================
    
    /** 回合开始 */
    private onTurnStart(data: any): void {
        this.updateUI();
    }
    
    /** 卡牌出牌 */
    private onCardPlayed(data: any): void {
        if (!data.isPlayer) {
            // 敌方出牌，更新战场显示
            if (this.battleFieldView && data.card) {
                this.battleFieldView.addMonster(data.card, data.position, false, true);
            }
        }
        
        this.updateUI();
    }
    
    /** 卡牌攻击 */
    private onCardAttacked(data: any): void {
        const { attacker, defender, damage, elementEffective } = data;
        
        if (!this.battleFieldView) return;
        
        // 播放攻击动画
        // ... (需要追踪位置)
        
        // 更新显示
        this.updateFieldDisplay();
        
        // 播放伤害数字
        if (this.effectManager) {
            // this.effectManager.playDamageNumber(position, damage);
        }
        
        // 如果有属性克制，播放特效
        if (elementEffective) {
            // this.effectManager.playElementCounter(position, attacker.element, true);
        }
    }
    
    /** 战斗结束 */
    private onBattleEnd(data: any): void {
        const { result } = data;
        
        if (this.battleUIView) {
            this.battleUIView.showBattleResult(result.winner === 'player', () => {
                // 延迟返回主菜单
                // SceneNavigator.getInstance().goToMainMenu();
            });
        }
    }
    
    // ==================== 显示更新 ====================
    
    /** 更新手牌显示 */
    private updateHandDisplay(): void {
        if (!this.handView || !this.battleManager) return;
        
        // 清空现有显示
        this.handView.clearHand(false);
        
        // 添加当前手牌
        for (const card of this.battleManager.player.hand) {
            this.handView.addCard(card, false);
        }
        
        // 更新可出牌状态
        this.handView.updatePlayableCards(this.battleManager.player.mana);
        this.handView.setSelectable(this.isPlayerTurn);
    }
    
    /** 更新战场显示 */
    private updateFieldDisplay(): void {
        if (!this.battleFieldView || !this.battleManager) return;
        
        // 清空战场
        this.battleFieldView.clearField(false);
        
        // 添加我方怪物
        for (let i = 0; i < 6; i++) {
            const card = this.battleManager.player.field[i];
            if (card) {
                this.battleFieldView.addMonster(card, i, true, false);
            }
        }
        
        // 添加敌方怪物
        for (let i = 0; i < 6; i++) {
            const card = this.battleManager.enemy.field[i];
            if (card) {
                this.battleFieldView.addMonster(card, i, false, false);
            }
        }
    }
    
    /** 更新UI显示 */
    private updateUI(): void {
        if (!this.battleManager || !this.battleUIView) return;
        
        this.battleUIView.updatePlayerInfo(this.battleManager.player);
        this.battleUIView.updateEnemyInfo(this.battleManager.enemy);
        this.battleUIView.updateTurnInfo(
            this.battleManager.turn,
            this.battleManager.isPlayerTurn
        );
    }
    
    // ==================== 工具方法 ====================
    
    /** 清除选中状态 */
    private clearSelection(): void {
        this.selectedCard = null;
        this.selectedPosition = -1;
        
        if (this.handView) {
            this.handView.deselectCard();
        }
        
        if (this.battleFieldView) {
            this.battleFieldView.deselectMonster();
            this.battleFieldView.clearHighlights();
        }
        
        if (this.battleUIView) {
            this.battleUIView.showCancelButton(false);
        }
    }
    
    /** 转换世界坐标到战场位置 */
    private convertToFieldPosition(worldPosition: cc.Vec2, isPlayer: boolean): number {
        if (!this.battleFieldView) return -1;
        
        // 简化的实现：需要根据实际布局计算
        // 这里返回-1表示无效位置
        return -1;
    }
}
