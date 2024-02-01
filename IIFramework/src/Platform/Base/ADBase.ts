/// <reference path="./SDKBase.ts" />
namespace numas {
    export abstract class ADBase extends SDKBase implements IAD {
        abstract IsSupport(): boolean;
        protected abstract InitByScriptImpl(): void;
        protected abstract ShowBannerImpl(isShow: boolean): void;
        protected abstract IsInterstitialAvailableImpl(): boolean;
        protected abstract LoadInterstitialImpl(): void;
        protected abstract ShowInterstitialImpl(handler: InterstitialCallback): void;
        protected abstract IsRewardedVideoAvailableImpl(): boolean;
        protected abstract ShowRewardedVideoImpl(callback: (type: EInternalRewardedVideo, isRewared: boolean) => void): void;
        
        readonly RewardedVideoBV: BooleanBV = BooleanBV.Borrow(false);
        readonly RemoveAdsSecondsBV: NumberBV = NumberBV.BorrowAsLS("ls_remove_ads_seconds", 0, true);
        //#region API
        private m_InitByScript: boolean = false;
        IsInitByScript(): boolean { return this.m_InitByScript; }
        InitByScript(): void {
            if(this.m_InitByScript) {
                return;
            }
            this.m_InitByScript = true;
            this.InitByScriptImpl();
            this.__i_StartADTick();
        }
        ShowBanner(isShow: boolean) {
            if(!this.m_InitByScript) {
                return;
            }
            if(this.IsAdRemoved()) {
                return;
            }
            this.ShowBannerImpl(isShow);
        }

        IsInterstitialAvailable(): boolean {
            if(!this.m_InitByScript) {
                return false;
            }
            return this.IsInterstitialAvailableImpl();
        }

        LoadInterstitial(): void {
            if(!this.m_InitByScript) {
                return;
            }
            this.LoadInterstitialImpl();
        }

        LoadInterstitialIfNotAvalable() {
            if(this.IsAdRemoved() || this.IsInterstitialAvailable()) {
                return;
            }
            this.LoadInterstitial();
        }

        ShowInterstitialWithBlocker(callback: Function, blockerPrefabKey: string, blockDuration: number): void {
            if(this.IsAdRemoved()) {
                Util.safeCall(callback);
                return;
            }
            if(this.IsInterstitialAvailable()) {
                UIMgr.ins.Open(blockerPrefabKey, {
                    duration: blockDuration,
                    cb: ()=>this.__ShowInterstitial(callback)
                });
            }else{
                this.LoadInterstitialIfNotAvalable();
                Util.safeCall(callback);
            }
        }

        ShowInterstitial(callback: Function) {
            if(this.IsAdRemoved()) {
                Util.safeCall(callback);
                return;
            }
            if(this.IsInterstitialAvailable()) {
                this.__ShowInterstitial(callback);
            }else{
                this.LoadInterstitialIfNotAvalable();
                Util.safeCall(callback);
            }
        }
        private __ShowInterstitial(cb: Function): void {
            let _onceCall = Util.onceCall(()=>{
                Util.safeCall(cb)
                this.LoadInterstitialIfNotAvalable()
            }, 1);
            this.ShowInterstitialImpl((typ: EInterstitial) => {
                switch (typ) {
                    case EInterstitial.NOT_AVAILABLE:
                    case EInterstitial.SHOW_ERROR:
                    case EInterstitial.HIDE:
                        _onceCall();
                        break;
                }
            });
        }


        IsRewardedVideoAvailable(): boolean {
            if(!this.m_InitByScript) {
                return false;
            }
            return this.IsRewardedVideoAvailableImpl();
        }

        ShowRewardedVideo(callback: ()=>void): void {
            if(this.IsRewardedVideoAvailable()) {
                let _onceCall = Util.onceCall(callback, 2);
                this.ShowRewardedVideoImpl((typ: EInternalRewardedVideo, isRewarded: boolean) => {
                    switch (typ) {
                        case EInternalRewardedVideo.REWARDED:
                        case EInternalRewardedVideo.HIDE:
                            if(isRewarded) {
                                _onceCall();
                            }
                            break;
                        default:
                            break;
                    }
                });
            }
        }

        private m_Tmp_IsReceivedRewardedEvent: boolean = false;
        private m_Tmp_IsReceivedHideEvent: boolean = false;
        ShowRewardedVideoEx(callback: RewardedVideoCallback): void {
            if(this.IsRewardedVideoAvailable()) {
                this.m_Tmp_IsReceivedRewardedEvent = false;
                this.m_Tmp_IsReceivedHideEvent = false;
                let _onceCallNotAvailable = Util.onceCall(()=>callback(ERewardedVideo.NOT_AVAILABLE, false), 1);
                let _onceCallHide: Action<boolean> = Util.onceCallEx<boolean>(isRewarded => callback(ERewardedVideo.HIDE, isRewarded), 1);
                this.ShowRewardedVideoImpl((typ: EInternalRewardedVideo, isRewarded: boolean) => {
                    switch (typ) {
                        case EInternalRewardedVideo.NOT_AVAILABLE:
                        case EInternalRewardedVideo.SHOW_ERROR:
                            _onceCallNotAvailable();
                            break;
                        case EInternalRewardedVideo.SHOW:
                            callback(ERewardedVideo.SHOW, false);
                            break;
                        case EInternalRewardedVideo.HIDE:
                            if(this.m_Tmp_IsReceivedRewardedEvent) {
                                _onceCallHide(isRewarded);
                            }else{
                                this.m_Tmp_IsReceivedHideEvent = true;
                                if(isRewarded) {
                                    _onceCallHide(isRewarded);
                                }else{
                                    // 延迟调用
                                    this.scheduleOnce(()=>{
                                        _onceCallHide(isRewarded);
                                    }, 0.05);
                                }
                            }
                            break;
                        case EInternalRewardedVideo.REWARDED:
                            if(this.m_Tmp_IsReceivedHideEvent) {
                                _onceCallHide(isRewarded)
                            }else{
                                this.m_Tmp_IsReceivedRewardedEvent = true;
                            }
                            break;
                        default:
                            break;
                    }
                });
            }else{
                callback(ERewardedVideo.NOT_AVAILABLE, false);
            }
        }

        //! 在未来的一段时间内移除广告
        RemoveAdsForSeconds(seconds: number): void {
            if(!this.IsAdRemoved()) {
                this.ShowBanner(false);
            }
            this.RemoveAdsSecondsBV.v += seconds;
            this.__i_StartADTick();
        }
        private __i_StartADTick() {
            if(this.RemoveAdsSecondsBV.v > 0) {
                this.StartScheduler("__I_AD_TICK", this.__I_AD_TICK.bind(this), 1, cc.macro.REPEAT_FOREVER);
            }
        }
        private __I_AD_TICK() {
            this.RemoveAdsSecondsBV.v -= 1;
            if(this.RemoveAdsSecondsBV.v === 0) {
                this.StopScheduler("__I_AD_TICK");
            }
        }

        IsAdRemoved(): boolean {
            return this.RemoveAdsSecondsBV.v > 0;
        }
        //#endregion
    }
}
