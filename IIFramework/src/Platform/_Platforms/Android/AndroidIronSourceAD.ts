/// <reference path="../../Base/ADBase.ts" />
namespace numas {
    const NMPROXYAD_CLASS_NAME: string = "org/cocos2dx/javascript/NMProxyAD";
    export class AndroidIronSource extends ADBase implements IAD {
        IsSupport(): boolean { return true; }
        protected InitByScriptImpl(): void {
            jsb.reflection.callStaticMethod(NMPROXYAD_CLASS_NAME, "initByScript", "()V")
        }
        protected OnInit(): void { }


        protected ShowBannerImpl(isShow: boolean): void {
            if(isShow) {
                jsb.reflection.callStaticMethod(NMPROXYAD_CLASS_NAME, "ShowBanner", "()V");
            }else{
                jsb.reflection.callStaticMethod(NMPROXYAD_CLASS_NAME, "HideBanner", "()V");
            }
        }
        private DestroyBanner() { jsb.reflection.callStaticMethod(NMPROXYAD_CLASS_NAME, "DestroyBanner", "()V"); }


        protected IsInterstitialAvailableImpl(): boolean { return jsb.reflection.callStaticMethod(NMPROXYAD_CLASS_NAME, "IsInterstitialAvailable", "()Z") }
        protected LoadInterstitialImpl(): void { jsb.reflection.callStaticMethod(NMPROXYAD_CLASS_NAME, "LoadInterstitial", "()V"); }
        protected ShowInterstitialImpl(handler: InterstitialCallback): void {
            jsb.reflection.callStaticMethod(NMPROXYAD_CLASS_NAME, "ShowInterstitial", "()V");
        }
        protected IsRewardedVideoAvailableImpl(): boolean {
            return jsb.reflection.callStaticMethod(NMPROXYAD_CLASS_NAME, "IsRewardedVideoAvailable", "()Z");
        }
        protected ShowRewardedVideoImpl(callback: (type: EInternalRewardedVideo, isRewared: boolean) => void): void {
            jsb.reflection.callStaticMethod(NMPROXYAD_CLASS_NAME, "ShowRewardedVideo", "()V");
        }
    }
}