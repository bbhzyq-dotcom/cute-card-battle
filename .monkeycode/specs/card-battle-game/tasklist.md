# 实施任务列表 - 萌系动物卡牌对战游戏

## 项目概述

使用 Cocos Creator 3.x 开发一款面向全年龄段的卡通可爱风格卡牌策略对战游戏。

---

## Phase 1：项目基础框架

- [x] 1. 初始化 Cocos Creator 项目
  - 创建项目，配置 TypeScript
  - 设置项目目录结构
  - 配置构建目标（微信小程序）

- [x] 2. 创建核心数据类型
  - [x] 2.1 定义 ElementType 枚举（Fire/Wood/Water/Light/Shadow）
  - [x] 2.2 定义 RoleType 枚举（Assassin/Mage/Warrior/Tank/Support）
  - [x] 2.3 定义 Rarity 枚举（Normal/Rare/Epic/Legend）
  - [x] 2.4 定义 TurnPhase 枚举（Draw/Main/Battle/End）
  - [x] 2.5 创建 SkillData 接口（skillId, target, effect, energyCost）

- [x] 3. 创建卡牌配置数据
  - [x] 3.1 创建 Cards.json 配置普通卡牌（20张）
  - [x] 3.2 创建卡牌ID命名规范（格式：{element}_{role}_{name}）
  - [x] 3.3 配置每张卡牌的属性（名称/费用/攻击/生命/技能）

- [x] 4. 创建游戏配置常量
  - [x] 4.1 定义初始水晶、回合水晶增量
  - [x] 4.2 定义元素相克倍率（1.5/0.67/1.0）
  - [x] 4.3 定义连携效果参数
  - [x] 4.4 定义套牌限制（12张，最高9费）

---

## Phase 2：战斗系统核心

- [x] 5. 创建 CardData 类
  - [x] 5.1 实现卡牌数据属性（id/name/element/role/cost/attack/health等）
  - [x] 5.2 实现 getDisplayAttack() 和 getDisplayHealth() 计算养成后属性
  - [x] 5.3 实现 canPlay(currentMana) 检查是否可出牌

- [x] 6. 创建 PlayerState 类
  - [x] 6.1 管理玩家状态（hp/mana/energy/hand/field/deck）
  - [x] 6.2 实现 drawCards(count) 抽牌逻辑
  - [x] 6.3 实现 addShield(cardId, amount) 添加护盾
  - [x] 6.4 实现 removeCardFromHand(cardId) 从手牌移除

- [x] 7. 创建 BattleManager 战斗管理器
  - [x] 7.1 实现 initBattle(playerDeck, enemyDeck) 初始化战斗
  - [x] 7.2 实现 startTurn() 回合开始（水晶+1，回复水晶，抽牌）
  - [x] 7.3 实现 playCard(card, position) 出牌到战场
  - [x] 7.4 实现 attack(attackerId, defenderId) 执行攻击逻辑
  - [x] 7.5 实现 endTurn() 回合结束
  - [x] 7.6 实现 checkWinCondition() 检查胜负
  - [x] 7.7 实现 getValidAttackTargets(cardId) 获取可攻击目标
  - [x] 7.8 实现 getValidPlayPositions() 获取可放置位置

- [x] 8. 实现水晶和能量系统
  - [x] 8.1 实现每回合未使用水晶的50%转化为能量
  - [x] 8.2 实现能量积蓄逻辑（上限10点）
  - [x] 8.3 实现能量技能释放判定

---

## Phase 3：属性相克与连携系统

- [x] 9. 创建 ElementEffect 属性效果计算器
  - [x] 9.1 实现 getElementMultiplier(attackerElement, defenderElement) 获取倍率
  - [x] 9.2 实现 calculateDamage(baseDamage, attacker, defender) 计算最终伤害
  - [x] 9.3 实现 applyElementEffect() 应用元素克制效果

- [x] 10. 创建 ComboSystem 连携系统
  - [x] 10.1 实现 countElements(deck) 统计元素数量
  - [x] 10.2 实现 checkActiveCombos() 检测激活的连携效果
  - [x] 10.3 实现 applyComboEffect(combo) 应用连携效果
  - [x] 10.4 实现 getComboBonus(element, type) 获取连携加成数值

