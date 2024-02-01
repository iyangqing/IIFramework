/// <reference path="../../Res/BaseComp.ts" />
namespace numas {
    export abstract class SDKBase extends BaseComp {
        private _isInit: boolean = false;        
        protected sdkCfg: TSDKCfg = null;
        
        Init(cfg: TSDKCfg): any {
            if(this._isInit) {
                throw new Error("SDKBase >> 重复的初始化！");
            }
            this.sdkCfg = cfg;
            this.OnInit(cfg);
            return this;
        }
        protected abstract OnInit(cfg: TSDKCfg): void;
    }
}
