# Cocos Creator 预制体结构说明

本文档详细说明每个预制体的节点结构，用于在 Cocos Creator 编辑器中创建预制体。

## 1. CardPrefab（卡牌预制体）

**文件路径**: `assets/Prefabs/CardPrefab.prefab`

### 节点结构

```
CardPrefab (Node, size: 150x200)
├── CardRoot (Node, size: 150x200, reference: cardRoot)
│   ├── CardFrame (Sprite, size: 150x200, sliced)
│   ├── CardImage (Sprite, size: 100x100, center)
│   ├── NameLabel (Label, fontSize: 16, y: -80)
│   ├── CostLabel (Label, fontSize: 24, position: -60, 75)
│   ├── AttackLabel (Label, fontSize: 20, position: -60, -75)
│   ├── HealthLabel (Label, fontSize: 20, position: 60, -75)
│   ├── ElementIcon (Sprite, size: 36x36, position: -55, 60)
│   ├── RoleIcon (Sprite, size: 36x36, position: 55, 60)
│   ├── SelectedIndicator (Node, Hidden, size: 160x210)
│   ├── DisabledOverlay (Node, Hidden, color: black 50% opacity)
│   ├── AttackIndicator (Node, Hidden)
│   └── CanAttackIndicator (Node, Hidden)
```

### 组件挂载

| 节点 | 组件 | 属性 |
|------|------|------|
| CardPrefab | cc.UITransform | contentSize: (150, 200) |
| CardRoot | cc.UITransform | contentSize: (150, 200) |
| CardRoot | cc.Sprite | type: SLICED |
| CardFrame | cc.Sprite | type: SLICED |
| CardImage | cc.Sprite | sizeMode: RAW |
| CardRoot | CardView | cardRoot: @self |

### 属性配置

- `CardView.cardRoot`: 拖拽 CardRoot 节点到属性框
- `CardView.cardFrame`: 拖拽 CardFrame 组件到属性框
- `CardView.cardImage`: 拖拽 CardImage 组件到属性框
- 其他 Label/Sprite 组件类似配置

## 2. HandCardPrefab（手牌预制体）

**文件路径**: `assets/Prefabs/HandCardPrefab.prefab`

### 节点结构

```
HandCardPrefab (Node)
├── HandRoot (Node)
│   ├── CardBackground (Sprite, SLICED)
│   ├── CardImage (Sprite)
│   ├── CostLabel (Label)
│   └── SelectedIndicator (Node)
```

## 3. MonsterPrefab（战场怪物预制体）

**文件路径**: `assets/Prefabs/MonsterPrefab.prefab`

### 节点结构

```
MonsterPrefab (Node, size: 80x100)
├── CardFrame (Sprite, size: 80x100, SLICED)
├── CardImage (Sprite, size: 60x60)
├── AttackLabel (Label, fontSize: 16, position: -25, 35)
├── HealthLabel (Label, fontSize: 16, position: 25, 35)
├── ShieldLabel (Label, fontSize: 14, position: 0, -40, Optional)
├── SleepIndicator (Node, Hidden)
└── HighlightEffect (Node, Hidden)
```

## 4. UIButton（按钮预制体）

**文件路径**: `assets/Prefabs/UIButton.prefab`

### 节点结构

```
UIButton (Node, size: 200x60)
├── Background (Sprite, SLICED, size: 200x60)
├── Label (Label, fontSize: 24, Center)
└── Icon (Sprite, Optional, size: 30x30)
```

### 组件挂载

| 节点 | 组件 |
|------|------|
| UIButton | cc.Button |
| Background | cc.Sprite (type: SLICED) |
| Label | cc.Label |
| Icon | cc.Sprite (Optional) |

## 5. BattleCell（战斗格子预制体）

**文件路径**: `assets/Prefabs/BattleCell.prefab`

### 节点结构

```
BattleCell (Node, size: 100x120)
├── CellBackground (Sprite, SLICED, opacity: 100)
├── HighlightEffect (Node, Hidden)
└── MonsterSlot (Node)
    └── [MonsterPrefab instance]
```

## 6. TipPanel（提示面板预制体）

**文件路径**: `assets/Prefabs/TipPanel.prefab`

### 节点结构

```
TipPanel (Node, size: 300x150)
├── Background (Sprite, SLICED)
├── TitleLabel (Label, fontSize: 20, y: 50)
├── ContentLabel (Label, fontSize: 16, y: 0)
└── ConfirmButton (Button, y: -50)
    ├── Background (Sprite)
    └── Label (Label, string: "确定")
```

## 7. CardDetailPanel（卡牌详情面板）

**文件路径**: `assets/Prefabs/CardDetailPanel.prefab`

### 节点结构

```
CardDetailPanel (Node, size: 400x500)
├── Background (Sprite, SLICED)
├── CloseButton (Button, position: 180, 230)
│   ├── Background (Sprite, size: 40x40)
│   └── Label (Label, string: "X")
├── CardImage (Sprite, size: 200x200, y: 100)
├── NameLabel (Label, fontSize: 28, y: -50)
├── ElementRoleLabel (Label, fontSize: 18, y: -85)
├── RarityLabel (Label, fontSize: 16, y: -115)
├── DescriptionLabel (Label, fontSize: 14, y: -160, multiLine)
├── StatsPanel (Node, y: -250)
│   ├── AttackValue (Label)
│   ├── HealthValue (Label)
│   ├── CostValue (Label)
└── EnhancementPanel (Node, y: -350)
    ├── LevelLabel (Label)
    └── BreakthroughLabel (Label)
```

## 8. RewardPanel（奖励面板）

**文件路径**: `assets/Prefabs/RewardPanel.prefab`

### 节点结构

```
RewardPanel (Node, size: 400x400)
├── Background (Sprite, SLICED)
├── TitleLabel (Label, string: "获得奖励", y: 160)
├── RewardsContainer (Node, y: 30)
│   ├── GoldReward (Node)
│   │   ├── Icon (Sprite)
│   │   └── AmountLabel (Label)
│   └── CardReward (Node, Optional)
│       ├── CardImage (Sprite)
│       └── AmountLabel (Label)
├── ConfirmButton (Button, y: -150)
│   ├── Background (Sprite, SLICED)
│   └── Label (Label, string: "确定")
```

## 创建预制体步骤

### 使用 Cocos Creator 3.x

1. 在 Cocos Creator 编辑器中创建空节点
2. 按节点结构添加子节点
3. 设置每个节点的属性（位置、尺寸、颜色等）
4. 将对应的脚本组件挂载到根节点
5. 在属性检查器中绑定节点引用
6. 将节点树拖拽到 `assets/Prefabs/` 目录生成预制体

### 注意事项

1. 所有尺寸和位置基于设计分辨率 960x640
2. 使用 SLICED 模式的 Sprite 以支持九宫格缩放
3. 节点命名必须与代码中的 `@property` 声明一致
4. 挂载 CardView、HandView 等组件时需要先创建脚本文件

## 资源关联

创建完预制体后，需要在 Cocos Creator 中关联资源：

1. 选择场景中的节点
2. 在属性检查器中找到 Sprite 组件
3. 将对应的图片资源拖拽到 spriteFrame 属性框
4. 资源路径参考 `RESOURCE_LIST.md`

## 测试

创建完预制体后，可以运行以下测试：

1. 主菜单场景测试：检查按钮点击事件
2. 战斗场景测试：检查卡牌拖拽、出牌、攻击
3. 卡组管理测试：检查卡牌列表显示、套牌编辑
