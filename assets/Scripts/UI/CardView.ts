/**
 * 卡牌视图组件 - 负责卡牌的UI展示和交互
 */

import { CardData } from '../Core/CardData';
import { ElementType, RoleType, Rarity, RARITY_COLORS } from '../Core/Types';
import { UIManager } from './UIManager';

/** 卡牌视图状态 */
export enum CardViewState {
    Normal = 'normal',
    Selected = 'selected',
    Disabled = 'disabled',
    Attacking = 'attacking',
    Damaged = 'damaged',
    Dying = 'dying'
}

/** 卡牌视图 */
const { ccclass, property } = cc._decorator;

@ccclass
export class CardView extends cc.Component {
    /** 卡牌数据 */
    private cardData: CardData | null = null;
    
    /** 当前状态 */
    private currentState: CardViewState = CardViewState.Normal;
    
    /** 是否被选中 */
    private isSelected: boolean = false;
    
    /** 是否可以操作 */
    private isPlayable: boolean = true;
    
    /** 点击回调 */
    private clickCallback: ((card: CardData) => void) | null = null;
    
    /** 长按回调 */
    private longPressCallback: ((card: CardData) => void) | null = null;
    
    /** 拖拽开始回调 */
    private dragStartCallback: ((card: CardData, position: cc.Vec2) => void) | null = null;
    
    /** 拖拽移动回调 */
    private dragMoveCallback: ((card: CardData, position: cc.Vec2) => void) | null = null;
    
    /** 拖拽结束回调 */
    private dragEndCallback: ((card: CardData, position: cc.Vec2) => void) | null = null;
    
    /** 节点引用 */
    @property(cc.Node)
    cardRoot: cc.Node = null;
    
    @property(cc.Sprite)
    cardFrame: cc.Sprite = null;
    
    @property(cc.Sprite)
    cardImage: cc.Sprite = null;
    
    @property(cc.Label)
    nameLabel: cc.Label = null;
    
    @property(cc.Label)
    costLabel: cc.Label = null;
    
    @property(cc.Label)
    attackLabel: cc.Label = null;
    
    @property(cc.Label)
    healthLabel: cc.Label = null;
    
    @property(cc.Label)
    elementLabel: cc.Label = null;
    
    @property(cc.Label)
    roleLabel: cc.Label = null;
    
    @property(cc.Node)
    selectedIndicator: cc.Node = null;
    
    @property(cc.Node)
    disabledOverlay: cc.Node = null;
    
    @property(cc.Node)
    attackIndicator: cc.Node = null;
    
    @property(cc.Node)
    canAttackIndicator: cc.Node = null;
    
    // onLoad
    onLoad() {
        this.setupEvents();
    }
    
    /** 设置事件监听 */
    private setupEvents(): void {
        if (!this.cardRoot) return;
        
        // 点击事件
        this.cardRoot.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.cardRoot.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.cardRoot.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchCancel, this);
        
