/**
 * 主场景视图 - 游戏主界面
 */

import { SaveManager } from '../Data/SaveManager';

/** 主场景视图 */
const { ccclass, property } = cc._decorator;

@ccclass
export class MainMenuView extends cc.Component {
    /** 版本标签 */
    @property(cc.Label)
    versionLabel: cc.Label = null;
    
    /** 玩家等级标签 */
    @property(cc.Label)
    levelLabel: cc.Label = null;
    
    /** 金币标签 */
    @property(cc.Label)
    coinsLabel: cc.Label = null;
    
    /** 卡牌数量标签 */
    @property(cc.Label)
    cardCountLabel: cc.Label = null;
    
    /** 开始对战按钮 */
    @property(cc.Button)
    battleButton: cc.Button = null;
    
    /** 卡组管理按钮 */
    @property(cc.Button)
    deckButton: cc.Button = null;
    
    /** 冒险模式按钮 */
    @property(cc.Button)
    adventureButton: cc.Button = null;
    
    /** 天梯按钮 */
    @property(cc.Button)
    ladderButton: cc.Button = null;
    
    /** 设置按钮 */
    @property(cc.Button)
    settingsButton: cc.Button = null;
    
    /** 回调 */
    private startBattleCallback: (() => void) | null = null;
    private openDeckCallback: (() => void) | null = null;
    private openAdventureCallback: (() => void) | null = null;
    private openLadderCallback: (() => void) | null = null;
    private openSettingsCallback: (() => void) | null = null;
    
    /** onLoad */
    onLoad() {
        this.setupButtons();
    }
    
    /** setupButtons */
    private setupButtons(): void {
        if (this.battleButton) {
            const event = new cc.Component.EventHandler();
            event.target = this.node;
            event.component = 'MainMenuView';
            event.handler = 'onBattleClicked';
            this.battleButton.clickEvents.push(event);
        }
        
        if (this.deckButton) {
            const event = new cc.Component.EventHandler();
            event.target = this.node;
            event.component = 'MainMenuView';
            event.handler = 'onDeckClicked';
            this.deckButton.clickEvents.push(event);
        }
        
        if (this.adventureButton) {
            const event = new cc.Component.EventHandler();
            event.target = this.node;
            event.component = 'MainMenuView';
            event.handler = 'onAdventureClicked';
            this.adventureButton.clickEvents.push(event);
        }
        
        if (this.ladderButton) {
            const event = new cc.Component.EventHandler();
            event.target = this.node;
            event.component = 'MainMenuView';
            event.handler = 'onLadderClicked';
            this.ladderButton.clickEvents.push(event);
        }
        
        if (this.settingsButton) {
            const event = new cc.Component.EventHandler();
            event.target = this.node;
            event.component = 'MainMenuView';
            event.handler = 'onSettingsClicked';
            this.settingsButton.clickEvents.push(event);
        }
    }
    
    /** start - 在场景加载时调用 */
    start() {
        this.updatePlayerInfo();
        
        if (this.versionLabel) {
            this.versionLabel.string = 'v1.0.0';
        }
    }
    
    /** 更新玩家信息 */
    public updatePlayerInfo(): void {
        const saveManager = SaveManager.getInstance();
        
        if (this.levelLabel) {
            this.levelLabel.string = `等级 ${saveManager.getPlayerLevel()}`;
        }
        
        if (this.coinsLabel) {
            this.coinsLabel.string = `${saveManager.getCoins()}`;
        }
        
        if (this.cardCountLabel) {
            const ownedCards = saveManager.getOwnedCards();
            const totalCards = ownedCards.reduce((sum, card) => sum + card.count, 0);
            this.cardCountLabel.string = `${ownedCards.length}种/${totalCards}张`;
        }
    }
    
    // ==================== 按钮点击处理 ====================
    
    /** 开始对战按钮点击 */
    public onBattleClicked(): void {
        if (this.startBattleCallback) {
            this.startBattleCallback();
        }
    }
    
    /** 卡组管理按钮点击 */
    public onDeckClicked(): void {
        if (this.openDeckCallback) {
            this.openDeckCallback();
        }
    }
    
    /** 冒险模式按钮点击 */
    public onAdventureClicked(): void {
        if (this.openAdventureCallback) {
            this.openAdventureCallback();
        }
    }
    
    /** 天梯按钮点击 */
    public onLadderClicked(): void {
        if (this.openLadderCallback) {
            this.openLadderCallback();
        }
    }
    
    /** 设置按钮点击 */
    public onSettingsClicked(): void {
        if (this.openSettingsCallback) {
            this.openSettingsCallback();
        }
    }
    
    // ==================== 回调设置 ====================
    
    /** 设置开始战斗回调 */
    public onStartBattle(callback: () => void): void {
        this.startBattleCallback = callback;
    }
    
    /** 设置打开卡组管理回调 */
    public onOpenDeck(callback: () => void): void {
        this.openDeckCallback = callback;
    }
    
    /** 设置打开冒险模式回调 */
    public onOpenAdventure(callback: () => void): void {
        this.openAdventureCallback = callback;
    }
    
    /** 设置打开天梯回调 */
    public onOpenLadder(callback: () => void): void {
        this.openLadderCallback = callback;
    }
    
    /** 设置打开设置回调 */
    public onOpenSettings(callback: () => void): void {
        this.openSettingsCallback = callback;
    }
    
    // ==================== 动画效果 ====================
    
    /** 播放入场动画 */
    public playEntranceAnimation(): void {
        const buttons = [
            this.battleButton?.node,
            this.deckButton?.node,
            this.adventureButton?.node,
            this.ladderButton?.node,
            this.settingsButton?.node
        ];
        
        let delay = 0;
        for (const button of buttons) {
            if (button) {
                button.scale = 0;
                button.runAction(cc.sequence(
                    cc.delayTime(delay),
                    cc.scaleTo(0.3, 1.0),
                    cc.easeBackOut()
                ));
                delay += 0.1;
            }
        }
    }
    
    /** 播放按钮点击效果 */
    public playButtonClickEffect(button: cc.Button): void {
        if (!button) return;
        
        const originalScale = button.node.scale;
        
        button.node.runAction(cc.sequence(
            cc.scaleTo(0.1, originalScale * 1.2),
            cc.scaleTo(0.1, originalScale)
        ));
    }
}
