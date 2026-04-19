/**
 * 战场视图组件 - 管理战场格子布局和怪物展示
 */

import { CardData } from '../Core/CardData';
import { CardView, CardViewState } from './CardView';
import { UIManager } from './UIManager';
import { GameConfig } from '../Config/GameConfig';

/** 战场视图 */
const { ccclass, property } = cc._decorator;

@ccclass
export class BattleFieldView extends cc.Component {
    /** 战场容器节点 */
    @property(cc.Node)
    fieldContainer: cc.Node = null;
    
    /** 我方战场容器 */
    @property(cc.Node)
    playerField: cc.Node = null;
    
    /** 敌方战场容器 */
    @property(cc.Node)
    enemyField: cc.Node = null;
    
    /** 格子预制体 */
    @property(cc.Prefab)
    cellPrefab: cc.Prefab = null;
    
    /** 怪物预制体 */
    @property(cc.Prefab)
    monsterPrefab: cc.Prefab = null;
    
    /** 格子大小 */
    @property
    cellSize: number = 80;
    
    /** 我方格子节点 */
    private playerCells: cc.Node[] = [];
    
    /** 敌方格子节点 */
    private enemyCells: cc.Node[] = [];
    
    /** 我方怪物视图 */
    private playerMonsters: Map<number, CardView> = new Map();
    
    /** 敌方怪物视图 */
    private enemyMonsters: Map<number, CardView> = new Map();
    
    /** 选中的我方怪物 */
    private selectedMonster: number = -1;
    
    /** 可攻击目标高亮 */
    private attackableTargets: number[] = [];
    
    /** 怪物点击回调 */
    private monsterClickCallback: ((card: CardData, position: number, isPlayer: boolean) => void) | null = null;
    
    /** 格子点击回调 */
    private cellClickCallback: ((position: number, isPlayer: boolean) => void) | null = null;
    
    /** onLoad */
    onLoad() {
        this.initField();
    }
    
    /** 初始化战场 */
    public initField(): void {
        this.createCells();
    }
    
    /** 创建格子 */
    private createCells(): void {
        // 创建我方格子（6个位置：0-2前线，3-5后线）
        for (let i = 0; i < GameConfig.PLAYER_FIELD_SIZE; i++) {
            const cell = this.createCell(i, true);
            this.playerCells.push(cell);
            if (this.playerField) {
                cell.parent = this.playerField;
            }
        }
        
        // 创建敌方格子
        for (let i = 0; i < GameConfig.PLAYER_FIELD_SIZE; i++) {
            const cell = this.createCell(i, false);
            this.enemyCells.push(cell);
            if (this.enemyField) {
                cell.parent = this.enemyField;
            }
        }
    }
    
    /** 创建单个格子 */
    private createCell(index: number, isPlayer: boolean): cc.Node {
        const cell = new cc.Node(`cell_${isPlayer ? 'player' : 'enemy'}_${index}`);
        
        // 添加布局组件
        const layout = cell.addComponent(cc.Layout);
        layout.type = cc.Layout.Type.NONE;
        layout.padding = 0;
        layout.spacing = new cc.Vec2(0, 0);
        
        // 设置位置
        const position = UIManager.getInstance().calculateFieldCellPosition(index, !isPlayer);
        cell.setPosition(position.x, position.y);
        
        // 设置大小
        const size = cell.addComponent(cc.Widget);
        size.rawWidth = this.cellSize;
        size.rawHeight = this.cellSize;
        
        // 添加点击事件
        const button = cell.addComponent(cc.Button);
        button.transition = cc.Button.Transition.COLOR;
        
        const clickEvent = new cc.Component.EventHandler();
        clickEvent.target = this.node;
        clickEvent.component = 'BattleFieldView';
        clickEvent.handler = 'onCellClicked';
        clickEvent.customEventData = `${index}:${isPlayer}`;
        button.clickEvents.push(clickEvent);
        
        // 添加透明背景用于接收点击
        const sprite = cell.addComponent(cc.Sprite);
        sprite.type = cc.Sprite.Type.SLICED;
        sprite.sizeMode = cc.Sprite.SizeMode.RAW;
        cell.setContentSize(this.cellSize, this.cellSize);
        
        return cell;
    }
    
