/**
 * 游戏核心枚举和常量定义
 */

/** 元素属性类型 */
export enum ElementType {
    Fire = 'fire',   // 火 - 克制木
    Wood = 'wood',   // 木 - 克制水
    Water = 'water', // 水 - 克制火
    Light = 'light', // 光 - 克制暗
    Shadow = 'shadow' // 暗 - 克制光
}

/** 元素克制关系映射 */
export const ELEMENT_COUNTER: Record<ElementType, ElementType> = {
    [ElementType.Fire]: ElementType.Wood,
    [ElementType.Wood]: ElementType.Water,
    [ElementType.Water]: ElementType.Fire,
    [ElementType.Light]: ElementType.Shadow,
    [ElementType.Shadow]: ElementType.Light
};

/** 获取元素克制倍率 */
export function getElementMultiplier(attackerElement: ElementType, defenderElement: ElementType): number {
    if (attackerElement === defenderElement) return 1.0;
    
    // 光暗互克
    if ((attackerElement === ElementType.Light && defenderElement === ElementType.Shadow) ||
        (attackerElement === ElementType.Shadow && defenderElement === ElementType.Light)) {
        return 1.5;
    }
    
    // 火木水循环克制
    const cycle: ElementType[] = [ElementType.Fire, ElementType.Wood, ElementType.Water];
    const attackerIndex = cycle.indexOf(attackerElement);
    const defenderIndex = cycle.indexOf(defenderElement);
    
    if (attackerIndex !== -1 && defenderIndex !== -1) {
        // 攻击者在防御者前一位（循环），表示克制
        if ((attackerIndex + 1) % 3 === defenderIndex) {
            return 1.5;
        }
        // 攻击者在防御者后一位，表示被克
        if ((defenderIndex + 1) % 3 === attackerIndex) {
            return 0.67;
        }
    }
    
    return 1.0;
}

/** 卡牌定位类型 */
export enum RoleType {
    Assassin = 'assassin', // 刺客 - 高攻击低生命
    Mage = 'mage',         // 法师 - 范围技能
    Warrior = 'warrior',   // 战士 - 均衡属性
    Tank = 'tank',         // 坦克 - 高生命
    Support = 'support'    // 辅助 - 治疗增益
}

/** 稀有度类型 */
export enum Rarity {
    Normal = 'normal', // 普通 - 白色
    Rare = 'rare',     // 稀有 - 蓝色
    Epic = 'epic',     // 史诗 - 紫色
    Legend = 'legend'  // 传说 - 金色
}

/** 稀有度颜色配置 */
export const RARITY_COLORS: Record<Rarity, string> = {
    [Rarity.Normal]: '#FFFFFF',
    [Rarity.Rare]: '#4A90D9',
    [Rarity.Epic]: '#9B59B6',
    [Rarity.Legend]: '#F1C40F'
};

/** 稀有度属性成长倍率 */
export const RARITY_MULTIPLIERS: Record<Rarity, number> = {
    [Rarity.Normal]: 1.0,
    [Rarity.Rare]: 1.2,
    [Rarity.Epic]: 1.5,
    [Rarity.Legend]: 2.0
};

/** 回合阶段类型 */
export enum TurnPhase {
    DrawPhase = 'draw',   // 抽牌阶段
    MainPhase = 'main',   // 主要阶段（出牌）
    BattlePhase = 'battle', // 战斗阶段（攻击）
    EndPhase = 'end'      // 结束阶段
}

/** 技能类型 */
export enum SkillType {
    Damage = 'damage',     // 伤害技能
    Heal = 'heal',         // 治疗技能
    Shield = 'shield',      // 护盾技能
    Buff = 'buff',         // 增益技能
    Debuff = 'debuff',     // 减益技能
    Energy = 'energy',      // 能量技能
    Special = 'special'    // 特殊技能
}

/** 技能触发时机 */
export enum SkillTrigger {
    OnPlay = 'onPlay',         // 登场时
    OnAttack = 'onAttack',     // 攻击时
    OnDefend = 'onDefend',     // 防守时
    OnTurnEnd = 'onTurnEnd',   // 回合结束时
    OnTurnStart = 'onTurnStart', // 回合开始时
    OnEnergyFull = 'onEnergyFull', // 能量满时（需10点能量）
    OnDeath = 'onDeath'        // 死亡时
}