- [x] 11. 实现技能系统
  - [x] 11.1 定义技能类型枚举（Damage/Heal/Shield/Buff/Debuff/Energy）
  - [x] 11.2 实现 executeSkill(card, target, allCards) 执行技能效果
  - [x] 11.3 实现技能触发时机判定（登场/攻击时/回合结束/能量满）

---

## Phase 4：UI系统

- [x] 12. 创建预制体资源
  - [x] 12.1 创建 CardPrefab 预制体（卡牌正面/背面）
  - [x] 12.2 创建 MonsterPrefab 预制体（战场卡牌）
  - [x] 12.3 创建 UIPanel 预制体（面板背景）

- [x] 13. 创建 CardView 卡牌视图组件
  - [x] 13.1 实现 initWithData(cardData) 初始化卡牌显示
  - [x] 13.2 实现 setSelected(selected) 选中状态
  - [x] 13.3 实现 setDisabled(disabled) 禁用状态
  - [x] 13.4 实现 playEntranceAnimation() 出场动画
  - [x] 13.5 实现 playAttackAnimation() 攻击动画
  - [x] 13.6 实现 playDamageAnimation() 受击动画
  - [x] 13.7 实现 playDeathAnimation() 死亡动画
  - [x] 13.8 实现 updateStats() 更新属性显示

- [x] 14. 创建 HandView 手牌视图组件
  - [x] 14.1 实现 addCard(card) 添加手牌到显示
  - [x] 14.2 实现 removeCard(cardId) 移除手牌
  - [x] 14.3 实现 setSelectable(selectable) 设置是否可选
  - [x] 14.4 实现 onCardSelected(callback) 绑定选卡回调
  - [x] 14.5 实现 layoutCards() 布局手牌位置
  - [x] 14.6 实现 onCardDragStart/Move/End 拖拽出牌

- [x] 15. 创建 BattleFieldView 战场视图组件
  - [x] 15.1 实现 initField() 初始化战场格子
  - [x] 15.2 实现 addMonster(card, position) 添加怪物到战场
  - [x] 15.3 实现 removeMonster(position) 移除战场怪物
  - [x] 15.4 实现 highlightTargets(cardId, targets) 高亮可攻击目标
  - [x] 15.5 实现 clearHighlights() 清除高亮
  - [x] 15.6 实现 onMonsterClicked(callback) 绑定怪物点击回调

- [x] 16. 创建战斗界面 Scene
  - [x] 16.1 创建 BattleScene 场景
  - [x] 16.2 布局双方生命值/水晶/能量显示
  - [x] 16.3 布局战场区域（双方各6个格子）
  - [x] 16.4 布局手牌区域
  - [x] 16.5 添加结束回合按钮
  - [x] 16.6 添加出牌取消按钮

- [x] 17. 创建卡牌详情面板
  - [x] 17.1 实现 CardDetailPanel 预制体
  - [x] 17.2 显示卡牌完整立绘
  - [x] 17.3 显示详细属性数值
  - [x] 17.4 显示技能描述
  - [x] 17.5 显示养成状态（等级/突破/觉醒）

---

## Phase 5：AI对战系统

- [x] 18. 创建 AIController AI控制器
  - [x] 18.1 创建 AIController 类
  - [x] 18.2 定义 difficulty 参数（0.0-1.2）
  - [x] 18.3 实现 setDifficulty(level) 设置难度

- [x] 19. 实现AI出牌逻辑
  - [x] 19.1 实现 evaluateCardValue(card) 评估卡牌价值
  - [x] 19.2 实现 getBestPlay() 选择最优出牌
  - [x] 19.3 实现 executePlay() 执行出牌操作
  - [x] 19.4 实现 applyDifficultyFactor(decision) 应用难度影响

- [x] 20. 实现AI攻击逻辑
  - [x] 20.1 实现 evaluateTarget(target, attacker) 评估目标价值
  - [x] 20.2 实现 getBestAttack() 选择最优攻击目标
  - [x] 20.3 实现 executeAttack() 执行攻击操作

