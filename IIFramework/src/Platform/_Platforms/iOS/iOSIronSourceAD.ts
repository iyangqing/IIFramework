/// <reference path="../../Base/ADBase.ts" />
namespace numas {
    export class iOSIronSourceAD extends ADBase implements IAD {
        IsSupport(): boolean { return true; }
        private _init_by_script: boolean = false;

        // 初始化 SDK，这里通常是脚本端初始化原生端
        protected InitByScriptImpl(): void {
            if(!this._init_by_script) {
                this._init_by_script = true;
                iOSMsgBridge.ins.on('NMEventAD', jsonData=>this.iOSCallbackHandler(jsonData), this);
                jsb.reflection.callStaticMethod("NMProxyAD", "initByScript:", CfgUtil.k2v(this.sdkCfg.iOS.kvs, "IronSourceAppKey"))
            }
        }
        protected OnInit(): void {
            // Do nothing
        }
        protected ShowBannerImpl(isShow: boolean): void {
            if(isShow) {
                jsb.reflection.callStaticMethod("NMProxyAD", "ShowBanner");
            }else{
                jsb.reflection.callStaticMethod("NMProxyAD", "HideBanner");
            }
        }
        
        private DestroyBanner() { jsb.reflection.callStaticMethod("NMProxyAD", "DestroyBanner") }

        protected IsInterstitialAvailableImpl(): boolean {
            return jsb.reflection.callStaticMethod("NMProxyAD", "IsInterstitialAvailable");
        }
        protected LoadInterstitialImpl(): void {
            jsb.reflection.callStaticMethod("NMProxyAD", "LoadInterstitial");
        }
        protected ShowInterstitialImpl(handler: InterstitialCallback): void {
            this.m_ShowInterstitialCallback = handler;
            jsb.reflection.callStaticMethod("NMProxyAD", "ShowInterstitial");
        }
        protected IsRewardedVideoAvailableImpl(): boolean {
            return jsb.reflection.callStaticMethod("NMProxyAD", "IsRewardedVideoAvailable");
        }
        protected ShowRewardedVideoImpl(callback: (type: EInternalRewardedVideo, isRewared: boolean) => void): void {
            this.m_ShowRewardedVideoCallback = callback;
            iOSATT.ins.RequestTrackingAuthorization((auth: boolean)=>{
                UIMgr.ins.blockSeconds(0.05, ()=>{
                    jsb.reflection.callStaticMethod("NMProxyAD", "ShowRewardedVideo")
                })
            }, true);
        }
        //#endregion

        onDestroy() {
            iOSMsgBridge.ins.targetOff(this);
            super.onDestroy();
        }

        //#region //! ObjC 事件处理
        /*********************************************************************
         * Callback Handling
         *********************************************************************/
        private m_ShowInterstitialCallback: InterstitialCallback = null
        private m_ShowRewardedVideoCallback: (type: EInternalRewardedVideo, isRewared: boolean) => void = null
        private ShowInterstitialCallback(typ: EInterstitial) { if(this.m_ShowInterstitialCallback){ this.m_ShowInterstitialCallback(typ) } }
        private ShowRewardedVideoCallback(typ: EInternalRewardedVideo, isRewarded: boolean) { if(this.m_ShowRewardedVideoCallback){ this.m_ShowRewardedVideoCallback(typ, isRewarded) } }
        protected iOSCallbackHandler(jsonData: {type: string, event: string, rewarded?: boolean}){
            switch (jsonData.type) {
                case "RewardedVideo":
                    this.HandleRewardedVideo(jsonData)
                    break;
                case "Interstitial":
                    this.HandleInterstitial(jsonData)
                    break;
                case "Banner":
                    this.HandleBanner(jsonData)
                    break;
                default:
                    break;
            }
        }
        private HandleBanner(jsonData: {event: string}) {
            switch (jsonData.event) {
                case "CLICK":
                    break;
                default:
                    break;
            }
        }
        private HandleInterstitial(jsonData: {event: string}) {
            switch (jsonData.event) {
                case "LOADED":
                case "LOAD_ERROR":
                    break;
                case "SHOW":
                    this.ShowInterstitialCallback(EInterstitial.SHOW)
                    break;
                case "SHOW_ERROR":
                    this.ShowInterstitialCallback(EInterstitial.SHOW_ERROR)
                    break;
                case "CLICK":
                    this.ShowInterstitialCallback(EInterstitial.CLICK)
                    break;
                case "CLOSE":
                    this.ShowInterstitialCallback(EInterstitial.HIDE)
                    break;
                default:
                    this.ShowInterstitialCallback(EInterstitial.NOT_AVAILABLE)
                    break;
            }
        }
        private HandleRewardedVideo(jsonData: {event: string, rewarded?: boolean, available?: boolean}) {
            switch (jsonData.event) {
                case "AVAILABLE_STATUS_CHANGED":
                    this.RewardedVideoBV.v = jsonData.available;
                    break;
                case "SHOW":
                    this.ShowRewardedVideoCallback(EInternalRewardedVideo.SHOW, jsonData.rewarded)
                    break;
                case "SHOW_ERROR":
                    this.ShowRewardedVideoCallback(EInternalRewardedVideo.SHOW_ERROR, jsonData.rewarded)
                    break;
                case "REWARDED":
                    this.ShowRewardedVideoCallback(EInternalRewardedVideo.REWARDED, jsonData.rewarded)
                    break;
                case "CLOSE":
                    this.ShowRewardedVideoCallback(EInternalRewardedVideo.HIDE, jsonData.rewarded)
                    break;
                case "CLICK":
                    break;
                default:
                    this.ShowRewardedVideoCallback(EInternalRewardedVideo.NOT_AVAILABLE, jsonData.rewarded)
                    break;
            }
         }
        //#endregion
    }
}
