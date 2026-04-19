# 技术设计文档 - 萌系动物卡牌对战游戏

## 基本信息

- **项目名称**：萌系卡牌对战 (Cute Card Battle)
- **游戏引擎**：Cocos Creator 3.x
- **开发语言**：TypeScript
- **目标平台**：微信小程序 / H5 跨端

## 项目结构

```
assets/
├── Scenes/                 # 游戏场景
│   ├── MainScene.fire      # 主场景（菜单）
│   ├── BattleScene.fire    # 战斗场景
│   ├── DeckScene.fire      # 卡组管理场景
│   └── AdventureScene.fire # 冒险模式场景
├── Scripts/                # 游戏脚本
│   ├── Core/               # 核心模块
│   │   ├── Card.ts         # 卡牌数据类
│   │   ├── Deck.ts         # 套牌数据类
│   │   ├── Player.ts       # 玩家数据类
│   │   └── BattleManager.ts # 战斗管理器
│   ├── UI/                 # UI组件
│   │   ├── CardView.ts     # 卡牌视图组件
│   │   ├── HandView.ts     # 手牌视图组件
│   │   └── BattleFieldView.ts # 战场视图组件
│   ├── AI/                 # AI系统
│   │   └── AIController.ts # AI控制器
│   └── Utils/              # 工具类
│       ├── ElementEffect.ts # 属性效果计算
│       └── ComboSystem.ts   # 连携系统
├── Prefabs/                # 预制体
│   ├── CardPrefab.ts       # 卡牌预制体
│   ├── MonsterPrefab.ts   # 战场怪物预制体
│   └── UI/PanelPrefab.ts  # UI面板预制体
├── Data/                   # 数据配置
│   ├── Cards.json          # 卡牌配置数据
│   └── Elements.json       # 元素属性配置
├── Resources/              # 资源文件
│   ├── Sprites/            # 2D精灵图
│   ├── Animations/         # 动画资源
│   └── Audio/              # 音效音乐
└── Settings/               # 项目设置
    └── GameConfig.ts       # 游戏配置常量
```

## 核心数据模型

### CardData 卡牌数据

```typescript
interface CardData {
  id: string;           // 唯一标识
  name: string;          // 卡牌名称
  element: ElementType;  // 元素属性（火/木/水/光/暗）
  role: RoleType;       // 定位（刺客/法师/战士/坦克/辅助）
  rarity: Rarity;       // 稀有度（普通/稀有/史诗/传说）
  cost: number;         // 水晶费用（1-9）
  attack: number;       // 攻击力
  health: number;       // 生命值
  skill: SkillData;     // 技能数据
  maxLevel: number;     // 最大等级
  currentLevel: number;  // 当前等级
  breakthrough: number;  // 突破次数（0-5）
  skin: string;         // 皮肤ID
}

enum ElementType { Fire, Wood, Water, Light, Shadow }
enum RoleType { Assassin, Mage, Warrior, Tank, Support }
enum Rarity { Normal, Rare, Epic, Legend }
```

### PlayerState 玩家状态

```typescript
interface PlayerState {
  hp: number;           // 当前生命值
  maxHp: number;        // 最大生命值
  mana: number;         // 当前水晶
  maxMana: number;      // 水晶上限
  energy: number;       // 当前能量
  hand: CardData[];     // 手牌
  field: CardData[];    // 战场卡牌
  deck: CardData[];     // 牌堆
  graveyard: CardData[]; // 墓地
  shields: Map<string, number>; // 护盾列表
}
```

### BattleState 战斗状态

```typescript
interface BattleState {
  playerState: PlayerState;
  enemyState: PlayerState;
  turn: number;         // 当前回合
  isPlayerTurn: boolean;
  turnPhase: TurnPhase; // 回合阶段
  comboActive: ComboEffect[];
  battleLog: BattleLog[];
}

enum TurnPhase { DrawPhase, MainPhase, BattlePhase, EndPhase }
```

## 核心系统设计

### 1. 战斗管理系统 (BattleManager)

**职责**：管理整个战斗流程

**关键方法**：

| 方法 | 说明 | 对应需求 |
|------|------|---------|
| initBattle(playerDeck, enemyDeck) | 初始化战斗 | 需求4 |
| startTurn() | 开始回合，增加水晶 | 需求4 |
| drawCard() | 抽牌 | 需求4 |
| playCard(card, position) | 出牌到战场 | 需求4 |
| attack(attacker, defender) | 执行攻击 | 需求4 |
| endTurn() | 结束回合 | 需求4 |
| checkWinCondition() | 检查胜负条件 | 需求4 |
| executeSkill(card, target) | 执行技能 | 需求4 |

### 2. 属性相克系统 (ElementEffect)

**克制关系**：
- 火 → 木 → 水 → 火（循环克制）
- 光 ↔ 暗（互克）

