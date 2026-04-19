/**
 * 新手引导系统 - 管理游戏教程流程
 */

import { CardData } from './CardData';
import { SaveManager } from '../Data/SaveManager';

/** 引导步骤类型 */
export enum GuideStepType {
    /** 等待玩家操作 */
    WaitForInput = 'waitForInput',
    /** 显示提示 */
    ShowTip = 'showTip',
    /** 高亮目标 */
    Highlight = 'highlight',
    /** 等待条件满足 */
    WaitForCondition = 'waitForCondition',
    /** 完成 */
    Complete = 'complete'
}

/** 引导步骤配置 */
export interface GuideStep {
    id: string;
    type: GuideStepType;
    title: string;
    description: string;
    targetNode?: string;      // 高亮目标节点名称
    highlightRect?: {           // 高亮区域
        x: number;
        y: number;
        width: number;
        height: number;
    };
    expectedAction?: string;    // 期望的玩家操作
    condition?: () => boolean;  // 条件判定函数
    duration?: number;          // 持续时间（毫秒）
    arrowDirection?: 'up' | 'down' | 'left' | 'right';  // 箭头方向
}

/** 新手引导配置 */
export interface GuideConfig {
    guideId: string;
    name: string;
    steps: GuideStep[];
}

/** 新手引导系统 */
export class GuideSystem {
    /** 单例实例 */
    private static instance: GuideSystem;
    
    /** 存档管理器 */
    private saveManager: SaveManager;
    
    /** 引导配置 */
    private guideConfigs: Map<string, GuideConfig>;
    
    /** 当前进行的引导 */
    private currentGuide: GuideConfig | null = null;
    
    /** 当前步骤索引 */
    private currentStepIndex: number = 0;
    
    /** 是否正在进行引导 */
    private isRunning: boolean = false;
    
    /** 引导回调 */
    private stepCallback: ((step: GuideStep) => void) | null = null;
    
    /** 完成回调 */
    private completeCallback: ((guideId: string) => void) | null = null;
    
    /** 构造函数 */
    private constructor() {
        this.saveManager = SaveManager.getInstance();
        this.guideConfigs = this.createGuideConfigs();
    }
    
    /** 获取单例 */
    public static getInstance(): GuideSystem {
        if (!GuideSystem.instance) {
            GuideSystem.instance = new GuideSystem();
        }
        return GuideSystem.instance;
    }
    
    // ==================== 引导配置 ====================
    
