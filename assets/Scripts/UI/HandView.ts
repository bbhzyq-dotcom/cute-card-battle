/**
 * 手牌视图组件 - 管理玩家的手牌展示和交互
 */

import { CardData } from '../Core/CardData';
import { CardView } from './CardView';
import { UIManager } from './UIManager';
import { GameConfig } from '../Config/GameConfig';

/** 手牌视图 */
const { ccclass, property } = cc._decorator;

@ccclass
export class HandView extends cc.Component {
    /** 手牌容器节点 */
    @property(cc.Node)
    handContainer: cc.Node = null;
    
    /** 卡牌预制体 */
    @property(cc.Prefab)
    cardPrefab: cc.Prefab = null;
    
    /** 卡牌宽度 */
    @property
    cardWidth: number = 100;
    
    /** 当前手牌列表 */
    private handCards: CardData[] = [];
    
    /** 卡牌视图列表 */
    private cardViews: Map<string, CardView> = new Map();
    
    /** 当前选中的卡牌 */
    private selectedCard: CardData | null = null;
    
    /** 是否可选中 */
    private isSelectable: boolean = true;
    
    /** 选卡回调 */
    private selectCallback: ((card: CardData | null) => void) | null = null;
    
    /** 出牌回调 */
    private playCallback: ((card: CardData, position: cc.Vec2) => void) | null = null;
    
    /** 拖拽中 */
    private isDragging: boolean = false;
    
    /** 拖拽中的卡牌 */
    private draggingCard: CardData | null = null;
    
    /** onLoad */
    onLoad() {
        // 初始化
    }
    
    /** 初始化手牌视图 */
    public init(): void {
        if (!this.handContainer) {
            this.handContainer = this.node;
        }
    }
    
    // ==================== 手牌管理 ====================
    
    /** 添加手牌 */
    public addCard(card: CardData, animated: boolean = true): void {
        this.handCards.push(card);
        
        // 创建卡牌视图
        const cardView = this.createCardView(card);
        if (!cardView) return;
        
        // 设置位置
        const index = this.handCards.length - 1;
        const position = this.calculateCardPosition(index, this.handCards.length);
        cardView.node.setPosition(position);
        
        // 布局
        this.layoutCards(false);
        
        // 播放动画
        if (animated) {
            cardView.playEntranceAnimation();
        }
    }
    
    /** 移除手牌 */
    public removeCard(cardInstanceId: string, animated: boolean = true): void {
        const index = this.handCards.findIndex(c => c.instanceId === cardInstanceId);
        if (index === -1) return;
        
        const card = this.handCards[index];
        const cardView = this.cardViews.get(cardInstanceId);
        
        if (animated && cardView) {
            cardView.playDeathAnimation(() => {
                this.removeCardInternal(cardInstanceId);
            });
        } else {
            this.removeCardInternal(cardInstanceId);
        }
    }
    
    /** 内部移除手牌 */
    private removeCardInternal(cardInstanceId: string): void {
        const index = this.handCards.findIndex(c => c.instanceId === cardInstanceId);
        if (index !== -1) {
            this.handCards.splice(index, 1);
        }
        
        const cardView = this.cardViews.get(cardInstanceId);
        if (cardView) {
            cardView.node.destroy();
            this.cardViews.delete(cardInstanceId);
        }
        
        this.layoutCards(true);
    }
    
    /** 清空手牌 */
    public clearHand(animated: boolean = true): void {
        if (animated) {
            // 依次播放死亡动画
            let delay = 0;
            for (const card of this.handCards) {
                const cardView = this.cardViews.get(card.instanceId);
                if (cardView) {
                    this.scheduleOnce(() => {
                        cardView.playDeathAnimation();
                    }, delay);
                    delay += 0.1;
                }
            }
            
            this.scheduleOnce(() => {
                this.clearHandInternal();
            }, delay + 0.5);
        } else {
            this.clearHandInternal();
        }
    }
    
    /** 内部清空手牌 */
    private clearHandInternal(): void {
        for (const [id, view] of this.cardViews) {
            view.node.destroy();
        }
        this.cardViews.clear();
        this.handCards = [];
        this.selectedCard = null;
    }
    
    // ==================== 创建和布局 ====================
    
    /** 创建卡牌视图 */
    private createCardView(card: CardData): CardView | null {
        if (!this.cardPrefab) {
            console.warn('手牌预制体未设置');
            return null;
        }
        
        const cardNode = cc.instantiate(this.cardPrefab);
        if (!cardNode) return null;
        
        cardNode.parent = this.handContainer;
        
        const cardView = cardNode.getComponent(CardView);
        if (!cardView) return null;
        
        cardView.initWithData(card);
        
        // 设置交互回调
        cardView.onCardClick((c) => this.onCardClicked(c));
        cardView.onDragStart((c, p) => this.onDragStart(c, p));
        cardView.onDragMove((c, p) => this.onDragMove(c, p));
        cardView.onDragEnd((c, p) => this.onDragEnd(c, p));
        
        this.cardViews.set(card.instanceId, cardView);
        
        return cardView;
    }
    
