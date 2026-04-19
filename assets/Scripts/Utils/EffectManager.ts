/**
 * 特效管理器 - 管理游戏中的粒子特效和动画
 */

import { ElementType, Rarity } from '../Core/Types';

/** 特效类型 */
export enum EffectType {
    /** 卡牌出场 */
    CardEntrance = 'card_entrance',
    /** 卡牌攻击 */
    CardAttack = 'card_attack',
    /** 卡牌受击 */
    CardDamage = 'card_damage',
    /** 卡牌死亡 */
    CardDeath = 'card_death',
    /** 水晶充能 */
    ManaCharge = 'mana_charge',
    /** 能量涌动 */
    EnergyFlow = 'energy_flow',
    /** 回合切换 */
    TurnChange = 'turn_change',
    /** 技能特效 */
    SkillEffect = 'skill_effect',
    /** 伤害数字 */
    DamageNumber = 'damage_number',
    /** 治疗数字 */
    HealNumber = 'heal_number',
    /** 护盾特效 */
    ShieldEffect = 'shield_effect',
    /** 元素克制 */
    ElementCounter = 'element_counter',
    /** 连携激活 */
    ComboActivate = 'combo_activate',
    /** 稀有度光效 */
    RarityGlow = 'rarity_glow'
}

/** 特效配置 */
interface EffectConfig {
    duration: number;      // 持续时间（秒）
    particle?: boolean;     // 是否使用粒子
    color?: string;         // 特效颜色
    scale?: number;         // 缩放
}

/** 特效管理器 */
export class EffectManager {
    /** 单例实例 */
    private static instance: EffectManager;
    
    /** 活跃特效计数 */
    private activeEffects: number = 0;
    
    /** 构造函数 */
    private constructor() {}
    
    /** 获取单例 */
    public static getInstance(): EffectManager {
        if (!EffectManager.instance) {
            EffectManager.instance = new EffectManager();
        }
        return EffectManager.instance;
    }
    
    /** 初始化 */
    public init(): void {
        console.log('特效管理器初始化完成');
    }
    
    // ==================== 特效播放接口 ====================
    
    /** 播放卡牌出场特效 */
    public playCardEntrance(position: { x: number; y: number }, callback?: () => void): void {
        console.log(`播放卡牌出场特效 at (${position.x}, ${position.y})`);
        this.playEffect(EffectType.CardEntrance, position, callback);
    }
    
    /** 播放卡牌攻击特效 */
    public playCardAttack(from: { x: number; y: number }, to: { x: number; y: number }, callback?: () => void): void {
        console.log(`播放卡牌攻击特效 from (${from.x}, ${from.y}) to (${to.x}, ${to.y})`);
        this.playEffect(EffectType.CardAttack, { from, to }, callback);
    }
    
    /** 播放卡牌受击特效 */
    public playCardDamage(position: { x: number; y: number }, callback?: () => void): void {
        console.log(`播放卡牌受击特效 at (${position.x}, ${position.y})`);
        this.playEffect(EffectType.CardDamage, position, callback);
    }
    
    /** 播放卡牌死亡特效 */
    public playCardDeath(position: { x: number; y: number }, callback?: () => void): void {
        console.log(`播放卡牌死亡特效 at (${position.x}, ${position.y})`);
        this.playEffect(EffectType.CardDeath, position, callback);
    }
    
    /** 播放水晶充能特效 */
    public playManaCharge(position: { x: number; y: number }, callback?: () => void): void {
        console.log(`播放水晶充能特效 at (${position.x}, ${position.y})`);
        this.playEffect(EffectType.ManaCharge, position, callback);
    }
    
    /** 播放能量涌动特效 */
    public playEnergyFlow(position: { x: number; y: number }, callback?: () => void): void {
        console.log(`播放能量涌动特效 at (${position.x}, ${position.y})`);
        this.playEffect(EffectType.EnergyFlow, position, callback);
    }
    
    /** 播放回合切换特效 */
    public playTurnChange(isPlayerTurn: boolean, callback?: () => void): void {
        console.log(`播放回合切换特效, 是否玩家回合: ${isPlayerTurn}`);
        this.playEffect(EffectType.TurnChange, { isPlayerTurn }, callback);
    }
    
    /** 播放技能特效 */
    public playSkillEffect(position: { x: number; y: number }, element: ElementType, callback?: () => void): void {
        console.log(`播放技能特效 at (${position.x}, ${position.y}), 元素: ${element}`);
        this.playEffect(EffectType.SkillEffect, { position, element }, callback);
    }
    
    /** 播放伤害数字 */
    public playDamageNumber(position: { x: number; y: number }, damage: number, isCritical: boolean = false): void {
        console.log(`播放伤害数字: ${damage}${isCritical ? '(暴击!)' : ''} at (${position.x}, ${position.y})`);
        this.playEffect(EffectType.DamageNumber, { position, damage, isCritical });
    }
    
