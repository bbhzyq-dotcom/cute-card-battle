/**
 * 场景导航器 - 管理游戏场景切换
 */

/** 场景名称 */
export enum SceneName {
    MainMenu = 'MainMenu',
    Battle = 'Battle',
    DeckManage = 'DeckManage',
    DifficultySelect = 'DifficultySelect',
    Adventure = 'Adventure',
    League = 'League',
    Settings = 'Settings',
    CardDetail = 'CardDetail'
}

/** 场景导航器 */
export class SceneNavigator {
    /** 单例实例 */
    private static instance: SceneNavigator;
    
    /** 场景栈 */
    private sceneStack: SceneName[] = [];
    
    /** 当前场景 */
    private currentScene: SceneName | null = null;
    
    /** 加载回调 */
    private loadCallback: ((sceneName: SceneName) => void) | null = null;
    
    /** 构造函数 */
    private constructor() {}
    
    /** 获取单例 */
    public static getInstance(): SceneNavigator {
        if (!SceneNavigator.instance) {
            SceneNavigator.instance = new SceneNavigator();
        }
        return SceneNavigator.instance;
    }
    
    /** 初始化 */
    public init(): void {
        console.log('场景导航器初始化');
    }
    
    /** 加载场景 */
    public async loadScene(sceneName: SceneName): Promise<void> {
        console.log(`加载场景: ${sceneName}`);
        
        // 通知加载开始
        if (this.loadCallback) {
            this.loadCallback(sceneName);
        }
        
        // 实际场景加载需要Cocos Creator的场景管理
        // 这里使用模拟实现
        // cc.director.loadScene(sceneName);
        
        this.currentScene = sceneName;
        this.sceneStack.push(sceneName);
    }
    
    /** 压栈切换（带动画） */
    public async pushScene(sceneName: SceneName): Promise<void> {
        console.log(`压入场景: ${sceneName}`);
        // cc.director.pushScene(sceneName);
        this.sceneStack.push(sceneName);
        this.currentScene = sceneName;
    }
    
    /** 返回上一场景 */
    public async popScene(): Promise<void> {
        if (this.sceneStack.length <= 1) {
            console.warn('没有可返回的场景');
            return;
        }
        
        const current = this.sceneStack.pop();
        console.log(`弹出场景: ${current}`);
        
        const previous = this.sceneStack[this.sceneStack.length - 1];
        this.currentScene = previous;
        
        // cc.director.popScene();
        console.log(`返回场景: ${previous}`);
    }
    
    /** 返回到指定场景（清空栈） */
    public async popToScene(sceneName: SceneName): Promise<void> {
        const index = this.sceneStack.indexOf(sceneName);
        if (index === -1) {
            console.warn(`场景 ${sceneName} 不在栈中`);
            return;
        }
        
        this.sceneStack = this.sceneStack.slice(0, index + 1);
        this.currentScene = sceneName;
        
        // cc.director.popToScene(sceneName);
        console.log(`返回到场景: ${sceneName}`);
    }
    
    /** 返回主菜单 */
    public async goToMainMenu(): Promise<void> {
        this.sceneStack = [SceneName.MainMenu];
        this.currentScene = SceneName.MainMenu;
        // await this.loadScene(SceneName.MainMenu);
        console.log('返回主菜单');
    }
    
    /** 获取当前场景 */
    public getCurrentScene(): SceneName | null {
        return this.currentScene;
    }
    
    /** 获取场景栈 */
    public getSceneStack(): SceneName[] {
        return [...this.sceneStack];
    }
    
    /** 检查是否可以返回 */
    public canPop(): boolean {
        return this.sceneStack.length > 1;
    }
    
    /** 设置加载回调 */
    public onLoad(callback: (sceneName: SceneName) => void): void {
        this.loadCallback = callback;
    }
}
