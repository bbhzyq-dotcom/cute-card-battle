# Cocos Creator 项目资源配置清单

## 项目信息

- **项目名称**：萌系卡牌对战
- **引擎版本**：Cocos Creator 3.x
- **目标平台**：微信小程序 / H5

---

## 一、场景文件（5个）

| 场景名称 | 文件名 | 描述 | 节点结构 |
|---------|--------|------|---------|
| MainMenuScene | MainMenu.fire | 主菜单场景 | Canvas > Background > Logo > MenuButtons > PlayerInfo |
| BattleScene | Battle.fire | 战斗场景 | Canvas > PlayerInfo > EnemyInfo > Field > Hand > UIButtons |
| DeckManageScene | DeckManage.fire | 套牌管理场景 | Canvas > DeckList > CardList > CurrentDeck > Buttons |
| DifficultySelectScene | DifficultySelect.fire | 难度选择场景 | Canvas > Title > DifficultyOptions > BackButton |
| LeagueScene | League.fire | 天梯场景 | Canvas > RankInfo > SeasonInfo > MatchButton > BackButton |

---

## 二、预制体文件（8个）

### 2.1 CardPrefab（卡牌预制体）

**文件路径**：`assets/Prefabs/CardPrefab.prefab`

**节点结构**：
```
CardPrefab (150 x 200)
├── CardFrame (Sprite, Sliced)
├── CardImage (Sprite)
├── NameLabel (Label)
├── CostLabel (Label, TopLeft)
├── AttackLabel (Label, BottomLeft)
├── HealthLabel (Label, BottomRight)
├── ElementIcon (Sprite)
├── RoleIcon (Sprite)
├── SelectedIndicator (Node, Hidden)
├── DisabledOverlay (Node, Hidden)
├── AttackIndicator (Node, Hidden)
└── CanAttackIndicator (Node, Hidden)
```

**属性说明**：
| 节点 | 类型 | 说明 |
|------|------|------|
| CardFrame | Sprite | 卡牌边框，根据稀有度变色（白/蓝/紫/金） |
| CardImage | Sprite | 卡牌立绘，150x150 |
| NameLabel | Label | 卡牌名称，字体大小18 |
| CostLabel | Label | 水晶费用，圆形背景，字体大小24 |
| AttackLabel | Label | 攻击力，白色图标+数字 |
| HealthLabel | Label | 生命值，红色图标+数字 |
| ElementIcon | Sprite | 元素图标（36x36） |
| RoleIcon | Sprite | 定位图标（36x36） |

---

### 2.2 MonsterPrefab（战场怪物预制体）

**文件路径**：`assets/Prefabs/MonsterPrefab.prefab`

**节点结构**：
```
MonsterPrefab (80 x 100)
├── CardFrame (Sprite, Sliced)
├── CardImage (Sprite)
├── NameLabel (Label, Hidden)
├── AttackLabel (Label, TopLeft)
├── HealthLabel (Label, TopRight)
├── ShieldLabel (Label, Bottom, Optional)
├── SleepIndicator (Node, Hidden)
└── HighlightEffect (Node, Hidden)
```

**属性说明**：
| 节点 | 类型 | 说明 |
|------|------|------|
| CardFrame | Sprite | 怪物边框，比卡牌小 |
| CardImage | Sprite | 怪物立绘，80x80 |
| AttackLabel | Label | 攻击力，白色，16号 |
| HealthLabel | Label | 生命值，红色，16号 |
| ShieldLabel | Label | 护盾值，蓝色，14号 |

---

### 2.3 UIButtonPrefab（按钮预制体）

**文件路径**：`assets/Prefabs/UIButton.prefab`

**节点结构**：
```
UIButton (200 x 60)
├── Background (Sprite, Sliced)
├── Label (Label, Center)
└── Icon (Sprite, Optional)
```

---

### 2.4 HandCardPrefab（手牌预制体）

**文件路径**：`assets/Prefabs/HandCard.prefab`

**节点结构**：
```
HandCard (100 x 140)
├── CardFrame (Sprite, Sliced)
├── CardImage (Sprite)
├── CostLabel (Label)
├── AttackLabel (Label)
├── HealthLabel (Label)
└── ElementIcon (Sprite)
```

---

### 2.5 BattleCellPrefab（战场格子预制体）

**文件路径**：`assets/Prefabs/BattleCell.prefab`