/** 难度级别 */
export enum Difficulty {
    Beginner = 0,   // 入门 - AI随机出牌
    Easy = 1,       // 简单 - 80%概率最优
    Normal = 2,     // 普通 - 100%最优
    Hard = 3,       // 困难 - 套牌强度1.2
    Master = 4      // 大师 - 会预判
}

/** 难度参数 */
export const DIFFICULTY_PARAMS: Record<Difficulty, { strength: number; thinkDelay: number }> = {
    [Difficulty.Beginner]: { strength: 0.5, thinkDelay: 0.3 },
    [Difficulty.Easy]: { strength: 0.8, thinkDelay: 0.5 },
    [Difficulty.Normal]: { strength: 1.0, thinkDelay: 0.8 },
    [Difficulty.Hard]: { strength: 1.2, thinkDelay: 1.0 },
    [Difficulty.Master]: { strength: 1.2, thinkDelay: 1.5 }
};

/** 段位类型 */
export enum RankType {
    Bronze = 'bronze',     // 青铜
    Silver = 'silver',      // 白银
    Gold = 'gold',          // 黄金
    Platinum = 'platinum',  // 铂金
    Diamond = 'diamond',    // 钻石
    Master = 'master'       // 大师
}

/** 段位信息 */
export const RANK_INFO: Record<RankType, { minPoints: number; maxPoints: number; badge: string }> = {
    [RankType.Bronze]: { minPoints: 0, maxPoints: 99, badge: 'bronze_badge' },
    [RankType.Silver]: { minPoints: 100, maxPoints: 299, badge: 'silver_badge' },
    [RankType.Gold]: { minPoints: 300, maxPoints: 599, badge: 'gold_badge' },
    [RankType.Platinum]: { minPoints: 600, maxPoints: 999, badge: 'platinum_badge' },
    [RankType.Diamond]: { minPoints: 1000, maxPoints: 1499, badge: 'diamond_badge' },
    [RankType.Master]: { minPoints: 1500, maxPoints: 9999, badge: 'master_badge' }
};

/** 连携类型 */
export enum ComboType {
    None = 'none',
    Low = 'low',   // 3张激活
    High = 'high'  // 5张激活
}

/** 连携效果配置 */
export const COMBO_EFFECTS: Record<ElementType, { 
    low: { attackBonus: number; desc: string };
    high: { attackBonus: number; healthBonus: number; special: string; desc: string }
}> = {
    [ElementType.Fire]: {
        low: { attackBonus: 0.10, desc: '攻击+10%' },
        high: { attackBonus: 0.20, healthBonus: 0, special: 'skillDamageBonus', specialValue: 0.10, desc: '攻击+20%，技能伤害+10%' }
    },
    [ElementType.Wood]: {
        low: { attackBonus: 0, healthBonus: 0.10, desc: '生命+10%' },
        high: { attackBonus: 0, healthBonus: 0.20, special: 'healPerTurn', specialValue: 0.02, desc: '生命+20%，每回合恢复2%生命' }
    },
    [ElementType.Water]: {
        low: { attackBonus: 0, healthBonus: 0, defenseBonus: 0.10, desc: '防御+10%' },
        high: { attackBonus: 0, healthBonus: 0, defenseBonus: 0.20, special: 'crowdControlReduction', specialValue: 0.30, desc: '防御+20%，受到控制效果时间-30%' }
    },
    [ElementType.Light]: {
        low: { attackBonus: 0, healthBonus: 0, special: 'healBonus', specialValue: 0.15, desc: '治疗+15%' },
        high: { attackBonus: 0, healthBonus: 0, special: 'healBonus', specialValue: 0.30, special2: 'resurrect', special2Value: 0.5, desc: '治疗+30%，复活一次（50%生命）' }
    },
    [ElementType.Shadow]: {
        low: { attackBonus: 0, healthBonus: 0, special: 'critBonus', specialValue: 0.10, desc: '暴击+10%' },
        high: { attackBonus: 0, healthBonus: 0, special: 'critBonus', specialValue: 0.20, special2: 'manaSteal', special2Value: 1, desc: '暴击+20%，击杀敌人恢复1水晶' }
    }
};
