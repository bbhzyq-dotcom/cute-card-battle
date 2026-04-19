/**
 * 音频管理器 - 管理游戏音效和背景音乐
 */

/** 音频类型 */
export enum AudioType {
    BGM = 'bgm',
    SFX = 'sfx'
}

/** 音频配置 */
interface AudioConfig {
    path: string;
    volume: number;
    loop: boolean;
}

/** 音频管理器 */
export class AudioManager {
    /** 单例实例 */
    private static instance: AudioManager;
    
    /** 背景音乐音量 */
    private bgmVolume: number = 0.8;
    
    /** 音效音量 */
    private sfxVolume: number = 0.8;
    
    /** 当前播放的BGM */
    private currentBGM: string = '';
    
    /** 是否静音 */
    private muted: boolean = false;
    
    /** 背景音乐组件 */
    // @ts-ignore
    private bgmSource: any = null;
    
    /** 音效组件 */
    // @ts-ignore
    private sfxSource: any = null;
    
    /** 构造函数 */
    private constructor() {}
    
    /** 获取单例 */
    public static getInstance(): AudioManager {
        if (!AudioManager.instance) {
            AudioManager.instance = new AudioManager();
        }
        return AudioManager.instance;
    }
    
    /** 初始化 */
    public init(): void {
        // 在 Cocos Creator 中初始化音频
        // this.bgmSource = this.node.addComponent(AudioSource);
        // this.sfxSource = this.node.addComponent(AudioSource);
        
        console.log('音频管理器初始化完成');
    }
    
    /** 播放背景音乐 */
    public playBGM(name: string, volume?: number): void {
        if (this.muted) return;
        
        const vol = volume !== undefined ? volume : this.bgmVolume;
        
        // 简化实现：仅记录当前BGM
        this.currentBGM = name;
        
        // 实际实现需要加载音频文件
        console.log(`播放BGM: ${name}, 音量: ${vol}`);
        
        // if (this.bgmSource) {
        //     this.bgmSource.clip = this.getAudioClip(name);
        //     this.bgmSource.volume = vol;
        //     this.bgmSource.loop = true;
        //     this.bgmSource.play();
        // }
    }
    
    /** 停止背景音乐 */
    public stopBGM(): void {
        // if (this.bgmSource) {
        //     this.bgmSource.stop();
        // }
        this.currentBGM = '';
    }
    
    /** 暂停背景音乐 */
    public pauseBGM(): void {
        // if (this.bgmSource) {
        //     this.bgmSource.pause();
        // }
    }
    
    /** 恢复背景音乐 */
    public resumeBGM(): void {
        // if (this.bgmSource) {
        //     this.bgmSource.resume();
        // }
    }
    
    /** 播放音效 */
    public playSFX(name: string, volume?: number): void {
        if (this.muted) return;
        
        const vol = volume !== undefined ? volume : this.sfxVolume;
        
        console.log(`播放音效: ${name}, 音量: ${vol}`);
        
        // 实际实现需要加载音频文件
        // if (this.sfxSource) {
        //     this.sfxSource.clip = this.getAudioClip(name);
        //     this.sfxSource.volume = vol;
        //     this.sfxSource.play();
        // }
    }
    
    /** 设置BGM音量 */
    public setBGMVolume(volume: number): void {
        this.bgmVolume = Math.max(0, Math.min(1, volume));
        // if (this.bgmSource) {
        //     this.bgmSource.volume = this.bgmVolume;
        // }
    }
    
    /** 设置音效音量 */
    public setSFXVolume(volume: number): void {
        this.sfxVolume = Math.max(0, Math.min(1, volume));
    }
    
    /** 获取BGM音量 */
    public getBGMVolume(): number {
        return this.bgmVolume;
    }
    
    /** 获取音效音量 */
    public getSFXVolume(): number {
        return this.sfxVolume;
    }
    
    /** 静音/取消静音 */
    public setMuted(muted: boolean): void {
        this.muted = muted;
        if (muted) {
            this.pauseBGM();
        } else if (this.currentBGM) {
            this.resumeBGM();
        }
    }
    
    /** 是否静音 */
    public isMuted(): boolean {
        return this.muted;
    }
    
    // ==================== 预设音效播放 ====================
    
    /** 播放卡牌出场音效 */
    public playCardPlaySound(): void {
        this.playSFX('card_play');
    }
    
    /** 播放攻击音效 */
    public playAttackSound(): void {
        this.playSFX('attack');
    }
    
    /** 播放受击音效 */
    public playDamageSound(): void {
        this.playSFX('damage');
    }
    
    /** 播放死亡音效 */
    public playDeathSound(): void {
        this.playSFX('death');
    }
    
    /** 播放水晶音效 */
    public playManaSound(): void {
        this.playSFX('mana');
    }
    
    /** 播放能量音效 */
    public playEnergySound(): void {
        this.playSFX('energy');
    }
    
    /** 播放胜利音效 */
    public playVictorySound(): void {
        this.playSFX('victory');
    }
    
    /** 播放失败音效 */
    public playDefeatSound(): void {
        this.playSFX('defeat');
    }
    
    /** 播放按钮点击音效 */
    public playButtonClickSound(): void {
        this.playSFX('button_click');
    }
    
    /** 播放抽牌音效 */
    public playDrawCardSound(): void {
        this.playSFX('draw_card');
    }
    
    /** 播放技能释放音效 */
    public playSkillSound(): void {
        this.playSFX('skill');
    }
    
    /** 播放稀有卡牌获得音效 */
    public playRareCardSound(): void {
        this.playSFX('rare_card');
    }
    
    /** 播放传说卡牌获得音效 */
    public playLegendCardSound(): void {
        this.playSFX('legend_card');
    }
}
