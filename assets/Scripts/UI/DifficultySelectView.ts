/**
 * 难度选择视图 - 选择AI对战难度
 */

import { Difficulty } from '../Core/Types';
import { DIFFICULTY_NAMES, DIFFICULTY_COLORS, GameConfig } from '../Config/GameConfig';

/** 难度选择视图 */
const { ccclass, property } = cc._decorator;

@ccclass
export class DifficultySelectView extends cc.Component {
    /** 难度选项容器 */
    @property(cc.Node)
    optionsContainer: cc.Node = null;
    
    /** 返回按钮 */
    @property(cc.Button)
    backButton: cc.Button = null;
    
    /** 确认按钮 */
    @property(cc.Button)
    confirmButton: cc.Button = null;
    
    /** 难度描述标签 */
    @property(cc.Label)
    descriptionLabel: cc.Label = null;
    
    /** 当前选中的难度 */
    private selectedDifficulty: Difficulty = Difficulty.Normal;
    
    /** 难度按钮列表 */
    private difficultyButtons: Map<Difficulty, cc.Button> = new Map();
    
    /** 回调 */
    private selectCallback: ((difficulty: Difficulty) => void) | null = null;
    private backCallback: (() => void) | null = null;
    
    /** onLoad */
    onLoad() {
        this.setupButtons();
    }
    
    /** start */
    start() {
        this.createDifficultyOptions();
        this.updateSelection();
    }
    
    /** 设置按钮事件 */
    private setupButtons(): void {
        if (this.backButton) {
            const event = new cc.Component.EventHandler();
            event.target = this.node;
            event.component = 'DifficultySelectView';
            event.handler = 'onBackClicked';
            this.backButton.clickEvents.push(event);
        }
        
        if (this.confirmButton) {
            const event = new cc.Component.EventHandler();
            event.target = this.node;
            event.component = 'DifficultySelectView';
            event.handler = 'onConfirmClicked';
            this.confirmButton.clickEvents.push(event);
        }
    }
    
    /** 创建难度选项 */
    private createDifficultyOptions(): void {
        if (!this.optionsContainer) return;
        
        const difficulties = [
            { difficulty: Difficulty.Beginner, desc: '入门级，适合新手' },
            { difficulty: Difficulty.Easy, desc: '简单，AI会犯错误' },
            { difficulty: Difficulty.Normal, desc: '普通，标准AI策略' },
            { difficulty: Difficulty.Hard, desc: '困难，AI套牌增强' },
            { difficulty: Difficulty.Master, desc: '大师，AI会预判' }
        ];
        
        for (let i = 0; i < difficulties.length; i++) {
            const { difficulty, desc } = difficulties[i];
            
            const buttonNode = new cc.Node(`Difficulty_${difficulty}`);
            buttonNode.parent = this.optionsContainer;
            buttonNode.setContentSize(200, 80);
            
            // 背景
            const bg = buttonNode.addComponent(cc.Sprite);
            bg.type = cc.Sprite.Type.SLICED;
            bg.sizeMode = cc.Sprite.SizeMode.RAW;
            
            // 名称标签
            const nameLabel = buttonNode.addComponent(cc.Label);
            nameLabel.string = DIFFICULTY_NAMES[difficulty];
            nameLabel.fontSize = 20;
            nameLabel.horizontalAlign = cc.Label.HorizontalAlign.CENTER;
            nameLabel.node.setPosition(0, 10);
            
            // 描述标签
            const descLabel = buttonNode.addComponent(cc.Label);
            descLabel.string = desc;
            descLabel.fontSize = 12;
            descLabel.node.color = cc.Color.GRAY;
            descLabel.horizontalAlign = cc.Label.HorizontalAlign.CENTER;
            descLabel.node.setPosition(0, -15);
            
            // 按钮组件
            const button = buttonNode.addComponent(cc.Button);
            
            // 点击事件
            const clickEvent = new cc.Component.EventHandler();
            clickEvent.target = this.node;
            clickEvent.component = 'DifficultySelectView';
            clickEvent.handler = 'onDifficultyClicked';
            clickEvent.customEventData = difficulty.toString();
            button.clickEvents.push(clickEvent);
            
            this.difficultyButtons.set(difficulty, button);
        }
    }
    
    /** 难度按钮点击 */
    public onDifficultyClicked(event: cc.Component.EventHandler, difficultyStr: string): void {
        const difficulty = parseInt(difficultyStr) as Difficulty;
        this.selectedDifficulty = difficulty;
        this.updateSelection();
    }
    
    /** 更新选择状态 */
    private updateSelection(): void {
        for (const [difficulty, button] of this.difficultyButtons) {
            const isSelected = difficulty === this.selectedDifficulty;
            
            // 更新背景颜色
            const sprite = button.node.getComponent(cc.Sprite);
            if (sprite) {
                const color = isSelected ? 
                    cc.color().fromHEX(DIFFICULTY_COLORS[difficulty]) : 
                    cc.color().fromHEX('#333333');
                sprite.color = color;
            }
            
            // 缩放
            const targetScale = isSelected ? 1.1 : 1.0;
            button.node.stopAllActions();
            button.node.runAction(cc.scaleTo(0.2, targetScale));
        }
        
        // 更新描述
        if (this.descriptionLabel) {
            const descriptions: Record<Difficulty, string> = {
                [Difficulty.Beginner]: '入门级：AI随机出牌，适合首次体验游戏',
                [Difficulty.Easy]: '简单：AI有80%概率做出正确决策，适合练习',
                [Difficulty.Normal]: '普通：AI使用标准策略，适合正常对战',
                [Difficulty.Hard]: '困难：AI套牌强度提升至120%，适合挑战',
                [Difficulty.Master]: '大师：AI会预判玩家操作，适合高手切磋'
            };
            this.descriptionLabel.string = descriptions[this.selectedDifficulty];
        }
    }
    
    // ==================== 按钮事件 ====================
    
    /** 返回按钮 */
    public onBackClicked(): void {
        if (this.backCallback) {
            this.backCallback();
        }
    }
    
    /** 确认按钮 */
    public onConfirmClicked(): void {
        if (this.selectCallback) {
            this.selectCallback(this.selectedDifficulty);
        }
    }
    
    // ==================== 回调设置 ====================
    
    /** 设置选择回调 */
    public onSelect(callback: (difficulty: Difficulty) => void): void {
        this.selectCallback = callback;
    }
    
    /** 设置返回回调 */
    public onBack(callback: () => void): void {
        this.backCallback = callback;
    }
}
