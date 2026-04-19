/**
 * UI管理器 - 管理游戏UI的创建和更新
 */

import { CardData } from '../Core/CardData';
import { PlayerState } from '../Core/PlayerState';
import { ElementType, RoleType, Rarity, RARITY_COLORS } from '../Core/Types';
import { GameConfig } from '../Config/GameConfig';

/** UI管理器 */
export class UIManager {
    /** 单例实例 */
    private static instance: UIManager;
    
    /** 构造函数 */
    private constructor() {}
    
    /** 获取单例 */
    public static getInstance(): UIManager {
        if (!UIManager.instance) {
            UIManager.instance = new UIManager();
        }
        return UIManager.instance;
    }
    
    // ==================== 格式化函数 ====================
    
    /** 格式化元素名称 */
    public formatElementName(element: ElementType): string {
        switch (element) {
            case ElementType.Fire: return '火';
            case ElementType.Wood: return '木';
            case ElementType.Water: return '水';
            case ElementType.Light: return '光';
            case ElementType.Shadow: return '暗';
            default: return '';
        }
    }
    
    /** 格式化定位名称 */
    public formatRoleName(role: RoleType): string {
        switch (role) {
            case RoleType.Assassin: return '刺客';
            case RoleType.Mage: return '法师';
            case RoleType.Warrior: return '战士';
            case RoleType.Tank: return '坦克';
            case RoleType.Support: return '辅助';
            default: return '';
        }
    }
    
    /** 格式化稀有度名称 */
    public formatRarityName(rarity: Rarity): string {
        switch (rarity) {
            case Rarity.Normal: return '普通';
            case Rarity.Rare: return '稀有';
            case Rarity.Epic: return '史诗';
            case Rarity.Legend: return '传说';
            default: return '';
        }
    }
    
    /** 格式化稀有度颜色 */
    public getRarityColor(rarity: Rarity): string {
        return RARITY_COLORS[rarity];
    }
    
    /** 格式化水晶图标字符串 */
    public formatManaIcon(): string {
        return '💎'; // 或使用实际的图片资源
    }
    
    /** 格式化能量图标字符串 */
    public formatEnergyIcon(): string {
        return '⚡';
    }
    
    /** 格式化血量 */
    public formatHP(hp: number, maxHp: number): string {
        return `${hp}/${maxHp}`;
    }
    
    /** 格式化卡牌费用 */
    public formatCost(cost: number): string {
        return cost.toString();
    }
    
    /** 格式化攻击力 */
    public formatAttack(attack: number): string {
        return attack.toString();
    }
    
    /** 格式化生命值 */
    public formatHealth(health: number): string {
        return health.toString();
    }
    
    // ==================== 位置计算 ====================
    
    /** 计算手牌位置 */
    public calculateHandCardPosition(index: number, totalCards: number, cardWidth: number): { x: number; y: number; rotation: number } {
        const maxVisibleCards = GameConfig.HAND_DISPLAY_MAX;
        const displayCount = Math.min(totalCards, maxVisibleCards);
        
        const centerX = 0;
        const baseY = -200; // 屏幕底部
        const overlapRatio = GameConfig.HAND_OVERLAP_RATIO;
        
        // 计算总宽度
        const totalWidth = cardWidth * overlapRatio * (displayCount - 1) + cardWidth;
        const startX = centerX - totalWidth / 2 + cardWidth / 2;
        
        // 计算每张卡牌的偏移
        const spacing = cardWidth * overlapRatio;
        const x = startX + index * spacing;
        
        // 计算旋转角度（中间高，两边低）
        const centerIndex = (displayCount - 1) / 2;
        const offsetFromCenter = index - centerIndex;
        const rotation = offsetFromCenter * 3; // 每张卡牌3度倾斜
        
        // 计算Y位置（中间高两边低）
        const y = baseY - Math.abs(offsetFromCenter) * 10;
        
        return { x, y, rotation };
    }
    
    /** 计算战场格子位置 */
    public calculateFieldCellPosition(index: number, isEnemy: boolean): { x: number; y: number } {
        const cellSize = GameConfig.FIELD_CELL_SIZE;
        const startX = -cellSize * 1.5;
        const startY = isEnemy ? cellSize * 1.5 : -cellSize * 1.5;
        
        const row = Math.floor(index / 3);
        const col = index % 3;
        
        const x = startX + col * cellSize;
        const y = startY + row * cellSize * (isEnemy ? -1 : 1);
        
        return { x, y };
    }
    
    // ==================== 颜色转换 ====================
    
    /** HEX转RGBA */
    public hexToRgba(hex: string, alpha: number = 1): string {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        if (result) {
            const r = parseInt(result[1], 16);
            const g = parseInt(result[2], 16);
            const b = parseInt(result[3], 16);
            return `rgba(${r}, ${g}, ${b}, ${alpha})`;
        }
        return `rgba(255, 255, 255, ${alpha})`;
    }
    
    /** 根据稀有度获取边框颜色 */
    public getCardBorderColor(rarity: Rarity): string {
        return RARITY_COLORS[rarity];
    }
    
    /** 根据元素获取背景色 */
    public getElementBackgroundColor(element: ElementType): string {
        switch (element) {
            case ElementType.Fire: return '#FF6B6B';
            case ElementType.Wood: return '#51CF66';
            case ElementType.Water: return '#339AF0';
            case ElementType.Light: return '#FFE066';
            case ElementType.Shadow: return '#845EF7';
            default: return '#FFFFFF';
        }
    }
    
    /** 根据元素获取图标 */
    public getElementIcon(element: ElementType): string {
        switch (element) {
            case ElementType.Fire: return '🔥';
            case ElementType.Wood: return '🌲';
            case ElementType.Water: return '💧';
            case ElementType.Light: return '✨';
            case ElementType.Shadow: return '🌙';
            default: return '';
        }
    }
    
    /** 根据定位获取图标 */
    public getRoleIcon(role: RoleType): string {
        switch (role) {
            case RoleType.Assassin: return '🗡️';
            case RoleType.Mage: return '🔮';
            case RoleType.Warrior: return '⚔️';
            case RoleType.Tank: return '🛡️';
            case RoleType.Support: return '💚';
            default: return '';
        }
    }
}
