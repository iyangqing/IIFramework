namespace numas {
    export interface IAudioHelper {        
        /**
         * 播放音效
         * @param audioClip 音效资源
         */
        PlayEffect(audioClip: cc.AudioClip): void;

        /**
         * 获取音效音量
         */
        GetEffectVolume(): number;

        /**
         * 设置音效音量
         * @param vol 音量 0-1 
         */
        SetEffectVolume(vol: number): void;

        /**
         * 停止所有音效
         */
        StopAllEffect(): void;

        /**
         * 播放音乐
         * @param audioClip 音乐资源
         */
        PlayMusic(audioClip: cc.AudioClip, loop: boolean): void;

        /**
         * 背景音乐是否处于播放状态
         */
        IsMusicPlaying(): boolean;

        /**
         * 暂停音乐
         */
        PauseMusic(): void;

        /**
         * 唤醒音乐
         */
        ResumeMusic(): void;

        /**
         * 停止当前音乐
         */
        StopMusic(): void;

        /**
         * 获取音乐音量
         */
        GetMusicVolume(): number;

        /**
         * 设置音乐音量
         * @param vol 音量 0-1 
         */
        SetMusicVolume(vol: number): void;
    }
}
