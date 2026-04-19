/**
 * 卡牌技能数据结构
 */

import { SkillType, SkillTrigger } from './Types';

/** 技能目标类型 */
export enum SkillTargetType {
    Self = 'self',               // 自身
    SingleEnemy = 'singleEnemy', // 单个敌方
    SingleAlly = 'singleAlly',   // 单个友方
    AllEnemies = 'allEnemies',    // 所有敌方
    AllAllies = 'allAllies',      // 所有友方
    EnemyFront = 'enemyFront',    // 敌方前线
    LowestHpAlly = 'lowestHpAlly', // 生命值最低的友方
    HighestAttackEnemy = 'highestAttackEnemy' // 攻击力最高的敌方
}

/** 技能数据 */
export interface SkillData {
    id: string;                  // 技能ID
    name: string;                // 技能名称
    description: string;         // 技能描述
    type: SkillType;             // 技能类型
    trigger: SkillTrigger;       // 触发时机
    target: SkillTargetType;     // 目标类型
    value: number;               // 技能效果值
    energyCost: number;          // 能量消耗（0表示被动技能）
    isActive: boolean;           // 是否为主动技能（需要能量释放）
}

/** 创建技能辅助函数 */
export function createSkill(
    id: string,
    name: string,
    description: string,
    type: SkillType,
    trigger: SkillTrigger,
    target: SkillTargetType,
    value: number,
    energyCost: number = 0
): SkillData {
    return {
        id,
        name,
        description,
        type,
        trigger,
        target,
        value,
        energyCost,
        isActive: energyCost > 0
    };
}

/** 预定义技能库 */
export const SKILL_LIBRARY: Record<string, SkillData> = {
    // 刺客技能
    SwiftStrike: createSkill(
        'swift_strike',
        '迅捷',
        '登场时获得1点能量',
        SkillType.Energy,
        SkillTrigger.OnPlay,
        SkillTargetType.Self,
        1,
        0
    ),
    Burn: createSkill(
        'burn',
        '燃烧I',
        '攻击时附加1点火属性伤害',
        SkillType.Damage,
        SkillTrigger.OnAttack,
        SkillTargetType.SingleEnemy,
        1,
        0
    ),
    ShadowSlash: createSkill(
        'shadow_slash',
        '暗影',
        '攻击不受反击伤害',
        SkillType.Special,
        SkillTrigger.OnAttack,
        SkillTargetType.SingleEnemy,
        0,
        0
    ),
    Evasion: createSkill(
        'evasion',
        '闪避',
        '30%概率闪避攻击',
        SkillType.Special,
        SkillTrigger.OnDefend,
        SkillTargetType.Self,
        0.3,
        0
    ),

    // 法师技能
    AOEAttack: createSkill(
        'aoe_attack',
        '范围攻击',
        '对所有敌方造成伤害',
        SkillType.Damage,
        SkillTrigger.OnAttack,
        SkillTargetType.AllEnemies,
        2,
        0
    ),
    Sleep: createSkill(
        'sleep',
        '沉睡',
        '使目标休眠1回合',
        SkillType.Debuff,
        SkillTrigger.OnAttack,
        SkillTargetType.SingleEnemy,
        1,
        0
    ),
    ArcaneExplosion: createSkill(
        'arcane_explosion',
        '奥术爆发',
        '对所有敌方造成3点伤害',
        SkillType.Damage,
        SkillTrigger.OnEnergyFull,
        SkillTargetType.AllEnemies,
        3,
        10
    ),

    // 战士技能
    Charge: createSkill(
        'charge',
        '冲锋',
        '登场当回合可攻击',
        SkillType.Special,
        SkillTrigger.OnPlay,
        SkillTargetType.Self,
        0,
        0
    ),
    Rage: createSkill(
        'rage',
        '激怒',
        '攻击时偷取目标1点攻击力',
        SkillType.Debuff,
        SkillTrigger.OnAttack,
        SkillTargetType.SingleEnemy,
        1,
        0
    ),
    Cleave: createSkill(
        'cleave',
        '顺劈',
        '攻击目标及其相邻单位',
        SkillType.Damage,
        SkillTrigger.OnAttack,
        SkillTargetType.EnemyFront,
        2,
        0
    ),

    // 坦克技能
    Root: createSkill(
        'root',
        '扎根',
        '受到伤害时恢复1点生命',
        SkillType.Heal,
        SkillTrigger.OnDefend,
        SkillTargetType.Self,
        1,
        0
    ),
    IceShield: createSkill(
        'ice_shield',
        '寒冰',
        '受到攻击时减少攻击者1点攻击力',
        SkillType.Debuff,
        SkillTrigger.OnDefend,
        SkillTargetType.SingleEnemy,
        1,
        0
    ),
    Taunt: createSkill(
        'taunt',
        '嘲讽',
        '强制所有敌方攻击此单位',
        SkillType.Special,
        SkillTrigger.OnPlay,
        SkillTargetType.Self,
        0,
        0
    ),

    // 辅助技能
    HealI: createSkill(
        'heal_i',
        '治愈I',
        '回合结束时治疗我方1点生命',
        SkillType.Heal,
        SkillTrigger.OnTurnEnd,
        SkillTargetType.AllAllies,
        1,
        0
    ),
    ShieldI: createSkill(
        'shield_i',
        '护盾I',
        '登场时为己方目标提供2点护盾',
        SkillType.Shield,
        SkillTrigger.OnPlay,
        SkillTargetType.LowestHpAlly,
        2,
        0
    ),
    Blessing: createSkill(
        'blessing',
        '祝福',
        '使我方全体攻击+1（持续2回合）',
        SkillType.Buff,
        SkillTrigger.OnPlay,
        SkillTargetType.AllAllies,
        1,
        0
    ),
    HolyLight: createSkill(
        'holy_light',
        '神圣',
        '治疗我方最低血量单位3点生命',
        SkillType.Heal,
        SkillTrigger.OnAttack,
        SkillTargetType.LowestHpAlly,
        3,
        0
    ),
    Curse: createSkill(
        'curse',
        '诅咒',
        '使目标攻击力降低2点',
        SkillType.Debuff,
        SkillTrigger.OnAttack,
        SkillTargetType.SingleEnemy,
        2,
        0
    ),

    // 大招技能（需要能量）
    FireDragon: createSkill(
        'fire_dragon',
        '火焰巨龙',
        '对敌方全体造成5点伤害',
        SkillType.Damage,
        SkillTrigger.OnEnergyFull,
        SkillTargetType.AllEnemies,
        5,
        10
    ),
    WaterPrison: createSkill(
        'water_prison',
        '水之牢笼',
        '冻结所有敌方1回合',
        SkillType.Debuff,
        SkillTrigger.OnEnergyFull,
        SkillTargetType.AllEnemies,
        1,
        10
    ),
    LifeDrain: createSkill(
        'life_drain',
        '生命汲取',
        '对敌方造成伤害并治疗我方相同值',
        SkillType.Damage,
        SkillTrigger.OnEnergyFull,
        SkillTargetType.AllEnemies,
        4,
        10
    ),
    DivineShield: createSkill(
        'divine_shield',
        '神圣护盾',
        '使所有友方获得3点护盾',
        SkillType.Shield,
        SkillTrigger.OnEnergyFull,
        SkillTargetType.AllAllies,
        3,
        10
    ),
    VoidBlast: createSkill(
        'void_blast',
        '虚空冲击',
        '对敌方造成基于其已损失生命值的伤害',
        SkillType.Damage,
        SkillTrigger.OnEnergyFull,
        SkillTargetType.SingleEnemy,
        0, // 特殊计算
        10
    )
};
