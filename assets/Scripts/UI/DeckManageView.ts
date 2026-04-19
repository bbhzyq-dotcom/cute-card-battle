/**
 * 套牌管理视图 - 管理卡组编辑和选择
 */

import { CardData } from '../Core/CardData';
import { SaveManager, DeckData, OwnedCard } from '../Data/SaveManager';
import { CARD_CONFIGS, CardConfig } from '../Data/CardConfigs';
import { ElementType, RoleType, Rarity, RARITY_COLORS } from '../Core/Types';
import { UIManager } from './UIManager';
import { GameConfig } from '../Config/GameConfig';

/** 套牌管理视图 */
const { ccclass, property } = cc._decorator;

@ccclass
export class DeckManageView extends cc.Component {
    /** 返回按钮 */
    @property(cc.Button)
    backButton: cc.Button = null;
    
    /** 套牌列表容器 */
    @property(cc.Node)
    deckListContainer: cc.Node = null;
    
    /** 套牌名称输入 */
    @property(cc.EditBox)
    deckNameInput: cc.EditBox = null;
    
    /** 卡牌列表容器 */
    @property(cc.Node)
    cardListContainer: cc.Node = null;
    
    /** 当前套牌卡牌容器 */
    @property(cc.Node)
    currentDeckContainer: cc.Node = null;
    
    /** 确定按钮 */
    @property(cc.Button)
    confirmButton: cc.Button = null;
    
    /** 创建新套牌按钮 */
    @property(cc.Button)
    createButton: cc.Button = null;
    
    /** 删除套牌按钮 */
    @property(cc.Button)
    deleteButton: cc.Button = null;
    
    /** 套牌信息标签 */
    @property(cc.Label)
    deckInfoLabel: cc.Label = null;
    
    /** 数据引用 */
    private saveManager: SaveManager | null = null;
    
    /** 所有套牌 */
    private allDecks: DeckData[] = [];
    
    /** 当前选中的套牌 */
    private selectedDeckId: string = '';
    
    /** 当前编辑的卡牌列表 */
    private currentDeckCards: string[] = [];
    
    /** 回调 */
    private backCallback: (() => void) | null = null;
    private confirmCallback: ((deckId: string) => void) | null = null;
    
    /** onLoad */
    onLoad() {
        this.saveManager = SaveManager.getInstance();
        this.setupButtons();
    }
    
    /** start */
    start() {
        this.loadDecks();
    }
    
    /** 设置按钮事件 */
    private setupButtons(): void {
        if (this.backButton) {
            const event = new cc.Component.EventHandler();
            event.target = this.node;
            event.component = 'DeckManageView';
            event.handler = 'onBackClicked';
            this.backButton.clickEvents.push(event);
        }
        
        if (this.confirmButton) {
            const event = new cc.Component.EventHandler();
            event.target = this.node;
            event.component = 'DeckManageView';
            event.handler = 'onConfirmClicked';
            this.confirmButton.clickEvents.push(event);
        }
        
        if (this.createButton) {
            const event = new cc.Component.EventHandler();
            event.target = this.node;
            event.component = 'DeckManageView';
            event.handler = 'onCreateClicked';
            this.createButton.clickEvents.push(event);
        }
        
        if (this.deleteButton) {
            const event = new cc.Component.EventHandler();
            event.target = this.node;
            event.component = 'DeckManageView';
            event.handler = 'onDeleteClicked';
            this.deleteButton.clickEvents.push(event);
        }
    }
    
    /** 加载套牌列表 */
    public loadDecks(): void {
        if (!this.saveManager) return;
        
        this.allDecks = this.saveManager.getAllDecks();
        
        // 清空列表
        if (this.deckListContainer) {
            this.deckListContainer.removeAllChildren();
        }
        
        // 创建套牌项
        for (const deck of this.allDecks) {
            this.createDeckItem(deck);
        }
        
        // 默认选中第一个
        if (this.allDecks.length > 0) {
            this.selectDeck(this.allDecks[0].id);
        }
    }
    
    /** 创建套牌列表项 */
    private createDeckItem(deck: DeckData): void {
        const itemNode = new cc.Node('DeckItem');
        itemNode.parent = this.deckListContainer;
        
        // 添加背景
        const bg = itemNode.addComponent(cc.Sprite);
        bg.type = cc.Sprite.Type.SLICED;
        bg.sizeMode = cc.Sprite.SizeMode.RAW;
        itemNode.setContentSize(200, 60);
        
        // 添加名称标签
        const nameLabel = itemNode.addComponent(cc.Label);
        nameLabel.string = deck.name;
        nameLabel.fontSize = 18;
        nameLabel.horizontalAlign = cc.Label.HorizontalAlign.LEFT;
        nameLabel.node.setPosition(-60, 0);
        
        // 添加卡牌数量
        const countLabel = itemNode.addComponent(cc.Label);
        countLabel.string = `${deck.cardIds.length}张`;
        countLabel.fontSize = 14;
        countLabel.horizontalAlign = cc.Label.HorizontalAlign.RIGHT;
        countLabel.node.setPosition(60, 0);
        countLabel.node.color = cc.Color.GRAY;
        
        // 添加点击事件
        const button = itemNode.addComponent(cc.Button);
        const clickEvent = new cc.Component.EventHandler();
        clickEvent.target = this.node;
        clickEvent.component = 'DeckManageView';
        clickEvent.handler = 'onDeckItemClicked';
        clickEvent.customEventData = deck.id;
        button.clickEvents.push(clickEvent);
    }
    