**节点结构**：
```
BattleCell (80 x 80)
├── Background (Sprite, Sliced, Transparent)
├── HighlightEffect (Node, Hidden)
└── DropZone (Node)
```

---

### 2.6 TipPanelPrefab（提示面板预制体）

**文件路径**：`assets/Prefabs/TipPanel.prefab`

**节点结构**：
```
TipPanel
├── Background (Sprite, Sliced)
├── TitleLabel (Label)
├── ContentLabel (Label)
└── Arrow (Sprite, Optional)
```

---

### 2.7 CardDetailPanelPrefab（卡牌详情面板预制体）

**文件路径**：`assets/Prefabs/CardDetailPanel.prefab`

**节点结构**：
```
CardDetailPanel (400 x 500)
├── Background (Sprite, Sliced)
├── CardImage (Sprite, Large)
├── NameLabel (Label)
├── ElementBadge (Sprite)
├── RoleBadge (Sprite)
├── RarityLabel (Label)
├── StatsPanel (Node)
│   ├── AttackValue (Label)
│   ├── HealthValue (Label)
│   └── CostValue (Label)
├── SkillPanel (Node)
│   ├── SkillName (Label)
│   └── SkillDesc (Label)
├── EnhancePanel (Node)
│   ├── LevelLabel (Label)
│   └── BreakthroughLabel (Label)
└── ButtonContainer (Node)
    └── EnhanceButton (Button)
```

---

### 2.8 RewardPanelPrefab（奖励面板预制体）

**文件路径**：`assets/Prefabs/RewardPanel.prefab`

**节点结构**：
```
RewardPanel
├── Background (Sprite, Sliced)
├── TitleLabel (Label)
├── ItemContainer (Node)
├── CoinsLabel (Label)
└── ConfirmButton (Button)
```

---

## 三、图片资源

### 3.1 UI资源

| 资源名 | 文件名 | 尺寸(px) | 格式 | 说明 |
|-------|--------|----------|------|------|
| btn_primary_n | btn_primary_n.png | 200x60 | PNG | 主按钮-正常 |
| btn_primary_p | btn_primary_p.png | 200x60 | PNG | 主按钮-按下 |
| btn_secondary_n | btn_secondary_n.png | 200x60 | PNG | 次按钮-正常 |
| panel_bg | panel_bg.png | 400x300 | PNG9 | 面板背景 |
| card_frame_normal | card_frame_normal.png | 150x200 | PNG9 | 普通卡框 |
| card_frame_rare | card_frame_rare.png | 150x200 | PNG9 | 稀有卡框 |
| card_frame_epic | card_frame_epic.png | 150x200 | PNG9 | 史诗卡框 |
| card_frame_legend | card_frame_legend.png | 150x200 | PNG9 | 传说卡框 |
| field_cell | field_cell.png | 80x80 | PNG9 | 战场格子 |
| hp_bar_bg | hp_bar_bg.png | 200x20 | PNG9 | 血条背景 |
| hp_bar_fill | hp_bar_fill.png | 200x20 | PNG9 | 血条填充 |
| mana_icon | mana_icon.png | 36x36 | PNG | 水晶图标 |
| energy_icon | energy_icon.png | 36x36 | PNG | 能量图标 |

### 3.2 元素图标（5个）

| 资源名 | 文件名 | 尺寸(px) | 格式 |
|-------|--------|----------|------|
| icon_fire | icon_fire.png | 36x36 | PNG |
| icon_wood | icon_wood.png | 36x36 | PNG |
| icon_water | icon_water.png | 36x36 | PNG |
| icon_light | icon_light.png | 36x36 | PNG |
| icon_shadow | icon_shadow.png | 36x36 | PNG |

### 3.3 定位图标（5个）

| 资源名 | 文件名 | 尺寸(px) | 格式 |
|-------|--------|----------|------|
| icon_assassin | icon_assassin.png | 36x36 | PNG |
| icon_mage | icon_mage.png | 36x36 | PNG |
| icon_warrior | icon_warrior.png | 36x36 | PNG |
| icon_tank | icon_tank.png | 36x36 | PNG |
| icon_support | icon_support.png | 36x36 | PNG |

### 3.4 段位图标（6个）

