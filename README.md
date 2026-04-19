# 萌系动物卡牌对战游戏

一款面向全年龄段的卡通可爱风格卡牌策略对战游戏，使用 Cocos Creator 3.x 开发。

## 项目概述

玩家收集各种萌系动物卡牌，组建套牌与AI进行策略对战。游戏包含元素相克、连携系统、能量大招等深度策略元素。

## 开发进度

- [x] Phase 1: 项目基础框架
- [x] Phase 2: 战斗系统核心
- [x] Phase 3: 属性相克与连携系统
- [x] Phase 4: UI系统代码框架
- [x] Phase 5: AI对战系统
- [x] Phase 6: 主场景与导航
- [x] Phase 7: 天梯排位系统
- [x] Phase 8: 冒险模式
- [x] Phase 9: 卡牌养成系统
- [x] Phase 10: 音效与特效代码
- [x] Phase 11: 数据持久化
- [x] Phase 12: 新手引导代码
- [x] 占位符资源生成
- [ ] Cocos Creator 场景文件配置
- [ ] 美术资源替换

## 快速开始

### 1. 在 Cocos Creator 中打开项目

1. 下载并安装 [Cocos Creator 3.8+](https://www.cocos.com/download)
2. 打开 Cocos Creator
3. 选择"打开项目"
4. 选择本项目根目录

### 2. 配置项目设置

在 Cocos Creator 中配置以下内容：

**项目 -> 项目设置 -> 引擎设置**:
- 设计分辨率: 960 x 640
- 适配模式: Fit Height

**项目 -> 项目设置 -> 模块设置**:
- 勾选所有必要的模块（2D/3D、UI、Audio等）

### 3. 导入占位符资源

已生成的占位符资源位于 `assets/Resources/Sprites/` 目录：

```
assets/Resources/Sprites/
├── Elements/          # 元素图标 (fire, wood, water, light, dark)
├── Roles/             # 定位图标 (assassin, mage, warrior, tank, support)
├── UI/                # UI元素 (按钮、卡牌边框)
├── Backgrounds/       # 背景图
├── Cards/             # 示例卡牌图片
└── card_back.png      # 卡背
```

### 4. 创建场景文件

在 Cocos Creator 编辑器中创建以下场景：

1. **MainMenu** (主菜单)
   - 文件: `assets/Scenes/MainMenu.fire`
   - 组件: MainMenuView

2. **Battle** (战斗)
   - 文件: `assets/Scenes/Battle.fire`
   - 组件: BattleSceneController

3. **DeckManage** (卡组管理)
   - 文件: `assets/Scenes/DeckManage.fire`
   - 组件: DeckManageView

4. **DifficultySelect** (难度选择)
   - 文件: `assets/Scenes/DifficultySelect.fire`
   - 组件: DifficultySelectView

5. **League** (天梯)
   - 文件: `assets/Scenes/League.fire`

### 5. 场景节点结构参考

**MainMenu.fire**:
```
Canvas (Canvas)
├── Background (Sprite)
├── LogoLabel (Label - "萌系卡牌对战")
├── PlayerInfoLabel (Label)
├── VersionLabel (Label)
├── BattleButton (Button + Sprite + Label "开始对战")
├── DeckButton (Button + Sprite + Label "卡组管理")
├── AdventureButton (Button + Sprite + Label "冒险模式")
├── LadderButton (Button + Sprite + Label "天梯排位")
└── SettingsButton (Button + Sprite + Label "设置")
```

**Battle.fire**:
```
Canvas (Canvas)
├── PlayerInfoPanel
│   ├── PlayerAvatar
│   ├── PlayerHP
│   └── PlayerEnergy
├── EnemyInfoPanel
│   ├── EnemyAvatar
│   ├── EnemyHP
│   └── EnemyEnergy
├── PlayerField (Layout)
│   └── [MonsterPrefabs...]
├── EnemyField (Layout)
│   └── [MonsterPrefabs...]
├── HandArea (Layout)
│   └── [CardPrefabs...]
├── ActionButtons
│   ├── EndTurnButton
│   └── SurrenderButton
└── TipLabel
```

### 6. 挂载脚本组件

在 Cocos Creator 编辑器中，将脚本组件挂载到对应节点：

| 场景 | 节点 | 组件脚本 |
|------|------|----------|
| MainMenu | Canvas | MainMenuView |
| Battle | Canvas | BattleSceneController |
| DeckManage | Canvas | DeckManageView |
| DifficultySelect | Canvas | DifficultySelectView |
| CardPrefab | CardRoot | CardView |
| HandCardPrefab | HandRoot | HandView |

### 7. 关联资源

将占位符图片拖拽到对应的 Sprite 组件上：

| 组件 | 资源路径 |
|------|----------|
| Background Sprite | `Sprites/Backgrounds/main_menu_bg.png` |
| Card Frame (Normal) | `Sprites/UI/card_frame_normal.png` |
| Card Frame (Rare) | `Sprites/UI/card_frame_rare.png` |
| Card Frame (Epic) | `Sprites/UI/card_frame_epic.png` |
| Card Frame (Legend) | `Sprites/UI/card_frame_legend.png` |
| Fire Element | `Sprites/Elements/fire_icon.png` |
| Water Element | `Sprites/Elements/water_icon.png` |
| Wood Element | `Sprites/Elements/wood_icon.png` |
| Light Element | `Sprites/Elements/light_icon.png` |
| Dark Element | `Sprites/Elements/dark_icon.png` |
| Assassin Icon | `Sprites/Roles/assassin_icon.png` |
| Mage Icon | `Sprites/Roles/mage_icon.png` |
| Warrior Icon | `Sprites/Roles/warrior_icon.png` |
| Tank Icon | `Sprites/Roles/tank_icon.png` |
| Support Icon | `Sprites/Roles/support_icon.png` |

### 8. 运行游戏

按 `Ctrl + R` (Windows) 或 `Cmd + R` (Mac) 运行游戏。

## 项目结构

```
assets/
├── Scripts/
│   ├── Core/              # 核心模块
│   │   ├── Types.ts       # 枚举和常量
│   │   ├── CardData.ts     # 卡牌数据
│   │   ├── PlayerState.ts  # 玩家状态
│   │   ├── BattleManager.ts # 战斗管理
│   │   ├── SkillData.ts    # 技能数据
│   │   ├── Game.ts         # 游戏主入口
│   │   ├── LeagueSystem.ts  # 天梯系统
│   │   ├── AdventureSystem.ts # 冒险模式
│   │   ├── CardEnhancementSystem.ts # 卡牌养成
│   │   └── GuideSystem.ts  # 新手引导
│   ├── AI/
│   │   └── AIController.ts # AI控制器
│   ├── UI/
│   │   ├── CardView.ts     # 卡牌视图
│   │   ├── HandView.ts     # 手牌视图
│   │   ├── BattleFieldView.ts # 战场视图
│   │   ├── BattleUIView.ts  # 战斗UI
│   │   ├── BattleSceneController.ts # 场景控制器
│   │   ├── MainMenuView.ts  # 主菜单
│   │   ├── DeckManageView.ts # 卡组管理
│   │   ├── DifficultySelectView.ts # 难度选择
│   │   └── UIManager.ts     # UI管理
│   ├── Utils/
│   │   ├── ComboSystem.ts   # 连携系统
│   │   ├── AudioManager.ts  # 音频管理
│   │   ├── EffectManager.ts # 特效管理
│   │   ├── SceneNavigator.ts # 场景导航
│   │   └── ResourceLoader.ts # 资源加载
│   ├── Data/
│   │   ├── CardConfigs.ts   # 卡牌配置(50张)
│   │   └── SaveManager.ts   # 存档管理
│   └── Config/
│       └── GameConfig.ts   # 游戏配置
├── Scenes/                # 场景文件(需在编辑器中创建)
├── Prefabs/               # 预制体(需在编辑器中创建)
└── Resources/
    └── Sprites/           # 美术资源
        ├── Elements/      # 元素图标
        ├── Roles/         # 定位图标
        ├── UI/            # UI元素
        ├── Backgrounds/   # 背景图
        └── Cards/         # 卡牌图片
```

## 核心系统

### 战斗系统

**BattleManager** 负责管理整个战斗流程：
- 回合管理（抽牌、出牌、攻击、结束）
- 水晶和能量系统
- 胜负判定
- 技能触发

### 卡牌系统

**CardData** 包含卡牌的所有属性：
- 基础属性（名称、元素、定位、稀有度）
- 战斗属性（费用、攻击、生命）
- 养成属性（等级、突破、皮肤）
- 状态属性（护盾、休眠、攻击力降低）

### AI系统

**AIController** 实现5种难度的AI对战：
- 入门：随机出牌和攻击
- 简单：80%概率最优决策
- 普通：100%最优决策
- 困难：套牌强度1.2倍
- 大师：增加预判逻辑

### 属性相克

元素克制关系：
- 火 → 木（火焰灼烧）
- 木 → 水（扎根吸水）
- 水 → 火（水能灭火）
- 光 ↔ 暗（光明与黑暗互斥）

克制时伤害1.5倍，被克时伤害0.67倍。

### 连携系统

同属性卡牌达到一定数量时激活连携效果：
- 3张：基础效果（攻击+10%或生命+10%等）
- 5张：升级效果（更高加成+特殊效果）

## 游戏配置

游戏配置位于 `assets/Scripts/Config/GameConfig.ts`：
- 初始生命值：20
- 初始水晶：3
- 套牌大小：12张
- 最高水晶：10
- 能量上限：10

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
    adventureProgress: ...;    // 冒险进度
    settings: ...;             // 游戏设置
}
```

## 后续工作

1. **美术资源**：替换占位符图片为真正的卡牌插图
2. **音效**：添加背景音乐和音效
3. **动画**：使用 Spine 创建战斗动画
4. **发布**：配置微信小程序发布参数

## 学习资源

- [Cocos Creator 3.x 官方文档](https://docs.cocos.com/creator3.x/manual/)
- [TypeScript 官方文档](https://www.typescriptlang.org/docs/)

## 许可证

本项目仅供学习交流使用。
