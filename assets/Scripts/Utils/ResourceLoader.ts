/**
 * 资源加载管理器 - 负责加载和管理游戏资源
 * 
 * 使用说明：
 * 1. 将美术资源放入对应目录
 * 2. 在编辑器中创建对应UUID的config配置
 * 3. 调用 ResourceLoader.load() 加载资源
 */

import { SpriteFrame, AudioClip, Prefab } from 'cc';

/** 资源路径配置 */
export interface ResourcePathConfig {
    /** 预制体路径 */
    prefabs: {
        cardPrefab: string;
        monsterPrefab: string;
        handCardPrefab: string;
        uiButton: string;
        battleCell: string;
        tipPanel: string;
        cardDetailPanel: string;
        rewardPanel: string;
    };
    
    /** 图片路径 */
    sprites: {
        ui: string;
        elements: string;
        roles: string;
        cards: string;
        badges: string;
        backgrounds: string;
        cardBack: string;
    };
    
    /** 音频路径 */
    audio: {
        bgm: string;
        sfx: string;
    };
    
    /** 动画路径 */
    animations: {
        spine: string;
        effects: string;
    };
}

/** 默认资源路径配置 */
export const DEFAULT_RESOURCE_PATHS: ResourcePathConfig = {
    prefabs: {
        cardPrefab: 'Prefab/CardPrefab',
        monsterPrefab: 'Prefab/MonsterPrefab',
        handCardPrefab: 'Prefab/HandCardPrefab',
        uiButton: 'Prefab/UIButton',
        battleCell: 'Prefab/BattleCell',
        tipPanel: 'Prefab/TipPanel',
        cardDetailPanel: 'Prefab/CardDetailPanel',
        rewardPanel: 'Prefab/RewardPanel'
    },
    sprites: {
        ui: 'Sprites/UI',
        elements: 'Sprites/Elements',
        roles: 'Sprites/Roles',
        cards: 'Sprites/Cards',
        badges: 'Sprites/Badges',
        backgrounds: 'Sprites/Backgrounds',
        cardBack: 'Sprites/card_back'
    },
    audio: {
        bgm: 'Audio/BGM',
        sfx: 'Audio/SFX'
    },
    animations: {
        spine: 'Animations/Spine',
        effects: 'Animations/Effects'
    }
};

/** 资源加载器 */
export class ResourceLoader {
    /** 单例实例 */
    private static instance: ResourceLoader;
    
    /** 资源路径配置 */
    private paths: ResourcePathConfig;
    
    /** 加载中的资源 */
    private loadingCount: number = 0;
    
    /** 构造函数 */
    private constructor() {
        this.paths = DEFAULT_RESOURCE_PATHS;
    }
    
    /** 获取单例 */
    public static getInstance(): ResourceLoader {
        if (!ResourceLoader.instance) {
            ResourceLoader.instance = new ResourceLoader();
        }
        return ResourceLoader.instance;
    }
    
    /** 设置资源路径配置 */
    public setPaths(paths: ResourcePathConfig): void {
        this.paths = paths;
    }
    
    /** 加载预制体 */
    public async loadPrefab(name: keyof ResourcePathConfig['prefabs']): Promise<Prefab | null> {
        const path = this.paths.prefabs[name];
        if (!path) {
            console.warn(`预制体路径未配置: ${name}`);
            return null;
        }
        
        this.loadingCount++;
        
        try {
            const prefab = await new Promise<Prefab>((resolve, reject) => {
                // @ts-ignore - Cocos Creator资源加载
                cc.resources.load(path, Prefab, (err: Error, asset: Prefab) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(asset);
                    }
                });
            });
            
            this.loadingCount--;
            return prefab;
        } catch (error) {
            this.loadingCount--;
            console.error(`加载预制体失败: ${path}`, error);
            return null;
        }
    }
    
    /** 加载图片 */
    public async loadSprite(name: string, category: keyof ResourcePathConfig['sprites']): Promise<SpriteFrame | null> {
        const basePath = this.paths.sprites[category];
        if (!basePath) {
            console.warn(`图片路径未配置: ${category}`);
            return null;
        }
        
        const path = `${basePath}/${name}`;
        this.loadingCount++;
        
        try {
            const sprite = await new Promise<SpriteFrame>((resolve, reject) => {
                // @ts-ignore
                cc.resources.load(path, SpriteFrame, (err: Error, asset: SpriteFrame) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(asset);
                    }
                });
            });
            
            this.loadingCount--;
            return sprite;
        } catch (error) {
            this.loadingCount--;
            console.error(`加载图片失败: ${path}`, error);
            return null;
        }
    }
    
    /** 批量加载卡牌图片 */
    public async loadCardSprites(cardIds: string[]): Promise<Map<string, SpriteFrame>> {
        const results = new Map<string, SpriteFrame>();
        
        const promises = cardIds.map(async (cardId) => {
            const sprite = await this.loadSprite(cardId, 'cards');
            if (sprite) {
                results.set(cardId, sprite);
            }
        });
        
        await Promise.all(promises);
        return results;
    }
    
    /** 加载音频 */
    public async loadAudio(name: string, isBGM: boolean = false): Promise<AudioClip | null> {
        const basePath = isBGM ? this.paths.audio.bgm : this.paths.audio.sfx;
        const path = `${basePath}/${name}`;
        
        this.loadingCount++;
        
        try {
            const audio = await new Promise<AudioClip>((resolve, reject) => {
                // @ts-ignore
                cc.resources.load(path, AudioClip, (err: Error, asset: AudioClip) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(asset);
                    }
                });
            });
            
            this.loadingCount--;
            return audio;
        } catch (error) {
            this.loadingCount--;
            console.error(`加载音频失败: ${path}`, error);
            return null;
        }
    }
    
    /** 加载背景音乐 */
    public async loadBGM(name: string): Promise<AudioClip | null> {
        return this.loadAudio(name, true);
    }
    
    /** 加载音效 */
    public async loadSFX(name: string): Promise<AudioClip | null> {
        return this.loadAudio(name, false);
    }
    
    /** 检查是否正在加载 */
    public isLoading(): boolean {
        return this.loadingCount > 0;
    }
    
    /** 获取加载中的资源数量 */
    public getLoadingCount(): number {
        return this.loadingCount;
    }
    
    /** 预加载常用资源 */
    public async preloadEssentialResources(): Promise<void> {
        console.log('开始预加载核心资源...');
        
        // 预加载预制体
        const prefabNames: (keyof ResourcePathConfig['prefabs'])[] = [
            'cardPrefab',
            'monsterPrefab',
            'handCardPrefab',
            'battleCell',
            'tipPanel'
        ];
        
        for (const name of prefabNames) {
            await this.loadPrefab(name);
        }
        
        console.log('核心资源预加载完成');
    }
    
    /** 预加载卡牌资源 */
    public async preloadCardResources(cardIds: string[]): Promise<void> {
        console.log(`开始预加载 ${cardIds.length} 张卡牌资源...`);
        
        await this.loadCardSprites(cardIds);
        
        console.log('卡牌资源预加载完成');
    }
}

/** 便捷访问函数 */
export function getResourceLoader(): ResourceLoader {
    return ResourceLoader.getInstance();
}
