/// <reference path="../../Base/ADBase.ts" />
namespace numas {
    export class DefaultAD extends ADBase implements IAD {
        private _i_RewardedVideoAvailable: boolean = false;
        private __I_SetRewardedVideoAvailable(available:boolean) {
            this._i_RewardedVideoAvailable = available;
            this.RewardedVideoBV.v = available;
        }
        IsSupport(): boolean { return true; }
        protected OnInit(): void {
            
        }
        protected ShowBannerImpl(isShow: boolean): void {
            console.info(`DefaultAD >> ${isShow ? "显示横幅广告" : "隐藏横幅广告" }`)
        }
        protected IsInterstitialAvailableImpl(): boolean {
            return false;
        }
        protected LoadInterstitialImpl(): void {
            // do nothing
        }
        protected ShowInterstitialImpl(handler: InterstitialCallback): void {
            handler(EInterstitial.NOT_AVAILABLE);
        }
        protected IsRewardedVideoAvailableImpl(): boolean {
            return this._i_RewardedVideoAvailable;
        }
        protected ShowRewardedVideoImpl(callback: (type: EInternalRewardedVideo, isRewared: boolean) => void): void {
            if(this._i_RewardedVideoAvailable) {
                callback(EInternalRewardedVideo.SHOW, false);
                callback(EInternalRewardedVideo.REWARDED, true);
                callback(EInternalRewardedVideo.HIDE, true);
                this.__I_SetRewardedVideoAvailable(false);
                this.scheduleOnce(()=>{
                    this.__I_SetRewardedVideoAvailable(true);
                }, 2);
            }else{
                callback(EInternalRewardedVideo.NOT_AVAILABLE, false);
            }
        }

        protected InitByScriptImpl(): void {
            // 默认 3 秒后显示广告
            this.scheduleOnce(()=>{
                this.__I_SetRewardedVideoAvailable(true);
            }, 2);
        }
    }
}