    /** 创建引导配置 */
    private createGuideConfigs(): Map<string, GuideConfig> {
        const configs = new Map<string, GuideConfig>();
        
        // 新手教程引导
        configs.set('new_player_tutorial', {
            guideId: 'new_player_tutorial',
            name: '新手教程',
            steps: [
                {
                    id: 'step_welcome',
                    type: GuideStepType.ShowTip,
                    title: '欢迎来到萌系卡牌对战！',
                    description: '让我们一起学习游戏的基本操作吧！',
                    duration: 3000
                },
                {
                    id: 'step_intro_cards',
                    type: GuideStepType.ShowTip,
                    title: '卡牌介绍',
                    description: '这是你的手牌，每张卡牌都有不同的费用、攻击力和生命值',
                    duration: 4000
                },
                {
                    id: 'step_mana',
                    type: GuideStepType.ShowTip,
                    title: '水晶系统',
                    description: '这是你的水晶，消耗水晶可以召唤卡牌到战场，每回合水晶上限+1',
                    duration: 4000
                },
                {
                    id: 'step_play_card',
                    type: GuideStepType.Highlight,
                    title: '出牌教学',
                    description: '点击手牌选中，然后点击战场空位出牌',
                    targetNode: 'hand_card_0',
                    expectedAction: 'playCard'
                },
                {
                    id: 'step_element_intro',
                    type: GuideStepType.ShowTip,
                    title: '元素相克',
                    description: '火克木、木克水、水克火、光克暗！克制关系会造成1.5倍伤害',
                    duration: 5000
                },
                {
                    id: 'step_combo_intro',
                    type: GuideStepType.ShowTip,
                    title: '连携系统',
                    description: '同属性卡牌达到3张可以激活连携效果，5张效果更强！',
                    duration: 5000
                },
                {
                    id: 'step_attack',
                    type: GuideStepType.Highlight,
                    title: '攻击教学',
                    description: '点击我方战场上的卡牌选中，再点击敌方卡牌进行攻击',
                    targetNode: 'player_field_0',
                    expectedAction: 'attack'
                },
                {
                    id: 'step_end_turn',
                    type: GuideStepType.Highlight,
                    title: '结束回合',
                    description: '当回合结束或无法继续操作时，点击结束回合按钮',
                    targetNode: 'end_turn_button',
                    expectedAction: 'endTurn'
                },
                {
                    id: 'step_first_battle',
                    type: GuideStepType.ShowTip,
                    title: '开始战斗',
                    description: '恭喜你学会了基本操作！现在开始你的第一场对战吧！',
                    duration: 3000
                }
            ]
        });
        
        // 属性相克教程
        configs.set('element_tutorial', {
            guideId: 'element_tutorial',
            name: '元素相克教程',
            steps: [
                {
                    id: 'step_element_fire',
                    type: GuideStepType.ShowTip,
                    title: '火属性',
                    description: '火属性卡牌克制木属性，攻击木属性敌人时伤害提升50%',
                    duration: 4000
                },
                {
                    id: 'step_element_wood',
                    type: GuideStepType.ShowTip,
                    title: '木属性',
                    description: '木属性卡牌克制水属性，被火属性克制',
                    duration: 4000
                },
                {
                    id: 'step_element_water',
                    type: GuideStepType.ShowTip,
                    title: '水属性',
                    description: '水属性卡牌克制火属性，被木属性克制',
                    duration: 4000
                },
                {
                    id: 'step_element_light_shadow',
                    type: GuideStepType.ShowTip,
                    title: '光暗互克',
                    description: '光属性和暗属性互相克制，攻击对方时伤害提升50%',
                    duration: 4000
                }
            ]
        });
        
        // 连携系统教程
        configs.set('combo_tutorial', {
            guideId: 'combo_tutorial',
            name: '连携系统教程',
            steps: [
                {
                    id: 'step_combo_3',
                    type: GuideStepType.ShowTip,
                    title: '3张连携',
                    description: '同属性卡牌达到3张时，激活基础连携效果',
                    duration: 4000
                },
                {
                    id: 'step_combo_5',
                    type: GuideStepType.ShowTip,
                    title: '5张连携',
                    description: '同属性卡牌达到5张时，连携效果升级并解锁特殊能力',
                    duration: 4000
                },
                {
                    id: 'step_combo_example',
                    type: GuideStepType.ShowTip,
                    title: '火属性连携',
                    description: '火属性3张：攻击+10%\n火属性5张：攻击+20%，技能伤害+10%',
                    duration: 5000
                }
            ]
        });
        
        return configs;
    }
    
    /** 获取引导配置 */
    public getGuideConfig(guideId: string): GuideConfig | null {
        return this.guideConfigs.get(guideId) || null;
    }
    
    // ==================== 引导控制 ====================
    
    /** 检查引导是否已完成 */
    public isGuideCompleted(guideId: string): boolean {
        // 从存档中读取已完成引导
        const completedGuides = this.getCompletedGuides();
        return completedGuides.includes(guideId);
    }
    
    /** 获取已完成引导列表 */
    private getCompletedGuides(): string[] {
        // 简化实现：存储在localStorage
        const key = 'guide_completed';
        const saved = localStorage.getItem(key);
        return saved ? JSON.parse(saved) : [];
    }
    
    /** 标记引导完成 */
    private markGuideCompleted(guideId: string): void {
        const completed = this.getCompletedGuides();
        if (!completed.includes(guideId)) {
            completed.push(guideId);
            localStorage.setItem('guide_completed', JSON.stringify(completed));
        }
    }
    
    /** 开始引导 */
    public startGuide(guideId: string): boolean {
        if (this.isRunning) {
            console.warn('引导已在进行中');
            return false;
        }
        
        const config = this.getGuideConfig(guideId);
        if (!config) {
            console.warn(`引导配置不存在: ${guideId}`);
            return false;
        }
        
        // 检查是否已完成
        if (this.isGuideCompleted(guideId)) {
            console.log(`引导已完成: ${guideId}`);
            return false;
        }
        
        this.currentGuide = config;
        this.currentStepIndex = 0;
        this.isRunning = true;
        
        this.executeCurrentStep();
        
        return true;
    }
    