| 资源名 | 文件名 | 尺寸(px) | 格式 |
|-------|--------|----------|------|
| badge_bronze | badge_bronze.png | 64x64 | PNG |
| badge_silver | badge_silver.png | 64x64 | PNG |
| badge_gold | badge_gold.png | 64x64 | PNG |
| badge_platinum | badge_platinum.png | 64x64 | PNG |
| badge_diamond | badge_diamond.png | 64x64 | PNG |
| badge_master | badge_master.png | 64x64 | PNG |

### 3.5 卡牌立绘（50张）

**命名规范**：`card_{element}_{role}_{name}.png`

**尺寸**：150x150（卡牌上显示）、80x80（战场上显示）

**格式**：PNG透明背景

**示例**：
- card_fire_assassin_sparkfox.png
- card_fire_mage_flamefox.png
- card_wood_support_sprout.png
- ...共50张

### 3.6 卡牌背面

| 资源名 | 文件名 | 尺寸(px) | 格式 |
|-------|--------|----------|------|
| card_back | card_back.png | 150x200 | PNG |

### 3.7 背景图

| 资源名 | 文件名 | 尺寸(px) | 格式 | 说明 |
|-------|--------|----------|------|------|
| bg_main_menu | bg_main_menu.jpg | 1280x720 | JPG | 主菜单背景 |
| bg_battle | bg_battle.jpg | 1280x720 | JPG | 战斗背景 |
| bg_deck | bg_deck.jpg | 1280x720 | JPG | 套牌管理背景 |
| bg_league | bg_league.jpg | 1280x720 | JPG | 天梯背景 |

---

## 四、音频资源

### 4.1 背景音乐（3首）

| 资源名 | 文件名 | 时长 | 格式 | 说明 |
|-------|--------|------|------|------|
| bgm_main_menu | bgm_main_menu.mp3 | ~2:00 | MP3 | 主菜单BGM |
| bgm_battle | bgm_battle.mp3 | ~3:00 | MP3 | 战斗BGM |
| bgm_victory | bgm_victory.mp3 | ~0:30 | MP3 | 胜利BGM |

### 4.2 音效（按类型分类）

#### 出牌音效（5个，对应5种定位）
| 资源名 | 文件名 | 时长 | 说明 |
|-------|--------|------|------|
| sfx_play_assassin | sfx_play_assassin.mp3 | ~0.2s | 刺客出牌 |
| sfx_play_mage | sfx_play_mage.mp3 | ~0.3s | 法师出牌 |
| sfx_play_warrior | sfx_play_warrior.mp3 | ~0.2s | 战士出牌 |
| sfx_play_tank | sfx_play_tank.mp3 | ~0.3s | 坦克出牌 |
| sfx_play_support | sfx_play_support.mp3 | ~0.2s | 辅助出牌 |

#### 攻击音效
| 资源名 | 文件名 | 时长 | 说明 |
|-------|--------|------|------|
| sfx_attack_normal | sfx_attack_normal.mp3 | ~0.3s | 普通攻击 |
| sfx_attack_skill | sfx_attack_skill.mp3 | ~0.5s | 技能攻击 |

#### 受击/死亡音效
| 资源名 | 文件名 | 时长 | 说明 |
|-------|--------|------|------|
| sfx_damage | sfx_damage.mp3 | ~0.2s | 受击 |
| sfx_death | sfx_death.mp3 | ~0.5s | 死亡 |

#### UI音效
| 资源名 | 文件名 | 时长 | 说明 |
|-------|--------|------|------|
| sfx_button_click | sfx_button_click.mp3 | ~0.1s | 按钮点击 |
| sfx_draw_card | sfx_draw_card.mp3 | ~0.2s | 抽牌 |
| sfx_mana | sfx_mana.mp3 | ~0.3s | 水晶变化 |
| sfx_energy | sfx_energy.mp3 | ~0.4s | 能量变化 |

#### 胜利/失败音效
| 资源名 | 文件名 | 时长 | 说明 |
|-------|--------|------|------|
| sfx_victory | sfx_victory.mp3 | ~2.0s | 胜利 |
| sfx_defeat | sfx_defeat.mp3 | ~2.0s | 失败 |

#### 获得卡牌音效
| 资源名 | 文件名 | 时长 | 说明 |
|-------|--------|------|------|
| sfx_get_rare | sfx_get_rare.mp3 | ~1.0s | 获得稀有卡 |
| sfx_get_epic | sfx_get_epic.mp3 | ~1.5s | 获得史诗卡 |
| sfx_get_legend | sfx_get_legend.mp3 | ~2.0s | 获得传说卡 |