        // 拖拽事件
        this.cardRoot.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
    }
    
    /** 初始化卡牌数据 */
    public initWithData(card: CardData): void {
        this.cardData = card;
        this.updateDisplay();
    }
    
    /** 更新显示 */
    private updateDisplay(): void {
        if (!this.cardData) return;
        
        const ui = UIManager.getInstance();
        
        // 名称
        if (this.nameLabel) {
            this.nameLabel.string = this.cardData.name;
        }
        
        // 费用
        if (this.costLabel) {
            this.costLabel.string = this.cardData.cost.toString();
        }
        
        // 攻击力
        if (this.attackLabel) {
            this.attackLabel.string = this.cardData.getDisplayAttack().toString();
        }
        
        // 生命值
        if (this.healthLabel) {
            this.healthLabel.string = this.cardData.getDisplayHealth().toString();
        }
        
        // 元素
        if (this.elementLabel) {
            this.elementLabel.string = ui.getElementIcon(this.cardData.element);
        }
        
        // 定位
        if (this.roleLabel) {
            this.roleLabel.string = ui.formatRoleName(this.cardData.role);
        }
        
        // 稀有度边框颜色
        if (this.cardFrame) {
            const color = ui.getRarityColor(this.cardData.rarity);
            this.cardFrame.node.color = cc.color().fromHEX(color);
        }
    }
    
    /** 设置选中状态 */
    public setSelected(selected: boolean): void {
        this.isSelected = selected;
        this.currentState = selected ? CardViewState.Selected : CardViewState.Normal;
        
        if (this.selectedIndicator) {
            this.selectedIndicator.active = selected;
        }
        
        // 播放选中动画
        if (selected) {
            this.playSelectAnimation();
        } else {
            this.playDeselectAnimation();
        }
    }
    
    /** 设置禁用状态 */
    public setDisabled(disabled: boolean): void {
        this.isPlayable = !disabled;
        this.currentState = disabled ? CardViewState.Disabled : CardViewState.Normal;
        
        if (this.disabledOverlay) {
            this.disabledOverlay.active = disabled;
        }
        
        // 设置透明度
        this.cardRoot.opacity = disabled ? 128 : 255;
    }
    
    /** 设置是否可攻击 */
    public setCanAttack(canAttack: boolean): void {
        if (this.canAttackIndicator) {
            this.canAttackIndicator.active = canAttack;
        }
    }
    
    /** 设置攻击中状态 */
    public setAttacking(isAttacking: boolean): void {
        this.currentState = isAttacking ? CardViewState.Attacking : CardViewState.Normal;
        
        if (this.attackIndicator) {
            this.attackIndicator.active = isAttacking;
        }
    }
    
    /** 播放出场动画 */
    public playEntranceAnimation(callback?: () => void): void {
        if (!this.cardRoot) {
            if (callback) callback();
            return;
        }
        
        const scale = this.cardRoot.scale;
        this.cardRoot.scale = 0;
        this.cardRoot.opacity = 0;
        
        // 同时播放缩放和透明度动画
        const spawn = cc.spawn(
            cc.scaleTo(0.3, scale),
            cc.fadeIn(0.3)
        );
        
        this.cardRoot.runAction(cc.sequence(
            spawn,
            cc.callFunc(() => {
                if (callback) callback();
            })
        ));
    }
    
    /** 播放攻击动画 */
    public playAttackAnimation(targetPosition: cc.Vec2, callback?: () => void): void {
        if (!this.cardRoot) {
            if (callback) callback();
            return;
        }
        
        const originalPosition = this.cardRoot.position.clone();
        
        // 向目标移动
        const moveAction = cc.moveTo(0.2, targetPosition);
        // 回位
        const backAction = cc.moveTo(0.2, originalPosition);
        
        this.cardRoot.runAction(cc.sequence(
            moveAction,
            cc.callFunc(() => {
                this.setAttacking(false);
            }),
            backAction,
            cc.callFunc(() => {
                if (callback) callback();
            })
        ));
    }
    
    /** 播放受击动画 */
    public playDamageAnimation(callback?: () => void): void {
        if (!this.cardRoot) {
            if (callback) callback();
            return;
        }
        
        // 红色闪烁
        const originalColor = this.cardRoot.color.clone();
        
        // 闪烁序列
        const flashSequence = cc.sequence(
            cc.tintTo(0.1, 255, 0, 0),
            cc.tintTo(0.1, originalColor)
        );
        
        // 抖动
        const shakeSequence = cc.sequence(
            cc.moveBy(0.05, cc.v2(5, 0)),
            cc.moveBy(0.05, cc.v2(-10, 0)),
            cc.moveBy(0.05, cc.v2(10, 0)),
            cc.moveBy(0.05, cc.v2(-5, 0))
        );
        
        // 组合动画
        this.cardRoot.runAction(cc.sequence(
            cc.spawn(flashSequence, shakeSequence),
            cc.callFunc(() => {
                if (callback) callback();
            })
        ));
    }
    
    /** 播放死亡动画 */
    public playDeathAnimation(callback?: () => void): void {
        if (!this.cardRoot) {
            if (callback) callback();
            return;
        }
        
        this.currentState = CardViewState.Dying;
        
        // 缩放和透明度同时变化
        const spawn = cc.spawn(
            cc.scaleTo(0.5, 0),
            cc.fadeOut(0.5)
        );
        
        this.cardRoot.runAction(cc.sequence(
            spawn,
            cc.callFunc(() => {
                this.cardRoot.active = false;
                if (callback) callback();
            })
        ));
    }
    
    /** 播放选中动画 */
    private playSelectAnimation(): void {
        if (!this.cardRoot) return;
        
        const scaleAction = cc.scaleTo(0.2, 1.1);
        this.cardRoot.runAction(scaleAction);
    }
    
    /** 播放取消选中动画 */
    private playDeselectAnimation(): void {
        if (!this.cardRoot) return;
        
        const scaleAction = cc.scaleTo(0.2, 1.0);
        this.cardRoot.runAction(scaleAction);
    }
    
    /** 更新属性显示 */
    public updateStats(): void {
        if (!this.cardData) return;
        
        if (this.attackLabel) {
            this.attackLabel.string = this.cardData.getDisplayAttack().toString();
        }
        
        if (this.healthLabel) {
            this.healthLabel.string = this.cardData.getDisplayHealth().toString();
        }
        
        // 更新颜色（生命低于一定程度变红）
        if (this.healthLabel && this.cardData.health < this.cardData.maxHealth * 0.3) {
            this.healthLabel.node.color = cc.color().fromHEX('#FF6B6B');
        } else {
            this.healthLabel.node.color = cc.color().fromHEX('#FFFFFF');
        }
    }
    
    // ==================== 事件处理 ====================
    
    private onTouchStart(event: cc.Event.EventTouch): void {
        if (!this.isPlayable) return;
        
        this.setSelected(true);
        
        // 通知拖拽开始
        if (this.dragStartCallback && this.cardData) {
            const position = this.cardRoot.convertToWorldSpaceAR(cc.v2(0, 0));
            this.dragStartCallback(this.cardData, position);
        }
    }
    
    private onTouchEnd(event: cc.Event.EventTouch): void {
        if (!this.isPlayable) return;
        
        // 通知点击
        if (this.clickCallback && this.cardData && !this.isDragging) {
            this.clickCallback(this.cardData);
        }
        
        // 通知拖拽结束
        if (this.dragEndCallback && this.cardData) {
            const position = this.cardRoot.convertToWorldSpaceAR(cc.v2(0, 0));
            this.dragEndCallback(this.cardData, position);
        }
        
        this.isDragging = false;
    }
    
    private onTouchCancel(event: cc.Event.EventTouch): void {
        this.onTouchEnd(event);
    }
    
    private isDragging: boolean = false;
    
    private onTouchMove(event: cc.Event.EventTouch): void {
        if (!this.isPlayable) return;
        
        this.isDragging = true;
        
        // 通知拖拽移动
        if (this.dragMoveCallback && this.cardData) {
            const position = this.cardRoot.convertToWorldSpaceAR(cc.v2(0, 0));
            this.dragMoveCallback(this.cardData, position);
        }
    }
    
    // ==================== 回调设置 ====================
    
    /** 设置点击回调 */
    public onCardClick(callback: (card: CardData) => void): void {
        this.clickCallback = callback;
    }
    
    /** 设置长按回调 */
    public onCardLongPress(callback: (card: CardData) => void): void {
        this.longPressCallback = callback;
    }
    
    /** 设置拖拽开始回调 */
    public onDragStart(callback: (card: CardData, position: cc.Vec2) => void): void {
        this.dragStartCallback = callback;
    }
    
    /** 设置拖拽移动回调 */
    public onDragMove(callback: (card: CardData, position: cc.Vec2) => void): void {
        this.dragMoveCallback = callback;
    }
    
    /** 设置拖拽结束回调 */
    public onDragEnd(callback: (card: CardData, position: cc.Vec2) => void): void {
        this.dragEndCallback = callback;
    }
    
    // ==================== 工具方法 ====================
    
    /** 获取卡牌数据 */
    public getCardData(): CardData | null {
        return this.cardData;
    }
    
    /** 获取是否选中 */
    public getIsSelected(): boolean {
        return this.isSelected;
    }
    
    /** 获取是否可以操作 */
    public getIsPlayable(): boolean {
        return this.isPlayable;
    }
    
    /** 清理 */
    public clear(): void {
        this.cardData = null;
        this.currentState = CardViewState.Normal;
        this.isSelected = false;
        this.isPlayable = true;
        this.clickCallback = null;
        this.longPressCallback = null;
        this.dragStartCallback = null;
        this.dragMoveCallback = null;
        this.dragEndCallback = null;
    }
}
