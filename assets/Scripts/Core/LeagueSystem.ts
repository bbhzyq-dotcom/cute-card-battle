/**
 * 天梯系统 - 管理排位赛逻辑
 */

import { RankType, RANK_INFO, GameConfig } from '../Core/Types';
import { SaveManager } from '../Data/SaveManager';

/** 天梯系统 */
export class LeagueSystem {
    /** 单例实例 */
    private static instance: LeagueSystem;
    
    /** 存档管理器 */
    private saveManager: SaveManager;
    
    /** 当前赛季是否开始 */
    private seasonStarted: boolean = true;
    
    /** 构造函数 */
    private constructor() {
        this.saveManager = SaveManager.getInstance();
    }
    
    /** 获取单例 */
    public static getInstance(): LeagueSystem {
        if (!LeagueSystem.instance) {
            LeagueSystem.instance = new LeagueSystem();
        }
        return LeagueSystem.instance;
    }
    
    // ==================== 段位信息 ====================
    
    /** 获取玩家段位信息 */
    public getPlayerRankInfo(): {
        rank: RankType;
        rankName: string;
        points: number;
        progress: number;
        nextRank: RankType | null;
    } {
        const points = this.saveManager.getLeaguePoints();
        const rank = this.calculateRank(points);
        const rankInfo = RANK_INFO[rank];
        
        // 计算当前段位内的进度
        const progressInRank = points - rankInfo.minPoints;
        const rankRange = rankInfo.maxPoints - rankInfo.minPoints;
        const progress = rankRange > 0 ? progressInRank / rankRange : 1;
        
        // 下一段位
        const ranks = Object.keys(RANK_INFO);
        const currentIndex = ranks.indexOf(rank);
        const nextRank = currentIndex < ranks.length - 1 ? ranks[currentIndex + 1] as RankType : null;
        
        return {
            rank,
            rankName: this.getRankName(rank),
            points,
            progress,
            nextRank
        };
    }
    
    /** 根据积分计算段位 */
    public calculateRank(points: number): RankType {
        if (points >= RANK_INFO[RankType.Master].minPoints) return RankType.Master;
        if (points >= RANK_INFO[RankType.Diamond].minPoints) return RankType.Diamond;
        if (points >= RANK_INFO[RankType.Platinum].minPoints) return RankType.Platinum;
        if (points >= RANK_INFO[RankType.Gold].minPoints) return RankType.Gold;
        if (points >= RANK_INFO[RankType.Silver].minPoints) return RankType.Silver;
        return RankType.Bronze;
    }
    
    /** 获取段位名称 */
    public getRankName(rank: RankType): string {
        switch (rank) {
            case RankType.Bronze: return '青铜';
            case RankType.Silver: return '白银';
            case RankType.Gold: return '黄金';
            case RankType.Platinum: return '铂金';
            case RankType.Diamond: return '钻石';
            case RankType.Master: return '大师';
            default: return '青铜';
        }
    }
    
    /** 获取段位图标 */
    public getRankIcon(rank: RankType): string {
        switch (rank) {
            case RankType.Bronze: return '🏺';
            case RankType.Silver: return '🥈';
            case RankType.Gold: return '🥇';
            case RankType.Platinum: return '💎';
            case RankType.Diamond: return '💠';
            case RankType.Master: return '👑';
            default: return '🏺';
        }
    }
    
    // ==================== 积分计算 ====================
    
    /** 计算积分变化 */
    public calculatePointsChange(isWin: boolean, currentStreak: number = 0): number {
        if (isWin) {
            let points = GameConfig.LEAGUE_WIN_POINTS;
            // 连胜加成
            if (currentStreak >= 2) {
                points += GameConfig.LEAGUE_WIN_STREAK_BONUS;
            }
            return points;
        } else {
            let points = GameConfig.LEAGUE_LOSE_POINTS;
            // 连败减免
            if (currentStreak >= 2) {
                points -= GameConfig.LEAGUE_LOSE_STREAK_REDUCTION;
            }
            return -points;
        }
    }
    
    /** 添加积分 */
    public addPoints(points: number): { 
        promoted: boolean; 
        promotionSeriesTriggered: boolean;
        newRank: RankType;
    } {
        const oldPoints = this.saveManager.getLeaguePoints();
        const newPoints = oldPoints + points;
        this.saveManager.addLeaguePoints(points);
        
        const oldRank = this.calculateRank(oldPoints);
        const newRank = this.calculateRank(newPoints);
        
        // 检查是否晋升
        const promoted = newRank !== oldRank && this.getRankValue(newRank) > this.getRankValue(oldRank);
        
        // 检查是否触发晋级赛
        const rankInfo = RANK_INFO[newRank];
        const promotionSeriesTriggered = newPoints >= rankInfo.maxPoints;
        
        return {
            promoted,
            promotionSeriesTriggered,
            newRank
        };
    }
    
