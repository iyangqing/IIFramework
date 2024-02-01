namespace numas {
    export class AudioMgr extends cc.Component {
        //#region  单例以及初始化
        // ! API 单例
        static ins: AudioMgr = null;

        /**
         * 组件生命周期之加载入口
         */
        protected onLoad() {
            if(CC_DEBUG) {
                console.info(">> AudioMgr::onLoad")
            }
            if(AudioMgr.ins === null) {
                AudioMgr.ins = this;
            }
            else {
                this.destroy();
            }
            this.m_ToPlayEffectQueue = AnyQueue.Borrow();

            this._effectOffBV = BooleanBV.BorrowAsLS("ls_effect_off", false, false);
            this._musicOffBV = BooleanBV.BorrowAsLS("ls_music_off", false, false).Bind(off=>{
                if(off) {
                    if(this.IsMusicPlaying()) { this.StopMusic(); }
                }else{
                    if(!this.IsMusicPlaying()) { this.playMusic(this.m_LastMusicKey); }
                }
            }, false, this);
        }
        //#endregion

        //#region 音频播放帮助类，对接底层音频引擎，主要是如何播放的实现
        private m_AudioHelper: IAudioHelper = null;
        /** // ! API 
         * 引擎帮助类：具体怎么播放，由引擎帮助类实现
         * @param helper 
         */
        
        SetHelper(helper: IAudioHelper): void {
            this.m_AudioHelper = helper;
        }
        /** // ! API 
         * 使用默认的音频播放帮助类
         */
        UseDefaultHelper(): void {
            this.SetHelper(new DefaultAudioHelper());
        }
        //#endregion

        //#region 解决瞬间播放过多音频的 BUG ：添加播放队列，利用调度在下一帧驱动执行
        private m_ToPlayEffectQueue: Queue<string> = null;
        private m_PlayEffectScheduler: Function = null;
        private AddPlayEffect(audioKey: string) {
            if(!this.m_ToPlayEffectQueue.Contains(k => k == audioKey)){
                this.m_ToPlayEffectQueue.Enqueue(audioKey);
                this.__i_StartScheduler();
            }
        }
        private ScheduleToPlayEffectQueue(): void {
            if(this.m_ToPlayEffectQueue.Count > 0) {
                this.m_ToPlayEffectQueue.RemoveAll(audioKey => this.PlayEffect_Impl(audioKey));
                this.__i_StopScheduler();
            }
        }
        private __i_StartScheduler(): void {
            if(this.m_PlayEffectScheduler === null) {
                this.m_PlayEffectScheduler = this.ScheduleToPlayEffectQueue.bind(this);
                this.schedule(this.m_PlayEffectScheduler, 0);
            }
        }
        private __i_StopScheduler(): void {
            if(this.m_PlayEffectScheduler !== null) {
                this.unschedule(this.m_PlayEffectScheduler);
                this.m_PlayEffectScheduler = null;
            }
        }
        //#endregion

        //#region **** Effect ****
        private DEFAULT_EFFECT: string = 'audio.default_effect'
        /**
         * 设置默认的音效关键字
         * @param audioKey 
         */
        SetDefaultEffect(audioKey:string): void {
            if(audioKey === null || audioKey === undefined || audioKey === "" ) {
                return;
            }
            this.DEFAULT_EFFECT = audioKey;
        }
        // ! API 音效是否关闭
        get effectOffBV(): BooleanBV { return this._effectOffBV; }
        private _effectOffBV: BooleanBV = null;

        /** // ! API 播放音效（这里并没有播放，整理到队列中）
         * @param audioKey 音效关键字
         */
        PlayEffect(audioKey?: string) {
            if(this._effectOffBV.v){ return; }
            if(!audioKey){
                audioKey = this.DEFAULT_EFFECT;
            }
            if(!audioKey){
                return;
            }
            if(!ResMgr.ins.HasRegister(audioKey)) {
                return;
            }
            this.AddPlayEffect(audioKey);
        }
        // ! API
        get effectVolume() { return this.m_AudioHelper.GetEffectVolume(); }
        // ! API
        set effectVolume(vol: number) { this.m_AudioHelper.SetEffectVolume(vol); }
        /**
         * 播放音效
         * @param audioKey 
         */
        private PlayEffect_Impl(audioKey: string): void {
            ResMgr.ins.Load<cc.AudioClip>(audioKey, (audioClip, resKey) => {
                this.m_AudioHelper.PlayEffect(audioClip)
            })
        }
        //#endregion


        //#region 音乐
        private _musicOffBV: BooleanBV = null;
        // ! API 音乐是否关闭
        get musicOffBV(): BooleanBV { return this._musicOffBV; }
        private m_LastMusicKey: string = null;
        playMusic(audioKey: string, loop: boolean = true) {
            if(!audioKey){ return; }
            this.m_LastMusicKey = audioKey;
            if(this._musicOffBV.v){
                return
            }
            ResMgr.ins.Load<cc.AudioClip>(audioKey, (audioClip, resKey) => {
                this.m_AudioHelper.PlayMusic(audioClip, loop)
            })
        }

        // ! API 背景音乐是否处于播放状态
        IsMusicPlaying(): boolean { return this.m_AudioHelper.IsMusicPlaying(); }
        PauseMusic(): void { this.m_AudioHelper.PauseMusic(); }
        ResumeMusic(): void { this.m_AudioHelper.ResumeMusic(); }
        StopMusic(): void { this.m_AudioHelper.StopMusic(); }
        get musicVolume() { return this.m_AudioHelper.GetMusicVolume(); }
        set musicVolume(vol: number) { this.m_AudioHelper.SetMusicVolume(vol); }
        //#endregion
    }
}