---

## 五、动画资源

### 5.1 卡牌动画（使用 Spine）

| 动画名 | 资源文件 | 说明 |
|-------|---------|------|
| card_entrance | card_entrance.json | 卡牌出场 |
| card_attack | card_attack.json | 卡牌攻击 |
| card_damage | card_damage.json | 卡牌受击 |
| card_death | card_death.json | 卡牌死亡 |
| card_idle | card_idle.json | 卡牌待机 |

### 5.2 元素特效

| 动画名 | 资源文件 | 说明 |
|-------|---------|------|
| effect_fire | effect_fire.json | 火属性特效 |
| effect_wood | effect_wood.json | 木属性特效 |
| effect_water | effect_water.json | 水属性特效 |
| effect_light | effect_light.json | 光属性特效 |
| effect_shadow | effect_shadow.json | 暗属性特效 |

### 5.3 UI动画

| 动画名 | 资源文件 | 说明 |
|-------|---------|------|
| panel_open | panel_open.json | 面板打开 |
| panel_close | panel_close.json | 面板关闭 |
| button_click | button_click.json | 按钮点击 |

---

## 六、资源文件结构

```
assets/
├── Scenes/
│   ├── MainMenu.fire
│   ├── Battle.fire
│   ├── DeckManage.fire
│   ├── DifficultySelect.fire
│   └── League.fire
├── Prefabs/
│   ├── CardPrefab.prefab
│   ├── MonsterPrefab.prefab
│   ├── HandCardPrefab.prefab
│   ├── UIButton.prefab
│   ├── BattleCell.prefab
│   ├── TipPanel.prefab
│   ├── CardDetailPanel.prefab
│   └── RewardPanel.prefab
├── Sprites/
│   ├── UI/
│   │   ├── btn_primary_n.png
│   │   ├── btn_primary_p.png
│   │   ├── panel_bg.png
│   │   └── ...
│   ├── Elements/
│   │   ├── icon_fire.png
│   │   ├── icon_wood.png
│   │   └── ...
│   ├── Roles/
│   │   ├── icon_assassin.png
│   │   └── ...
│   ├── Cards/
│   │   ├── card_fire_assassin_sparkfox.png
│   │   ├── card_fire_mage_flamefox.png
│   │   └── ... (共50张)
│   ├── Badges/
│   │   └── ... (段位图标6张)
│   └── Backgrounds/
│       ├── bg_main_menu.jpg
│       ├── bg_battle.jpg
│       └── ...
├── Audio/
│   ├── BGM/
│   │   ├── bgm_main_menu.mp3
│   │   ├── bgm_battle.mp3
│   │   └── bgm_victory.mp3
│   └── SFX/
│       ├── sfx_play_*.mp3
│       ├── sfx_attack_*.mp3
│       ├── sfx_damage.mp3
│       └── ...
├── Animations/
│   ├── Spine/
│   │   ├── card_entrance/
│   │   ├── card_attack/
│   │   └── ...
│   └── Effects/
│       ├── effect_fire/
│       └── ...
└── Resources/
    └── (游戏数据JSON等)
```

---

## 七、资源准备优先级

### P0（必须）
1. **UI基础资源**：按钮、面板、卡框
2. **50张卡牌立绘**：每张150x150 PNG透明
3. **背景图**：至少1张主菜单背景
4. **基础音效**：出牌、攻击、受击

### P1（重要）
1. **元素/定位图标**：10张36x36图标
2. **战斗BGM**
3. **胜利/失败音效
4. **卡牌背面图

### P2（优化）
1. **段位图标**：6张64x64
2. **更多音效
3. **动画特效
4. **多张背景图

---

## 八、注意事项

1. **命名规范**：所有文件使用英文小写+下划线格式
2. **尺寸**：建议导出比实际显示尺寸大2倍的图片，支持高清屏
3. **格式**：PNG图片必须带透明通道，JPG图片用于大背景
4. **压缩**：音频建议使用128kbps压缩，图片使用tinypng压缩
5. **Spine动画**：导出时选择JSON格式，配套的.atlas和.png需要一起提供

---

准备好这些资源后，告诉我资源存放的路径，我可以帮你完成资源加载和对接！