    /** 扣除积分 */
    public removePoints(points: number): {
        relegated: boolean;
        relegationSeriesTriggered: boolean;
        newRank: RankType;
    } {
        const oldPoints = this.saveManager.getLeaguePoints();
        const newPoints = Math.max(0, oldPoints - points);
        this.saveManager.removeLeaguePoints(points);
        
        const oldRank = this.calculateRank(oldPoints);
        const newRank = this.calculateRank(newPoints);
        
        // 检查是否降级
        const relegated = newRank !== oldRank && this.getRankValue(newRank) < this.getRankValue(oldRank);
        
        // 检查是否触发保级赛
        const relegationSeriesTriggered = newPoints < 0;
        
        return {
            relegated,
            relegationSeriesTriggered,
            newRank
        };
    }
    
    /** 获取段位数值（用于比较） */
    private getRankValue(rank: RankType): number {
        switch (rank) {
            case RankType.Bronze: return 0;
            case RankType.Silver: return 1;
            case RankType.Gold: return 2;
            case RankType.Platinum: return 3;
            case RankType.Diamond: return 4;
            case RankType.Master: return 5;
            default: return 0;
        }
    }
    
    // ==================== 晋级/保级赛 ====================
    
    /** 晋级赛状态 */
    public interface PromotionSeries {
        currentWins: number;
        currentLosses: number;
        winsNeeded: number;
        inProgress: boolean;
    }
    
    /** 当前晋级赛状态 */
    private currentPromotionSeries: PromotionSeries = {
        currentWins: 0,
        currentLosses: 0,
        winsNeeded: GameConfig.PROMOTION_SERIES_WINS_NEEDED,
        inProgress: false
    };
    
    /** 保级赛状态 */
    private currentRelegationSeries: PromotionSeries = {
        currentWins: 0,
        currentLosses: 0,
        winsNeeded: GameConfig.PROMOTION_SERIES_WINS_NEEDED,
        inProgress: false
    };
    
    /** 开始晋级赛 */
    public startPromotionSeries(): void {
        this.currentPromotionSeries = {
            currentWins: 0,
            currentLosses: 0,
            winsNeeded: GameConfig.PROMOTION_SERIES_WINS_NEEDED,
            inProgress: true
        };
    }
    
    /** 开始保级赛 */
    public startRelegationSeries(): void {
        this.currentRelegationSeries = {
            currentWins: 0,
            currentLosses: 0,
            winsNeeded: GameConfig.PROMOTION_SERIES_WINS_NEEDED,
            inProgress: true
        };
    }
    
    /** 记录晋级赛结果 */
    public recordPromotionResult(isWin: boolean): {
        completed: boolean;
        promoted: boolean;
        message: string;
    } {
        if (!this.currentPromotionSeries.inProgress) {
            return { completed: false, promoted: false, message: '晋级赛未开始' };
        }
        
        if (isWin) {
            this.currentPromotionSeries.currentWins++;
            if (this.currentPromotionSeries.currentWins >= this.currentPromotionSeries.winsNeeded) {
                // 晋级成功
                this.currentPromotionSeries.inProgress = false;
                return {
                    completed: true,
                    promoted: true,
                    message: '恭喜晋级成功！'
                };
            }
        } else {
            this.currentPromotionSeries.currentLosses++;
            if (this.currentPromotionSeries.currentLosses >= GameConfig.DEMOTION_SERIES_LOSSES_ALLOWED + 1) {
                // 晋级赛失败
                this.currentPromotionSeries.inProgress = false;
                return {
                    completed: true,
                    promoted: false,
                    message: '晋级赛失败，需要重新挑战'
                };
            }
        }
        
        // 晋级赛中
        return {
            completed: false,
            promoted: false,
            message: `晋级赛进度：${this.currentPromotionSeries.currentWins}胜${this.currentPromotionSeries.currentLosses}负`
        };
    }
    
