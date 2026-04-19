/**
 * 卡牌配置数据
 */

import { ElementType, RoleType, Rarity } from '../Core/Types';

/** 卡牌基础配置 */
export interface CardConfig {
    baseId: string;          // 基础ID
    name: string;            // 名称
    element: ElementType;    // 元素
    role: RoleType;          // 定位
    rarity: Rarity;         // 稀有度
    cost: number;           // 费用
    attack: number;         // 攻击力
    health: number;        // 生命值
    skillId: string;        // 技能ID
    description: string;    // 描述
}

/** 所有卡牌配置 */
export const CARD_CONFIGS: CardConfig[] = [
    // ==================== 火属性 - 狐狸族群 ====================
    {
        baseId: 'fire_assassin_sparkfox',
        name: '小火狐',
        element: ElementType.Fire,
        role: RoleType.Assassin,
        rarity: Rarity.Normal,
        cost: 2,
        attack: 4,
        health: 2,
        skillId: 'SwiftStrike',
        description: '迅捷：登场时获得1点能量'
    },
    {
        baseId: 'fire_mage_flamefox',
        name: '火焰狐',
        element: ElementType.Fire,
        role: RoleType.Mage,
        rarity: Rarity.Normal,
        cost: 3,
        attack: 3,
        health: 4,
        skillId: 'Burn',
        description: '燃烧I：攻击时附加1点火属性伤害'
    },
    {
        baseId: 'fire_warrior_inferno',
        name: '烈焰狐',
        element: ElementType.Fire,
        role: RoleType.Warrior,
        rarity: Rarity.Normal,
        cost: 4,
        attack: 5,
        health: 5,
        skillId: 'Charge',
        description: '冲锋：登场当回合可攻击'
    },
    {
        baseId: 'fire_assassin_blaze',
        name: '烈焰刺客',
        element: ElementType.Fire,
        role: RoleType.Assassin,
        rarity: Rarity.Rare,
        cost: 3,
        attack: 6,
        health: 2,
        skillId: 'ShadowSlash',
        description: '暗影：攻击不受反击伤害'
    },
    {
        baseId: 'fire_mage_pyromancer',
        name: '火焰法师',
        element: ElementType.Fire,
        role: RoleType.Mage,
        rarity: Rarity.Epic,
        cost: 5,
        attack: 4,
        health: 5,
        skillId: 'ArcaneExplosion',
        description: '奥术爆发：对所有敌方造成3点伤害（需10能量）'
    },

    // ==================== 木属性 - 兔子族群 ====================
    {
        baseId: 'wood_support_sprout',
        name: '小绿兔',
        element: ElementType.Wood,
        role: RoleType.Support,
        rarity: Rarity.Normal,
        cost: 2,
        attack: 1,
        health: 4,
        skillId: 'HealI',
        description: '治愈I：回合结束时治疗我方1点生命'
    },
    {
        baseId: 'wood_tank_moss',
        name: '森林兔',
        element: ElementType.Wood,
        role: RoleType.Tank,
        rarity: Rarity.Normal,
        cost: 3,
        attack: 2,
        health: 6,
        skillId: 'Root',
        description: '扎根：受到伤害时恢复1点生命'
    },
    {
        baseId: 'wood_mage_lunar',
        name: '月光兔',
        element: ElementType.Wood,
        role: RoleType.Mage,
        rarity: Rarity.Normal,
        cost: 4,
        attack: 4,
        health: 4,
        skillId: 'Sleep',
        description: '沉睡：攻击时使目标休眠1回合'
    },
    {
        baseId: 'wood_support_nature',
        name: '自然使者',
        element: ElementType.Wood,
        role: RoleType.Support,
        rarity: Rarity.Rare,
        cost: 3,
        attack: 2,
        health: 5,
        skillId: 'ShieldI',
        description: '护盾I：登场时为己方目标提供2点护盾'
    },
    {
        baseId: 'wood_tank_ancient',
        name: '古木守护',
        element: ElementType.Wood,
        role: RoleType.Tank,
        rarity: Rarity.Epic,
        cost: 6,
        attack: 3,
        health: 10,
        skillId: 'Taunt',
        description: '嘲讽：强制所有敌方攻击此单位'
    },

    // ==================== 水属性 - 熊族群 ====================
    {
        baseId: 'water_support_tide',
        name: '小水熊',
        element: ElementType.Water,
        role: RoleType.Support,
        rarity: Rarity.Normal,
        cost: 2,
        attack: 2,
        health: 3,
        skillId: 'ShieldI',
        description: '护盾I：登场时为己方目标提供2点护盾'
    },
    {
        baseId: 'water_tank_glacier',
        name: '冰川熊',
        element: ElementType.Water,
        role: RoleType.Tank,
        rarity: Rarity.Normal,
        cost: 3,
        attack: 2,
        health: 7,
        skillId: 'IceShield',
        description: '寒冰：受到攻击时减少攻击者1点攻击力'
    },
    {
        baseId: 'water_warrior_tidal',
        name: '潮汐熊',
        element: ElementType.Water,
        role: RoleType.Warrior,
        rarity: Rarity.Normal,
        cost: 4,
        attack: 4,
        health: 5,
        skillId: 'Rage',
        description: '激怒：攻击时偷取目标1点攻击力'
    },
    {
        baseId: 'water_mage_abyss',
        name: '深渊法师',
        element: ElementType.Water,
        role: RoleType.Mage,
        rarity: Rarity.Rare,
        cost: 4,
        attack: 5,
        health: 4,
        skillId: 'WaterPrison',
        description: '水之牢笼：冻结所有敌方1回合（需10能量）'
    },
    {
        baseId: 'water_tank_tsunami',
        name: '海啸守卫',
        element: ElementType.Water,
        role: RoleType.Tank,
        rarity: Rarity.Epic,
        cost: 6,
        attack: 4,
        health: 9,
        skillId: 'DivineShield',
        description: '神圣护盾：使所有友方获得3点护盾（需10能量）'
    },

    // ==================== 光属性 - 猫族群 ====================
    {
        baseId: 'light_support_sparkle',
        name: '小白猫',
        element: ElementType.Light,
        role: RoleType.Support,
        rarity: Rarity.Normal,
        cost: 2,
        attack: 1,
        health: 3,
        skillId: 'Blessing',
        description: '祝福：使我方全体攻击+1（持续2回合）'
    },
    {
        baseId: 'light_mage_holy',
        name: '圣光猫',
        element: ElementType.Light,
        role: RoleType.Mage,
        rarity: Rarity.Normal,
        cost: 3,
        attack: 4,
        health: 3,
        skillId: 'HolyLight',
        description: '神圣：治疗我方最低血量单位3点生命'
    },
    {
        baseId: 'light_warrior_angel',
        name: '天使猫',
        element: ElementType.Light,
        role: RoleType.Warrior,
        rarity: Rarity.Normal,
        cost: 4,
        attack: 5,
        health: 4,
        skillId: 'Charge',
        description: '冲锋：登场当回合可攻击'
    },
    {
        baseId: 'light_support_celestial',
        name: '星辉使者',
        element: ElementType.Light,
        role: RoleType.Support,
        rarity: Rarity.Rare,
        cost: 4,
        attack: 3,
        health: 5,
        skillId: 'HealI',
        description: '治愈II：回合结束时治疗我方2点生命'
    },
    {
        baseId: 'light_tank_radiant',
        name: '圣光守护',
        element: ElementType.Light,
        role: RoleType.Tank,
        rarity: Rarity.Epic,
        cost: 5,
        attack: 3,
        health: 8,
        skillId: 'DivineShield',
        description: '神圣护盾：使所有友方获得3点护盾（需10能量）'
    },

    // ==================== 暗属性 - 鸟族群 ====================
    {
        baseId: 'shadow_assassin_raven',
        name: '小暗鸦',
        element: ElementType.Shadow,
        role: RoleType.Assassin,
        rarity: Rarity.Normal,
        cost: 2,
        attack: 5,
        health: 1,
        skillId: 'ShadowSlash',
        description: '暗影：攻击不受反击伤害'
    },
    {
        baseId: 'shadow_assassin_specter',
        name: '幽灵鸟',
        element: ElementType.Shadow,
        role: RoleType.Assassin,
        rarity: Rarity.Normal,
        cost: 3,
        attack: 4,
        health: 2,
        skillId: 'Evasion',
        description: '闪避：30%概率闪避攻击'
    },
    {
        baseId: 'shadow_mage_necro',
        name: '冥鸦',
        element: ElementType.Shadow,
        role: RoleType.Mage,
        rarity: Rarity.Normal,
        cost: 4,
        attack: 3,
        health: 4,
        skillId: 'Curse',
        description: '诅咒：使目标攻击力降低2点'
    },
    {
        baseId: 'shadow_assassin_void',
        name: '虚空猎手',
        element: ElementType.Shadow,
        role: RoleType.Assassin,
        rarity: Rarity.Rare,
        cost: 4,
        attack: 7,
        health: 2,
        skillId: 'LifeDrain',
        description: '生命汲取：对敌方造成伤害并治疗我方相同值（需10能量）'
    },
    {
        baseId: 'shadow_mage_void_blast',
        name: '虚空法师',
        element: ElementType.Shadow,
        role: RoleType.Mage,
        rarity: Rarity.Epic,
        cost: 6,
        attack: 5,
        health: 5,
        skillId: 'VoidBlast',
        description: '虚空冲击：对敌方造成基于其已损失生命值的伤害（需10能量）'
    },

    // ==================== 传说卡牌（5张）====================
    {
        baseId: 'fire_legend_phoenix',
        name: '凤凰',
        element: ElementType.Fire,
        role: RoleType.Warrior,
        rarity: Rarity.Legend,
        cost: 7,
        attack: 6,
        health: 7,
        skillId: 'FireDragon',
        description: '火焰巨龙：对敌方全体造成5点伤害（需10能量）'
    },
    {
        baseId: 'wood_legend_world_tree',
        name: '世界树',
        element: ElementType.Wood,
        role: RoleType.Tank,
        rarity: Rarity.Legend,
        cost: 8,
        attack: 4,
        health: 12,
        skillId: 'DivineShield',
        description: '神圣护盾：使所有友方获得5点护盾（需10能量）'
    },
    {
        baseId: 'water_legend_kraken',
        name: '海怪',
        element: ElementType.Water,
        role: RoleType.Mage,
        rarity: Rarity.Legend,
        cost: 7,
        attack: 5,
        health: 8,
        skillId: 'WaterPrison',
        description: '深渊禁锢：冻结所有敌方2回合（需10能量）'
    },
    {
        baseId: 'light_legend_angel_king',
        name: '天使王',
        element: ElementType.Light,
        role: RoleType.Warrior,
        rarity: Rarity.Legend,
        cost: 8,
        attack: 7,
        health: 8,
        skillId: 'DivineShield',
        description: '神圣庇护：使所有友方免疫一次伤害（需10能量）'
    },
    {
        baseId: 'shadow_legend_demon_lord',
        name: '魔王',
        element: ElementType.Shadow,
        role: RoleType.Assassin,
        rarity: Rarity.Legend,
        cost: 9,
        attack: 10,
        health: 6,
        skillId: 'LifeDrain',
        description: '灵魂收割：对所有敌方造成4点伤害，击杀目标时恢复2水晶（需10能量）'
    }
];