    /** 套牌项点击 */
    public onDeckItemClicked(event: cc.Component.EventHandler, deckId: string): void {
        this.selectDeck(deckId);
    }
    
    /** 选中套牌 */
    private selectDeck(deckId: string): void {
        this.selectedDeckId = deckId;
        
        const deck = this.allDecks.find(d => d.id === deckId);
        if (deck) {
            this.currentDeckCards = [...deck.cardIds];
            this.updateDeckDisplay();
            this.updateCardList();
        }
    }
    
    /** 更新套牌显示 */
    private updateDeckDisplay(): void {
        // 更新名称
        if (this.deckNameInput) {
            const deck = this.allDecks.find(d => d.id === this.selectedDeckId);
            if (deck) {
                this.deckNameInput.string = deck.name;
            }
        }
        
        // 清空当前套牌容器
        if (this.currentDeckContainer) {
            this.currentDeckContainer.removeAllChildren();
        }
        
        // 显示当前套牌的卡牌
        for (const baseId of this.currentDeckCards) {
            this.addCardToDeckDisplay(baseId);
        }
        
        // 更新套牌信息
        this.updateDeckInfo();
    }
    
    /** 添加卡牌到套牌显示 */
    private addCardToDeckDisplay(baseId: string): void {
        const config = CARD_CONFIGS.find(c => c.baseId === baseId);
        if (!config) return;
        
        const cardNode = new cc.Node('DeckCard');
        cardNode.parent = this.currentDeckContainer;
        cardNode.setContentSize(60, 80);
        
        // 背景
        const bg = cardNode.addComponent(cc.Sprite);
        bg.type = cc.Sprite.Type.SLICED;
        bg.color = cc.color().fromHEX(RARITY_COLORS[config.rarity]);
        cardNode.setContentSize(50, 70);
        
        // 名称
        const nameLabel = cardNode.addComponent(cc.Label);
        nameLabel.string = config.name.substring(0, 3);
        nameLabel.fontSize = 10;
        nameLabel.verticalAlign = cc.Label.VerticalAlign.BOTTOM;
        nameLabel.node.setPosition(0, -20);
        
        // 费用
        const costLabel = cardNode.addComponent(cc.Label);
        costLabel.string = config.cost.toString();
        costLabel.fontSize = 12;
        costLabel.node.setPosition(-15, 20);
        costLabel.node.color = cc.Color.WHITE;
    }
    
    /** 更新卡牌列表 */
    private updateCardList(): void {
        if (!this.cardListContainer) return;
        
        this.cardListContainer.removeAllChildren();
        
        // 获取玩家拥有的卡牌
        const ownedCards = this.saveManager?.getOwnedCards() || [];
        
        for (const owned of ownedCards) {
            const config = CARD_CONFIGS.find(c => c.baseId === owned.baseId);
            if (!config) continue;
            
            this.createCardListItem(config, owned.count);
        }
    }
    
    /** 创建卡牌列表项 */
    private createCardListItem(config: CardConfig, count: number): void {
        const itemNode = new cc.Node('CardItem');
        itemNode.parent = this.cardListContainer;
        itemNode.setContentSize(80, 100);
        
        // 背景
        const bg = itemNode.addComponent(cc.Sprite);
        bg.type = cc.Sprite.Type.SLICED;
        bg.color = cc.color().fromHEX(RARITY_COLORS[config.rarity]);
        
        // 名称
        const nameLabel = itemNode.addComponent(cc.Label);
        nameLabel.string = config.name;
        nameLabel.fontSize = 12;
        nameLabel.verticalAlign = cc.Label.VerticalAlign.BOTTOM;
        nameLabel.node.setAnchorPoint(0.5, 0);
        nameLabel.node.setPosition(0, 5);
        nameLabel.overflow = cc.Label.Overflow.SHRINK;
        nameLabel.node.setContentSize(75, 20);
        
        // 费用/攻击/生命
        const statsLabel = itemNode.addComponent(cc.Label);
        statsLabel.string = `${config.cost}/${config.attack}/${config.health}`;
        statsLabel.fontSize = 10;
        statsLabel.node.setPosition(0, -15);
        
        // 数量
        const countLabel = itemNode.addComponent(cc.Label);
        countLabel.string = `x${count}`;
        countLabel.fontSize = 10;
        countLabel.horizontalAlign = cc.Label.HorizontalAlign.RIGHT;
        countLabel.node.setPosition(25, 30);
        countLabel.node.color = cc.Color.GREEN;
        
        // 点击事件：添加到套牌
        const button = itemNode.addComponent(cc.Button);
        const clickEvent = new cc.Component.EventHandler();
        clickEvent.target = this.node;
        clickEvent.component = 'DeckManageView';
        clickEvent.handler = 'onAddCardClicked';
        clickEvent.customEventData = config.baseId;
        button.clickEvents.push(clickEvent);
        
        // 右键点击：从套牌移除
        itemNode.on(cc.Node.EventType.MOUSE_DOWN, (event: cc.Event.EventMouse) => {
            if (event.getButton() === cc.Event.EventMouse.BUTTON_RIGHT) {
                this.onRemoveCardClicked(event, config.baseId);
            }
        });
    }
    