    /** 记录保级赛结果 */
    public recordRelegationResult(isWin: boolean): {
        completed: boolean;
        relegated: boolean;
        message: string;
    } {
        if (!this.currentRelegationSeries.inProgress) {
            return { completed: false, relegated: false, message: '保级赛未开始' };
        }
        
        if (isWin) {
            this.currentRelegationSeries.currentWins++;
            if (this.currentRelegationSeries.currentWins >= this.currentRelegationSeries.winsNeeded) {
                // 保级成功
                this.currentRelegationSeries.inProgress = false;
                return {
                    completed: true,
                    relegated: false,
                    message: '保级成功！'
                };
            }
        } else {
            this.currentRelegationSeries.currentLosses++;
            if (this.currentRelegationSeries.currentLosses >= GameConfig.DEMOTION_SERIES_LOSSES_ALLOWED + 1) {
                // 保级失败，降级
                this.currentRelegationSeries.inProgress = false;
                return {
                    completed: true,
                    relegated: true,
                    message: '保级失败，降级到下一段位'
                };
            }
        }
        
        // 保级赛中
        return {
            completed: false,
            relegated: false,
            message: `保级赛进度：${this.currentRelegationSeries.currentWins}胜${this.currentRelegationSeries.currentLosses}负`
        };
    }
    
    /** 获取当前晋级赛状态 */
    public getPromotionSeriesStatus(): PromotionSeries | null {
        return this.currentPromotionSeries.inProgress ? this.currentPromotionSeries : null;
    }
    
    /** 获取当前保级赛状态 */
    public getRelegationSeriesStatus(): PromotionSeries | null {
        return this.currentRelegationSeries.inProgress ? this.currentRelegationSeries : null;
    }
    
    // ==================== 赛季管理 ====================
    
    /** 赛季是否结束 */
    public isSeasonEnded(): boolean {
        // 简化实现：每周重置
        return false;
    }
    
    /** 获取赛季结束时间 */
    public getSeasonEndTime(): number {
        // 简化实现：返回一周后的时间戳
        const now = Date.now();
        const weekMs = 7 * 24 * 60 * 60 * 1000;
        return now + weekMs;
    }
    
    /** 获取赛季剩余时间 */
    public getSeasonRemainingTime(): { days: number; hours: number; minutes: number } {
        const endTime = this.getSeasonEndTime();
        const remaining = Math.max(0, endTime - Date.now());
        
        const days = Math.floor(remaining / (24 * 60 * 60 * 1000));
        const hours = Math.floor((remaining % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
        const minutes = Math.floor((remaining % (60 * 60 * 1000)) / (60 * 1000));
        
        return { days, hours, minutes };
    }
    
    /** 赛季重置 */
    public resetSeason(): void {
        // 保留部分积分（黄金及以上保留30%）
        const currentRank = this.calculateRank(this.saveManager.getLeaguePoints());
        if (this.getRankValue(currentRank) >= this.getRankValue(RankType.Gold)) {
            const keptPoints = Math.floor(this.saveManager.getLeaguePoints() * 0.3);
            this.saveManager.removeLeaguePoints(this.saveManager.getLeaguePoints() - keptPoints);
        } else {
            // 重置到青铜0分
            this.saveManager.removeLeaguePoints(this.saveManager.getLeaguePoints());
        }
        
        // 取消所有进行中的赛事
        this.currentPromotionSeries.inProgress = false;
        this.currentRelegationSeries.inProgress = false;
    }
    
    // ==================== 赛季奖励 ====================
    
    /** 获取赛季奖励 */
    public getSeasonRewards(rank: RankType): {
        coins: number;
        cards: { baseId: string; count: number }[];
        title: string;
    } {
        switch (rank) {
            case RankType.Bronze:
                return {
                    coins: 100,
                    cards: [],
                    title: '青铜战士'
                };
            case RankType.Silver:
                return {
                    coins: 200,
                    cards: [{ baseId: 'wood_support_sprout', count: 1 }],
                    title: '白银勇士'
                };
            case RankType.Gold:
                return {
                    coins: 500,
                    cards: [{ baseId: 'light_mage_holy', count: 1 }],
                    title: '黄金英雄'
                };
            case RankType.Platinum:
                return {
                    coins: 1000,
                    cards: [
                        { baseId: 'water_tank_glacier', count: 1 },
                        { baseId: 'shadow_assassin_raven', count: 1 }
                    ],
                    title: '铂金大师'
                };
            case RankType.Diamond:
                return {
                    coins: 2000,
                    cards: [{ baseId: 'fire_legend_phoenix', count: 1 }],
                    title: '钻石传奇'
                };
            case RankType.Master:
                return {
                    coins: 5000,
                    cards: [{ baseId: 'fire_legend_phoenix', count: 2 }],
                    title: '大师之王'
                };
            default:
                return {
                    coins: 0,
                    cards: [],
                    title: ''
                };
        }
    }
    
    /** 领取赛季奖励 */
    public claimSeasonReward(): boolean {
        const rank = this.calculateRank(this.saveManager.getLeaguePoints());
        const rewards = this.getSeasonRewards(rank);
        
        // 发放奖励
        this.saveManager.addCoins(rewards.coins);
        for (const card of rewards.cards) {
            this.saveManager.addCard(card.baseId, card.count);
        }
        
        return true;
    }
}
