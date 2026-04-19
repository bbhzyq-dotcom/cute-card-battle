/**
 * 模块导出 - 导出所有核心模块
 */

// 核心类型和枚举
export * from './Core/Types';

// 核心数据类
export * from './Core/CardData';
export * from './Core/PlayerState';
export * from './Core/BattleManager';
export * from './Core/Game';
export * from './Core/LeagueSystem';
export * from './Core/AdventureSystem';
export * from './Core/CardEnhancementSystem';
export * from './Core/GuideSystem';

// 技能数据
export * from './Core/SkillData';

// 配置
export * from './Config/GameConfig';

// 卡牌配置
export * from './Data/CardConfigs';

// 数据管理
export * from './Data/SaveManager';

// 工具类
export * from './Utils/ComboSystem';
export * from './Utils/AudioManager';
export * from './Utils/EffectManager';
export * from './Utils/SceneNavigator';
export * from './Utils/ResourceLoader';

// 配置
export * from './Config/ProjectResources';

// AI
export * from './AI/AIController';

// UI
export * from './UI/UIManager';
export * from './UI/CardView';
export * from './UI/HandView';
export * from './UI/BattleFieldView';
export * from './UI/BattleUIView';
export * from './UI/MainMenuView';
export * from './UI/DeckManageView';
export * from './UI/DifficultySelectView';
export * from './UI/BattleSceneController';