    /** 计算卡牌位置 */
    private calculateCardPosition(index: number, total: number): cc.Vec2 {
        const ui = UIManager.getInstance();
        const result = ui.calculateHandCardPosition(index, total, this.cardWidth);
        return cc.v2(result.x, result.y);
    }
    
    /** 布局手牌 */
    public layoutCards(animated: boolean = true): void {
        const total = this.handCards.length;
        
        for (let i = 0; i < this.handCards.length; i++) {
            const card = this.handCards[i];
            const cardView = this.cardViews.get(card.instanceId);
            if (!cardView) continue;
            
            const newPosition = this.calculateCardPosition(i, total);
            const rotation = UIManager.getInstance().calculateHandCardPosition(i, total, this.cardWidth).rotation;
            
            if (animated) {
                const moveAction = cc.moveTo(0.3, newPosition);
                const rotateAction = cc.rotateTo(0.3, rotation);
                cardView.node.runAction(cc.spawn(moveAction, rotateAction));
            } else {
                cardView.node.setPosition(newPosition);
                cardView.node.rotation = rotation;
            }
        }
    }
    
    // ==================== 交互处理 ====================
    
    /** 卡牌点击 */
    private onCardClicked(card: CardData): void {
        if (!this.isSelectable) return;
        
        // 如果点击的是已选中的卡牌，取消选中
        if (this.selectedCard && this.selectedCard.instanceId === card.instanceId) {
            this.deselectCard();
            return;
        }
        
        // 选中卡牌
        this.selectCard(card);
    }
    
    /** 选中卡牌 */
    public selectCard(card: CardData): void {
        // 取消之前的选中
        if (this.selectedCard) {
            const prevView = this.cardViews.get(this.selectedCard.instanceId);
            if (prevView) {
                prevView.setSelected(false);
            }
        }
        
        // 选中新卡牌
        this.selectedCard = card;
        const cardView = this.cardViews.get(card.instanceId);
        if (cardView) {
            cardView.setSelected(true);
        }
        
        // 回调
        if (this.selectCallback) {
            this.selectCallback(card);
        }
    }
    
    /** 取消选中 */
    public deselectCard(): void {
        if (this.selectedCard) {
            const cardView = this.cardViews.get(this.selectedCard.instanceId);
            if (cardView) {
                cardView.setSelected(false);
            }
        }
        
        this.selectedCard = null;
        
        if (this.selectCallback) {
            this.selectCallback(null);
        }
    }
    
    /** 拖拽开始 */
    private onDragStart(card: CardData, position: cc.Vec2): void {
        this.isDragging = true;
        this.draggingCard = card;
        
        // 抬起卡牌
        const cardView = this.cardViews.get(card.instanceId);
        if (cardView) {
            const worldPos = cardView.node.convertToWorldSpaceAR(cc.v2(0, 0));
            // 可以在这里添加视觉反馈
        }
    }
    
    /** 拖拽移动 */
    private onDragMove(card: CardData, position: cc.Vec2): void {
        if (!this.isDragging || !this.draggingCard) return;
        
        // 更新拖拽中的卡牌位置
        // 这里可以添加视觉反馈，如虚影等
    }
    
    /** 拖拽结束 */
    private onDragEnd(card: CardData, position: cc.Vec2): void {
        if (!this.isDragging || !this.draggingCard) return;
        
        // 检查是否拖拽到了战场区域
        if (this.playCallback) {
            this.playCallback(card, position);
        }
        
        this.isDragging = false;
        this.draggingCard = null;
    }
    
    // ==================== 状态设置 ====================
    
    /** 设置是否可选 */
    public setSelectable(selectable: boolean): void {
        this.isSelectable = selectable;
        
        for (const [id, view] of this.cardViews) {
            const card = this.handCards.find(c => c.instanceId === id);
            if (card) {
                view.setDisabled(!selectable || !card.canPlay(10)); // 需要根据实际水晶数判断
            }
        }
    }
    
    /** 根据水晶设置可用卡牌 */
    public updatePlayableCards(currentMana: number): void {
        for (const card of this.handCards) {
            const cardView = this.cardViews.get(card.instanceId);
            if (cardView) {
                cardView.setDisabled(!card.canPlay(currentMana));
            }
        }
    }
    
    // ==================== 回调设置 ====================
    
    /** 设置选卡回调 */
    public onCardSelected(callback: (card: CardData | null) => void): void {
        this.selectCallback = callback;
    }
    
    /** 设置出牌回调 */
    public onCardPlayed(callback: (card: CardData, position: cc.Vec2) => void): void {
        this.playCallback = callback;
    }
    
    // ==================== 工具方法 ====================
    
    /** 获取当前手牌数 */
    public getHandCount(): number {
        return this.handCards.length;
    }
    
    /** 获取选中的卡牌 */
    public getSelectedCard(): CardData | null {
        return this.selectedCard;
    }
    
    /** 获取所有手牌 */
    public getAllCards(): CardData[] {
        return [...this.handCards];
    }
}
