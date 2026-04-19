/**
 * 游戏入口脚本 - 挂载在场景根节点
 */

import { Game, getGame } from './Game';
import { BattleEventType } from './BattleManager';

/** 入口脚本 */
const { ccclass, property } = cc._decorator;

@ccclass
export class GameEntry extends cc.Component {
    
    /** 游戏实例 */
    private game: Game | null = null;
    
    /** 是否已初始化 */
    private initialized: boolean = false;
    
    /** onLoad */
    onLoad() {
        // 注册全局游戏实例
        (window as any).game = getGame();
        console.log('游戏入口加载完成');
    }
    
    /** start */
    start() {
        // 初始化游戏
        this.initGame();
    }
    
    /** 初始化游戏 */
    private initGame(): void {
        if (this.initialized) return;
        
        const game = getGame();
        game.init();
        this.game = game;
        this.initialized = true;
        
        // 注册战斗事件监听
        this.registerBattleEvents();
        
        console.log('游戏初始化完成!');
    }
    
    /** 注册战斗事件 */
    private registerBattleEvents(): void {
        if (!this.game) return;
        
        this.game.on(BattleEventType.TurnStart, (event) => {
            console.log(`回合开始: ${event.data.turn}, 是否玩家回合: ${event.data.isPlayerTurn}`);
        });
        
        this.game.on(BattleEventType.CardPlayed, (event) => {
            console.log(`卡牌出牌: ${event.data.card?.name}, 位置: ${event.data.position}`);
        });
        
        this.game.on(BattleEventType.CardAttacked, (event) => {
            console.log(`卡牌攻击: ${event.data.attacker?.name} -> ${event.data.defender?.name}, 伤害: ${event.data.damage}`);
        });
        
        this.game.on(BattleEventType.BattleEnd, (event) => {
            console.log(`战斗结束: ${event.data.result?.winner}`);
        });
    }
    
    /** 更新 */
    update(dt: number) {
        // 游戏逻辑更新
    }
}

/** 导出给Cocos Creator使用 */
export { GameEntry as default };