    /** 播放治疗数字 */
    public playHealNumber(position: { x: number; y: number }, amount: number): void {
        console.log(`播放治疗数字: ${amount} at (${position.x}, ${position.y})`);
        this.playEffect(EffectType.HealNumber, { position, amount });
    }
    
    /** 播放护盾特效 */
    public playShieldEffect(position: { x: number; y: number }, callback?: () => void): void {
        console.log(`播放护盾特效 at (${position.x}, ${position.y})`);
        this.playEffect(EffectType.ShieldEffect, position, callback);
    }
    
    /** 播放元素克制特效 */
    public playElementCounter(position: { x: number; y: number }, element: ElementType, isEffective: boolean): void {
        console.log(`播放元素克制特效${isEffective ? '(克制)' : '(被克)'} at (${position.x}, ${position.y})`);
        this.playEffect(EffectType.ElementCounter, { position, element, isEffective });
    }
    
    /** 播放连携激活特效 */
    public playComboActivate(element: ElementType, callback?: () => void): void {
        console.log(`播放连携激活特效, 元素: ${element}`);
        this.playEffect(EffectType.ComboActivate, { element }, callback);
    }
    
    /** 播放稀有度光效 */
    public playRarityGlow(position: { x: number; y: number }, rarity: Rarity, callback?: () => void): void {
        console.log(`播放稀有度光效: ${rarity} at (${position.x}, ${position.y})`);
        this.playEffect(EffectType.RarityGlow, { position, rarity }, callback);
    }
    
    // ==================== 内部方法 ====================
    
    /** 播放特效（通用方法） */
    private playEffect(type: EffectType, data: any, callback?: () => void): void {
        this.activeEffects++;
        
        const config = this.getEffectConfig(type);
        const duration = config?.duration || 0.5;
        
        // 模拟异步特效播放
        setTimeout(() => {
            this.activeEffects--;
            if (callback) {
                callback();
            }
        }, duration * 1000);
    }
    
    /** 获取特效配置 */
    private getEffectConfig(type: EffectType): EffectConfig {
        switch (type) {
            case EffectType.CardEntrance:
                return { duration: 0.3, particle: true };
            case EffectType.CardAttack:
                return { duration: 0.2, particle: true };
            case EffectType.CardDamage:
                return { duration: 0.2, particle: true, color: '#FF0000' };
            case EffectType.CardDeath:
                return { duration: 0.5, particle: true };
            case EffectType.ManaCharge:
                return { duration: 0.3, particle: true, color: '#339AF0' };
            case EffectType.EnergyFlow:
                return { duration: 0.4, particle: true, color: '#FFE066' };
            case EffectType.TurnChange:
                return { duration: 0.3, scale: 1.2 };
            case EffectType.SkillEffect:
                return { duration: 2.0, particle: true };
            case EffectType.DamageNumber:
                return { duration: 0.8, scale: 1.5 };
            case EffectType.HealNumber:
                return { duration: 0.8, scale: 1.5, color: '#51CF66' };
            case EffectType.ShieldEffect:
                return { duration: 0.4, particle: true, color: '#339AF0' };
            case EffectType.ElementCounter:
                return { duration: 0.5, particle: true };
            case EffectType.ComboActivate:
                return { duration: 1.0, particle: true };
            case EffectType.RarityGlow:
                return { duration: 1.5, particle: true };
            default:
                return { duration: 0.5 };
        }
    }
    
    /** 获取活跃特效数量 */
    public getActiveEffectCount(): number {
        return this.activeEffects;
    }
    
    /** 是否正在播放特效 */
    public isPlayingEffect(): boolean {
        return this.activeEffects > 0;
    }
    
    /** 清除所有特效 */
    public clearAllEffects(): void {
        this.activeEffects = 0;
        console.log('清除所有特效');
    }
    
    // ==================== 震动效果 ====================
    
    /** 屏幕震动 */
    public screenShake(intensity: number = 5, duration: number = 0.2): void {
        console.log(`屏幕震动: 强度${intensity}, 时长${duration}s`);
        // 实际实现需要操作相机或节点位置
        // const camera = cc.find('Main Camera');
        // const originalPos = camera.position;
        // const shakeAction = cc.sequence(
        //     cc.moveBy(duration, cc.v2(intensity, intensity)),
        //     cc.moveBy(duration, cc.v2(-intensity * 2, -intensity)),
        //     cc.moveBy(duration, cc.v2(intensity, -intensity)),
        //     cc.moveTo(duration, originalPos)
        // );
        // camera.runAction(shakeAction);
    }
}
