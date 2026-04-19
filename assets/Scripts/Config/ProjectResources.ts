/**
 * Cocos Creator 项目配置
 * 
 * 本文件定义了项目所需的所有资源配置
 * 实际使用时需要在 Cocos Creator 编辑器中创建相应资源
 */

export interface ProjectResources {
    /** 场景配置 */
    scenes: SceneConfig[];
    
    /** 预制体配置 */
    prefabs: PrefabConfig[];
    
    /** 图片资源配置 */
    sprites: SpriteConfig[];
    
    /** 音频资源配置 */
    audio: AudioConfig[];
    
    /** 动画资源配置 */
    animations: AnimationConfig[];
}

export interface SceneConfig {
    name: string;
    fileName: string;
    description: string;
}

export interface PrefabConfig {
    name: string;
    fileName: string;
    description: string;
}

export interface SpriteConfig {
    name: string;
    fileName: string;
    description: string;
    width: number;
    height: number;
}

export interface AudioConfig {
    name: string;
    fileName: string;
    type: 'bgm' | 'sfx';
    duration: number;
}

export interface AnimationConfig {
    name: string;
    fileName: string;
    type: 'spine' | 'dragonbones' | 'frame';
}