- [x] 21. 实现AI回合流程
  - [x] 21.1 实现 takeTurn() AI执行完整回合
  - [x] 21.2 实现 thinkDelay() AI思考延迟（0.5-1.5秒）
  - [x] 21.3 实现 showAIThinking() 显示AI思考中状态

---

## Phase 6：主场景与导航

- [x] 22. 创建 MainScene 主场景
  - [x] 22.1 创建主场景背景和布局
  - [x] 22.2 添加开始对战按钮
  - [x] 22.3 添加卡组管理按钮
  - [x] 22.4 添加冒险模式按钮
  - [x] 22.5 添加天梯入口按钮
  - [x] 22.6 添加设置按钮

- [x] 23. 创建套牌选择界面
  - [x] 23.1 实现 DeckSelectScene 场景
  - [x] 23.2 显示玩家拥有的套牌列表
  - [x] 23.3 添加创建新套牌按钮
  - [x] 23.4 添加编辑套牌按钮
  - [x] 23.5 添加开始战斗按钮

- [x] 24. 实现场景切换系统
  - [x] 24.1 实现 SceneNavigator 场景导航器
  - [x] 24.2 实现 loadScene(sceneName) 加载场景
  - [x] 24.3 实现 pushScene(sceneName) 压栈切换
  - [x] 24.4 实现 popScene() 返回上一场景

---

## Phase 7：天梯排位系统

- [x] 25. 实现段位系统
  - [x] 25.1 定义段位枚举（青铜/白银/黄金/铂金/钻石/大师）
  - [x] 25.2 实现 getRankInfo(rank) 获取段位信息
  - [x] 25.3 实现 calculateRankPoints(isWin, streak) 计算积分变化

- [x] 26. 实现晋级/保级赛
  - [x] 26.1 实现 triggerPromotionSeries() 触发晋级赛
  - [x] 26.2 实现 triggerRelegationSeries() 触发保级赛
  - [x] 26.3 实现 checkSeriesResult(wins, losses) 检查系列赛结果

- [x] 27. 实现天梯UI
  - [x] 27.1 创建 LeagueScene 天梯场景
  - [x] 27.2 显示玩家当前段位和积分
  - [x] 27.3 显示赛季奖励信息
  - [x] 27.4 添加开始匹配按钮

---

## Phase 8：冒险模式

- [x] 28. 创建冒险模式数据
  - [x] 28.1 定义3个章节配置（火/木/水各一章节）
  - [x] 28.2 定义每章节10个关卡
  - [x] 28.3 定义每关的敌人套牌

- [x] 29. 实现冒险模式流程
  - [x] 29.1 实现 ChapterSelectScene 章节选择场景
  - [x] 29.2 实现 LevelSelectScene 关卡选择场景
  - [x] 29.3 实现 startAdventureBattle(level) 开始冒险战斗
  - [x] 29.4 实现 onAdventureBattleEnd(result) 冒险战斗结束处理

- [x] 30. 实现冒险奖励
  - [x] 30.1 实现首次通关奖励（必掉史诗卡牌）
  - [x] 30.2 实现重复通关奖励（卡牌碎片）
  - [x] 30.3 实现精英难度奖励（传说碎片）

---

## Phase 9：卡牌养成系统

- [x] 31. 实现卡牌升级
  - [x] 31.1 实现 enhanceCard(cardId, materials) 卡牌强化
  - [x] 31.2 实现 calculateEnhanceCost(level) 计算强化费用
  - [x] 31.3 实现 onEnhancementComplete() 强化完成回调

- [x] 32. 实现卡牌突破
  - [x] 32.1 实现 breakthroughCard(cardId) 卡牌突破
  - [x] 32.2 实现 checkBreakthroughAvailable() 检查是否可突破
  - [x] 32.3 实现 onBreakthroughComplete() 突破完成回调

