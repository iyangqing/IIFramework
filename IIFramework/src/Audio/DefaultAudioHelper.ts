namespace numas {
    class aef implements IReference {
        id: number = null;
        clip: cc.AudioClip = null;
        Reset(): void {
            this.id = null;
            if(this.clip !== null) {
                this.clip.decRef();
                this.clip = null;
            }
        }

        public static Borrow(id: number, audioClip: cc.AudioClip): aef {
            let ret = ReferencePool.Borrow(aef);
            ret.id = id;
            ret.clip = audioClip;
            audioClip.addRef();
            return ret;
        }
        
        public Return(): void { ReferencePool.Return(aef, this); }
    }
    export class DefaultAudioHelper extends cc.EventTarget implements IAudioHelper {
        private _effectQueue: Queue<aef> = AnyQueue.Borrow();
        PlayEffect(audioClip: cc.AudioClip): void {
            let id = cc.audioEngine.playEffect(audioClip, false);
            cc.audioEngine.setVolume(id, this.GetEffectVolume());
            this._effectQueue.Enqueue(aef.Borrow(id, audioClip))
            this._effectQueue.Remove(ef => cc.audioEngine.getState(ef.id) == -1, ef=>ef.Return());
        }

        GetEffectVolume(): number { return cc.audioEngine.getEffectsVolume() }
        
        SetEffectVolume(vol: number): void { if(vol >= 0.0 && vol <= 1.0){ cc.audioEngine.setEffectsVolume(vol); } }

        StopAllEffect() {
            cc.audioEngine.stopAllEffects();
            this._effectQueue.RemoveAll(ef=>ef.Return());
        }


        private m_CurMusicId: number = -1;
        private m_MusicClip: cc.AudioClip = null;
        PlayMusic(musicClip: cc.AudioClip, loop: boolean): void {
            if(this.m_MusicClip == musicClip) {
                return;
            }
            musicClip.addRef();
            if(this.m_CurMusicId >= 0) {
                this.StopMusic();
            }
            this.m_MusicClip = musicClip
            this.m_CurMusicId = cc.audioEngine.playMusic(musicClip, loop);
            cc.audioEngine.setVolume(this.m_CurMusicId, this.GetMusicVolume())
        }
        IsMusicPlaying(): boolean { return this.m_CurMusicId >= 0; }
        PauseMusic(): void { cc.audioEngine.pauseMusic(); }
        ResumeMusic(): void { cc.audioEngine.resumeMusic(); }
        StopMusic(): void {
            if(this.m_CurMusicId >= 0){
                cc.audioEngine.stop(this.m_CurMusicId);
                this.m_MusicClip.decRef();
                this.m_MusicClip = null;
                this.m_CurMusicId = -1;
            }
        }
        GetMusicVolume() { return cc.audioEngine.getMusicVolume() }
        SetMusicVolume(vol: number) { if(vol >= 0.0 && vol <= 1.0){ cc.audioEngine.setMusicVolume(vol); } }
    }
}
