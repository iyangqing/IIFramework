/// <reference path="../../Base/ADBase.ts" />
namespace numas {
    export class WeChatAD extends ADBase implements IAD {
        IsSupport(): boolean {
            // 暂时未开通广告
            return false;
        }
        protected InitByScriptImpl(): void {
            console.warn("// WeChatAD >> InitByScriptImpl");
        }
        protected OnInit(cfg: TSDKCfg): void { }
        protected ShowBannerImpl(isShow: boolean): void {
            console.warn("// WeChatAD >> ShowBannerImpl");
        }
        protected IsInterstitialAvailableImpl(): boolean {
            console.warn("// WeChatAD >> IsInterstitialAvailableImpl");
            return false;
        }
        protected LoadInterstitialImpl(): void {
            console.warn("// WeChatAD >> LoadInterstitialImpl");
        }
        protected ShowInterstitialImpl(handler: InterstitialCallback): void {
            console.warn("// WeChatAD >> ShowInterstitialImpl");
            handler(EInterstitial.NOT_AVAILABLE);
        }
        protected IsRewardedVideoAvailableImpl(): boolean {
            console.warn("// WeChatAD >> IsRewardedVideoAvailableImpl");
            return false;
        }
        protected ShowRewardedVideoImpl(callback: (type: EInternalRewardedVideo, isRewared: boolean) => void): void {
            console.warn("// WeChatAD >> ShowRewardedVideoImpl");
            callback(EInternalRewardedVideo.NOT_AVAILABLE, false);
        }
    }
}