    /** 格子点击事件 */
    public onCellClicked(event: cc.Event.EventTouch, customData: string): void {
        const [indexStr, isPlayerStr] = customData.split(':');
        const position = parseInt(indexStr);
        const isPlayer = isPlayerStr === 'true';
        
        if (this.cellClickCallback) {
            this.cellClickCallback(position, isPlayer);
        }
    }
    
    // ==================== 怪物管理 ====================
    
    /** 添加怪物到战场 */
    public addMonster(card: CardData, position: number, isPlayer: boolean, animated: boolean = true): void {
        if (position < 0 || position >= GameConfig.PLAYER_FIELD_SIZE) return;
        
        // 检查位置是否已有怪物
        const existingMonster = isPlayer ? 
            this.playerMonsters.get(position) : 
            this.enemyMonsters.get(position);
        
        if (existingMonster) {
            this.removeMonster(position, isPlayer, animated);
        }
        
        // 创建怪物视图
        const monsterView = this.createMonsterView(card);
        if (!monsterView) return;
        
        // 设置父节点
        const parentNode = isPlayer ? this.playerCells[position] : this.enemyCells[position];
        monsterView.node.parent = parentNode;
        monsterView.node.setPosition(0, 0);
        
        // 保存引用
        if (isPlayer) {
            this.playerMonsters.set(position, monsterView);
        } else {
            this.enemyMonsters.set(position, monsterView);
        }
        
        // 播放动画
        if (animated) {
            monsterView.playEntranceAnimation();
        }
    }
    
    /** 创建怪物视图 */
    private createMonsterView(card: CardData): CardView | null {
        if (!this.monsterPrefab) {
            // 如果没有预制体，创建一个简单的节点
            const node = new cc.Node('MonsterView');
            node.parent = this.fieldContainer || this.node;
            
            const view = node.addComponent(CardView);
            view.initWithData(card);
            return view;
        }
        
        const monsterNode = cc.instantiate(this.monsterPrefab);
        if (!monsterNode) return null;
        
        const view = monsterNode.getComponent(CardView);
        if (!view) return null;
        
        view.initWithData(card);
        
        // 设置点击回调
        view.onCardClick((c) => {
            // 查找这个卡牌对应的位置
            let pos = -1;
            let isPlayer = false;
            
            for (const [p, v] of this.playerMonsters) {
                if (v.getCardData()?.instanceId === c.instanceId) {
                    pos = p;
                    isPlayer = true;
                    break;
                }
            }
            
            if (pos === -1) {
                for (const [p, v] of this.enemyMonsters) {
                    if (v.getCardData()?.instanceId === c.instanceId) {
                        pos = p;
                        isPlayer = false;
                        break;
                    }
                }
            }
            
            if (pos !== -1 && this.monsterClickCallback) {
                this.monsterClickCallback(c, pos, isPlayer);
            }
        });
        
        return view;
    }
    
    /** 移除怪物 */
    public removeMonster(position: number, isPlayer: boolean, animated: boolean = true): void {
        const monsterView = isPlayer ? 
            this.playerMonsters.get(position) : 
            this.enemyMonsters.get(position);
        
        if (!monsterView) return;
        
        if (animated) {
            monsterView.playDeathAnimation(() => {
                monsterView.node.destroy();
            });
        } else {
            monsterView.node.destroy();
        }
        
        if (isPlayer) {
            this.playerMonsters.delete(position);
        } else {
            this.enemyMonsters.delete(position);
        }
    }
    
    /** 清空战场 */
    public clearField(animated: boolean = true): void {
        if (animated) {
            let delay = 0;
            
            for (const [pos, view] of this.playerMonsters) {
                this.scheduleOnce(() => {
                    view.playDeathAnimation(() => view.node.destroy());
                }, delay);
                delay += 0.1;
            }
            
            for (const [pos, view] of this.enemyMonsters) {
                this.scheduleOnce(() => {
                    view.playDeathAnimation(() => view.node.destroy());
                }, delay);
                delay += 0.1;
            }
            
            this.scheduleOnce(() => {
                this.playerMonsters.clear();
                this.enemyMonsters.clear();
            }, delay + 0.5);
        } else {
            for (const [pos, view] of this.playerMonsters) {
                view.node.destroy();
            }
            for (const [pos, view] of this.enemyMonsters) {
                view.node.destroy();
            }
            this.playerMonsters.clear();
            this.enemyMonsters.clear();
        }
    }
    
    // ==================== 高亮和选择 ====================
    
