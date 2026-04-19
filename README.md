# 萌系动物卡牌对战游戏

一款面向全年龄段的卡通可爱风格卡牌策略对战游戏，使用 Cocos Creator 3.x 开发。

## 项目概述

玩家收集各种萌系动物卡牌，组建套牌与AI进行策略对战。游戏包含元素相克、连携系统、能量大招等深度策略元素。

## 游戏特色

- **萌系动物主题**：50张可爱动物卡牌（狐狸、兔子、熊、猫、鸟）
- **元素相克**：火>木>水>火（循环），光暗互克
- **5种定位**：刺客/法师/战士/坦克/辅助，各有特色
- **连携系统**：同属性3张激活效果，5张升级
- **能量大招**：积蓄能量释放强力技能
- **多种模式**：AI对战（5种难度）、天梯排位、冒险模式

## 技术栈

- **引擎**：Cocos Creator 3.x
- **语言**：TypeScript
- **目标平台**：微信小程序 / H5

## 项目结构

```
assets/
├── Scripts/                 # 游戏脚本
│   ├── Core/              # 核心模块
│   │   ├── Types.ts       # 枚举和常量定义
│   │   ├── CardData.ts    # 卡牌数据类
│   │   ├── PlayerState.ts # 玩家状态类
│   │   ├── BattleManager.ts # 战斗管理器
│   │   ├── SkillData.ts   # 技能数据结构
│   │   └── Game.ts        # 游戏主入口
│   ├── AI/                # AI系统
│   │   └── AIController.ts # AI控制器
│   ├── Utils/             # 工具类
│   │   ├── ComboSystem.ts  # 连携系统
│   │   ├── AudioManager.ts # 音频管理
│   │   └── EffectManager.ts # 特效管理
│   ├── Data/              # 数据配置
│   │   ├── CardConfigs.ts # 卡牌配置（50张）
│   │   └── SaveManager.ts # 存档管理
│   ├── Config/            # 配置常量
│   │   └── GameConfig.ts  # 游戏配置
│   └── UI/                # UI组件
│       └── UIManager.ts   # UI管理
├── Scenes/                # 场景文件（待创建）
├── Prefabs/               # 预制体（待创建）
├── Data/                  # 数据文件（待创建）
└── Resources/             # 资源文件（待创建）
```

## 核心系统

### 1. 战斗系统

**BattleManager** 负责管理整个战斗流程：
- 回合管理（抽牌、出牌、攻击、结束）
- 水晶和能量系统
- 胜负判定
- 技能触发

### 2. 卡牌系统

**CardData** 包含卡牌的所有属性：
- 基础属性（名称、元素、定位、稀有度）
- 战斗属性（费用、攻击、生命）
- 养成属性（等级、突破、皮肤）
- 状态属性（护盾、休眠、攻击力降低）

### 3. AI系统

**AIController** 实现5种难度的AI对战：
- 入门：随机出牌和攻击
- 简单：80%概率最优决策
- 普通：100%最优决策
- 困难：套牌强度1.2倍
- 大师：增加预判逻辑

### 4. 属性相克

元素克制关系：
- 火 → 木（火焰灼烧）
- 木 → 水（扎根吸水）
- 水 → 火（水能灭火）
- 光 ↔ 暗（光明与黑暗互斥）

克制时伤害1.5倍，被克时伤害0.67倍。

### 5. 连携系统

同属性卡牌达到一定数量时激活连携效果：
- 3张：基础效果（攻击+10%或生命+10%等）
- 5张：升级效果（更高加成+特殊效果）

## 使用方法

### 初始化游戏

```typescript
import { Game, getGame } from './Scripts/Core/Game';

// 获取游戏实例
const game = getGame();

// 初始化游戏
game.init();
```

### 开始战斗

```typescript
import { Difficulty } from './Scripts/Core/Types';

// 开始战斗
game.startBattle(Difficulty.Normal);
```

### 玩家操作

```typescript
// 出牌
game.playerPlayCard(cardInstanceId, position);

// 攻击卡牌
game.playerAttack(attackerId, defenderId);

// 攻击敌方主基地
game.playerAttackEnemyBase(attackerId);

// 结束回合
game.playerEndTurn();
```

### AI回合

```typescript
// 执行AI回合（异步）
await game.executeAITurn();
```

## 开发进度

- [x] Phase 1: 项目基础框架
- [x] Phase 2: 战斗系统核心
- [x] Phase 3: 属性相克与连携系统
- [ ] Phase 4: UI系统
- [ ] Phase 5: AI对战系统
- [ ] Phase 6: 主场景与导航
- [ ] Phase 7: 天梯排位系统
- [ ] Phase 8: 冒险模式
- [ ] Phase 9: 卡牌养成系统
- [ ] Phase 10: 音效与特效
- [ ] Phase 11: 数据持久化
- [ ] Phase 12: 新手引导

## 待完成工作

1. **UI系统**：创建Cocos Creator场景和预制体
2. **战斗界面**：手牌显示、战场、攻击逻辑
3. **主界面**：开始对战、卡组管理、冒险模式入口
4. **资源准备**：卡牌立绘、音效、背景音乐

## 配置说明

游戏配置位于 `assets/Scripts/Config/GameConfig.ts`：
- 初始生命值：20
- 初始水晶：3
- 套牌大小：12张
- 最高水晶：10
- 能量上限：10

卡牌配置位于 `assets/Scripts/Data/CardConfigs.ts`：
- 50张卡牌配置
- 4种稀有度
- 5种元素
- 5种定位

## 存档结构

```typescript
interface SaveData {
    version: number;           // 数据版本
    playerLevel: number;        // 玩家等级
    coins: number;             // 金币
    ownedCards: OwnedCard[];   // 拥有的卡牌
    decks: DeckData[];         // 套牌列表
    currentDeckId: string;     // 当前套牌ID
    leaguePoints: number;      // 天梯积分
    leagueRank: number;        // 天梯段位
    adventureProgress: ...;     // 冒险进度
    settings: ...;             // 游戏设置
}
```

## 学习资源

- [Cocos Creator 3.x 官方文档](https://docs.cocos.com/creator3.x/manual/)
- [TypeScript 官方文档](https://www.typescriptlang.org/docs/)

## 许可证

本项目仅供学习交流使用。
