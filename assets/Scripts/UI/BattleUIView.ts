/**
 * 战斗UI视图 - 管理战斗界面的UI元素
 */

import { PlayerState } from '../Core/PlayerState';
import { UIManager } from './UIManager';

/** 战斗UI视图 */
const { ccclass, property } = cc._decorator;

@ccclass
export class BattleUIView extends cc.Component {
    /** 玩家生命值标签 */
    @property(cc.Label)
    playerHPLabel: cc.Label = null;
    
    /** 玩家生命进度条 */
    @property(cc.ProgressBar)
    playerHPBar: cc.ProgressBar = null;
    
    /** 玩家水晶标签 */
    @property(cc.Label)
    playerManaLabel: cc.Label = null;
    
    /** 玩家水晶图标组 */
    @property([cc.Sprite])
    playerManaIcons: cc.Sprite[] = [];
    
    /** 玩家能量标签 */
    @property(cc.Label)
    playerEnergyLabel: cc.Label = null;
    
    /** 玩家能量进度条 */
    @property(cc.ProgressBar)
    playerEnergyBar: cc.ProgressBar = null;
    
    /** 敌方生命值标签 */
    @property(cc.Label)
    enemyHPLabel: cc.Label = null;
    
    /** 敌方生命进度条 */
    @property(cc.ProgressBar)
    enemyHPBar: cc.ProgressBar = null;
    
    /** 敌方水晶标签 */
    @property(cc.Label)
    enemyManaLabel: cc.Label = null;
    
    /** 敌方能量标签 */
    @property(cc.Label)
    enemyEnergyLabel: cc.Label = null;
    
    /** 回合标签 */
    @property(cc.Label)
    turnLabel: cc.Label = null;
    
    /** 当前回合指示 */
    @property(cc.Label)
    currentTurnLabel: cc.Label = null;
    
    /** 结束回合按钮 */
    @property(cc.Button)
    endTurnButton: cc.Button = null;
    
    /** 取消按钮 */
    @property(cc.Button)
    cancelButton: cc.Button = null;
    
    /** 玩家信息面板 */
    @property(cc.Node)
    playerInfoPanel: cc.Node = null;
    
    /** 敌方信息面板 */
    @property(cc.Node)
    enemyInfoPanel: cc.Node = null;
    
    /** 手牌数量标签 */
    @property(cc.Label)
    playerHandCountLabel: cc.Label = null;
    
    /** 敌方手牌数量标签 */
    @property(cc.Label)
    enemyHandCountLabel: cc.Label = null;
    
    /** 牌堆数量标签 */
    @property(cc.Label)
    playerDeckCountLabel: cc.Label = null;
    
    /** 敌方牌堆数量标签 */
    @property(cc.Label)
    enemyDeckCountLabel: cc.Label = null;
    
    // 回调
    private endTurnCallback: (() => void) | null = null;
    private cancelCallback: (() => void) | null = null;
    
    /** onLoad */
    onLoad() {
        this.setupButtons();
    }
    
    /** 设置按钮事件 */
    private setupButtons(): void {
        if (this.endTurnButton) {
            const clickEvent = new cc.Component.EventHandler();
            clickEvent.target = this.node;
            clickEvent.component = 'BattleUIView';
            clickEvent.handler = 'onEndTurnClicked';
            this.endTurnButton.clickEvents.push(clickEvent);
        }
        
        if (this.cancelButton) {
            const clickEvent = new cc.Component.EventHandler();
            clickEvent.target = this.node;
            clickEvent.component = 'BattleUIView';
            clickEvent.handler = 'onCancelClicked';
            this.cancelButton.clickEvents.push(clickEvent);
        }
    }
    
    /** 结束回合按钮点击 */
    public onEndTurnClicked(): void {
        if (this.endTurnCallback) {
            this.endTurnCallback();
        }
    }
    
    /** 取消按钮点击 */
    public onCancelClicked(): void {
        if (this.cancelCallback) {
            this.cancelCallback();
        }
    }
    
    // ==================== 更新方法 ====================
    
    /** 更新玩家信息 */
    public updatePlayerInfo(player: PlayerState): void {
        // 生命值
        if (this.playerHPLabel) {
            this.playerHPLabel.string = `${player.hp}/${player.maxHp}`;
        }
        
        if (this.playerHPBar) {
            this.playerHPBar.progress = player.hp / player.maxHp;
        }
        
        // 水晶
        if (this.playerManaLabel) {
            this.playerManaLabel.string = `${player.mana}/${player.maxMana}`;
        }
        
        // 更新水晶图标显示
        this.updateManaIcons(this.playerManaIcons, player.mana, player.maxMana);
        
        // 能量
        if (this.playerEnergyLabel) {
            this.playerEnergyLabel.string = `${player.energy}/10`;
        }
        
        if (this.playerEnergyBar) {
            this.playerEnergyBar.progress = player.energy / 10;
        }
        
        // 手牌数量
        if (this.playerHandCountLabel) {
            this.playerHandCountLabel.string = `${player.hand.length}`;
        }
        
        // 牌堆数量
        if (this.playerDeckCountLabel) {
            this.playerDeckCountLabel.string = `${player.deck.length}`;
        }
    }
    