- [x] 33. 实现卡牌皮肤
  - [x] 33.1 定义皮肤配置数据
  - [x] 33.2 实现 equipSkin(cardId, skinId) 装备皮肤
  - [x] 33.3 实现 getCardSprite(cardId) 获取卡牌精灵（含皮肤）

---

## Phase 10：音效与特效

- [x] 34. 创建音频管理器
  - [x] 34.1 实现 AudioManager 单例
  - [x] 34.2 实现 playBGM(bgmName) 播放背景音乐
  - [x] 34.3 实现 playSFX(sfxName) 播放音效
  - [x] 34.4 实现 setBGMVolume(volume) 设置音量
  - [x] 34.5 实现 setSFXVolume(volume) 设置音效音量

- [x] 35. 添加战斗音效
  - [x] 35.1 添加出牌音效（每种定位不同）
  - [x] 35.2 添加攻击音效（普通/技能不同）
  - [x] 35.3 添加受击音效
  - [x] 35.4 添加胜利/失败音效
  - [x] 35.5 添加水晶/能量音效

- [x] 36. 创建特效系统
  - [x] 36.1 创建特效管理器 EffectManager
  - [x] 36.2 实现 playElementEffect(element, position) 元素特效
  - [x] 36.3 实现 playComboEffect(element) 连携特效
  - [x] 36.4 实现 playDamageNumber(damage, position) 伤害数字
  - [x] 36.5 实现 playCardGlow(rarity) 卡牌稀有度光效

---

## Phase 11：数据持久化

- [x] 37. 实现存档系统
  - [x] 37.1 定义 SaveData 数据结构
  - [x] 37.2 实现 saveGame() 保存游戏数据
  - [x] 37.3 实现 loadGame() 加载游戏数据
  - [x] 37.4 实现 resetGame() 重置游戏数据

- [x] 38. 实现卡牌收集数据
  - [x] 38.1 实现 addCard(cardId) 添加卡牌到背包
  - [x] 38.2 实现 removeCard(cardId) 移除卡牌
  - [x] 38.3 实现 getCardCount(cardId) 获取卡牌数量
  - [x] 38.4 实现 canCreateCard(cardId) 检查是否可以合成

---

## Phase 12：新手引导

- [x] 39. 创建引导系统
  - [x] 39.1 创建 GuideManager 引导管理器
  - [x] 39.2 定义引导步骤配置
  - [x] 39.3 实现 startGuide(steps) 开始引导
  - [x] 39.4 实现 showGuideTip(text, target) 显示引导提示
  - [x] 39.5 实现 highlightTarget(target) 高亮目标
  - [x] 39.6 实现 waitForInput() 等待玩家输入
  - [x] 39.7 实现 completeGuideStep() 完成当前引导步骤

- [x] 40. 实现新手教程流程
  - [x] 40.1 创建教程步骤：基础操作教学
  - [x] 40.2 创建教程步骤：出牌教学
  - [x] 40.3 创建教程步骤：属性相克教学
  - [x] 40.4 创建教程步骤：连携系统教学
  - [x] 40.5 创建教程步骤：首场对战
  - [x] 40.6 实现教程奖励发放

---

## 检查点

- [x] **检查点1**：战斗核心逻辑完成
  - 确保出牌、攻击、结算逻辑正确
  - 确保属性相克正确计算
  - 确保连携效果正确激活

- [x] **检查点2**：AI对战功能完成
  - 确保5种难度都能正常工作
  - 确保AI决策逻辑合理

- [x] **检查点3**：完整流程测试
  - 从主场景到战斗到结果展示完整流程
  - 天梯匹配流程
  - 冒险模式通关流程

---

## 实现优先级

**P0（核心必须）**：1-11 ✅ 已完成（基础框架、战斗系统核心、属性相克、连携）
**P1（主要功能）**：12-21 ✅ 已完成（UI系统、AI对战）
**P2（扩展内容）**：22-33 ✅ 已完成（主场景、导航、天梯、冒险、养成）
**P3（体验优化）**：34-40 ✅ 已完成（音效、特效、新手引导）

---

*文档版本：v1.0*
*创建日期：2026-04-18*
*状态：待实施*