**计算公式**：
```
finalDamage = baseDamage × elementMultiplier × comboMultiplier
```

**elementMultiplier**：克制1.5，被克0.67，其他1.0

### 3. 连携系统 (ComboSystem)

**检测逻辑**：
```typescript
function checkCombo(deck: CardData[]): ComboEffect[] {
  const elementCounts = countByElement(deck);
  const combos: ComboEffect[] = [];
  
  for (const [element, count] of elementCounts) {
    if (count >= 3) {
      combos.push(createCombo(element, count >= 5 ? 'high' : 'low'));
    }
  }
  return combos;
}
```

### 4. AI控制器 (AIController)

**决策优先级**：
1. 如果能量满，优先出高费强卡
2. 优先出克制对方属性的卡
3. 优先击杀低血量目标
4. 优先攻击辅助/法师定位

**难度实现**：
- 入门：随机出牌
- 简单：80%概率出最优
- 普通：100%最优
- 困难：120%最优（套牌强度1.2）
- 大师：增加预判逻辑

### 5. 卡牌养成系统

**升级公式**：
```
attack = baseAttack + (level - 1) × (baseAttack × 0.05) × rarityMultiplier
health = baseHealth + (level - 1) × (baseHealth × 0.05) × rarityMultiplier
```

**突破效果**：每次突破提升10%属性成长

## UI组件设计

### CardView 卡牌视图

**状态**：
- normal：正常可点击
- selected：选中状态
- disabled：禁用（费用不足）
- attacking：攻击中
- damaged：受击中
- dying：死亡中

**动画**：
- 出场：scale 0→1，opacity 0→1，duration 0.3s
- 攻击：translateTo target，duration 0.2s
- 受击：shake + red flash，duration 0.2s
- 死亡：scale 1→0，opacity 1→0，particle burst

### BattleFieldView 战场视图

**布局**：
- 我方前线：3个位置
- 我方后线：3个位置
- 敌方前线：3个位置
- 敌方后线：3个位置

**交互**：
- 点击我方卡牌：选中，显示攻击范围
- 点击敌方卡牌：执行攻击
- 拖拽手牌到战场：出牌

### HandView 手牌视图

**布局**：底部横向排列，最多10张
**交互**：
- 点击：选中卡牌
- 长按：显示详情面板
- 拖拽：出牌到战场

## 场景流程

### 主场景 (MainScene)

```
入口 → 加载资源 → 主菜单
  ├── 开始对战 → 套牌选择 → 难度选择 → 战斗场景
  ├── 卡组管理 → 卡牌列表/编辑套牌
  ├── 冒险模式 → 章节选择 → 关卡选择 → 战斗场景
  ├── 天梯排位 → 匹配中 → 战斗场景
  └── 设置 → 音量/语言/数据重置
```

### 战斗场景 (BattleScene)

```
加载场景 → 初始化双方状态 → 先手判定
  ↓
回合循环
  ├── 回合开始动画
  ├── 抽牌阶段
  ├── 主要阶段（出牌）
  ├── 战斗阶段（攻击）
  └── 回合结束
  ↓
胜负判定 → 结果展示 → 返回主场景
```

## 数据持久化

使用 Cocos Creator 的 LocalStorage：

```typescript
// 存储玩家数据
const SAVE_KEY = 'CUTE_CARD_BATTLE_SAVE';

interface SaveData {
  version: number;           // 数据版本
  playerLevel: number;        // 玩家等级
  coins: number;             // 金币
  cards: OwnedCard[];       // 拥有的卡牌
  decks: DeckData[];         // 套牌列表
  leaguePoints: number;      // 天梯积分
  leagueRank: number;        // 天梯段位
  adventureProgress: number; // 冒险进度
}
```

## 性能优化

1. **对象池**：卡牌、粒子特效复用
2. **延迟加载**：非战斗场景按需加载资源
3. **批处理**：相同材质精灵合并渲染
4. **动画优化**：使用 skeletal animation 代替帧动画

## 技术实现计划

| 阶段 | 内容 | 优先级 |
|------|------|--------|
| Phase 1 | 项目基础框架、数据模型、卡牌配置 | P0 |
| Phase 2 | 战斗系统核心（出牌、攻击、结算） | P0 |
| Phase 3 | UI系统（手牌、战场、卡牌详情） | P1 |
| Phase 4 | 属性相克、连携系统 | P1 |
| Phase 5 | AI对战系统（5种难度） | P1 |
| Phase 6 | 天梯排位系统 | P2 |
| Phase 7 | 冒险模式 | P2 |
| Phase 8 | 养成系统（强化、突破、皮肤） | P2 |
| Phase 9 | 音效、动画、特效 | P2 |
| Phase 10 | 新手引导 | P3 |

---

*文档版本：v1.0*
*创建日期：2026-04-18*
*状态：待实现*