    /** 执行当前步骤 */
    private executeCurrentStep(): void {
        if (!this.currentGuide || this.currentStepIndex >= this.currentGuide.steps.length) {
            this.completeGuide();
            return;
        }
        
        const step = this.currentGuide.steps[this.currentStepIndex];
        
        if (this.stepCallback) {
            this.stepCallback(step);
        }
        
        // 根据步骤类型处理
        switch (step.type) {
            case GuideStepType.ShowTip:
                // 显示提示，等待duration后自动下一步
                if (step.duration) {
                    setTimeout(() => {
                        this.nextStep();
                    }, step.duration);
                } else {
                    this.nextStep();
                }
                break;
                
            case GuideStepType.WaitForInput:
                // 等待玩家操作
                break;
                
            case GuideStepType.Highlight:
                // 高亮目标，等待玩家操作
                break;
                
            case GuideStepType.WaitForCondition:
                // 检查条件
                if (step.condition && step.condition()) {
                    this.nextStep();
                } else {
                    // 定时检查条件
                    const checkInterval = setInterval(() => {
                        if (step.condition && step.condition()) {
                            clearInterval(checkInterval);
                            this.nextStep();
                        }
                    }, 500);
                }
                break;
                
            case GuideStepType.Complete:
                this.completeGuide();
                break;
        }
    }
    
    /** 下一步 */
    public nextStep(): void {
        if (!this.currentGuide) return;
        
        this.currentStepIndex++;
        
        if (this.currentStepIndex >= this.currentGuide.steps.length) {
            this.completeGuide();
        } else {
            this.executeCurrentStep();
        }
    }
    
    /** 完成引导 */
    private completeGuide(): void {
        if (!this.currentGuide) return;
        
        const guideId = this.currentGuide.guideId;
        
        this.markGuideCompleted(guideId);
        
        if (this.completeCallback) {
            this.completeCallback(guideId);
        }
        
        console.log(`引导完成: ${guideId}`);
        
        this.isRunning = false;
        this.currentGuide = null;
        this.currentStepIndex = 0;
    }
    
    /** 跳过引导 */
    public skipGuide(): void {
        if (!this.currentGuide) return;
        
        console.log(`跳过引导: ${this.currentGuide.guideId}`);
        
        this.markGuideCompleted(this.currentGuide.guideId);
        
        this.isRunning = false;
        this.currentGuide = null;
        this.currentStepIndex = 0;
    }
    
    /** 处理玩家操作 */
    public handlePlayerAction(action: string, data?: any): boolean {
        if (!this.isRunning || !this.currentGuide) {
            return false;
        }
        
        const step = this.currentGuide.steps[this.currentStepIndex];
        
        // 检查是否是期望的操作
        if (step.expectedAction && step.expectedAction === action) {
            this.nextStep();
            return true;
        }
        
        return false;
    }
    
    // ==================== 回调设置 ====================
    
    /** 设置步骤回调 */
    public onStep(callback: (step: GuideStep) => void): void {
        this.stepCallback = callback;
    }
    
    /** 设置完成回调 */
    public onComplete(callback: (guideId: string) => void): void {
        this.completeCallback = callback;
    }
    
    // ==================== 工具方法 ====================
    
    /** 是否正在进行引导 */
    public isGuideRunning(): boolean {
        return this.isRunning;
    }
    
    /** 获取当前引导信息 */
    public getCurrentGuideInfo(): { guideId: string; stepIndex: number; totalSteps: number; currentStep: GuideStep | null } | null {
        if (!this.currentGuide) return null;
        
        return {
            guideId: this.currentGuide.guideId,
            stepIndex: this.currentStepIndex,
            totalSteps: this.currentGuide.steps.length,
            currentStep: this.currentGuide.steps[this.currentStepIndex] || null
        };
    }
    
    /** 检查是否应该显示某引导 */
    public shouldShowGuide(guideId: string): boolean {
        // 检查是否已完成
        if (this.isGuideCompleted(guideId)) {
            return false;
        }
        
        // 检查前置引导是否完成（如果有）
        const config = this.getGuideConfig(guideId);
        if (!config) return false;
        
        return true;
    }
    
    /** 获取可用的引导列表 */
    public getAvailableGuides(): GuideConfig[] {
        const available: GuideConfig[] = [];
        
        for (const [id, config] of this.guideConfigs) {
            if (this.shouldShowGuide(id)) {
                available.push(config);
            }
        }
        
        return available;
    }
    
    /** 重置所有引导进度（用于测试） */
    public resetAllGuides(): void {
        localStorage.removeItem('guide_completed');
    }
}