/** 根据ID获取卡牌配置 */
export function getCardConfig(baseId: string): CardConfig | null {
    return CARD_CONFIGS.find(config => config.baseId === baseId) || null;
}

/** 根据元素获取所有卡牌配置 */
export function getCardConfigsByElement(element: ElementType): CardConfig[] {
    return CARD_CONFIGS.filter(config => config.element === element);
}

/** 根据稀有度获取所有卡牌配置 */
export function getCardConfigsByRarity(rarity: Rarity): CardConfig[] {
    return CARD_CONFIGS.filter(config => config.rarity === rarity);
}

/** 获取所有普通卡牌 */
export function getNormalCardConfigs(): CardConfig[] {
    return getCardConfigsByRarity(Rarity.Normal);
}

/** 获取随机卡牌（考虑概率） */
export function getRandomCardConfig(): CardConfig {
    const rand = Math.random();
    let cumulative = 0;
    
    for (const config of CARD_CONFIGS) {
        let rate = 0;
        switch (config.rarity) {
            case Rarity.Normal: rate = 0.50; break;
            case Rarity.Rare: rate = 0.30; break;
            case Rarity.Epic: rate = 0.15; break;
            case Rarity.Legend: rate = 0.05; break;
        }
        
        cumulative += rate;
        if (rand <= cumulative) {
            return config;
        }
    }
    
    return CARD_CONFIGS[0];
}
