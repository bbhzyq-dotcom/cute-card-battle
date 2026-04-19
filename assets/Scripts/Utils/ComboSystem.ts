/**
 * 连携系统 - 检测和应用连携效果
 */

import { ElementType, ComboType, COMBO_EFFECTS } from '../Core/Types';
import { CardData } from '../Core/CardData';

/** 连携效果 */
export interface ComboEffect {
    element: ElementType;
    type: ComboType;
    attackBonus: number;    // 攻击加成百分比
    healthBonus: number;     // 生命加成百分比
    defenseBonus: number;    // 防御加成百分比
    specialEffect: string | null;  // 特殊效果ID
    specialValue: number;    // 特殊效果值
    description: string;     // 效果描述
}

/** 连携系统 */
export class ComboSystem {
    /** 激活的连携效果 */
    private activeCombos: ComboEffect[] = [];
    
    /** 构造函数 */
    constructor() {
        this.activeCombos = [];
    }
    
    /** 统计套牌中各元素数量 */
    public countElements(deck: CardData[]): Map<ElementType, number> {
        const counts = new Map<ElementType, number>();
        
        for (const card of deck) {
            const currentCount = counts.get(card.element) || 0;
            counts.set(card.element, currentCount + 1);
        }
        
        return counts;
    }
    
    /** 检测激活的连携效果 */
    public checkActiveCombos(deck: CardData[]): ComboEffect[] {
        const elementCounts = this.countElements(deck);
        const combos: ComboEffect[] = [];
        
        for (const [element, count] of elementCounts) {
            if (count >= 5) {
                // 5张连携
                combos.push(this.createComboEffect(element, ComboType.High));
            } else if (count >= 3) {
                // 3张连携
                combos.push(this.createComboEffect(element, ComboType.Low));
            }
        }
        
        this.activeCombos = combos;
        return combos;
    }
    
    /** 创建连携效果 */
    private createComboEffect(element: ElementType, type: ComboType): ComboEffect {
        const comboConfig = COMBO_EFFECTS[element];
        const config = type === ComboType.High ? comboConfig.high : comboConfig.low;
        
        return {
            element: element,
            type: type,
            attackBonus: config.attackBonus || 0,
            healthBonus: config.healthBonus || 0,
            defenseBonus: (config as any).defenseBonus || 0,
            specialEffect: config.special || null,
            specialValue: config.specialValue || 0,
            description: config.desc
        };
    }
    
    /** 获取元素加成 */
    public getElementBonus(element: ElementType): { attack: number; health: number; defense: number } {
        const combo = this.activeCombos.find(c => c.element === element);
        if (!combo) {
            return { attack: 0, health: 0, defense: 0 };
        }
        
        return {
            attack: combo.attackBonus,
            health: combo.healthBonus,
            defense: combo.defenseBonus
        };
    }
    
    /** 检查是否有特殊效果 */
    public hasSpecialEffect(element: ElementType, effectId: string): boolean {
        const combo = this.activeCombos.find(c => c.element === element);
        return combo !== undefined && combo.specialEffect === effectId;
    }
    
    /** 获取特殊效果值 */
    public getSpecialValue(element: ElementType, effectId: string): number {
        const combo = this.activeCombos.find(c => c.element === element);
        if (!combo || combo.specialEffect !== effectId) {
            return 0;
        }
        return combo.specialValue;
    }
    
    /** 应用连携攻击加成 */
    public applyAttackBonus(baseAttack: number, element: ElementType): number {
        const bonus = this.getElementBonus(element);
        return Math.floor(baseAttack * (1 + bonus.attack));
    }
    
    /** 应用连携生命加成 */
    public applyHealthBonus(baseHealth: number, element: ElementType): number {
        const bonus = this.getElementBonus(element);
        return Math.floor(baseHealth * (1 + bonus.health));
    }
    
    /** 检查是否有复活效果 */
    public hasResurrection(element: ElementType): boolean {
        return this.hasSpecialEffect(element, 'resurrect');
    }
    
    /** 检查是否有暴击加成 */
    public getCritBonus(element: ElementType): number {
        if (this.hasSpecialEffect(element, 'critBonus')) {
            return this.getSpecialValue(element, 'critBonus');
        }
        return 0;
    }
    
    /** 检查是否有击杀回水晶效果 */
    public getManaSteal(element: ElementType): number {
        if (this.hasSpecialEffect(element, 'manaSteal')) {
            return this.getSpecialValue(element, 'manaSteal');
        }
        return 0;
    }
    
    /** 检查是否有每回合治疗效果 */
    public getHealPerTurn(element: ElementType): number {
        if (this.hasSpecialEffect(element, 'healPerTurn')) {
            return this.getSpecialValue(element, 'healPerTurn');
        }
        return 0;
    }
    
    /** 获取所有激活的连携效果描述 */
    public getActiveComboDescriptions(): string[] {
        return this.activeCombos.map(combo => {
            const elementName = this.getElementName(combo.element);
            const typeName = combo.type === ComboType.High ? '5张' : '3张';
            return `${typeName}${elementName}：${combo.description}`;
        });
    }
    
    /** 获取元素中文名称 */
    private getElementName(element: ElementType): string {
        switch (element) {
            case ElementType.Fire: return '火';
            case ElementType.Wood: return '木';
            case ElementType.Water: return '水';
            case ElementType.Light: return '光';
            case ElementType.Shadow: return '暗';
            default: return '';
        }
    }
    
    /** 获取当前激活的连携效果 */
    public getActiveCombos(): ComboEffect[] {
        return [...this.activeCombos];
    }
    
    /** 重置连携效果 */
    public reset(): void {
        this.activeCombos = [];
    }
}