    /** 更新敌方信息 */
    public updateEnemyInfo(enemy: PlayerState): void {
        // 生命值
        if (this.enemyHPLabel) {
            this.enemyHPLabel.string = `${enemy.hp}/${enemy.maxHp}`;
        }
        
        if (this.enemyHPBar) {
            this.enemyHPBar.progress = enemy.hp / enemy.maxHp;
        }
        
        // 水晶
        if (this.enemyManaLabel) {
            this.enemyManaLabel.string = `${enemy.mana}/${enemy.maxMana}`;
        }
        
        // 能量
        if (this.enemyEnergyLabel) {
            this.enemyEnergyLabel.string = `${enemy.energy}/10`;
        }
        
        // 手牌数量
        if (this.enemyHandCountLabel) {
            this.enemyHandCountLabel.string = `${enemy.hand.length}`;
        }
        
        // 牌堆数量
        if (this.enemyDeckCountLabel) {
            this.enemyDeckCountLabel.string = `${enemy.deck.length}`;
        }
    }
    
    /** 更新回合信息 */
    public updateTurnInfo(turn: number, isPlayerTurn: boolean): void {
        if (this.turnLabel) {
            this.turnLabel.string = `回合 ${turn}`;
        }
        
        if (this.currentTurnLabel) {
            this.currentTurnLabel.string = isPlayerTurn ? '你的回合' : '敌方回合';
            this.currentTurnLabel.node.color = isPlayerTurn ? cc.color().fromHEX('#4CAF50') : cc.color().fromHEX('#F44336');
        }
        
        // 启用/禁用结束回合按钮
        if (this.endTurnButton) {
            this.endTurnButton.interactable = isPlayerTurn;
        }
    }
    
    /** 更新水晶图标显示 */
    private updateManaIcons(icons: cc.Sprite[], current: number, max: number): void {
        for (let i = 0; i < icons.length; i++) {
            if (icons[i]) {
                icons[i].node.active = i < max;
                // 已使用的水晶变暗
                if (i >= current) {
                    icons[i].node.opacity = 128;
                } else {
                    icons[i].node.opacity = 255;
                }
            }
        }
    }
    
    /** 设置回合指示器 */
    public setTurnIndicator(isPlayerTurn: boolean): void {
        if (this.playerInfoPanel) {
            this.playerInfoPanel.opacity = isPlayerTurn ? 255 : 128;
        }
        
        if (this.enemyInfoPanel) {
            this.enemyInfoPanel.opacity = isPlayerTurn ? 128 : 255;
        }
    }
    
    /** 显示提示信息 */
    public showTip(text: string, duration: number = 2): void {
        // 创建提示节点
        const tipNode = new cc.Node('Tip');
        tipNode.parent = this.node;
        
        const label = tipNode.addComponent(cc.Label);
        label.string = text;
        label.fontSize = 24;
        label.horizontalAlign = cc.Label.HorizontalAlign.CENTER;
        
        tipNode.setPosition(0, 0);
        
        // 淡入淡出动画
        tipNode.opacity = 0;
        tipNode.runAction(cc.sequence(
            cc.fadeIn(0.3),
            cc.delayTime(duration),
            cc.fadeOut(0.3),
            cc.removeSelf()
        ));
    }
    
    /** 显示战斗结果 */
    public showBattleResult(isVictory: boolean, callback?: () => void): void {
        // 创建结果面板
        const resultNode = new cc.Node('BattleResult');
        resultNode.parent = this.node;
        resultNode.setPosition(0, 0);
        
        // 背景
        const bg = resultNode.addComponent(cc.Sprite);
        bg.type = cc.Sprite.Type.SLICED;
        bg.sizeMode = cc.Sprite.SizeMode.RAW;
        resultNode.setContentSize(400, 200);
        
        // 结果文字
        const resultLabel = resultNode.addComponent(cc.Label);
        resultLabel.string = isVictory ? '胜利!' : '失败';
        resultLabel.fontSize = 48;
        resultLabel.horizontalAlign = cc.Label.HorizontalAlign.CENTER;
        resultLabel.node.color = isVictory ? cc.color().fromHEX('#FFD700') : cc.color().fromHEX('#808080');
        
        // 动画
        resultNode.scale = 0;
        resultNode.runAction(cc.sequence(
            cc.scaleTo(0.5, 1.2),
            cc.scaleTo(0.2, 1.0),
            cc.delayTime(2),
            cc.fadeOut(0.5),
            cc.removeSelf(),
            cc.callFunc(() => {
                if (callback) callback();
            })
        ));
    }
    
    /** 设置结束回合回调 */
    public onEndTurn(callback: () => void): void {
        this.endTurnCallback = callback;
    }
    
    /** 设置取消回调 */
    public onCancel(callback: () => void): void {
        this.cancelCallback = callback;
    }
    
    /** 启用/禁用UI交互 */
    public setUIEnabled(enabled: boolean): void {
        if (this.endTurnButton) {
            this.endTurnButton.interactable = enabled;
        }
    }
    
    /** 显示/隐藏取消按钮 */
    public showCancelButton(show: boolean): void {
        if (this.cancelButton) {
            this.cancelButton.node.active = show;
        }
    }
}