    /** 高亮可攻击目标 */
    public highlightAttackableTargets(targetPositions: number[]): void {
        this.attackableTargets = targetPositions;
        
        for (const pos of targetPositions) {
            const monsterView = this.enemyMonsters.get(pos);
            if (monsterView) {
                // 添加高亮效果
                const glow = monsterView.node.getComponent(cc.Sprite);
                if (glow) {
                    // 可以添加闪烁效果
                }
            }
        }
    }
    
    /** 清除所有高亮 */
    public clearHighlights(): void {
        this.attackableTargets = [];
        
        for (const [pos, view] of this.playerMonsters) {
            view.setSelected(false);
        }
        
        for (const [pos, view] of this.enemyMonsters) {
            // 移除高亮效果
        }
    }
    
    /** 选中我方怪物 */
    public selectMonster(position: number): void {
        // 取消之前的选中
        if (this.selectedMonster !== -1) {
            const prevView = this.playerMonsters.get(this.selectedMonster);
            if (prevView) {
                prevView.setSelected(false);
            }
        }
        
        this.selectedMonster = position;
        
        const view = this.playerMonsters.get(position);
        if (view) {
            view.setSelected(true);
        }
    }
    
    /** 取消选中 */
    public deselectMonster(): void {
        if (this.selectedMonster !== -1) {
            const view = this.playerMonsters.get(this.selectedMonster);
            if (view) {
                view.setSelected(false);
            }
        }
        
        this.selectedMonster = -1;
        this.clearHighlights();
    }
    
    // ==================== 状态更新 ====================
    
    /** 更新怪物状态 */
    public updateMonsterStats(card: CardData): void {
        // 在所有位置查找这个卡牌
        for (const [pos, view] of this.playerMonsters) {
            if (view.getCardData()?.instanceId === card.instanceId) {
                view.updateStats();
                return;
            }
        }
        
        for (const [pos, view] of this.enemyMonsters) {
            if (view.getCardData()?.instanceId === card.instanceId) {
                view.updateStats();
                return;
            }
        }
    }
    
    /** 设置怪物攻击状态 */
    public setMonsterCanAttack(position: number, isPlayer: boolean, canAttack: boolean): void {
        const monsters = isPlayer ? this.playerMonsters : this.enemyMonsters;
        const view = monsters.get(position);
        
        if (view) {
            view.setCanAttack(canAttack);
        }
    }
    
    /** 播放攻击动画 */
    public playAttackAnimation(attackerPos: number, defenderPos: number, attackerIsPlayer: boolean, callback?: () => void): void {
        const attackerView = attackerIsPlayer ? 
            this.playerMonsters.get(attackerPos) : 
            this.enemyMonsters.get(attackerPos);
        
        const defenderView = attackerIsPlayer ? 
            this.enemyMonsters.get(defenderPos) : 
            this.playerMonsters.get(defenderPos);
        
        if (!attackerView || !defenderView) {
            if (callback) callback();
            return;
        }
        
        const attackerPosWorld = attackerView.node.parent.convertToWorldSpaceAR(attackerView.node.position);
        const defenderPosWorld = defenderView.node.parent.convertToWorldSpaceAR(defenderView.node.position);
        
        // 攻击动画
        attackerView.playAttackAnimation(defenderPosWorld.sub(attackerPosWorld), () => {
            // 受击动画
            defenderView.playDamageAnimation(() => {
                if (callback) callback();
            });
        });
    }
    
    // ==================== 回调设置 ====================
    
    /** 设置怪物点击回调 */
    public onMonsterClicked(callback: (card: CardData, position: number, isPlayer: boolean) => void): void {
        this.monsterClickCallback = callback;
    }
    
    /** 设置格子点击回调 */
    public onCellClicked(callback: (position: number, isPlayer: boolean) => void): void {
        this.cellClickCallback = callback;
    }
    
    // ==================== 工具方法 ====================
    
    /** 获取战场怪物数量 */
    public getMonsterCount(isPlayer: boolean): number {
        return isPlayer ? this.playerMonsters.size : this.enemyMonsters.size;
    }
    
    /** 获取指定位置的怪物 */
    public getMonsterAt(position: number, isPlayer: boolean): CardData | null {
        const monsters = isPlayer ? this.playerMonsters : this.enemyMonsters;
        const view = monsters.get(position);
        return view ? view.getCardData() : null;
    }
    
    /** 获取选中的怪物位置 */
    public getSelectedPosition(): number {
        return this.selectedMonster;
    }
}