    /** 添加卡牌到当前套牌 */
    public onAddCardClicked(event: cc.Component.EventHandler, baseId: string): void {
        if (this.currentDeckCards.length >= GameConfig.DECK_RECOMMENDED_SIZE) {
            return;
        }
        
        this.currentDeckCards.push(baseId);
        this.updateDeckDisplay();
    }
    
    /** 从当前套牌移除卡牌 */
    public onRemoveCardClicked(event: cc.Event.EventMouse, baseId: string): void {
        const index = this.currentDeckCards.indexOf(baseId);
        if (index !== -1) {
            this.currentDeckCards.splice(index, 1);
            this.updateDeckDisplay();
        }
    }
    
    /** 更新套牌信息 */
    private updateDeckInfo(): void {
        if (!this.deckInfoLabel) return;
        
        const errors: string[] = [];
        
        // 检查数量
        if (this.currentDeckCards.length !== GameConfig.DECK_RECOMMENDED_SIZE) {
            errors.push(`需要${GameConfig.DECK_RECOMMENDED_SIZE}张卡牌`);
        }
        
        // 检查水晶费用曲线
        const costs = this.currentDeckCards.map(id => {
            const config = CARD_CONFIGS.find(c => c.baseId === id);
            return config ? config.cost : 0;
        });
        
        const lowCostCount = costs.filter(c => c <= 3).length;
        if (lowCostCount < GameConfig.MIN_LOW_COST_CARDS) {
            errors.push(`低费卡不足（需要${GameConfig.MIN_LOW_COST_CARDS}张）`);
        }
        
        if (errors.length > 0) {
            this.deckInfoLabel.string = errors.join('\n');
            this.deckInfoLabel.node.color = cc.Color.RED;
        } else {
            this.deckInfoLabel.string = '套牌有效';
            this.deckInfoLabel.node.color = cc.Color.GREEN;
        }
    }
    
    // ==================== 按钮事件 ====================
    
    /** 返回按钮 */
    public onBackClicked(): void {
        if (this.backCallback) {
            this.backCallback();
        }
    }
    
    /** 确定按钮 */
    public onConfirmClicked(): void {
        if (this.currentDeckCards.length !== GameConfig.DECK_RECOMMENDED_SIZE) {
            return;
        }
        
        const name = this.deckNameInput?.string || '套牌';
        
        if (this.selectedDeckId) {
            // 更新现有套牌
            this.saveManager?.updateDeck(this.selectedDeckId, this.currentDeckCards);
        } else {
            // 创建新套牌
            const newDeck = this.saveManager?.createDeck(name, this.currentDeckCards);
            if (newDeck) {
                this.selectedDeckId = newDeck.id;
            }
        }
        
        if (this.confirmCallback) {
            this.confirmCallback(this.selectedDeckId);
        }
    }
    
    /** 创建新套牌按钮 */
    public onCreateClicked(): void {
        this.selectedDeckId = '';
        this.currentDeckCards = [];
        this.updateDeckDisplay();
        
        if (this.deckNameInput) {
            this.deckNameInput.string = '新套牌';
        }
    }
    
    /** 删除套牌按钮 */
    public onDeleteClicked(): void {
        if (!this.selectedDeckId || this.allDecks.length <= 1) {
            return;
        }
        
        this.saveManager?.deleteDeck(this.selectedDeckId);
        this.loadDecks();
    }
    
    // ==================== 回调设置 ====================
    
    /** 设置返回回调 */
    public onBack(callback: () => void): void {
        this.backCallback = callback;
    }
    
    /** 设置确认回调 */
    public onConfirm(callback: (deckId: string) => void): void {
        this.confirmCallback = callback;
    }
}
